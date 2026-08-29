import type { ImgHTMLAttributes } from "react";
import { NavLink } from "react-router-dom";
import { Badge, cx } from "../primitives";

const logoAsset =
  "https://www.figma.com/api/mcp/asset/8ea50afa-e6de-48a6-9292-9e5f7ef86f74.png";

const dashboardIcon =
  "https://www.figma.com/api/mcp/asset/5c80a825-4b67-40c0-be20-4111cd3dead3.svg";
const recoveryIcon =
  "https://www.figma.com/api/mcp/asset/5dbc25dc-0c61-40ca-94d1-58778d578e9d.svg";
const communityIcon =
  "https://www.figma.com/api/mcp/asset/96d381b8-f1f6-43f8-9419-18c4ed051da6.svg";
const healingChainIcon =
  "https://www.figma.com/api/mcp/asset/fccdc4dd-8774-4a32-af15-aeec152288a6.svg";
const healingJournalIcon =
  "https://www.figma.com/api/mcp/asset/33d259ef-9739-4ffe-aad2-326ad6a0c5da.svg";
const exploreMapIcon =
  "https://www.figma.com/api/mcp/asset/78da4b2c-eb64-4442-b150-7ecd5c4f3b2e.svg";
const learnNewsIcon =
  "https://www.figma.com/api/mcp/asset/9687fbdc-eb88-47bb-8385-b150abe3812c.svg";
const rewardsIcon =
  "https://www.figma.com/api/mcp/asset/cb930888-4f67-4f47-ac29-6fb1ffef16dd.svg";
const helpIcon =
  "https://www.figma.com/api/mcp/asset/518c5fc3-1ff2-45fa-9b93-d3577e372b58.svg";
const settingsIcon =
  "https://www.figma.com/api/mcp/asset/ac1ac803-b119-46dd-871f-4d54ebda23ba.svg";
const logOutIcon =
  "https://www.figma.com/api/mcp/asset/f3daed6a-646f-4244-812c-85feed7f7902.svg";

export interface SidebarItem {
  label: string;
  to: string;
  iconSrc: string;
  /** When true, only the exact path matches. When false, nested paths also match. */
  end?: boolean;
  /** Shows a subtle "Planned" badge beside the label. */
  planned?: boolean;
}

export const defaultSidebarItems: SidebarItem[] = [
  { label: "Dashboard", to: "/dashboard", iconSrc: dashboardIcon, end: true },
  { label: "Recovery", to: "/recovery", iconSrc: recoveryIcon, end: false },
  { label: "Community", to: "/community", iconSrc: communityIcon, end: true, planned: true },
  { label: "Healing Chain", to: "/healing-chain", iconSrc: healingChainIcon, end: false },
  { label: "Healing Journal", to: "/healing-journal", iconSrc: healingJournalIcon, end: false },
  { label: "Explore Map", to: "/explore-map", iconSrc: exploreMapIcon, end: true, planned: true },
  { label: "Learn & News", to: "/learn-news", iconSrc: learnNewsIcon, end: false, planned: true },
  { label: "Rewards", to: "/rewards", iconSrc: rewardsIcon, end: true, planned: true },
  { label: "Help", to: "/help", iconSrc: helpIcon, end: true },
  { label: "Settings", to: "/settings", iconSrc: settingsIcon, end: false },
];

const imageProps: ImgHTMLAttributes<HTMLImageElement> = {
  alt: "",
  draggable: false,
};

function SidebarNavIcon({ active, src }: { active: boolean; src: string }) {
  return (
    <span
      aria-hidden
      className={cx("size-[var(--space-24)] shrink-0", active ? "bg-primary" : "bg-surface-default")}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}

export interface SidebarProps {
  items?: SidebarItem[];
  collapsed?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onLogoutClick?: () => void;
  closeLabel?: string;
  logoLabel?: string;
  className?: string;
}

export function Sidebar({
  className,
  closeLabel = "Close navigation",
  collapsed = false,
  items = defaultSidebarItems,
  logoLabel = "Go to dashboard",
  mobileOpen = false,
  onLogoutClick,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <button
          aria-label={closeLabel}
          className="fixed inset-0 z-30 bg-[var(--color-overlay)] md:hidden"
          onClick={onMobileClose}
          type="button"
        />
      )}
      <aside
        aria-label="Primary navigation"
        className={cx(
          "fixed inset-y-0 left-0 z-40 flex h-screen flex-col overflow-y-auto bg-primary px-[var(--space-page-inline)] py-[var(--space-sidebar-block)] text-surface-default transition-transform duration-200 md:translate-x-0",
          collapsed
            ? "w-[var(--space-shell-sidebar-collapsed-width)]"
            : "w-[var(--space-shell-sidebar-width)]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="flex shrink-0 justify-center">
          <NavLink
            aria-label={logoLabel}
            className={cx(
              "relative block overflow-hidden",
              collapsed
                ? "size-[var(--space-shell-avatar)]"
                : "h-[var(--space-shell-logo-height)] w-[var(--space-shell-logo-width)]",
            )}
            onClick={onMobileClose}
            to="/dashboard"
          >
            <img
              {...imageProps}
              className={cx(
                "absolute max-w-none",
                collapsed
                  ? "inset-0 size-full object-contain"
                  : "left-[-41.82%] top-[-18.18%] h-[134.38%] w-[186.18%]",
              )}
              src={logoAsset}
            />
          </NavLink>
        </div>

        <nav className="mt-[var(--space-section)] flex flex-1 flex-col" aria-label="App pages">
          <div className="flex flex-col gap-[var(--space-nav-gap)]">
            {items.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  cx(
                    "flex min-h-[var(--space-60)] items-center rounded-sm px-[var(--space-card-padding)] py-[var(--space-component-md)] font-body text-body-lg transition-colors focus-visible:outline-none focus-visible:ring-[var(--border-width)] focus-visible:ring-surface-default",
                    collapsed ? "justify-center" : "gap-[var(--space-nav-icon-text)]",
                    isActive
                      ? "bg-surface-raised font-weight-button text-primary"
                      : "text-surface-default hover:bg-[var(--color-sidebar-hover)]",
                  )
                }
                end={item.end}
                key={item.to}
                onClick={onMobileClose}
                title={collapsed ? item.label : undefined}
                to={item.to}
              >
                {({ isActive }) => (
                  <>
                    <SidebarNavIcon active={isActive} src={item.iconSrc} />
                    <span className={collapsed ? "sr-only" : "flex min-w-0 flex-1 items-center justify-between gap-[var(--space-component-sm)]"}>
                      <span className="truncate">{item.label}</span>
                      {!collapsed && item.planned && (
                        <Badge className="shrink-0 text-body-xs" variant="status">
                          Planned
                        </Badge>
                      )}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <button
            className={cx(
              "mt-auto flex min-h-[var(--space-60)] w-full items-center rounded-sm px-[var(--space-card-padding)] py-[var(--space-component-md)] font-body text-body-lg text-surface-default transition-colors hover:bg-[var(--color-sidebar-hover)] focus-visible:outline-none focus-visible:ring-[var(--border-width)] focus-visible:ring-surface-default",
              collapsed ? "justify-center" : "gap-[var(--space-nav-icon-text)]",
            )}
            onClick={() => {
              onMobileClose?.();
              onLogoutClick?.();
            }}
            title={collapsed ? "Log Out" : undefined}
            type="button"
          >
            <img {...imageProps} className="size-[var(--space-24)] shrink-0" src={logOutIcon} />
            <span className={collapsed ? "sr-only" : undefined}>Log Out</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
