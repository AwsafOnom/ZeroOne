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
  const canSend = recipients.length > 0;

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

  return (
    <Card className="h-full rounded-[var(--radius-lg)] p-[var(--space-layout)]" variant="outlined">
      <div className="flex flex-wrap items-start justify-between gap-[var(--space-component-md)]">
        <div>
          <h2 className="text-heading-sm font-weight-heading text-text-heading">Lantern Sparks</h2>
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
              Send to {personDisplayName(connection.person)}
            </button>
          ))}
        </div>
      )}

      {!canSend ? (
        <p className="mt-[var(--space-layout)] rounded-sm bg-surface-muted p-[var(--space-card-padding)] text-body-sm text-text-secondary">
          Spark actions unlock once you have an active mentor or mentee connection.
        </p>
      ) : (
        <ul className="mt-[var(--space-layout)] flex flex-col gap-[var(--space-component-sm)]">
          {sparkActions.map((action) => (
            <li key={action.id}>
              <button
                className="flex w-full items-center justify-between gap-[var(--space-component-md)] rounded-md px-[var(--space-component-xs)] py-[var(--space-component-sm)] text-left transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSending}
                onClick={() => void handleSend(action.kind)}
                type="button"
              >
                <span className="min-w-0">
                  <span className="block text-body font-weight-button text-text-heading">{action.label}</span>
                  <span className="block text-body-sm text-text-secondary">{action.description}</span>
                </span>
                <span className="shrink-0 text-body font-weight-button text-text-heading">+{action.points}</span>
                {pendingKind === action.kind && (
                  <span className="sr-only">Sending</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-[var(--space-layout)] rounded-md bg-gradient-primary px-[var(--space-layout)] py-[var(--space-component-md)] text-center">
        <p className="text-body-lg font-weight-button text-surface-default">
          Total Spark: {sparkProgress.receivedPoints}
        </p>
      </div>

      <div className="mt-[var(--space-layout)]">
        <h3 className="text-body-lg font-weight-button text-text-heading">Ignite Your Lantern</h3>
        <div className="mt-[var(--space-component-sm)] flex items-end justify-between gap-[var(--space-component-sm)]">
          <span className="text-body-sm font-weight-button text-text-heading">
            {sparkProgress.receivedPoints} / {sparkProgress.threshold} sparks
          </span>
          <span className="text-body-sm font-weight-button text-text-secondary">{sparkProgress.progressPercent}%</span>
        </div>
        <ProgressBar className="mt-[var(--space-component-sm)]" showValue={false} value={sparkProgress.progressPercent} />
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
          {sparkProgress.isIgnited
            ? "Your lantern has ignited. You are ready to mentor someone new through their first steps."
            : `When you reach ${sparkProgress.threshold} sparks, your lantern will ignite and you'll be ready to become a mentor. You're ${sparkProgress.remainingPoints} sparks away from becoming a mentor!`}
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
