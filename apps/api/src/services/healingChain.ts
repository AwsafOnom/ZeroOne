import { ZEROONE_CONFIG } from "@zeroone/shared";
import type { SparkKind } from "../prisma.js";
import { getPrisma } from "../db.js";
import { getJourneyTimeline } from "./journal.js";

const sparkActionDescriptions: Record<SparkKind, string> = {
  ENCOURAGEMENT: "Give kind words",
  VOICE_SUPPORT: "Talk or listen",
  GUIDANCE: "Share perspective",
};

const sparkActionLabels: Record<SparkKind, string> = {
  ENCOURAGEMENT: "Encouragement",
  VOICE_SUPPORT: "Voice Support",
  GUIDANCE: "Guidance",
};

const personSelect = {
  id: true,
  name: true,
  avatarUrl: true,
  journeyStartDate: true,
  healingChainProfile: true,
  conditions: {
    where: { isPrimary: true },
    take: 1,
    include: { condition: { select: { id: true, name: true, slug: true } } },
  },
} as const;

function serializePerson(
  person: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
    journeyStartDate: Date | null;
    healingChainProfile: {
      bio: string | null;
      specialization: string | null;
      isAvailable: boolean;
      preferredCommunicationStyle: string | null;
    } | null;
    conditions: Array<{ condition: { id: string; name: string; slug: string } }>;
  },
) {
  const primaryCondition = person.conditions[0]?.condition ?? null;
  return {
    id: person.id,
    name: person.name,
    avatarUrl: person.avatarUrl,
    journeyStartDate: person.journeyStartDate?.toISOString() ?? null,
    primaryCondition,
    profile: person.healingChainProfile
      ? {
          bio: person.healingChainProfile.bio,
          specialization: person.healingChainProfile.specialization,
          isAvailable: person.healingChainProfile.isAvailable,
          preferredCommunicationStyle: person.healingChainProfile.preferredCommunicationStyle,
        }
      : null,
  };
}

function serializeSession(session: { id: string; startsAt: Date; status: string } | undefined) {
  if (!session) {
    return null;
  }
  return {
    id: session.id,
    startsAt: session.startsAt.toISOString(),
    status: session.status,
  };
}

export async function getHealingChainOverview(userId: string) {
  const prisma = getPrisma();
  const [links, sparkActions, platformConfig, receivedTotal, sentSparks, lantern, journeyStages] =
    await Promise.all([
      prisma.mentorshipLink.findMany({
        where: {
          OR: [{ mentorId: userId }, { menteeId: userId }],
          status: "ACTIVE",
        },
        include: {
          condition: { select: { id: true, name: true, slug: true } },
          mentor: { select: personSelect },
          mentee: { select: personSelect },
          sessions: {
            where: { status: "CONFIRMED", startsAt: { gte: new Date() } },
            orderBy: { startsAt: "asc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.sparkActionConfig.findMany({
        where: { isActive: true },
        orderBy: { points: "asc" },
      }),
      prisma.platformConfig.findUnique({ where: { id: "default" } }),
      prisma.spark.aggregate({
        where: { recipientId: userId },
        _sum: { points: true },
      }),
      prisma.spark.findMany({
        where: { senderId: userId },
        select: {
          recipientId: true,
          action: { select: { kind: true } },
        },
      }),
      prisma.lantern.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      getJourneyTimeline(userId),
    ]);

  const mentorLink = links.find((link) => link.menteeId === userId) ?? null;
  const menteeLink = links.find((link) => link.mentorId === userId) ?? null;

  const threshold =
    platformConfig?.sparkLanternThreshold ?? ZEROONE_CONFIG.lanternIgnitionThreshold;
  const receivedPoints = receivedTotal._sum.points ?? 0;

  const uniqueRecipients = new Set(sentSparks.map((spark) => spark.recipientId));
  const encouragementsSent = sentSparks.filter((spark) => spark.action.kind === "ENCOURAGEMENT").length;
  const voiceSessions = sentSparks.filter((spark) => spark.action.kind === "VOICE_SUPPORT").length;
  const guidanceShared = sentSparks.filter((spark) => spark.action.kind === "GUIDANCE").length;

  const connectionStatus =
    mentorLink && menteeLink ? "connected" : mentorLink || menteeLink ? "partial" : "unmatched";

  return {
    banner: "You Receive Hope. You Give Hope. Together, We Heal.",
    connectionStatus,
    mentor: mentorLink
      ? {
          linkId: mentorLink.id,
          status: mentorLink.status,
          condition: mentorLink.condition,
          person: serializePerson(mentorLink.mentor),
          upcomingSession: serializeSession(mentorLink.sessions[0]),
        }
      : null,
    mentee: menteeLink
      ? {
          linkId: menteeLink.id,
          status: menteeLink.status,
          condition: menteeLink.condition,
          person: serializePerson(menteeLink.mentee),
          upcomingSession: serializeSession(menteeLink.sessions[0]),
        }
      : null,
    links: links.map(({ mentor, mentee, sessions, ...link }) => ({
      ...link,
      mentor: serializePerson(mentor),
      mentee: serializePerson(mentee),
      upcomingSession: serializeSession(sessions[0]),
      sessions: undefined,
    })),
    sparkActions: sparkActions.map((action) => ({
      id: action.id,
      kind: action.kind,
      points: action.points,
      label: sparkActionLabels[action.kind],
      description: sparkActionDescriptions[action.kind],
    })),
    sparkProgress: {
      receivedPoints,
      threshold,
      remainingPoints: Math.max(0, threshold - receivedPoints),
      progressPercent: Math.min(100, Math.round((receivedPoints / threshold) * 100)),
      isIgnited: receivedPoints >= threshold,
    },
    healingImpact: {
      peopleSupported: uniqueRecipients.size,
      encouragementsSent,
      voiceSessions,
      guidanceShared,
    },
    lantern: lantern
      ? {
          id: lantern.id,
          cycleId: lantern.cycleId,
          emotionalGrowth: Number(lantern.emotionalGrowth),
          supportGiven: lantern.supportGiven,
          consistencyPercent: Number(lantern.consistencyPercent),
          compassionActsPercent: Number(lantern.compassionActsPercent),
          isForming: true,
        }
      : null,
    journeyStages,
  };
}
