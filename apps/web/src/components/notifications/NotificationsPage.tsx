import { Link } from "react-router-dom";
import { NotificationList } from "./NotificationList";

export function NotificationsPage() {
  return (
    <section className="mx-auto flex w-full max-w-[var(--space-612)] flex-col gap-[var(--space-section)]">
      <header className="flex flex-wrap items-center justify-between gap-[var(--space-component-md)]">
        <div className="flex items-center gap-[var(--space-component-md)]">
          <Link
            aria-label="Back to dashboard"
            className="font-body text-body-lg font-weight-button text-text-secondary hover:text-primary"
            to="/dashboard"
          >
            ←
          </Link>
          <h1 className="font-body text-heading-md font-weight-heading text-text-heading">Notification</h1>
        </div>
      </header>
      <NotificationList limit={30} showMarkAll />
    </section>
  );
}
