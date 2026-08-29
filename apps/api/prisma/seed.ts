import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../generated/prisma/client.js";
import { ZEROONE_CONFIG } from "@zeroone/shared";
import { getFirebaseUidByEmail } from "../src/auth/firebase.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run the Prisma seed");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const seedNow = new Date("2026-08-27T04:00:00.000Z");
const day = (offset: number) => new Date(seedNow.getTime() + offset * 86_400_000);
const cycleEnd = (startDate: Date) =>
  new Date(startDate.getTime() + (ZEROONE_CONFIG.cycleLengthDays - 1) * 86_400_000);
const decimal = (value: number) => new Prisma.Decimal(value);

const conditions = [
  ["Diabetes", "diabetes", "PHYSICAL"],
  ["Hypertension", "hypertension", "PHYSICAL"],
  ["Asthma", "asthma", "PHYSICAL"],
  ["Heart Disease", "heart-disease", "PHYSICAL"],
  ["Arthritis", "arthritis", "PHYSICAL"],
  ["Obesity", "obesity", "PHYSICAL"],
  ["Chronic Pain", "chronic-pain", "PHYSICAL"],
  ["Sleep Disorders", "sleep-disorders", "PHYSICAL"],
  ["Cancer", "cancer", "PHYSICAL"],
  ["Depression", "depression", "MENTAL"],
  ["Anxiety", "anxiety", "MENTAL"],
  ["PTSD", "ptsd", "MENTAL"],
  ["OCD", "ocd", "MENTAL"],
  ["Bipolar", "bipolar", "MENTAL"],
  ["Stress", "stress", "MENTAL"],
  ["Insomnia", "insomnia", "MENTAL"],
  ["ADHD", "adhd", "NEUROLOGICAL"],
  ["Dementia", "dementia", "NEUROLOGICAL"],
] as const;

const users = [
  ["user-awsaf-onom", "seed-awsaf-onom", "Awsaf Onom", "awsaf@example.com", "2024-01-01"],
  ["user-do-yun", "seed-do-yun", "Do-yun", "do-yun@example.com", "2023-02-01"],
  ["user-eun-woo", "seed-eun-woo", "Eun-woo", "eun-woo@example.com", "2023-03-01"],
  ["user-ha-joon", "seed-ha-joon", "Ha-joon", "ha-joon@example.com", "2023-04-01"],
  ["user-ji-ho", "seed-ji-ho", "Ji-ho", "ji-ho@example.com", "2023-05-01"],
  ["user-ju-won", "seed-ju-won", "Ju-won", "ju-won@example.com", "2023-06-01"],
  ["user-min-jun-green", "seed-min-jun-green", "Min-jun", "min-jun.green@example.com", "2023-07-01"],
  ["user-seo-jun", "seed-seo-jun", "Seo-jun", "seo-jun@example.com", "2023-08-01"],
  ["user-seon-goo", "seed-seon-goo", "Seon-goo", "seon-goo@example.com", "2023-02-01"],
  ["user-ha-eun", "seed-ha-eun", "Ha-eun", "ha-eun@example.com", "2023-03-01"],
  ["user-jong-woo", "seed-jong-woo", "Jong-woo", "jong-woo@example.com", "2023-04-01"],
  ["user-min-joon", "seed-min-joon", "Min-joon", "min-joon@example.com", "2023-05-01"],
  ["user-da-hye", "seed-da-hye", "Da-hye", "da-hye@example.com", "2023-06-01"],
  ["user-ji-woo", "seed-ji-woo", "Ji-woo", "ji-woo@example.com", "2023-07-01"],
  ["user-yu-jin", "seed-yu-jin", "Yu-jin", "yu-jin@example.com", "2023-08-01"],
  ["user-min-jun-blue", "seed-min-jun-blue", "Min-jun", "min-jun.blue@example.com", "2023-09-01"],
  ["user-sung-min", "seed-sung-min", "Sung-min", "sung-min@example.com", "2021-08-27"],
  ["user-seoyun", "seed-seoyun", "Seoyun", "seoyun@example.com", "2026-06-27"],
  ["user-quiet-jin", "seed-quiet-jin", "Jin", "quiet-jin@example.com", "2025-01-10"],
  ["user-quiet-mina", "seed-quiet-mina", "Mina", "quiet-mina@example.com", "2025-02-10"],
  ["user-quiet-jiho", "seed-quiet-jiho", "Jiho", "quiet-jiho@example.com", "2025-03-10"],
  ["user-quiet-yuna", "seed-quiet-yuna", "Yuna", "quiet-yuna@example.com", "2025-04-10"],
  ["user-quiet-dae", "seed-quiet-dae", "Dae", "quiet-dae@example.com", "2025-05-10"],
  ["user-quiet-sora", "seed-quiet-sora", "Sora", "quiet-sora@example.com", "2025-06-10"],
  ["user-quiet-hana", "seed-quiet-hana", "Hana", "quiet-hana@example.com", "2025-07-10"],
] as const;

const greenConditions = [
  "diabetes",
  "cancer",
  "hypertension",
  "depression",
  "heart-disease",
  "arthritis",
  "obesity",
  "dementia",
] as const;

const blueConditions = greenConditions;
const quietConditions = ["diabetes", "cancer", "hypertension", "depression", "arthritis", "obesity", "dementia"] as const;
const greenUsers = users.slice(0, 8);
const blueUsers = users.slice(8, 16);
const quietUsers = users.slice(18, 25);
const awsafId = "user-awsaf-onom";
const demoEmail = (process.env.DEMO_EMAIL ?? "awsaf@example.com").trim().toLowerCase();
const awsafAvatarPath = "/avatars/awsaf.png";
const dicebearAvatarStyle = "avataaars";

function seedAvatarUrl(userId: string, name: string): string {
  if (userId === awsafId) {
    return awsafAvatarPath;
  }

  const seed = encodeURIComponent(name.trim());
  return `https://api.dicebear.com/9.x/${dicebearAvatarStyle}/png?seed=${seed}&size=128`;
}

