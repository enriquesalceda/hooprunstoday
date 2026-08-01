Verification code entry for the **Clerk email OTP** (6 digits). One transparent input covers all the cells, so paste works and there is only ever one caret.

```jsx
<CodeInput value={code} onChange={submitWhenFull} state={locked ? 'locked' : (rejected ? 'error' : 'default')} />
```

- Verify automatically at full length (~260ms after the last digit) — no submit button.
- Pair with a hint line below: `6 DIGITS · PASTE OR TYPE` → `VERIFYING…` → `CODE REJECTED · 2 ATTEMPTS LEFT` (singular at 1) → `TOO MANY ATTEMPTS · REQUEST A NEW CODE`.
- If you promise a lockout, enforce it: `state="locked"` disables entry, and only a resend clears it. Clerk enforces its own attempt and rate limits — mirror them here rather than inventing softer ones.
- Caption the screen with the masked address, never the full one: `SENT TO j•••••@gmail.com · EXPIRES IN 10:00`.
