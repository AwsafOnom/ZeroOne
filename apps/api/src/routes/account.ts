import { Router } from "express";
import { z } from "zod";
import { ZEROONE_CONFIG } from "@zeroone/shared";
import type { Prisma } from "../prisma.js";
import { getPrisma } from "../db.js";
import { asyncHandler, badRequest, parse } from "../http.js";
import { requireAuth, currentUser } from "../auth/middleware.js";
import { countUnreadNotifications } from "../services/notifications.js";

const profileSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    email: z.string().email().optional(),
    role: z.enum(["INDIVIDUAL", "PROFESSIONAL"]).optional(),
    avatarUrl: z.string().url().nullable().optional(),
    gender: z.string().trim().max(80).nullable().optional(),
    dateOfBirth: z.coerce.date().nullable().optional(),
    heightCm: z.number().finite().positive().max(300).nullable().optional(),
    weightKg: z.number().finite().positive().max(500).nullable().optional(),
    journeyStartDate: z.coerce.date().nullable().optional(),
  })
  .strict();

const assessmentSchema = z
  .object({
    status: z.enum(["DRAFT", "COMPLETED"]).optional(),
    responses: z.record(z.string(), z.unknown()),
  })
  .strict();

const habitsSchema = z
  .object({
    habits: z
      .array(
        z
          .object({
            type: z.enum(["SMOKING", "ALCOHOL", "DRUG_USE"]),
            frequency: z.enum(["NEVER", "OCCASIONALLY", "REGULARLY"]),
          })
          .strict(),
      )
      .max(3),
  })
  .strict();
const conditionsSchema = z
  .object({
    conditionIds: z.array(z.string().min(1).max(120)).min(1),
    primaryConditionId: z.string().min(1).max(120),
  })
  .strict()
  .refine((body) => body.conditionIds.includes(body.primaryConditionId), {
    message: "The primary condition must be one of the selected conditions.",
    path: ["primaryConditionId"],
  });
const assignmentSchema = z.object({}).strict();

function serializeUser(user: {
  id: string;
  firebaseUid: string;
  name: string | null;
  email: string | null;
  role: string | null;
  avatarUrl: string | null;
  gender: string | null;
  dateOfBirth: Date | null;
  heightCm: unknown;
  weightKg: unknown;
  journeyStartDate: Date | null;
  conditions?: Array<{
    isPrimary: boolean;
    diagnosedAt: Date | null;
    condition: { id: string; name: string; slug: string; category: string };
  }>;
}) {
  return {
    id: user.id,
    firebaseUid: user.firebaseUid,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
    heightCm: user.heightCm === null || user.heightCm === undefined ? null : Number(user.heightCm),
    weightKg: user.weightKg === null || user.weightKg === undefined ? null : Number(user.weightKg),
    journeyStartDate: user.journeyStartDate,
    conditions: user.conditions?.map(({ condition, diagnosedAt, isPrimary }) => ({
      ...condition,
      diagnosedAt,
      isPrimary,
    })),
  };
}

function serializeSquadMember(member: {
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

export const accountRouter = Router();
accountRouter.use(requireAuth);

function onboardingStatus(user: {
  role: string | null;
  name: string | null;
  gender: string | null;
  dateOfBirth: Date | null;
  heightCm: unknown;
  weightKg: unknown;
  conditions: unknown[];
  lifestyleHabits: unknown[];
  wellnessAssessments: Array<{ status: string }>;
  squadMemberships: unknown[];
}) {
  const roleCompleted = Boolean(user.role);
  const profileCompleted = Boolean(
    user.name &&
      user.gender &&
      user.dateOfBirth &&
      user.heightCm !== null &&
      user.heightCm !== undefined &&
      user.weightKg !== null &&
      user.weightKg !== undefined,
  );
  const conditionsCompleted = user.conditions.length > 0;
  const wellnessCompleted = user.wellnessAssessments.some(
    (assessment) => assessment.status === "COMPLETED",
  );
  const habitsCompleted = user.lifestyleHabits.length === 3;
  const assigned = user.squadMemberships.length > 0;

  const nextStep = !roleCompleted
    ? "role"
    : !profileCompleted
      ? "profile"
      : !conditionsCompleted
        ? "conditions"
        : !wellnessCompleted
          ? "wellness"
          : !habitsCompleted
            ? "habits"
            : assigned
              ? "complete"
              : "review";

  return {
    roleCompleted,
    profileCompleted,
    conditionsCompleted,
    wellnessCompleted,
    habitsCompleted,
    assigned,
    nextStep,
  };
}

accountRouter.get(
  "/auth/session",
  asyncHandler(async (request, response) => {
    const prisma = getPrisma();
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: currentUser(request).id },
      include: {
        conditions: { include: { condition: true } },
        lifestyleHabits: true,
        wellnessAssessments: { orderBy: { updatedAt: "desc" } },
        squadMemberships: { where: { status: "ACTIVE" } },
      },
    });

    response.json({
      user: serializeUser(user),
      unreadNotifications: await countUnreadNotifications(user.id),
      onboarding: onboardingStatus(user),
    });
  }),
);

