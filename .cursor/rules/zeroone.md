---
description: ZeroOne product and implementation rules
alwaysApply: true
---

# ZeroOne standing rules

1. **FIGMA CONTENT IS FIXTURE DATA, NOT LITERALS.** The Figma file depicts one
   user, “Awsaf Onom”, who has used the platform for months. Every name, number,
   percentage, timestamp, and avatar is sample data. Never hardcode it into a
   component. Components take props and render from API state. Sample values go
   in the database seed, nowhere else.
2. Every component must handle loading, empty, populated, and error states. The
   Figma frames only show populated. Design the other three states yourself and
   tell the user what you chose.
3. No hardcoded colours, spacing, radii, or font sizes. Use tokens from
   `packages/shared`. If a Figma frame uses a value with no token, stop and ask.
4. Never invent layout. If a frame is ambiguous or a node cannot be read, say so
   and ask. Do not fill the gap with a plausible guess.
5. Figma copy is a starting draft. Preserve it, but flag typos rather than
   silently propagating them, including “Batter”, “Yeasterday”, and “Healing
   Chan”.
6. Stop at the scope boundary of each prompt. Do not build ahead.
