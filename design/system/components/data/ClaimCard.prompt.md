The one card in the product with a solid white border — that border means **this needs your call**. Dashed frames mean you're waiting on someone else. Don't break that pairing.

```jsx
<ClaimCard by="@jordan_buckets" score="21 - 15" verdict="YOU LOST"
  meta="3V3 HALFCOURT · PRINCE ALFRED PARK · AUTO-VERIFIES IN 41:12"
  action="REVIEW →" platform="web" onClick={openClaim} />
```

- Score is always stated from the **claimant's** side; `verdict` translates it for the viewer.
- Always include the countdown in `meta` — silence is a decision here (it auto-verifies), so the deadline is the most important fact on the card.
- Use `GameLogRow pending` for anything waiting on someone else instead.