const greenSquadId = "squad-green-harmony";
const blueSquadId = "squad-blue-horizon";
const quietSquadId = "squad-quiet-current";
const activeCycleId = "cycle-green-active";
const opponentCycleId = "cycle-blue-active";
const quietCycleId = "cycle-quiet-active";
const diabetesId = "condition-diabetes";

async function seedPlatformConfig() {
  await prisma.platformConfig.upsert({
    where: { id: "default" },
    update: {
      maxSquadMembers: ZEROONE_CONFIG.squadSize,
      recoveryCycleDays: ZEROONE_CONFIG.cycleLengthDays,
      activityFreezeHours: ZEROONE_CONFIG.activityFreezeHours,
      dailyDoubleActivities: ZEROONE_CONFIG.dailyDoublePointsActivities,
      dailyActivityGridSize: ZEROONE_CONFIG.dailyActivityGridSize,
      encouragementPoints: ZEROONE_CONFIG.sparkPoints.encouragement,
      voiceSupportPoints: ZEROONE_CONFIG.sparkPoints.voiceSupport,
      guidancePoints: ZEROONE_CONFIG.sparkPoints.guidance,
      sparkLanternThreshold: ZEROONE_CONFIG.lanternIgnitionThreshold,
      onggiDimensions: ZEROONE_CONFIG.onggiDimensions,
      peerStoriesPerReflection: ZEROONE_CONFIG.peerStoriesPerReflection,
      aiFeedbackResponses: ZEROONE_CONFIG.aiFeedbackResponsesPerReflection,
    },
    create: {
      id: "default",
      maxSquadMembers: ZEROONE_CONFIG.squadSize,
      recoveryCycleDays: ZEROONE_CONFIG.cycleLengthDays,
      activityFreezeHours: ZEROONE_CONFIG.activityFreezeHours,
      dailyDoubleActivities: ZEROONE_CONFIG.dailyDoublePointsActivities,
      dailyActivityGridSize: ZEROONE_CONFIG.dailyActivityGridSize,
      encouragementPoints: ZEROONE_CONFIG.sparkPoints.encouragement,
      voiceSupportPoints: ZEROONE_CONFIG.sparkPoints.voiceSupport,
      guidancePoints: ZEROONE_CONFIG.sparkPoints.guidance,
      sparkLanternThreshold: ZEROONE_CONFIG.lanternIgnitionThreshold,
      onggiDimensions: ZEROONE_CONFIG.onggiDimensions,
      peerStoriesPerReflection: ZEROONE_CONFIG.peerStoriesPerReflection,
      aiFeedbackResponses: ZEROONE_CONFIG.aiFeedbackResponsesPerReflection,
    },
  });

  for (const [kind, points, id] of [
    ["ENCOURAGEMENT", ZEROONE_CONFIG.sparkPoints.encouragement, "spark-encouragement"],
    ["VOICE_SUPPORT", ZEROONE_CONFIG.sparkPoints.voiceSupport, "spark-voice-support"],
    ["GUIDANCE", ZEROONE_CONFIG.sparkPoints.guidance, "spark-guidance"],
  ] as const) {
    await prisma.sparkActionConfig.upsert({
      where: { kind },
      update: { points, isActive: true },
      create: { id, kind, points },
    });
  }
}

async function seedCatalogue() {
  for (const [name, slug, category] of conditions) {
    await prisma.healthCondition.upsert({
      where: { id: `condition-${slug}` },
      update: { name, slug, category },
      create: { id: `condition-${slug}`, name, slug, category },
    });
    await prisma.community.upsert({
      where: { id: `community-${slug}` },
      update: { conditionId: `condition-${slug}`, memberCount: 128 },
      create: { id: `community-${slug}`, conditionId: `condition-${slug}`, memberCount: 128 },
    });
  }

  const activities = [
    ["activity-hydration", "Hydration Tracking", "Track your daily water intake.", 50, "PHYSICAL"],
    ["activity-walking", "Walking Goals", "Take a gentle walk at your own pace.", 40, "PHYSICAL"],
    ["activity-breathing", "Guided Breathing", "Complete a guided breathing exercise.", 40, "EMOTIONAL"],
    ["activity-meditation", "Meditation Sessions", "Make space for a short meditation.", 50, "EMOTIONAL"],
    ["activity-sleep", "Sleep Tracking", "Record the quality of your sleep.", 40, "PHYSICAL"],
    ["activity-fatigue", "Fatigue Check-ins", "Notice and record your energy level.", 40, "EMOTIONAL"],
    ["activity-mobility", "Mobility Routines", "Move through a gentle mobility routine.", 40, "PHYSICAL"],
    ["activity-cognitive", "Cognitive Tasks", "Complete a small cognitive task.", 40, "COGNITIVE"],
    ["activity-memory", "Memory Exercises", "Try a memory exercise.", 40, "COGNITIVE"],
    ["activity-grounding", "Grounding Exercises", "Use a grounding exercise.", 40, "EMOTIONAL"],
    ["activity-mood", "Mood Journaling", "Record how you are feeling.", 40, "EMOTIONAL"],
    ["activity-cbt", "CBT-inspired Prompts", "Reflect on a thought with curiosity.", 40, "COGNITIVE"],
  ] as const;

  for (const [id, title, description, points, category] of activities) {
    await prisma.activity.upsert({
      where: { id },
      update: { title, description, points, category, scope: "INDIVIDUAL", isActive: true },
      create: { id, title, description, points, category, scope: "INDIVIDUAL" },
    });
  }
}

function assertUniqueSeedUsers() {
  const ids = new Set<string>();
  const firebaseUids = new Set<string>();
  const emails = new Set<string>();

  for (const [id, firebaseUid, , email] of users) {
    if (ids.has(id)) {
      throw new Error(`Duplicate seed user id: ${id}`);
    }
    if (firebaseUids.has(firebaseUid)) {
      throw new Error(`Duplicate seed firebaseUid: ${firebaseUid}`);
    }
    if (emails.has(email)) {
      throw new Error(`Duplicate seed email: ${email}`);
    }
    ids.add(id);
    firebaseUids.add(firebaseUid);
    emails.add(email);
  }
}

