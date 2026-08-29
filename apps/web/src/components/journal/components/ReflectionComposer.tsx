import type { FormEvent } from "react";
import { Button } from "../../primitives";
import { emotionalTagOptions, moodOptions, SectionError } from "../journalShared";

function toggleValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
}

export type PrivacyMode = "private" | "share";

export function ReflectionComposer({
  bodyText,
  emotionalTags,
  errorMessage,
  isPrivate,
  isSubmitting,
  moodTags,
  onBodyTextChange,
  onEmotionalTagsChange,
  onMoodTagsChange,
  onPrivacyChange,
  onSubmit,
}: {
  bodyText: string;
  moodTags: string[];
  emotionalTags: string[];
  isPrivate: boolean;
  isSubmitting: boolean;
  errorMessage?: string;
  onBodyTextChange: (value: string) => void;
  onMoodTagsChange: (value: string[]) => void;
  onEmotionalTagsChange: (value: string[]) => void;
  onPrivacyChange: (isPrivate: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      className="rounded-[var(--radius-lg)] border border-border-subtle bg-surface-default p-[var(--space-layout)]"
      onSubmit={onSubmit}
    >
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-component-md)]">
        <h2 className="text-heading-sm font-weight-heading text-text-heading">Write Your Reflection Privately</h2>
        <div className="flex items-center gap-[var(--space-component-sm)] text-body-sm text-text-primary">
          <span className="font-weight-button">Private</span>
        </div>
      </div>

      <div className="mt-[var(--space-layout)] grid gap-[var(--space-component-md)] lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]">
        <textarea
          className="min-h-[var(--space-328-617)] w-full resize-y rounded-sm border border-border-default bg-surface-default px-[var(--space-component-md)] py-[var(--space-component-sm)] font-body text-body-sm text-text-form shadow-input placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-[var(--border-width)] focus:ring-primary"
          onChange={(event) => onBodyTextChange(event.target.value)}
          placeholder="Write honestly about…"
          value={bodyText}
        />
        <div className="rounded-sm border border-border-subtle p-[var(--space-component-sm)]">
          <p className="text-body font-weight-button text-text-primary">Add Emotional Tag</p>
          <div className="mt-[var(--space-component-sm)] flex flex-wrap gap-[var(--space-component-xs)]">
            {emotionalTagOptions.map((option) => {
              const selected = emotionalTags.includes(option.value);
              return (
                <button
                  className={`rounded-sm px-[var(--space-component-sm)] py-[var(--space-component-xs)] text-body-xs font-weight-button transition-colors ${
                    selected
                      ? "bg-healing-accent text-surface-default"
                      : "border border-border-subtle bg-surface-default text-text-primary hover:bg-surface-muted"
                  }`}
                  key={option.value}
                  onClick={() => onEmotionalTagsChange(toggleValue(emotionalTags, option.value))}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <fieldset className="mt-[var(--space-layout)]">
        <legend className="text-body font-weight-button text-text-primary">How are you feeling today?</legend>
        <div className="mt-[var(--space-component-sm)] flex flex-wrap gap-[var(--space-component-sm)]">
          {moodOptions.map((option) => {
            const selected = moodTags.includes(option.value);
            return (
              <button
                className={`flex items-center gap-[var(--space-component-sm)] rounded-sm border px-[var(--space-component-sm)] py-[var(--space-component-sm)] text-body-xs font-weight-button transition-colors ${
                  selected
                    ? "border-primary bg-surface-success text-primary"
                    : "border-border-default bg-surface-default text-text-primary hover:bg-surface-muted"
                }`}
                key={option.value}
                onClick={() => onMoodTagsChange(toggleValue(moodTags, option.value))}
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-[var(--space-layout)] flex flex-wrap items-center gap-[var(--space-component-md)]">
        <label className="text-body-xs font-weight-button text-text-primary" htmlFor="journal-privacy">
          Privacy
        </label>
        <select
          className="rounded-sm border border-border-default bg-surface-default px-[var(--space-component-sm)] py-[var(--space-component-sm)] text-body-xs text-text-primary"
          id="journal-privacy"
          onChange={(event) => onPrivacyChange(event.target.value === "private")}
          value={isPrivate ? "private" : "share"}
        >
          <option value="private">Private (only you)</option>
          <option value="share">Share anonymously as a story</option>
        </select>
      </div>

      {errorMessage && (
        <div className="mt-[var(--space-component-md)]">
          <SectionError message={errorMessage} />
        </div>
      )}

      <Button
        className="mt-[var(--space-layout)] h-[var(--space-80-151)] w-full rounded-sm text-button-lg"
        isLoading={isSubmitting}
        size="lg"
        type="submit"
      >
        Save Reflection
      </Button>
    </form>
  );
}
