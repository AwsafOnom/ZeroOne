import type { Request } from "express";
import { z } from "zod";
import { getPrisma } from "../db.js";
import { notFound } from "../http.js";
import { currentUser } from "../auth/middleware.js";

export function userIdFrom(request: Request): string {
  return currentUser(request).id;
}

export async function getActiveMembership(request: Request) {
  const prisma = getPrisma();
  const membership = await prisma.squadMembership.findFirst({
    where: {
      userId: userIdFrom(request),
      status: "ACTIVE",
    },
    include: {
      squad: true,
      condition: true,
    },
  });

  return membership ?? notFound("The authenticated user is not in an active squad.");
}

export async function getActiveCycle(request: Request) {
  const membership = await getActiveMembership(request);
  const prisma = getPrisma();
  const cycle = await prisma.recoveryCycle.findFirst({
    where: {
      squadId: membership.squadId,
      state: "ACTIVE",
    },
    orderBy: { startDate: "desc" },
    include: {
      onggiState: true,
      squad: true,
    },
  });

  return cycle ?? notFound("No active recovery cycle exists for the squad.");
}

export function decimalValue(value: unknown): number {
  return Number(value);
}

export const paginationSchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .passthrough();

export function pageQuery(value: unknown): { limit: number; offset: number } {
  return paginationSchema.parse(value);
}
