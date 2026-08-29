import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useHabits, useSaveHabits } from "../../api";
import { Button } from "../primitives";

const habitTypes = [
  ["SMOKING", "Smoking"],
  ["ALCOHOL", "Alcohol"],
  ["DRUG_USE", "Drug Use"],
] as const;
const habitFrequencies = ["NEVER", "OCCASIONALLY", "REGULARLY"] as const;

export interface LifestyleHabitsFormProps {
  token?: string;
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

export function LifestyleHabitsForm({
  onSaved,
  submitLabel = "Save habits",
  token,
}: LifestyleHabitsFormProps) {
  const queryClient = useQueryClient();
  const habits = useHabits({ token });
  const saveHabits = useSaveHabits();
  const [values, setValues] = useState<Record<(typeof habitTypes)[number][0], (typeof habitFrequencies)[number]>>({
    SMOKING: "NEVER",
    ALCOHOL: "NEVER",
    DRUG_USE: "NEVER",
  });
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (!habits.data?.habits.length) {
      return;
    }
    setValues((current) => {
      const next = { ...current };
      for (const habit of habits.data.habits) {
        if (habit.type in next && habitFrequencies.includes(habit.frequency as (typeof habitFrequencies)[number])) {
          next[habit.type as keyof typeof next] = habit.frequency as (typeof habitFrequencies)[number];
        }
      }
      return next;
    });
  }, [habits.data]);

  async function submit() {
    setErrorMessage(undefined);
    try {
      await saveHabits.mutateAsync({
        habits: habitTypes.map(([type]) => ({ frequency: values[type], type })),
        token,
      });
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
      onSaved?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save your lifestyle habits.");
    }
  }

  if (habits.isLoading) {
    return <p className="text-body text-text-secondary">Loading your lifestyle habits…</p>;
  }
  if (habits.error) {
    return <FormError message={habits.error.message} />;
  }

  return (
    <div className="flex flex-col gap-[var(--space-layout)]">
      {habitTypes.map(([type, label]) => (
        <fieldset className="flex flex-col gap-[var(--space-component-md)]" key={type}>
          <legend className="text-heading-sm font-weight-heading text-primary">{label}</legend>
          <div className="grid grid-cols-1 gap-[var(--space-component-md)] sm:grid-cols-3">
            {habitFrequencies.map((frequency) => {
              const isSelected = values[type] === frequency;
              return (
                <button
                  aria-pressed={isSelected}
                  className={`rounded-sm border px-[var(--space-component-sm)] py-[var(--space-component-md)] text-body-sm ${
                    isSelected
                      ? "border-primary bg-primary font-weight-button text-surface-default"
                      : "border-default bg-surface-default text-text-primary"
                  }`}
                  key={frequency}
                  onClick={() => setValues((current) => ({ ...current, [type]: frequency }))}
                  type="button"
                >
                  {frequency[0]}
                  {frequency.slice(1).toLowerCase()}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
      <FormError message={errorMessage} />
      <div className="flex justify-end">
        <Button isLoading={saveHabits.isPending} onClick={() => void submit()} type="button">
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
