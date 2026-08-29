# ZeroOne API

Base URL: `/api/v1`

The health check remains available at `/health`.

All endpoints below require `Authorization: Bearer <Firebase ID token>` unless
noted otherwise. The API verifies the token with Firebase Admin, resolves the
caller to a database `User`, and scopes resource queries to that user.

Every JSON body, path parameter, and query parameter is validated with Zod.
Errors use `{ "error": string, "details"?: unknown, "issues"?: unknown[] }`.

## Authentication and account

### `GET /auth/session`

Response:

```json
{
  "user": "ApiUser",
  "unreadNotifications": 0,
  "onboarding": {
    "roleCompleted": true,
    "profileCompleted": true,
    "conditionsCompleted": true,
    "wellnessCompleted": true,
    "habitsCompleted": true,
    "assigned": true,
    "nextStep": "complete"
  }
}
```

`ApiUser` contains `id`, `firebaseUid`, `name`, `email`, `role`, `avatarUrl`,
`gender`, `dateOfBirth`, `heightCm`, `weightKg`, `journeyStartDate`, and
optional primary-condition records.

### `GET /dashboard/summary`

Response: `{ "summary": "DailyHealthSummary | null" }`. The summary is scoped
to the authenticated user and the most recent summary date. A new user with no
health history receives `null`.

### `GET /users/me`

Response: `{ "user": "ApiUser" }`.

### `PATCH /users/me`

Body: any subset of `name`, `email`, `role`, `avatarUrl`, `gender`,
`dateOfBirth`, `heightCm`, `weightKg`, and `journeyStartDate`.

Response: `{ "user": "ApiUser" }`.

### `GET /onboarding/conditions`

Response: `{ "conditions": "HealthCondition[]" }`.

### `PUT /users/me/conditions`

Body: `{ "conditionIds": ["string", "..."], "primaryConditionId": "string" }`.

`primaryConditionId` must be one of the selected conditions and is the only
condition used when assigning the user to a squad. Response:
`{ "conditions": "HealthCondition[]" }`.

### `GET /onboarding/assessment`

Response: `{ "assessment": "WellnessAssessment | null" }`.

### `PUT /onboarding/assessment`

Body: `{ "status"?: "DRAFT" | "COMPLETED", "responses": object }`.

Response: `{ "assessment": "WellnessAssessment" }`.

### `PUT /onboarding/habits`

Body: `{ "habits": [{ "type": "SMOKING | ALCOHOL | DRUG_USE", "frequency": "NEVER | OCCASIONALLY | REGULARLY" }] }`.

Response: `{ "habits": "LifestyleHabit[]" }`.

### `GET /onboarding/habits`

Response: `{ "habits": "LifestyleHabit[]" }`.

### `POST /onboarding/assignment`

Body: `{}`. The user's saved primary condition is always used.

Response: `{ "status": "ASSIGNED", "conditionId": "string", "squad": "Squad" }`.
If no compatible squad has an opening, the API creates a new eight-member squad
with the user as its first member and starts a new cycle on day 1.

## Squad and recovery

### `GET /squads/me`

Response: `{ "squad": { "id", "name", "maxMembers", "members": "SquadMember[]" } }`.

### `GET /squads/:id`

Response: same squad shape as `GET /squads/me`. The requested squad must be
the caller's active squad.

### `GET /squads/me/members/:id`

Response: `{ "member": "SquadMember" }`.

### `GET /squads/me/cycle`

Response:

```json
{
  "cycle": {
    "id": "string",
    "squadId": "string",
    "cycleDays": "number",
    "cycleDay": "number",
    "startDate": "ISO date",
    "endDate": "ISO date",
    "state": "ACTIVE | CRYSTALLIZED",
    "onggiState": "OnggiState | null"
  }
}
```

`OnggiState` contains the five metric percentages and derived
`resonanceScore`.

### `GET /squads/me/health`

Response:

```json
{
  "health": {
    "activitiesCompleted": "number",
    "activitiesGoal": "number",
    "collectivePoints": "number",
    "pointsToday": "number",
    "activeMembers": "number",
    "maxMembers": "number"
  }
}
```

### `GET /squads/me/insights`

Response:

```json
{
  "insights": {
    "synchronizationPercent": "number",
    "currentStreakDays": "number",
    "bestStreakDays": "number",
    "engagementLast7Days": "number",
    "resonanceGainToday": "number",
    "rank": "number",
    "totalSquads": "number",
    "stabilityPercent": "number"
  }
}
```

### `GET /squads/me/contributions`

Response: `{ "members": "SquadMemberContribution[]" }` with weekly progress and
completed activity counts per member.

### `GET /squads/me/matchup`

Response:

```json
{
  "matchup": {
    "yourSquad": { "squad": "Squad", "cycle": "RecoveryCycle | null" },
    "opponentSquad": { "squad": "Squad | null", "cycle": "RecoveryCycle | null" },
    "health": "SquadHealth",
    "insights": "SquadInsights"
  }
}
```

