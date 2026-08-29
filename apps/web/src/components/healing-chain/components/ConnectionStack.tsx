import type { ApiHealingChainConnectionStatus } from "@zeroone/shared";
import { Card } from "../../primitives";
import { ConnectionBadge } from "./ConnectionBadge";
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
  return (
    <Card className="rounded-[var(--radius-lg)] p-[var(--space-layout)]" variant="outlined">
      <div className="grid gap-[var(--space-layout)] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
        <ConnectionCard connection={mentor} profilePath="/healing-chain/mentor" role="mentor" />
        <div className="flex justify-center lg:max-w-[var(--space-328-617)] lg:px-[var(--space-component-sm)]">
          <ConnectionBadge connectionStatus={connectionStatus} />
        </div>
        <ConnectionCard connection={mentee} profilePath="/healing-chain/mentee" role="mentee" />
      </div>
    </Card>
  );
}
