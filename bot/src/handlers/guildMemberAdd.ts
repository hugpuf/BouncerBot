import { GuildMember } from "discord.js";
import { getServerConfig, storeResponse } from "../supabase.js";
import { runFlow } from "../lib/flowRunner.js";
import { applyNickname } from "../lib/nickname.js";
import { fireDestinations } from "../lib/destinations.js";

export async function handleGuildMemberAdd(member: GuildMember): Promise<void> {
  // Ignore bots
  if (member.user.bot) return;

  const guildId = member.guild.id;
  console.log(
    `[${member.guild.name}] New member: ${member.user.tag} (guild: ${guildId})`
  );

  // 1. Look up server config
  const config = await getServerConfig(guildId);
  if (!config || !config.flow) {
    console.log(`No active flow for guild ${guildId}, skipping.`);
    return;
  }

  // 2. Open DM channel
  let dm;
  try {
    dm = await member.createDM();
  } catch (err) {
    console.error(`Cannot DM ${member.user.tag}:`, err);
    return;
  }

  // 3. Run the question flow
  const result = await runFlow(member, dm, config);

  if (!result.completed) {
    console.log(`Flow incomplete for ${member.user.tag} in ${member.guild.name}`);
    return;
  }

  // 4. Apply nickname
  if (config.flow.nickname_format) {
    await applyNickname(member, config.flow.nickname_format, result.answers);
  }

  // 5. Fire data destinations
  if (config.destinations.length > 0) {
    await fireDestinations(config.destinations, {
      server_name: config.server.name,
      discord_guild_id: guildId,
      discord_user_id: member.user.id,
      discord_username: member.user.tag,
      answers: result.answers,
      completed_at: new Date().toISOString(),
    });
  }

  // 6. Store response in database
  await storeResponse({
    server_id: config.server.id,
    flow_id: config.flow.id,
    discord_user_id: member.user.id,
    discord_username: member.user.tag,
    answers: result.answers,
  });

  // 7. Send success message
  await dm.send(config.flow.success_message);

  console.log(
    `✅ Onboarding complete for ${member.user.tag} in ${member.guild.name}`
  );
}
