Mobile-only. Pinned to the bottom of the app shell, outside the scrolling area.

```jsx
<BottomNav
  value={screen}
  onChange={setScreen}
  options={[{ value: 'radar', label: 'RADAR' }, { value: 'log', label: 'LOG GAME' }, { value: 'you', label: 'YOU' }]}
/>
```

Three segments is the design. On web the same three destinations move into `AppHeader` as a centered `SegmentedControl`.
