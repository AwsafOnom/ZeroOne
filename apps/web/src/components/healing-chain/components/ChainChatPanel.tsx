import { Link } from "react-router-dom";
import { Card } from "../../primitives";

export function ChainChatPanel() {
  return (
    <Card className="rounded-[var(--radius-lg)]" variant="outlined">
      <h2 className="text-heading-sm font-weight-heading text-text-heading">Chain chat</h2>
      <p className="mt-[var(--space-component-md)] text-body-sm text-text-secondary">
        Encrypted real-time messaging between you and your mentor or mentee is on the roadmap.
      </p>
      <Link className="mt-[var(--space-layout)] inline-flex text-body-sm font-weight-button text-primary" to="/healing-chain/chain-chat">
        View Chain Chat roadmap
      </Link>
    </Card>
  );
}
