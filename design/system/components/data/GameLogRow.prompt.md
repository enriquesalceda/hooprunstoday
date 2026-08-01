Stacked under a profile tab, newest first — and reused for anything waiting on someone else.

```jsx
<GameLogRow label="3V3 · W 21 - 15 VS @southside_five" meta="VERIFIED · STREET · JUL 12" />
<GameLogRow label="1V1 · W 11 - 8 VS @wolves_d2" meta="PENDING · 33:20 LEFT" pending onClick={openClaim} />
<GameLogRow pending sublabel="21 - 19 VS 19 - 21 · CLOSES IN 1H 30M"
  label="YOUR VOTE IS NEEDED" meta="PRINCE ALFRED PARK" onClick={openVote} />
```

Never use color for pending — the dashed `#6f6f6a` border is the signal. A freshly transmitted score is always pending; a claim someone owes *you* an answer on uses `ClaimCard` instead.
