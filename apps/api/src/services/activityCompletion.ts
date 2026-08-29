import type { Prisma } from "../prisma.js";
import { getPrisma } from "../db.js";
import { emitSquadRealtime } from "../realtime/socket.js";
import { groupImpactEvents } from "@zeroone/shared";

function serializeOnggiState(state: {
  breathingExercise: number;
  breathingVeins: number;
  warmth: number;
  circulation: number;
  harmony: number;
  resonanceScore: unknown;
}) {
  return {
    breathingExercise: state.breathingExercise,
    breathingVeins: state.breathingVeins,
    warmth: state.warmth,
    circulation: state.circulation,
    harmony: state.harmony,
    resonanceScore: Number(state.resonanceScore),
  };
}

function serializeImpactEvent(
  event: {
    id: string;
    squadId: string;
    cycleId: string | null;
    activityClaimId: string | null;
    activityCategory: string;
    metric: string;
    delta: unknown;
    message: string;
    occurredAt: Date;
    actor: { id: string; name: string | null; avatarUrl: string | null } | null;
    activityClaim: { activity: { id: string; title: string; description: string; points: number; category: string; scope: string; isActive: boolean } | null } | null;
  },
) {
  return {
    id: event.id,
    squadId: event.squadId,
    cycleId: event.cycleId,
    activityClaimId: event.activityClaimId,
    activityCategory: event.activityCategory,
    metric: event.metric,
    delta: Number(event.delta),
    metrics: [{ metric: event.metric, delta: Number(event.delta) }],
    message: event.message,
    occurredAt: event.occurredAt.toISOString(),
    actor: event.actor,
    activity: event.activityClaim?.activity ?? null,
  };
}

export async function completeActivityClaim(claimId: string, userId: string, squadId: string) {
  const prisma = getPrisma();
  const claim = await prisma.activityClaim.findFirst({
    where: { id: claimId, userId, status: "CLAIMED" },
    include: { activity: true, cycle: true, user: true },
  });

  if (!claim || !claim.cycle || claim.cycle.squadId !== squadId) {
    return null;
  }

  const cycleId = claim.cycle.id;
  const occurredAt = new Date();
  const metricTypes =
    claim.activity.scope === "SHARED_SOCIAL"
      ? (["WARMTH", "HARMONY"] as const)
      : (["BREATHING_VEINS", "CIRCULATION"] as const);
  const delta = 1;
  const actorName = claim.user.name ?? "A squad member";

  const result = await prisma.$transaction(async (transaction) => {
    const transition = await transaction.activityClaim.updateMany({
      where: { id: claim.id, userId, status: "CLAIMED" },
      data: { status: "COMPLETED", completedAt: occurredAt },
    });
    if (transition.count !== 1) {
      return null;
    }

    const completedClaim = await transaction.activityClaim.findUniqueOrThrow({
      where: { id: claim.id },
      include: { activity: true },
    });

    const state = await transaction.onggiState.update({
      where: { cycleId },
      data: (() => {
        const data = metricTypes.reduce<Prisma.OnggiStateUpdateInput>((updates, metric) => {
          if (metric === "BREATHING_VEINS") {
            updates.breathingVeins = { increment: delta };
          }
          if (metric === "CIRCULATION") {
            updates.circulation = { increment: delta };
          }
          if (metric === "WARMTH") {
            updates.warmth = { increment: delta };
          }
          if (metric === "HARMONY") {
            updates.harmony = { increment: delta };
          }
          return updates;
        }, {});
        data.resonanceScore = { increment: claim.activity.points };
        return data;
      })(),
    });

    const createdEvents = await Promise.all(
      metricTypes.map((metric) =>
        transaction.impactEvent.create({
          data: {
            squadId,
            cycleId,
            actorUserId: userId,
            activityClaimId: claim.id,
            activityCategory: claim.activity.category,
            metric,
            delta,
            message: `${actorName} completed ${claim.activity.title}`,
            occurredAt,
          },
          include: {
            actor: { select: { id: true, name: true, avatarUrl: true } },
            activityClaim: { include: { activity: true } },
          },
        }),
      ),
    );

    return { completedClaim, state, createdEvents };
  });

  if (!result) {
    return null;
  }

  const onggiState = serializeOnggiState(result.state);
  const events = groupImpactEvents(
    result.createdEvents.map((event) => ({
      ...serializeImpactEvent(event),
      activityClaimId: event.activityClaimId,
    })),
  );

  emitSquadRealtime(squadId, {
    onggiState,
    events,
  });

  return {
    claim: result.completedClaim,
    onggiState,
    events,
  };
}

export async function simulateSquadMemberActivity(squadId: string) {
  const prisma = getPrisma();
  const cycle = await prisma.recoveryCycle.findFirst({
    where: { squadId, state: "ACTIVE" },
    orderBy: { startDate: "desc" },
  });
  if (!cycle) {
    return null;
  }

  const [members, activities] = await Promise.all([
    prisma.squadMembership.findMany({
      where: { squadId, status: "ACTIVE" },
      select: { userId: true },
    }),
    prisma.activity.findMany({
      where: { isActive: true },
      orderBy: { title: "asc" },
    }),
  ]);

  if (members.length === 0 || activities.length === 0) {
    return null;
  }

  const member = members[Math.floor(Math.random() * members.length)];
  const activity = activities[Math.floor(Math.random() * activities.length)];
  const claimDate = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));

  const claim = await prisma.activityClaim.create({
    data: {
      userId: member.userId,
      activityId: activity.id,
      cycleId: cycle.id,
      claimDate,
      status: "CLAIMED",
    },
  });

  return completeActivityClaim(claim.id, member.userId, squadId);
}
