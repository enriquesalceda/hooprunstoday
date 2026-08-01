# Hoopruns.today — Design System

**Hoopruns.today** is a street-basketball app for finding and joining pickup runs. Players open Radar to see which nearby courts are live, physically walk up and check in through a geofenced slide-to-engage beacon, log game scores that the opposing captain has to verify, and build a reputation that is half peer-vouched street cred and half league box score.

The identity is deliberately anti-app: black, white, and monospace. It reads like a scoreboard, a gym sign-up sheet, or a piece of terminal telemetry — never like a social network. Nothing is rounded, nothing glows, nothing is blue.

## Products in this system

| Surface | Frame | Kit |
| --- | --- | --- |
| Mobile app (React Native / Expo) | 390 × 844 | `ui_kits/mobile_app/` |
| Web app (browser) | 1280 × 820 | `ui_kits/web_app/` |
| Brand sheet / print | Letter, paper surface | `guidelines/brand-sheet.md`, `assets/` |

## Authentication

Identity is an **email address plus a Clerk email OTP** — no phone number, no SMS, no password, and no country picker anywhere in the product. One address, one player. The address is never shown on a profile and never appears after the code screen, where it is masked to `j•••••@gmail.com`.

## Sources

Built from the design artifacts in this project — these are the ground truth:

- `Hoopruns Core Loop.dc.html` — mobile prototype, 4 screens (Radar, Check-in, Profile, Log Game)
- `Hoopruns Web App.dc.html` — desktop web prototype, same 4 workflows
- `Hoopruns Brand Sheet.dc.html` — logo construction, lockups, clear space, minimum sizes
- `Hoopruns Logo Directions.dc.html`, `Vector Pack.dc.html` — logo exploration + vector outlines
- `assets/README.txt` — the asset pack's own usage rules (authoritative on logo usage)
- Implementation repo: **github.com/enriquesalceda/hooprunstoday** (branch `main`), design handoff committed at `design/`. Stack: React Native / Expo / TypeScript + web frontend.

There is no external Figma file. Every value here was lifted from the prototype source, not from a screenshot.

## CONTENT FUNDAMENTALS

The product talks like a court, not like a brand. Terse, present-tense, slightly mechanical — as if the app is a piece of equipment bolted to the fence rather than a service trying to be liked.

**Casing.** Every label, button, chip, nav item, and datum is UPPERCASE. The only sentence-case text in the entire product is user-written bulletin copy — that's what makes it read as a human voice cutting through machine chrome.

**Voice.** No first person, no second person, no "we". The app narrates state, it doesn't address you: `SYS_ACTIVE`, `PROXIMITY_VERIFIED: TRUE`, `GEOFENCE MATCH NEWTOWN, SYD`, `WRITES PENDING TX`. The one exception is the check-in banner, which points rather than speaks: `▶ YOU ARE ON THIS COURT`.

**Machine register.** Screaming-snake or colon-delimited keys borrowed from logs and telemetry: `COURT DIRECTORY // 3 TRACKED`, `IN_GAME @ PRINCE`, `SCORE TRANSACTION · REQUIRES OPPONENT VERIFICATION`, `PEER-VOUCHED CAPABILITIES · 61 VOUCHES`. Separators are ` · ` (middot) for metadata and ` // ` for counts.

**Instructions are bracketed commands.** `[ PULL SLIDER TO ENGAGE BEACON ]`, `[ STREET CRED ]`, `[ LEAGUE STATS ]`. Brackets mark anything the user can act on or switch between.

**Street vocabulary stays street.** Court names, badges, and ranks are unglossed slang: `LOCKDOWN`, `SNIPER`, `GLUE GUY`, `MOTOR`, `COURT LEGEND`, `RIM GUARDIAN`, `HOLD COURT`. Never explained in a tooltip. Never softened.

**Buttons are verbs of transmission, not requests.** `TRANSMIT SCORE DATA`, not "Submit". `ENGAGE BEACON`, not "Check in".

**Error and hint copy states the requirement, never apologises.** `ENTER BOTH SCORES + OPPOSING CAPTAIN HANDLE` → on valid: `READY · WRITES PENDING TX · PINGS @handle`. No "Oops", no "Please", no exclamation marks.

**Handles are always `@lowercase_snake`.** Court subdomains are always fully written out: `prince-alfred-park.hoopruns.today`. The domain is part of the identity — show it.

**Numbers are naked.** `0.4 KM`, `14 ON COURT`, `24.5` PPG, `875` street score. No "approximately", no rounding language, no units spelled out in words.

