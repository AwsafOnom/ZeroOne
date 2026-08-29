import { Link } from "react-router-dom";
import {
  bangladeshSupportResources,
  healingChainPeerSupport,
  internationalSupportResource,
  zeroOneCareDisclaimer,
  type SupportResource,
} from "@zeroone/shared";
import { Button, Modal } from "../primitives";

function SupportResourceItem({ resource }: { resource: SupportResource }) {
  return (
    <li className="border-b border-border-subtle py-[var(--space-component-md)] last:border-0">
      <p className="text-body-sm font-weight-button text-text-heading">{resource.label}</p>
      <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">{resource.detail}</p>
      {resource.phone ? (
        <a
          className="mt-[var(--space-component-sm)] inline-block text-body-sm font-weight-button text-primary underline-offset-2 hover:underline"
          href={`tel:${resource.phone}`}
        >
          Call {resource.phone}
        </a>
      ) : null}
      {resource.href ? (
        <a
          className="mt-[var(--space-component-sm)] inline-block text-body-sm text-primary underline-offset-2 hover:underline"
          href={resource.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {resource.href.replace(/^https?:\/\//, "")}
        </a>
      ) : null}
    </li>
  );
}

export function SupportResourcesModal({ onClose, open }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      closeLabel="Close support resources"
      description="If you are in immediate danger, use the emergency line below."
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose} size="md" type="button" variant="secondary">
            Close
          </Button>
        </div>
      }
      onClose={onClose}
      open={open}
      title="Support resources"
    >
      <p className="text-body-sm text-text-primary">{zeroOneCareDisclaimer}</p>

      <section className="mt-[var(--space-component-lg)]">
        <h3 className="text-body-sm font-weight-button text-text-heading">Bangladesh</h3>
        <ul className="mt-[var(--space-component-sm)]">
          {bangladeshSupportResources.map((resource) => (
            <SupportResourceItem key={resource.label} resource={resource} />
          ))}
        </ul>
      </section>

      <section className="mt-[var(--space-component-lg)]">
        <h3 className="text-body-sm font-weight-button text-text-heading">Outside Bangladesh</h3>
        <ul className="mt-[var(--space-component-sm)]">
          <SupportResourceItem resource={internationalSupportResource} />
        </ul>
      </section>

      <section className="mt-[var(--space-component-lg)]">
        <h3 className="text-body-sm font-weight-button text-text-heading">{healingChainPeerSupport.label}</h3>
        <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
          {healingChainPeerSupport.detail}
        </p>
        <Link
          className="mt-[var(--space-component-sm)] inline-block text-body-sm font-weight-button text-primary underline-offset-2 hover:underline"
          onClick={onClose}
          to={healingChainPeerSupport.path}
        >
          Open Healing Chain
        </Link>
      </section>
    </Modal>
  );
}
