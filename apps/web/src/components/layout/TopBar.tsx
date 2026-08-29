import type { MouseEventHandler } from "react";
import { Avatar, Button, Skeleton, cx } from "../primitives";
import { NotificationsBellBadge } from "../notifications/NotificationsDropdown";
import { useSession } from "../../api";
import { useAuth } from "../../context/AuthContext";

const searchIcon =
  "https://www.figma.com/api/mcp/asset/88045b89-de56-4ba0-970c-3a03d415d1ff.svg";
const assistantIcon =
  "https://www.figma.com/api/mcp/asset/9c225097-d2c7-42d4-86e2-8f5474b374d3.svg";
const notificationIcon =
  "https://www.figma.com/api/mcp/asset/92b7b59e-2d61-4b13-a6b5-2eefa41ad4f6.svg";

export interface TopBarProps {
  onMenuOpen?: MouseEventHandler<HTMLButtonElement>;
  onNotificationsClick?: MouseEventHandler<HTMLButtonElement>;
  onAssistantClick?: MouseEventHandler<HTMLButtonElement>;
  menuLabel: string;
  notificationsLabel: string;
  assistantLabel: string;
  searchPlaceholder: string;
  className?: string;
}

export function TopBar({
  assistantLabel,
  className,
  menuLabel,
  notificationsLabel,
  onAssistantClick,
  onMenuOpen,
  onNotificationsClick,
  searchPlaceholder,
}: TopBarProps) {
  const { errorMessage, status, token, user } = useAuth();
  const session = useSession({ token, enabled: Boolean(token && user) });
  const displayName = session.data?.user.name ?? user?.displayName;
  const avatarUrl = session.data?.user.avatarUrl ?? user?.avatarUrl;

  return (
    <header
      className={cx(
        "flex min-h-[var(--space-shell-search-height)] items-center gap-[var(--space-component-lg)] px-[var(--space-page-inline)] py-[var(--space-header-block)]",
        className,
      )}
    >
      {onMenuOpen && (
        <Button
          aria-label={menuLabel}
          className="shrink-0 md:hidden"
          onClick={onMenuOpen}
          size="sm"
          variant="secondary"
        >
          {menuLabel}
        </Button>
      )}

      <div className="relative min-w-0 flex-1 md:max-w-[var(--space-shell-search-width)]">
        <img
          alt=""
          className="pointer-events-none absolute left-[var(--space-search-padding)] top-1/2 size-[var(--space-24)] -translate-y-1/2"
          src={searchIcon}
        />
        <input
          aria-label={searchPlaceholder}
          className="h-[var(--space-shell-search-height)] w-full rounded-pill border-0 bg-surface-default pl-[calc(var(--space-search-padding)+var(--space-24)+var(--space-search-gap))] pr-[var(--space-search-padding)] font-body text-body-xl text-text-form shadow-search outline-none placeholder:text-text-search-placeholder focus:ring-[var(--border-width)] focus:ring-primary"
          placeholder={searchPlaceholder}
          type="search"
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-[var(--space-component-lg)]">
        <Button
          className="bg-gradient-ai text-surface-default hover:brightness-95"
          leadingIcon={<img alt="" className="size-[var(--space-20)]" src={assistantIcon} />}
          onClick={onAssistantClick}
          size="sm"
          variant="primary"
        >
          <span className="hidden sm:inline">{assistantLabel}</span>
        </Button>

        <button
          aria-label={notificationsLabel}
          className="relative flex size-[var(--space-40)] items-center justify-center rounded-round transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-[var(--border-width)] focus-visible:ring-primary"
          id="topbar-notifications-button"
          onClick={onNotificationsClick}
          type="button"
        >
          <img alt="" className="size-[var(--space-24)]" src={notificationIcon} />
          <NotificationsBellBadge />
        </button>

        {status === "loading" ? (
          <Skeleton aria-label="Loading user profile" className="size-[var(--space-shell-avatar)]" shape="circle" />
        ) : status === "error" ? (
          <span className="font-body text-body-sm text-orange" role="alert">
            {errorMessage}
          </span>
        ) : (
          <div className="flex items-center gap-[var(--space-nav-icon-text)]">
            <Avatar name={displayName} size="md" src={avatarUrl ?? undefined} />
            {user && (
              <span className="hidden max-w-[var(--space-190)] truncate font-body text-body font-weight-button text-text-form lg:inline">
                {displayName}
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
