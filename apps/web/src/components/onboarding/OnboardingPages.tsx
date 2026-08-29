import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  useAssessment,
  useAssignSquad,
  useConditions,
  useHabits,
  useProfile,
  useSaveAssessment,
  useSaveConditions,
  useSaveHabits,
  useUpdateProfile,
} from "../../api";
import type { ApiHealthCondition, ApiSquadAssignment } from "@zeroone/shared";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Input } from "../primitives";

const logo = "/assets/zeroone-logo.png";
const individualIcon = "/assets/individual-icon.svg";
const professionalIcon = "/assets/professional-icon.svg";
const wellnessIcons = {
  Rarely: "/assets/wellness-rarely.svg",
  Sometimes: "/assets/wellness-sometimes.svg",
  Often: "/assets/wellness-often.svg",
} as const;

const steps = ["role", "profile", "conditions", "wellness", "habits"] as const;
type OnboardingPath = (typeof steps)[number];

function StepProgress({ current }: { current: OnboardingPath | "review" }) {
  const activeIndex = current === "review" ? steps.length : steps.indexOf(current);
  return (
    <div aria-label={`Onboarding step ${activeIndex + 1} of ${steps.length}`} className="flex items-center gap-[var(--space-component-xl)]">
      {steps.map((step, index) => (
        <span
          aria-hidden="true"
          className={`h-[var(--space-component-xs)] w-[var(--space-50)] rounded-pill ${
            index <= activeIndex ? "bg-primary" : "bg-border-default"
          }`}
          key={step}
        />
      ))}
    </div>
  );
}

function OnboardingShell({
  children,
  current,
  subtitle,
  title,
}: {
  children: ReactNode;
  current: OnboardingPath | "review";
  subtitle: string;
  title: string;
}) {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-surface-default px-[var(--space-page-inline)] py-[var(--space-layout)] font-body text-text-form">
      <button
        aria-label="Go back"
        className="absolute left-[var(--space-page-inline)] top-[var(--space-layout)] text-heading-md text-text-primary"
        onClick={() => navigate(-1)}
        type="button"
      >
        ←
      </button>
      <div className="mx-auto flex min-h-[calc(100vh-var(--space-layout)*2)] w-full max-w-[var(--space-908-667)] flex-col items-center justify-center gap-[var(--space-layout)]">
        <header className="flex flex-col items-center text-center">
          <img alt="ZeroOne" className="h-[var(--space-80)] w-[var(--space-183)] object-contain" src={logo} />
          <h1 className="mt-[var(--space-component-lg)] text-heading-lg font-weight-heading text-primary">{title}</h1>
          <p className="mt-[var(--space-component-xs)] text-body-lg text-text-form">{subtitle}</p>
        </header>
        {children}
        <StepProgress current={current} />
      </div>
    </main>
  );
}

function FormError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return (
    <p className="rounded-sm bg-surface-success px-[var(--space-component-md)] py-[var(--space-component-sm)] text-body-sm text-orange" role="alert">
      {message}
    </p>
  );
}

function QueryState({
  error,
  isLoading,
}: {
  error?: Error | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <p className="text-body text-text-secondary">Loading your saved progress…</p>;
  }
  if (error) {
    return <FormError message={error.message} />;
  }
  return null;
}

