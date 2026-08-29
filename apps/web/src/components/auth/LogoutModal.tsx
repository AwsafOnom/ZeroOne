import { Button, Modal } from "../primitives";

export interface LogoutModalProps {
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isLoading = false, onClose, onConfirm, open }: LogoutModalProps) {
  return (
    <Modal
      closeLabel="Cancel"
      footer={
        <div className="flex flex-wrap justify-end gap-[var(--space-component-md)]">
          <Button disabled={isLoading} onClick={onClose} size="md" type="button" variant="secondary">
            Cancel
          </Button>
          <Button isLoading={isLoading} onClick={onConfirm} size="md" type="button" variant="destructive">
            Log Out
          </Button>
        </div>
      }
      onClose={isLoading ? undefined : onClose}
      open={open}
      title="Log out of ZeroOne?"
    />
  );
}
