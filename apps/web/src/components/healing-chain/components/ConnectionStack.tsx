import type { ApiHealingChainConnectionStatus } from "@zeroone/shared";
import { useAuth } from "../../../context/AuthContext";
import { Avatar, Card } from "../../primitives";
import { ConnectionCard } from "./ConnectionCard";

export function ConnectionStack({
  connectionStatus,
  mentor,
  mentee,
}: {
  connectionStatus: ApiHealingChainConnectionStatus;
  mentor: Parameters<typeof ConnectionCard>[0]["connection"];
  mentee: Parameters<typeof ConnectionCard>[0]["connection"];
}) {
  const { user } = useAuth();
  const isConnected = connectionStatus === "connected";

  return (
    <section className="flex flex-col gap-[var(--space-layout)]">
      <ConnectionCard connection={mentor} profilePath="/healing-chain/mentor" role="mentor" />

      <Card className="rounded-[var(--radius-lg)] bg-surface-success" variant="muted">
        <div className="flex flex-col items-center gap-[var(--space-component-md)] text-center">
          {isConnected ? (
            <span className="rounded-pill bg-success px-[var(--space-component-lg)] py-[var(--space-component-sm)] text-body-sm font-weight-button text-surface-default">
              You are connected
            </span>
          ) : connectionStatus === "partial" ? (
            <span className="rounded-pill bg-surface-blue-light px-[var(--space-component-lg)] py-[var(--space-component-sm)] text-body-sm font-weight-button text-primary">
              One connection is ready
            </span>
          ) : (
            <span className="rounded-pill border border-border-subtle bg-surface-default px-[var(--space-component-lg)] py-[var(--space-component-sm)] text-body-sm font-weight-button text-text-secondary">
              Awaiting your chain
            </span>
          )}
          <Avatar name={user?.displayName ?? "You"} size="lg" />
          <div>
            <p className="text-body-lg font-weight-button text-text-heading">{user?.displayName ?? "You"}</p>
            <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
              {isConnected
                ? "You receive hope and give hope at the same time."
                : connectionStatus === "partial"
                  ? "You are matched in one direction. Your full chain forms when both links are active."
                  : "Volunteer mentors and mentees appear here when a mutual match is ready."}
            </p>
          </div>
        </div>
      </Card>

      <ConnectionCard connection={mentee} profilePath="/healing-chain/mentee" role="mentee" />
    </section>
  );
}