export function RolePage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const updateProfile = useUpdateProfile();
  const [errorMessage, setErrorMessage] = useState<string>();

  async function chooseRole(role: "INDIVIDUAL" | "PROFESSIONAL") {
    setErrorMessage(undefined);
    try {
      await updateProfile.mutateAsync({ role, token });
      navigate("/onboarding/profile");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save your role.");
    }
  }

  return (
    <OnboardingShell current="role" subtitle="How would you like to use ZeroOne?" title="Choose Your Role">
      <div className="grid w-full max-w-[var(--space-908-667)] gap-[var(--space-component-xl)] md:grid-cols-2">
        {[
          ["INDIVIDUAL", "Individual", "Personal health and wellness tracking", individualIcon],
          ["PROFESSIONAL", "Professional", "Healthcare provider or therapist", professionalIcon],
        ].map(([role, label, description]) => (
          <Card className="flex flex-col items-center gap-[var(--space-layout)] p-[var(--space-layout)]" key={role} variant="outlined">
            <div className={`flex size-[var(--space-80)] items-center justify-center rounded-round ${role === "INDIVIDUAL" ? "bg-primary" : "bg-doctor-cta"}`}>
              <img alt="" className="size-[var(--space-40)] object-contain" src={role === "INDIVIDUAL" ? individualIcon : professionalIcon} />
            </div>
            <div className="text-center">
              <h2 className="text-heading-md font-weight-heading text-text-heading">{label}</h2>
              <p className="mt-[var(--space-component-xs)] text-body-lg text-text-role-secondary">{description}</p>
            </div>
            <Button
              className="w-full"
              isLoading={updateProfile.isPending}
              onClick={() => void chooseRole(role as "INDIVIDUAL" | "PROFESSIONAL")}
              variant={role === "INDIVIDUAL" ? "primary" : "secondary"}
            >
              Continue as {label}
            </Button>
          </Card>
        ))}
      </div>
      <FormError message={errorMessage} />
    </OnboardingShell>
  );
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const profile = useProfile({ token });
  const updateProfile = useUpdateProfile();
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (!profile.data?.user) {
      return;
    }
    const saved = profile.data.user;
    setGender(saved.gender ?? "");
    setDateOfBirth(saved.dateOfBirth?.slice(0, 10) ?? "");
    setHeightCm(saved.heightCm?.toString() ?? "");
    setWeightKg(saved.weightKg?.toString() ?? "");
  }, [profile.data]);

  async function submit() {
    setErrorMessage(undefined);
    if (!gender || !dateOfBirth || !heightCm || !weightKg) {
      setErrorMessage("Complete every required profile field to continue.");
      return;
    }
    try {
      await updateProfile.mutateAsync({
        dateOfBirth,
        gender,
        heightCm: Number(heightCm),
        token,
        weightKg: Number(weightKg),
      });
      navigate("/onboarding/conditions");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save your profile.");
    }
  }

  return (
    <OnboardingShell current="profile" subtitle="Start your wellness journey today" title="Complete Profile">
      <Card
        className="w-full max-w-[var(--space-577-69)]"
        errorContent={<FormError message={profile.error?.message ?? "Unable to load your profile."} />}
        state={profile.isLoading ? "loading" : profile.isError ? "error" : "ready"}
      >
        <div className="flex flex-col gap-[var(--space-component-lg)]">
          <Input
            as="select"
            label="Gender"
            onChange={(event) => setGender(event.target.value)}
            value={gender}
          >
            <option value="">Select your gender</option>
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
            <option value="NON_BINARY">Non-binary</option>
            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
          </Input>
          <Input
            label="Date of Birth"
            onChange={(event) => setDateOfBirth(event.target.value)}
            type="date"
            value={dateOfBirth}
          />
          <Input
            label="Height (cm)"
            min="1"
            onChange={(event) => setHeightCm(event.target.value)}
            type="number"
            value={heightCm}
          />
          <Input
            label="Weight (kg)"
            min="1"
            onChange={(event) => setWeightKg(event.target.value)}
            type="number"
            value={weightKg}
          />
          <FormError message={errorMessage} />
          <Button isLoading={updateProfile.isPending} onClick={() => void submit()} size="lg">
            Continue
          </Button>
        </div>
      </Card>
    </OnboardingShell>
  );
}

