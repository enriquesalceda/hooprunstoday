For choices too big for a chip row. Keeps a form as one stack of identical framed rows.

```jsx
<PickerRow label="HOME COURT" value={court?.name} glyph="→" onClick={openCourtPicker} />

<PickerRow label="LEAGUE TEAM" value={team?.name} placeholder="OPTIONAL"
  glyph={open ? '↑' : '↓'} onClick={() => setOpen(!open)} />
{open && <PickerList options={rosters} value={teamId} onChange={pick} />}
```

Say `OPTIONAL` in the placeholder when a field really is optional — the hint line below the form lists only what's actually required.
