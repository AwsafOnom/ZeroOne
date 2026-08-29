import type { ApiNotification } from "@zeroone/shared";
import { Link } from "react-router-dom";
import { useMarkNotificationsRead, useNotifications } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { Button, Skeleton, cx } from "../primitives";

function formatRelativeTime(timestamp: string): string {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1_000));
  if (elapsedSeconds < 60) {
    return "just now";
  }
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}m ago`;
  }
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return `${elapsedHours}h ago`;
  }
  return `${Math.floor(elapsedHours / 24)}d ago`;
}

function NotificationRow({
  notification,
  onMarkRead,
}: {
  notification: ApiNotification;
  onMarkRead: (id: string) => void;
}) {
  return (
    <article
      className={cx(
        "flex gap-[var(--space-component-lg)] rounded-sm p-[var(--space-card-padding)] transition-colors",
        notification.read ? "bg-surface-default" : "bg-surface-muted",
      )}
    >
      <input
        aria-label={`Mark ${notification.title} as read`}
        checked={notification.read}
        className="mt-[var(--space-2)] size-[var(--space-24)] shrink-0 rounded-xs border border-border-subtle accent-primary"
        onChange={() => {
          if (!notification.read) {
            onMarkRead(notification.id);
          }
        }}
        type="checkbox"
      />
      <div className="relative min-w-0 flex-1">
        <time
          className="absolute right-0 top-0 font-body text-body-xs text-text-secondary"
          dateTime={notification.timestamp}
        >
          {formatRelativeTime(notification.timestamp)}
        </time>
        <h3 className="pr-[var(--space-80-151)] font-body text-body-lg font-weight-button text-text-heading">
          {notification.title}
        </h3>
        <p className="mt-[var(--space-component-sm)] font-body text-body text-text-primary">{notification.body}</p>
        {notification.href && (
          <Link
            className="mt-[var(--space-component-sm)] inline-flex font-body text-body-sm font-weight-button text-primary"
            to={notification.href}
          >
            View in Recovery
          </Link>
        )}
      </div>
    </article>
  );
}

export interface NotificationListProps {
  limit?: number;
  className?: string;
  showMarkAll?: boolean;
  onNavigate?: () => void;
}

export function NotificationList({
  className,
  limit = 20,
  onNavigate,
  showMarkAll = true,
}: NotificationListProps) {
  const { token } = useAuth();
  const notificationsQuery = useNotifications({ token, limit });
  const markRead = useMarkNotificationsRead();

  const notifications = notificationsQuery.data?.notifications ?? [];
  const unreadCount = notificationsQuery.data?.unreadCount ?? 0;

  if (notificationsQuery.isLoading) {
    return (
      <div className={cx("flex flex-col gap-[var(--space-component-md)]", className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton className="h-[var(--space-80-151)] w-full" key={index} />
        ))}
      </div>
    );
  }

  if (notificationsQuery.isError) {
    return (
      <p className={cx("font-body text-body-sm text-orange", className)} role="alert">
        {notificationsQuery.error.message}
      </p>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className={cx("rounded-sm bg-surface-default p-[var(--space-card-padding)] text-center", className)}>
        <p className="font-body text-body text-text-secondary">
          No squad updates yet. Impact events and challenge deadlines will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {showMarkAll && unreadCount > 0 && (
        <div className="mb-[var(--space-component-md)] flex justify-end">
          <Button
            disabled={markRead.isPending}
            onClick={() => markRead.mutate({ token, all: true })}
            size="sm"
            variant="ghost"
          >
            Mark all as read
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-[var(--space-component-md)]">
        {notifications.map((notification) => (
          <NotificationRow
            key={notification.id}
            notification={notification}
            onMarkRead={(id) => markRead.mutate({ token, ids: [id] })}
          />
        ))}
      </div>
      {onNavigate && (
        <div className="mt-[var(--space-component-lg)] border-t border-border-subtle pt-[var(--space-component-md)] text-center">
          <Link
            className="font-body text-body-sm font-weight-button text-primary"
            onClick={onNavigate}
            to="/notifications"
          >
            See all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
