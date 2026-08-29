import { useEffect } from "react";
import { useAssistant } from "../../context/AssistantContext";
import { AssistantChat } from "./AssistantChat";

export function AssistantPanel() {
  const { closeAssistant, isOpen } = useAssistant();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeAssistant();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeAssistant, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close AI Assistant"
        className="absolute inset-0 bg-[color:var(--color-overlay)]"
        onClick={closeAssistant}
        type="button"
      />
      <div className="relative flex h-full w-full max-w-[min(100vw,var(--space-612))] flex-col bg-surface-default shadow-hero">
        <AssistantChat onClose={closeAssistant} showCloseButton variant="panel" />
      </div>
    </div>
  );
}
