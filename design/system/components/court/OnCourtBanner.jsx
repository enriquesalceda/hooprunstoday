import React from 'react';

/* Inverted confirmation strip inside the court row you're checked into. Points, doesn't speak. */
export function OnCourtBanner({ subdomain, inset = false, style }) {
  return (
    <div style={{
      background: 'var(--selected-bg)',
      color: 'var(--selected-ink)',
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      fontSize: inset ? 'var(--mono-2)' : 'var(--mono-4)',
      letterSpacing: 'var(--track-nav)',
      padding: inset ? '6px 8px' : '8px 10px',
      alignSelf: inset ? 'stretch' : 'flex-start',
      ...style,
    }}>▶ YOU ARE ON THIS COURT — {subdomain}</div>
  );
}
