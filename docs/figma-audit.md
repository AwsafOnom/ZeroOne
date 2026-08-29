# ZeroOne Figma audit

Source: [ZeroOne-Build](https://www.figma.com/design/6cA9X3JkcLXULM6IL6OBA9/ZeroOne-Build), file key `6cA9X3JkcLXULM6IL6OBA9`.

## Scope and evidence

- The file has two pages: `Web App` (`8:9596`) and `Design System` (`8:9601`).
- `Web App` contains one large canvas frame, `All` (`10139:489`), with 59 direct child frames. Those direct children are the screen inventory below.
- The `Design System` page is not a token library. It contains three hand-drawn frames and one small instance; no variable collections, published components, or reusable styles were found.
- Raw visual values were extracted from the available Figma design-context exports and corroborated with the complete metadata tree. Figma MCP access reached the Starter-plan call limit before every direct child could receive a separate design-context export. Therefore, the inventory is complete, but raw-style coverage is marked as partial where a frame was not context-exported.
- Names such as `Choose Your Role`, `OTP Verification`, `Recovery`, `Community`, `Healing Chain`, `Reward`, and `Settings` are repeated because the canvas contains responsive versions, alternate states, or flows—not because the node IDs are duplicates.

## Screen inventory

### Authentication and onboarding

- `Log In` — `8019:17945`: Email/password sign-in with social sign-in options and an illustration.
- `Choose Your Role` — `8020:29735`: Desktop role selection between Individual and Professional.
- `Choose Your Role` — `8020:30093`: Compact/mobile role selection between Individual and Professional.
- `Choose Your Role` — `8021:161`: Role-specific account creation form with profile fields and sign-up options; the selected role is not explicit in the frame name.
- `Choose Your Role` — `8021:201`: Wide role-specific account creation form; the selected role is not explicit in the frame name.
- `OTP Verification` — `8022:810`: OTP entry and verification flow with a six-cell code input.
- `OTP Verification` — `8022:1796`: OTP verification variant; exact state is ambiguous from the generic frame name.
- `OTP Verification` — `8022:2037`: OTP verification variant; exact state is ambiguous from the generic frame name.
- `Mental health conditions ` — `8024:227`: Mental-health condition selection form; trailing space in the Figma name is preserved.
- `OTP Verification` — `8024:304`: OTP verification variant; exact state is ambiguous from the generic frame name.
- `OTP Verification` — `8027:284`: OTP verification variant; exact state is ambiguous from the generic frame name.

### Main application

- `Dashboard` — `8031:776`: Personalized health dashboard with active-summary cards, AI suggestions, recovery activities, journal information, and news.
- `Talk to Doctor` — `8066:332`: Doctor consultation entry point and medical-support content.
- `Doctors` — `8067:2757`: Doctor profile/detail page with doctor identity, qualifications, clinic, consultation CTA, tabs, and badges.
- `Chat` — `8067:4877`: Conversation view with message bubbles, avatars, media attachments, sticky conversation header, and composer.
- `AI Assistant` — `8187:1564`: AI wellness assistant landing/chat experience with a hero panel, conversation history, and composer.
- `Notification` — `8060:279`: Notification list with read/unread rows, selection boxes, timestamps, and “Mark all as read”.
- `Dashboard` — `8149:1398`: Dashboard variant; exact content/state difference from `8031:776` is ambiguous from the frame name alone.

### Recovery

- `Recovery` — `8166:474`: Recovery overview with activities, progress/metrics, member/squad information, and activity feed.
- `Onggi Guardian` — `8217:444`: Onggi Guardian recovery/squad view with metrics and member contribution information.
- `Recovery` — `8311:807`: Recovery variant with activity freeze mechanic and squad progress.
- `Recovery` — `8189:1890`: Recovery variant with squad comparison/progress content.
- `Recovery` — `8325:597`: Recovery detail variant with team members, activity feed, and freeze countdown.

### Community

- `Community` — `8086:1590`: Community overview with member/community activity and discovery content.
- `Community` — `8270:538`: Community variant with active members and activity/community cards.
- `Community` — `8271:2063`: Community variant with member/community content; exact state difference is ambiguous from the generic name.
- `Community` — `8283:5815`: Community variant with member/community content; exact state difference is ambiguous from the generic name.

### Healing Chain

- `Healing Chain` — `8159:469`: Healing Chain overview with the user, mentor/mentee relationship, and activity content.
- `Healing Chain` — `8262:2586`: Mentor detail view (`Your Mentor`) with profile, availability, communication, and session cards.
- `Healing Chain` — `8283:4198`: Mentee detail view (`Your Mentee`) with profile, availability, communication, and session cards.
- `Healing Chain` — `8149:3070`: Healing Chain variant; exact state difference is ambiguous from the generic name.

### Journal, map, learning, and rewards

- `healing journal` — `8135:1015`: Healing journal overview and recent journal content.
- `healing journal` — `8271:3432`: Healing journal variant; exact state difference is ambiguous from the generic name.
- `healing journal` — `8248:4018`: Healing journal variant with journal/check-in content; exact state difference is ambiguous from the generic name.
- `Physical Health` — `8089:1167`: Physical-health area landing screen.
- `Hospital` — `8196:2809`: Explore Map/Hospital location view with nearby places and events.
- `Hospital` — `8197:441`: Explore Map/Hospital variant; exact state difference is ambiguous from the generic name.
- `Hospital` — `8377:2268`: Explore Map/Hospital variant with filters or alternate map content; exact state difference is ambiguous from the generic name.
- `Learning` — `8089:1996`: Learning area landing screen.
- `Diet Advice` — `8183:454`: Diet advice content and recommendations.
- `Meal Details` — `8071:655`: Detailed meal/nutrition view.
- `News` — `8213:1659`: News and article content.
- `Reward` — `8107:439`: Rewards overview with Pulse Points, ways to earn, reward catalog, redemption history, and daily goal progress.
- `Reward` — `8261:969`: Rewards variant; exact state difference is ambiguous from the generic name.

### Help and settings

- `Help` — `8112:2064`: Help/support landing content.
- `Getting Started` — `8238:510`: Getting-started guide.
- `Getting Started` — `8241:1701`: Getting-started variant; exact state difference is ambiguous from the generic name.
- `Settings` — `8116:1411`: Settings overview with profile, password, notifications, privacy, terms, support, and about links.
- `Settings` — `8121:447`: Profile/personal-information settings state.
- `Settings` — `8121:775`: Password and authentication settings state.
- `Settings` — `8121:1266`: Notification settings state.
- `Settings` — `8121:1522`: Privacy policy content state.
- `Settings` — `8121:1698`: Terms of service content state.
- `Settings` — `8121:1916`: About/support content state.

### Additional authentication frames

- `OTP Verification 2` — `8027:601`: Additional OTP verification state; exact state is ambiguous.
- `Frame` — `12024:428`: Unnamed authentication/onboarding frame; purpose is ambiguous.
- `OTP Verification 3` — `8027:657`: Additional OTP verification state; exact state is ambiguous.
- `OTP Verification 4` — `8028:1015`: Additional OTP verification state; exact state is ambiguous.
- `OTP Verification` — `8028:1064`: Additional OTP verification state; exact state is ambiguous.

## Design System page inventory

- `Small Button` instance — `2549:5650`: Small button example/instance.
- `Button` — `8019:29216`: Three large button variants (`8019:29215`, `8019:29217`, `8022:2391`).
- `Network` — `8019:29332`: Two network/button-like variants (`8019:29331`, `8019:29333`).
- `Button` — `8025:681`: Two compact button variants (`8025:680`, `8025:682`).

## Repeated UI patterns

The following patterns occur on at least three screens. Node IDs are representative metadata/context evidence, not proposed component names.

### 1. Application sidebar

Present across the signed-in application screens, including Dashboard, Recovery, Community, Healing Chain, Journal, Map/Hospital, Learning, Rewards, Help, and Settings variants.

- Primary green sidebar; representative width `273px`, `50px` horizontal padding, `40px` top/bottom padding.
- Logo/image slot is approximately `183 × 169px`.
- Nav rows are usually `56px` high, with `20px` horizontal and `10px` vertical padding, `16px` icon/text gap, `24px` icons, and `8px` radius.
- The active row is white with primary-green text; inactive rows are transparent with white text.
- Navigation group uses a `10px` row gap and a large separation before the logout row (metadata shows a `234px` group gap in exported desktop contexts).
- Representative frame evidence: sidebar shell `8116:1910` in `Dashboard`, `8412:1681` in `Healing Chain`, and repeated `8412:*` sidebar frames in the other signed-in screens.

### 2. Top search/header bar

Present on the signed-in screens, including Dashboard, Recovery, Community, Healing Chain, Journal, Map/Hospital, Rewards, and Settings.

- Search field is generally `612 × 70px`, white, `20px` padding, `10px` internal gap, and `100px` radius.
- Search placeholder is “Search for Anything”, usually Poppins Regular `20px`, grey.
- Header content uses `50px` horizontal and `30px` vertical padding.
- The right cluster repeats a purple AI Assistant CTA, notification icon/count, and a `50px` circular user avatar.
- Representative evidence: `8078:402`–`8078:417` in `Dashboard`; repeated `8312:*` structures in Recovery, Community, Healing Chain, Rewards, and Settings.

### 3. AI Assistant CTA

Present in the signed-in header on at least Dashboard, Chat, AI Assistant, Notification, Recovery, Community, Healing Chain, Rewards, and Settings screens.

- Purple gradient from `#5f31b4` to `#7140d3`.
- `8px` radius, `10px` padding, `10px` icon/text gap, `20px` icon, Poppins SemiBold `16px`, white text.
- Representative evidence: `8093:2470` in Dashboard and `8312:1585` in Chat.

### 4. Stat/metric cards

Present in Dashboard active-summary content and multiple Recovery/Onggi Guardian states.

- Dashboard summary uses white cards with `10px` radius and compact icon/value/label groupings; the larger summary container uses `20px` radius and a subtle shadow.
- Recovery/Onggi Guardian uses repeated `StatCard` and `MetricCard` structures, including values, trend badges, progress bars, and labels.
- Representative evidence: `8064:315`, `8064:297`, `8217:1635`, `8217:1646`, and `8217:1661`.

### 5. Activity cards with points badge and Claim button

Present in Dashboard recovery activities and Rewards-related content, with repeated rows for activities such as Hydration Tracking, Walking Goals, and Guided Breathing.

- Activity row is roughly `430 × 60px` in the Dashboard metadata.
- Left side contains a `36px` app/activity icon and a two-line title/points block.
- The points value is shown as “50 pts” in the Dashboard activity feed.
- Right side repeats a compact `Claim` button, approximately `50.38 × 23.75px` in metadata; the label is Poppins-sized compact text.
- Representative evidence: `8049:1823`, `8257:768`–`8257:778`, `8257:829`–`8257:840`, and `8257:816`–`8257:827`.

### 6. Member/avatar rows

Present in the global header, Community, Recovery/Onggi Guardian, Healing Chain, and chat/doctor views.

- Global profile avatar is `50 × 50px`, circular, followed by a `16px` gap and the user name.
- Recovery/community member rows use a small circular status/avatar marker alongside member name, contribution, or progress information.
- Chat uses larger circular avatars with a small green online indicator.
- Representative evidence: global avatar `8312:1678`–`8312:1681`; Recovery activity/member rows `8217:1684`–`8217:1738`; chat avatar/status nodes `8067:5318`–`8067:5330`.

### 7. Tab bars

Present in Doctors, Healing Chain mentor/mentee details, Settings, and other content/detail states.

- Doctor tab bar is approximately `908.67 × 48.89px` with repeated badge/button items.
- Healing Chain detail tabs use compact `10px` padding, `8px` radius, `18px` text, and a primary-green active state.
- Settings uses larger card-contained tabs for Personal Information and Password & Authentication.
- Representative evidence: Doctors `8067:4666`–`8067:4679`; Healing Chain `8262:3025`–`8262:3030`; Settings `8109:489` and `8121:751`.

### 8. Modals, overlays, and selection panels

The metadata contains overlay headers/blur regions, checkbox groups, and selection panels across Chat, Learning/filters, Map/Hospital filters, and Settings/authentication states.

- Chat includes a sticky translucent header with backdrop blur and a bottom composer.
- Filter/selection panels use repeated `CheckboxItem`/`Checkbox` structures and “Select a category” or “Select language” labels.
- Some responsive states use overlay/blur containers rather than a conventional named modal component.
- Representative evidence: Chat `8067:5365` (`Overlay+HorizontalBorder+OverlayBlur`), selection groups `8160:1317`–`8160:1358`, and Map filter text around `8377:2659`–`8377:2663`.

## Ambiguities to resolve before implementation

- The repeated frame names do not identify responsive breakpoint, interaction state, or selected tab. The node IDs must be used as the source of truth.
- `8021:161`, `8021:201`, and the additional OTP frames appear to be flow/state variants, but their intended route/state labels are not encoded in the top-level names.
- `12024:428` is literally named `Frame`; its purpose needs product confirmation.
- The Figma page named `Design System` is a scratchpad of examples, not a source of canonical variables/components.
- Several screens contain fractional/scaled values (for example `17.575px`, `18.792px`, `21.476px`, and `29.73px`). It is unclear whether these are intentional desktop scaling or artifacts of resized frames; they are listed as raw values in `design-tokens.md` rather than silently rounded.
- The user-requested “activity cards with a points badge and Claim button” is clearly evidenced on Dashboard/Reward content, but the exact cross-screen count and all raw style values could not be re-exported after the Figma MCP rate limit.

## Application shell implementation assumptions

- The desktop shell uses the measured `373px` navigation rail and the shared `50px` page/header insets from the exported frames.
- Below the tablet breakpoint (`768px`), the rail becomes an off-canvas drawer. A compact Menu control opens it, and selecting a destination or the backdrop closes it.
- The collapsed sidebar variant keeps the navigation icons and hides text labels; the brand image is reduced to its available square mark area because no separate collapsed-logo frame exists.
- On narrow screens, the search field remains available at flexible width, the AI label and user name may hide to preserve the header actions, and the user avatar/notification affordances remain visible.
