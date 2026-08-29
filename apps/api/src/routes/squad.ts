import { Router } from "express";
import { z } from "zod";
import { getPrisma } from "../db.js";
import { asyncHandler, conflict, parse, notFound } from "../http.js";
import { requireAuth } from "../auth/middleware.js";
import {
  buildMemberContributions,
  buildSquadHealth,
  buildSquadInsights,
} from "../services/squadInsights.js";
import { decimalValue, getActiveCycle, getActiveMembership, userIdFrom } from "./helpers.js";

const idSchema = z.object({ id: z.string().min(1).max(120) }).strict();

function serializeCycle(cycle: {
  id: string;
  squadId: string;
  cycleDays: number;
  cycleDay: number;
  startDate: Date;
  endDate: Date;
  state: string;
  onggiState: {
    breathingExercise: number;
    breathingVeins: number;
    warmth: number;
    circulation: number;
    harmony: number;
    resonanceScore: unknown;
  } | null;
}) {
  return {
    id: cycle.id,
    squadId: cycle.squadId,
    cycleDays: cycle.cycleDays,
    cycleDay: cycle.cycleDay,
    startDate: cycle.startDate,
    endDate: cycle.endDate,
    state: cycle.state,
    onggiState: cycle.onggiState
      ? {
          breathingExercise: cycle.onggiState.breathingExercise,
          breathingVeins: cycle.onggiState.breathingVeins,
          warmth: cycle.onggiState.warmth,
          circulation: cycle.onggiState.circulation,
          harmony: cycle.onggiState.harmony,
          resonanceScore: decimalValue(cycle.onggiState.resonanceScore),
        }
      : null,
  };
}

