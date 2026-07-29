# Brand sheet — logo, lockups, and rules

Authoritative usage rules live in `assets/README.txt`. This file records the construction values so a designer can rebuild a lockup at any size.

## Construction — stacked lockup (primary)

- Type: **Anton 400**, all caps, letter-spacing **+1px**
- Two lines, `HOOP` / `RUNS`, line-height **0.84**, zero gap
- The `.TODAY` bar spans the full width of the stack, sits **12px** below it at 94px type (scale proportionally)
- Bar type: **Helvetica Bold** (fallback Arial Bold), tracking **+0.4em**, all caps, always reversed out of the bar
- Bar padding at 94px stack: `8px 0 8px 6px` — the left padding compensates for the trailing letter-space

## One-line lockup (secondary)

`HOOPRUNS` in Anton at line-height 1, followed by an 8px gap and the `.TODAY` bar at ~1/3 the wordmark size, tracking +0.35em, padding `4.5px 3px 4.5px 8px`. Used in app headers, banners, print footers.

## Sizes and clear space

- Clear space on all sides = the height of the `.TODAY` bar
- Stacked lockup minimum height **64px**; one-line minimum height **24px**
- `.TODAY` appears only at **≥120px** icon size — below that use the clean stack
- Favicon is the single `H` glyph

## Surfaces

Ink `#111111` on paper `#ffffff` (or white reversed on `#0d0d0c`). Black and white only — no color fills, no gradients, no effects, no outline versions, no shadows. Never stretch, skew, or retype the spacing: use the files in `assets/`.

## Files

See `assets/README.txt` for the full manifest — PNG lockups (stacked/one-line × black/white), app icons, favicon, true-outline SVGs in `assets/vector/`, and web app icons + `site.webmanifest` in `assets/webapp/`.
