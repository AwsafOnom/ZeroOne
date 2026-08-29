# Proposed design tokens from ZeroOne Figma

Source: [ZeroOne-Build](https://www.figma.com/design/6cA9X3JkcLXULM6IL6OBA9), file key `6cA9X3JkcLXULM6IL6OBA9`.

This is a proposed implementation vocabulary, not a claim that these tokens exist in Figma. The file has no variable collections, published components, or published styles. Values below are raw values emitted by the available Figma context exports, with repeated values grouped into likely canonical tokens.

## Coverage note

The raw inventory is exhaustive for the design-context exports available during this audit. Figma MCP access reached the Starter-plan call limit before separate contexts could be retrieved for every top-level screen. Metadata confirms the remaining screens and repeated structures, but metadata does not expose fills, font properties, effects, or border values. Unqueried-screen differences remain flagged in `figma-audit.md`.

## Color tokens

### Raw fills observed

- `#1d8581` — primary green; also emitted as `var(--primary-color,#1d8581)`.
- `#1da19c` — second stop of the primary green gradient.
- `#5f31b4` → `#7140d3` — AI Assistant purple gradient.
- `#00bba7` → `#009689` — teal CTA gradient.
- `#147fc7` — secondary blue button.
- `#6366f1` — alternate doctor CTA/button color.
- `#008f37` — success/online green.
- `#22c55e` — chat online indicator.
- `#ad46ff` — Healing Chain accent card/button.
- `#d9d9d9` — image/avatar placeholder.
- `#d0fae5`, `#fae6d0`, `#d0eafa`, `#e2ebff`, `#d0d3fa`, `#fef3e6` — Healing Chain activity/avatar accent surfaces.
- `#ece6f4` → `#ffffff` — Healing Chain content-panel gradient.
- `#f9f9fd` — application surface/background; also emitted as `var(--surface-bg,#f9f9fd)`.
- `#ffffff` / `white` — white surface and text.
- `#ededed` — light cart/input surface; emitted as `var(--cart-bg-8,#ededed)`.
- `#e6e6f2` — pale card border; emitted as `var(--cart-bg-9,#e6e6f2)`.
- `#e6f4eb` — pale success surface; emitted as `var(--cart-bg-10,#e6f4eb)`.
- `#f9fafb` — pale neutral card surface; emitted as `var(--cart-bg-2,#f9fafb)`.
- `#f1f1f1` — inactive OTP border.
- `#e0e0e0` — light card border.
- `#e4e4e4` — chat/input border.
- `#e5e7eb` — chat/container border.
- `#e7e8eb` — doctor-card neutral border; emitted as `var(--transparent/grey-transparent,#e7e8eb)`.
- `#e0e7ff` — pale blue card border.
- `#d1d5dc` — checkbox border.
- `#e9f7ef` — pale success badge border.
- `#f4fbf7` — pale success badge surface.
- `#f5f6f8` — light doctor badge surface/border.
- `#f5f3ff` — second stop of a Healing Chain pale gradient.
- `#f3f4f6` — chat bubble and AI surface border/background.
- `#f3e8ff` — AI text-input border.
- `#faf5ff`, `#fdf2f8`, `#fff7ed` — AI Assistant panel gradient stops.
- `#c8c8c8` — disabled/default border; emitted as `var(--disable,#c8c8c8)`.
- `#101828` — dark heading text.
- `#1e1e1e` — form text.
- `#1e2939` — AI Assistant dark text.
- `#2f2f2f` — primary body text; emitted as `var(--primary-text,#2f2f2f)`.
- `#4a5565` — secondary role-selection text.
- `#4f4f4f` — search placeholder; emitted as `var(--grey-normal,#4f4f4f)` in one context.
- `#060606` — chat title/message text.
- `#717171` — secondary text; emitted as `var(--secondary-text,#717171)`.
- `#808080` — form placeholder grey.
- `#828282` — OTP helper text.
- `#9810fa` — AI response-time accent.
- `#e1f9ff` — light blue hover/accent style.
- `#f48201` — orange accent.
- `#dc7501` — orange hover/accent.
- `#6a7282` — AI Assistant supporting text.
- `#6b7280` — chat timestamp text.
- `#9ca3af` — chat composer placeholder.
- `black` — raw black text and card border in a few frames.
- `transparent` — transparent borders/containers in generated context.
- `rgba(47,47,47,0.50)` — translucent media/action surface.
- `rgba(0,0,0,0.03)`, `rgba(0,0,0,0.05)`, `rgba(0,0,0,0.06)`, `rgba(0,0,0,0.07)`, `rgba(0,0,0,0.10)`, `rgba(0,0,0,0.12)`, `rgba(0,0,0,0.13)`, `rgba(0,0,0,0.25)`, `rgba(0,0,0,0.78)` — shadow, border, and text alpha values.
- `rgba(10,10,10,0.5)` — AI composer placeholder.
- `rgba(16,24,40,0.05)` — form input shadow.
- `rgba(29,133,129,0.10)`, `rgba(29,133,129,0.20)` — primary-green tinted surfaces/progress tracks.
- `rgba(29,161,156,0.20)`, `rgba(29,133,129,0.20)` — AI/composer gradient tint.
- `rgba(255,255,255,0.10)`, `rgba(255,255,255,0.20)`, `rgba(255,255,255,0.30)`, `rgba(255,255,255,0.80)` — translucent white overlays/text.

### Proposed canonical color names

- `color.primary` = `#1d8581`
- `color.primary-strong` = `#1da19c`
- `color.primary-gradient` = `linear-gradient(90deg, #1d8581, #1da19c)`
- `color.ai-gradient` = `linear-gradient(90deg, #5f31b4, #7140d3)`
- `color.teal-gradient` = `linear-gradient(90deg, #00bba7, #009689)`
- `color.secondary` = `#147fc7`
- `color.doctor-cta` = `#6366f1`
- `color.success` = `#008f37`
- `color.success-indicator` = `#22c55e`
- `color.orange` = `#f48201`
- `color.orange-hover` = `#dc7501`
- `surface.blue-light` = `#e1f9ff`
- `surface.app` = `#f9f9fd`
- `surface.default` = `#ffffff`
- `surface.muted` = `#f9fafb`
- `surface.subtle` = `#ededed`
- `surface.success` = `#e6f4eb`
- `text.primary` = `#2f2f2f`
- `text.heading` = `#101828`
- `text.secondary` = `#717171`
- `text.muted` = `#808080`
- `border.default` = `#c8c8c8`
- `border.subtle` = `#e6e6f2`
- `border.chat` = `#e4e4e4`

## Typography tokens

### Raw families, weights, and sizes observed

All listed Poppins styles use line-height `1.5` and letter-spacing `0` unless noted otherwise.

- Poppins Regular, weight `400`: `10.252px`, `12px`, `13.181px`, `13.568px`, `16px`, `16.107px`, `18px`, `18.792px`, `20px`, `21.476px`, `21.558px`, `24px`, `32px`.
- Poppins Medium, weight `500`: `7.932px`, `11.898px`, `14px`, `16px`, `16.569px`, `18px`, `20px`, `21.476px`, `24px`.
- Poppins SemiBold, weight `600`: `12px`, `14px`, `14.646px`, `16px`, `17.575px`, `18px`, `19.883px`, `20px`, `23.26px`, `24px`, `29.73px`, `32px`, `36px`, `40px`, `48px`.
- Poppins Bold, weight `700`: `26.845px`, `43.975px`, `48px`, `64.428px`.
- Inter Regular, weight `400`: `17.841px`, `21.558px`.
- Inter Semi Bold, weight `600`: `14.342px`, `21.558px`.
- DM Sans Medium, weight `500`: `14px`, line-height `16px`.
- DM Sans Bold, weight `700`: `33.203px`; OTP cells also set font variation `opsz: 14`.

### Exact line-height variants observed

- Standard Poppins line-height: `1.5`.
- Scaled/generated exact line-heights: `17.846px`, `21.476px`, `22.309px`, `23.788px`, `26.845px`, `30.536px`, `32.214px`, `32.336px`, `34.899px`, `37.583px`, `42.952px`, `64.428px`.
- `normal` is used in chat composer/message text and a few button labels.

### Proposed semantic typography names

- `type.body-xs` = Poppins Regular `12px`
- `type.body-sm` = Poppins Regular `14px`
- `type.body` = Poppins Regular `16px`
- `type.body-lg` = Poppins Regular `18px`
- `type.body-xl` = Poppins Regular `20px`
- `type.label` = Poppins Medium `14px`
- `type.label-lg` = Poppins Medium `20px`
- `type.button` = Poppins SemiBold `16px`
- `type.button-lg` = Poppins SemiBold `20px`
- `type.heading-sm` = Poppins SemiBold `24px`
- `type.heading-md` = Poppins SemiBold `32px`
- `type.heading-lg` = Poppins SemiBold `36px`
- `type.heading-xl` = Poppins SemiBold `40px`
- `type.display` = Poppins SemiBold `48px`
- `type.ai-hero` = Poppins Bold `64px`
- `type.otp` = DM Sans Bold `33.203px`

Keep the fractional sizes as explicit aliases where pixel fidelity matters. They should not automatically replace the semantic sizes above until responsive intent is confirmed.

## Radius tokens

### Raw radii observed

- `3.877px`, `4px`, `6.345px`, `6.61px`, `7.323px`, `7.833px`, `7.899px`, `8px`, `8.029px`, `8.317px`, `8.92px`, `9.052px`, `10px`, `11.894px`, `12px`, `13.281px`, `17.841px`, `17.969px`, `20px`, `21.476px`, `21.669px`, `24.765px`, `26.214px`, `26.62px`, `30.956px`, `32px`, `32.214px`, `42.952px`, `53.69px`, `64.5px`, `100px`.
- Extremely large pill values used by Figma for circles/pills: `27898388px`, `36030712px`, `39905736px`, `80464592px`, `14865.859px`.
- Per-corner chat-bubble values include `11.894px`, `13.423px`, `17.841px`, and `42.952px`.

### Proposed canonical radii

- `radius.xs` = `4px`
- `radius.sm` = `8px`
- `radius.md` = `10px`
- `radius.lg` = `20px`
- `radius.xl` = `32px`
- `radius.round` = `9999px`
- `radius.chat-bubble` = `43px` outer corners with `13px`/`18px` leading corner exceptions where the authored shape requires it
- `radius.pill` = `9999px` in implementation; raw Figma pill values include `100px` and much larger generated values

## Spacing tokens

### Recurring raw layout values

- `0px`, `0.8px`, `1px`, `2px`, `4px`, `6px`, `7.099px`, `8px`, `8.873px`, `9px`, `10px`, `10.444px`, `11px`, `12px`, `12.8px`, `13px`, `14px`, `14.198px`, `15.667px`, `16px`, `16.8px`, `18px`, `20px`, `23px`, `24px`, `27px`, `28px`, `30px`, `31px`, `32px`, `36px`, `40px`, `45px`, `47px`, `50px`, `60px`.
- Header/search: `50px` horizontal padding, `30px` vertical padding, `20px` search padding, `10px` search gap.
- Sidebar: `50px` horizontal padding, `40px` outer vertical padding, `30px` shell gap, `234px` separation before logout, `20px` row padding, `10px` row vertical padding, `16px` icon/text gap, `10px` nav-row gap.
- Common card/button gaps: `8px`, `10px`, `12px`, `13px`, `16px`, `20px`, `27px`, `30px`, `36px`, `40px`.
- Activity cards: `20px` card padding, `10px` internal vertical padding, approximately `11px` icon/content gap.
- Doctor cards/buttons: `8.873px`/`4.437px` price-badge padding, `14.198px`/`7.099px` CTA padding, `6.345px` CTA radius.
- OTP layout: `16.601px` cell gap, `16.601px` cell padding, `33.203px` section gap.
- AI Assistant: `21.476px`, `26.845px`, `32.214px`, `37.583px`, `38.657px`, `42.952px`, `53.69px`, and `64.428px` scaled spacing values.

### Fractional/scaled raw values that should remain visible during implementation review

`2.409px`, `2.685px`, `3.3px`, `4.027px`, `4.394px`, `4.437px`, `5.222px`, `5.288px`, `5.369px`, `5.949px`, `6.61px`, `7.099px`, `7.323px`, `7.461px`, `8.873px`, `9.052px`, `10.738px`, `10.444px`, `11.796px`, `11.894px`, `13.107px`, `13.423px`, `14.084px`, `14.198px`, `15.667px`, `15.728px`, `15.935px`, `16.058px`, `16.107px`, `16.569px`, `16.601px`, `16.8px`, `17.039px`, `17.841px`, `18.104px`, `18.792px`, `19.747px`, `19.883px`, `20.716px`, `20.889px`, `21.237px`, `21.476px`, `21.558px`, `23.624px`, `23.786px`, `24.765px`, `26.003px`, `26.111px`, `26.845px`, `27.919px`, `29.621px`, `29.73px`, `32.214px`, `33.203px`, `37.583px`, `38.657px`, `42.952px`, `45px`, `47px`, `53.69px`, `55.507px`, `64.428px`, `71.357px`, `79.461px`, `80.151px`, `85.904px`, `91.609px`, `103.297px`, `121.792px`, `128.856px`, `145.433px`, `155.222px`, `166.439px`, `185.013px`, `190px`, `257.712px`, `275.078px`, `328.617px`, `340px`, `350.178px`, `390.174px`, `418px`, `466.458px`, `577.69px`, `612px`, `721.625px`, `743.792px`, `875.248px`, `908.667px`, `954.484px`, `1053px`, `1346.546px`, `1452.852px`, `1457px`, `1557px`.

These values include component dimensions as well as spacing values because Figma’s generated context expresses layout geometry in the same absolute-value vocabulary. They are not all suitable as global spacing steps.

## Border tokens

### Raw borders observed

- `1px #c8c8c8` — default/disabled border.
- `1px #ededed` — form/input border.
- `1px #1d8581` — OTP/primary border.
- `1px #008f37` — success CTA/tag border.
- `1px #e0e0e0`, `1px #e4e4e4`, `1px #e5e7eb`, `1px #e6e6f2` — neutral/card/chat borders.
- `1.66px #1d8581` and `1.66px #f1f1f1` — OTP cells.
- `1.311px #ffffff` — community media/action control.
- `0.746px #c8c8c8` — community action button.
- `0.987px #c8c8c8` — Healing Chain cards.
- `0.8px #e5e7eb` — selection/filter buttons.
- `0.8px #d1d5dc` — selection/filter checkboxes.
- `0.969px #1d8581` — activity Claim button.
- `0.732px #c8c8c8` — Recovery comparison frame.
- `0.756px rgba(0,0,0,0.13)` — social sign-in buttons.
- `0.803px #e6e6f2` — Recovery card border.
- `0.9px #c8c8c8` — chat composer input.
- `1.074px rgba(255,255,255,0.30)` — AI Assistant hero icon container.
- `1.074px #f3f4f6` — AI Assistant panel.
- `1.238px #f3f4f6` — Healing Chain content panel.
- `1.306px #e7e8eb` — doctor cards.
- `1.238px #f3e8ff` — Healing Chain AI input/card.
- `1.487px #e5e7eb` — chat shell and overlay.
- `2.148px #f3e8ff` — AI Assistant text input.
- `2.973px #ffffff` — chat online indicator outline.
- `1px black` — Healing Chain detail/stat cards.

### Proposed canonical borders

- `border.default` = `1px solid #c8c8c8`
- `border.subtle` = `1px solid #e6e6f2`
- `border.surface` = `1px solid #ededed`
- `border.primary` = `1px solid #1d8581`
- `border.success` = `1px solid #008f37`
- `border.chat` = `1px solid #e4e4e4`
- `border.doctor` = `1px solid #e7e8eb`
- `border.focus-otp` = `1.66px solid #1d8581`

## Shadow/elevation tokens

### Raw effects observed

- `0px 2px 1px rgba(0,0,0,0.10)` — top search bar.
- `5px 5px 5px rgba(0,0,0,0.10)` — login card.
- `0px 1px 2px rgba(16,24,40,0.05)` — form inputs.
- `15.122px 15.122px 37.806px rgba(0,0,0,0.12)` — social sign-in buttons.
- `0px 0px 4px rgba(0,0,0,0.15)` — dashboard summary card.
- `0px 0px 2px rgba(0,0,0,0.06)` — dashboard stat icon holder.
- `0px 6.641px 3.32px rgba(0,0,0,0.03)` and `0px 6.641px 6.641px rgba(0,0,0,0.03)` — OTP cells.
- `0px 2.644px 1.322px rgba(0,0,0,0.07)` — recovery activity cards.
- `0px 6.655px 7.764px rgba(0,0,0,0.05)` — doctor cards.
- `0px 1px 2px rgba(0,0,0,0.13)` — doctor information cards.
- `0px 1px 1.5px rgba(0,0,0,0.10), 0px 1px 1px rgba(0,0,0,0.10)` — Healing Chain mentor-match form.
- `0px 1.306px 0.653px rgba(0,0,0,0.05)` — doctor detail cards.
- `0px 1.306px 1.306px rgba(0,0,0,0.05)` — doctor content card.
- `0px 33.556px 67.113px -16.107px rgba(0,0,0,0.25)` — AI hero.
- `0px 33.556px 67.113px rgba(0,0,0,0.25)` — AI hero icon container.
- `0px 13.423px 10.067px rgba(0,0,0,0.10), 0px 5.369px 4.027px rgba(0,0,0,0.10)` — AI chat bubbles.
- `0px 5.369px 4.027px rgba(0,0,0,0.10), 0px 2.685px 2.685px rgba(0,0,0,0.10)` — AI composer buttons.
- `0px 1.342px 4.027px rgba(0,0,0,0.10), 0px 1.342px 2.685px -1.342px rgba(0,0,0,0.10)` — AI text input.
- `0px 14.867px 22.301px -4.46px #f3f4f6, 0px 5.947px 8.92px -5.947px #f3f4f6` — chat shell.

### Proposed canonical elevation names

- `elevation.search` = `0 2px 1px rgba(0,0,0,.10)`
- `elevation.card` = `0 0 4px rgba(0,0,0,.15)`
- `elevation.input` = `0 1px 2px rgba(16,24,40,.05)`
- `elevation.activity` = `0 2.644px 1.322px rgba(0,0,0,.07)`
- `elevation.doctor` = `0 6.655px 7.764px rgba(0,0,0,.05)`
- `elevation.hero` = `0 33.556px 67.113px -16.107px rgba(0,0,0,.25)`
- `elevation.ai-message` = `0 13.423px 10.067px rgba(0,0,0,.10), 0 5.369px 4.027px rgba(0,0,0,.10)`

## Conflicts and inconsistencies

- Figma’s generated context emits semantic-looking CSS variable names such as `--primary-color`, `--surface-bg`, `--disable`, and `--success`, but the file has no variable collections. Treat the fallback hex values as the actual raw evidence; the variable names are not authoritative tokens.
- Primary green appears consistently as `#1d8581`, but the user-supplied near-duplicate example (`#1A9E7F`/`#199E80`) does not appear in the observed exports. Do not introduce either example value.
- Primary CTAs are not one gradient: the main app uses `#1d8581` → `#1da19c`, the AI Assistant uses `#5f31b4` → `#7140d3`, and some reward/community CTAs use `#00bba7` → `#009689`. Keep these as separate semantic gradients.
- Neutral backgrounds are inconsistent: `#f9f9fd`, `#f9fafb`, `#ededed`, `#f3f4f6`, `#faf5ff`, `#fdf2f8`, and `#fff7ed` all occur. They should not be collapsed without reviewing the visual role of each surface.
- Text neutrals are inconsistent across generations/areas: `#2f2f2f`, `#101828`, `#1e1e1e`, `#060606`, `#4a5565`, `#4f4f4f`, `#717171`, `#808080`, `#828282`, `#6a7282`, `#6b7280`, and `#9ca3af`. The proposed semantic mapping is a normalization, not a claim of one raw color.
- Border widths range from `0.732px` to `2.973px`; many fractional values appear to come from scaled/resized frames. Preserve them in fidelity-sensitive components until responsive intent is confirmed.
- Corner radii range from `4px` to `100px`, plus huge Figma-generated pill values and several asymmetric chat-bubble radii. A single `8px` radius would lose authored distinctions.
- Typography mixes Poppins, Inter, and DM Sans. Poppins is the dominant app family, Inter is used heavily in Chat, and DM Sans is used for OTP digits.
- Typography includes both clean design-scale values and fractional scaled values. Canonical semantic sizes are proposed for implementation, but the fractional aliases should remain available for the AI/Chat/Recovery regions.
- The audit found shadows with materially different intent, from subtle one-pixel separators to large AI hero elevations. They should not be normalized to one generic card shadow.
- The “Design System” page contains examples named `Button`, `Network`, and `Small Button`, but no published components/styles. These names should not be treated as reusable component contracts.
- The complete raw token set for the unqueried top-level frames—especially all Settings, Learning, Physical Health, Hospital, and additional OTP states—remains ambiguous because the Figma MCP rate limit prevented their context export.

## Consuming the token layer

Use semantic CSS variables directly or use the equivalent Tailwind theme names. Do not copy raw Figma values into component styles.

Before:

```css
.surface {
  background: #ffffff;
  color: #2f2f2f;
  border: 1px solid #e6e6f2;
  border-radius: 10px;
}
```

After:

```css
.surface {
  background: var(--color-surface-raised);
  color: var(--color-text-primary);
  border: var(--border-width) solid var(--color-border-subtle);
  border-radius: var(--radius-md);
}
```

The same style can use the Tailwind utilities `bg-surface-raised text-text-primary border-border-subtle rounded-md`.
