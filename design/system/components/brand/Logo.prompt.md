Renders the Hoopruns.today lockup in type — use it for app chrome and screens; use the files in `assets/` for print, favicons, and app icons.

```jsx
<Logo variant="oneline" tone="paper" size={20} />
```

- `variant="stacked"` is the primary lockup (HOOP / RUNS over a full-width `.TODAY` bar); `"oneline"` is the secondary, used in every app header.
- `tone="ink"` on paper/print surfaces, `tone="paper"` on the blacktop UI.
- Drop the bar (`showBar={false}`) below 120px in icon contexts. Never stretch, skew, or add effects.
