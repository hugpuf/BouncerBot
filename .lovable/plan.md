

## Current State

Your app has:
- **Landing page** (`/`) — fully built with hero, features, pricing, etc.
- **Onboarding wizard** (`/onboarding`) — placeholder only, but step components exist: `StepAddServer`, `StepPickTemplate`, `StepDataDestination`, `StepGoLive`
- **Dashboard** (`/dashboard`), **FlowBuilder** (`/flow-builder`), **Integrations** (`/integrations`), **Settings** (`/settings`) — all placeholder stubs
- **Supabase schema** — `servers`, `onboarding_flows`, `flow_questions`, `data_destinations`, `onboarding_responses` tables exist
- **No auth** — no login/signup, no user sessions, `servers.owner_id` exists but nothing enforces it
- **Bot** — working on Railway, reads config from Supabase, DMs new members

## Convention for User Account / Bot Setup Flow

The standard pattern for a Discord bot SaaS (like MEE6, Carl-bot, Wickbot) is:

```text
Landing Page
    ↓  "Get Started"
Login with Discord (OAuth2)
    ↓  auto-creates account, gets guild list
Setup Wizard (your existing 4 steps)
    1. Select server (from their actual Discord guilds)
    2. Pick template
    3. Configure data destination
    4. Go live
    ↓
Dashboard (per-server)
```

Key points:
- **Discord OAuth** is the standard — users don't create email/password accounts. They "Login with Discord" which gives you their identity AND their server list in one step.
- Supabase Auth supports Discord as an OAuth provider natively.
- After login, `StepAddServer` should show their real guilds (from the Discord API) instead of mock data.
- The `servers.owner_id` column maps to the Supabase `auth.users.id` from Discord OAuth.

## Plan: Build the Auth + Onboarding User Flow

### 1. Enable Discord OAuth in Supabase
- Configure Discord as an auth provider in your Supabase project (requires Discord app Client ID + Secret from your Discord Developer Portal)
- Add the Supabase callback URL to your Discord app's redirect URIs

### 2. Create Auth Pages
- **Login page** (`/login`) — single "Login with Discord" button that calls `supabase.auth.signInWithOAuth({ provider: 'discord' })`
- **Auth callback handler** — Supabase handles this automatically via redirect
- **Auth context/hook** — `useAuth()` hook to track session state, wrap protected routes

### 3. Add Route Protection
- Wrap `/dashboard`, `/onboarding`, `/flow-builder`, `/integrations`, `/settings` in a `<ProtectedRoute>` component
- Redirect unauthenticated users to `/login`
- After login, redirect to `/onboarding` (if no servers) or `/dashboard` (if servers exist)

### 4. Wire Up the Onboarding Wizard
- Build out the `/onboarding` page using the existing step components (`StepAddServer`, `StepPickTemplate`, `StepDataDestination`, `StepGoLive`) in a multi-step wizard
- Replace mock server data in `StepAddServer` with the user's real Discord guilds (fetched via Discord API using their OAuth token, or via a Supabase edge function)
- On completion, create `servers`, `onboarding_flows`, `flow_questions`, and `data_destinations` rows in Supabase tied to the authenticated user

### 5. Update Navbar
- Show "Login" / "Get Started" when logged out
- Show user avatar + "Dashboard" when logged in

---

## Bot Description

Here's a description for BouncerBot.gg (for the Discord bot bio or landing page):

> **Bouncer greets new members, collects the data you specify, and pipes it to your CRM, Sheets, or webhook. No more anonymous joins. Configure at bouncerbot.gg.**

---

## Technical Notes
- Discord OAuth scopes needed: `identify`, `guilds` (to list their servers)
- The bot's invite link uses `bot` + `applications.commands` scopes with permissions for Manage Nicknames, Manage Roles, Send Messages, Read Message History
- RLS policies on all tables should filter by `owner_id = auth.uid()`

