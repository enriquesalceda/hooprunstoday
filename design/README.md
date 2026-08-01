# Handoff: Hoopruns.today — Core Loop (4 screens)

## Overview
Hoopruns.today is a street-basketball app: find live runs on nearby courts (Radar), check in on-court via a geofenced slider, view player profiles (street reputation + league stats), and log game scores that require opponent verification. This package specifies the sign-up flow and the core loop for implementation in **React Native / Expo + TypeScript** (mobile), with the same tokens reusable for the web frontend.

**Auth:** identity is an email address verified by a **Clerk email OTP**. There is no phone number, no SMS, no password, and no country picker anywhere in this package — earlier drafts used SMS and were replaced because per-message cost is prohibitive for a solo developer.

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
- **Squad size picker** (4 segments, selected-state pattern, defaults 3V3): `1V1` / `2V2` / `3V3` / `5V5`. Sits 8px above the format picker so the two read as one control group. The size rides on the claim and drives the verification copy.
- **Format picker** (2 segments, selected-state pattern): `CASUAL STREET RUN` / `OFFICIAL LEAGUE FIXTURE`.
- **Score inputs**: 2-col grid, 12px gap; each cell 1px `#444` border with header strip `TEAM A (YOUR SQUAD)` / `TEAM B (OPPONENTS)` (8.5px mono 700 secondary, hairline below) and a numeric input, Anton 68px centered, placeholder `00`, digits only, max 3.
- **Opponent captain**: single-row input, label cell `OPP CAPTAIN` + text input `@handle` (13px mono 700).
- Hint line: invalid → `ENTER BOTH SCORES + OPPOSING CAPTAIN HANDLE`; valid → `READY · WRITES PENDING TX · PINGS @handle`.
- **TRANSMIT SCORE DATA** button pinned bottom: 60px tall, 1px white border; disabled = transparent bg, faint ink, 55% opacity; enabled = white bg, dark ink. Tap (valid only) → prepend `{ label: "3V3 · W|L A - B VS @handle", meta: "PENDING · STREET|PRO · TODAY", pending: true }` to game log, reset form, navigate to S3 (own profile).

## Sign-up Flow (6 screens, mobile + web)

**Email address + Clerk email OTP** (no phone, no SMS, no password), one-screen registration, geofence gate, then the new player's own profile. Prototypes: `prototypes/hoopruns-signup-mobile.html`, `prototypes/hoopruns-signup-web.html`. Both carry a side legend with demo hints and a RESTART FLOW control.

Chrome during sign-up: header shows the logo and telemetry only — `GEOFENCE: PENDING` and `SYS_STANDBY` until location is granted, then the real neighborhood and `SYS_ACTIVE`. **No bottom nav (mobile) or header nav (web) until the record exists**; on the final profile screen the nav appears with YOU selected and RADAR / LOG GAME dim at 55% (they belong to the core loop).

### O1 — Identity (sign in AND sign up; same entry for both)
- Title `IDENTITY CHECK` (Anton 40 mobile / 96 web); caption `EMAIL VERIFICATION · ONE ADDRESS, ONE PLAYER`.
- One field: `EMAIL` label cell + address input (`type="email"`, autocapitalize off, whitespace stripped, placeholder `you@court.com`). **No country picker, no phone number — those are gone from the product.**
- Validation is a plain `/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i` gating the button only; typing is never blocked.
- Hint: invalid → `YOUR EMAIL NEVER APPEARS ON YOUR PROFILE.`; valid → `READY · ONE-TIME CODE, NO PASSWORD TO FORGET`.
- `TRANSMIT CODE` (60/62px, standard disabled treatment). Footer: `EXISTING PLAYER? SAME EMAIL, SAME RECORD.` — returning players take this identical path and land on their existing profile.

