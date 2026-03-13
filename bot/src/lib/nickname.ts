import { GuildMember } from "discord.js";

/**
 * Apply nickname format to a guild member.
 * Format tokens: {name}, {org}, {answer:questionId}
 */
export async function applyNickname(
  member: GuildMember,
  format: string,
  answers: Record<string, string>
): Promise<void> {
  if (!format) return;

  let nickname = format;

  // Replace {name} with their display name
  nickname = nickname.replace("{name}", member.displayName);

  // Replace {org} with first answer that looks like an org, or empty
  nickname = nickname.replace("{org}", answers["org"] || "");

  // Replace {answer:questionId} tokens
  const answerPattern = /\{answer:([^}]+)\}/g;
  nickname = nickname.replace(answerPattern, (_, questionId) => {
    return answers[questionId] || "";
  });

  // Discord nickname limit is 32 chars
  nickname = nickname.slice(0, 32).trim();

  if (!nickname) return;

  try {
    await member.setNickname(nickname);
  } catch (err) {
    console.error(
      `Failed to set nickname for ${member.user.tag} in ${member.guild.name}:`,
      err
    );
  }
}
