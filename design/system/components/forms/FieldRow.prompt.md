The system's only text input. Label inside the frame — no floating labels, no placeholder-as-label.

```jsx
<FieldRow label="OPP CAPTAIN" placeholder="@handle" value={handle} onChange={setHandle} />

<FieldRow label="HEIGHT" value={h} onChange={setH} placeholder="6'2&quot;"
  trailing={<UnitToggle value={unit} onChange={setUnit} options={['FT', 'CM']} />} />
```

Validation is a mono hint line below the field, never a red border: `ENTER BOTH SCORES + OPPOSING CAPTAIN HANDLE`. Pair with a status line for live checks (see `HandleField` usage in the sign-up kit).
