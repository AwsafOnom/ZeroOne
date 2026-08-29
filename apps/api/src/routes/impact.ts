import { Router } from "express";
import { getPrisma } from "../db.js";
import { asyncHandler } from "../http.js";
import { requireAuth } from "../auth/middleware.js";
import { groupImpactEvents } from "@zeroone/shared";
import { getActiveMembership, pageQuery } from "./helpers.js";

export const impactRouter = Router();
impactRouter.use(requireAuth);

impactRouter.get(
  "/squads/me/impact-feed",
  asyncHandler(async (request, response) => {
    const { limit, offset } = pageQuery(request.query);
    const membership = await getActiveMembership(request);
    const prisma = getPrisma();
    const events = await prisma.impactEvent.findMany({
      where: { squadId: membership.squadId },
      orderBy: { occurredAt: "desc" },
      skip: offset,
      take: Math.min(limit * 4, 100),
      include: {
        actor: { select: { id: true, name: true, avatarUrl: true } },
        activityClaim: { include: { activity: true } },
      },
    });

    const serialized = events.map(({ actor, activityClaim, delta, activityClaimId, metric, ...event }) => ({
      id: event.id,
      squadId: event.squadId,
      cycleId: event.cycleId,
      activityClaimId,
      activityCategory: event.activityCategory,
      metric,
      delta: Number(delta),
      metrics: [{ metric, delta: Number(delta) }],
      message: `${actor?.name ?? "A squad member"} completed ${activityClaim?.activity.title ?? "an activity"}`,
      occurredAt: event.occurredAt.toISOString(),
      actor,
      activity: activityClaim?.activity ?? null,
    }));

    const grouped = groupImpactEvents(serialized).slice(0, limit);

    response.json({
      events: grouped,
      pagination: { limit, offset, returned: grouped.length },
    });
  }),
);
