# Bouncer Bot — Railway Deployment

Multi-tenant Discord onboarding bot. Reads per-server configs from Supabase at runtime.

## Setup

1. Copy `.env.example` to `.env` and fill in credentials
2. `npm install`
3. `npm run dev` (local) or deploy to Railway

## Railway Deployment

1. Connect this repo to Railway
2. Set the root directory to `bot/`
3. Add environment variables:
   - `DISCORD_BOT_TOKEN` — from Discord Developer Portal
   - `SUPABASE_URL` — your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — from Supabase dashboard > Settings > API
4. Railway will auto-detect the Dockerfile and deploy

## Architecture

```
guildMemberAdd event
  → getServerConfig(guildId)     // Supabase RPC
  → runFlow(member, dm, config)  // DM question sequence
  → applyNickname(member, ...)   // Set server nickname
  → fireDestinations(...)        // Webhooks, Sheets, etc.
  → storeResponse(...)           // Save to onboarding_responses
```

## Health Check

`GET /health` returns bot status for Railway monitoring.
