import type { ApiAiFeedback } from "@zeroone/shared";
import { Card, Skeleton } from "../../primitives";
import { SectionError } from "../journalShared";

export function AiFeedbackPanel({
  error,
  feedback,
  isLoading,
  loadingMessage = "Listening to what you wrote…",
  status,
  variant = "compose",
}: {
  error?: string;
  feedback: ApiAiFeedback | null;
  isLoading: boolean;
  loadingMessage?: string;
  status?: "ready" | "crisis" | "unavailable" | "failed";
  variant?: "compose" | "saved";
}) {
  const content = (
    <>
      <h2 className="text-heading-sm font-weight-heading text-text-heading">AI Feedback</h2>
      <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
        Specific to what you wrote — never generic encouragement.
      </p>
      {isLoading ? (
        <div className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-sm)]" role="status">
          <p className="text-body-sm font-weight-button text-primary">{loadingMessage}</p>
          <Skeleton className="h-[var(--space-45)]" />
          <Skeleton className="h-[var(--space-45)]" />
          <Skeleton className="h-[var(--space-45)]" />
        </div>
      ) : error ? (
        <div className="mt-[var(--space-component-md)]">
          <SectionError message={error} />
        </div>
      ) : feedback ? (
        <div
          className={`mt-[var(--space-component-md)] rounded-sm p-[var(--space-card-padding)] ${
            feedback.kind === "crisis" ? "border border-orange bg-surface-muted" : "bg-surface-success"
          }`}
        >
          {feedback.kind === "crisis" && (
            <p className="mb-[var(--space-component-md)] text-body-sm font-weight-button text-orange">
              Crisis support resources
            </p>
          )}
          <p className="whitespace-pre-wrap text-body-sm text-text-primary">{feedback.responseText}</p>
        </div>
      ) : status === "unavailable" ? (
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
          AI feedback is not available right now. Your reflection is saved privately.
        </p>
      ) : status === "failed" ? (
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
          The AI service is busy right now. Please try again shortly — your reflection is still saved privately.
        </p>
      ) : (
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
          Save your reflection to receive personalized feedback.
        </p>
      )}
    </>
  );

  if (variant === "saved") {
    return <section className="rounded-[var(--radius-lg)]">{content}</section>;
  }

  return (
    <Card className={feedback?.kind === "crisis" ? "border-orange" : undefined} variant="outlined">
      {content}
    </Card>
  );
}
