The Radar directory is nothing but a stack of these. Tapping one goes to that court's check-in screen.

```jsx
<CourtRow name="PRINCE ALFRED PARK" distanceKm="0.4" onCourtCount={14}
  nextRun="3V3 HALFCOURT" live youAreHere subdomain="prince-alfred-park.hoopruns.today"
  platform="web" onClick={() => openCourt('c1')} />
```

- Rows are full-bleed and separated by their own bottom hairline — never wrap them in a card or add gaps.
- `platform="web"` scales the name to 46px and widens the metadata row.
- Increment `onCourtCount` yourself when `youAreHere` — the player counts.
