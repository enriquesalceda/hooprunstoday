Pass it to `FieldRow`'s `trailing` slot — it renders bare segments meant to sit inside that frame, so don't wrap it in a border of its own.

```jsx
<FieldRow label="HEIGHT" value={h} onChange={setH}
  trailing={<UnitToggle options={['FT', 'CM']} value={unit} onChange={setUnit} />} />
```

Change the field's placeholder with the unit (`6'2"` vs `188`) so the expected format is never ambiguous.