function isSeedFirebaseUid(firebaseUid: string) {
  return firebaseUid.startsWith("seed-");
}

async function resolveSeedFirebaseUid(email: string, placeholderUid: string) {
  if (email.toLowerCase() !== demoEmail) {
    return placeholderUid;
  }

  const realUid = await getFirebaseUidByEmail(email);
  return realUid ?? placeholderUid;
}

async function upsertSeedUser([id, placeholderUid, name, email, journeyStartDate]: (typeof users)[number]) {
  const journeyStart = new Date(`${journeyStartDate}T00:00:00.000Z`);
  const resolvedFirebaseUid = await resolveSeedFirebaseUid(email, placeholderUid);
  const avatarUrl = seedAvatarUrl(id, name);
  let existing = await prisma.user.findUnique({ where: { email } });

  if (existing && existing.id !== id) {
    const relatedMemberships = await prisma.squadMembership.count({
      where: { userId: existing.id },
    });
    if (relatedMemberships === 0) {
      await prisma.user.delete({ where: { id: existing.id } });
      existing = null;
    } else {
      throw new Error(
        `Seed user "${email}" exists as ${existing.id}, expected ${id}. Run prisma migrate reset.`,
      );
    }
  }

  if (existing) {
    const firebaseUid =
      isSeedFirebaseUid(existing.firebaseUid) && resolvedFirebaseUid !== existing.firebaseUid
        ? resolvedFirebaseUid
        : existing.firebaseUid;

    await prisma.user.update({
      where: { email },
      data: {
        name,
        role: "INDIVIDUAL",
        journeyStartDate: journeyStart,
        firebaseUid,
        avatarUrl,
      },
    });
    return;
  }

  await prisma.user.create({
    data: {
      id,
      firebaseUid: resolvedFirebaseUid,
      name,
      email,
      role: "INDIVIDUAL",
      journeyStartDate: journeyStart,
      avatarUrl,
    },
  });
}

async function seedUsersAndSquads() {
  assertUniqueSeedUsers();

  for (const user of users) {
    await upsertSeedUser(user);
  }

  const awsafUser = await prisma.user.findFirst({
    where: { OR: [{ id: awsafId }, { email: demoEmail }] },
  });
  if (!awsafUser) {
    throw new Error(`Demo user "${demoEmail}" was not created during seed.`);
  }

  await prisma.user.update({
    where: { id: awsafUser.id },
    data: {
      gender: "PREFER_NOT_TO_SAY",
      dateOfBirth: new Date("1994-05-14T00:00:00.000Z"),
      heightCm: decimal(168),
      weightKg: decimal(64),
    },
  });

  const conditionBySlug = new Map(conditions.map(([, slug]) => [slug, `condition-${slug}`]));
  const userConditions = [
    ...greenUsers.map(([id], index) => [id, greenConditions[index]] as const),
    ...blueUsers.map(([id], index) => [id, blueConditions[index]] as const),
    ...quietUsers.map(([id], index) => [id, quietConditions[index]] as const),
    ["user-sung-min", "diabetes"],
    ["user-seoyun", "diabetes"],
  ] as const;

  for (const [userId, conditionSlug] of userConditions) {
    const conditionId = conditionBySlug.get(conditionSlug);
    if (!conditionId) {
      throw new Error(`Missing condition ${conditionSlug}`);
    }
    await prisma.userCondition.upsert({
      where: { userId_conditionId: { userId, conditionId } },
      update: { isPrimary: true },
      create: { userId, conditionId, isPrimary: true },
    });
  }

  for (const [id, name] of [
    [greenSquadId, "Green Harmony"],
    [blueSquadId, "Blue Horizon"],
    [quietSquadId, "Quiet Current"],
  ] as const) {
    await prisma.squad.upsert({
      where: { id },
      update: { name, maxMembers: ZEROONE_CONFIG.squadSize },
      create: { id, name, maxMembers: ZEROONE_CONFIG.squadSize },
    });
  }

  for (const [squadId, squadUsers, squadConditions] of [
    [greenSquadId, greenUsers, greenConditions],
    [blueSquadId, blueUsers, blueConditions],
    [quietSquadId, quietUsers, quietConditions],
  ] as const) {
    for (const [[userId], conditionSlug] of squadUsers.map((user, index) => [user, squadConditions[index]] as const)) {
      const conditionId = conditionBySlug.get(conditionSlug);
      if (!conditionId) {
        throw new Error(`Missing condition ${conditionSlug}`);
      }
      await prisma.squadMembership.upsert({
        where: { id: `${squadId}-${userId}` },
        update: { userId, squadId, conditionId, status: "ACTIVE", joinedAt: day(-400) },
        create: {
          id: `${squadId}-${userId}`,
          userId,
          squadId,
          conditionId,
          status: "ACTIVE",
          joinedAt: day(-400),
        },
      });
    }
  }
}

