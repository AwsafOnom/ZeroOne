import { useCrystallization } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { Card, ProgressBar, Skeleton } from "../primitives";
import { OnggiVesselVisual } from "./components/OnggiVesselVisual";
import {
  capsuleTypeLabels,
  displayEnumLabel,
  formatDateRange,
  formatOnggiTitle,
  formatResonanceScore,
  cycleDayCount,
  getOnggiThemeColor,
  SectionError,
} from "./shared";

export function CrystallizeOnggiPage() {
  const { token } = useAuth();
  const crystallization = useCrystallization({ token });

  const data = crystallization.data?.crystallization;
  const cycle = data?.cycle;
  const progress = cycle && cycle.cycleDays > 0 ? (cycle.cycleDay / cycle.cycleDays) * 100 : 0;

  return (
    <div className="flex flex-col gap-[var(--space-layout)]">
      <Card className="bg-surface-blue-light" variant="muted">
        <h2 className="text-heading-sm font-weight-heading text-text-primary">Crystallize Onggi</h2>
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
          At day 28, your squad’s shared vessel becomes a permanent achievement artifact — preserved forever,
          never deleted. Collect it as proof of what eight people grew together.
        </p>
      </Card>

      {crystallization.error && <SectionError message={crystallization.error.message} />}

      <Card variant="outlined">
        <h2 className="text-body-lg font-weight-button text-text-primary">Current cycle</h2>
        {crystallization.isLoading ? (
          <div className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-md)]">
            <Skeleton className="h-[var(--space-60)]" />
            <Skeleton className="h-[var(--space-component-sm)]" />
          </div>
        ) : cycle ? (
          <div className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-lg)]">
            <div className="flex flex-wrap items-end justify-between gap-[var(--space-component-md)]">
              <div>
                <p className="text-body-sm text-text-secondary">Progress toward crystallization</p>
                <p className="mt-[var(--space-component-xs)] text-heading-sm font-weight-heading text-text-primary">
                  Day {cycle.cycleDay} of {cycle.cycleDays}
                </p>
              </div>
              <p className="text-body-sm font-weight-button text-primary">{data?.daysRemaining ?? 0} days remaining</p>
            </div>
            <ProgressBar showValue={false} value={progress} />
            <p className="text-body-sm text-text-secondary">
              On day 28, this cycle’s Onggi crystallizes into a permanent record of your squad’s resonance,
              activities, and Time Capsule contributions. It can only be collected — never removed.
            </p>
          </div>
        ) : (
          <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
            Your active recovery cycle will appear here once your squad begins.
          </p>
        )}
      </Card>

      <Card variant="outlined">
        <h2 className="text-body-lg font-weight-button text-text-primary">Time Capsule preview</h2>
        <p className="mt-[var(--space-component-xs)] text-body-xs text-text-secondary">
          Memories your squad is gathering for this cycle’s crystallized Onggi.
        </p>
        {crystallization.isLoading ? (
          <div className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-sm)]">
            <Skeleton className="h-[var(--space-45)]" />
            <Skeleton className="h-[var(--space-45)]" />
          </div>
        ) : data?.contributions.length === 0 ? (
          <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
            No Time Capsule contributions yet. Shared photos, voice notes, songs, and memories added during this
            cycle will appear here.
          </p>
        ) : (
          <ul className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-sm)]">
            {data?.contributions.map((contribution) => (
              <li
                className="rounded-sm border border-border-subtle bg-surface-default p-[var(--space-component-sm)]"
                key={contribution.id}
              >
                <div className="flex flex-wrap items-center justify-between gap-[var(--space-component-sm)]">
                  <p className="text-body-sm font-weight-button text-text-primary">
                    {contribution.contributor?.name ?? "Squad member"}
                  </p>
                  <span className="rounded-pill bg-surface-blue-light px-[var(--space-component-sm)] py-[var(--space-component-xs)] text-body-xs text-primary">
                    {capsuleTypeLabels[contribution.type] ?? displayEnumLabel(contribution.type)}
                  </span>
                </div>
                {contribution.caption && (
                  <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">{contribution.caption}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <section>
        <h2 className="text-body-lg font-weight-button text-text-primary">Crystallized Onggi</h2>
        <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
          Permanent achievement artifacts from previous cycles. Each one is immutable — a record of collective care.
        </p>
        {crystallization.isLoading ? (
          <div className="mt-[var(--space-layout)] grid gap-[var(--space-layout)] md:grid-cols-2">
            <Skeleton className="h-[var(--space-328-617)]" />
            <Skeleton className="h-[var(--space-328-617)]" />
          </div>
        ) : data?.crystallizedOnggis.length === 0 ? (
          <p className="mt-[var(--space-layout)] rounded-sm bg-surface-success p-[var(--space-card-padding)] text-body-sm text-text-secondary">
            Your squad’s first crystallized Onggi will appear here after completing a full 28-day cycle.
          </p>
        ) : (
          <div className="mt-[var(--space-layout)] grid gap-[var(--space-40)] md:grid-cols-2">
            {data?.crystallizedOnggis.map((onggi) => (
              <Card key={onggi.id} variant="outlined">
                <div className="flex items-center gap-[var(--space-17-039)]">
                  <OnggiVesselVisual
                    animated={false}
                    fillLevel={100}
                    size="card"
                    themeColor={getOnggiThemeColor(onggi.name, onggi.theme)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-body-xs text-text-secondary">Crystallized · Permanent</p>
                    <h3 className="mt-[var(--space-component-xs)] text-body-lg font-weight-button text-text-primary">
                      {formatOnggiTitle(onggi.name, onggi.theme)}
                    </h3>
                    <p className="mt-[var(--space-component-sm)] text-body-sm text-text-secondary">
                      {formatDateRange(onggi.dateRangeStart, onggi.dateRangeEnd)}
                    </p>
                    <p className="mt-[var(--space-component-xs)] text-body-sm font-weight-button text-text-primary">
                      Theme: {onggi.theme}
                    </p>
                    <p className="mt-[var(--space-component-sm)] text-body-xs text-text-secondary">{onggi.description}</p>
                    <div className="mt-[var(--space-component-md)] flex flex-wrap gap-[var(--space-36)] text-center">
                      <div>
                        <p className="text-heading-sm font-weight-heading text-text-primary">
                          {cycleDayCount(onggi.dateRangeStart, onggi.dateRangeEnd)}
                        </p>
                        <p className="text-body-xs text-text-secondary">Days</p>
                      </div>
                      <div>
                        <p className="text-heading-sm font-weight-heading text-text-primary">{onggi.activityCount}</p>
                        <p className="text-body-xs text-text-secondary">Activities</p>
                      </div>
                      <div>
                        <p className="text-heading-sm font-weight-heading text-primary">
                          {formatResonanceScore(onggi.finalResonanceScore)}
                        </p>
                        <p className="text-body-xs text-text-secondary">Resonance score</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-[var(--space-component-lg)] text-body-xs text-text-secondary">
                  {onggi.timeCapsuleContributionCount}{" "}
                  {onggi.timeCapsuleContributionCount === 1 ? "Time Capsule contribution" : "Time Capsule contributions"}{" "}
                  preserved inside this artifact.
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
