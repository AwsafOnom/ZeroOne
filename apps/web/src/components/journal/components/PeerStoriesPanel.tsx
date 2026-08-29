import type { ApiPeerStory } from "@zeroone/shared";
import { Link } from "react-router-dom";
import { Card, Skeleton } from "../../primitives";
import { formatEmotionalTagLabel, formatPeerMatchLabel, SectionError } from "../journalShared";

export function PeerStoriesPanel({
  error,
  isLoading,
  layout = "stack",
  matchLabel,
  stories,
  title = "Stories From People Who Understand",
}: {
  error?: Error | null;
  isLoading: boolean;
  stories: ApiPeerStory[];
  title?: string;
  layout?: "stack" | "grid";
  matchLabel?: string | null;
}) {
  const resolvedMatchLabel = matchLabel ?? formatPeerMatchLabel(stories.length);

  return (
    <Card className="rounded-[var(--radius-lg)] p-[var(--space-layout)]" variant="outlined">
      <div className="flex flex-wrap items-start justify-between gap-[var(--space-component-md)]">
        <div>
          <h2 className="text-heading-sm font-weight-heading text-text-heading">{title}</h2>
          <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
            Real stories. Real people. Similar feelings.
          </p>
        </div>
        <Link className="text-body-sm text-primary" to="/healing-journal/about">
          Why these stories?
        </Link>
      </div>

      {resolvedMatchLabel && !isLoading && stories.length > 0 && (
        <p className="mt-[var(--space-component-md)] text-body-sm font-weight-button text-primary" role="status">
          {resolvedMatchLabel}
        </p>
      )}

      {isLoading ? (
        <div
          className={`mt-[var(--space-component-md)] ${
            layout === "grid" ? "grid gap-[var(--space-component-md)] md:grid-cols-3" : "flex flex-col gap-[var(--space-component-sm)]"
          }`}
        >
          <Skeleton className="h-[var(--space-128-856)]" />
          <Skeleton className="h-[var(--space-128-856)]" />
          <Skeleton className="h-[var(--space-128-856)]" />
        </div>
      ) : error ? (
        <div className="mt-[var(--space-component-md)]">
          <SectionError message={error.message} />
        </div>
      ) : stories.length === 0 ? (
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
          Choose emotional tags while you write to see stories from others who chose to share.
        </p>
      ) : (
        <ul
          className={`mt-[var(--space-component-md)] ${
            layout === "grid"
              ? "grid gap-[var(--space-component-md)] md:grid-cols-2 xl:grid-cols-3"
              : "flex flex-col gap-[var(--space-component-md)]"
          }`}
        >
          {stories.map((story) => (
            <li className="rounded-sm border border-border-subtle p-[var(--space-card-padding)]" key={story.id}>
              <p className="text-body-sm font-weight-button text-text-primary">Anonymous</p>
              <p className="mt-[var(--space-component-sm)] text-body-sm text-text-primary">{story.anonymizedBody}</p>
              <div className="mt-[var(--space-component-sm)] flex flex-wrap gap-[var(--space-component-xs)]">
                {story.emotionalTags.map((tag) => (
                  <span
                    className="rounded-sm bg-surface-blue-light px-[var(--space-component-sm)] py-[var(--space-component-xs)] text-body-xs text-text-secondary"
                    key={tag}
                  >
                    {formatEmotionalTagLabel(tag)}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