async function seedCyclesAndOnggis() {
  for (const [id, squadId, cycleDay, state, startDate] of [
    [activeCycleId, greenSquadId, 12, "ACTIVE", day(-11)],
    [opponentCycleId, blueSquadId, 12, "ACTIVE", day(-11)],
    [quietCycleId, quietSquadId, 5, "ACTIVE", day(-4)],
    ["cycle-green-hope", greenSquadId, 28, "CRYSTALLIZED", day(-123)],
    ["cycle-green-strength", greenSquadId, 28, "CRYSTALLIZED", day(-151)],
    ["cycle-green-growth", greenSquadId, 28, "CRYSTALLIZED", day(-179)],
    ["cycle-green-wisdom", greenSquadId, 28, "CRYSTALLIZED", day(-207)],
  ] as const) {
    await prisma.recoveryCycle.upsert({
      where: { id },
      update: {
        squadId,
        cycleDays: ZEROONE_CONFIG.cycleLengthDays,
        cycleDay,
        startDate,
        endDate: cycleEnd(startDate),
        state,
      },
      create: {
        id,
        squadId,
        cycleDays: ZEROONE_CONFIG.cycleLengthDays,
        cycleDay,
        startDate,
        endDate: cycleEnd(startDate),
        state,
      },
    });
  }

  await prisma.onggiState.upsert({
    where: { cycleId: activeCycleId },
    update: {
      breathingExercise: 70,
      breathingVeins: 40,
      warmth: 50,
      circulation: 20,
      harmony: 15,
      resonanceScore: decimal(50_580),
    },
    create: {
      id: "onggi-state-green-active",
      cycleId: activeCycleId,
      breathingExercise: 70,
      breathingVeins: 40,
      warmth: 50,
      circulation: 20,
      harmony: 15,
      resonanceScore: decimal(50_580),
    },
  });
  await prisma.onggiState.upsert({
    where: { cycleId: opponentCycleId },
    update: { breathingExercise: 55, breathingVeins: 35, warmth: 44, circulation: 31, harmony: 28, resonanceScore: decimal(48_580) },
    create: {
      id: "onggi-state-blue-active",
      cycleId: opponentCycleId,
      breathingExercise: 55,
      breathingVeins: 35,
      warmth: 44,
      circulation: 31,
      harmony: 28,
      resonanceScore: decimal(48_580),
    },
  });
  await prisma.onggiState.upsert({
    where: { cycleId: quietCycleId },
    update: {
      breathingExercise: 10,
      breathingVeins: 8,
      warmth: 12,
      circulation: 9,
      harmony: 11,
      resonanceScore: decimal(420),
    },
    create: {
      id: "onggi-state-quiet-active",
      cycleId: quietCycleId,
      breathingExercise: 10,
      breathingVeins: 8,
      warmth: 12,
      circulation: 9,
      harmony: 11,
      resonanceScore: decimal(420),
    },
  });

  const onggis = [
    ["onggi-hope", "cycle-green-hope", "NEW_BEGINNING", "Hope", "A beginning held by the whole squad.", 42_580, 96],
    ["onggi-strength", "cycle-green-strength", "STRENGTH", "Strength", "The strength built through steady care.", 39_580, 78],
    ["onggi-growth", "cycle-green-growth", "GROWTH", "Growth", "A record of patient, shared progress.", 36_580, 104],
    ["onggi-wisdom", "cycle-green-wisdom", "WISDOM", "Wisdom", "The wisdom gathered across a cycle.", 33_580, 67],
  ] as const;

  for (const [id, cycleId, name, theme, description, finalResonanceScore, activityCount] of onggis) {
    const cycle = await prisma.recoveryCycle.findUniqueOrThrow({ where: { id: cycleId } });
    const existingOnggi = await prisma.onggi.findUnique({ where: { id } });
    if (!existingOnggi) {
      await prisma.onggi.create({
        data: {
          id,
          cycleId,
          name,
          theme,
          description,
          dateRangeStart: cycle.startDate,
          dateRangeEnd: cycle.endDate,
          activityCount,
          finalResonanceScore: decimal(finalResonanceScore),
        },
      });
    }
  }

  await prisma.squadMatchup.upsert({
    where: { id: "matchup-green-blue-active" },
    update: { cycleId: activeCycleId, leftSquadId: greenSquadId, rightSquadId: blueSquadId },
    create: {
      id: "matchup-green-blue-active",
      cycleId: activeCycleId,
      leftSquadId: greenSquadId,
      rightSquadId: blueSquadId,
    },
  });

  for (const [id, cycleId, onggiId, caption, type] of [
    ["capsule-hope-1", "cycle-green-hope", "onggi-hope", "A first shared memory.", "MEMORY"],
    ["capsule-hope-2", "cycle-green-hope", "onggi-hope", "A photo from day twelve.", "PHOTO"],
    ["capsule-hope-3", "cycle-green-hope", "onggi-hope", "A song we chose together.", "SONG"],
    ["capsule-strength-1", "cycle-green-strength", "onggi-strength", "A voice note for the next cycle.", "VOICE_RECORDING"],
    ["capsule-strength-2", "cycle-green-strength", "onggi-strength", "A gentle morning photo.", "PHOTO"],
    ["capsule-growth-1", "cycle-green-growth", "onggi-growth", "A song chosen by the squad.", "SONG"],
    ["capsule-growth-2", "cycle-green-growth", "onggi-growth", "Notes from a shared walk.", "MEMORY"],
    ["capsule-growth-3", "cycle-green-growth", "onggi-growth", "A voice message of encouragement.", "VOICE_RECORDING"],
    ["capsule-growth-4", "cycle-green-growth", "onggi-growth", "Sunset over the recovery garden.", "PHOTO"],
    ["capsule-wisdom-1", "cycle-green-wisdom", "onggi-wisdom", "A photo from a gentle day.", "PHOTO"],
    ["capsule-wisdom-2", "cycle-green-wisdom", "onggi-wisdom", "A memory we wanted to keep.", "MEMORY"],
    ["capsule-wisdom-3", "cycle-green-wisdom", "onggi-wisdom", "A song that carried us through.", "SONG"],
    ["capsule-wisdom-4", "cycle-green-wisdom", "onggi-wisdom", "A voice note for whoever comes next.", "VOICE_RECORDING"],
    ["capsule-wisdom-5", "cycle-green-wisdom", "onggi-wisdom", "A quiet moment before crystallization.", "PHOTO"],
  ] as const) {
    await prisma.timeCapsuleContribution.upsert({
      where: { id },
      update: { cycleId, onggiId, userId: awsafId, type, storageKey: `seed/${id}`, caption },
      create: {
        id,
        cycleId,
        onggiId,
        userId: awsafId,
        type,
        storageKey: `seed/${id}`,
        caption,
      },
    });
  }

  for (const [id, caption, type] of [
    ["capsule-active-memory", "A quiet moment we want to keep.", "MEMORY"],
    ["capsule-active-voice", "A voice note for day 28.", "VOICE_RECORDING"],
  ] as const) {
    await prisma.timeCapsuleContribution.upsert({
      where: { id },
      update: {
        cycleId: activeCycleId,
        onggiId: null,
        userId: awsafId,
        type,
        storageKey: `seed/${id}`,
        caption,
      },
      create: {
        id,
        cycleId: activeCycleId,
        onggiId: null,
        userId: awsafId,
        type,
        storageKey: `seed/${id}`,
        caption,
      },
    });
  }
}

