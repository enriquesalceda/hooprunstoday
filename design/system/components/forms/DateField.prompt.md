Date of birth at sign-up. Three cells, not a picker — typing six or eight digits is faster than spinning wheels.

```jsx
<DateField day={d} month={m} year={y} onChange={(part, v) => setDob({ ...dob, [part]: v })} />
```

Placeholders stay `DD` / `MM` / `YYYY`. Validate on completeness in the form's hint line, not with inline error styling.
