Check-in must feel like throwing a switch, not tapping a button — that friction is the point, because it asserts the player is physically at the court.

```jsx
<SlideToEngage width="var(--slider-track-web)" onEngage={() => {
  setFlash(true);
  setTimeout(() => { setFlash(false); checkIn(courtId); goRadar(); }, 750);
}} />
```

- While dragging, the label becomes `ENGAGING // 63%` in white and the handle has **no** transition.
- Never add a plain "Check in" button as a shortcut.
- Pair with the `PROXIMITY_VERIFIED: TRUE · GEOFENCE MATCH <HOOD>` caption above it.
