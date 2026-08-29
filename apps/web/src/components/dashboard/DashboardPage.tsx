import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useActivities,
  useClaimActivity,
  useCommunities,
  useDashboardSummary,
  useHealingChain,
  useImpactFeed,
  usePosts,
  useRecoveryCycle,
  useSession,
  useSquad,
} from "../../api";
import type {
  ApiActivity,
  ApiDashboardSummary,
  ApiOnggiState,
  ApiPost,
} from "@zeroone/shared";
import { useAuth } from "../../context/AuthContext";
import { Avatar, Button, Card, ProgressBar, Skeleton } from "../primitives";
import { ActivityIcon } from "../recovery/activityIcons";
import { SupportResourcesModal } from "./SupportResourcesModal";

const waterIcon = "/assets/dashboard-water.svg";
const calorieIcon = "/assets/dashboard-calorie.svg";
const sleepIcon = "/assets/dashboard-sleep.svg";
const onggiImage = "/assets/onggi-vessel.png";
const supportImage = "/assets/dashboard-support.png";

function SectionLoading() {
  return <Skeleton className="h-[var(--space-128-856)] w-full" />;
}

function SectionError({ message }: { message: string }) {
  return (
    <p className="rounded-sm bg-surface-success p-[var(--space-component-md)] text-body-sm text-orange" role="alert">
      {message}
    </p>
  );
}

