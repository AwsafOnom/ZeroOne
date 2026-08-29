import { Link } from "react-router-dom";
import type { ApiJournalAbout } from "@zeroone/shared";
import { Card, Skeleton } from "../../primitives";
import { useAssistant } from "../../../context/AssistantContext";
import { journalHowItWorks, SectionError } from "../journalShared";

function CheckItem({ children }: { children: string }) {
  return (
    <li className="flex gap-[var(--space-component-sm)] text-body-sm text-text-primary">
      <span aria-hidden className="mt-[var(--space-component-xs)] size-[var(--space-component-md)] shrink-0 rounded-round bg-surface-success text-center text-body-xs leading-[var(--space-component-md)] text-success">
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

export function JournalSidebar({
  about,
  chainError,
  chainLinks,
  isChainLoading,
}: {
  about?: ApiJournalAbout;
  chainLinks: Array<{
    id: string;
    mentor?: { name?: string | null } | null;
    mentee?: { name?: string | null } | null;
  }>;
  isChainLoading: boolean;
  chainError?: Error | null;
}) {
  const { openAssistant } = useAssistant();
  const connections = chainLinks.flatMap((link) => {
    const entries: Array<{ id: string; name: string; role: string }> = [];
    if (link.mentor) {
      entries.push({ id: `${link.id}-mentor`, name: link.mentor.name ?? "Mentor", role: "Mentor" });
    }
    if (link.mentee) {
      entries.push({ id: `${link.id}-mentee`, name: link.mentee.name ?? "Mentee", role: "Mentee" });
    }
    return entries;
  });

  return (
    <aside className="flex flex-col gap-[var(--space-layout)]">
      <Card className="rounded-[var(--radius-lg)]" variant="outlined">
        <h2 className="text-body-lg font-weight-button text-text-heading">About Healing Journal</h2>
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
          {about?.banner ??
            "A safe, private space to write what is true today — and see that others have carried something similar."}
        </p>
        {about ? (
          <ul className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-sm)]">
            {about.principles.map((principle) => (
              <CheckItem key={principle.title}>{principle.title}</CheckItem>
            ))}
          </ul>
        ) : (
          <Skeleton className="mt-[var(--space-component-md)] h-[var(--space-80-151)]" />
        )}
        <Link
          className="mt-[var(--space-layout)] block text-center text-body-sm font-weight-button text-success"
          to="/healing-journal/about"
        >
          Learn more about Healing Journal
        </Link>
      </Card>

      <Card className="rounded-[var(--radius-lg)]" variant="outlined">
        <h2 className="text-body-lg font-weight-button text-text-heading">How Healing Journal Works</h2>
        <ul className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-sm)]">
          {journalHowItWorks.map((item) => (
            <CheckItem key={item}>{item}</CheckItem>
          ))}
        </ul>
      </Card>

      <Card className="rounded-[var(--radius-lg)]" variant="outlined">
        <h2 className="text-body-lg font-weight-button text-text-heading">Chat With Your Connection</h2>
        {isChainLoading ? (
          <div className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-md)]">
            <Skeleton className="h-[var(--space-60)]" />
            <Skeleton className="h-[var(--space-60)]" />
          </div>
        ) : chainError ? (
          <div className="mt-[var(--space-component-md)]">
            <SectionError message={chainError.message} />
          </div>
        ) : connections.length === 0 ? (
          <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
            Your mentor and mentee connections will appear here when assigned.
          </p>
        ) : (
          <ul className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-md)]">
            {connections.slice(0, 2).map((connection) => (
              <li className="flex items-center gap-[var(--space-component-md)]" key={connection.id}>
                <span
                  aria-hidden
                  className="flex size-[var(--space-60)] shrink-0 items-center justify-center rounded-round bg-surface-blue-light text-body-sm font-weight-button text-primary"
                >
                  {connection.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-body font-weight-button text-text-primary">{connection.name}</p>
                  <p className="text-body-xs text-text-secondary">{connection.role}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link className="mt-[var(--space-layout)] block text-center text-body-sm font-weight-button text-success" to="/healing-chain">
          See all
        </Link>
      </Card>

      <Card className="rounded-[var(--radius-lg)] bg-gradient-ai-panel" variant="ai">
        <h2 className="text-body-lg font-weight-button text-text-heading">AI Assistant</h2>
        <p className="mt-[var(--space-component-sm)] text-body-sm text-text-secondary">Get personalized health tips.</p>
        <button
          className="mt-[var(--space-component-md)] inline-flex min-h-[var(--space-53-69)] items-center justify-center rounded-md bg-healing-accent px-[var(--space-component-lg)] text-body-sm font-weight-button text-surface-default"
          onClick={openAssistant}
          type="button"
        >
          Chat now
        </button>
      </Card>
    </aside>
  );
}
