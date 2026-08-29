# ZeroOne — Product Mechanics Brief

Source: e-ICON World Contest project proposal, pages 7–20. This document describes
*how the system behaves*. It is the authority on rules, thresholds, and terminology.
The Figma file is the authority on layout. Where they conflict, ask.

---

## 1. Recovery Cycle and Onggi Guardian

### The Onggi

A shared vessel owned by a squad, not by an individual. Visually a dark clay form
threaded with golden veins, inspired by Korean Onggi pottery. It responds to squad
activity: active squads make it glow and appear to breathe; falling engagement dims
it. Dimming is passive — it must never read as punishment or blame directed at any
member.

### Squad composition

- Exactly 8 members.
- Each member has a **different** condition. Enforce this as a hard constraint on
  squad assignment.
- Condition spread across a squad: Diabetes, Cancer, Hypertension, Depression,
  Anxiety, Arthritis, Obesity, Dementia. (Note: the Figma seed shows Heart Disease
  in place of Anxiety. Either is valid — one condition per member is the rule.)
- Cross-condition composition is deliberate, not incidental. Do not build any
  feature that groups a squad by shared condition.

### Onggi dimensions

Five metrics, each 0–100, held at the squad level:

1. Breathing Exercise
2. Breathing Veins
3. Warmth
4. Circulation
5. Harmony

They rise and fall together as the squad acts. None belong to an individual member.
A derived **Resonance Score** aggregates them.

### Activity mechanics

- The AI surfaces **four Double Points activities** per day — time-limited and
  condition-specific.
- Below those, a grid of **twelve activities** adapted to the user's condition,
  energy, and needs that day.
- Users press **Claim** to accept an activity. Claiming is a deliberate act of
  acceptance, not passive logging. The UI should treat it as a commitment, not a
  checkbox.
- **6-Hour Freeze**: abandoning or skipping a claimed activity locks that activity
  for six hours with a visible countdown. Deliberately calibrated — long enough to
  carry weight, short enough that the user can restart the same day.

### Which activities move which dimension

The proposal gives these examples from the live feed:

| Action | Effect |
|---|---|
| Member completes a breathing exercise | Breathing Veins rise |
| Member joins a cooking challenge | Warmth climbs |
| Squad completes a sunlight session together | Harmony jumps |

The causal link must always be visible in the UI: a user's action changes something
the entire squad can see. Individual actions move Breathing Veins and Circulation;
shared or social actions move Warmth and Harmony.

### Social Brain Health games

Word Puzzles, Memory Sequences, Reaction Time, Object Tracking. Played live with the
squad. Purpose is cognitive decline associated with diabetes, depression, and
dementia — but the framing is entertainment, never therapy.

### Emotional Ritual System

Runs daily. One reflective question grounded in cognitive reframing, e.g. "What made
today feel lighter?" Beside it, an anonymous message from a squad member — no name,
no attribution.

### Global Resonance

Live world map (teal). Shows count of active Onggi Guardians across continents,
stories shared today, a Healing Impact level, and a weekly Vibration Trend chart of
aggregate activity.

### Squad Details

Both squads visible — the user's and the opponent's. Member Contribution table
showing every member's status. The competition is squad-level, never individual: a
user is accountable to seven other people, and the UI should reinforce that framing
rather than surfacing individual rankings within a squad.

### Crystallization

- Every **28 days** the squad's Onggi crystallizes, permanently locking that cycle's
  state.
- Themes seen so far: New Beginning, Growth, Strength, Wisdom.
- A crystallized Onggi preserves the photos, voice recordings, songs, and memories
  contributed during the cycle (the Time Capsule).
- **A crystallized Onggi cannot be deleted.** No delete endpoint, no delete UI. It
  can only be collected.
- Crystallized is the highest status in the system. Treat it as an achievement
  artifact, not a trophy or a score.

---

## 2. Healing Chain

### Structure

Every user occupies **both** positions simultaneously — mentor to someone earlier,
mentee to someone further along. There is no user who only receives or only gives.
The system must never place a user in one role alone once matched.

Banner text: "You Receive Hope. You Give Hope. Together, We Heal."
Center badge when matched: "You Are Connected."

### Lantern Sparks

| Support action | Sparks |
|---|---|
| Encouragement | +10 |
| Voice Support | +20 |
| Guidance | +20 |

The differential is intentional — deeper acts cost the giver more, and the system
honours that. Do not flatten these values.

At **1,000 Sparks** the Lantern ignites and the user becomes a full Mentor,
beginning the cycle for someone new.

### Healing Impact panel

Tracks: people supported, encouragements sent, voice sessions held, guidance shared.

### The Lantern artifact