### O2 — Code
- `← EMAIL` back. Title `ENTER CODE`. Caption `SENT TO j•••••@gmail.com · EXPIRES IN 10:00` — **the address is masked to its first character; the domain stays visible so a typo is still catchable.**
- Six cells (62px mobile / 82px web, Anton 34/44) driven by one transparent input, matching Clerk's 6-digit email OTP. Filled cell = white border + `#141413` fill.
- Auto-verifies at 6 digits (~260ms). Prototype rule: any code passes except `000000`, which rejects.
- Rejected: cells go dashed `#6f6f6a`, hint `CODE REJECTED · 2 ATTEMPTS LEFT` (singular at 1). At 0 attempts the cells drop to 55% opacity, the input is disabled, and the hint reads `TOO MANY ATTEMPTS · REQUEST A NEW CODE`. **Mirror Clerk's real attempt and rate limits here rather than inventing softer ones.**
- `RESEND CODE IN 0:28` counts down, then becomes tappable; resending clears the lock and restores attempts.

### O3 — Player record (one screen, all fields)
Title `PLAYER RECORD`; caption shows the live subdomain preview. Order: portrait → name → handle → born → height → position → home court → league team.
- **Portrait** — 200px well (mobile) / 400px in the 360px column (web), `grayscale(1) contrast(1.08)`, caption `SHOT IN MONO · FACE VISIBLE · NO TEAM KIT REQUIRED`.
- **REAL NAME** — force-uppercased as typed.
- **@HANDLE** — lowercased, slug `[a-z0-9_]`. Live availability with a debounce (`handleCheckMs`, default 600ms): `CHECKING AVAILABILITY…` → `AVAILABLE · <handle>.hoopruns.today` (white) or `TAKEN · <handle>_hoops` (muted). Under 3 chars → `TOO SHORT · MINIMUM 3 CHARACTERS`. Demo taken list: jordan, buckets, dee, admin, hoopruns, test.
- **BORN** — DD / MM / YYYY in one framed row, digits only.
- **HEIGHT** — free text plus an FT/CM segmented toggle inside the same frame; the placeholder follows the unit (`6'2"` / `188`).
- **POSITION · SELECT ALL THAT APPLY** — multi-select chips; selected chips invert (white fill, dark ink). Multiple positions are expected and render on the profile joined by ` / `.
- **HOME COURT** — row with `→`, opens O4. Shows `SELECT` in faint until chosen.
- **LEAGUE TEAM** — optional expandable row (3 rosters). Unlinked → `LINK A ROSTER TO SYNC LEAGUE STATS. SKIP IT AND STREET CRED STANDS ALONE.` Linked → `LINKED · STATS SYNC PENDING · PPG/RPG/APG APPEAR AFTER FIRST SYNC`. **Stats are never self-entered.**
- Hint line names what's outstanding: `STILL NEEDED: HANDLE · POSITION · HOME COURT` → `READY · CREATES <handle>.hoopruns.today`. Button `CREATE PLAYER RECORD`. Portrait is encouraged but not gated in the prototype.

### O4 — Home court picker
`← RECORD` back, title `HOME COURT`, label `COURT DIRECTORY // 3 TRACKED · PICK WHERE YOU RUN MOST`. Reuses the Radar court row (name + distance + on-court + type) minus the live chip. **Selected row inverts entirely** (white fill, dark ink) and carries a `▶ HOME` chip. Tapping selects and returns to O3. Footnote: `HOME COURT SHOWS ON YOUR PROFILE. CHANGE IT ANY TIME.`

### O5 — Geofence access (permission gate, before Radar)
Title `GEOFENCE ACCESS`; caption `CHECK-INS ARE VERIFIED BY PROXIMITY, NOT BY TRUST`. A framed 4-row table states the deal plainly: `COURT CHECK-IN → REQUIRES PROXIMITY MATCH`, `BROWSING COURTS → WORKS WITHOUT LOCATION`, `BACKGROUND TRACKING → NEVER`, `STORED HISTORY → CHECK-INS ONLY`. Then `GRANT LOCATION ACCESS` (solid) and a faint `SKIP — BROWSE ONLY`. Granting sets `SYS_ACTIVE`; skipping leaves `SYS_STANDBY` and `GEOFENCE: PENDING` — a browse-only state the app must support.

