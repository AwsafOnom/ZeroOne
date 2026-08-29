import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Input } from "../primitives";

const googleMark = "/assets/google-mark.png";
const appleMark = "/assets/apple-mark.png";
const logo = "/assets/zeroone-logo.png";

function authErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Something went wrong. Please try again.";
  }
  if (error.message.includes("auth/invalid-credential")) {
    return "The email or password is incorrect.";
  }
  if (error.message.includes("auth/email-already-in-use")) {
    return "An account already exists for this email.";
  }
  if (error.message.includes("auth/weak-password")) {
    return "Choose a stronger password.";
  }
  return error.message;
}

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const {
    errorMessage: configurationError,
    signIn,
    signInDemo,
    signInWithApple,
    signInWithGoogle,
    signUp,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = mode === "signup";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(undefined);
    if (isSignup && password !== confirmPassword) {
      setErrorMessage("Passwords must match.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignup) {
        await signUp(email, password, displayName);
        navigate("/onboarding/role");
      } else {
        await signIn(email, password);
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage(authErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function socialSignIn(provider: "google" | "apple") {
    setErrorMessage(undefined);
    setIsSubmitting(true);
    try {
      if (provider === "google") {
        await signInWithGoogle();
      } else {
        await signInWithApple();
      }
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(authErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface-default px-[var(--space-page-inline)] py-[var(--space-layout)] font-body text-text-form">
      <div className="mx-auto grid min-h-[calc(100vh-var(--space-layout)*2)] max-w-[var(--space-1346-546)] items-center gap-[var(--space-layout)] lg:grid-cols-2">
        <section className="hidden items-center justify-center lg:flex" aria-hidden="true">
          <img
            alt=""
            className="max-h-[var(--space-466-458)] w-full max-w-[var(--space-577-69)] object-contain"
            src="/auth/login-illustration.png"
          />
        </section>

        <Card className="mx-auto w-full max-w-[var(--space-577-69)] p-[var(--space-page-inline)]">
          <div className="flex flex-col items-center gap-[var(--space-component-xl)]">
            <img alt="ZeroOne" className="h-[var(--space-80)] w-[var(--space-183)] object-contain" src={logo} />
            <div className="text-center">
              <h1 className="text-heading-lg font-weight-heading text-primary">
                {isSignup ? "Create an account" : "Welcome back"}
              </h1>
              <p className="mt-[var(--space-component-xs)] text-body-lg text-text-form">
                {isSignup ? "Start your wellness journey today" : "Continue your wellness journey"}
              </p>
            </div>
          </div>

          <form className="mt-[var(--space-layout)] flex flex-col gap-[var(--space-component-lg)]" onSubmit={submit}>
            {isSignup && (
              <Input
                required
                label="Name"
                name="name"
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Enter your name"
                value={displayName}
              />
            )}
            <Input
              required
              label="Email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              type="email"
              value={email}
            />
            <Input
              required
              label="Password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              type="password"
              value={password}
            />
            {isSignup && (
              <Input
                required
                label="Confirm Password"
                name="confirmPassword"
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your password"
                type="password"
                value={confirmPassword}
              />
            )}

            {(configurationError || errorMessage) && (
              <p className="rounded-sm bg-surface-success px-[var(--space-component-md)] py-[var(--space-component-sm)] text-body-sm text-orange" role="alert">
                {errorMessage ?? configurationError}
              </p>
            )}

            <Button className="w-full" isLoading={isSubmitting} size="lg" type="submit">
              {isSignup ? "Create Account" : "Sign In"}
            </Button>
            {!isSignup && (
              <Button
                className="w-full"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                onClick={() => {
                  setErrorMessage(undefined);
                  setIsSubmitting(true);
                  void signInDemo()
                    .then(() => navigate("/dashboard"))
                    .catch((error: unknown) => setErrorMessage(authErrorMessage(error)))
                    .finally(() => setIsSubmitting(false));
                }}
                type="button"
                variant="secondary"
              >
                Explore as demo user
              </Button>
            )}
          </form>

          <div className="mt-[var(--space-component-xl)] flex flex-col items-center gap-[var(--space-component-lg)]">
            <p className="text-body-sm text-text-primary">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <Link className="font-weight-button text-primary" to={isSignup ? "/auth/login" : "/auth/signup"}>
                {isSignup ? "Sign In" : "Sign Up"}
              </Link>
            </p>
            <div className="flex w-full items-center gap-[var(--space-component-md)]">
              <span className="h-[var(--border-width)] flex-1 bg-border-surface" />
              <span className="text-body-sm text-text-secondary">{isSignup ? "Or Sign Up with" : "Or Continue with"}</span>
              <span className="h-[var(--border-width)] flex-1 bg-border-surface" />
            </div>
            <div className="grid w-full grid-cols-2 gap-[var(--space-component-md)]">
              <Button
                className="w-full"
                disabled={isSubmitting}
                leadingIcon={<img alt="" className="size-[var(--space-component-lg)]" src={googleMark} />}
                onClick={() => void socialSignIn("google")}
                type="button"
                variant="secondary"
              >
                <span className="sr-only">Continue with Google</span>
              </Button>
              <Button
                className="w-full"
                disabled={isSubmitting}
                leadingIcon={<img alt="" className="size-[var(--space-component-lg)]" src={appleMark} />}
                onClick={() => void socialSignIn("apple")}
                type="button"
                variant="secondary"
              >
                <span className="sr-only">Continue with Apple</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
