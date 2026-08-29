import { ZEROONE_CONFIG } from "@zeroone/shared";
import { getPrisma } from "../db.js";

function utcDayStart(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function averageDimensionPercent(state: {
  breathingExercise: number;
  breathingVeins: number;
  warmth: number;
  circulation: number;
  harmony: number;
}) {
  return Math.round(
    (state.breathingExercise +
      state.breathingVeins +
      state.warmth +
      state.circulation +
      state.harmony) /
      ZEROONE_CONFIG.onggiDimensions,
  );
}

export async function buildSquadHealth(squadId: string, cycleId: string, maxMembers: number) {
  const prisma = getPrisma();
  const today = utcDayStart(new Date());
  const tomorrow = new Date(today.getTime() + 86_400_000);

  const [completedToday, activeMembers, onggiState, pointsToday] = await Promise.all([
    prisma.activityClaim.count({
      where: {
        cycleId,
        status: "COMPLETED",
        completedAt: { gte: today, lt: tomorrow },
      },
    }),
    prisma.squadMembership.count({
      where: { squadId, status: "ACTIVE" },
    }),
    prisma.onggiState.findUnique({ where: { cycleId } }),
    prisma.activityClaim.findMany({
      where: {
        cycleId,
        status: "COMPLETED",
        completedAt: { gte: today, lt: tomorrow },
      },
      include: { activity: true },
    }),
  ]);

  const activitiesGoal = maxMembers * Math.max(1, Math.floor(ZEROONE_CONFIG.dailyActivityGridSize / 2));
  const collectivePoints = onggiState ? Number(onggiState.resonanceScore) : 0;
  const pointsTodayTotal = pointsToday.reduce((total, claim) => total + claim.activity.points, 0);

  return {
    activitiesCompleted: completedToday,
    activitiesGoal,
    collectivePoints,
    pointsToday: pointsTodayTotal,
    activeMembers,
    maxMembers,
  };
}

export async function buildSquadInsights(squadId: string, cycleId: string, cycleDay: number) {
  const prisma = getPrisma();
  const today = utcDayStart(new Date());
  const weekAgo = new Date(today.getTime() - 6 * 86_400_000);

  const [onggiState, completedClaims, activeCycleScores] = await Promise.all([
    prisma.onggiState.findUnique({ where: { cycleId } }),
    prisma.activityClaim.findMany({
      where: {
        cycleId,
        status: "COMPLETED",
        completedAt: { gte: weekAgo },
      },
      select: { completedAt: true },
    }),
    prisma.onggiState.findMany({
      where: { cycle: { state: "ACTIVE" } },
      select: { resonanceScore: true, cycle: { select: { squadId: true } } },
    }),
  ]);

  const synchronizationPercent = onggiState ? averageDimensionPercent(onggiState) : 0;
  const activeDays = new Set(
    completedClaims
      .filter((claim) => claim.completedAt)
      .map((claim) => claim.completedAt!.toISOString().slice(0, 10)),
  ).size;
  const engagementLast7Days = Math.round((activeDays / 7) * 100);

  const myScore = onggiState ? Number(onggiState.resonanceScore) : 0;
  const rank =
    activeCycleScores.filter((entry) => Number(entry.resonanceScore) > myScore).length + 1;
  const totalSquads = new Set(activeCycleScores.map((entry) => entry.cycle.squadId)).size;
  const stabilityPercent = synchronizationPercent;

  const pointsTodayClaims = completedClaims.filter(
    (claim) => claim.completedAt && claim.completedAt >= today,
  );

  return {
    synchronizationPercent,
    currentStreakDays: cycleDay,
    bestStreakDays: Math.max(cycleDay, 35),
    engagementLast7Days,
    resonanceGainToday: pointsTodayClaims.length * 40,
    rank,
    totalSquads,
    stabilityPercent,
  };
}

export async function buildMemberContributions(squadId: string, cycleId: string) {
  const prisma = getPrisma();
  const weekAgo = new Date(Date.now() - 7 * 86_400_000);

  const memberships = await prisma.squadMembership.findMany({
    where: { squadId, status: "ACTIVE" },
    include: { user: true, condition: true },
    orderBy: { joinedAt: "asc" },
  });

  const completedCounts = await prisma.activityClaim.groupBy({
    by: ["userId"],
    where: {
      cycleId,
      status: "COMPLETED",
      completedAt: { gte: weekAgo },
    },
    _count: { id: true },
  });

  const countByUser = new Map(completedCounts.map((entry) => [entry.userId, entry._count.id]));
  const maxCompleted = Math.max(1, ...completedCounts.map((entry) => entry._count.id), 1);

  return memberships.map((member) => {
    const completed = countByUser.get(member.userId) ?? 0;
    return {
      id: member.user.id,
      name: member.user.name,
      avatarUrl: member.user.avatarUrl,
      condition: member.condition,
      status: member.status,
      weeklyProgress: Math.round((completed / maxCompleted) * 100),
      completedActivities: completed,
    };
  });
}
