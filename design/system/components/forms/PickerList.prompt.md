An inline list that expands in the flow — never a modal, never a native `<select>`.

```jsx
<PickerRow label="LEAGUE TEAM" value={team?.name} placeholder="OPTIONAL"
  glyph={open ? '↑' : '↓'} onClick={() => setOpen(!open)} />
{open && <PickerList options={rosters} value={teamId} onChange={pick} maxHeight={180} />}
```

The selected row inverts whole. Collapse it as soon as a choice is made. Keep the option count small enough to scan — if it needs search, the choice belongs on its own screen (see the home-court picker).