**Deadlines are stated, not implied.** Where silence decides something, the countdown is on the row: `AUTO-VERIFIES IN 41:12`, `CLOSES IN 1H 30M`, `RESEND CODE IN 0:28`. Never "soon", never a relative promise the app can't keep.

**No emoji, ever.** Two unicode glyphs are sanctioned as functional marks: `●` (live) and `▶` (you-are-here), plus `→` and `←` for the slider handle and back links. Nothing else.

## VISUAL FOUNDATIONS

**Color.** Pure monochrome. `#0d0d0c` blacktop, `#ffffff` paper, and a five-step grey ramp for hierarchy (`#d9d7d2` body → `#6f6f6a` faint). There is no accent color, no semantic red/green — a pending game is signalled by a *dashed* border, not by amber. Two worlds: product UI is dark (blacktop), brand/print material is light (paper, ink `#111`). Never mix a paper surface into a product screen or vice versa.

**Type.** Anton (400, caps) for anything you'd shout — court names, scores, player names, screen titles. Monospace 500/700 for everything you'd read off an instrument — labels, metadata, buttons, handles. No third family in the product; Helvetica Bold appears only inside the `.TODAY` bar of the logo. Display line-heights are crushed (0.8–0.95) so stacked headlines read as one solid block; mono tracking widens with importance (0.06em labels → 0.14em primary action).

**Split slates (web).** A big Anton statement on the left, the interaction in a right panel behind a hairline. The constraint that makes it survive narrow frames: the left panel is `flex: 1; min-width: min-content` — it can never shrink below its headline, because 96–140px display type has no smaller form and `overflow: visible` would spill it across the hairline. The right panel is `flex: 0 1 520px; min-width: 0; box-sizing: border-box` and absorbs the squeeze, because a field and a button genuinely can get narrower. Never `overflow: hidden` on the left panel — it clips letterforms.

**Layout.** Full-bleed rows separated by 1px hairlines — no floating cards, no gutters between siblings, no elevation. 16px screen gutter on mobile, 24px on web. Content is either flush to the edge (rows, banners, sliders, nav) or inset by exactly the gutter. Web adds columns: Radar splits into a flexible directory + a fixed 400px bulletin rail; Profile is a fixed 360px portrait column + detail column; forms are centered at 680px. Primary actions and the slider are pinned to the bottom of their screen.

**Backgrounds.** Flat color only. No gradients, no photographic backdrops, no repeating pattern, no texture, no noise. Empty space is empty.

**Obligation frames.** A **solid white** 1px frame means *this needs you* — it is used for nothing else, and there is at most a couple on a screen (`ClaimCard`). A **dashed `#6f6f6a`** frame means *waiting on someone else, or not there yet* — pending claims, open votes, unverified scores, empty sections. Learn that pair and the whole product sorts itself at a glance.

**Empty states.** An empty section is a dashed `#6f6f6a` frame stating what is absent and what fills it — `NO GAMES LOGGED · LOG A SCORE TO OPEN YOUR RECORD`. Never hide the section, never draw an illustration, never use color. It is the same dashed treatment an unverified score gets, because "not yet" and "not confirmed" are the same idea here.

**Cards.** There are no cards. What looks like a card is a 1px `#2a2a28` frame around a content block, or a hairline-separated row. No radius, no shadow, no background shift.

**Borders.** Three weights of meaning, all 1px: `#2a2a28` for structural hairlines and frames, `#444` for anything interactive (segmented controls, inputs, slider rails), `#555` for badge chips. Dashed `#6f6f6a` means *unverified/pending* — the only place a border style carries data.

**Corner radii.** Zero. Everywhere. The single exception is the 6px live status dot at 50%. App icons are square; the OS applies its own mask.

**Shadows.** None — inner or outer.

**Transparency and blur.** None. Unselected segments use `transparent` background (so the app surface shows through), and disabled controls use `opacity: 0.55`. That is the entire use of alpha. No frosted glass, no scrims, no protection gradients — text sits on flat color, always.

**Selection is inversion.** One pattern drives every selected state in both products: selected segment = white fill + `#0d0d0c` ink; unselected = transparent + `#8a8a85` ink; segments divided by 1px `#444`. It's the bottom nav, the profile tabs, the format picker, and the primary button — learn it once.

**Hover (web only).** Row backgrounds lift to `#1a1a19`; muted text goes to white. No color change, no underline appearing, no movement. Mobile uses the same `#1a1a19` as its pressed state.

**Press.** Background darkens to `#1a1a19`. Nothing scales, nothing bounces.

