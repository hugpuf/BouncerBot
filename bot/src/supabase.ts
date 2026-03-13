import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export interface ServerConfig {
  server: {
    id: string;
    discord_guild_id: string;
    name: string;
    is_active: boolean;
  };
  flow: {
    id: string;
    welcome_message: string;
    success_message: string;
    nickname_format: string;
    template_name: string | null;
  } | null;
  questions: Array<{
    id: string;
    sort_order: number;
    type: string;
    text: string;
    required: boolean;
    skippable: boolean;
    options: Array<{ id: string; label: string; emoji?: string }>;
    branches: Array<{ triggerOptionId: string; targetQuestionId: string }>;
    validation: Record<string, unknown>;
  }>;
  destinations: Array<{
    id: string;
    type: string;
    config: Record<string, unknown>;
    is_active: boolean;
  }>;
}

export async function getServerConfig(
  guildId: string
): Promise<ServerConfig | null> {
  const { data, error } = await supabase.rpc("get_server_config", {
    p_guild_id: guildId,
  });

  if (error) {
    console.error(`Error fetching config for guild ${guildId}:`, error);
    return null;
  }

  return data as ServerConfig | null;
}

export async function storeResponse(params: {
  server_id: string;
  flow_id: string;
  discord_user_id: string;
  discord_username: string;
  answers: Record<string, string>;
}) {
  const { error } = await supabase.from("onboarding_responses").insert({
    ...params,
    completed_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error storing response:", error);
    throw error;
  }
}
