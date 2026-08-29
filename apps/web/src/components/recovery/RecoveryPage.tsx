import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { NavLink, Outlet } from "react-router-dom";
import {
  useAbandonActivity,
  useActivities,
  useChallenges,
  useClaimActivity,
  useCompleteActivity,
  useImpactFeed,
  useJoinChallenge,
  useRecoveryCycle,
} from "../../api";
import { ZEROONE_CONFIG, type ApiActivity, type ApiChallenge, type ApiImpactEvent, type ApiRecoveryCycle } from "@zeroone/shared";
import { useAuth } from "../../context/AuthContext";
import { useSquadRealtime } from "../../hooks/useSquadRealtime";
import { Button, Card, ProgressBar, Skeleton } from "../primitives";
import { ActivityIcon } from "./activityIcons";
import { displayEnumLabel, formatImpactMetrics, formatRelativeTime, SectionError } from "./shared";

const categoryLabels: Record<string, string> = {
  PHYSICAL: "Physical Recovery",
  COGNITIVE: "Cognitive Recovery",
  EMOTIONAL: "Emotional Recovery",
  SOCIAL: "Social Recovery",
};

const categoryOrder = ["PHYSICAL", "COGNITIVE", "EMOTIONAL", "SOCIAL"] as const;

const tabs = [
  { label: "Activities", to: "/recovery/activities" },
  { label: "Onggi Guardian", to: "/recovery/onggi-guardian" },
  { label: "Squad Details", to: "/recovery/squad-details" },
  { label: "Crystallize Onggi", to: "/recovery/crystallize-onggi" },
  { label: "How It Works", to: "/recovery/how-it-works" },
] as const;

function formatCountdown(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1_000));
  const hours = Math.floor(totalSeconds / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

function useServerCountdown(expiresAt?: string): number | null {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) {
      return undefined;
    }
    const interval = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt) {
    return null;
  }
  return Math.max(0, new Date(expiresAt).getTime() - now);
}

function FreezeCountdown({ expiresAt }: { expiresAt: string }) {
  const remaining = useServerCountdown(expiresAt);
  if (remaining === null || remaining === 0) {
    return <span className="text-body-xs text-text-secondary">Available now</span>;
  }
  return (
    <time className="font-body text-body-xs text-orange" dateTime={expiresAt}>
      Frozen for {formatCountdown(remaining)}
    </time>
  );
}

function ActivityStatus({ activity }: { activity: ApiActivity }) {
  if (activity.freeze) {
    return <FreezeCountdown expiresAt={activity.freeze.expiresAt} />;
  }
  if (activity.currentClaim?.status === "COMPLETED") {
    return <span className="text-body-xs font-weight-button text-primary">Completed</span>;
  }
  if (activity.currentClaim?.status === "CLAIMED") {
    return <span className="text-body-xs font-weight-button text-primary">Committed</span>;
  }
  return <span className="text-body-xs text-text-secondary">{activity.scope === "SHARED_SOCIAL" ? "Squad activity" : "Individual activity"}</span>;
}

function ActivityCard({
  activity,
  isPending,
  onAbandon,
  onClaim,
  onComplete,
}: {
  activity: ApiActivity;
  isPending: boolean;
  onAbandon: () => void;
  onClaim: () => void;
  onComplete: () => void;
}) {
  const isFrozen = Boolean(activity.freeze);
  const claimStatus = activity.currentClaim?.status;
  const isCommitted = claimStatus === "CLAIMED";
  const isCompleted = claimStatus === "COMPLETED";

  return (
    <article className="flex h-full flex-col gap-[var(--space-component-md)] rounded-sm border border-border-subtle bg-surface-default p-[var(--space-card-padding)] shadow-card">
      <div className="flex min-w-0 items-start gap-[var(--space-component-md)]">
        <span className="flex size-[var(--space-48)] shrink-0 items-center justify-center rounded-round bg-surface-blue-light">
          <ActivityIcon activityId={activity.id} className="size-[var(--space-24)] text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-[var(--space-component-sm)]">
            <h3 className="font-body text-body-lg font-weight-button text-text-primary">{activity.title}</h3>
            <span className="shrink-0 rounded-pill bg-surface-success px-[var(--space-component-sm)] py-[var(--space-component-xs)] text-body-xs font-weight-button text-primary">
              {activity.points} pts
            </span>
          </div>
          <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">{activity.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-component-md)] border-t border-border-subtle pt-[var(--space-component-md)]">
        <ActivityStatus activity={activity} />
        {isCompleted ? (
          <Button disabled size="sm" variant="secondary">
            Completed
          </Button>
        ) : isCommitted ? (
          <div className="flex flex-wrap gap-[var(--space-component-sm)]">
            <Button disabled={isPending} isLoading={isPending} onClick={onComplete} size="sm">
              Complete
            </Button>
            <Button disabled={isPending} onClick={onAbandon} size="sm" variant="secondary">
              Abandon
            </Button>
          </div>
        ) : (
          <Button disabled={isFrozen || isPending} isLoading={isPending} onClick={onClaim} size="sm">
            {isFrozen ? "Frozen" : "Claim"}
          </Button>
        )}
      </div>
    </article>
  );
}