**Animation.** Three, total. The slider handle snaps back over 280ms `cubic-bezier(0.2, 0.9, 0.2, 1)` when released short of 97%; the LOCKED. confirmation holds a full-screen white flash for 750ms; the live status dot pulses 1 → 0.15 → 1 over 1.6s, forever. While dragging, the handle has no transition at all — it tracks the finger exactly. Screen changes are instant cuts.

**Imagery.** Player portraits only, and always `grayscale(1) contrast(1.08)` on a `#1a1a19` well — hard, cold, high-contrast, never warm. 264px tall full-width on mobile, 400px in a 360px column on web. No illustration, no iconography-as-decoration, no stock photography.

**Confirmation is loud.** The one moment the system raises its voice is a successful check-in: the entire viewport goes white with `LOCKED.` in Anton at 84–140px. It's the payoff for physically showing up.

## ICONOGRAPHY

There is no icon set, and that is a deliberate position — labels are typed out in mono instead. Do not add Lucide, Heroicons, Material, or any other library to this system; a design that needs an icon has usually not been reduced enough.

Four unicode glyphs do functional work, set in the surrounding font:

| Glyph | Meaning | Where |
| --- | --- | --- |
| `●` | live activity | `● LIVE` chip on a court row |
| `▶` | you are here | on-court banner |
| `→` | drag me | slide-to-engage handle (Anton 30px) |
| `←` | back | `← RADAR` back links |

The pulsing status dot is a 6px `border-radius: 50%` div, not a glyph. The only true brand mark is the wordmark/lockup in `assets/` — always used as a provided file, never retyped.

**Emoji are prohibited** in product UI, marketing, and print.

## Index

- `styles.css` — the single entry point consumers link. `@import`s everything below.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `borders.css`, `motion.css`
- `components/` — `brand/`, `core/`, `navigation/`, `court/`, `data/`, `forms/`
- `ui_kits/mobile_app/` — `index.html`: Radar, Check-in, Profile, Log Game · `signup.html`: the 6-step sign-up flow · `verify.html`: the 7-step score-verification flow (390 × 844, click-through)
- `ui_kits/web_app/` — the same three flows at 1280 × 820
- `ui_kits/signupData.jsx` — positions, rosters, and the `useSignupForm()` state machine both sign-up kits share
- `ui_kits/verifyData.jsx` — claim/vote/inbox seed data and `useVerifyQueue()`, shared by both verification kits
- `guidelines/` — foundation specimen cards + brand-sheet prose
- `assets/` — wordmarks (PNG + SVG), app icons, favicons, webmanifest, `README.txt` usage rules
- `SKILL.md` — makes this folder usable as an Agent Skill in Claude Code

### Components

| Group | Components |
| --- | --- |
| `brand/` | `Logo` |
| `core/` | `Button`, `Chip`, `SectionLabel`, `StatusDot`, `Telemetry` |
| `navigation/` | `SegmentedControl`, `AppHeader`, `BottomNav`, `BackLink` |
| `court/` | `CourtRow`, `OnCourtBanner`, `BulletinRow`, `SlideToEngage`, `LockFlash` |
| `data/` | `StatGrid`, `ScoreBlock`, `GameLogRow`, `RosterRow`, `EmptyState`, `FactTable`, `ClaimCard`, `VoteSide`, `InboxRow` |
| `forms/` | `ScoreInput`, `FieldRow`, `UnitToggle`, `EmailField`, `PickerList`, `CodeInput`, `DateField`, `PickerRow` |

Every component in this list has a counterpart in the mobile or web prototype. **Intentional additions:** `LockFlash` and `Telemetry` were extracted as named components because both products render them identically — in the prototypes they were inline markup, not separate parts. Same for the sign-up set (`EmailField`, `PickerList`, `CodeInput`, `DateField`, `PickerRow`, `UnitToggle`, `EmptyState`, `FactTable`), lifted out of the sign-up prototypes once both platforms proved they render identically.

**Extended rather than duplicated:** `Chip` gained a `selected` flag (multi-select positions and vouch capabilities) and a `pending` variant (the dashed `UNVOUCHED` mark); `FieldRow` gained a `trailing` slot so a `UnitToggle` can sit inside its frame; `GameLogRow` gained `sublabel` so it doubles as a two-line queue row; `RosterRow` gained `muted` for court-vote voter rolls. Reach for an existing component's new prop before adding a component.

### Fonts

Anton is loaded from Google's CDN in `tokens/fonts.css` (no local binary was provided). If you want the system fully offline, drop `Anton-Regular.woff2` into `assets/fonts/` and repoint the `src`. Monospace is intentionally the platform stack (`ui-monospace`/Menlo) rather than a webfont — it should look like the device's own terminal type. If you'd rather pin it, JetBrains Mono is the closest match to the prototypes' rendering.
