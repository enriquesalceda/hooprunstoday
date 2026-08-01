# UI kit — web app

Click-through recreation of the browser product at **1280 × 820**. Recreated from `Hoopruns Web App.dc.html`. Same logic, same tokens, same components as the mobile kit — only the layout differs.

## Layout deltas vs mobile

- **Chrome:** a 58px top bar replaces the bottom nav — one-line logo left, the three-segment nav centered, telemetry right.
- **Radar:** two columns — flexible court directory + a fixed 400px `THE BLACKTOP BULLETIN` rail, divided by a hairline.
- **Check-in:** centered slate; court name at 96px, slider fixed at 640px.
- **Profile:** 360px portrait/ID column beside a detail column; portrait 400px tall; street score at 120px.
- **Log game:** centered 680px form; score inputs at 76px.
- **Hover:** rows lift to `--hover-bg`, muted text goes white. Nothing moves, nothing changes color.

## Screens

| File | Screen |
| --- | --- |
| `WebRadar.jsx` | Directory + bulletin rail |
| `WebCheckIn.jsx` | Court slate + 640px beacon slider |
| `WebProfile.jsx` | Portrait column + tabs + game log |
| `WebLogGame.jsx` | Centered score transaction form |
| `WebApp.jsx` | Shell, nav, and state |

Open `index.html` and run the same flow as the mobile kit — check in at a court, then log a game.

## Sign-up flow (`signup.html`)

`WebSignUpFlow.jsx` mounts the same six steps against the same `useSignupForm()` hook as the mobile kit; only layout differs.

- `WebSignUpIdentity` (email address, Clerk email OTP), `WebSignUpCode`, `WebSignUpGeofence` use the split slate: Anton 96px statement left, the interaction in a right panel. That panel is `flex: 0 1 520px` with `box-sizing: border-box` and `min-width: 0` on both sides — it must shrink rather than clip when the frame is narrow.
- `WebSignUpRecord` is a 1000px form with the 400px portrait column beside the fields; BORN and HEIGHT share a row.
- `WebSignUpHomeCourt` is a full-bleed directory at 46px names, selected row inverted.
- `WebNewProfile` matches the web profile grid. Header nav appears only once the record exists.

## Score verification (`verify.html`)

`WebVerifyFlow.jsx` mounts the same seven screens against the same `useVerifyQueue()` hook as the mobile kit.

- `WebVerifyQueue` splits queues (main column) from the settled log (400px rail), like Radar. An `INBOX` row sits at the top of the column as a second entry point, because the header trigger can be clipped at narrow frame widths.
- `WebVerifyClaim`, `WebVouch`, `WebYourClaim` use the split slate — the number at `--display-9` on the left, facts and actions in a `flex: 0 1 520px` panel.
- `WebCourtVote` puts the two `VoteSide` blocks in the main column and the voter roll in a 360px rail.
- `WebCounterScore` is a 680px centered form; `WebInbox` is an 820px list with the kind label in a fixed 96px gutter.
