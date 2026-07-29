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

## Notes

- Portraits are placeholder wells (`--surface-well` + `grayscale(1) contrast(1.08)`); real photos are still needed.
- The bottom nav is the only navigation — there is no drawer, no gesture back, no modal.
- Every screen scrolls its content only; header and nav are fixed outside the scroll area.