function formatSleep(minutes: number | null): string {
  if (minutes === null) {
    return "Not tracked";
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}H ${String(remainingMinutes).padStart(2, "0")}M`;
}

function formatMetric(value: number | null, goal: number | null, suffix: string): string {
  if (value === null) {
    return "Not tracked";
  }
  const formattedValue = value.toLocaleString();
  const formattedGoal = goal === null ? null : goal.toLocaleString();
  return formattedGoal === null ? `${formattedValue}${suffix}` : `${formattedValue}/${formattedGoal}${suffix}`;
}

function SummaryMetric({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-[var(--space-103-297)] min-w-0 flex-col items-center justify-center gap-[var(--space-component-xs)] p-[var(--space-component-md)] text-center">
      <div className="flex size-[var(--space-64-428)] shrink-0 items-center justify-center rounded-round bg-surface-default shadow-stat-icon">
        <img alt="" className="size-[var(--space-40)] object-contain" src={icon} />
      </div>
      <div className="flex min-w-0 max-w-full flex-col items-center">
        <p className="whitespace-nowrap font-body text-body-sm text-text-primary">{label}</p>
        <p className="whitespace-nowrap font-body text-body font-weight-heading text-primary">{value}</p>
      </div>
    </div>
  );
}

function ActiveSummary({
  error,
  isLoading,
  summary,
}: {
  error?: Error | null;
  isLoading: boolean;
  summary: ApiDashboardSummary | null | undefined;
}) {
  return (
    <Card className="min-h-[var(--space-275-078)]" variant="default">
      <div className="flex items-center justify-between gap-[var(--space-component-md)]">
        <h2 className="text-heading-sm font-weight-heading text-text-primary">Active Summary</h2>
        <span className="rounded-sm border border-default px-[var(--space-component-md)] py-[var(--space-component-xs)] text-body-sm text-text-primary">
          Today
        </span>
      </div>
      {isLoading ? (
        <div className="mt-[var(--space-layout)] grid grid-cols-2 gap-[var(--space-component-md)]">
          <Skeleton className="h-[var(--space-103-297)]" />
          <Skeleton className="h-[var(--space-103-297)]" />
          <Skeleton className="h-[var(--space-103-297)]" />
        </div>
      ) : error ? (
        <div className="mt-[var(--space-layout)]">
          <SectionError message={error.message} />
        </div>
      ) : summary ? (
        <div className="mt-[var(--space-layout)] grid grid-cols-2 overflow-hidden rounded-sm border border-border-subtle">
          <SummaryMetric
            icon={sleepIcon}
            label="Sleep"
            value={`${formatSleep(summary.sleepMinutes)}${summary.sleepGoalMinutes === null ? "" : ` / ${formatSleep(summary.sleepGoalMinutes)}`}`}
          />
          <SummaryMetric
            icon={calorieIcon}
            label="Calories"
            value={formatMetric(summary.caloriesConsumed, summary.calorieGoal, "")}
          />
          <SummaryMetric
            icon={waterIcon}
            label="Water"
            value={formatMetric(summary.waterGlasses, summary.waterGoalGlasses, "")}
          />
        </div>
      ) : (
        <div className="mt-[var(--space-layout)] rounded-sm bg-surface-success p-[var(--space-card-padding)] text-body-sm text-text-primary">
          Your daily health summary will appear here as you build your routine.
        </div>
      )}
    </Card>
  );
}

function AiSuggestions({ activities }: { activities: ApiActivity[] }) {
  const suggestions = activities.slice(0, 3);
  return (
    <Card className="min-h-[var(--space-275-078)]" variant="ai">
      <h2 className="text-heading-sm font-weight-heading">AI Suggestions for You</h2>
      {suggestions.length === 0 ? (
        <p className="mt-[var(--space-layout)] rounded-sm bg-surface-default p-[var(--space-card-padding)] text-body-sm text-text-ai">
          Personalized suggestions will appear after your first activity.
        </p>
      ) : (
        <div className="mt-[var(--space-component-lg)] flex flex-col gap-[var(--space-component-md)]">
          {suggestions.map((activity) => (
            <div className="rounded-sm bg-surface-default p-[var(--space-card-padding)] text-text-ai" key={activity.id}>
              <p className="font-body text-body font-weight-button">{activity.title}</p>
              <p className="mt-[var(--space-component-xs)] line-clamp-2 font-body text-body-sm text-text-secondary">
                {activity.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function ActivityCard({
  activity,
  isClaimed,
  isClaiming,
  onClaim,
}: {
  activity: ApiActivity;
  isClaimed: boolean;
  isClaiming: boolean;
  onClaim: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-[var(--space-component-md)] rounded-sm border border-border-subtle bg-surface-blue-light px-[var(--space-card-padding)] py-[var(--space-component-sm)]">
      <div className="flex min-w-0 items-center gap-[var(--space-component-md)]">
        <span className="flex size-[var(--space-40)] shrink-0 items-center justify-center rounded-round bg-surface-default">
          <ActivityIcon activityId={activity.id} className="size-[var(--space-24)] text-primary" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-body text-body-sm font-weight-label text-text-primary">{activity.title}</p>
          <p className="font-body text-body-xs font-weight-button text-primary">{activity.points} pts</p>
        </div>
      </div>
      <Button
        disabled={isClaimed || isClaiming}
        isLoading={isClaiming}
        onClick={onClaim}
        size="sm"
        variant="secondary"
      >
        {isClaimed ? "Claimed" : "Claim"}
      </Button>
    </div>
  );
}

function RecoveryActivities({
  activities,
  error,
  isLoading,
  onClaim,
  pendingId,
  claimedIds,
}: {
  activities: ApiActivity[];
  error?: Error | null;
  isLoading: boolean;
  onClaim: (activity: ApiActivity) => void;
  pendingId?: string;
  claimedIds: Set<string>;
}) {
  return (
    <Card className="min-h-[var(--space-275-078)]" variant="default">
      <div className="flex items-center justify-between gap-[var(--space-component-md)]">
        <h2 className="text-heading-sm font-weight-heading text-text-primary">Recovery Activities</h2>
        <Link className="text-body-sm font-weight-button text-primary" to="/recovery">
          View all
        </Link>
      </div>
      {isLoading ? (
        <div className="mt-[var(--space-layout)] flex flex-col gap-[var(--space-component-md)]">
          <Skeleton className="h-[var(--space-45)]" />
          <Skeleton className="h-[var(--space-45)]" />
          <Skeleton className="h-[var(--space-45)]" />
        </div>
      ) : error ? (
        <div className="mt-[var(--space-layout)]">
          <SectionError message={error.message} />
        </div>
      ) : activities.length === 0 ? (
        <p className="mt-[var(--space-layout)] rounded-sm bg-surface-success p-[var(--space-card-padding)] text-body-sm text-text-primary">
          Your first recovery activity will appear here when one is ready.
        </p>
      ) : (
        <div className="mt-[var(--space-layout)] flex flex-col gap-[var(--space-component-md)]">
          {activities.slice(0, 3).map((activity) => (
            <ActivityCard
              activity={activity}
              isClaimed={claimedIds.has(activity.id)}
              isClaiming={pendingId === activity.id}
              key={activity.id}
              onClaim={() => onClaim(activity)}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

const onggiMetrics = [
  ["breathingExercise", "Breathing Exercise"],
  ["breathingVeins", "Breathing Veins"],
  ["warmth", "Warmth"],
  ["circulation", "Circulation"],
  ["harmony", "Harmony"],
] as const;

function OnggiGuardian({
  cycle,
  error,
  isLoading,
}: {
  cycle: { cycleDay: number; cycleDays: number; onggiState: ApiOnggiState | null } | undefined;
  error?: Error | null;
  isLoading: boolean;
}) {
  return (
    <Card className="min-h-[var(--space-328-617)] bg-surface-blue-light" variant="muted">
      <div className="flex items-center justify-between gap-[var(--space-component-md)]">
        <h2 className="text-heading-sm font-weight-heading text-text-primary">Onggi Guardian</h2>
        {cycle && (
          <span className="text-body-sm text-text-secondary">
            Day {cycle.cycleDay} / {cycle.cycleDays}
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="mt-[var(--space-component-lg)] flex flex-col gap-[var(--space-component-md)]">
          <Skeleton className="mx-auto h-[var(--space-121-792)] w-[var(--space-103-297)]" />
          <Skeleton className="h-[var(--space-45)]" />
          <Skeleton className="h-[var(--space-45)]" />
        </div>
      ) : error ? (
        <div className="mt-[var(--space-layout)]">
          <SectionError message={error.message} />
        </div>
      ) : !cycle?.onggiState ? (
        <p className="mt-[var(--space-layout)] rounded-sm bg-surface-default p-[var(--space-card-padding)] text-body-sm text-text-primary">
          Your squad’s Onggi will begin to glow after your first shared activity.
        </p>
      ) : (
        <>
          <img alt="" className="mx-auto mt-[var(--space-component-lg)] h-[var(--space-121-792)] w-[var(--space-103-297)] object-contain" src={onggiImage} />
          <div className="mt-[var(--space-component-lg)] flex flex-col gap-[var(--space-component-md)]">
            {onggiMetrics.slice(0, 3).map(([key, label]) => (
              <ProgressBar
                key={key}
                label={label}
                showValue
                value={cycle.onggiState?.[key]}
              />
            ))}
          </div>
          <Link className="mt-[var(--space-component-lg)] block text-center text-body-sm font-weight-button text-primary" to="/recovery">
            View full details
          </Link>
        </>
      )}
    </Card>
  );
}

function HealingChainPreview({
  data,
  error,
  isLoading,
}: {
  error?: Error | null;
  isLoading: boolean;
  data?: {
    connectionStatus: string;
    mentor: { person: { name: string | null }; condition: { name: string } } | null;
    mentee: { person: { name: string | null } } | null;
  };
}) {
  const isConnected = data?.connectionStatus === "connected";
  return (
    <Card className="min-h-[var(--space-328-617)]" variant="default">
      <h2 className="text-heading-sm font-weight-heading text-text-primary">Healing Chain</h2>
      {isLoading ? (
        <div className="mt-[var(--space-layout)] flex flex-col gap-[var(--space-component-md)]">
          <Skeleton className="h-[var(--space-45)]" />
          <Skeleton className="h-[var(--space-45)]" />
          <Skeleton className="h-[var(--space-45)]" />
        </div>
      ) : error ? (
        <div className="mt-[var(--space-layout)]">
          <SectionError message={error.message} />
        </div>
      ) : data?.mentor || data?.mentee ? (
        <>
          <div className="mt-[var(--space-layout)] rounded-sm border border-border-subtle p-[var(--space-card-padding)]">
            <p className="font-body text-body-sm font-weight-button text-primary">
              {isConnected ? "You are connected" : "Your chain is forming"}
            </p>
            <p className="mt-[var(--space-component-xs)] font-body text-body-sm text-text-secondary">
              {data.mentor && data.mentee
                ? `Mentor: ${data.mentor.person.name ?? "Connected"} · Mentee: ${data.mentee.person.name ?? "Connected"}`
                : data.mentor
                  ? `Mentor: ${data.mentor.person.name ?? "Connected"}`
                  : `Mentee: ${data.mentee?.person.name ?? "Connected"}`}
            </p>
          </div>
          <Link className="mt-[var(--space-layout)] block text-center text-body-sm font-weight-button text-primary" to="/healing-chain">
            View Healing Chain
          </Link>
        </>
      ) : (
        <p className="mt-[var(--space-layout)] rounded-sm bg-surface-success p-[var(--space-card-padding)] text-body-sm text-text-primary">
          Your Healing Chain connection will appear here when it is ready.
        </p>
      )}
    </Card>
  );
}

function JournalAbout() {
  return (
    <Card className="min-h-[var(--space-328-617)]" variant="doctor">
      <h2 className="text-heading-sm font-weight-heading">About Healing Journal</h2>
      <p className="mt-[var(--space-component-lg)] text-body-sm">
        Healing Chain connects you with a mentor who has been on this journey longer, and a mentee who is earlier in their journey.
      </p>
      <ul className="mt-[var(--space-component-lg)] flex flex-col gap-[var(--space-component-md)] text-body-sm">
        <li>Get guidance from your mentor</li>
        <li>Support and inspire your mentee</li>
        <li>Earn points and make an impact</li>
        <li>Build a circle of hope and healing</li>
      </ul>
      <Link className="mt-[var(--space-layout)] block text-center text-body-sm font-weight-button text-surface-default" to="/healing-journal">
        Learn more
      </Link>
    </Card>
  );
}

function CommunityUpdates({
  error,
  isLoading,
  posts,
}: {
  error?: Error | null;
  isLoading: boolean;
  posts: ApiPost[];
}) {
  return (
    <Card className="min-h-[var(--space-328-617)]" variant="default">
      <div className="flex items-center justify-between gap-[var(--space-component-md)]">
        <h2 className="text-heading-sm font-weight-heading text-text-primary">Community Updates</h2>
        <Link className="text-body-sm font-weight-button text-primary" to="/community">
          View all
        </Link>
      </div>
      {isLoading ? (
        <div className="mt-[var(--space-layout)] flex flex-col gap-[var(--space-layout)]">
          <Skeleton className="h-[var(--space-80-151)]" />
          <Skeleton className="h-[var(--space-80-151)]" />
        </div>
      ) : error ? (
        <div className="mt-[var(--space-layout)]">
          <SectionError message={error.message} />
        </div>
      ) : posts.length === 0 ? (
        <p className="mt-[var(--space-layout)] rounded-sm bg-surface-success p-[var(--space-card-padding)] text-body-sm text-text-primary">
          Community conversations will appear here when your condition community has its first update.
        </p>
      ) : (
        <div className="mt-[var(--space-layout)] flex flex-col gap-[var(--space-layout)]">
          {posts.slice(0, 2).map((post) => (
            <article className="border-b border-border-subtle pb-[var(--space-layout)] last:border-0" key={post.id}>
              <div className="flex items-center gap-[var(--space-component-md)]">
                <Avatar name={post.author?.name ?? undefined} size="sm" src={post.author?.avatarUrl ?? undefined} />
                <p className="font-body text-body-sm font-weight-button text-text-primary">{post.author?.name ?? "Community member"}</p>
              </div>
              <p className="mt-[var(--space-component-md)] line-clamp-3 font-body text-body-sm text-text-secondary">{post.bodyText}</p>
            </article>
          ))}
        </div>
      )}
    </Card>
  );
}

function Leaderboard() {
  return (
    <Card className="min-h-[var(--space-328-617)]" variant="default">
      <h2 className="text-heading-sm font-weight-heading text-text-primary">Leaderboard</h2>
      <div className="mt-[var(--space-layout)] flex min-h-[var(--space-185-013)] flex-col items-center justify-center gap-[var(--space-component-md)] rounded-sm bg-surface-success p-[var(--space-card-padding)] text-center">
        <p className="text-body-lg font-weight-button text-text-primary">Coming soon</p>
        <p className="text-body-sm text-text-secondary">Squad rankings will appear here when leaderboard data is available.</p>
      </div>
    </Card>
  );
}

function SupportBanner({ onGetHelp }: { onGetHelp: () => void }) {
  return (
    <Card className="relative max-w-full min-h-[var(--space-185-013)] overflow-hidden" variant="promo">
      <div className="relative z-10 flex w-full min-w-0 flex-col gap-[var(--space-component-lg)] sm:flex-row sm:items-center">
        <div className="min-w-0 max-w-[var(--space-466-458)] shrink-0">
          <h2 className="text-heading-md font-weight-heading">We Are Not Alone.</h2>
          <p className="mt-[var(--space-component-md)] text-body">We Are Here For Your Health, Mind And Journey</p>
        </div>
        <Button className="sm:ml-auto" onClick={onGetHelp} size="lg" type="button" variant="secondary">
          Get Help
        </Button>
      </div>
      <img alt="" className="pointer-events-none absolute bottom-0 right-[var(--space-190)] z-0 h-full max-w-[var(--space-466-458)] object-contain" src={supportImage} />
    </Card>
  );
}

function greetingForHour(hour: number): string {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
}

export function DashboardPage() {
  const { token } = useAuth();
  const session = useSession({ token });
  const summary = useDashboardSummary({ token });
  const activities = useActivities({ token });
  const cycle = useRecoveryCycle({ token });
  const squad = useSquad({ token });
  const impactFeed = useImpactFeed({ limit: 1, token });
  const healingChain = useHealingChain({ token });
  const primaryConditionId = session.data?.user.conditions?.find((condition) => condition.isPrimary)?.id;
  const communities = useCommunities({ conditionId: primaryConditionId, token });
  const communityId = communities.data?.communities[0]?.id ?? "";
  const posts = usePosts(communityId, { limit: 2, token });
  const claimActivity = useClaimActivity();
  const [claimedIds, setClaimedIds] = useState<Set<string>>(() => new Set());
  const [pendingId, setPendingId] = useState<string>();
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const now = useMemo(() => new Date(), []);

  function claim(activity: ApiActivity) {
    setClaimedIds((current) => new Set(current).add(activity.id));
    setPendingId(activity.id);
    claimActivity.mutate(
      { id: activity.id, token },
      {
        onError: () => {
          setClaimedIds((current) => {
            const next = new Set(current);
            next.delete(activity.id);
            return next;
          });
        },
        onSettled: () => setPendingId(undefined),
      },
    );
  }

  const userName = session.data?.user.name ?? session.data?.user.email?.split("@")[0] ?? "there";
  const greeting = greetingForHour(now.getHours());
  const feedHasEvents = (impactFeed.data?.events.length ?? 0) > 0;

  return (
    <div className="mx-auto flex w-full max-w-[var(--space-1457)] flex-col gap-[var(--space-layout)]">
      <header className="flex flex-col gap-[var(--space-component-xs)]">
        <h1 className="text-heading-md font-weight-heading text-text-heading">
          {greeting}, {userName}!
        </h1>
        <p className="text-body text-text-secondary">
          {feedHasEvents ? "You’re doing great! Keep up the healthy habits." : "Your journey starts with one small step today."}
        </p>
      </header>

      <div className="grid gap-[var(--space-layout)] lg:grid-cols-2 2xl:grid-cols-3">
        <ActiveSummary error={summary.error} isLoading={summary.isLoading} summary={summary.data?.summary} />
        <div className="lg:col-span-1 2xl:col-span-1">
          {activities.isLoading ? (
            <Card className="min-h-[var(--space-275-078)]" variant="ai">
              <SectionLoading />
            </Card>
          ) : activities.error ? (
            <Card className="min-h-[var(--space-275-078)]" variant="ai">
              <SectionError message={activities.error.message} />
            </Card>
          ) : (
            <AiSuggestions activities={activities.data?.activities ?? []} />
          )}
        </div>
        <RecoveryActivities
          activities={activities.data?.activities ?? []}
          claimedIds={claimedIds}
          error={activities.error}
          isLoading={activities.isLoading}
          onClaim={claim}
          pendingId={pendingId}
        />
        <OnggiGuardian
          cycle={cycle.data?.cycle ?? undefined}
          error={cycle.error}
          isLoading={cycle.isLoading}
        />
        <HealingChainPreview data={healingChain.data} error={healingChain.error} isLoading={healingChain.isLoading} />
        <JournalAbout />
        <CommunityUpdates error={posts.error ?? communities.error} isLoading={posts.isLoading || communities.isLoading} posts={posts.data?.posts ?? []} />
        <Leaderboard />
        <div className="lg:col-span-2 2xl:col-span-3">
          <SupportBanner onGetHelp={() => setSupportModalOpen(true)} />
        </div>
      </div>

      <SupportResourcesModal onClose={() => setSupportModalOpen(false)} open={supportModalOpen} />

      {squad.isError && <p className="text-body-sm text-orange" role="alert">{squad.error.message}</p>}
    </div>
  );
}
