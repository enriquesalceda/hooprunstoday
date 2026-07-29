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