### O6 — New player profile (the empty state)
Same layout as the core-loop profile, populated from the form, stamped `RECORD CREATED · HH:MM TODAY`.
- ID card carries a **dashed `UNVOUCHED` mark** beside the name until another player vouches (toggleable via the `showUnvouchedMark` prop).
- STREET CRED: score `000`, `RANK: UNRANKED`, then a framed explainer — `CRED IS EARNED ON COURT` / `CHECK IN AT A COURT. RUN. GET VOUCHED BY THE PLAYERS YOU GUARDED. BADGES UNLOCK AT 3 VOUCHES EACH.` — a dashed `NO BADGES YET` row, and `PEER-VOUCHED CAPABILITIES · 0 VOUCHES`.
- LEAGUE STATS: `--` in all three columns (faint), roster row dashed: `NO LEAGUE TEAM LINKED · LINK ONE IN SETTINGS` or `<TEAM> · STATS SYNC PENDING`.
- GAME LOG: dashed `NO GAMES LOGGED · LOG A SCORE TO OPEN YOUR RECORD`.

**Empty-state rule for the whole product:** an empty section is a dashed `#6f6f6a` frame with muted label copy — never a hidden section, never an illustration, never color.

### Web layout deltas (sign-up)
- W1 / W2 / W5 use a split slate: Anton 96px statement left, the interaction in a 520px right panel behind a hairline (`flex: 0 1 520px`, `box-sizing: border-box` — it must shrink, not clip).
- W3 is a 1000px centered form: 360px portrait column beside the fields, with BORN and HEIGHT paired in one row.
- W4 is a full-bleed directory at 46px names. W6 matches the web profile grid.
- Hover states only: row/segment backgrounds to `#1a1a19`, muted text to white.

## Sign-up State & Data
Client state adds: `email`, `code`, `codeError`, `attempts`, `resendIn`, `realName`, `handle`, `handleChecking`, `dob{D,M,Y}`, `height`, `unit`, `picked[]` (positions), `homeCourtId`, `leagueTeamId`, `located`.

```ts
type Position = 'POINT GUARD' | 'SHOOTING GUARD' | 'WING' | 'FORWARD' | 'CENTER';
interface Registration {
  email: string;                                    // Clerk is the identity provider
  realName: string; handle: string;                 // handle is unique; drives the subdomain
  dateOfBirth: string;                              // ISO date
  height: { value: string; unit: 'FT' | 'CM' };
  positions: Position[];                            // one or more
  homeCourtId: string;
  portraitUrl?: string;
  leagueTeamId?: string;                            // links a roster; stats sync later
}
interface PlayerState { vouched: boolean; streetScore: number; rank: string; locationGranted: boolean; }
```
Backend implications: **auth is Clerk email OTP** — Clerk owns code delivery, attempt limiting, and lockout, and the UI must mirror its real limits (it currently promises 3 attempts and a resend reset). Store the Clerk user id against the player record; handle uniqueness check as a fast endpoint (the UI debounces at 600ms); a new player is created with `streetScore: 0`, `rank: 'UNRANKED'`, `vouched: false`, no badges, no games; league stats only ever arrive from a roster sync, never from user input; `locationGranted: false` must remain a usable browse-only state.

## Score Verification Flow (7 screens, mobile + web)

A logged score is a claim, not a fact. It becomes real when the other side confirms it, when a court vote settles it, or when 48 hours of silence pass. Prototypes: `prototypes/hoopruns-verification-mobile.html`, `prototypes/hoopruns-verification-web.html`.

**The organising rule (applies product-wide):** a **solid white** 1px frame means *this needs your call*; a **dashed `#6f6f6a`** frame means *waiting on someone else, or not there yet*. Nothing else uses the solid white frame.