async function seedActivitiesAndChallenges() {
  for (const [id, activityId, status, hoursAgo] of [
    ["claim-hydration", "activity-hydration", "COMPLETED", 20],
    ["claim-walking", "activity-walking", "CLAIMED", 3],
    ["claim-breathing", "activity-breathing", "CLAIMED", 1],
  ] as const) {
    await prisma.activityClaim.upsert({
      where: { id },
        update: { userId: awsafId, activityId, cycleId: activeCycleId, claimDate: new Date("2026-08-27T00:00:00.000Z"), status, claimedAt: new Date(seedNow.getTime() - hoursAgo * 3_600_000), completedAt: status === "COMPLETED" ? new Date(seedNow.getTime() - hoursAgo * 3_600_000 + 1_800_000) : null },
      create: {
        id,
        userId: awsafId,
        activityId,
        cycleId: activeCycleId,
        claimDate: new Date("2026-08-27T00:00:00.000Z"),
        status,
        claimedAt: new Date(seedNow.getTime() - hoursAgo * 3_600_000),
        completedAt: status === "COMPLETED" ? new Date(seedNow.getTime() - hoursAgo * 3_600_000 + 1_800_000) : null,
      },
    });
  }

  const challenges = [
    ["challenge-cooking", "COOKING", "Cooking Together", 5, 50],
    ["challenge-sleep", "SLEEP_NIGHT", "Squad Sleep Night", 6, 60],
    ["challenge-sunlight", "SUNLIGHT_SESSION", "Sunlight Session", 4, 40],
    ["challenge-recovery-room", "RECOVERY_ROOM", "Recovery Room", 7, 70],
  ] as const;
  for (const [id, kind, title, participantCount, points] of challenges) {
    await prisma.squadChallenge.upsert({
      where: { id },
      update: {
        squadId: greenSquadId,
        kind,
        title,
        description: "A shared activity for Green Harmony.",
        points,
        participantCount,
        deadline: new Date(seedNow.getTime() + (participantCount + 1) * 3_600_000),
      },
      create: {
        id,
        squadId: greenSquadId,
        kind,
        title,
        description: "A shared activity for Green Harmony.",
        points,
        participantCount,
        deadline: new Date(seedNow.getTime() + (participantCount + 1) * 3_600_000),
      },
    });
    for (const [userId] of greenUsers.slice(0, participantCount)) {
      await prisma.squadChallengeParticipant.upsert({
        where: { challengeId_userId: { challengeId: id, userId } },
        update: {},
        create: { challengeId: id, userId },
      });
    }
  }
}

async function seedImpactFeed() {
  const events = [
    ["impact-01", "user-awsaf-onom", "Guided Breathing", "BREATHING_VEINS"],
    ["impact-02", "user-do-yun", "Walking Goals", "CIRCULATION"],
    ["impact-03", "user-eun-woo", "Cooking Together", "WARMTH"],
    ["impact-04", "user-ha-joon", "Sunlight Session", "HARMONY"],
    ["impact-05", "user-ji-ho", "Meditation Sessions", "BREATHING_VEINS"],
    ["impact-06", "user-ju-won", "Mobility Routines", "CIRCULATION"],
    ["impact-07", "user-min-jun-green", "Grounding Exercises", "WARMTH"],
    ["impact-08", "user-seo-jun", "Memory Exercises", "HARMONY"],
    ["impact-09", "user-awsaf-onom", "Hydration Tracking", "CIRCULATION"],
    ["impact-10", "user-do-yun", "Fatigue Check-ins", "BREATHING_VEINS"],
    ["impact-11", "user-eun-woo", "Cooking Together", "WARMTH"],
    ["impact-12", "user-ha-joon", "Sunlight Session", "HARMONY"],
    ["impact-13", "user-ji-ho", "Cognitive Tasks", "BREATHING_VEINS"],
    ["impact-14", "user-ju-won", "Walking Goals", "CIRCULATION"],
    ["impact-15", "user-min-jun-green", "Recovery Room", "WARMTH"],
    ["impact-16", "user-seo-jun", "Recovery Room", "HARMONY"],
    ["impact-17", "user-awsaf-onom", "Mood Journaling", "BREATHING_VEINS"],
    ["impact-18", "user-do-yun", "Sleep Tracking", "CIRCULATION"],
    ["impact-19", "user-eun-woo", "Cooking Together", "WARMTH"],
    ["impact-20", "user-ha-joon", "Sunlight Session", "HARMONY"],
  ] as const;
  for (const [index, [id, actorUserId, action, metric]] of events.entries()) {
    const existingImpactEvent = await prisma.impactEvent.findUnique({ where: { id } });
    if (!existingImpactEvent) {
      await prisma.impactEvent.create({
        data: {
        id,
        squadId: greenSquadId,
        cycleId: activeCycleId,
        actorUserId,
        activityCategory: metric === "WARMTH" || metric === "HARMONY" ? "SOCIAL" : "EMOTIONAL",
        metric,
        delta: decimal(1),
        message: `${actorUserId.replace("user-", "")} completed ${action}; ${metric.replaceAll("_", " ")} +1%`,
        occurredAt: new Date(seedNow.getTime() - (index + 1) * 3_200_000),
        },
      });
    }
  }

  const quietEvents = [
    ["impact-quiet-01", "user-quiet-jin", "Guided Breathing", "BREATHING_VEINS"],
    ["impact-quiet-02", "user-quiet-mina", "Walking Goals", "CIRCULATION"],
    ["impact-quiet-03", "user-quiet-jiho", "Meditation Sessions", "BREATHING_EXERCISE"],
    ["impact-quiet-04", "user-quiet-yuna", "Mobility Routines", "CIRCULATION"],
    ["impact-quiet-05", "user-quiet-dae", "Grounding Exercises", "WARMTH"],
    ["impact-quiet-06", "user-quiet-sora", "Cognitive Tasks", "BREATHING_EXERCISE"],
    ["impact-quiet-07", "user-quiet-hana", "Hydration Tracking", "CIRCULATION"],
    ["impact-quiet-08", "user-quiet-jin", "Sleep Tracking", "BREATHING_VEINS"],
    ["impact-quiet-09", "user-quiet-mina", "Mood Journaling", "WARMTH"],
    ["impact-quiet-10", "user-quiet-jiho", "Walking Goals", "CIRCULATION"],
    ["impact-quiet-11", "user-quiet-yuna", "Guided Breathing", "BREATHING_VEINS"],
    ["impact-quiet-12", "user-quiet-dae", "Recovery Room", "HARMONY"],
    ["impact-quiet-13", "user-quiet-sora", "Meditation Sessions", "BREATHING_EXERCISE"],
    ["impact-quiet-14", "user-quiet-hana", "Mobility Routines", "CIRCULATION"],
    ["impact-quiet-15", "user-quiet-jin", "Grounding Exercises", "HARMONY"],
  ] as const;
  for (const [index, [id, actorUserId, action, metric]] of quietEvents.entries()) {
    const activityCategory =
      metric === "WARMTH" || metric === "HARMONY"
        ? "SOCIAL"
        : metric === "CIRCULATION"
          ? "PHYSICAL"
          : metric === "BREATHING_EXERCISE"
            ? "COGNITIVE"
            : "EMOTIONAL";
    const existingImpactEvent = await prisma.impactEvent.findUnique({ where: { id } });
    if (!existingImpactEvent) {
      await prisma.impactEvent.create({
        data: {
        id,
        squadId: quietSquadId,
        cycleId: quietCycleId,
        actorUserId,
        activityCategory,
        metric,
        delta: decimal(1),
        message: `${actorUserId.replace("user-", "")} completed ${action}; ${metric.replaceAll("_", " ")} +1%`,
        occurredAt: new Date(seedNow.getTime() - (index + 1) * 1_800_000),
        },
      });
    }
  }
}

