import type { MoodTag, ReflectionEmotionalTag } from "../generated/prisma/client.js";
import { createChatCompletion, isAiConfigured } from "./client.js";
import { detectCrisisLanguage, formatCrisisSupportResponse } from "./crisis.js";
import { journalFeedbackFewShots, journalFeedbackSystemPrompt } from "./journalPrompt.js";

export type JournalFeedbackStatus = "ready" | "crisis" | "unavailable" | "failed";

export interface JournalFeedbackResult {
  status: JournalFeedbackStatus;
  responseText: string | null;
  model: string | null;
}

const moodLabels: Record<MoodTag, string> = {
  SAD: "Sad",
  ANXIOUS: "Anxious",
  FRUSTRATED: "Frustrated",
  LONELY: "Lonely",
  EXHAUSTED: "Exhausted",
  HOPEFUL: "Hopeful",
  OTHER: "Other",
};

const emotionalTagLabels: Record<ReflectionEmotionalTag, string> = {
  MISSED_EVENT: "Missed Event",
  PAIN_FLARE: "Pain Flare",
  SOCIAL_ISOLATION: "Social Isolation",
  IDENTITY_LOSS: "Identity Loss",
  FATIGUE: "Fatigue",
  RELATIONSHIP_STRUGGLE: "Relationship Struggle",
  ABANDONED_HOBBIES: "Abandoned Hobbies",
  OTHERS: "Others",
};

function formatReflectionPrompt(input: {
  bodyText: string;
  moodTags: MoodTag[];
  emotionalTags: ReflectionEmotionalTag[];
}) {
  const moods = input.moodTags.map((tag) => moodLabels[tag]).join(", ");
  const tags = input.emotionalTags.map((tag) => emotionalTagLabels[tag]).join(", ");
  const lines = ["Reflection:"];
  if (moods) {
    lines.push(`Moods: ${moods}`);
  }
  if (tags) {
    lines.push(`Tags: ${tags}`);
  }
  lines.push("", input.bodyText.trim());
  return lines.join("\n");
}

export async function generateJournalFeedback(input: {
  bodyText: string;
  moodTags: MoodTag[];
  emotionalTags: ReflectionEmotionalTag[];
}): Promise<JournalFeedbackResult> {
  if (detectCrisisLanguage(input.bodyText)) {
    return {
      status: "crisis",
      responseText: formatCrisisSupportResponse(),
      model: "crisis-support",
    };
  }

  const completion = await createChatCompletion({
    system: journalFeedbackSystemPrompt,
    messages: [
      ...journalFeedbackFewShots,
      {
        role: "user",
        content: formatReflectionPrompt(input),
      },
    ],
  });

  if (!completion) {
    return {
      status: isAiConfigured() ? "failed" : "unavailable",
      responseText: null,
      model: null,
    };
  }

  return {
    status: "ready",
    responseText: completion.text,
    model: completion.model,
  };
}
