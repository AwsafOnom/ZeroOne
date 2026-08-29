import { useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "../../auth/firebase";
import { Button, Input } from "../primitives";

const GOOGLE_ACCOUNT_SECURITY_URL = "https://myaccount.google.com/security";

export interface ChangePasswordFormProps {
  user: User;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

function usesPasswordProvider(user: User) {
  if (user.providerData.length === 0) {
    return Boolean(user.email);
  }
  return user.providerData.some((provider) => provider.providerId === "password");
}

function usesGoogleProvider(user: User) {
  return user.providerData.some((provider) => provider.providerId === "google.com");
}

function mapFirebasePasswordError(error: unknown): string {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Your current password is incorrect.";
    case "auth/weak-password":
      return "Choose a stronger password with at least 8 characters.";
    case "auth/requires-recent-login":
      return "For security, sign out and sign in again, then retry changing your password.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again.";
    default:
      return error instanceof Error ? error.message : "Unable to update your password.";
  }
}

export function ChangePasswordForm({ onError, onSuccess, user }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (usesGoogleProvider(user) && !usesPasswordProvider(user)) {
    return (
      <div className="rounded-sm border border-border-subtle bg-surface-muted px-[var(--space-card-padding)] py-[var(--space-component-lg)]">
        <p className="text-body text-text-primary">
          This account signs in with Google. Password changes are managed in your Google account settings.
        </p>
        <a
          className="mt-[var(--space-component-md)] inline-flex text-body-sm font-weight-button text-primary underline-offset-2 hover:underline"
          href={GOOGLE_ACCOUNT_SECURITY_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          Open Google account security
        </a>
      </div>
    );
  }

  function validate() {
    const errors: Record<string, string> = {};
    if (!currentPassword) {
      errors.currentPassword = "Enter your current password.";
    }
    if (newPassword.length < 8) {
      errors.newPassword = "Use at least 8 characters.";
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.newPassword = "Choose a password different from your current one.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function submit() {
    if (!validate()) {
      onError("Fix the highlighted fields before saving.");
      return;
    }

    const auth = getFirebaseAuth();
    const firebaseUser = auth?.currentUser;
    const email = firebaseUser?.email ?? user.email;
    if (!auth || !firebaseUser || !email) {
      onError("Password changes are unavailable for this account.");
      return;
    }

    setIsSubmitting(true);
    try {
      const credential = EmailAuthProvider.credential(email, currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onSuccess("Password updated.");
    } catch (error) {
      onError(mapFirebasePasswordError(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-[var(--space-component-lg)]">
      <div className="grid gap-[var(--space-component-lg)] md:grid-cols-3">
        <Input
          autoComplete="current-password"
          error={fieldErrors.currentPassword}
          label="Current password"
          onChange={(event) => setCurrentPassword(event.target.value)}
          type="password"
          value={currentPassword}
        />
        <Input
          autoComplete="new-password"
          error={fieldErrors.newPassword}
          label="New password"
          onChange={(event) => setNewPassword(event.target.value)}
          type="password"
          value={newPassword}
        />
        <Input
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
          label="Confirm password"
          onChange={(event) => setConfirmPassword(event.target.value)}
          type="password"
          value={confirmPassword}
        />
      </div>
      <div className="flex justify-end">
        <Button isLoading={isSubmitting} onClick={() => void submit()} type="button">
          Update password
        </Button>
      </div>
    </div>
  );
}