accountRouter.get(
  "/users/me",
  asyncHandler(async (request, response) => {
    const prisma = getPrisma();
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: currentUser(request).id },
      include: { conditions: { include: { condition: true } } },
    });

    response.json({ user: serializeUser(user) });
  }),
);

accountRouter.patch(
  "/users/me",
  asyncHandler(async (request, response) => {
    const body = parse(profileSchema, request.body);
    const prisma = getPrisma();
    const user = await prisma.user.update({
      where: { id: currentUser(request).id },
      data: body,
      include: { conditions: { include: { condition: true } } },
    });

    response.json({ user: serializeUser(user) });
  }),
);

accountRouter.get(
  "/onboarding/conditions",
  asyncHandler(async (_request, response) => {
    const prisma = getPrisma();
    const conditions = await prisma.healthCondition.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    response.json({ conditions });
  }),
);

accountRouter.put(
  "/users/me/conditions",
  asyncHandler(async (request, response) => {
    const body = parse(conditionsSchema, request.body);
    const prisma = getPrisma();
    const conditions = await prisma.healthCondition.findMany({
      where: { id: { in: body.conditionIds } },
      select: { id: true },
    });
    if (conditions.length !== body.conditionIds.length) {
      return badRequest("One or more health conditions are invalid.");
    }
    const userId = currentUser(request).id;
    await prisma.$transaction(
      [
        prisma.userCondition.deleteMany({
          where: { userId, conditionId: { notIn: body.conditionIds } },
        }),
        ...body.conditionIds.map((conditionId) =>
          prisma.userCondition.upsert({
            where: { userId_conditionId: { userId, conditionId } },
          update: { isPrimary: body.primaryConditionId === conditionId },
          create: { userId, conditionId, isPrimary: body.primaryConditionId === conditionId },
          }),
        ),
      ],
    );
    response.json({ conditions });
  }),
);

accountRouter.get(
  "/onboarding/assessment",
  asyncHandler(async (request, response) => {
    const prisma = getPrisma();
    const assessment = await prisma.wellnessAssessment.findFirst({
      where: { userId: currentUser(request).id },
      orderBy: { updatedAt: "desc" },
    });

    response.json({ assessment });
  }),
);

accountRouter.put(
  "/onboarding/assessment",
  asyncHandler(async (request, response) => {
    const body = parse(assessmentSchema, request.body);
    const prisma = getPrisma();
    const existing = await prisma.wellnessAssessment.findFirst({
      where: { userId: currentUser(request).id },
      orderBy: { updatedAt: "desc" },
    });
    const assessment = existing
      ? await prisma.wellnessAssessment.update({
          where: { id: existing.id },
          data: {
            responses: body.responses as Prisma.InputJsonValue,
            status: body.status ?? existing.status,
            completedAt: body.status === "COMPLETED" ? new Date() : existing.completedAt,
          },
        })
      : await prisma.wellnessAssessment.create({
          data: {
            userId: currentUser(request).id,
            responses: body.responses as Prisma.InputJsonValue,
            status: body.status ?? "DRAFT",
            completedAt: body.status === "COMPLETED" ? new Date() : null,
          },
        });

    response.json({ assessment });
  }),
);

accountRouter.put(
  "/onboarding/habits",
  asyncHandler(async (request, response) => {
    const body = parse(habitsSchema, request.body);
    const prisma = getPrisma();
    const habits = await prisma.$transaction(
      body.habits.map((habit) =>
        prisma.lifestyleHabit.upsert({
          where: {
            userId_type: {
              userId: currentUser(request).id,
              type: habit.type,
            },
          },
          update: { frequency: habit.frequency },
          create: {
            userId: currentUser(request).id,
            type: habit.type,
            frequency: habit.frequency,
          },
        }),
      ),
    );

    response.json({ habits });
  }),
);

