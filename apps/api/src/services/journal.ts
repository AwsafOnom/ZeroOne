import { ZEROONE_CONFIG } from "@zeroone/shared";
import type { MilestoneStage, ReflectionEmotionalTag } from "../generated/prisma/client.js";
import { getPrisma } from "../db.js";

const journeyStageOrder: MilestoneStage[] = [
  "BEFORE_DIAGNOSIS",
  "DIAGNOSIS",
  "STRUGGLES",
  "TURNING_POINT",
  "IMPROVEMENT",
  "MAINTAINING",
];

const journeyStageLabels: Record<MilestoneStage, string> = {
  BEFORE_DIAGNOSIS: "Before Diagnosis",
  DIAGNOSIS: "Diagnosis",
  STRUGGLES: "Struggles",
  TURNING_POINT: "Turning Point",
  IMPROVEMENT: "Improvement",
  MAINTAINING: "Maintaining",
};

export function serializePeerStory(story: {
  id: string;
  anonymizedBody: string;
  emotionalTags: ReflectionEmotionalTag[];
}) {
  return {
    id: story.id,
    anonymizedBody: story.anonymizedBody,
    emotionalTags: story.emotionalTags,
  };
}

export async function matchPeerStories(emotionalTags: ReflectionEmotionalTag[]) {
  const prisma = getPrisma();
  const stories = await prisma.sharedStory.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      anonymizedBody: true,
      emotionalTags: true,
    },
  });

  const tagSet = new Set(emotionalTags);
  const scored = stories
    .map((story) => {
      const overlap = story.emotionalTags.filter((tag) => tagSet.has(tag)).length;
      return { story, overlap };
    })
    .sort((left, right) => {
      if (right.overlap !== left.overlap) {
        return right.overlap - left.overlap;
      }
      return left.story.id.localeCompare(right.story.id);
    });

  const limit = ZEROONE_CONFIG.peerStoriesPerReflection;
  const selected =
    scored.some((entry) => entry.overlap > 0)
      ? scored.filter((entry) => entry.overlap > 0).slice(0, limit)
      : scored.slice(0, limit);

  return selected.map((entry) => serializePeerStory(entry.story));
}

export async function getJourneyTimeline(userId: string) {
  const prisma = getPrisma();
  const milestones = await prisma.journeyMilestone.findMany({
    where: { userId },
    orderBy: { occurredAt: "asc" },
  });
  const milestoneByStage = new Map(milestones.map((milestone) => [milestone.stage, milestone]));

  let currentIndex = journeyStageOrder.findIndex((stage) => !milestoneByStage.has(stage));
  if (currentIndex === -1) {
    currentIndex = journeyStageOrder.length - 1;
  }

  return journeyStageOrder.map((stage, index) => {
    const milestone = milestoneByStage.get(stage);
    return {
      stage,
      label: journeyStageLabels[stage],
      occurredAt: milestone?.occurredAt.toISOString() ?? null,
      isComplete: Boolean(milestone),
      isCurrent: index === currentIndex,
    };
  });
}