Produced at cycle completion. Records Emotional Growth, Support Given, Consistency,
Compassion Acts.

### Journey Timeline

Six fixed stages: Before Diagnosis → Diagnosis → Struggles → Turning Point →
Improvement → Maintaining. Navigable, not just a static graphic.

**Compare Journey** overlays the user's recovery curve with their mentor's and
mentee's on one chart. The point is to show the user that the person guiding them
once stood exactly where they stand now.

### Mentor / Mentee profiles

Bio, specialization, real-time availability, preferred communication style, upcoming
confirmed session. Mentors are volunteers — never assigned, never paid. Do not build
any payment or assignment-by-admin flow.

**Chain Chat**: encrypted real-time messaging between mentor and mentee.

---

## 3. Healing Journal

### Privacy model — structural, not a setting

Default is **Private — Only You**. Nothing a user writes is visible to their squad,
their mentor, or the platform unless they explicitly choose otherwise. Enforce this
at the database query level, not just in the UI.

Banner: "You Are Not The Only One Carrying This Pain."

### Entry composition

**Emotional tags** (eight): Missed Event, Pain Flare, Social Isolation, Identity
Loss, Fatigue, Relationship Struggle, Abandoned Hobbies, Others.

**Moods** (seven): Sad, Anxious, Frustrated, Lonely, Exhausted, Hopeful, Other.

Hopeful is included deliberately — the Journal holds small victories, not only
grief. Do not present the mood list as a negative-only scale.

### Peer stories

Anonymous stories appear **below the writing space before the user saves**, not only
after. Matched by the **emotional content** of the entry, not by condition. Three
surface alongside a saved reflection.

Stories carry no names, no advice, no solutions — recognition only. The AI does not
write these; it selects from stories real users voluntarily shared.

### AI Feedback

Three psychological responses calibrated to what was actually written.

The required voice, derived from the proposal's own example:

> "Feeling lonely and misunderstood is one of the hardest parts of diabetes. But one
> strong thing about you is your honesty — you expressed your feelings instead of
> hiding them. That takes courage. Remember — your struggles and feelings truly
> matter."

Structure of a response:
1. Name the specific emotional weight the person described.
2. Identify one genuine strength in what they wrote.
3. Address the belief underneath it directly (e.g. that expressing pain is weakness).
4. Affirm that their struggle is real.

It must read as though it could only have been written for this entry, by this
person, on this day. Never a motivational quote. Never generic encouragement. Never
diagnostic or prescriptive.

### About page — four principles

Private and Secure · Emotional Relief · Track Progress · Build Self-Awareness.

---

## 4. Supporting features

Lower priority than the three above. Build only when explicitly scoped.

- **AI Wellness Assistant** — conversational AI accessible from every screen. A
  persistent layer, not a separate destination. Voice input and file attachment.
- **Community** — condition-specific channels, peer post feed, verified
  professional-led events, live sessions (Q&A, Guided Yoga, Caregiver Training,
  Virtual Support Groups).
- **Explore Map** — nearby healing spaces, real-time air quality, Smart Check-In for
  Pulse Points, peer-curated Community Suggestions.
- **Learn & News** — geo-tagged health alerts, structured lessons, 7-day learning
  streak, Global Health Situation Map, quizzes linked from articles.
- **Diet Advice** — five-macro tracking, AI meal plan, barcode food scanner,
  dietitian consultation, meal detail with Best Time To Eat and alternatives.
- **Rewards** — Pulse Points for every healthy action, level titles, health-aligned
  redemptions (telehealth consultation, nutrition store credit).

---

## 5. Navigation

Dashboard is the central hub. Branches:

- **Recovery** — Onggi Guardian, Global Resonance, Activities, AI Adaptive
  Activities, Social Brain Health, Time Capsule
- **Healing Chain** — Mentor Profile, Mentee Profile, Chain Chat
- **Healing Journal** — Write Reflection, AI Feedback
- **Community** — My Community, Community Events
- **Learn & News** — Health News, Diet Advice, Learning Hub
- **Rewards** — Pulse Points, Today's Activities (Steps, Water, Active Minutes)
- **AI Assistant** — available from every screen

---

## 6. Configuration values

Every number below is a config constant. None should appear as a literal in
application code.

| Constant | Value |
|---|---|
| Squad size | 8 |
| Cycle length | 28 days |
| Activity freeze duration | 6 hours |
| Daily double-points activities | 4 |
| Daily activity grid size | 12 |
| Spark: encouragement | 10 |
| Spark: voice support | 20 |
| Spark: guidance | 20 |
| Lantern ignition threshold | 1,000 sparks |
| Onggi dimensions | 5 |
| Peer stories shown per reflection | 3 |
| AI feedback responses per reflection | 3 |
