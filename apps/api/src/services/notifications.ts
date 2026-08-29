import { groupImpactEvents } from "@zeroone/shared";
import { getPrisma } from "../db.js";

const CHALLENGE_HORIZON_MS = 7 * 24 * 60 * 60 * 1_000;
const IMPACT_FETCH_LIMIT = 30;

const categoryTitles: Record<string, string> = {
  PHYSICAL: "Physical recovery update",
  COGNITIVE: "Cognitive recovery update",
  EMOTIONAL: "Emotional recovery update",
  SOCIAL: "Social recovery update",
};

export interface NotificationRecord {
  id: string;
  type: "IMPACT" | "CHALLENGE_DEADLINE";
  title: string;
  body: string;
  timestamp: string;
  href: string;
}

function impactTitle(category: string): string {
  return categoryTitles[category] ?? "Squad activity update";
}

function formatDeadlineBody(title: string, deadline: Date): string {
  const msRemaining = deadline.getTime() - Date.now();
  if (msRemaining <= 0) {
    return `${title} deadline has passed.`;
  }
  const hoursRemaining = Math.ceil(msRemaining / (60 * 60 * 1_000));
  if (hoursRemaining < 24) {
    return `${title} ends in ${hoursRemaining} hour${hoursRemaining === 1 ? "" : "s"}.`;
  }
  const daysRemaining = Math.ceil(hoursRemaining / 24);
  return `${title} ends in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}.`;
}

async function getActiveSquadId(userId: string): Promise<string | null> {
  const prisma = getPrisma();
  const membership = await prisma.squadMembership.findFirst({
    where: { userId, status: "ACTIVE" },
    select: { squadId: true },
  });
  return membership?.squadId ?? null;
}

export async function listNotificationRecords(
  userId: string,
  limit = 20,
): Promise<NotificationRecord[]> {
  const squadId = await getActiveSquadId(userId);
  if (!squadId) {
    return [];
  }

  const prisma = getPrisma();
  const now = new Date();
  const challengeCutoff = new Date(now.getTime() + CHALLENGE_HORIZON_MS);

  const [impactRows, challenges] = await Promise.all([
    prisma.impactEvent.findMany({
      where: { squadId },
      orderBy: { occurredAt: "desc" },
      take: IMPACT_FETCH_LIMIT,
      include: {
        actor: { select: { id: true, name: true, avatarUrl: true } },
        activityClaim: { include: { activity: true } },
      },
    }),
    prisma.squadChallenge.findMany({
      where: {
        squadId,
        deadline: { gte: now, lte: challengeCutoff },
      },
      orderBy: { deadline: "asc" },
      take: 10,
    }),
  ]);

  const serializedImpact = impactRows.map(({ actor, activityClaim, delta, activityClaimId, metric, ...event }) => ({
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

  const impactNotifications: NotificationRecord[] = groupImpactEvents(serializedImpact).map((event) => ({
    id: `impact:${event.id}`,
    type: "IMPACT",
    title: impactTitle(event.activityCategory),
    body: event.message,
    timestamp: event.occurredAt,
    href: "/recovery/activities",
  }));

  const challengeNotifications: NotificationRecord[] = challenges.map((challenge) => ({
    id: `challenge:${challenge.id}`,
    type: "CHALLENGE_DEADLINE",
    title: "Squad challenge deadline",
    body: formatDeadlineBody(challenge.title, challenge.deadline),
    timestamp: challenge.deadline.toISOString(),
    href: "/recovery/activities",
  }));

  return [...challengeNotifications, ...impactNotifications]
    .sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
    .slice(0, limit);
}

export async function getReadNotificationKeys(userId: string): Promise<Set<string>> {
  const prisma = getPrisma();
  const rows = await prisma.notificationRead.findMany({
    where: { userId },
    select: { notificationKey: true },
  });
  return new Set(rows.map((row) => row.notificationKey));
}

export async function attachReadState(
  userId: string,
  notifications: NotificationRecord[],
): Promise<Array<NotificationRecord & { read: boolean }>> {
  const readKeys = await getReadNotificationKeys(userId);
  return notifications.map((notification) => ({
    ...notification,
    read: readKeys.has(notification.id),
  }));
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  const notifications = await listNotificationRecords(userId, 50);
  const readKeys = await getReadNotificationKeys(userId);
  return notifications.filter((notification) => !readKeys.has(notification.id)).length;
}

export async function markNotificationsRead(
  userId: string,
  options: { ids?: string[]; all?: boolean },
): Promise<void> {
  const prisma = getPrisma();
  let keys: string[];

  if (options.all) {
    const notifications = await listNotificationRecords(userId, 50);
    keys = notifications.map((notification) => notification.id);
  } else if (options.ids?.length) {
    keys = options.ids;
  } else {
    return;
  }

  if (keys.length === 0) {
    return;
  }

  await prisma.notificationRead.createMany({
    data: keys.map((notificationKey) => ({ userId, notificationKey })),
    skipDuplicates: true,
  });
}