async function seedHealingChain() {
  for (const [id, userId, bio, specialization] of [
    ["profile-sung-min", "user-sung-min", "Five years into my journey.", "Peer mentor"],
    ["profile-awsaf-onom", awsafId, "Learning to make room for small steps.", "Diabetes recovery"],
    ["profile-seoyun", "user-seoyun", "Two months into my journey.", "New journey support"],
  ] as const) {
    await prisma.healingChainProfile.upsert({
      where: { id },
      update: { userId, bio, specialization, isAvailable: true, preferredCommunicationStyle: "Warm and thoughtful" },
      create: { id, userId, bio, specialization, isAvailable: true, preferredCommunicationStyle: "Warm and thoughtful" },
    });
  }
  for (const [id, mentorId, menteeId] of [
    ["link-sung-min-awsaf-onom", "user-sung-min", awsafId],
    ["link-awsaf-onom-seoyun", awsafId, "user-seoyun"],
  ] as const) {
    await prisma.mentorshipLink.upsert({
      where: { id },
      update: { mentorId, menteeId, conditionId: diabetesId, status: "ACTIVE" },
      create: { id, mentorId, menteeId, conditionId: diabetesId, status: "ACTIVE" },
    });
  }
  for (let index = 0; index < 58; index += 1) {
    const id = `spark-seed-${String(index + 1).padStart(2, "0")}`;
    await prisma.spark.upsert({
      where: { id },
      update: {
        actionId: "spark-encouragement",
        senderId: "user-sung-min",
        recipientId: awsafId,
        mentorshipLinkId: "link-sung-min-awsaf-onom",
        points: ZEROONE_CONFIG.sparkPoints.encouragement,
      },
      create: {
        id,
        actionId: "spark-encouragement",
        senderId: "user-sung-min",
        recipientId: awsafId,
        mentorshipLinkId: "link-sung-min-awsaf-onom",
        points: ZEROONE_CONFIG.sparkPoints.encouragement,
        createdAt: new Date(seedNow.getTime() - (index + 1) * 86_400_000),
      },
    });
  }

  const awsafSparkSeeds = [
    ...Array.from({ length: 12 }, (_, index) => ({
      id: `spark-awsaf-enc-${String(index + 1).padStart(2, "0")}`,
      actionId: "spark-encouragement",
      points: ZEROONE_CONFIG.sparkPoints.encouragement,
      offset: index + 1,
    })),
    ...Array.from({ length: 6 }, (_, index) => ({
      id: `spark-awsaf-voice-${String(index + 1).padStart(2, "0")}`,
      actionId: "spark-voice-support",
      points: ZEROONE_CONFIG.sparkPoints.voiceSupport,
      offset: index + 13,
    })),
    ...Array.from({ length: 6 }, (_, index) => ({
      id: `spark-awsaf-guide-${String(index + 1).padStart(2, "0")}`,
      actionId: "spark-guidance",
      points: ZEROONE_CONFIG.sparkPoints.guidance,
      offset: index + 19,
    })),
  ] as const;

  for (const sparkSeed of awsafSparkSeeds) {
    await prisma.spark.upsert({
      where: { id: sparkSeed.id },
      update: {
        actionId: sparkSeed.actionId,
        senderId: awsafId,
        recipientId: "user-seoyun",
        mentorshipLinkId: "link-awsaf-onom-seoyun",
        points: sparkSeed.points,
      },
      create: {
        id: sparkSeed.id,
        actionId: sparkSeed.actionId,
        senderId: awsafId,
        recipientId: "user-seoyun",
        mentorshipLinkId: "link-awsaf-onom-seoyun",
        points: sparkSeed.points,
        createdAt: new Date(seedNow.getTime() - sparkSeed.offset * 43_200_000),
      },
    });
  }

  await prisma.mentorshipSession.upsert({
    where: { id: "session-sung-min-awsaf" },
    update: {
      mentorshipLinkId: "link-sung-min-awsaf-onom",
      startsAt: day(4),
      status: "CONFIRMED",
    },
    create: {
      id: "session-sung-min-awsaf",
      mentorshipLinkId: "link-sung-min-awsaf-onom",
      startsAt: day(4),
      status: "CONFIRMED",
    },
  });
  await prisma.mentorshipSession.upsert({
    where: { id: "session-awsaf-seoyun" },
    update: {
      mentorshipLinkId: "link-awsaf-onom-seoyun",
      startsAt: day(6),
      status: "CONFIRMED",
    },
    create: {
      id: "session-awsaf-seoyun",
      mentorshipLinkId: "link-awsaf-onom-seoyun",
      startsAt: day(6),
      status: "CONFIRMED",
    },
  });

  await prisma.lantern.upsert({
    where: { userId_cycleId: { userId: awsafId, cycleId: activeCycleId } },
    update: {
      emotionalGrowth: decimal(12),
      supportGiven: 12,
      consistencyPercent: decimal(75),
      compassionActsPercent: decimal(60),
    },
    create: {
      id: "lantern-awsaf-active",
      userId: awsafId,
      cycleId: activeCycleId,
      emotionalGrowth: decimal(12),
      supportGiven: 12,
      consistencyPercent: decimal(75),
      compassionActsPercent: decimal(60),
    },
  });
}

