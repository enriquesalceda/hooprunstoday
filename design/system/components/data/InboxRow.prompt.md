The inbox is a queue of obligations, not a feed. Sort by what's owed, and mute anything that's merely news.

```jsx
<InboxRow kind="SCORE CLAIM" when="41:12 LEFT" actionable onClick={openClaim}
  text="@jordan_buckets logged a 3V3 HALFCOURT 21 - 15 against you at Prince Alfred Park." />

<InboxRow kind="VOUCH" when="2H AGO"
  text="@rim_run_kev vouched you for LOCKDOWN. That is 61 vouches." />
```

- `actionable` items come first and are the only tappable ones.
- Deadlines in `when` count down; history reads `2H AGO`.
- Body copy is sentence case — it's the app talking about people, not reporting state.
