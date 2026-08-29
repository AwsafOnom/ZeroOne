import type { ApiHealingImpact, ApiLanternArtifact } from "@zeroone/shared";
import { Card } from "../../primitives";

function ImpactRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-[var(--space-component-md)] text-body-sm">
      <span className="text-text-primary">{label}</span>
      <span className="font-weight-button text-text-heading">{value}</span>
    </div>
  );
}

function PercentRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-[var(--space-component-md)] text-body-sm">
      <span className="text-text-primary">{label}</span>
      <span className="font-weight-button text-text-heading">{value}%</span>
    </div>
  );
}

export function HealingImpactPanel({ impact }: { impact: ApiHealingImpact }) {
  return (
    <Card className="rounded-[var(--radius-lg)] p-[var(--space-layout)]" variant="outlined">
      <h2 className="text-heading-sm font-weight-heading text-text-heading">Healing impact</h2>
      <div className="mt-[var(--space-layout)] flex flex-col gap-[var(--space-component-md)]">
        <ImpactRow label="People supported" value={impact.peopleSupported} />
        <ImpactRow label="Encouragement sent" value={impact.encouragementsSent} />
        <ImpactRow label="Voice sessions" value={impact.voiceSessions} />
        <ImpactRow label="Guidance shared" value={impact.guidanceShared} />
      </div>
    </Card>
  );
}

export function LanternArtifactPanel({ lantern }: { lantern: ApiLanternArtifact | null }) {
  return (
    <Card className="rounded-[var(--radius-lg)] p-[var(--space-layout)]" variant="outlined">
      <h2 className="text-heading-sm font-weight-heading text-text-heading">Final artifact (your lantern)</h2>
      {lantern ? (
        <>
          <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
            {lantern.isForming
              ? "Your lantern is forming… Keep contributing to complete your cycle."
              : "Your preserved lantern records this cycle's support and growth."}
          </p>
          <div className="mt-[var(--space-layout)] flex flex-col gap-[var(--space-component-md)]">
            <ImpactRow label="Emotional growth" value={lantern.emotionalGrowth} />
            <ImpactRow label="Support given" value={lantern.supportGiven} />
            <PercentRow label="Consistency" value={lantern.consistencyPercent} />
            <PercentRow label="Compassion acts" value={lantern.compassionActsPercent} />
          </div>
        </>
      ) : (
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
          Your lantern artifact appears as you contribute through a recovery cycle. Keep sending sparks and showing up
          for your connections.
        </p>
      )}
    </Card>
  );
}
