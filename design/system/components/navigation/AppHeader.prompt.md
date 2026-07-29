The persistent top chrome. Always shows where the user is geofenced and whether the session is live.

```jsx
<AppHeader platform="web" geofence="NEWTOWN, SYD" status="SYS_ACTIVE" clock={clock} onLogoClick={goRadar}>
  <SegmentedControl value={screen} onChange={setScreen} options={navOptions} />
</AppHeader>
```

- `status` becomes `IN_GAME @ <COURT>` while the player is checked in — the header is how you know.
- Mobile takes no `children`; navigation lives in `BottomNav` instead.
