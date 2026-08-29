import { Activity, Droplets, Flame, Heart, Wind } from "lucide-react";
import {
  useImpactFeed,
  useRecoveryCycle,
  useSquadHealth,
  useSquadInsights,
} from "../../api";
import { useAuth } from "../../context/AuthContext";
import { Card, ProgressBar, Skeleton } from "../primitives";
import { AnimatedCounter } from "./components/AnimatedCounter";
import { GuardianMetricCard } from "./components/GuardianMetricCard";
import { LiveImpactFeed } from "./components/LiveImpactFeed";
import { OnggiVesselVisual } from "./components/OnggiVesselVisual";
import { formatResonanceScore, SectionError, StatTile } from "./shared";

const guardianMetrics = [
  {
    key: "breathingExercise" as const,
    label: "Breathing Exercise",
    icon: Wind,
    accentColor: "var(--primitive-color-teal-end)",
  },
  {
    key: "breathingVeins" as const,
    label: "Breathing Veins",
    icon: Activity,
    accentColor: "var(--primitive-color-secondary)",
  },
  {
    key: "warmth" as const,
    label: "Warmth",
    icon: Flame,
    accentColor: "var(--primitive-color-orange)",
  },
  {
    key: "circulation" as const,
    label: "Circulation",
    icon: Droplets,
    accentColor: "var(--primitive-color-healing-accent)",
  },
  {
    key: "harmony" as const,
    label: "Harmony",
    icon: Heart,
    accentColor: "var(--primitive-color-ai-accent)",
    fullWidth: true,
  },
];

function onggiStatusLabel(synchronizationPercent: number): string {
  if (synchronizationPercent >= 70) {
    return "Your Onggi is Thriving";
  }
  if (synchronizationPercent >= 40) {
    return "Your Onggi is Growing";
  }
  return "Your Onggi is Waking";
}

