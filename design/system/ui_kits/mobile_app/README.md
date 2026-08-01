# UI kit — mobile app (React Native / Expo target)

Click-through recreation of the four-screen core loop at **390 × 844**. Recreated from `Hoopruns Core Loop.dc.html`; every value is lifted from that source.

## Screens

| File | Screen | What it does |
| --- | --- | --- |
| `MobileRadar.jsx` | Radar (home) | Court directory + bulletin feed. Tap a court → check-in. Tap an `@handle` → that player's profile. |
| `MobileCheckIn.jsx` | Court check-in | Court identity + pinned `SlideToEngage`. Drag past 97% → white `LOCKED.` flash → back to Radar, now checked in. |
| `MobileProfile.jsx` | Player profile | Portrait, ID card, `[ STREET CRED ] / [ LEAGUE STATS ]` tabs, game log. |
| `MobileLogGame.jsx` | Log game | Format picker, two score inputs, opponent captain, `TRANSMIT SCORE DATA`. Writes a PENDING row and lands on your profile. |
| `MobileApp.jsx` | Shell | Header + screen + bottom nav + lock flash, and all the state. |

## Try it

Open `index.html`. Tap **PRINCE ALFRED PARK**, drag the slider to the right and release — the flash fires, the header switches to `IN_GAME @ PRINCE`, and the court row gains its on-court banner and +1 player. Then **LOG GAME** → enter 21 / 15 → `@wolves_d2` → transmit, and the new game appears as a dashed PENDING row on your profile.

## Sign-up flow (`signup.html`)

Six steps, mounted by `MobileSignUpFlow.jsx`: `MobileSignUpIdentity` (email address) → `MobileSignUpCode` (6 cells, rejection + lockout) → `MobileSignUpRecord` (one-screen registration) ⇄ `MobileSignUpHomeCourt` (court picker) → `MobileSignUpGeofence` (permission gate) → `MobileNewProfile` (the empty profile).

All state lives in `useSignupForm()` from `../signupData.jsx`, so these screens are presentational — the web kit mounts the identical hook. Auth is a Clerk email OTP. Demo hints: any 6-digit code passes except `000000`; handles `jordan`, `admin`, `test` read as TAKEN.

Chrome rule: no bottom nav until the record exists. The header runs `GEOFENCE: PENDING` / `SYS_STANDBY` until location is granted.

## Score verification (`verify.html`)

Seven screens, mounted by `MobileVerifyFlow.jsx`: `MobileVerifyQueue` (the profile queue) → `MobileVerifyClaim` (confirm or dispute) → `MobileVouch` (confirming unlocks a vouch) or `MobileCounterScore` → `MobileCourtVote` (players on court break the tie) · plus `MobileYourClaim` (nudge once, or withdraw) and `MobileInbox`.

State lives in `useVerifyQueue()` from `../verifyData.jsx`. Rules encoded there: a claim auto-verifies after 48 hours of silence, any player checked in at that court may verify, a 1V1 has no captain (labels and copy change), a tied vote voids the game, and cred is win 6 / verified loss 2 / +1 per vouch sent.

Try it: confirm `@jordan_buckets`' claim, vouch LOCKDOWN, and watch the street score move 875 → 878 with the game landing in the settled log.

## Notes

- Portraits are placeholder wells (`--surface-well` + `grayscale(1) contrast(1.08)`); real photos are still needed.
- The bottom nav is the only navigation — there is no drawer, no gesture back, no modal.
- Every screen scrolls its content only; header and nav are fixed outside the scroll area.
