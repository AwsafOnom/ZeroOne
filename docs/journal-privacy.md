# Healing Journal privacy

This document describes what the Healing Journal stores, what is sent to Google Gemini, and what other people can see.

## What is stored

| Data | Where | Who can access |
|------|--------|----------------|
| Reflection body text | `reflections.body_text` | Owner only (enforced in API queries with `userId`) |
| Mood tags (7 options) | `reflections.mood_tags` | Owner only |
| Emotional tags (8 options) | `reflections.emotional_tags` | Owner only |
| Privacy flag (`isPrivate`, default `true`) | `reflections.is_private` | Owner only |
| AI feedback responses | `ai_feedback` | Owner only (joined through owned reflections) |
| Journey milestones | `journey_milestones` | Owner only |
| Voluntarily shared stories | `shared_stories` | Published stories are anonymous to readers |

Reflections are **never** visible to squad members, mentors, or the general platform unless the author explicitly opts in to share a story.

## Query-level enforcement

All reflection reads and writes filter by authenticated `userId`:

- `GET /api/v1/journal/reflections`
- `GET /api/v1/journal/reflections/:id`
- `PATCH /api/v1/journal/reflections/:id`
- `POST /api/v1/journal/reflections/:id/ai-feedback`

If a reflection does not belong to the current user, the API returns `404 Not found` — not `403` — to avoid leaking whether an ID exists.

## What is sent to Google Gemini

When AI feedback is requested (on save or via the feedback endpoint), the server sends:

- Reflection body text
- Selected mood labels
- Selected emotional tag labels
- The journal system prompt and few-shot examples (server-side only; not user PII)

The server does **not** send:

- User name, email, avatar, or Firebase UID
- Squad, mentor, or condition identifiers
- Precise timestamps

Google receives this only server-side via `GEMINI_API_KEY`. The browser never sees the API key.

If `GEMINI_API_KEY` is not configured, the reflection is still saved and the API returns `aiFeedbackStatus: "unavailable"`.

## Crisis detection (before Gemini)

Before any Gemini call, the server runs a **local pattern check** on reflection text for language suggesting self-harm, suicide, or acute crisis (for example: “kill myself”, “want to die”, “suicidal”, “self-harm”, “end my life”).

If triggered:

1. Gemini is **not** called.
2. The reflection is still saved.
3. The API returns crisis support resources (emergency services, 988 Lifeline, Crisis Text Line, IASP helpline directory) with `aiFeedbackStatus: "crisis"` and `model: "crisis-support"`.

Detection is keyword/phrase based — not a clinical assessment. False positives may show support resources when ordinary language matches; false negatives are possible. Crisis support is shown instead of therapeutic-style feedback.

## What others can see when you share

Sharing is **explicit per entry** via “Share anonymously as a Recovery Reflection Story” (or `POST /api/v1/journal/stories` after save).

Published stories expose only:

- Anonymized body text (your words, without attribution)
- Emotional tags

Published stories do **not** expose:

- Your name or avatar
- Precise dates (peer-story match endpoints omit `createdAt`)
- Mood tags or AI feedback from the original reflection

Peer stories shown while composing are selected from published stories by **emotional tag overlap**, not by health condition.

## Developer testing

`POST /dev/ai-test` is available when `NODE_ENV !== "production"` or `ENABLE_DEV_ROUTES=true`. It accepts reflection text and tags and returns the raw AI/crisis response without persisting data. Do not enable in production unless intentional.

## Configuration

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Server-side Google Gemini access |
| `ANTHROPIC_API_KEY` | Server-side Anthropic access (`AI_PROVIDER=anthropic`) |
| `AI_PROVIDER` | Provider id: `gemini` (default) or `anthropic` |
| `AI_MODEL` | Model id (default `gemini-flash-latest` for Gemini; `claude-haiku-4-5` for Anthropic) |
| `AI_REQUEST_TIMEOUT_MS` | Per-request timeout (default 30000) |
| `AI_MAX_RETRIES` | Retry count with exponential backoff and jitter (default 4) |
| `AI_RATE_LIMIT_MAX` | Max AI calls per window per IP (default 10) |
| `ENABLE_DEV_ROUTES` | Expose `/dev/*` routes in production when `true` |

The AI layer uses a provider interface (`apps/api/src/ai/types.ts`). Swapping providers is a configuration change (`AI_PROVIDER` + API key), not a journal rewrite.
