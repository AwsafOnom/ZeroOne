import { useState, type ReactNode } from "react";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  Input,
  Modal,
  ProgressBar,
  ProgressRing,
  Skeleton,
  Tabs,
  Toast,
  type BadgeVariant,
  type ButtonSize,
  type ButtonVariant,
  type PrimitiveState,
} from "./primitives";

const buttonVariants: ButtonVariant[] = ["primary", "secondary", "ghost", "destructive"];
const buttonSizes: ButtonSize[] = ["sm", "md", "lg"];
const badgeVariants: BadgeVariant[] = ["points", "status", "condition", "success", "neutral"];
const tabs = [
  { label: "Activities", value: "activities" },
  { label: "Onggi Guardian", value: "onggi" },
  { label: "Global Resonance", value: "resonance" },
  { label: "Squad Details", value: "squad" },
  { label: "Crystallize Onggi", value: "crystallize" },
];
const stateSamples: PrimitiveState[] = ["loading", "empty", "error", "ready"];

function Section({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="flex flex-col gap-[var(--space-component-lg)]">
      <h2 className="font-body text-heading-md font-weight-heading text-text-heading">{title}</h2>
      {children}
    </section>
  );
}

export function PrimitiveShowcase() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [tab, setTab] = useState("activities");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState<PrimitiveState>("ready");
  const [toastOpen, setToastOpen] = useState(true);

  return (
    <main className="min-h-screen bg-surface-app px-[var(--space-page-inline)] py-[var(--space-layout)]">
      <div className="mx-auto flex max-w-[var(--space-1457)] flex-col gap-[var(--space-layout)]">
        <header className="flex flex-col gap-[var(--space-component-xs)]">
          <p className="font-body text-body-sm font-weight-label uppercase tracking-body text-primary">
            ZeroOne
          </p>
          <h1 className="font-body text-heading-lg font-weight-heading text-text-heading">
            Primitive component review
          </h1>
          <p className="max-w-[var(--space-612)] font-body text-body text-text-secondary">
            Stateless building blocks mapped from the supplied Figma frames.
          </p>
        </header>

        <Section title="Button">
          <div className="grid gap-[var(--space-component-md)] md:grid-cols-4">
            {buttonVariants.map((variant) => (
              <div className="flex flex-col gap-[var(--space-component-sm)]" key={variant}>
                <p className="font-body text-body-sm text-text-secondary">{variant}</p>
                {buttonSizes.map((size) => (
                  <Button key={size} size={size} variant={variant}>
                    {size}
                  </Button>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-[var(--space-component-md)]">
            <Button isLoading>Loading</Button>
            <Button disabled variant="secondary">
              Disabled
            </Button>
            <Button leadingIcon={<span aria-hidden="true">+</span>} trailingIcon={<span aria-hidden="true">→</span>}>
              Icon slots
            </Button>
          </div>
        </Section>

        <Section title="Input">
          <div className="grid gap-[var(--space-component-lg)] md:grid-cols-2">
            <Input label="Text" placeholder="Text value" />
            <Input label="Email" type="email" placeholder="Email value" />
            <Input label="Password" passwordVisible={passwordVisible} onTogglePasswordVisibility={() => setPasswordVisible((visible) => !visible)} type="password" visibilityToggleLabel="Toggle password visibility" />
            <Input error="This field needs attention." label="Error state" placeholder="Error value" />
            <Input as="textarea" helperText="Supporting text comes from props." label="Textarea" placeholder="Textarea value" />
            <Input as="select" label="Select">
              <option value="">Select an option</option>
              <option value="one">Option one</option>
            </Input>
          </div>
          <div className="grid gap-[var(--space-component-lg)] md:grid-cols-2">
            <Input isLoading label="Loading" />
            <Input label="Disabled" placeholder="Disabled value" disabled />
          </div>
        </Section>

        <Section title="Card and Badge">
          <div className="grid gap-[var(--space-component-lg)] md:grid-cols-2">
            <Card>
              <p className="font-body text-body font-weight-button text-text-heading">Base surface</p>
              <p className="mt-[var(--space-component-xs)] font-body text-body-sm text-text-secondary">
                Default raised card.
              </p>
            </Card>
            <Card variant="outlined">
              <p className="font-body text-body font-weight-button text-text-heading">Outlined surface</p>
            </Card>
            <Card variant="muted">
              <p className="font-body text-body font-weight-button text-text-heading">Muted surface</p>
            </Card>
            <Card errorContent="Unable to load this surface." state="error">
              <p>Hidden while in error state.</p>
            </Card>
          </div>
          <div className="flex flex-wrap items-center gap-[var(--space-component-sm)]">
            {badgeVariants.map((variant) => (
              <Badge key={variant} variant={variant}>
                {variant === "points" ? "50 pts" : variant}
              </Badge>
            ))}
            <Badge isLoading />
          </div>
        </Section>

        <Section title="Avatar">
          <div className="flex flex-wrap items-center gap-[var(--space-component-lg)]">
            <Avatar name="Taylor Reed" size="sm" />
            <Avatar name="Taylor Reed" size="md" />
            <Avatar name="Taylor Reed" size="lg" />
            <Avatar fallback="TR" name="Image fallback" size="md" />
            <AvatarGroup aria-label="Squad members">
              <Avatar name="Taylor Reed" size="sm" />
              <Avatar name="Morgan Lee" size="sm" />
              <Avatar name="Jordan Kim" size="sm" />
            </AvatarGroup>
          </div>
        </Section>

        <Section title="Tabs">
          <Tabs items={tabs} onValueChange={setTab} value={tab} />
          <div className="grid gap-[var(--space-component-md)] md:grid-cols-3">
            <Tabs emptyContent="No tabs available." items={[]} state="empty" />
            <Tabs errorContent="Tabs could not be loaded." items={tabs} state="error" />
            <Tabs items={tabs} state="loading" />
          </div>
        </Section>

        <Section title="Progress">
          <div className="flex flex-wrap items-center gap-[var(--space-layout)]">
            <ProgressRing label="Onggi" size="sm" value={35} />
            <ProgressRing label="Resonance" size="md" value={70} />
            <ProgressRing label="Harmony" size="lg" value={85} />
            <ProgressRing errorContent="Ring unavailable." state="error" />
            <ProgressBar label="Spark progress" value={62} />
          </div>
          <div className="grid gap-[var(--space-component-md)] md:grid-cols-3">
            <ProgressBar emptyContent="No goal selected." state="empty" />
            <ProgressBar state="loading" />
            <ProgressBar errorContent="Goal unavailable." state="error" />
          </div>
        </Section>

        <Section title="Modal, Toast, Skeleton">
          <div className="flex flex-wrap items-center gap-[var(--space-component-md)]">
            <Button onClick={() => { setModalState("ready"); setModalOpen(true); }}>
              Open modal
            </Button>
            {stateSamples.slice(0, 3).map((state) => (
              <Button key={state} onClick={() => { setModalState(state); setModalOpen(true); }} variant="secondary">
                Modal {state}
              </Button>
            ))}
          </div>
          <Modal
            closeLabel="Close modal"
            description="Content and state are supplied by the consumer."
            emptyContent="There is nothing to show."
            errorContent="The modal content could not be loaded."
            onClose={() => setModalOpen(false)}
            open={modalOpen}
            state={modalState}
            title="Primitive modal"
          >
            <p className="font-body text-body text-text-primary">Ready modal content.</p>
          </Modal>
          <div className="grid gap-[var(--space-component-lg)] md:grid-cols-2">
            {toastOpen && (
              <Toast
                dismissLabel="Dismiss toast"
                message="A presentational notification with a dismiss action."
                onDismiss={() => setToastOpen(false)}
                open
                title="Success"
                variant="success"
              />
            )}
            <div className="flex items-center gap-[var(--space-component-md)]">
              <Skeleton className="h-[var(--space-50)] w-[var(--space-190)]" />
              <Skeleton shape="circle" className="size-[var(--space-50)]" />
              <Skeleton shape="text" className="h-[var(--space-component-md)] w-[var(--space-121-792)]" />
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
