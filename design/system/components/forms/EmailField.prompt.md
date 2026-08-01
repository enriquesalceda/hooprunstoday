Sign-in and sign-up share this one field — same email, same record. Verification is a **Clerk email OTP**; there is no phone number, no password, and no country picker anywhere in this product.

```jsx
<EmailField value={email} onChange={setEmail} />
<span>{valid ? 'READY · ONE-TIME CODE, NO PASSWORD TO FORGET'
             : 'YOUR EMAIL NEVER APPEARS ON YOUR PROFILE.'}</span>
```

- Validate with a plain `/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i` and enable the button on that — don't block typing.
- Never show the full address again after this screen: `CodeInput`'s caption uses `maskEmail()` (`j•••••@gmail.com`), which keeps the domain visible so a typo is still catchable.
- Placeholder is `you@court.com` — in voice, and obviously an example.
