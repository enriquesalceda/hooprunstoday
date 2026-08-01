Court votes are how a disputed score gets settled — players who were on court pick the number they saw.

```jsx
{sides.map((s) => (
  <VoteSide key={s.key} who={s.who} score={s.score} tally={s.tally}
    selected={myVote === s.key} locked={!!myVote} onClick={() => vote(s.key)} />
))}
```

- Always exactly two sides, stacked with a 10–12px gap. Never three.
- Once the viewer has voted, set `locked` on both — a vote is final.
- Pair with a `RosterRow muted` voter roll so eligibility is visible, and state the tie rule nearby: a tie at close voids the game.
