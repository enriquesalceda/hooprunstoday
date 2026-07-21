HOOPRUNS.TODAY — LOGO ASSET PACK
=================================

COLORS
  Ink:   #111111
  Paper: #FFFFFF
  Black & white only. No color fills, no gradients, no effects.

TYPE
  Wordmark:  Anton Regular (Google Fonts, free) — https://fonts.google.com/specimen/Anton
  .TODAY bar: Helvetica Bold (fallback: Arial Bold), tracking +0.4em, all caps

CONSTRUCTION (master stacked lockup)
  - Tight natural letter spacing (+1px); the .TODAY bar spans the full stack width
  - Line height 0.84, zero gap between lines
  - Bar text is always reversed out of the bar (white-on-black or black-on-white)

FILES
  icon-1024.png                 App store icon (with .TODAY). Square; platforms apply their own corner mask.
  icon-1024-clean.png           Home screen + social avatar. No .TODAY — circle-crop safe.
  favicon-64.png                Favicon base (H). Downscale to 32/16.
  wordmark-stacked-black.png    Primary lockup, ink on transparent — for light backgrounds.
  wordmark-stacked-white.png    Primary lockup, white on transparent — for dark backgrounds.
  wordmark-oneline-black.png    Secondary one-line lockup — app headers, banners, print.
  wordmark-oneline-white.png    Same, for dark backgrounds.

USAGE RULES
  - .TODAY appears only at >= 120px icon size; smaller icons use the clean stack
  - One-line lockup minimum height: 24px. Stacked lockup minimum height: 64px
  - Clear space around lockups: the bar height on all sides
  - Never stretch, skew, outline, add shadows, or retype the spacing — use these files
  - For print / true vector: set the type in Anton, letters justified to a fixed width,
    then convert to outlines in Figma or Illustrator using the construction values above

hoopruns.today

VECTOR (assets/vector/)
  True-outline SVGs — infinitely scalable, print-ready, no fonts needed.
  Anton glyphs are exact outlines. The .TODAY bar uses DejaVu Sans Bold
  outlines (closest free match — Helvetica itself cannot be embedded freely).
  stacked / oneline in black + white · icon (with .TODAY) · icon-clean · favicon

WEBAPP (assets/webapp/)
  favicon.svg · favicon-32.png · apple-touch-icon.png (180) · icon-192.png ·
  icon-512.png · site.webmanifest · head-snippet.html (paste into <head>)
