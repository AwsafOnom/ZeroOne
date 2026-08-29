import type { ApiJourneyStage } from "@zeroone/shared";
import { Link } from "react-router-dom";
import { Card } from "../../primitives";

const stageAccent: Record<string, string> = {
  BEFORE_DIAGNOSIS: "var(--color-success)",
  DIAGNOSIS: "var(--color-orange)",
  STRUGGLES: "var(--color-secondary)",
  TURNING_POINT: "var(--color-healing-accent)",
  IMPROVEMENT: "var(--color-primary-strong)",
  MAINTAINING: "var(--color-primary)",
};

const stageHints: Record<string, string> = {
  BEFORE_DIAGNOSIS: "Healthy and active lifestyle",
  DIAGNOSIS: "Diagnosis recorded on your timeline",
  STRUGGLES: "Navigating early challenges",
  TURNING_POINT: "A shift in how you move forward",
  IMPROVEMENT: "Building steadier habits",
  MAINTAINING: "Stable habits and helping others",
};

function formatStageDate(isoDate: string | null): string | null {
  if (!isoDate) {
    return null;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function HealingChainJourneyTimeline({ stages }: { stages: ApiJourneyStage[] }) {
  return (
    <Card className="rounded-[var(--radius-lg)] p-[var(--space-layout)]" variant="outlined">
      <h2 className="text-body-lg font-weight-button text-text-heading">Your Journey Timeline</h2>
      <ol className="mt-[var(--space-layout)] grid grid-cols-2 gap-[var(--space-component-lg)] sm:grid-cols-3 xl:grid-cols-6">
        {stages.map((stage) => {
          const accent = stageAccent[stage.stage] ?? "var(--color-primary)";
          const dateLabel = formatStageDate(stage.occurredAt);
          const hint = stageHints[stage.stage] ?? "A stage on your recovery path";

          return (
            <li className="flex flex-col items-center gap-[var(--space-component-xs)] text-center" key={stage.stage}>
              <span
                aria-hidden
                className="flex size-[var(--space-40)] items-center justify-center rounded-round bg-surface-muted"
              >
                <span className="size-[var(--space-component-md)] rounded-round" style={{ backgroundColor: accent }} />
              </span>
              <p className="text-body-sm font-weight-button" style={{ color: accent }}>
                {stage.label}
              </p>
              {dateLabel && <p className="text-body-xs text-text-secondary">{dateLabel}</p>}
              <p className="text-body-xs text-text-secondary">{stage.isCurrent ? "Current stage" : hint}</p>
            </li>
          );
        })}
      </ol>
      <div className="mt-[var(--space-layout)] flex justify-center">
        <Link
          className="inline-flex min-h-[var(--space-45)] min-w-[var(--space-183)] items-center justify-center rounded-md bg-primary px-[var(--space-component-lg)] text-body-sm font-weight-button text-surface-default hover:brightness-95"
          to="/healing-journal"
        >
          View Detailed Timeline
        </Link>
      </div>
    </Card>
  );
}