async function seedJournalAndCommunity() {
  const reflections = [
    ["reflection-01", "Today felt heavy, but I still made space to breathe.", ["LONELY", "HOPEFUL"], ["FATIGUE", "OTHERS"]],
    ["reflection-02", "I missed an event and noticed how quickly I blamed myself.", ["FRUSTRATED"], ["MISSED_EVENT", "IDENTITY_LOSS"]],
    ["reflection-03", "A small conversation made the day feel lighter.", ["HOPEFUL"], ["SOCIAL_ISOLATION"]],
  ] as const;
  for (const [id, bodyText, moodTags, emotionalTags] of reflections) {
    const mutableMoodTags = [...moodTags];
    const mutableEmotionalTags = [...emotionalTags];
    await prisma.reflection.upsert({
      where: { id },
        update: { userId: awsafId, bodyText, moodTags: mutableMoodTags, emotionalTags: mutableEmotionalTags, isPrivate: true },
        create: { id, userId: awsafId, bodyText, moodTags: mutableMoodTags, emotionalTags: mutableEmotionalTags, isPrivate: true, createdAt: new Date(seedNow.getTime() - 86_400_000) },
    });
    await prisma.aiFeedback.upsert({
      where: { id: `feedback-${id}` },
      update: { reflectionId: id, model: "seeded-fixture", responseText: "Your honesty gives this feeling a place to be seen. The fact that you noticed what was heavy and still kept going is a real strength." },
      create: { id: `feedback-${id}`, reflectionId: id, model: "seeded-fixture", responseText: "Your honesty gives this feeling a place to be seen. The fact that you noticed what was heavy and still kept going is a real strength." },
    });
  }
  for (const [id, reflectionId, bodyText, emotionalTags] of [
    ["story-01", "reflection-01", "Some days feel heavy, and naming that weight can be the first gentle step.", ["FATIGUE", "OTHERS"]],
    ["story-02", "reflection-02", "Missing something can bring up more than one feeling at once. You are allowed to notice it.", ["MISSED_EVENT", "IDENTITY_LOSS"]],
    ["story-03", "reflection-03", "A small moment of connection can matter even when the day began alone.", ["SOCIAL_ISOLATION"]],
    ["story-04", "reflection-04", "Pain can flare without warning and still leave room for a quieter evening afterward.", ["PAIN_FLARE", "FATIGUE"]],
    ["story-05", "reflection-05", "I stopped doing things I loved for a while. Returning to one small hobby felt like finding a piece of myself again — not all of it, but enough to notice.", ["ABANDONED_HOBBIES", "IDENTITY_LOSS"]],
    ["story-06", "reflection-06", "A hard conversation with someone close reminded me I still deserve patience from myself.", ["RELATIONSHIP_STRUGGLE", "OTHERS"]],
    ["story-07", "reflection-07", "I had everything ready for an appointment I waited months for. The fatigue won before I got out the door.", ["MISSED_EVENT", "FATIGUE"]],
    ["story-08", "reflection-08", "The room was full of people and I still felt like I was watching from far away.", ["SOCIAL_ISOLATION", "OTHERS"]],
    ["story-09", "reflection-09", "I stayed dressed longer than I needed to, hoping the pain would ease enough to leave the house. It did not.", ["PAIN_FLARE", "MISSED_EVENT"]],
    ["story-10", "reflection-10", "I barely recognized myself in old photos — not because I looked different, but because that person seemed so sure.", ["IDENTITY_LOSS", "OTHERS"]],
    ["story-11", "reflection-11", "Two conversations in one day felt like more social energy than I had used all month.", ["FATIGUE", "SOCIAL_ISOLATION"]],
    ["story-12", "reflection-12", "My guitar collected dust for a year. I picked it up for five minutes yesterday and cried — not from sadness exactly, from remembering.", ["ABANDONED_HOBBIES"]],
    ["story-13", "reflection-13", "We sat in silence longer than words would have allowed. That quiet felt heavier than the argument before it.", ["RELATIONSHIP_STRUGGLE", "FATIGUE"]],
    ["story-14", "reflection-14", "I cancelled again. The message I sent was short because I did not have language for how disappointed I felt in my own body.", ["MISSED_EVENT", "PAIN_FLARE"]],
    ["story-15", "reflection-15", "Someone asked how I have been and I said fine before I even thought about it. The loneliness hit harder after that.", ["SOCIAL_ISOLATION", "IDENTITY_LOSS"]],
    ["story-16", "reflection-16", "Hard to explain what today cost me. It was not one thing — just the accumulation of small losses that do not show from outside.", ["OTHERS", "ABANDONED_HOBBIES"]],
    ["story-17", "reflection-17", "I slept and still woke up depleted. My partner made breakfast and I could not find the words to say thank you without crying.", ["FATIGUE", "RELATIONSHIP_STRUGGLE"]],
    ["story-18", "reflection-18", "The flare came on the day I finally felt ready to try something new. I am still sitting with that timing.", ["PAIN_FLARE", "OTHERS"]],
  ] as const) {
    const mutableEmotionalTags = [...emotionalTags];
    await prisma.reflection.upsert({
      where: { id: reflectionId },
      update: {
        userId: awsafId,
        bodyText,
        moodTags: ["OTHER"],
        emotionalTags: mutableEmotionalTags,
        isPrivate: true,
      },
      create: {
        id: reflectionId,
        userId: awsafId,
        bodyText,
        moodTags: ["OTHER"],
        emotionalTags: mutableEmotionalTags,
        isPrivate: true,
        createdAt: new Date(seedNow.getTime() - 172_800_000),
      },
    });
    await prisma.sharedStory.upsert({
      where: { id },
      update: { sourceReflectionId: reflectionId, anonymizedBody: bodyText, emotionalTags: mutableEmotionalTags, isPublished: true },
      create: { id, sourceReflectionId: reflectionId, anonymizedBody: bodyText, emotionalTags: mutableEmotionalTags, isPublished: true },
    });
  }

  for (const [id, stage, occurredAt] of [
    ["milestone-awsaf-before", "BEFORE_DIAGNOSIS", "2022-06-01"],
    ["milestone-awsaf-diagnosis", "DIAGNOSIS", "2023-01-15"],
    ["milestone-awsaf-struggles", "STRUGGLES", "2023-08-01"],
    ["milestone-awsaf-turning", "TURNING_POINT", "2024-03-10"],
    ["milestone-awsaf-improvement", "IMPROVEMENT", "2024-11-01"],
  ] as const) {
    await prisma.journeyMilestone.upsert({
      where: { userId_stage: { userId: awsafId, stage } },
      update: { occurredAt: new Date(`${occurredAt}T00:00:00.000Z`) },
      create: {
        id,
        userId: awsafId,
        stage,
        occurredAt: new Date(`${occurredAt}T00:00:00.000Z`),
      },
    });
  }

  const diabetesCommunityId = "community-diabetes";
  for (const [id, bodyText, createdAt] of [
    ["post-01", "Small steps count today. What helped you make room for yourself?", day(-1)],
    ["post-02", "I tried a slower morning routine and it made the rest of the day feel kinder.", day(-2)],
  ] as const) {
    await prisma.post.upsert({
      where: { id },
      update: { communityId: diabetesCommunityId, authorUserId: awsafId, bodyText, createdAt },
      create: { id, communityId: diabetesCommunityId, authorUserId: awsafId, bodyText, createdAt },
    });
  }
  for (const [id, title, description, startsAt, mode] of [
    ["event-01", "Guided Yoga Session", "A gentle session led by a community professional.", day(2), "ONLINE"],
    ["event-02", "Community Q&A", "Bring questions and listen to shared experience.", day(4), "ONLINE"],
  ] as const) {
    await prisma.event.upsert({
      where: { id },
      update: { communityId: diabetesCommunityId, hostUserId: awsafId, title, description, startsAt, mode, attendeeCount: 24 },
      create: { id, communityId: diabetesCommunityId, hostUserId: awsafId, title, description, startsAt, mode, attendeeCount: 24 },
    });
  }
}

