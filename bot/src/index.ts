import { Client, GatewayIntentBits } from "discord.js";
import express from "express";
import { handleGuildMemberAdd } from "./handlers/guildMemberAdd.js";
import { getServerConfig, storeResponse, supabase } from "./supabase.js";

// --- Discord Bot ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once("ready", () => {
  console.log(`🚪 Bouncer is online as ${client.user?.tag}`);
  console.log(`   Serving ${client.guilds.cache.size} servers`);
});

client.on("guildMemberAdd", async (member) => {
  try {
    await handleGuildMemberAdd(member);
  } catch (err) {
    console.error(
      `Error handling guildMemberAdd for ${member.user.tag} in ${member.guild.name}:`,
      err
    );
  }
});

// --- Express API ---
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_SECRET = process.env.API_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

// Simple auth middleware for API routes
function requireAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ") || auth.slice(7) !== API_SECRET) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

// Health check (public)
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    guilds: client.guilds.cache.size,
    botUser: client.user?.tag || "not connected",
  });
});

// GET /api/server-config/:guildId — bot config lookup
app.get("/api/server-config/:guildId", requireAuth, async (req, res) => {
  try {
    const config = await getServerConfig(req.params.guildId as string);
    if (!config) {
      res.status(404).json({ error: "Server not found or inactive" });
      return;
    }
    res.json(config);
  } catch (err) {
    console.error("Config lookup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/responses — store onboarding response
app.post("/api/responses", requireAuth, async (req, res) => {
  try {
    const { server_id, flow_id, discord_user_id, discord_username, answers } =
      req.body;

    if (!server_id || !flow_id || !discord_user_id || !answers) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    await storeResponse({
      server_id,
      flow_id,
      discord_user_id,
      discord_username: discord_username || "",
      answers,
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Response storage error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 API server listening on port ${PORT}`);
});

// --- Connect to Discord ---
const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
  throw new Error("Missing DISCORD_BOT_TOKEN environment variable");
}

client.login(token).catch((err) => {
  console.error("Failed to connect to Discord:", err);
  process.exit(1);
});
