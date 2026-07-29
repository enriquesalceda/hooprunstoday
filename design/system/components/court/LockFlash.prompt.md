The single loud moment in the system. Hold it for exactly `var(--dur-flash)` (750ms), then cut to Radar.

```jsx
<LockFlash visible={flash} size="var(--display-7)" />
```

Its parent must be `position: relative` so the flash fills the app frame and not the whole browser window. Do not reuse it for any other confirmation.