async function loadSquadWithMembers(squadId: string) {
  const prisma = getPrisma();
  const squad = await prisma.squad.findUniqueOrThrow({
    where: { id: squadId },
    include: {
      memberships: {
        where: { status: "ACTIVE" },
        include: { user: true, condition: true },
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  return {
    id: squad.id,
    name: squad.name,
    maxMembers: squad.maxMembers,
    members: squad.memberships.map(serializeMember),
  };
}

async function loadActiveCycleForSquad(squadId: string) {
  const prisma = getPrisma();
  const cycle = await prisma.recoveryCycle.findFirst({
    where: { squadId, state: "ACTIVE" },
    orderBy: { startDate: "desc" },
    include: { onggiState: true },
  });
  return cycle ? serializeCycle(cycle) : null;
}

function serializeMember(member: {
  user: { id: string; name: string | null; avatarUrl: string | null };
  condition: { id: string; name: string; slug: string; category: string };
  status: string;
  joinedAt: Date | null;
}) {
  return {
    id: member.user.id,
    name: member.user.name,
    avatarUrl: member.user.avatarUrl,
    condition: member.condition,
    status: member.status,
    joinedAt: member.joinedAt,
  };
}

export const squadRouter = Router();
squadRouter.use(requireAuth);

squadRouter.get(
  "/squads/me",
  asyncHandler(async (request, response) => {
    const membership = await getActiveMembership(request);
    const prisma = getPrisma();
    const squad = await prisma.squad.findUniqueOrThrow({
      where: { id: membership.squadId },
      include: {
        memberships: {
          where: { status: "ACTIVE" },
          include: { user: true, condition: true },
          orderBy: { joinedAt: "asc" },
        },
      },
    });

    response.json({
      squad: {
        id: squad.id,
        name: squad.name,
        maxMembers: squad.maxMembers,
        members: squad.memberships.map(serializeMember),
      },
    });
  }),
);

squadRouter.get(
  "/squads/me/cycle",
  asyncHandler(async (request, response) => {
    const cycle = await getActiveCycle(request);
    response.json({ cycle: serializeCycle(cycle) });
  }),
);

squadRouter.get(
  "/squads/me/health",
  asyncHandler(async (request, response) => {
    const membership = await getActiveMembership(request);
    const cycle = await getActiveCycle(request);
    const health = await buildSquadHealth(membership.squadId, cycle.id, membership.squad.maxMembers);
    response.json({ health });
  }),
);

squadRouter.get(
  "/squads/me/insights",
  asyncHandler(async (request, response) => {
    const membership = await getActiveMembership(request);
    const cycle = await getActiveCycle(request);
    const insights = await buildSquadInsights(membership.squadId, cycle.id, cycle.cycleDay);
    response.json({ insights });
  }),
);

squadRouter.get(
  "/squads/me/contributions",
  asyncHandler(async (request, response) => {
    const membership = await getActiveMembership(request);
    const cycle = await getActiveCycle(request);
    const members = await buildMemberContributions(membership.squadId, cycle.id);
    response.json({ members });
  }),
);

squadRouter.get(
  "/squads/me/matchup",
  asyncHandler(async (request, response) => {
    const membership = await getActiveMembership(request);
    const cycle = await getActiveCycle(request);
    const prisma = getPrisma();
    const matchup = await prisma.squadMatchup.findFirst({
      where: {
        cycleId: cycle.id,
        OR: [{ leftSquadId: membership.squadId }, { rightSquadId: membership.squadId }],
      },
    });

    const opponentSquadId =
      matchup?.leftSquadId === membership.squadId ? matchup.rightSquadId : matchup?.leftSquadId;

    const [yourSquad, opponentSquad, yourCycle, opponentCycle, health, insights] = await Promise.all([
      loadSquadWithMembers(membership.squadId),
      opponentSquadId ? loadSquadWithMembers(opponentSquadId) : null,
      loadActiveCycleForSquad(membership.squadId),
      opponentSquadId ? loadActiveCycleForSquad(opponentSquadId) : null,
      buildSquadHealth(membership.squadId, cycle.id, membership.squad.maxMembers),
      buildSquadInsights(membership.squadId, cycle.id, cycle.cycleDay),
    ]);

    response.json({
      matchup: {
        yourSquad: { squad: yourSquad, cycle: yourCycle },
        opponentSquad: opponentSquad
          ? { squad: opponentSquad, cycle: opponentCycle }
          : { squad: null, cycle: null },
        health,
        insights,
      },
    });
  }),
);

squadRouter.get(
  "/squads/me/crystallization",
  asyncHandler(async (request, response) => {
    const membership = await getActiveMembership(request);
    const cycle = await getActiveCycle(request);
    const prisma = getPrisma();
    const [contributions, crystallizedOnggis] = await Promise.all([
      prisma.timeCapsuleContribution.findMany({
        where: { cycleId: cycle.id },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      }),
      prisma.onggi.findMany({
        where: { cycle: { squadId: membership.squadId, state: "CRYSTALLIZED" } },
        orderBy: { dateRangeStart: "desc" },
        include: { timeCapsuleContributions: true },
      }),
    ]);

    response.json({
      crystallization: {
        cycle: serializeCycle(cycle),
        daysRemaining: Math.max(cycle.cycleDays - cycle.cycleDay, 0),
        contributions: contributions.map((contribution) => ({
          id: contribution.id,
          cycleId: contribution.cycleId,
          onggiId: contribution.onggiId,
          userId: contribution.userId,
          type: contribution.type,
          caption: contribution.caption,
          createdAt: contribution.createdAt,
          contributor: contribution.user,
        })),
        crystallizedOnggis: crystallizedOnggis.map((onggi) => ({
          ...onggi,
          finalResonanceScore: decimalValue(onggi.finalResonanceScore),
          timeCapsuleContributionCount: onggi.timeCapsuleContributions.length,
        })),
      },
    });
  }),
);

squadRouter.get(
  "/squads/me/onggis",
  asyncHandler(async (request, response) => {
    const membership = await getActiveMembership(request);
    const prisma = getPrisma();
    const onggis = await prisma.onggi.findMany({
      where: { cycle: { squadId: membership.squadId } },
      orderBy: { dateRangeStart: "desc" },
      include: { timeCapsuleContributions: true },
    });

    response.json({
      onggis: onggis.map((onggi) => ({
        ...onggi,
        finalResonanceScore: decimalValue(onggi.finalResonanceScore),
        timeCapsuleContributionCount: onggi.timeCapsuleContributions.length,
      })),
    });
  }),
);

squadRouter.get(
  "/squads/:id",
  asyncHandler(async (request, response) => {
    const { id } = parse(idSchema, request.params);
    const membership = await getActiveMembership(request);
    if (membership.squadId !== id) {
      return notFound("Squad not found.");
    }

    const prisma = getPrisma();
    const squad = await prisma.squad.findUniqueOrThrow({
      where: { id },
      include: {
        memberships: {
          where: { status: "ACTIVE" },
          include: { user: true, condition: true },
        },
      },
    });

    response.json({
      squad: {
        id: squad.id,
        name: squad.name,
        maxMembers: squad.maxMembers,
        members: squad.memberships.map(serializeMember),
      },
    });
  }),
);

squadRouter.get(
  "/squads/me/members/:id",
  asyncHandler(async (request, response) => {
    const { id } = parse(idSchema, request.params);
    const membership = await getActiveMembership(request);
    const prisma = getPrisma();
    const member = await prisma.squadMembership.findFirst({
      where: { squadId: membership.squadId, userId: id, status: "ACTIVE" },
      include: { user: true, condition: true },
    });

    if (!member) {
      return notFound("Squad member not found.");
    }

    response.json({ member: serializeMember(member) });
  }),
);

const challengeJoinSchema = z.object({ challengeId: z.string().min(1).max(120) }).strict();

squadRouter.get(
  "/squads/me/challenges",
  asyncHandler(async (request, response) => {
    const membership = await getActiveMembership(request);
    const prisma = getPrisma();
    const challenges = await prisma.squadChallenge.findMany({
      where: { squadId: membership.squadId },
      orderBy: { deadline: "asc" },
      include: {
        participants: { where: { userId: userIdFrom(request) }, select: { userId: true } },
      },
    });

    response.json({
      challenges: challenges.map(({ participants, ...challenge }) => ({
        ...challenge,
        joined: participants.length > 0,
      })),
    });
  }),
);

squadRouter.post(
  "/squads/me/challenges/:id/join",
  asyncHandler(async (request, response) => {
    const { id } = parse(idSchema, request.params);
    const body = parse(challengeJoinSchema, { challengeId: id });
    const membership = await getActiveMembership(request);
    const prisma = getPrisma();
    const challenge = await prisma.squadChallenge.findFirst({
      where: { id: body.challengeId, squadId: membership.squadId },
    });

    if (!challenge) {
      return notFound("Challenge not found.");
    }

    const existing = await prisma.squadChallengeParticipant.findUnique({
      where: {
        challengeId_userId: {
          challengeId: challenge.id,
          userId: userIdFrom(request),
        },
      },
    });
    if (existing) {
      return conflict("You have already joined this challenge.");
    }

    await prisma.$transaction([
      prisma.squadChallengeParticipant.create({
        data: { challengeId: challenge.id, userId: userIdFrom(request) },
      }),
      prisma.squadChallenge.update({
        where: { id: challenge.id },
        data: { participantCount: { increment: 1 } },
      }),
    ]);

    response.status(201).json({ joined: true, challengeId: challenge.id });
  }),
);
