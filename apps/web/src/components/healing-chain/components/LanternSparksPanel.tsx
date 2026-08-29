import { useState } from "react";
import type { ApiHealingChainConnection, ApiSparkAction, ApiSparkProgress } from "@zeroone/shared";
import { Link } from "react-router-dom";
import { useSendSpark } from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import { Card, ProgressBar, Skeleton } from "../../primitives";
import { personDisplayName, SectionError, sparkRecipientOptions } from "../healingChainShared";

export function LanternSparksPanel({
  errorMessage,
  mentor,
  mentee,
  onSent,
  sparkActions,
  sparkProgress,
}: {
  sparkActions: ApiSparkAction[];
  sparkProgress: ApiSparkProgress;
  mentor: ApiHealingChainConnection | null;
  mentee: ApiHealingChainConnection | null;
  errorMessage?: string;
  onSent: () => void;
}) {
  const { token } = useAuth();
  const sendSpark = useSendSpark();
  const recipients = sparkRecipientOptions(mentor, mentee);
  const [selectedRole, setSelectedRole] = useState<"mentor" | "mentee">(mentee ? "mentee" : "mentor");
  const [pendingKind, setPendingKind] = useState<string | null>(null);

  const isSending = sendSpark.isPending;

  const selectedConnection = recipients.find((entry) => entry.role === selectedRole)?.connection ?? recipients[0]?.connection;

  async function handleSend(kind: string) {
    if (!token || !selectedConnection) {
      return;
    }
    setPendingKind(kind);
    try {
      await sendSpark.mutateAsync({
        token,
        kind,
        recipientId: selectedConnection.person.id,
        mentorshipLinkId: selectedConnection.linkId,
      });
      onSent();
    } finally {
      setPendingKind(null);
    }
  }

  const canSend = recipients.length > 0;

  return (
    <Card className="rounded-[var(--radius-lg)] p-[var(--space-layout)]" variant="outlined">
      <div className="flex flex-wrap items-start justify-between gap-[var(--space-component-md)]">
        <div>
          <h2 className="text-heading-sm font-weight-heading text-text-heading">Lantern sparks</h2>
          <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
            Give support, collect sparks, and light your lantern.
          </p>
        </div>
        <Link className="text-body-sm font-weight-button text-primary" to="/recovery/how-it-works">
          How it works?
        </Link>
      </div>

      {recipients.length > 1 && (
        <div className="mt-[var(--space-component-md)] flex flex-wrap gap-[var(--space-component-sm)]">
          {recipients.map(({ role, connection }) => (
            <button
              className={`rounded-pill px-[var(--space-component-md)] py-[var(--space-component-xs)] text-body-sm font-weight-button ${
                selectedRole === role
                  ? "bg-primary text-surface-default"
                  : "border border-border-subtle bg-surface-default text-text-secondary"
              }`}
              key={role}
              onClick={() => setSelectedRole(role)}
              type="button"
            >
              Send to {role === "mentor" ? personDisplayName(connection.person) : personDisplayName(connection.person)}
            </button>
          ))}
        </div>
      )}

      {!canSend ? (
        <p className="mt-[var(--space-layout)] rounded-sm bg-surface-muted p-[var(--space-card-padding)] text-body-sm text-text-secondary">
          Spark actions unlock once you have an active mentor or mentee connection.
        </p>
      ) : (
        <div className="mt-[var(--space-layout)] grid gap-[var(--space-component-md)] sm:grid-cols-3">
          {sparkActions.map((action) => (
            <button
              className="flex flex-col gap-[var(--space-component-sm)] rounded-[var(--radius-md)] border border-border-subtle bg-surface-default p-[var(--space-card-padding)] text-left transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSending}
              key={action.id}
              onClick={() => void handleSend(action.kind)}
              type="button"
            >
              <span className="text-body font-weight-button text-text-heading">{action.label}</span>
              <span className="text-body-sm text-primary">+{action.points}</span>
              <span className="text-body-xs text-text-secondary">{action.description}</span>
              {pendingKind === action.kind && (
                <span className="text-body-xs font-weight-button text-primary">Sending…</span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="mt-[var(--space-layout)] rounded-[var(--radius-md)] bg-gradient-primary px-[var(--space-layout)] py-[var(--space-component-md)] text-center">
        <p className="text-body-lg font-weight-button text-surface-default">
          Total spark: {sparkProgress.receivedPoints}
        </p>
      </div>

      <div className="mt-[var(--space-layout)]">
        <div className="flex flex-wrap items-end justify-between gap-[var(--space-component-sm)]">
          <h3 className="text-body-lg font-weight-button text-text-heading">Ignite your lantern</h3>
          <p className="text-body-sm font-weight-button text-primary">
            {sparkProgress.receivedPoints} / {sparkProgress.threshold} sparks
          </p>
        </div>
        <ProgressBar className="mt-[var(--space-component-sm)]" showValue={false} value={sparkProgress.progressPercent} />
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
          {sparkProgress.isIgnited
            ? "Your lantern has ignited. You are ready to mentor someone new through their first steps."
            : `When you reach ${sparkProgress.threshold} sparks, your lantern will ignite and you will be ready to become a mentor. You are ${sparkProgress.remainingPoints} sparks away.`}
        </p>
      </div>

      {(errorMessage || sendSpark.error) && (
        <div className="mt-[var(--space-component-md)]">
          <SectionError message={errorMessage ?? sendSpark.error?.message ?? "Unable to send spark."} />
        </div>
      )}
    </Card>
  );
}

export function LanternSparksPanelSkeleton() {
  return (
    <Card className="rounded-[var(--radius-lg)] p-[var(--space-layout)]" variant="outlined">
      <Skeleton className="h-[var(--space-45)] w-[var(--space-275-078)]" />
      <Skeleton className="mt-[var(--space-layout)] h-[var(--space-128-856)]" />
      <Skeleton className="mt-[var(--space-component-md)] h-[var(--space-60)]" />
    </Card>
  );
}
