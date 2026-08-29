import { useEffect, useRef } from "react";
import { useSession } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { cx } from "../primitives";
import { NotificationList } from "./NotificationList";

export interface NotificationsDropdownProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsDropdown({ onClose, open }: NotificationsDropdownProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { token, user } = useAuth();
  const session = useSession({ token, enabled: Boolean(token && user) });
  const unreadCount = session.data?.unreadNotifications ?? 0;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) {
        return;
      }
      const bellButton = document.getElementById("topbar-notifications-button");
      if (bellButton?.contains(target)) {
        return;
      }
      onClose();
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-label="Notifications"
      className="absolute right-0 top-[calc(100%+var(--space-component-sm))] z-50 w-[min(100vw-var(--space-page-inline),var(--space-612))] overflow-hidden rounded-md border border-border-subtle bg-surface-app shadow-card"
      ref={panelRef}
      role="dialog"
    >
      <div className="flex items-center justify-between border-b border-border-subtle px-[var(--space-card-padding)] py-[var(--space-component-md)]">
        <h2 className="font-body text-body-lg font-weight-button text-text-heading">Notifications</h2>
        {unreadCount > 0 && (
          <span className="rounded-pill bg-orange px-[var(--space-component-sm)] py-[var(--space-2)] font-body text-body-xs font-weight-button text-surface-default">
            {unreadCount} unread
          </span>
        )}
      </div>
      <div className="max-h-[min(70vh,var(--space-612))] overflow-y-auto p-[var(--space-card-padding)]">
        <NotificationList limit={8} onNavigate={onClose} showMarkAll />
      </div>
    </div>
  );
}

export function NotificationsBellBadge({ className }: { className?: string }) {
  const { token, user } = useAuth();
  const session = useSession({ token, enabled: Boolean(token && user) });
  const unreadCount = session.data?.unreadNotifications ?? 0;

  if (unreadCount <= 0) {
    return null;
  }

  return (
    <span
      className={cx(
        "absolute right-0 top-0 flex min-w-[var(--space-16)] translate-x-[var(--space-component-xs)] -translate-y-[var(--space-component-xs)] items-center justify-center rounded-round bg-orange px-[var(--space-2)] font-body text-body-xs font-weight-button leading-none text-surface-default",
        className,
      )}
    >
      {unreadCount}
    </span>
  );
}
