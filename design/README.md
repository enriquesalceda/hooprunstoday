# Handoff: Hoopruns.today — Core Loop (4 screens)

## Overview
Hoopruns.today is a street-basketball app: find live runs on nearby courts (Radar), check in on-court via a geofenced slider, view player profiles (street reputation + league stats), and log game scores that require opponent verification. This package specifies the core mobile loop for implementation in **React Native / Expo + TypeScript** (mobile), with the same tokens reusable for the web frontend.

## About the Design Files
`prototypes/hoopruns-core-loop.html` is a **design reference built in HTML** — a working interactive prototype, not production code. Open it in any browser (it is fully self-contained). The task is to **recreate these screens in the Expo/React Native codebase** using its own patterns and libraries — do not port the HTML/CSS directly.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interactions are final intent. Recreate pixel-perfectly. Targets: mobile 390×844 (iPhone-class); desktop web 1280×820 reference viewport.

**Start here:** `system/readme.md` for the rules, `system/tokens/` for the values, `prototypes/` for the behavior. The token names below match the CSS custom properties in `system/tokens/`.

## Design Tokens

Colors (dark UI, monochrome — no accent colors anywhere):
- `bg`: `#0d0d0c` (app background)
- `bgRaised`: `#1a1a19` (pressed rows, image wells)
- `bgTrack`: `#141413` (slider track)
- `hairline`: `#2a2a28` (primary dividers/card borders), `#1f1f1e` (faint dividers)
- `border`: `#444` (interactive frames: tabs, inputs, slider rails), `#555` (badge chips)
- `ink`: `#fff` (primary text, inverted fills)
- `inkOnWhite`: `#0d0d0c`
- `body`: `#d9d7d2` · `secondary`: `#b5b3af` · `muted`: `#8a8a85` · `faint`: `#6f6f6a`
- Brand rule (see assets/README.txt): ink `#111`, paper `#fff`, black & white only.

Typography (2 families):
- **Anton** (Google Fonts, one weight) — display: court names, headlines, big numbers. Line-height 0.8–1.0. Sizes used: 17 (header logo), 30 (slider arrow), 34 (court names, stat numbers), 40 (profile name, screen titles), 52 (check-in court name), 68 (score inputs), 84–92 (LOCKED flash, street score).
- **Monospace** (ui-monospace/Menlo; Expo: `Menlo` on iOS / `monospace` on Android, or bundle JetBrains Mono) — ALL labels, metadata, buttons. Sizes 8.5–13px. Weights 500 (data) / 700 (actions, handles). Letter-spacing 0.06–0.14em on buttons/labels, ALL CAPS everywhere.
- No other fonts. No border-radius anywhere (everything square). No shadows, no gradients.

Spacing: 16px screen gutter; rows padded 12–16px; section labels 9px mono `faint`; 1px hairlines separate rows (no cards floating on background).

Selected-state pattern (used by tabs + bottom nav + format picker): selected segment = white bg `#fff` + ink `#0d0d0c`; unselected = transparent bg + `#8a8a85`; segments separated by 1px `#444` borders.

## App Chrome (all screens)
- **Header** (top, below status bar): left = logo lockup (Anton "HOOPRUNS" 17px + white bar chip ".TODAY" 6.5px bold, tracking 0.3em, inverted); right = pulsing 6px white dot + mono status `SYS_ACTIVE` (or `IN_GAME @ <COURT>` when checked in). Second line: `GEOFENCE: <HOOD>` left, live clock `HH:MM:SS LOCAL` right (9px mono, faint). 1px `#2a2a28` bottom border.
- **Bottom nav**: 3 equal segments — `RADAR` / `LOG GAME` / `YOU` (10px mono 700, tracking 0.1em, 15px vertical padding), selected-state pattern above, 1px `#444` top border.
- Pulse animation: opacity 1 → 0.15 → 1, 1.6s infinite.

## Screens

