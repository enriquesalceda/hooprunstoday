Any either/or choice in the product. Selected segment inverts to a white fill — that is the only selection affordance the system has.

```jsx
<SegmentedControl
  value={tab}
  onChange={setTab}
  options={[{ value: 'street', label: '[ STREET CRED ]' }, { value: 'league', label: '[ LEAGUE STATS ]' }]}
/>
```

- Wrap tab labels in `[ ]` brackets; leave nav and picker labels bare.
- `frame="top"` + `padY={15}` is the mobile bottom nav; `BottomNav` wraps that for you.
- Long labels (`OFFICIAL LEAGUE FIXTURE`) need `tracking="var(--track-label)"`.
