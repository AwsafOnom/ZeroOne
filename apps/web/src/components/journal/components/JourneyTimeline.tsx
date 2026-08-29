import type { ApiJourneyStage } from "@zeroone/shared";
import { Card } from "../../primitives";

const stageAccent: Record<string, string> = {
  BEFORE_DIAGNOSIS: "var(--color-success)",
  DIAGNOSIS: "var(--color-orange)",
  STRUGGLES: "var(--color-secondary)",
  TURNING_POINT: "var(--color-healing-accent)",
  IMPROVEMENT: "var(--color-primary-strong)",
  MAINTAINING: "var(--color-primary)",
};

export function JourneyTimeline({ stages }: { stages: ApiJourneyStage[] }) {
  return (
    <Card variant="outlined">
      <h2 className="text-heading-sm font-weight-heading text-text-heading">Your Journey Timeline</h2>
      <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
        Six stages that hold where you have been — not as a score, but as a record.
      </p>
      <ol className="mt-[var(--space-layout)] grid gap-[var(--space-component-md)] md:grid-cols-2 xl:grid-cols-3">
        {stages.map((stage) => (
          <li
            className={`rounded-sm border p-[var(--space-card-padding)] ${
              stage.isCurrent
                ? "border-primary bg-surface-success"
                : stage.isComplete
                  ? "border-border-subtle bg-surface-default"
                  : "border-border-subtle bg-surface-muted"
            }`}
            key={stage.stage}
          >
            <div className="flex items-start gap-[var(--space-component-md)]">
              <span
                aria-hidden
                className="mt-[var(--space-component-xs)] size-[var(--space-component-md)] shrink-0 rounded-round"
                style={{ backgroundColor: stageAccent[stage.stage] ?? "var(--color-primary)" }}
              />
              <div>
                <p className="text-body-sm font-weight-button text-text-primary">{stage.label}</p>
                {stage.isCurrent && (
                  <p className="mt-[var(--space-component-xs)] text-body-xs font-weight-button text-primary">Current stage</p>
                )}
                {stage.isComplete && !stage.isCurrent && (
                  <p className="mt-[var(--space-component-xs)] text-body-xs text-text-secondary">Recorded on your timeline</p>
                )}
                {!stage.isComplete && !stage.isCurrent && (
                  <p className="mt-[var(--space-component-xs)] text-body-xs text-text-secondary">Ahead on your path</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
