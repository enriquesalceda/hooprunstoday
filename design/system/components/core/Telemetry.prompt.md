The machine-voice cluster in an app header. Compose all three fields on web; mobile splits status into the top row and geofence/clock into a second line.

```jsx
<Telemetry geofence="NEWTOWN, SYD" status="SYS_ACTIVE" clock="18:42:07 LOCAL" />
```

Keep every item `white-space: nowrap` — the clock changes width as it ticks and must not reflow the header.