export function ConditionsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();
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
      setErrorMessage("Select at least one condition to continue.");
      return;
    }
    if (!primaryConditionId || !selected.includes(primaryConditionId)) {
      setErrorMessage("Choose one of your selected conditions as your primary condition.");
      return;
    }
    try {
      await saveConditions.mutateAsync({ conditionIds: selected, primaryConditionId, token });
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
      navigate("/onboarding/wellness");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save your conditions.");
    }
  }

  const queryError = conditions.error ?? profile.error;
  const selectedConditions = selected
    .map((id) => conditions.data?.conditions.find((condition) => condition.id === id))
    .filter((condition): condition is ApiHealthCondition => Boolean(condition));
  return (
    <OnboardingShell current="conditions" subtitle="Start your wellness journey today" title="Health Conditions">
      <Card className="w-full" variant="outlined">
        <QueryState error={queryError} isLoading={conditions.isLoading || profile.isLoading} />
        {!conditions.isLoading && !queryError && groupedConditions.length === 0 && (
          <p className="text-body text-text-secondary">No health conditions are available yet.</p>
        )}
        <div className="flex flex-col gap-[var(--space-layout)]">
          {groupedConditions.map(([category, values]) => (
            <fieldset className="flex flex-wrap gap-[var(--space-component-md)]" key={category}>
              <legend className="mb-[var(--space-component-md)] w-full text-heading-sm font-weight-heading text-primary">
                {category === "NEUROLOGICAL" ? "Neurological & Cognitive Conditions" : `${category[0]}${category.slice(1).toLowerCase()} Health Conditions`}
              </legend>
              {values.map((condition) => {
                const isSelected = selected.includes(condition.id);
                return (
                  <button
                    aria-pressed={isSelected}
                    className={`rounded-sm border px-[var(--space-component-md)] py-[var(--space-component-sm)] text-body-lg transition-colors ${
                      isSelected ? "border-primary bg-primary text-surface-default" : "border-default bg-surface-default text-text-primary hover:bg-surface-success"
                    }`}
                    key={condition.id}
                    onClick={() => toggleCondition(condition.id)}
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
                Choose the condition we should use for your squad match.
              </p>
              <div aria-label="Primary condition" className="mt-[var(--space-component-md)] flex flex-wrap gap-[var(--space-component-md)]" role="radiogroup">
                {selectedConditions.map((condition) => {
                  const isPrimary = primaryConditionId === condition.id;
                  return (
                    <button
                      aria-checked={isPrimary}
                      className={`rounded-sm border px-[var(--space-component-md)] py-[var(--space-component-sm)] text-body-lg transition-colors ${
                        isPrimary ? "border-primary bg-primary text-surface-default" : "border-default bg-surface-default text-text-primary hover:bg-surface-success"
                      }`}
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
        </div>
        <FormError message={errorMessage} />
        <Button className="mt-[var(--space-layout)] w-full" isLoading={saveConditions.isPending} onClick={() => void submit()} size="lg">
          Continue
        </Button>
      </Card>
    </OnboardingShell>
  );
}

const wellnessOptions = ["Rarely", "Sometimes", "Often"] as const;

export function WellnessPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const assessment = useAssessment({ token });
  const saveAssessment = useSaveAssessment();
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    const saved = assessment.data?.assessment?.responses.anxietyFrequency;
    if (typeof saved === "string") {
      setAnswer(saved);
    }
  }, [assessment.data]);

  async function submit() {
    setErrorMessage(undefined);
    if (!answer) {
      setErrorMessage("Choose the answer that best describes you.");
      return;
    }
    try {
      await saveAssessment.mutateAsync({
        responses: { anxietyFrequency: answer },
        status: "COMPLETED",
        token,
      });
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
      navigate("/onboarding/habits");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save your wellness check.");
    }
  }

  return (
    <OnboardingShell current="wellness" subtitle="How often do you feel anxious or worried?" title="Mental Wellness Check">
      <Card className="w-full max-w-[var(--space-577-69)]" variant="outlined">
        <QueryState error={assessment.error} isLoading={assessment.isLoading} />
        <div className="flex flex-col gap-[var(--space-component-xl)]">
          {wellnessOptions.map((option) => {
            const isSelected = answer === option;
            return (
              <button
                aria-pressed={isSelected}
                className={`flex items-center rounded-sm border p-[var(--space-card-padding)] text-left text-body-lg ${
                  isSelected ? "border-primary bg-surface-success" : "border-default bg-surface-default"
                }`}
                key={option}
                onClick={() => setAnswer(option)}
                type="button"
              >
                <span className="mr-[var(--space-component-lg)] flex size-[var(--space-60)] items-center justify-center rounded-round bg-surface-blue-light">
                  <img alt="" className="size-[var(--space-32)] object-contain" src={wellnessIcons[option]} />
                </span>
                {option}
              </button>
            );
          })}
        </div>
        <FormError message={errorMessage} />
        <Button className="mt-[var(--space-layout)] w-full" isLoading={saveAssessment.isPending} onClick={() => void submit()} size="lg">
          Continue
        </Button>
      </Card>
    </OnboardingShell>
  );
}

const habitTypes = [
  ["SMOKING", "Smoking"],
  ["ALCOHOL", "Alcohol"],
  ["DRUG_USE", "Drug Use"],
] as const;
const habitFrequencies = ["NEVER", "OCCASIONALLY", "REGULARLY"] as const;

export function HabitsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();
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
      navigate("/onboarding/review");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save your lifestyle habits.");
    }
  }

  return (
    <OnboardingShell current="habits" subtitle="Help us personalize your experience" title="Lifestyle Habits">
      <Card className="w-full max-w-[var(--space-577-69)]" variant="outlined">
        <QueryState error={habits.error} isLoading={habits.isLoading} />
        <div className="flex flex-col gap-[var(--space-component-xl)]">
          {habitTypes.map(([type, label]) => (
            <fieldset className="flex flex-col gap-[var(--space-component-md)]" key={type}>
              <legend className="text-heading-sm font-weight-heading text-primary">{label}</legend>
              <div className="grid grid-cols-3 gap-[var(--space-component-md)]">
                {habitFrequencies.map((frequency) => {
                  const isSelected = values[type] === frequency;
                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`rounded-sm border px-[var(--space-component-sm)] py-[var(--space-component-md)] text-body-sm ${
                        isSelected ? "border-primary bg-primary font-weight-button text-surface-default" : "border-default bg-surface-default text-text-primary"
                      }`}
                      key={frequency}
                      onClick={() => setValues((current) => ({ ...current, [type]: frequency }))}
                      type="button"
                    >
                      {frequency[0]}{frequency.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
        <FormError message={errorMessage} />
        <Button className="mt-[var(--space-layout)] w-full" isLoading={saveHabits.isPending} onClick={() => void submit()} size="lg">
          Continue
        </Button>
      </Card>
    </OnboardingShell>
  );
}

export function ReviewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const profile = useProfile({ token });
  const assignSquad = useAssignSquad();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [assignedSquad, setAssignedSquad] = useState<ApiSquadAssignment["squad"]>(null);

  async function submit() {
    setErrorMessage(undefined);
    try {
      const result = await assignSquad.mutateAsync({ token });
      await queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
      if (result.squad) {
        setAssignedSquad(result.squad);
      } else {
        setErrorMessage("Your squad was assigned, but its details could not be loaded. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to assign your squad.");
    }
  }

  const conditionCount = profile.data?.user.conditions?.length ?? 0;
  return (
    <OnboardingShell current="review" subtitle="Review your information before we begin" title="Almost There!">
      <Card className="w-full max-w-[var(--space-721-625)]" variant="outlined">
        <div className="flex flex-col gap-[var(--space-component-md)]">
          {[
            ["Role", profile.data?.user.role ?? "Not selected"],
            ["Height", profile.data?.user.heightCm ? `${profile.data.user.heightCm} cm` : "Not provided"],
            ["Weight", profile.data?.user.weightKg ? `${profile.data.user.weightKg} kg` : "Not provided"],
            ["Conditions", `${conditionCount} selected`],
            ["Mental Assessment", "Completed"],
          ].map(([label, value]) => (
            <div className="flex items-center justify-between rounded-sm border border-default px-[var(--space-card-padding)] py-[var(--space-component-md)]" key={label}>
              <span className="text-body font-weight-label text-text-primary">{label}</span>
              <span className="text-body text-text-primary">{value}</span>
            </div>
          ))}
        </div>
        {assignedSquad ? (
          <div className="mt-[var(--space-layout)] rounded-sm bg-surface-success p-[var(--space-card-padding)] text-text-primary" role="status">
            <h2 className="text-heading-sm font-weight-heading text-primary">Your squad is ready</h2>
            <p className="mt-[var(--space-component-xs)] text-body-lg">{assignedSquad.name}</p>
            <ul className="mt-[var(--space-component-lg)] grid gap-[var(--space-component-xs)] text-body-sm">
              {assignedSquad.members.map((member) => (
                <li key={member.id}>{member.name ?? "Squad member"}</li>
              ))}
            </ul>
            <Button className="mt-[var(--space-layout)] w-full" onClick={() => navigate("/dashboard")} size="lg">
              Continue to Dashboard
            </Button>
          </div>
        ) : (
          <>
            <p className="mt-[var(--space-layout)] rounded-sm bg-surface-success p-[var(--space-card-padding)] text-body-sm text-text-primary">
              <span className="font-weight-button text-doctor-cta">What’s Next?</span> We’ll create a personalized health plan based on your profile.
            </p>
            <FormError message={errorMessage} />
            <Button className="mt-[var(--space-layout)] w-full" isLoading={assignSquad.isPending} onClick={() => void submit()} size="lg">
              Continue
            </Button>
          </>
        )}
      </Card>
    </OnboardingShell>
  );
}
