import { useEffect, useState, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AssistantPanel } from "../assistant";
import { NotificationsDropdown } from "../notifications";
import { useAssistant } from "../../context/AssistantContext";
import { cx } from "../primitives";
import { Sidebar } from "./Sidebar";
import { TopBar, type TopBarProps } from "./TopBar";
export interface AppLayoutProps {
  children?: ReactNode;
  sidebarCollapsed?: boolean;
  topBarProps?: Partial<Omit<TopBarProps, "onMenuOpen">>;
  className?: string;
}

const shellLabels = {
  assistantLabel: "AI Assistant",
  menuLabel: "Menu",
  notificationsLabel: "Notifications",
  searchPlaceholder: "Search for Anything",
} as const;

export function AppLayout({
  children,
  className,
  sidebarCollapsed = false,
  topBarProps,
}: AppLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const { openAssistant } = useAssistant();

  useEffect(() => {
    setMobileSidebarOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface-app">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div
        className={cx(
          "min-h-screen transition-[padding] duration-200",
          sidebarCollapsed
            ? "md:pl-[var(--space-shell-sidebar-collapsed-width)]"
            : "md:pl-[var(--space-shell-sidebar-width)]",
        )}
      >
        <div className="relative">
          <TopBar
            {...shellLabels}
            {...topBarProps}
            onAssistantClick={(event) => {
              topBarProps?.onAssistantClick?.(event);
              openAssistant();
            }}
            onMenuOpen={() => setMobileSidebarOpen(true)}
            onNotificationsClick={() => setNotificationsOpen((open) => !open)}
          />
          <NotificationsDropdown onClose={() => setNotificationsOpen(false)} open={notificationsOpen} />
        </div>
        <main className={cx("min-w-0 px-[var(--space-page-inline)] pb-[var(--space-layout)]", className)}>
          {children ?? <Outlet />}
        </main>
      </div>
      <AssistantPanel />
    </div>
  );
}
