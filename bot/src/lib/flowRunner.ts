import {
  DMChannel,
  GuildMember,
  Message,
  ComponentType,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import type { ServerConfig } from "../supabase.js";
import {
  createSession,
  deleteSession,
  getSession,
  hasActiveSession,
  updateSession,
} from "./sessions.js";

type Question = ServerConfig["questions"][number];

export interface FlowResult {
  answers: Record<string, string>;
  completed: boolean;
}

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes per question

export async function runFlow(
  member: GuildMember,
  dm: DMChannel,
  config: ServerConfig
): Promise<FlowResult> {
  const userId = member.user.id;

  // Prevent duplicate sessions
  if (hasActiveSession(userId)) {
    await dm.send(
      "You already have an onboarding in progress! Please finish or wait for it to expire."
    );
    return { answers: {}, completed: false };
  }

  const questions = config.questions;
  if (!questions.length) {
    return { answers: {}, completed: true };
  }

  // Create session
  const session = createSession(userId, member.guild.id, config);

  // Send welcome message
  await dm.send(config.flow!.welcome_message);

  try {
    while (session.currentQuestionIndex < questions.length) {
      const question = questions[session.currentQuestionIndex];
      const answer = await askQuestion(dm, question);

      if (answer === null) {
        if (question.required && !question.skippable) {
          await dm.send(
            "⏰ You took too long to respond. You can restart by rejoining the server."
          );
          deleteSession(userId);
          return { answers: session.answers, completed: false };
        }
        // Skip optional question
        session.currentQuestionIndex++;
        updateSession(userId, {
          currentQuestionIndex: session.currentQuestionIndex,
        });
        continue;
      }

      session.answers[question.id] = answer;
      updateSession(userId, { answers: session.answers });

      // Check for branching
      const nextIndex = resolveBranch(question, answer, questions);
      if (nextIndex !== null) {
        session.currentQuestionIndex = nextIndex;
      } else {
        session.currentQuestionIndex++;
      }
      updateSession(userId, {
        currentQuestionIndex: session.currentQuestionIndex,
      });
    }

    const result = { answers: session.answers, completed: true };
    deleteSession(userId);
    return result;
  } catch (err) {
    deleteSession(userId);
    throw err;
  }
}

async function askQuestion(
  dm: DMChannel,
  question: Question
): Promise<string | null> {
  if ((question.type === "select" || question.type === "multi_select") && question.options.length > 0) {
    return askSelectQuestion(dm, question);
  }

  const optionalTag = !question.required || question.skippable ? " _(optional)_" : "";
  const skipHint = question.skippable ? '\nType "skip" to skip.' : "";
  await dm.send(`**${question.text}**${optionalTag}${skipHint}`);

  try {
    const collected = await dm.awaitMessages({
      max: 1,
      time: TIMEOUT_MS,
      filter: (m: Message) => !m.author.bot,
    });

    const response = collected.first();
    if (!response) return null;

    const text = response.content.trim();
    if (question.skippable && text.toLowerCase() === "skip") return null;

    if (question.type === "email" && !text.includes("@")) {
      await dm.send("That doesn't look like a valid email. Please try again.");
      return askQuestion(dm, question);
    }

    if (question.type === "url" && !text.startsWith("http")) {
      await dm.send("That doesn't look like a valid URL. Please try again.");
      return askQuestion(dm, question);
    }

    return text;
  } catch {
    return null;
  }
}

async function askSelectQuestion(
  dm: DMChannel,
  question: Question
): Promise<string | null> {
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(`q_${question.id}`)
    .setPlaceholder("Select an option")
    .addOptions(
      question.options.map((opt) => ({
        label: opt.label,
        value: opt.id,
        emoji: opt.emoji || undefined,
      }))
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    selectMenu
  );

  await dm.send({
    content: `**${question.text}**`,
    components: [row],
  });

  try {
    const interaction = await dm.awaitMessageComponent({
      componentType: ComponentType.StringSelect,
      time: TIMEOUT_MS,
    });

    await interaction.deferUpdate();
    return interaction.values[0];
  } catch {
    return null;
  }
}

function resolveBranch(
  question: Question,
  answer: string,
  allQuestions: Question[]
): number | null {
  if (!question.branches || question.branches.length === 0) return null;

  const branch = question.branches.find((b) => b.triggerOptionId === answer);
  if (!branch) return null;

  const targetIndex = allQuestions.findIndex(
    (q) => q.id === branch.targetQuestionId
  );
  return targetIndex >= 0 ? targetIndex : null;
}
