The system's only text input. Label sits inside the frame, never above it — no floating labels, no placeholder-as-label.

```jsx
<FieldRow label="OPP CAPTAIN" placeholder="@handle" value={handle} onChange={setHandle} />
```

Validation is a mono hint line below the field, not a red border: `ENTER BOTH SCORES + OPPOSING CAPTAIN HANDLE`.
