import type { ApiHealingChainConnectionStatus } from "@zeroone/shared";
import { cx } from "../../primitives";

const connectedIconSrc = "/assets/healing-chain-connected.svg";

export function ConnectionBadge({
  connectionStatus,
}: {
  connectionStatus: ApiHealingChainConnectionStatus;
}) {
  const isConnected = connectionStatus === "connected";

  return (
    <div
      className={cx(
        "flex w-full items-center justify-center rounded-[var(--radius-pill)] px-[var(--space-component-lg)] py-[var(--space-component-md)]",
        isConnected
          ? "bg-success text-surface-default"
          : connectionStatus === "partial"
            ? "bg-surface-blue-light text-primary"
            : "border border-border-subtle bg-surface-muted text-text-secondary",
      )}
    >
      <div className="flex max-w-[var(--space-183)] items-center gap-[var(--space-component-sm)]">
        {isConnected && (
          <span
            aria-hidden
            className="size-[var(--space-60)] shrink-0 bg-surface-default"
            style={{
              maskImage: `url(${connectedIconSrc})`,
              WebkitMaskImage: `url(${connectedIconSrc})`,
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              maskSize: "contain",
              WebkitMaskSize: "contain",
            }}
          />
        )}
        <p className="text-body-sm font-weight-button leading-snug">
          {isConnected
            ? "You Are Connected"
            : connectionStatus === "partial"
              ? "One Connection Ready"
              : "Awaiting Your Chain"}
        </p>
      </div>
    </div>
  );
}
