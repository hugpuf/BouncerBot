import type { ServerConfig } from "../supabase.js";

/**
 * In-memory session store for active onboarding conversations.
 * Keyed by Discord user ID (unique across all servers).
 */
export interface OnboardingSession {
  guildId: string;
  serverId: string;
  flowId: string;
  config: ServerConfig;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  startedAt: number;
}

const sessions = new Map<string, OnboardingSession>();

// Auto-expire sessions after 30 minutes
const SESSION_TTL_MS = 30 * 60 * 1000;

export function getSession(userId: string): OnboardingSession | undefined {
  const session = sessions.get(userId);
  if (session && Date.now() - session.startedAt > SESSION_TTL_MS) {
    sessions.delete(userId);
    return undefined;
  }
  return session;
}

export function createSession(
  userId: string,
  guildId: string,
  config: ServerConfig
): OnboardingSession {
  const session: OnboardingSession = {
    guildId,
    serverId: config.server.id,
    flowId: config.flow!.id,
    config,
    currentQuestionIndex: 0,
    answers: {},
    startedAt: Date.now(),
  };
  sessions.set(userId, session);
  return session;
}

export function updateSession(
  userId: string,
  updates: Partial<OnboardingSession>
): void {
  const session = sessions.get(userId);
  if (session) {
    Object.assign(session, updates);
  }
}

export function deleteSession(userId: string): void {
  sessions.delete(userId);
}

export function hasActiveSession(userId: string): boolean {
  return getSession(userId) !== undefined;
}

export function getActiveSessionCount(): number {
  return sessions.size;
}

// Periodic cleanup of expired sessions
setInterval(() => {
  const now = Date.now();
  for (const [userId, session] of sessions) {
    if (now - session.startedAt > SESSION_TTL_MS) {
      sessions.delete(userId);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes
