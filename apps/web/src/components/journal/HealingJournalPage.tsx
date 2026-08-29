import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useCreateReflection, useHealingChain, useJournalAbout, usePeerStoryMatches } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { Toast } from "../primitives";
import { JournalHeroBanner } from "./components/JournalHeroBanner";
import { JournalSidebar } from "./components/JournalSidebar";
import { PeerStoriesPanel } from "./components/PeerStoriesPanel";
import { ReflectionComposer } from "./components/ReflectionComposer";
import { SavedReflectionView } from "./components/SavedReflectionView";
import { formatPeerMatchLabel } from "./journalShared";
import type { ApiAiFeedback, ApiPeerStory } from "@zeroone/shared";

type JournalPhase = "compose" | "saved";

export function HealingJournalPage() {
  const { token } = useAuth();
  const about = useJournalAbout({ token });
  const healingChain = useHealingChain({ token });
  const createReflection = useCreateReflection();
  const savedSectionRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<JournalPhase>("compose");
  const [bodyText, setBodyText] = useState("");
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [emotionalTags, setEmotionalTags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>();

  const [savedBodyText, setSavedBodyText] = useState("");
  const [savedFeedback, setSavedFeedback] = useState<ApiAiFeedback | null>(null);
  const [savedFeedbackStatus, setSavedFeedbackStatus] = useState<"ready" | "crisis" | "unavailable" | "failed">();
  const [savedPeerStories, setSavedPeerStories] = useState<ApiPeerStory[]>([]);

  const peerMatches = usePeerStoryMatches({
    token,
    emotionalTags,
    enabled: emotionalTags.length > 0 && phase === "compose",
  });

  const previewStories = useMemo(() => {
    if (phase === "saved" && savedPeerStories.length > 0) {
      return savedPeerStories;
    }
    return peerMatches.data?.stories ?? [];
  }, [peerMatches.data?.stories, phase, savedPeerStories]);

  const previewMatchLabel = formatPeerMatchLabel(previewStories.length);
  const isSubmitting = createReflection.isPending;

  useEffect(() => {
    if (!toastOpen) {
      return;
    }
    const timer = window.setTimeout(() => setToastOpen(false), 5000);
    return () => window.clearTimeout(timer);
  }, [toastOpen]);

  useEffect(() => {
    if (phase === "saved") {
      savedSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [phase]);

  function resetForNewReflection() {
    setPhase("compose");
    setBodyText("");
    setMoodTags([]);
    setEmotionalTags([]);
    setIsPrivate(true);
    setErrorMessage(undefined);
    setSavedFeedback(null);
    setSavedFeedbackStatus(undefined);
    setSavedPeerStories([]);
    setSavedBodyText("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(undefined);

    if (!bodyText.trim()) {
      setErrorMessage("Write a reflection before saving.");
      return;
    }

    setSavedBodyText(bodyText.trim());
    setSavedFeedback(null);
    setSavedFeedbackStatus(undefined);
    setSavedPeerStories([]);
    setPhase("saved");

    try {
      const result = await createReflection.mutateAsync({
        token,
        bodyText: bodyText.trim(),
        moodTags,
        emotionalTags,
        isPrivate,
        shareAsStory: !isPrivate,
      });

      setSavedFeedback(result.aiFeedback);
      setSavedFeedbackStatus(result.aiFeedbackStatus);
      setSavedPeerStories(result.peerStories);

      const matchLabel = formatPeerMatchLabel(result.peerStories.length);
      setToastMessage(
        matchLabel
          ? `Reflection saved. ${matchLabel}.`
          : "Reflection saved. AI feedback is on its way.",
      );
      setToastOpen(true);
    } catch (error) {
      setPhase("compose");
      setErrorMessage(error instanceof Error ? error.message : "Unable to save this reflection.");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[var(--space-1457)] flex-col gap-[var(--space-layout)]">
      <header>
        {phase === "saved" ? (
          <button
            className="text-body-sm font-weight-button text-primary"
            onClick={resetForNewReflection}
            type="button"
          >
            ← Write another reflection
          </button>
        ) : (
          <>
            <h1 className="text-heading-md font-weight-heading text-text-heading">Healing Journal</h1>
            <p className="mt-[var(--space-component-xs)] text-body-sm text-text-secondary">
              You receive hope. You give hope. Together, we heal.
            </p>
          </>
        )}
      </header>

      <div className="grid gap-[var(--space-layout)] xl:grid-cols-[minmax(0,1fr)_minmax(280px,395px)]">
        <div className="flex min-w-0 flex-col gap-[var(--space-layout)]">
          {phase === "compose" ? (
            <>
              <JournalHeroBanner />
              <ReflectionComposer
                bodyText={bodyText}
                emotionalTags={emotionalTags}
                errorMessage={errorMessage}
                isPrivate={isPrivate}
                isSubmitting={isSubmitting}
                moodTags={moodTags}
                onBodyTextChange={setBodyText}
                onEmotionalTagsChange={setEmotionalTags}
                onMoodTagsChange={setMoodTags}
                onPrivacyChange={setIsPrivate}
                onSubmit={(event) => void handleSubmit(event)}
              />
              <PeerStoriesPanel
                error={peerMatches.error}
                isLoading={peerMatches.isLoading && emotionalTags.length > 0}
                layout="grid"
                matchLabel={previewMatchLabel}
                stories={previewStories}
              />
            </>
          ) : (
            <div ref={savedSectionRef}>
              <SavedReflectionView
                aiFeedback={savedFeedback}
                aiFeedbackStatus={savedFeedbackStatus}
                bodyText={savedBodyText}
                isAiLoading={isSubmitting}
                matchLabel={isSubmitting ? null : formatPeerMatchLabel(savedPeerStories.length)}
                peerStories={savedPeerStories}
                peerStoriesLoading={isSubmitting}
              />
            </div>
          )}
        </div>

        <JournalSidebar
          about={about.data}
          chainError={healingChain.error}
          chainLinks={
            healingChain.data
              ? [
                  ...(healingChain.data.mentor
                    ? [
                        {
                          id: healingChain.data.mentor.linkId,
                          mentor: { name: healingChain.data.mentor.person.name },
                          mentee: null,
                        },
                      ]
                    : []),
                  ...(healingChain.data.mentee
                    ? [
                        {
                          id: healingChain.data.mentee.linkId,
                          mentor: null,
                          mentee: { name: healingChain.data.mentee.person.name },
                        },
                      ]
                    : []),
                ]
              : []
          }
          isChainLoading={healingChain.isLoading}
        />
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-[var(--space-layout)] z-50 flex justify-center px-[var(--space-layout)]">
        <div className="pointer-events-auto w-full max-w-[var(--space-612)]">
          <Toast
            dismissLabel="Dismiss notification"
            message={toastMessage}
            onDismiss={() => setToastOpen(false)}
            open={toastOpen}
            title="Reflection saved"
            variant="success"
          />
        </div>
      </div>
    </div>
  );
}
