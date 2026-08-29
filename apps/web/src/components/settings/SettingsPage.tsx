import { useEffect, useState } from "react";
import { useProfile, useSession, useUpdateProfile } from "../../api";
import { getFirebaseAuth } from "../../auth/firebase";
import { useAuth } from "../../context/AuthContext";
import { formatRequestError } from "../../lib/api";
import { HealthConditionsForm } from "../onboarding/HealthConditionsForm";
import { LifestyleHabitsForm } from "../onboarding/LifestyleHabitsForm";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { Avatar, Badge, Button, Card, Input, Toast, cx } from "../primitives";

type SettingsSectionId = "profile" | "password";

const settingsNavItems: Array<{
  id: SettingsSectionId | "notifications" | "privacy" | "terms" | "support" | "about";
  label: string;
  enabled: boolean;
}> = [
  { id: "profile", label: "My Profile", enabled: true },
  { id: "password", label: "Change Password", enabled: true },
  { id: "notifications", label: "Notification Settings", enabled: false },
  { id: "privacy", label: "Privacy Policy", enabled: false },
  { id: "terms", label: "Terms of Service", enabled: false },
  { id: "support", label: "Help & Support", enabled: false },
  { id: "about", label: "About", enabled: false },
];

function formatDisplayDate(value: string | null | undefined) {
  if (!value) {
    return "Not set";
  }
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SettingsSection({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <Card className="flex flex-col gap-[var(--space-component-lg)]" variant="outlined">
      <div>
        <h2 className="text-heading-sm font-weight-heading text-text-heading">{title}</h2>
        {description ? (
          <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">{description}</p>
        ) : null}
      </div>
      {children}
    </Card>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[var(--space-component-xs)]">
      <span className="text-body-sm font-weight-button text-text-secondary">{label}</span>
      <span className="text-body text-text-primary">{value}</span>
    </div>
  );
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

export function SettingsPage() {
  const { token } = useAuth();
  const session = useSession({ token });
  const profile = useProfile({ token });
  const updateProfile = useUpdateProfile();
  const firebaseUser = getFirebaseAuth()?.currentUser ?? null;

  const [activeSection, setActiveSection] = useState<SettingsSectionId>("profile");
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string>();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "error">("success");

  const accountInfo = session.data?.account;
  const user = profile.data?.user ?? session.data?.user;

  useEffect(() => {
    if (!user) {
      return;
    }
    setName(user.name ?? "");
    setAvatarUrl(user.avatarUrl ?? "");
    setGender(user.gender ?? "");
    setDateOfBirth(user.dateOfBirth?.slice(0, 10) ?? "");
    setHeightCm(user.heightCm?.toString() ?? "");
    setWeightKg(user.weightKg?.toString() ?? "");
  }, [user]);

  useEffect(() => {
    if (!toastOpen) {
      return undefined;
    }
    const timer = window.setTimeout(() => setToastOpen(false), 5000);
    return () => window.clearTimeout(timer);
  }, [toastOpen]);

  function showToast(message: string, variant: "success" | "error") {
    setToastMessage(message);
    setToastVariant(variant);
    setToastOpen(true);
  }

  function validateProfile() {
    const errors: Record<string, string> = {};
    if (!name.trim()) {
      errors.name = "Display name is required.";
    }
    if (avatarUrl.trim() && !avatarUrl.startsWith("/") && !/^https?:\/\//i.test(avatarUrl.trim())) {
      errors.avatarUrl = "Use a full URL or a path starting with /.";
    }
    if (!gender) {
      errors.gender = "Select a gender.";
    }
    if (!dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required.";
    }
    if (!heightCm || Number(heightCm) <= 0) {
      errors.heightCm = "Enter a valid height.";
    }
    if (!weightKg || Number(weightKg) <= 0) {
      errors.weightKg = "Enter a valid weight.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function saveProfile() {
    setErrorMessage(undefined);
    if (!validateProfile()) {
      setErrorMessage("Fix the highlighted fields before saving.");
      return;
    }
    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        avatarUrl: avatarUrl.trim() ? avatarUrl.trim() : null,
        gender,
        dateOfBirth,
        heightCm: Number(heightCm),
        token,
        weightKg: Number(weightKg),
      });
      showToast("Profile updated.", "success");
    } catch (error) {
      const message = formatRequestError(error, "Unable to save your profile.");
      setErrorMessage(message);
      showToast(message, "error");
    }
  }

  const isLoading = session.isLoading || profile.isLoading;
  const loadError = session.error ?? profile.error;

  return (
    <div className="pb-[var(--space-layout)]">
      <header className="mb-[var(--space-layout)]">
        <h1 className="text-heading-lg font-weight-heading text-text-heading">Settings</h1>
        <p className="mt-[var(--space-component-xs)] text-body text-text-secondary">
          Manage your account, preferences, and app settings.
        </p>
      </header>

      <div className="flex flex-col gap-[var(--space-layout)] lg:flex-row lg:items-start">
        <nav aria-label="Settings sections" className="flex w-full shrink-0 flex-col gap-[var(--space-component-sm)] lg:w-[var(--space-275-078)]">
          {settingsNavItems.map((item) => {
            const isActive = item.enabled && item.id === activeSection;
            return (
              <button
                className={cx(
                  "flex items-center justify-between rounded-sm px-[var(--space-card-padding)] py-[var(--space-component-md)] text-left text-body-lg transition-colors",
                  item.enabled
                    ? isActive
                      ? "bg-primary text-surface-default"
                      : "bg-surface-muted text-text-primary hover:bg-surface-success"
                    : "cursor-not-allowed bg-surface-muted text-text-secondary opacity-80",
                )}
                disabled={!item.enabled}
                key={item.id}
                onClick={() => {
                  if (item.enabled && (item.id === "profile" || item.id === "password")) {
                    setActiveSection(item.id);
                  }
                }}
                type="button"
              >
                <span>{item.label}</span>
                {!item.enabled ? (
                  <Badge className="shrink-0" variant="status">
                    Planned
                  </Badge>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-layout)]">
          {isLoading ? (
            <Card state="loading" variant="outlined" />
          ) : loadError ? (
            <Card
              errorContent={<p className="text-body text-orange">{formatRequestError(loadError)}</p>}
              state="error"
              variant="outlined"
            />
          ) : activeSection === "password" ? (
            <SettingsSection
              description="Manage your password and security settings."
              title="Password & Authentication"
            >
              {firebaseUser ? (
                <ChangePasswordForm
                  onError={(message) => showToast(message, "error")}
                  onSuccess={(message) => showToast(message, "success")}
                  user={firebaseUser}
                />
              ) : (
                <p className="text-body text-text-secondary">Sign in again to change your password.</p>
              )}
            </SettingsSection>
          ) : (
            <>
              <Card className="flex flex-col gap-[var(--space-component-lg)] md:flex-row md:items-center md:justify-between" variant="outlined">
                <div className="flex items-center gap-[var(--space-component-lg)]">
                  <Avatar alt="" name={user?.name ?? undefined} size="lg" src={avatarUrl || user?.avatarUrl || undefined} />
                  <div>
                    <p className="text-heading-sm font-weight-heading text-text-heading">{user?.name ?? "ZeroOne member"}</p>
                    <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
                      {accountInfo?.email ?? user?.email ?? "No email on file"}
                    </p>
                  </div>
                </div>
              </Card>

              <SettingsSection description="Update your personal details and information." title="Personal Information">
                <div className="grid gap-[var(--space-component-lg)] md:grid-cols-2">
                  <Input error={fieldErrors.name} label="Display name" onChange={(event) => setName(event.target.value)} value={name} />
                  <Input
                    error={fieldErrors.avatarUrl}
                    label="Avatar URL"
                    onChange={(event) => setAvatarUrl(event.target.value)}
                    placeholder="/avatars/example.png"
                    value={avatarUrl}
                  />
                  <Input as="select" error={fieldErrors.gender} label="Gender" onChange={(event) => setGender(event.target.value)} value={gender}>
                    <option value="">Select your gender</option>
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="NON_BINARY">Non-binary</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </Input>
                  <Input
                    error={fieldErrors.dateOfBirth}
                    label="Date of Birth"
                    onChange={(event) => setDateOfBirth(event.target.value)}
                    type="date"
                    value={dateOfBirth}
                  />
                  <Input
                    error={fieldErrors.heightCm}
                    label="Height (cm)"
                    min="1"
                    onChange={(event) => setHeightCm(event.target.value)}
                    type="number"
                    value={heightCm}
                  />
                  <Input
                    error={fieldErrors.weightKg}
                    label="Weight (kg)"
                    min="1"
                    onChange={(event) => setWeightKg(event.target.value)}
                    type="number"
                    value={weightKg}
                  />
                </div>
                <FormError message={errorMessage} />
                <div className="flex justify-end">
                  <Button isLoading={updateProfile.isPending} onClick={() => void saveProfile()} type="button">
                    Save profile
                  </Button>
                </div>
              </SettingsSection>

              <SettingsSection description="Manage the conditions associated with your recovery journey." title="Health Conditions">
                <HealthConditionsForm
                  onSaved={() => showToast("Health conditions updated.", "success")}
                  primaryConditionLocked={accountInfo?.primaryConditionLocked}
                  token={token}
                />
              </SettingsSection>

              <SettingsSection description="Keep your lifestyle habits up to date." title="Lifestyle Habits">
                <LifestyleHabitsForm onSaved={() => showToast("Lifestyle habits updated.", "success")} token={token} />
              </SettingsSection>

              <SettingsSection description="These details are managed by your sign-in provider or squad assignment." title="Account Information">
                <div className="grid gap-[var(--space-component-lg)] sm:grid-cols-2">
                  <ReadOnlyField label="Email" value={accountInfo?.email ?? user?.email ?? "Not set"} />
                  <ReadOnlyField label="Sign-in method" value={accountInfo?.signInMethod ?? "Unknown"} />
                  <ReadOnlyField
                    label="Journey start date"
                    value={formatDisplayDate(accountInfo?.journeyStartDate ?? user?.journeyStartDate)}
                  />
                  <ReadOnlyField
                    label="Current squad"
                    value={accountInfo?.squad ? `${accountInfo.squad.name} (${accountInfo.squad.conditionName})` : "Not assigned"}
                  />
                </div>
              </SettingsSection>

              <SettingsSection description="Notification and activity preferences." title="Preferences">
                <div className="flex items-center justify-between gap-[var(--space-component-md)] rounded-sm border border-border-subtle bg-surface-muted px-[var(--space-card-padding)] py-[var(--space-component-md)] opacity-70">
                  <div>
                    <p className="text-body font-weight-button text-text-heading">Ambient squad activity</p>
                    <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
                      Background squad updates for demos. No per-user preference exists in the database yet.
                    </p>
                  </div>
                  <Badge variant="status">Planned</Badge>
                </div>
              </SettingsSection>
            </>
          )}
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-[var(--space-page-inline)] z-50 flex justify-center px-[var(--space-page-inline)]">
        <Toast
          className="pointer-events-auto max-w-[var(--space-612)]"
          message={toastMessage}
          onDismiss={() => setToastOpen(false)}
          open={toastOpen}
          title={toastVariant === "success" ? "Saved" : "Something went wrong"}
          variant={toastVariant}
        />
      </div>
    </div>
  );
}