accountRouter.get(
  "/onboarding/habits",
  asyncHandler(async (request, response) => {
    const prisma = getPrisma();
    const habits = await prisma.lifestyleHabit.findMany({
      where: { userId: currentUser(request).id },
      orderBy: { type: "asc" },
    });
    response.json({ habits });
  }),
);

accountRouter.post(
  "/onboarding/assignment",
  asyncHandler(async (request, response) => {
    parse(assignmentSchema, request.body);
    const prisma = getPrisma();
    const userId = currentUser(request).id;
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        conditions: { orderBy: { isPrimary: "desc" } },
        squadMemberships: { where: { status: "ACTIVE" } },
      },
    });

    const requestedConditionId = user.conditions.find((condition) => condition.isPrimary)?.conditionId;
    if (!requestedConditionId) {
      return badRequest("Select at least one health condition before assignment.");
    }

    const existingMembership = user.squadMemberships.find(
      (membership) => membership.conditionId === requestedConditionId,
    );
    if (existingMembership) {
      const existingSquad = await prisma.squad.findUniqueOrThrow({
        where: { id: existingMembership.squadId },
        include: {
          memberships: {
            where: { status: "ACTIVE" },
            include: { user: true, condition: true },
            orderBy: { joinedAt: "asc" },
          },
        },
      });
      response.json({
        status: "ASSIGNED",
        conditionId: requestedConditionId,
        squad: {
          id: existingSquad.id,
          name: existingSquad.name,
          maxMembers: existingSquad.maxMembers,
          members: existingSquad.memberships.map(serializeSquadMember),
        },
      });
      return;
    }

    const squads = await prisma.squad.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        memberships: {
          where: { status: "ACTIVE" },
          include: { user: true, condition: true },
          orderBy: { joinedAt: "asc" },
        },
      },
    });
    const availableSquad = squads.find(
      (squad) =>
        squad.memberships.length < squad.maxMembers &&
        !squad.memberships.some((membership) => membership.conditionId === requestedConditionId),
    );

    let assignedSquadId = availableSquad?.id;
    if (!assignedSquadId) {
      assignedSquadId = `squad-${userId}-${requestedConditionId}`;
      const cycleId = `cycle-${assignedSquadId}-active`;
      const startDate = new Date();
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(
        startDate.getTime() + (ZEROONE_CONFIG.cycleLengthDays - 1) * 86_400_000,
      );
      await prisma.$transaction([
        prisma.squad.create({
          data: {
            id: assignedSquadId,
            name: `${user.name ?? "Your"}'s Healing Squad`,
            maxMembers: ZEROONE_CONFIG.squadSize,
          },
        }),
        prisma.recoveryCycle.create({
          data: {
            id: cycleId,
            squadId: assignedSquadId,
            cycleDays: ZEROONE_CONFIG.cycleLengthDays,
            cycleDay: 1,
            startDate,
            endDate,
            state: "ACTIVE",
          },
        }),
        prisma.onggiState.create({
          data: {
            id: `onggi-state-${assignedSquadId}`,
            cycleId,
            breathingExercise: 10,
            breathingVeins: 10,
            warmth: 10,
            circulation: 10,
            harmony: 10,
            resonanceScore: 0,
          },
        }),
      ]);
    }

    await prisma.squadMembership.create({
      data: {
        id: `membership-${userId}-${assignedSquadId}`,
        userId,
        squadId: assignedSquadId,
        conditionId: requestedConditionId,
        status: "ACTIVE",
        joinedAt: new Date(),
      },
    });

    const assignedSquad = await prisma.squad.findUniqueOrThrow({
      where: { id: assignedSquadId },
      include: {
        memberships: {
          where: { status: "ACTIVE" },
          include: { user: true, condition: true },
          orderBy: { joinedAt: "asc" },
        },
      },
    });

    response.status(201).json({
      status: "ASSIGNED",
      conditionId: requestedConditionId,
      squad: {
        id: assignedSquad.id,
        name: assignedSquad.name,
        maxMembers: assignedSquad.maxMembers,
        members: assignedSquad.memberships.map(serializeSquadMember),
      },
    });
    return;
  }),
);