export function OnggiGuardianPage() {
  const { token } = useAuth();

  const cycle = useRecoveryCycle({ token });
  const health = useSquadHealth({ token });
  const insights = useSquadInsights({ token });
  const impactFeed = useImpactFeed({ limit: 6, token });

  const onggiState = cycle.data?.cycle.onggiState;
  const cycleData = cycle.data?.cycle;
  const insightData = insights.data?.insights;
  const isLoading = cycle.isLoading || health.isLoading || insights.isLoading;
  const daysRemaining = cycleData ? Math.max(cycleData.cycleDays - cycleData.cycleDay, 0) : 0;

  return (
    <div className="flex flex-col gap-[var(--space-layout)]">
      <header className="flex flex-wrap items-end justify-between gap-[var(--space-component-md)]">
        <div>
          <h2 className="text-heading-md font-weight-heading text-text-heading">Onggi Guardian</h2>
          <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
            Living vessel of collective healing
          </p>
        </div>
        {cycleData && (
          <div className="flex flex-wrap gap-[var(--space-component-md)]">
            <Card className="px-[var(--space-card-padding)] py-[var(--space-component-md)]" variant="outlined">
              <p className="text-body-sm text-text-primary">
                Cycle day:{" "}
                <span className="font-weight-button text-primary">
                  {cycleData.cycleDay}/{cycleData.cycleDays}
                </span>
              </p>
            </Card>
            <Card className="px-[var(--space-card-padding)] py-[var(--space-component-md)]" variant="outlined">
              <p className="text-body-sm text-text-primary">
                Time left: <span className="font-weight-button text-primary">{daysRemaining} days left</span>
              </p>
            </Card>
          </div>
        )}
      </header>

      {cycle.error && <SectionError message={cycle.error.message} />}

      <div className="grid gap-[var(--space-layout)] xl:grid-cols-[minmax(0,2fr)_minmax(var(--space-275-078),1fr)]">
        <div className="flex min-w-0 flex-col gap-[var(--space-layout)]">
          <Card className="bg-[var(--primitive-color-primary-10)] p-[var(--space-card-padding)]" variant="muted">
            {isLoading ? (
              <div className="flex flex-col gap-[var(--space-layout)]">
                <Skeleton className="mx-auto h-[var(--space-328-617)] w-[var(--space-373)]" />
                <Skeleton className="h-[var(--space-60)]" />
                <div className="grid grid-cols-2 gap-[var(--space-component-md)]">
                  <Skeleton className="h-[var(--space-128-856)]" />
                  <Skeleton className="h-[var(--space-128-856)]" />
                  <Skeleton className="h-[var(--space-128-856)]" />
                  <Skeleton className="h-[var(--space-128-856)]" />
                  <Skeleton className="col-span-2 h-[var(--space-128-856)]" />
                </div>
              </div>
            ) : !onggiState ? (
              <p className="rounded-sm bg-surface-default p-[var(--space-card-padding)] text-body-sm text-text-primary">
                Your squad’s Onggi will begin to glow after your first shared activity.
              </p>
            ) : (
              <div className="flex flex-col gap-[var(--space-layout)]">
                <OnggiVesselVisual />
                <div className="flex flex-col items-center gap-[var(--space-component-md)] text-center">
                  <p className="text-heading-sm font-weight-heading text-primary">
                    {insightData ? onggiStatusLabel(insightData.synchronizationPercent) : "Your Onggi is Waking"}
                  </p>
                  {insightData && (
                    <div className="inline-flex items-center gap-[var(--space-component-sm)] rounded-pill border border-border-subtle bg-surface-default px-[var(--space-component-md)] py-[var(--space-component-sm)]">
                      <span className="text-body-sm text-text-secondary">Squad synchronisation:</span>
                      <span className="text-body-sm font-weight-button text-primary">
                        {insightData.synchronizationPercent}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-[var(--space-component-md)]">
                  {guardianMetrics.map((metric) => (
                    <GuardianMetricCard
                      accentColor={metric.accentColor}
                      fullWidth={metric.fullWidth}
                      icon={metric.icon}
                      key={metric.key}
                      label={metric.label}
                      value={onggiState[metric.key]}
                    />
                  ))}
                </div>
              </div>
            )}
          </Card>

          {insightData && onggiState && (
            <div className="grid gap-[var(--space-component-md)] md:grid-cols-3">
              <StatTile
                hint="Last 7 days"
                label="Engagement"
                value={`${insightData.engagementLast7Days}%`}
              />
              <StatTile
                hint={`+${formatResonanceScore(insightData.resonanceGainToday)} today`}
                label="Total accumulated"
                value={formatResonanceScore(onggiState.resonanceScore)}
              />
              <StatTile
                hint={`Best: ${insightData.bestStreakDays} days`}
                label="Keep it going"
                value={`${insightData.currentStreakDays} days`}
              />
            </div>
          )}
        </div>

        <aside className="flex min-w-0 flex-col gap-[var(--space-layout)]">
          <LiveImpactFeed
            error={impactFeed.error}
            events={impactFeed.data?.events ?? []}
            isLoading={impactFeed.isLoading}
          />

          <Card variant="primary">
            <h2 className="text-body-lg font-weight-button">Squad Health Today</h2>
            {health.isLoading ? (
              <div className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-md)]">
                <Skeleton className="h-[var(--space-45)] bg-surface-subtle" />
                <Skeleton className="h-[var(--space-45)] bg-surface-subtle" />
                <Skeleton className="h-[var(--space-45)] bg-surface-subtle" />
              </div>
            ) : health.error ? (
              <div className="mt-[var(--space-component-md)]">
                <SectionError message={health.error.message} />
              </div>
            ) : health.data?.health ? (
              <div className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-lg)]">
                <div>
                  <div className="flex items-end justify-between gap-[var(--space-component-sm)]">
                    <p className="text-body-sm">Activities completed</p>
                    <p className="text-body-sm font-weight-button">
                      {health.data.health.activitiesCompleted}/{health.data.health.activitiesGoal}
                    </p>
                  </div>
                  <ProgressBar
                    className="mt-[var(--space-component-sm)] [&>div]:bg-surface-default/30 [&_div_div]:bg-surface-default"
                    showValue={false}
                    value={
                      health.data.health.activitiesGoal > 0
                        ? (health.data.health.activitiesCompleted / health.data.health.activitiesGoal) * 100
                        : 0
                    }
                  />
                </div>
                <p className="text-body-sm">
                  Collective points:{" "}
                  <span className="font-weight-button">
                    {formatResonanceScore(health.data.health.collectivePoints)} (+{formatResonanceScore(health.data.health.pointsToday)} today)
                  </span>
                </p>
                <p className="text-body-sm">
                  Active members:{" "}
                  <span className="font-weight-button">
                    {health.data.health.activeMembers}/{health.data.health.maxMembers}
                  </span>
                </p>
              </div>
            ) : null}
          </Card>
        </aside>
      </div>
    </div>
  );
}
