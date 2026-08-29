import { Router } from "express";
import { z } from "zod";
import { ZEROONE_CONFIG } from "@zeroone/shared";
import { getPrisma } from "../db.js";
import { asyncHandler, conflict, notFound, parse } from "../http.js";
import { requireAuth } from "../auth/middleware.js";
import { completeActivityClaim } from "../services/activityCompletion.js";
import { getActiveCycle, getActiveMembership, userIdFrom } from "./helpers.js";

const activityParamsSchema = z.object({ id: z.string().min(1).max(120) }).strict();
const claimParamsSchema = z.object({ id: z.string().min(1).max(120) }).strict();
const activitiesQuerySchema = z
  .object({
    category: z.enum(["PHYSICAL", "COGNITIVE", "EMOTIONAL", "SOCIAL"]).optional(),
    scope: z.enum(["INDIVIDUAL", "SHARED_SOCIAL"]).optional(),
  })
  .strict();

function utcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export const activitiesRouter = Router();
activitiesRouter.use(requireAuth);

activitiesRouter.get(
  "/activities",
  asyncHandler(async (request, response) => {
    const query = parse(activitiesQuerySchema, request.query);
    const prisma = getPrisma();
    const userId = userIdFrom(request);
    const now = new Date();
    const claimDate = utcDay(now);
    const activities = await prisma.activity.findMany({
      where: { isActive: true, category: query.category, scope: query.scope },
      orderBy: [{ category: "asc" }, { title: "asc" }],
      include: {
        claims: {
          where: { userId, claimDate },
          orderBy: { claimedAt: "desc" },
          take: 1,
        },
        freezes: {
          where: { userId, expiresAt: { gt: now } },
          orderBy: { expiresAt: "asc" },
          take: 1,
        },
      },
    });

    response.json({
      activities: activities.map(({ claims, freezes, ...activity }) => ({
        ...activity,
        currentClaim: claims[0] ?? null,
        freeze: freezes[0] ?? null,
      })),
    });
  }),
);

activitiesRouter.post(
  "/activities/:id/claim",
  asyncHandler(async (request, response) => {
    const { id: activityId } = parse(activityParamsSchema, request.params);
    const userId = userIdFrom(request);
    const cycle = await getActiveCycle(request);
    const prisma = getPrisma();
    const activity = await prisma.activity.findFirst({
      where: { id: activityId, isActive: true },
    });

    if (!activity) {
      return notFound("Activity not found.");
    }

    const now = new Date();
    const freeze = await prisma.activityFreeze.findFirst({
      where: { userId, activityId, expiresAt: { gt: now } },
      orderBy: { expiresAt: "desc" },
    });

    if (freeze) {
      return conflict(`Activity is frozen until ${freeze.expiresAt.toISOString()}.`);
    }

    const claimDate = utcDay(now);
    const existingClaim = await prisma.activityClaim.findFirst({
      where: {
        userId,
        activityId,
        claimDate,
        status: { in: ["CLAIMED", "COMPLETED"] },
      },
    });

    if (existingClaim) {
      return conflict("This activity has already been claimed today.");
    }

    const claim = await prisma.activityClaim.create({
      data: {
        userId,
        activityId,
        cycleId: cycle.id,
        claimDate,
      },
      include: { activity: true },
    });

    response.status(201).json({ claim });
  }),
);

activitiesRouter.post(
  "/activity-claims/:id/complete",
  asyncHandler(async (request, response) => {
    const { id } = parse(claimParamsSchema, request.params);
    const userId = userIdFrom(request);
    const membership = await getActiveMembership(request);
    const result = await completeActivityClaim(id, userId, membership.squadId);

    if (!result) {
      return notFound("Active activity claim not found.");
    }

    response.json({ claim: result.claim, onggiState: result.onggiState });
  }),
);

activitiesRouter.post(
  "/activity-claims/:id/abandon",
  asyncHandler(async (request, response) => {
    const { id } = parse(claimParamsSchema, request.params);
    const userId = userIdFrom(request);
    const prisma = getPrisma();
    const claim = await prisma.activityClaim.findFirst({
      where: { id, userId, status: "CLAIMED" },
      include: { activity: true },
    });

    if (!claim) {
      return notFound("Active activity claim not found.");
    }

    const config = await prisma.platformConfig.findUnique({ where: { id: "default" } });
    const freezeHours = config?.activityFreezeHours ?? ZEROONE_CONFIG.activityFreezeHours;
    const startedAt = new Date();
    const expiresAt = addHours(startedAt, freezeHours);
    const result = await prisma.$transaction(async (transaction) => {
      const abandonedClaim = await transaction.activityClaim.update({
        where: { id: claim.id },
        data: { status: "ABANDONED" },
      });
      const freeze = await transaction.activityFreeze.create({
        data: { userId, activityId: claim.activityId, startedAt, expiresAt },
      });
      return { abandonedClaim, freeze };
    });

    response.json(result);
  }),
);