### S1 — Radar (home)
Purpose: see nearby courts and activity feed; entry point to check-in and profiles.
- Section label: `COURT DIRECTORY // 3 TRACKED`.
- **Court row** (tap → S2): court name (Anton 34px, line-height 0.95, white, balanced wrap); if live, chip `● LIVE` (8px mono 700, white bg, inverted, 3×6px padding) top-right. Meta row: `0.4 KM · 14 ON COURT · NEXT: 3V3 HALFCOURT` (9.5px mono, secondary; NEXT in faint). Rows separated by `#2a2a28` hairlines; pressed state bg `#1a1a19`.
- If checked in at that court: full-width white banner inside the row — `▶ YOU ARE ON THIS COURT — <court subdomain>` (9px mono 700, inverted, 6×8px padding). Player count on that row +1.
- **THE BLACKTOP BULLETIN** feed: rows with underlined `@handle` (11px mono 700, white, tap → that player's S3), `4M AGO · PRINCE ALFRED` (9px mono faint), then 13px body text `#d9d7d2`, line-height 1.45. Faint `#1f1f1e` dividers.

### S2 — Court check-in
Purpose: geofence-verified check-in at the selected court.
- `← RADAR` back link (10px mono 700, secondary).
- Court name Anton 52px (line-height 0.92); meta: coords + bordered type chip (`OUTDOOR`, 1px `#444`); counts row (faint).
- Content pinned bottom: caption `PROXIMITY_VERIFIED: TRUE · GEOFENCE MATCH <HOOD>` (9px mono faint), then **slide-to-engage control**: 76px-tall track (`#141413`, 1px `#444` top/bottom borders, full-bleed), centered label `[ PULL SLIDER TO ENGAGE BEACON ]` (10px mono 700, tracking 0.12em, faint → while dragging: `ENGAGING // 63%` in white). Draggable 76×76px white block with Anton `→` 30px.
- Behavior: pointer-drag the block along the track (track width = screen − 76). Release ≥97% → snap to 100, **full-screen white flash** `LOCKED.` (Anton 84px, ink-on-white) for 750ms (tweakable 300–1500ms), then: `checkedIn = courtId`, navigate to S1. Release <97% → animate back to 0 (280ms cubic-bezier(0.2, 0.9, 0.2, 1)). Drag uses no transition.

### S3 — Player profile
Purpose: player identity, street reputation, league stats, game history. Reached via bottom-nav `YOU` (own profile) or a bulletin @handle (other players).
- `← RADAR` back link.
- **Portrait**: full-width 264px image, grayscale + contrast(1.08) treatment, `#1a1a19` well while empty.
- **ID card** (1px `#2a2a28` border attached under portrait, no top border): name Anton 40px; meta row 9.5px mono secondary: height, position, `HOME: <COURT>` underlined in white (tap → S1); player subdomain 8.5px mono faint (e.g. `jordan.miller.hoopruns.today`).
- **Tab switcher** `[ STREET CRED ] / [ LEAGUE STATS ]` — 1px `#444` frame, selected-state pattern, 13px vertical padding, 10px mono 700 tracking 0.1em.
- **STREET CRED tab**: street score Anton 92px (line-height 0.8) with side labels `STREET SCORE` (faint) and `RANK: COURT LEGEND` (11px mono 700 white); badge chips (`LOCKDOWN`, `SNIPER`, …) 1px `#555` border, 8×10px padding, 9.5px mono 700, `#d9d7d2`, wrapping row, 8px gap; footnote `PEER-VOUCHED CAPABILITIES · 61 VOUCHES` (8.5px mono faint).
- **LEAGUE STATS tab**: 3-col stat grid (1px `#2a2a28` frame + internal column borders): Anton 34px number over 9px mono faint label (PPG/RPG/APG); `ROSTERS + ACHIEVEMENTS` list rows (name white / meta faint, 10.5px mono, faint dividers).
- **GAME LOG** (below either tab): rows `W 21 - 15 VS @southside_five` (10.5px mono 700) + meta `VERIFIED · STREET · JUL 12` (8.5px faint). Verified = solid 1px `#2a2a28` border, white label; **pending = dashed 1px `#6f6f6a` border, `#8a8a85` label**.

### S4 — Log game
Purpose: submit a score as a transaction pending opponent verification.
- Title `POST-GAME RECORD` Anton 40px, two lines; caption `SCORE TRANSACTION · REQUIRES OPPONENT VERIFICATION`.
- **Format picker** (2 segments, selected-state pattern): `CASUAL STREET RUN` / `OFFICIAL LEAGUE FIXTURE`.
- **Score inputs**: 2-col grid, 12px gap; each cell 1px `#444` border with header strip `TEAM A (YOUR SQUAD)` / `TEAM B (OPPONENTS)` (8.5px mono 700 secondary, hairline below) and a numeric input, Anton 68px centered, placeholder `00`, digits only, max 3.
- **Opponent captain**: single-row input, label cell `OPP CAPTAIN` + text input `@handle` (13px mono 700).
- Hint line: invalid → `ENTER BOTH SCORES + OPPOSING CAPTAIN HANDLE`; valid → `READY · WRITES PENDING TX · PINGS @handle`.
- **TRANSMIT SCORE DATA** button pinned bottom: 60px tall, 1px white border; disabled = transparent bg, faint ink, 55% opacity; enabled = white bg, dark ink. Tap (valid only) → prepend `{ label: "W|L A - B VS @handle", meta: "PENDING · STREET|PRO · TODAY", pending: true }` to game log, reset form, navigate to S3 (own profile).

## Interactions & Navigation summary
- Bottom nav switches S1/S4/S3(you). Court row → S2. Bulletin @handle → S3(player). HOME court link → S1. Back links → S1.
- Only animations: slider snap-back (280ms), LOCKED flash (750ms), status-dot pulse. Everything else is instant — no fades or slide transitions.

## State Management
Client state: `screen`, `profileId`, `selCourtId`, `tab (street|league)`, `checkedIn: courtId|null`, slider `{dragging, pct}`, log form `{scoreA, scoreB, oppHandle, gameType}`, `games[]`.

Suggested TypeScript models (derived from prototype data — starting point for the backend):
```ts
type CourtType = 'OUTDOOR' | 'INDOOR';
interface Court { id: string; name: string; lat: number; lng: number; type: CourtType;
  distanceKm: number; onCourtCount: number; nextRun: string; live: boolean; subdomain: string; }
interface Player { id: string; handle: string; name: string; height: string; position: string;
  homeCourtId: string; subdomain: string; streetScore: number; rank: string;
  badges: string[]; vouches: number; league: { ppg: number; rpg: number; apg: number };
  teams: { name: string; meta: string }[]; }
interface Bulletin { id: string; authorId: string; courtId: string; createdAt: string; text: string; }
type GameFormat = 'STREET' | 'LEAGUE';
interface GameRecord { id: string; format: GameFormat; scoreFor: number; scoreAgainst: number;
  opponentCaptainHandle: string; status: 'PENDING' | 'VERIFIED'; playedAt: string; }
```
Backend implications: geofence proximity check for check-in; check-in pins player to court + increments count; score submission creates a PENDING record and notifies the opponent captain for verification.

## Assets
`assets/` is the complete brand pack (see `assets/README.txt` for usage rules):
- PNG wordmarks (stacked + one-line, black + white), app icons, favicon.
- `assets/vector/` — true-outline SVGs (print/scale-safe).
- `assets/webapp/` — favicon.svg, PWA icons, `site.webmanifest`, `head-snippet.html` for the web frontend `<head>`.
- Font: Anton via Google Fonts (`expo-google-fonts/anton` in Expo).
- Profile portraits are placeholders — real photos, rendered grayscale, needed.

## Files
- `prototypes/hoopruns-core-loop.html` — self-contained interactive mobile prototype (open in browser; all 4 screens + side legend).
- `prototypes/hoopruns-web-app.html` — self-contained desktop web prototype: same 4 workflows, same logic/tokens, adapted to a 1280×820 browser viewport. Layout deltas: top bar replaces bottom nav (logo left, 3-segment nav center, telemetry right, 58px tall); Radar is two-column (court directory flex + 400px bulletin rail, 1px divider); Check-in is a centered slate (court name Anton 96px, 640px slider); Profile is a 360px portrait/ID column + detail column grid; Log Game is a centered 680px form. Hover states (row bg #1a1a19, nav/tab text → white) replace mobile pressed states.
- `brand/hoopruns-brand-sheet.html` — self-contained brand sheet: logo construction, lockups, color/type rules, usage do/don'ts. The visual identity reference for all surfaces.
- `system/` — the full design system: `styles.css` + `tokens/` (colors, type, spacing, borders, motion as CSS custom properties), 19 React components in `components/` (each with a `.d.ts` and a `.prompt.md` usage rule), foundation specimen cards in `guidelines/`, and React UI kits for both products in `ui_kits/`. `system/readme.md` is the written system — content voice, visual foundations, iconography position. `system/SKILL.md` makes the folder loadable as an Agent Skill so Claude Code can design new screens on-brand.
- `assets/` — brand asset pack.
- This README.

Suggested repo placement: commit this folder as `design/` at the repo root. Keep the folder intact — `system/` resolves images out of the sibling `assets/` folder.