async function seedAwsafOnboarding() {
  await prisma.dailyHealthSummary.upsert({
    where: {
      userId_summaryDate: {
        userId: awsafId,
        summaryDate: new Date("2026-08-27T00:00:00.000Z"),
      },
    },
    update: {
      sleepMinutes: 435,
      sleepGoalMinutes: 480,
      waterGlasses: 6,
      waterGoalGlasses: 8,
      caloriesConsumed: 1850,
      calorieGoal: 2000,
    },
    create: {
      id: "daily-summary-awsaf-onom",
      userId: awsafId,
      summaryDate: new Date("2026-08-27T00:00:00.000Z"),
      sleepMinutes: 435,
      sleepGoalMinutes: 480,
      waterGlasses: 6,
      waterGoalGlasses: 8,
      caloriesConsumed: 1850,
      calorieGoal: 2000,
    },
  });
  await prisma.wellnessAssessment.upsert({
    where: { id: "assessment-awsaf-onom" },
    update: {
      status: "COMPLETED",
      responses: { anxietyFrequency: "Sometimes" },
      completedAt: new Date("2024-01-14T00:00:00.000Z"),
    },
    create: {
      id: "assessment-awsaf-onom",
      userId: awsafId,
      status: "COMPLETED",
      responses: { anxietyFrequency: "Sometimes" },
      completedAt: new Date("2024-01-14T00:00:00.000Z"),
      createdAt: new Date("2024-01-14T00:00:00.000Z"),
    },
  });
  for (const [type, frequency] of [
    ["SMOKING", "NEVER"],
    ["ALCOHOL", "OCCASIONALLY"],
    ["DRUG_USE", "NEVER"],
  ] as const) {
    await prisma.lifestyleHabit.upsert({
      where: { userId_type: { userId: awsafId, type } },
      update: { frequency },
      create: { userId: awsafId, type, frequency },
    });
  }
}

async function main() {
  await seedPlatformConfig();
  await seedCatalogue();
  await seedUsersAndSquads();
  await seedCyclesAndOnggis();
  await seedActivitiesAndChallenges();
  await seedImpactFeed();
  await seedHealingChain();
  await seedJournalAndCommunity();
  await seedAwsafOnboarding();
  console.log("ZeroOne fixture seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