### V1 — Profile queue (the entry point)
Three stacked sections above the settled log: `AWAITING YOUR CALL // 2` (white `ClaimCard`s), `COURT VOTES OPEN // 1` (dashed), `YOUR OPEN CLAIMS // 1` (dashed), then `SETTLED GAME LOG`. Header status becomes `2 WAITING` and opens the inbox; on web an `INBOX` row also sits at the top of the column (the header trigger can be clipped at narrow widths). Footnote states the stakes: `UNVERIFIED GAMES EARN NO CRED. A VERIFIED LOSS STILL COUNTS AS A GAME PLAYED.`

### V2 — Verify claim
The claimed score at 68px (mobile) / 140px (web) with a `YOU WON`/`YOU LOST` chip translating it for the viewer, over a fact table: `CLAIMED BY`, `FORMAT` (squad size), `FIXTURE`, `COURT`, `PLAYED`, `ELIGIBLE VERIFIERS`, `AUTO-VERIFIES IN` (live countdown). Two actions: `CONFIRM SCORE` (primary, white) and `DISPUTE THIS SCORE` (1px `#444` frame — the system's only secondary action treatment). There is no reject and no ignore button: **ignoring is already an option, and it verifies the claim.**

### V3 — Vouch (the design bet)
Confirming opens a capability vouch for the player you just guarded — outline chips (LOCKDOWN, SNIPER, GLUE GUY, MOTOR, HEAT CHECK, GLASS CLEANER), inverted when selected, then `SEND VOUCH` or `SKIP — SCORE STANDS EITHER WAY`. Copy: `A VOUCH IS WORTH MORE THAN A WIN. PICK ONLY WHAT YOU ACTUALLY SAW.` **Rationale:** it makes honest bookkeeping and reputation the same gesture, which is the incentive to verify rather than ghost. Toggleable via the `vouchOnConfirm` prop.

### V4 — Counter-score
Disputing requires a number — there is nothing for a vote to decide otherwise. Two score inputs whose labels adapt to squad size (`YOUR SQUAD`/`THEIR SQUAD`, or `YOU`/`@handle` in a 1V1), then `OPEN COURT VOTE`.

### V5 — Court vote
Both claims as `VoteSide` blocks with running tallies; tapping one inverts it and locks the vote. Beside/below them, the voter roll — every player checked in at that court during the run, `VOTED` or `NOT VOTED`, with the viewer's own `@YOU` row included so eligibility is never a mystery. Rules stated on screen: `MAJORITY SETTLES IT. A TIE AT CLOSE VOIDS THE GAME — NO CRED EITHER WAY.`

### V6 — Your claim (submitter side)
Your pending score in dashed treatment, its fact table, and a live countdown. `NUDGE @handle` is **one-shot** — it becomes `NUDGE SENT` and dies, so it can't become harassment. `WITHDRAW CLAIM` removes it entirely.

### V7 — Inbox
The notification surface: `SCORE CLAIM` and `COURT VOTE` rows are actionable (white kind label, tappable, deadline in `when`); `VOUCH` and `RUN ALERT` are muted history. Footnote: `NOTHING IS PUSHED AT NIGHT. RUN ALERTS ONLY FOR YOUR HOME COURT.`

### Squad size
Every claim carries `1V1` / `2V2` / `3V3 HALFCOURT` / `5V5 FULL`, captured by the new size picker on Log Game and shown on every row (`3V3 · W 21 - 15 VS @southside_five`). **A 1V1 has no captain** — labels change to `OPPONENT`, counter-score columns lose "SQUAD", and eligible verifiers read `YOU + 5 WITNESSES` instead of `6 ON COURT`.

## Verification State & Data
```ts
type ClaimStatus = 'PENDING' | 'VERIFIED' | 'DISPUTED' | 'VOID';
type SquadSize = '1V1' | '2V2' | '3V3 HALFCOURT' | '5V5 FULL';
interface ScoreClaim {
  id: string; submittedBy: string; opponentHandle: string;   // captain, or the sole opponent in a 1V1
  scoreFor: number; scoreAgainst: number;
  size: SquadSize; format: GameFormat; courtId: string; playedAt: string;
  status: ClaimStatus; autoVerifyAt: string;                 // playedAt + 48h
  verifiedBy?: string; nudgedAt?: string;
}
interface CourtVote {
  id: string; claimId: string; courtId: string; size: SquadSize; closesAt: string;
  sides: [{ who: string; score: string; votes: number }, { who: string; score: string; votes: number }];
  eligibleVoterIds: string[];                                // checked in at that court during the run
  votes: { voterId: string; side: 0 | 1 }[];
}
interface Vouch { fromId: string; toId: string; badge: string; claimId: string; }
```
Backend rules the UI promises: a claim auto-verifies at `autoVerifyAt` unless confirmed or disputed; **eligibility to verify or vote comes from a check-in record at that court during that run**, not from being named on the claim; one nudge per claim; a tied vote at close sets `VOID` and awards no cred; cred is win 6 / verified loss 2 / +1 per vouch received; unverified games award nothing. Vouches are only creatable from a confirmation, so they can't be farmed.

## Interactions & Navigation summary
- Sign-up: O1 → O2 → O3 (⇄ O4) → O5 → O6, then the core loop takes over. Returning players enter at O1 and land on their profile.
- Verification: V1 queue → V2 claim → V3 vouch (on confirm) or V4 counter → V5 court vote. V6 is the submitter's side; V7 the inbox. Header status and the inbox both route back into V2/V5.
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
- `prototypes/hoopruns-verification-mobile.html` — self-contained score-verification flow, mobile (390×844, 7 screens + legend).
- `prototypes/hoopruns-verification-web.html` — self-contained score-verification flow, web (1280×820, same 7 screens).
- `prototypes/hoopruns-signup-mobile.html` — self-contained sign-up flow, mobile (390×844, 6 screens + legend).
- `prototypes/hoopruns-signup-web.html` — self-contained sign-up flow, web (1280×820, same 6 screens).
- `prototypes/hoopruns-web-app.html` — self-contained desktop web prototype: same 4 workflows, same logic/tokens, adapted to a 1280×820 browser viewport. Layout deltas: top bar replaces bottom nav (logo left, 3-segment nav center, telemetry right, 58px tall); Radar is two-column (court directory flex + 400px bulletin rail, 1px divider); Check-in is a centered slate (court name Anton 96px, 640px slider); Profile is a 360px portrait/ID column + detail column grid; Log Game is a centered 680px form. Hover states (row bg #1a1a19, nav/tab text → white) replace mobile pressed states.
- `brand/hoopruns-brand-sheet.html` — self-contained brand sheet: logo construction, lockups, color/type rules, usage do/don'ts. The visual identity reference for all surfaces.
- `system/` — the full design system: `styles.css` + `tokens/` (colors, type, spacing, borders, motion as CSS custom properties), 32 React components in `components/` (each with a `.d.ts` and a `.prompt.md` usage rule), foundation specimen cards in `guidelines/`, and React UI kits for both products in `ui_kits/` (each with an `index.html` core-loop flow, a `signup.html` sign-up flow, and a `verify.html` score-verification flow; `ui_kits/signupData.jsx` and `ui_kits/verifyData.jsx` hold the `useSignupForm()` and `useVerifyQueue()` state machines both platforms share). `system/readme.md` is the written system — authentication stance, content voice, visual foundations, iconography position. `system/SKILL.md` makes the folder loadable as an Agent Skill so Claude Code can design new screens on-brand.
- `assets/` — brand asset pack.
- This README.

Suggested repo placement: commit this folder as `design/` at the repo root. Keep the folder intact — `system/` resolves images out of the sibling `assets/` folder.
