The one primary action on a screen — pinned to the bottom edge, full width, label written as a verb of transmission.

```jsx
<Button disabled={!ready} onClick={submit}>TRANSMIT SCORE DATA</Button>
```

- There is no secondary or ghost variant. If a screen needs two actions, one of them is a `SegmentedControl` or a `BackLink`.
- Copy is UPPERCASE and imperative: `TRANSMIT SCORE DATA`, not "Submit".