function ActivityCatalogue({
  activities,
  error,
  isLoading,
  onAbandon,
  onClaim,
  onComplete,
  pendingId,
}: {
  activities: ApiActivity[];
  error?: Error | null;
  isLoading: boolean;
  onAbandon: (activity: ApiActivity) => void;
  onClaim: (activity: ApiActivity) => void;
  onComplete: (activity: ApiActivity) => void;
  pendingId?: string;
}) {
  const groupedActivities = useMemo(() => {
    const grouped = new Map<string, ApiActivity[]>();
    for (const category of categoryOrder) {
      grouped.set(category, []);
    }
    for (const activity of activities) {
      const current = grouped.get(activity.category) ?? [];
      current.push(activity);
      grouped.set(activity.category, current);
    }
    return [...grouped.entries()].filter(([, categoryActivities]) => categoryActivities.length > 0);
  }, [activities]);

  return (
    <section aria-labelledby="activity-catalogue-title">
      <div className="flex items-center justify-between gap-[var(--space-component-md)]">
        <h2 className="text-heading-sm font-weight-heading text-text-primary" id="activity-catalogue-title">
          Recovery Activities
        </h2>
        <span className="text-body-sm text-text-secondary">{activities.length} available</span>
      </div>
      {isLoading ? (
        <div className="mt-[var(--space-layout)] grid gap-[var(--space-component-md)] md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          <Skeleton className="h-[var(--space-155-222)]" />
          <Skeleton className="h-[var(--space-155-222)]" />
          <Skeleton className="h-[var(--space-155-222)]" />
          <Skeleton className="h-[var(--space-155-222)]" />
        </div>
      ) : error ? (
        <div className="mt-[var(--space-layout)]">
          <SectionError message={error.message} />
        </div>
      ) : groupedActivities.length === 0 ? (
        <p className="mt-[var(--space-layout)] rounded-sm bg-surface-success p-[var(--space-card-padding)] text-body-sm text-text-primary">
          Your activity catalogue is being prepared for this cycle.
        </p>
      ) : (
        <div className="mt-[var(--space-layout)] flex flex-col gap-[var(--space-layout)]">
          {groupedActivities.map(([category, categoryActivities]) => (
            <section key={category}>
              <h3 className="text-body-lg font-weight-button text-text-primary">
                {categoryLabels[category] ?? displayEnumLabel(category)}
              </h3>
              <div className="mt-[var(--space-component-md)] grid items-stretch gap-[var(--space-component-md)] md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {categoryActivities.map((activity) => (
                  <ActivityCard
                    activity={activity}
                    isPending={pendingId === activity.id}
                    key={activity.id}
                    onAbandon={() => onAbandon(activity)}
                    onClaim={() => onClaim(activity)}
                    onComplete={() => onComplete(activity)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

function AiSuggestions({ activities, error, isLoading }: { activities: ApiActivity[]; error?: Error | null; isLoading: boolean }) {
  const suggestions = activities.slice(0, ZEROONE_CONFIG.dailyDoublePointsActivities);
  return (
    <Card variant="ai">
      <div className="flex flex-wrap items-end justify-between gap-[var(--space-component-md)]">
        <div>
          <h2 className="text-heading-sm font-weight-heading">AI Suggestions</h2>
          <p className="mt-[var(--space-component-xs)] text-body-sm">Small steps selected for your recovery today.</p>
        </div>
        <span className="text-body-sm">Personalized for you</span>
      </div>
      {isLoading ? (
        <div className="mt-[var(--space-component-lg)] grid gap-[var(--space-component-md)] sm:grid-cols-2 2xl:grid-cols-4">
          <Skeleton className="h-[var(--space-80-151)]" />
          <Skeleton className="h-[var(--space-80-151)]" />
          <Skeleton className="h-[var(--space-80-151)]" />
          <Skeleton className="h-[var(--space-80-151)]" />
        </div>
      ) : error ? (
        <div className="mt-[var(--space-component-lg)]">
          <SectionError message={error.message} />
        </div>
      ) : suggestions.length === 0 ? (
        <p className="mt-[var(--space-component-lg)] rounded-sm bg-surface-default p-[var(--space-card-padding)] text-body-sm text-text-ai">
          Suggestions will appear after your first activity.
        </p>
      ) : (
        <div className="mt-[var(--space-component-lg)] grid gap-[var(--space-component-md)] sm:grid-cols-2 2xl:grid-cols-4">
          {suggestions.map((activity) => (
            <div className="rounded-sm bg-surface-default p-[var(--space-card-padding)] text-text-ai" key={activity.id}>
              <p className="truncate font-body text-body font-weight-button">{activity.title}</p>
              <p className="mt-[var(--space-component-xs)] line-clamp-2 text-body-sm text-text-secondary">{activity.description}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function ChallengeCard({ challenge, isPending, onJoin }: { challenge: ApiChallenge; isPending: boolean; onJoin: () => void }) {
  const deadline = new Date(challenge.deadline);
  return (
    <article className="rounded-sm border border-border-subtle bg-surface-default p-[var(--space-card-padding)]">
      <div className="flex items-start justify-between gap-[var(--space-component-md)]">
        <h3 className="font-body text-body font-weight-button text-text-primary">{challenge.title}</h3>
        <span className="shrink-0 text-body-xs font-weight-button text-primary">{challenge.points} pts</span>
      </div>
      <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">{challenge.description}</p>
      <div className="mt-[var(--space-component-md)] flex flex-wrap items-center justify-between gap-[var(--space-component-sm)] text-body-xs text-text-secondary">
        <span>{challenge.participantCount} participating</span>
        <time dateTime={challenge.deadline}>Ends {deadline.toLocaleDateString()}</time>
      </div>
      <Button
        className="mt-[var(--space-component-md)] w-full"
        disabled={challenge.joined || isPending}
        isLoading={isPending}
        onClick={onJoin}
        size="sm"
        variant="secondary"
      >
        {challenge.joined ? "Joined" : "Join challenge"}
      </Button>
    </article>
  );
}

function SquadChallenges({
  challenges,
  error,
  isLoading,
  onJoin,
  pendingId,
}: {
  challenges: ApiChallenge[];
  error?: Error | null;
  isLoading: boolean;
  onJoin: (challenge: ApiChallenge) => void;
  pendingId?: string;
}) {
  return (
    <section aria-labelledby="squad-challenges-title">
      <div className="flex items-center justify-between gap-[var(--space-component-md)]">
        <h2 className="text-heading-sm font-weight-heading text-text-primary" id="squad-challenges-title">
          Squad Recovery Challenges
        </h2>
        <span className="text-body-sm text-text-secondary">{challenges.length} active</span>
      </div>
      {isLoading ? (
        <div className="mt-[var(--space-layout)] grid gap-[var(--space-component-md)] md:grid-cols-2">
          <Skeleton className="h-[var(--space-155-222)]" />
          <Skeleton className="h-[var(--space-155-222)]" />
        </div>
      ) : error ? (
        <div className="mt-[var(--space-layout)]">
          <SectionError message={error.message} />
        </div>
      ) : challenges.length === 0 ? (
        <p className="mt-[var(--space-layout)] rounded-sm bg-surface-success p-[var(--space-card-padding)] text-body-sm text-text-primary">
          New squad challenges will appear here as your group settles into the cycle.
        </p>
      ) : (
        <div className="mt-[var(--space-layout)] grid gap-[var(--space-component-md)] md:grid-cols-2">
          {challenges.map((challenge) => (
            <ChallengeCard
              challenge={challenge}
              isPending={pendingId === challenge.id}
              key={challenge.id}
              onJoin={() => onJoin(challenge)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function FreezePanel({ activities }: { activities: ApiActivity[] }) {
  const frozenActivities = activities.filter((activity) => activity.freeze);
  const nextFreeze = frozenActivities
    .map((activity) => activity.freeze)
    .filter((freeze): freeze is NonNullable<ApiActivity["freeze"]> => Boolean(freeze))
    .sort((left, right) => new Date(left.expiresAt).getTime() - new Date(right.expiresAt).getTime())[0];

  return (
    <Card variant="outlined">
      <h2 className="text-body-lg font-weight-button text-text-primary">6-Hour Freeze</h2>
      {nextFreeze ? (
        <>
          <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
            A skipped commitment is paused before it can be chosen again.
          </p>
          <div className="mt-[var(--space-component-lg)] rounded-sm bg-surface-blue-light p-[var(--space-card-padding)]">
            <p className="text-body-sm font-weight-button text-text-primary">
              {frozenActivities.length} {frozenActivities.length === 1 ? "activity" : "activities"} frozen
            </p>
            <div className="mt-[var(--space-component-sm)]">
              <FreezeCountdown expiresAt={nextFreeze.expiresAt} />
            </div>
          </div>
        </>
      ) : (
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
          No activities are frozen. Choose a commitment that feels right for today.
        </p>
      )}
    </Card>
  );
}

function ImpactPanel({ error, events, isLoading }: { error?: Error | null; events: ApiImpactEvent[]; isLoading: boolean }) {
  return (
    <Card variant="outlined">
      <h2 className="text-body-lg font-weight-button text-text-primary">Live Squad Impact</h2>
      {isLoading ? (
        <div className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-sm)]">
          <Skeleton className="h-[var(--space-45)]" />
          <Skeleton className="h-[var(--space-45)]" />
        </div>
      ) : error ? (
        <div className="mt-[var(--space-component-md)]">
          <SectionError message={error.message} />
        </div>
      ) : events.length === 0 ? (
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
          Your squad’s first completed activity will appear here.
        </p>
      ) : (
        <div className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-sm)]">
          {events.slice(0, ZEROONE_CONFIG.dailyDoublePointsActivities).map((event) => (
            <div className="rounded-sm bg-surface-blue-light p-[var(--space-component-sm)]" key={event.id}>
              <p className="text-body-xs text-text-primary">{event.message}</p>
              <div className="mt-[var(--space-component-xs)] flex items-center justify-between gap-[var(--space-component-sm)]">
                <p className="text-body-xs font-weight-button text-primary">
                  {formatImpactMetrics(event.metrics ?? [{ metric: event.metric, delta: event.delta }])}
                </p>
                <time className="shrink-0 text-body-xs text-text-secondary" dateTime={event.occurredAt}>
                  {formatRelativeTime(event.occurredAt)}
                </time>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function CycleHeader({
  cycle,
  error,
  isLoading,
}: {
  cycle: ApiRecoveryCycle | undefined;
  error?: Error | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-[var(--space-component-md)]">
        <Skeleton className="h-[var(--space-60)] w-full" />
        <Skeleton className="h-[var(--space-component-sm)] w-full" />
      </div>
    );
  }
  if (error) {
    return <SectionError message={error.message} />;
  }
  if (!cycle) {
    return <p className="text-body-sm text-text-secondary">Your recovery cycle will appear here once your squad is ready.</p>;
  }
  const daysRemaining = Math.max(cycle.cycleDays - cycle.cycleDay, 0);
  const progress = cycle.cycleDays > 0 ? (cycle.cycleDay / cycle.cycleDays) * 100 : 0;
  return (
    <Card variant="outlined">
      <div className="flex flex-wrap items-end justify-between gap-[var(--space-component-md)]">
        <div>
          <p className="text-body-sm text-text-secondary">Current recovery cycle</p>
          <h2 className="mt-[var(--space-component-xs)] text-heading-sm font-weight-heading text-text-primary">
            Day {cycle.cycleDay} of {cycle.cycleDays}
          </h2>
        </div>
        <p className="text-body-sm font-weight-button text-primary">{daysRemaining} days remaining</p>
      </div>
      <ProgressBar className="mt-[var(--space-component-lg)]" showValue={false} value={progress} />
    </Card>
  );
}

export function RecoveryPage() {
  useSquadRealtime();

  return (
    <div className="mx-auto flex w-full max-w-[var(--space-1457)] flex-col gap-[var(--space-layout)]">
      <header>
        <p className="text-body-sm text-text-secondary">Collective healing, one commitment at a time.</p>
        <h1 className="mt-[var(--space-component-xs)] text-heading-md font-weight-heading text-text-heading">Recovery</h1>
        <nav aria-label="Recovery sections" className="mt-[var(--space-layout)] flex flex-wrap gap-[var(--space-component-sm)]">
          {tabs.map((tab) => (
            <NavLink
              className={({ isActive }) =>
                `rounded-sm border px-[var(--space-component-md)] py-[var(--space-component-sm)] text-body-sm transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-surface-default"
                    : "border-default bg-surface-default text-text-primary hover:bg-surface-success"
                }`
              }
              key={tab.to}
              to={tab.to}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

export function ActivitiesPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const cycle = useRecoveryCycle({ token });
  const activities = useActivities({ token });
  const challenges = useChallenges({ token });
  const impactFeed = useImpactFeed({ limit: 5, token });
  const claimActivity = useClaimActivity();
  const completeActivity = useCompleteActivity();
  const abandonActivity = useAbandonActivity();
  const joinChallenge = useJoinChallenge();
  const [pendingId, setPendingId] = useState<string>();
  const [actionError, setActionError] = useState<string>();

  async function refreshActivities() {
    await activities.refetch();
    await queryClient.invalidateQueries({ queryKey: ["recovery-cycle"] });
    await queryClient.invalidateQueries({ queryKey: ["impact-feed"] });
  }

  async function runActivityAction(id: string, action: () => Promise<unknown>) {
    setActionError(undefined);
    setPendingId(id);
    try {
      await action();
      await refreshActivities();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to update this activity.");
    } finally {
      setPendingId(undefined);
    }
  }

  function claim(activity: ApiActivity) {
    void runActivityAction(activity.id, () => claimActivity.mutateAsync({ id: activity.id, token }));
  }

  function complete(activity: ApiActivity) {
    void runActivityAction(activity.id, () => completeActivity.mutateAsync({ id: activity.currentClaim?.id ?? "", token }));
  }

  function abandon(activity: ApiActivity) {
    void runActivityAction(activity.id, () => abandonActivity.mutateAsync({ id: activity.currentClaim?.id ?? "", token }));
  }

  async function join(challenge: ApiChallenge) {
    setActionError(undefined);
    setPendingId(challenge.id);
    try {
      await joinChallenge.mutateAsync({ id: challenge.id, token });
      await challenges.refetch();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to join this challenge.");
    } finally {
      setPendingId(undefined);
    }
  }

  return (
    <div className="flex flex-col gap-[var(--space-layout)]">
      <CycleHeader cycle={cycle.data?.cycle} error={cycle.error} isLoading={cycle.isLoading} />
      {actionError && <SectionError message={actionError} />}
      <AiSuggestions activities={activities.data?.activities ?? []} error={activities.error} isLoading={activities.isLoading} />
      <div className="grid gap-[var(--space-layout)] lg:grid-cols-2">
        <ImpactPanel
          error={impactFeed.error}
          events={impactFeed.data?.events ?? []}
          isLoading={impactFeed.isLoading}
        />
        <FreezePanel activities={activities.data?.activities ?? []} />
      </div>
      <ActivityCatalogue
        activities={activities.data?.activities ?? []}
        error={activities.error}
        isLoading={activities.isLoading}
        onAbandon={abandon}
        onClaim={claim}
        onComplete={complete}
        pendingId={pendingId}
      />
      <SquadChallenges
        challenges={challenges.data?.challenges ?? []}
        error={challenges.error}
        isLoading={challenges.isLoading}
        onJoin={(challenge) => void join(challenge)}
        pendingId={pendingId}
      />
    </div>
  );
}

export function RecoveryPlaceholder({ title }: { title: string }) {
  return (
    <Card className="flex min-h-[var(--space-328-617)] flex-col items-center justify-center text-center" variant="outlined">
      <h2 className="text-heading-sm font-weight-heading text-text-primary">{title}</h2>
      <p className="mt-[var(--space-component-md)] text-body-lg text-text-secondary">Coming soon</p>
    </Card>
  );
}
