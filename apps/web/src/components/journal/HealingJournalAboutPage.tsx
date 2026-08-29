import { Link } from "react-router-dom";
import { useJournalAbout } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { Card, Skeleton } from "../primitives";
import { journalHelpBenefits, journalKeyFeatures, SectionError } from "./journalShared";

function CheckItem({ children }: { children: string }) {
  return (
    <li className="flex gap-[var(--space-component-sm)] text-body-sm text-text-primary">
      <span
        aria-hidden
        className="mt-[var(--space-component-xs)] size-[var(--space-component-md)] shrink-0 rounded-round bg-surface-success text-center text-body-xs leading-[var(--space-component-md)] text-success"
      >
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

export function HealingJournalAboutPage() {
  const { token } = useAuth();
  const about = useJournalAbout({ token });

  return (
    <div className="mx-auto flex w-full max-w-[var(--space-1457)] flex-col gap-[var(--space-layout)]">
      <header>
        <Link className="text-body-sm font-weight-button text-primary" to="/healing-journal">
          ← Back to journal
        </Link>
        <h1 className="mt-[var(--space-component-md)] text-heading-md font-weight-heading text-text-heading">
          About Healing Journal
        </h1>
      </header>

      {about.isLoading ? (
        <Card variant="outlined">
          <Skeleton className="h-[var(--space-60)]" />
          <Skeleton className="mt-[var(--space-component-md)] h-[var(--space-328-617)]" />
        </Card>
      ) : about.error ? (
        <SectionError message={about.error.message} />
      ) : about.data ? (
        <>
          <Card className="rounded-[var(--radius-lg)] bg-gradient-healing-panel" variant="muted">
            <p className="max-w-[var(--space-612)] text-body-lg text-text-primary">{about.data.banner}</p>
            <p className="mt-[var(--space-component-md)] max-w-[var(--space-612)] text-body-sm text-text-secondary">
              A safe and private space to write your thoughts, feelings, and small victories — without performing
              strength for anyone else.
            </p>
          </Card>

          <section>
            <h2 className="text-heading-sm font-weight-heading text-text-heading">What Is Healing Journal?</h2>
            <div className="mt-[var(--space-layout)] grid gap-[var(--space-layout)] md:grid-cols-2">
              {about.data.principles.map((principle) => (
                <Card className="rounded-[var(--radius-lg)]" key={principle.title} variant="outlined">
                  <h3 className="text-body-lg font-weight-button text-text-primary">{principle.title}</h3>
                  <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">{principle.description}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="grid gap-[var(--space-layout)] xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
            <div>
              <h2 className="text-heading-sm font-weight-heading text-text-heading">How Healing Journal Helps You</h2>
              <div className="mt-[var(--space-layout)] grid gap-[var(--space-component-md)] sm:grid-cols-2">
                {journalHelpBenefits.map((benefit) => (
                  <Card className="rounded-[var(--radius-lg)]" key={benefit.title} variant="outlined">
                    <h3 className="text-body font-weight-button text-text-primary">{benefit.title}</h3>
                    <p className="mt-[var(--space-component-sm)] text-body-sm text-text-secondary">{benefit.description}</p>
                  </Card>
                ))}
              </div>
            </div>
            <Card className="rounded-[var(--radius-lg)] bg-surface-success" variant="outlined">
              <h3 className="text-body-lg font-weight-button text-text-primary">Key Features</h3>
              <ul className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-sm)]">
                {journalKeyFeatures.map((feature) => (
                  <CheckItem key={feature}>{feature}</CheckItem>
                ))}
              </ul>
            </Card>
          </section>

          <Card className="rounded-[var(--radius-lg)] bg-gradient-healing-panel p-[var(--space-layout)]" variant="muted">
            <h2 className="text-heading-sm font-weight-heading text-text-heading">Recovery Reflection Stories</h2>
            <p className="mt-[var(--space-component-md)] max-w-[var(--space-612)] text-body font-weight-button text-doctor-cta">
              You are not the only one carrying this pain.
            </p>
            <p className="mt-[var(--space-component-md)] max-w-[var(--space-612)] text-body-sm text-text-secondary">
              Write privately about what illness has taken from your day. When you are ready, stories from others who
              chose to share can remind you that your feelings are real — and shared.
            </p>
            <Link
              className="mt-[var(--space-layout)] inline-flex text-body-sm font-weight-button text-success"
              to="/healing-journal"
            >
              Start writing
            </Link>
          </Card>
        </>
      ) : null}
    </div>
  );
}