### `GET /squads/me/crystallization`

Response:

```json
{
  "crystallization": {
    "cycle": "RecoveryCycle",
    "daysRemaining": "number",
    "contributions": "TimeCapsuleContribution[]",
    "crystallizedOnggis": "Onggi[]"
  }
}
```

### `GET /squads/me/onggis`

Response: `{ "onggis": "Onggi[] with finalResonanceScore and timeCapsuleContributionCount" }`.

There is intentionally no Onggi delete endpoint.

### `GET /squads/me/challenges`

Response: `{ "challenges": "SquadChallenge[] with joined boolean" }`.

### `POST /squads/me/challenges/:id/join`

Body: none. The path `id` is validated.

Response: `{ "joined": true, "challengeId": "string" }`.

## Activities and impact

### `GET /activities`

Optional query: `category` (`PHYSICAL`, `COGNITIVE`, `EMOTIONAL`, `SOCIAL`) and
`scope` (`INDIVIDUAL`, `SHARED_SOCIAL`).

Response: `{ "activities": "Activity[] with currentClaim and active freeze for the caller" }`.

### `POST /activities/:id/claim`

Body: none. Claims are associated with the caller and active cycle. An active
freeze or a same-day claim returns `409`.

Response: `{ "claim": "ActivityClaim" }`.

### `POST /activity-claims/:id/complete`

Body: none. The claim must belong to the caller and caller's active squad.
Completion updates the claim, Onggi state, and append-only impact events in one
transaction.

Response: `{ "claim": "ActivityClaim", "onggiState": "OnggiState" }`.

### `POST /activity-claims/:id/abandon`

Body: none. Creates a server-side freeze using the configured activity-freeze
duration.

Response: `{ "abandonedClaim": "ActivityClaim", "freeze": "ActivityFreeze" }`.

### `GET /squads/me/impact-feed`

Optional query: `limit` (1–100, default 20) and `offset` (default 0).

Response: `{ "events": "ImpactEvent[]", "pagination": "ApiPagination" }`.
Impact event messages are serialized from the actor and activity display names;
the metric change is supplied separately by `metric` and `delta`.

## Healing Chain and sparks

### `GET /healing-chain`

Response: `{ "links": "MentorshipLink[] with mentor, mentee, condition, and upcomingSession" }`.

### `GET /healing-chain/sparks`

Optional query: `limit` and `offset`.

Response: `{ "sparks": "Spark[]", "receivedPoints": number, "pagination": "ApiPagination" }`.

### `POST /healing-chain/sparks`

Body: `{ "recipientId": "string", "kind": "ENCOURAGEMENT | VOICE_SUPPORT | GUIDANCE", "mentorshipLinkId"?: "string" }`.

The server reads the configured point value and verifies that the recipient is
the caller's connected mentor or mentee.

Response: `{ "spark": "Spark" }`.

### `GET /healing-chain/messages`

Query: `{ "mentorshipLinkId": "string", "limit"?: number, "offset"?: number }`.
The link must include the caller.

Response: `{ "messages": "ChainMessage[]", "pagination": "ApiPagination" }`.

### `POST /healing-chain/messages`

Body: `{ "mentorshipLinkId": "string", "ciphertext": "string" }`.

Response: `{ "message": "ChainMessage" }`.

## Journal

Journal reflection reads and writes always include `userId` in the database
predicate. No endpoint accepts another user's reflection ID.

### `GET /journal/reflections`

Optional query: `limit` and `offset`.

Response: `{ "reflections": "Reflection[] with aiFeedback", "pagination": "ApiPagination" }`.

### `POST /journal/reflections`

Body:

```json
{
  "bodyText": "string",
  "moodTags": "MoodTag[]",
  "emotionalTags": "ReflectionEmotionalTag[]",
  "isPrivate": true,
  "shareAsStory": false
}
```

Saves the reflection first, then requests AI feedback server-side. Crisis
language is checked locally before any Gemini call. If the AI call fails, the
reflection is still persisted.

Response:

```json
{
  "reflection": "Reflection with aiFeedback",
  "aiFeedback": "AiFeedback | null",
  "aiFeedbackStatus": "ready | crisis | unavailable | failed",
  "peerStories": "ApiPeerStory[]"
}
```

### `GET /journal/journey`

Response: `{ "stages": "ApiJourneyStage[]" }` — six milestone stages for the
authenticated user.

### `GET /journal/about`

Response: `{ "banner": "string", "principles": [{ "title", "description" }] }`.

### `POST /journal/peer-stories/match`

Body: `{ "emotionalTags": "ReflectionEmotionalTag[]" }`.

Response: `{ "stories": "ApiPeerStory[]" }` — anonymised published stories
matched by emotional tag overlap. No author fields or precise dates.

### `GET /journal/reflections/:id`

