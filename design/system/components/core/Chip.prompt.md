A status, attribute, or multi-select mark.

```jsx
<Chip variant="solid">● LIVE</Chip>
<Chip variant="outline">LOCKDOWN</Chip>
<Chip variant="frame">OUTDOOR</Chip>
<Chip variant="pending">UNVOUCHED</Chip>
<Chip variant="outline" selected={picked} onClick={toggle}>POINT GUARD</Chip>
```

- `solid` is reserved for right-now activity on a court row. Include the `●`.
- `outline` chips wrap in an 8px-gap row — as read-only badges, or with `selected`/`onClick` as a multi-select (sign-up positions).
- `pending` is the dashed mark for unverified state: `UNVOUCHED` beside a new player's name.
- Never color a chip. State is fill, border style, or nothing.
