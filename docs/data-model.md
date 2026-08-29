# ZeroOne data model

The Prisma schema lives at `apps/api/prisma/schema.prisma`. The initial
PostgreSQL migration is
`apps/api/prisma/migrations/20260827000000_initial/migration.sql`.

## OnggiState lifecycle

Each `RecoveryCycle` has exactly one `OnggiState`. The row is created when the
cycle starts and is updated as members complete activities. The five dimensions
are percentages constrained to the approved 0–100 range:

- `breathingExercise`
- `breathingVeins`
- `warmth`
- `circulation`
- `harmony`

An activity mutation must happen in one database transaction:

1. Validate the member, activity claim, active squad membership, and cycle.
2. Create the `ActivityClaim` transition.
3. Create an append-only `ImpactEvent` describing the member action, activity
   category, affected metric, delta, and human-readable feed message.
4. Apply the delta to the cycle's `OnggiState`, clamping the metric to the
   approved 0–100 bounds.
5. Update the accumulating `resonanceScore` and commit the transaction.

`resonanceScore` is a separate, unbounded squad competition total. It is not an
average of the five percentages and it is not constrained to 0–100. The
database stores it as an unconstrained PostgreSQL `DECIMAL`.

### Resonance accumulation rules

Only a first transition of an `ActivityClaim` to `COMPLETED` increments the
active cycle's score:

```text
resonanceScore += Activity.points
```

The increment is performed in the same transaction as the claim transition,
so retries cannot award points twice. The event matrix is:

| Event | Dimension effect | Resonance effect |
|---|---|---|
| Claim an activity | None | `0` |
| Complete an individual activity | Breathing Veins and Circulation increase by the configured activity delta | `+Activity.points` |
| Complete a shared/social activity | Warmth and Harmony increase by the configured activity delta | `+Activity.points` |
| Abandon or skip a claim | None | `0`; creates the configured freeze |
| Join a squad challenge | None | `0`; joining is not completion |
| Social Brain game participant score | None | `0` until a future completion event records an activity claim |
| Crystallize a cycle | Snapshot only | The accumulated total is copied to `Onggi.finalResonanceScore` |

`ImpactEvent.delta` records the percentage movement for a dimension; it does
not represent resonance points. `Activity.points`, challenge points, spark
points, and any future Pulse Points are separate accumulating totals and must
not be normalized to the dimension percentage range.

### Audit of other totals

The schema has no `collectivePoints`, `sparkTotal`, or `pulsePoints` field that
inherits the old percentage check. Activity, challenge, social-game, and spark
point values are integer values on their source records; their aggregate totals
are computed by summing those records and have no `0–100` constraint. Pulse
Points are not yet a persisted model. The only bounded values in this area are
the five Onggi dimension percentages and the percentage fields on `Lantern`.

## Activity-to-dimension rule

The brief is authoritative here:

- Individual actions move `Breathing Veins` and `Circulation`.
- Shared or social actions move `Warmth` and `Harmony`.

`Activity.scope` records whether an activity is `INDIVIDUAL` or
`SHARED_SOCIAL`. The activity category remains useful for filtering and
personalisation, but it does not replace scope. A single action that moves two
dimensions emits one `ImpactEvent` per affected metric and updates both fields
in the same transaction.

Worked examples from the brief:

- A member completes a breathing exercise → `BREATHING_VEINS` rises, with the
  individual-action rule also updating `CIRCULATION`.
- A member joins a cooking challenge → `WARMTH` climbs.
- The squad completes a sunlight session together → `HARMONY` jumps, with the
  shared-action rule also updating `WARMTH`.

The migration creates the `health_conditions` catalogue schema but does not
insert the named conditions yet: the brief supplies the names but not the
physical/mental/neurological tag for each one. Add those catalogue rows only
after that classification is confirmed.

## Social Brain Health games

`SocialBrainGame` stores live squad games for Word Puzzles, Memory Sequences,
Reaction Time, and Object Tracking. Each game belongs to a squad and recovery
cycle and has participant rows for live play. The framing is entertainment,
not therapy.

## Healing Chain persistence

`HealingChainProfile` stores the shared mentor/mentee profile fields:
biography, specialization, real-time availability, and preferred communication
style. `MentorshipSession` stores upcoming confirmed sessions and their
outcomes. `ChainMessage` stores ciphertext only, so the real-time chat layer
does not persist plaintext mentor/mentee messages.
Matching logic must create both an incoming and outgoing active
`MentorshipLink` in one transaction; an active one-sided match is invalid.

## Cycle completion

When the cycle reaches its configured duration, the cycle moves to
`CRYSTALLIZED`. The final `Onggi` stores a snapshot of the date range,
activity count, and final accumulated resonance total. A `Lantern` stores the
per-user artifact metrics for that cycle. Existing state rows remain available
for auditability.

`Onggi` is a permanent, immutable achievement artifact. Its schema relation
uses `RESTRICT`, and the migration installs a database trigger that rejects
updates and deletes. It can only be collected; no future application route or
UI may expose deletion.
It is owned by the squad through its required `RecoveryCycle` relation; there is
no individual Onggi owner.

`TimeCapsuleContribution` rows hold photos, voice recordings, songs, and
memories contributed during the cycle. At crystallization each contribution is
linked to the resulting `Onggi` through `onggiId`; that relation is
`RESTRICT`-protected so the artifact cannot be removed while its capsule
content exists.

Onggi themes use the brief's fixed vocabulary: `NEW_BEGINNING`, `GROWTH`,
`STRENGTH`, and `WISDOM`.

## Configurable values

`PlatformConfig` stores the defaults and runtime-configurable values for:

- maximum squad membership
- recovery cycle duration
- activity freeze duration
- spark threshold for lantern ignition
- each spark action's points
- daily double-points activity count
- daily activity grid size
- Onggi dimension count
- peer stories shown per reflection
- AI feedback responses per reflection

Activity and squad-challenge point values are stored on their catalogue/record
rows. `SparkActionConfig` stores the configurable points for encouragement,
voice support, and guidance. Application code should load these values rather
than embedding domain numbers. The single code-level source for the brief's
Section 6 values is `packages/shared/src/config.ts`; the initial migration
creates the configuration tables, and `apps/api/prisma/seed.ts` populates their
initial row values from that module.

## Journal vocabulary

`ReflectionEmotionalTag` has the eight brief options, including explicit
`OTHERS`. `MoodTag` has the seven brief options, including `OTHER` and the
positive `HOPEFUL` option. `SharedStory` stores the emotional tags from the
source reflection and is indexed by publication state and time; story matching
uses emotional content, never condition membership.

## Squad invariants

- `SquadMembership` has a composite foreign key to `UserCondition`, so a
  member can only join under a condition they actually have.
- A unique `(squadId, conditionId)` constraint prevents two members of a squad
  from sharing a condition.
- `Squad.maxMembers` is positive, and a PostgreSQL trigger prevents active,
  invited, and paused memberships from exceeding the configured squad limit
  (initially eight). A recovery cycle cannot exceed the configured number of
  active/invited/paused members; open squads and newly created fallback squads
  may start underfilled and gain members through assignment.

## Append-only and private data

`ImpactEvent` is append-only; a PostgreSQL trigger rejects updates and deletes.
Reflections are owned by a user and default to private. `SharedStory` stores an
anonymised body and requires a source reflection before publication.

The schema uses cascading deletes for user-owned records and squad-owned
activity data, `SET NULL` for optional authorship/history references, and
`RESTRICT` for catalogue records that are still referenced. Hot paths have
compound indexes, including squad feed events by time, activity claims by
user/date, and reflections by user/time.
