import type { ApiHealingImpact, ApiLanternArtifact } from "@zeroone/shared";
import { Link } from "react-router-dom";
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
      <h2 className="text-body-lg font-weight-button text-text-heading">Healing Impact</h2>
      <div className="mt-[var(--space-component-lg)] flex flex-col gap-[var(--space-component-md)]">
        <ImpactRow label="People Supported" value={impact.peopleSupported} />
        <ImpactRow label="Encouragements Sent" value={impact.encouragementsSent} />
        <ImpactRow label="Voice Sessions" value={impact.voiceSessions} />
        <ImpactRow label="Guidance Shared" value={impact.guidanceShared} />
      </div>
      <Link
        className="mt-[var(--space-component-lg)] block text-center text-body-sm font-weight-button text-primary"
        to="/healing-chain/mentor"
      >
        View Impact
      </Link>
    </Card>
  );
}

export function LanternArtifactPanel({ lantern }: { lantern: ApiLanternArtifact | null }) {
  return (
    <Card className="rounded-[var(--radius-lg)] p-[var(--space-layout)]" variant="outlined">
      <h2 className="text-body-lg font-weight-button text-text-heading">Final Artifact (Your Lantern)</h2>
      {lantern ? (
        <>
          <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
            {lantern.isForming
              ? "Your lantern is forming… Keep contributing to complete your cycle."
              : "Your preserved lantern records this cycle's support and growth."}
          </p>
          <div className="mt-[var(--space-component-lg)] flex flex-col gap-[var(--space-component-md)]">
            <ImpactRow label="Emotional Growth" value={lantern.emotionalGrowth} />
            <ImpactRow label="Support Given" value={lantern.supportGiven} />
            <PercentRow label="Consistency" value={lantern.consistencyPercent} />
            <PercentRow label="Compassion Acts" value={lantern.compassionActsPercent} />
          </div>
        </>
      ) : (
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
          Your lantern artifact appears as you contribute through a recovery cycle. Keep sending sparks and showing up
          for your connections.
        </p>
      )}
      <Link
        className="mt-[var(--space-component-lg)] block text-center text-body-sm font-weight-button text-primary"
        to="/healing-chain/mentee"
      >
        View My Lantern
      </Link>
    </Card>
  );
}