Response: `{ "reflection": "Reflection with aiFeedback" }`.

### `PATCH /journal/reflections/:id`

Body: any subset of the reflection creation body.

Response: `{ "reflection": "Reflection" }`.

### `POST /journal/reflections/:id/ai-feedback`

Body: none. This endpoint is rate limited. Google Gemini is called server-side
only via `GEMINI_API_KEY`; the API key is never accepted from or sent to the
client. Crisis detection runs before any model call.

Response:

```json
{
  "feedback": "AiFeedback",
  "aiFeedbackStatus": "ready | crisis | unavailable | failed"
}
```

If feedback cannot be generated, the API may return `502` or `503` with
`aiFeedback: null` while the reflection remains saved.

### `POST /journal/stories`

Body: `{ "reflectionId": "string" }`. The reflection must belong to the caller.

Response: `{ "story": "SharedStory" }`.

### `GET /journal/stories`

Optional query: `limit` and `offset`.

Response: `{ "stories": "published anonymised stories without author fields", "pagination": "ApiPagination" }`.

Optional query `emotionalTags` (comma-separated) returns tag-matched stories
without pagination metadata.

## AI configuration

Journal feedback uses a provider interface in `apps/api/src/ai/`. The active
provider is selected with `AI_PROVIDER` (default `gemini`).

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key (server-side only) |
| `ANTHROPIC_API_KEY` | Anthropic API key (server-side only; used when `AI_PROVIDER=anthropic`) |
| `AI_PROVIDER` | Provider id: `gemini` (default) or `anthropic` |
| `AI_MODEL` | Model id (default `gemini-flash-latest` for Gemini; `claude-haiku-4-5` for Anthropic) |
| `AI_REQUEST_TIMEOUT_MS` | Per-request timeout in ms (default `30000`) |
| `AI_MAX_RETRIES` | Retry count with exponential backoff and jitter (default `4`) |
| `AI_RATE_LIMIT_MAX` | Max AI calls per window per IP (default `10`) |
| `ENABLE_DEV_ROUTES` | Expose `/dev/*` when `true` |

### `POST /assistant/chat`

Authenticated. Rate-limited with the same `aiLimiter` as journal AI. Stateless:
send the full conversation history on each request. Nothing is persisted.

Body:

```json
{
  "messages": [
    { "role": "user", "content": "How do squads work?" },
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "..." }
  ]
}
```

The final message must be from the user. Up to 40 messages, 20,000 characters each.

Response:

```json
{
  "status": "ready | crisis | unavailable | failed",
  "message": { "role": "assistant", "content": "..." } | null,
  "model": "string | null",
  "errorMessage": "optional when message is null"
}
```

Crisis language in the latest user message returns `status: "crisis"` with crisis
support resources (same detector as the Healing Journal).

### `POST /dev/ai-test`

Available when `NODE_ENV !== "production"` or `ENABLE_DEV_ROUTES=true`.
Does not require authentication. Accepts the same reflection fields as journal
creation and returns the raw AI or crisis response without persisting data.

Body:

```json
{
  "bodyText": "string",
  "moodTags": "MoodTag[]",
  "emotionalTags": "ReflectionEmotionalTag[]"
}
```

Response:

```json
{
  "status": "ready | crisis | unavailable | failed",
  "model": "string | null",
  "responseText": "string"
}
```

## Community

### `GET /community`

Optional query: `conditionId`. Only communities for one of the caller's
conditions are returned.

Response: `{ "communities": "Community[]" }`.

### `GET /community/:id`

Response: `{ "community": "Community" }`. The caller must have the community's
condition.

### `GET /community/:id/posts`

Optional query: `limit` and `offset`.

Response: `{ "posts": "Post[] with author, comments, and reaction count", "pagination": "ApiPagination" }`.

### `POST /community/:id/posts`

Body: `{ "bodyText": "string" }`.

Response: `{ "post": "Post" }`.

### `POST /community/posts/:id/comments`

Body: `{ "bodyText": "string" }`.

Response: `{ "comment": "Comment" }`.

### `POST /community/posts/:id/reactions`

Body: `{ "type": "SUPPORT | LOVE | CELEBRATE | INSIGHTFUL" }`.

Response: `{ "reaction": "Reaction" }`.

### `GET /community/:id/events`

Optional query: `limit` and `offset`.

Response: `{ "events": "Event[] with host", "pagination": "ApiPagination" }`.

### `POST /community/:id/events`

Body: `{ "title": "string", "description": "string", "startsAt": "ISO date", "mode": "ONLINE | OFFLINE" }`.

Response: `{ "event": "Event" }`.

### `POST /community/events/:id/attend`

Body: none. The caller must belong to the event's condition community.

Response: `{ "attending": true, "eventId": "string" }`.

## Health

### `GET /health`

This is the only unauthenticated endpoint.

Response: `{ "service": "api", "status": "ok" }`.
