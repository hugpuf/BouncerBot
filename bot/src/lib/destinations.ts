import type { ServerConfig } from "../supabase.js";

type Destination = ServerConfig["destinations"][number];

interface ResponsePayload {
  server_name: string;
  discord_guild_id: string;
  discord_user_id: string;
  discord_username: string;
  answers: Record<string, string>;
  completed_at: string;
}

const WEBHOOK_TIMEOUT_MS = 10_000; // 10 second timeout
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 2_000;

export async function fireDestinations(
  destinations: Destination[],
  payload: ResponsePayload
): Promise<void> {
  const promises = destinations.map((dest) =>
    fireOneWithRetry(dest, payload).catch((err) => {
      console.error(`Destination ${dest.id} (${dest.type}) failed after retries:`, err);
    })
  );

  // Don't let destination failures block the onboarding flow
  await Promise.allSettled(promises);
}

async function fireOneWithRetry(
  dest: Destination,
  payload: ResponsePayload,
  attempt = 1
): Promise<void> {
  try {
    await fireOne(dest, payload);
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      console.warn(
        `Destination ${dest.id} attempt ${attempt} failed, retrying in ${RETRY_DELAY_MS}ms...`
      );
      await sleep(RETRY_DELAY_MS * attempt); // exponential-ish backoff
      return fireOneWithRetry(dest, payload, attempt + 1);
    }
    throw err;
  }
}

async function fireOne(
  dest: Destination,
  payload: ResponsePayload
): Promise<void> {
  switch (dest.type) {
    case "webhook":
      await fireWebhook(dest.config as { url: string }, payload);
      break;
    case "sheets":
      console.log(
        `Google Sheets integration not yet implemented for dest ${dest.id}`
      );
      break;
    default:
      console.warn(`Unknown destination type: ${dest.type}`);
  }
}

async function fireWebhook(
  config: { url: string },
  payload: ResponsePayload
): Promise<void> {
  if (!config.url) {
    console.warn("Webhook destination has no URL configured");
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "no body");
      throw new Error(`Webhook failed [${response.status}]: ${body}`);
    }

    console.log(`✅ Webhook fired to ${config.url}`);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(
        `Webhook timed out after ${WEBHOOK_TIMEOUT_MS}ms: ${config.url}`
      );
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
