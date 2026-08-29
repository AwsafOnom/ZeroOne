import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConditions, useProfile, useSaveConditions } from "../../api";
import type { ApiHealthCondition } from "@zeroone/shared";
import { Button } from "../primitives";

export interface HealthConditionsFormProps {
  token?: string;
  primaryConditionLocked?: boolean;
  submitLabel?: string;
  onSaved?: () => void;
}

function FormError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return (
    <p
      className="rounded-sm bg-surface-success px-[var(--space-component-md)] py-[var(--space-component-sm)] text-body-sm text-orange"
      role="alert"
    >
      {message}
    </p>
  );
}

export function HealthConditionsForm({
  onSaved,
  primaryConditionLocked = false,
  submitLabel = "Save conditions",
  token,
}: HealthConditionsFormProps) {
  const queryClient = useQueryClient();
  const conditions = useConditions({ token });
  const profile = useProfile({ token });
  const saveConditions = useSaveConditions();
  const [selected, setSelected] = useState<string[]>([]);
  const [primaryConditionId, setPrimaryConditionId] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    const savedConditions = profile.data?.user.conditions ?? [];
    setSelected(savedConditions.map((condition) => condition.id));
    setPrimaryConditionId(savedConditions.find((condition) => condition.isPrimary)?.id ?? savedConditions[0]?.id ?? "");
  }, [profile.data]);

  const groupedConditions = useMemo(() => {
    const groups = new Map<string, ApiHealthCondition[]>();
    for (const condition of conditions.data?.conditions ?? []) {
      const existing = groups.get(condition.category) ?? [];
      groups.set(condition.category, [...existing, condition]);
    }
    return [...groups.entries()];
  }, [conditions.data]);

  function toggleCondition(id: string) {
    if (primaryConditionLocked && id === primaryConditionId) {
      return;
    }
    if (selected.includes(id)) {
      const nextSelected = selected.filter((value) => value !== id);
      setSelected(nextSelected);
      if (primaryConditionId === id) {
        setPrimaryConditionId(nextSelected[0] ?? "");
      }
      return;
    }
    setSelected([...selected, id]);
  }

  async function submit() {
    setErrorMessage(undefined);
    if (selected.length === 0) {
      setErrorMessage("Select at least one condition.");
      return;
    }
    if (!primaryConditionId || !selected.includes(primaryConditionId)) {
      setErrorMessage("Choose one of your selected conditions as your primary condition.");
      return;
    }
    try {
      await saveConditions.mutateAsync({ conditionIds: selected, primaryConditionId, token });
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
      await queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      onSaved?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save your conditions.");
    }
  }

  const queryError = conditions.error ?? profile.error;
  const isLoading = conditions.isLoading || profile.isLoading;
  const selectedConditions = selected
    .map((id) => conditions.data?.conditions.find((condition) => condition.id === id))
    .filter((condition): condition is ApiHealthCondition => Boolean(condition));

  if (isLoading) {
    return <p className="text-body text-text-secondary">Loading your health conditions…</p>;
  }
  if (queryError) {
    return <FormError message={queryError.message} />;
  }
  if (groupedConditions.length === 0) {
    return <p className="text-body text-text-secondary">No health conditions are available yet.</p>;
  }

  return (
    <div className="flex flex-col gap-[var(--space-layout)]">
      {groupedConditions.map(([category, values]) => (
        <fieldset className="flex flex-wrap gap-[var(--space-component-md)]" key={category}>
          <legend className="mb-[var(--space-component-md)] w-full text-heading-sm font-weight-heading text-primary">
            {category === "NEUROLOGICAL"
              ? "Neurological & Cognitive Conditions"
              : `${category[0]}${category.slice(1).toLowerCase()} Health Conditions`}
          </legend>
          {values.map((condition) => {
            const isSelected = selected.includes(condition.id);
            const isLockedPrimary = primaryConditionLocked && condition.id === primaryConditionId;
            return (
              <button
                aria-pressed={isSelected}
                className={`rounded-sm border px-[var(--space-component-md)] py-[var(--space-component-sm)] text-body-lg transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                  isSelected
                    ? "border-primary bg-primary text-surface-default"
                    : "border-default bg-surface-default text-text-primary hover:bg-surface-success"
                }`}
                disabled={isLockedPrimary}
                key={condition.id}
                onClick={() => toggleCondition(condition.id)}
                title={isLockedPrimary ? "Your squad condition cannot be removed." : undefined}
                type="button"
              >
                {condition.name}
              </button>
            );
          })}
        </fieldset>
      ))}
      {selectedConditions.length > 0 && (
        <fieldset className="border-t border-default pt-[var(--space-layout)]">
          <legend className="text-heading-sm font-weight-heading text-primary">Primary Condition</legend>
          <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
            {primaryConditionLocked
              ? "Your primary condition is locked while you belong to a squad. Squad reassignment is not available yet."
              : "Choose the condition we should use for your squad match."}
          </p>
          <div
            aria-label="Primary condition"
            className="mt-[var(--space-component-md)] flex flex-wrap gap-[var(--space-component-md)]"
            role="radiogroup"
          >
            {selectedConditions.map((condition) => {
              const isPrimary = primaryConditionId === condition.id;
              return (
                <button
                  aria-checked={isPrimary}
                  className={`rounded-sm border px-[var(--space-component-md)] py-[var(--space-component-sm)] text-body-lg transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                    isPrimary
                      ? "border-primary bg-primary text-surface-default"
                      : "border-default bg-surface-default text-text-primary hover:bg-surface-success"
                  }`}
                  disabled={primaryConditionLocked}
                  key={condition.id}
                  onClick={() => setPrimaryConditionId(condition.id)}
                  role="radio"
                  type="button"
                >
                  {condition.name}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
      <FormError message={errorMessage} />
      <div className="flex justify-end">
        <Button isLoading={saveConditions.isPending} onClick={() => void submit()} type="button">
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
