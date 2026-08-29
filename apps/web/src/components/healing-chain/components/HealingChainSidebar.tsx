import { Link } from "react-router-dom";
import type { ApiHealingChainConnection } from "@zeroone/shared";
import { useAssistant } from "../../../context/AssistantContext";
import { Avatar, Button, Card, Input } from "../../primitives";
import { personDisplayName } from "../healingChainShared";

function CheckboxGroup({
  legend,
  options,
}: {
  legend: string;
  options: string[];
}) {
  return (
    <fieldset className="flex flex-col gap-[var(--space-component-sm)]">
      <legend className="text-body-sm font-weight-button text-text-heading">{legend}</legend>
      <div className="flex flex-wrap gap-[var(--space-component-md)]">
        {options.map((option) => (
          <label className="inline-flex items-center gap-[var(--space-component-xs)] text-body-sm text-text-primary" key={option}>
            <input className="size-[var(--space-component-md)] accent-primary" name={legend} type="checkbox" value={option} />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function MatchPreferencesPanel() {
  return (
    <Card className="rounded-[var(--radius-lg)] p-[var(--space-layout)] shadow-card" variant="outlined">
      <div>
        <h2 className="text-body-lg font-weight-button text-text-heading">Help us personalize your match</h2>
        <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
          Tell us what kind of mentor or mentee connection would feel most supportive.
        </p>
      </div>

      <form className="mt-[var(--space-layout)] flex flex-col gap-[var(--space-component-lg)]" onSubmit={(event) => event.preventDefault()}>
        <Input as="select" label="Category">
          <option value="">Select category</option>
          <option value="physical">Physical health</option>
          <option value="mental">Mental health</option>
          <option value="neurological">Neurological</option>
        </Input>

        <CheckboxGroup legend="Preferred Mentor" options={["Male", "Female", "No Preference"]} />
        <CheckboxGroup
          legend="Availability"
          options={["Weekdays", "Weekends", "Evenings", "Flexible"]}
        />
        <CheckboxGroup
          legend="Session Type"
          options={["Video Call", "Voice Call", "Text Chat", "In-Person (if local)"]}
        />

        <Input as="select" label="Preferred Language">
          <option value="">Select language</option>
          <option value="en">English</option>
          <option value="ko">Korean</option>
          <option value="bn">Bengali</option>
        </Input>
      </form>
    </Card>
  );
}

function ChainConnectionsPanel({
  mentor,
  mentee,
}: {
  mentor: ApiHealingChainConnection | null;
  mentee: ApiHealingChainConnection | null;
}) {
  const connections = [
    mentor ? { id: mentor.linkId, person: mentor.person, role: "Mentor" as const } : null,
    mentee ? { id: mentee.linkId, person: mentee.person, role: "Mentee" as const } : null,
  ].filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  return (
    <Card className="rounded-[var(--radius-lg)] p-[var(--space-layout)]" variant="outlined">
      <h2 className="text-body-lg font-weight-button text-text-heading">Chat With Your Connection</h2>
      {connections.length === 0 ? (
        <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
          Your mentor and mentee connections will appear here when assigned.
        </p>
      ) : (
        <ul className="mt-[var(--space-component-md)] flex flex-col gap-[var(--space-component-md)]">
          {connections.map((connection) => (
            <li className="flex items-center gap-[var(--space-component-md)]" key={connection.id}>
              <Avatar
                name={personDisplayName(connection.person)}
                size="md"
                src={connection.person.avatarUrl ?? undefined}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-body font-weight-button text-text-primary">
                  {personDisplayName(connection.person)}
                </p>
                <p className="text-body-xs text-text-secondary">{connection.role}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link
        className="mt-[var(--space-layout)] block text-center text-body-sm font-weight-button text-primary"
        to="/healing-chain/chain-chat"
      >
        See All
      </Link>
    </Card>
  );
}

function AiAssistantPromo() {
  const { openAssistant } = useAssistant();

  return (
    <Card className="rounded-[var(--radius-lg)] bg-gradient-ai-panel p-[var(--space-layout)]" variant="ai">
      <h2 className="text-body-lg font-weight-button text-text-heading">AI Assistant</h2>
      <p className="mt-[var(--space-component-sm)] text-body-sm text-text-secondary">
        Get personalized health tips and recovery guidance.
      </p>
      <Button className="mt-[var(--space-component-md)] w-full" onClick={openAssistant} size="sm" variant="primary">
        Chat Now
      </Button>
    </Card>
  );
}

export function HealingChainSidebar({
  mentor,
  mentee,
}: {
  mentor: ApiHealingChainConnection | null;
  mentee: ApiHealingChainConnection | null;
}) {
  return (
    <aside className="flex flex-col gap-[var(--space-layout)]">
      <MatchPreferencesPanel />
      <ChainConnectionsPanel mentee={mentee} mentor={mentor} />
      <AiAssistantPromo />
    </aside>
  );
}
