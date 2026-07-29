import React from 'react';

/* Three chips, three jobs: solid = live/now, outline = peer-vouched badge, frame = static attribute. */
export function Chip({ children, variant = 'outline', style }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    borderRadius: 'var(--radius-none)',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
  };
  const variants = {
    solid: {
      background: 'var(--selected-bg)',
      color: 'var(--selected-ink)',
      fontWeight: 700,
      fontSize: 'var(--mono-2)',
      padding: '4px 8px',
    },
    outline: {
      border: 'var(--border-chip)',
      color: 'var(--text-body)',
      fontWeight: 700,
      fontSize: 'var(--mono-4)',
      letterSpacing: 'var(--track-label)',
      padding: '9px 12px',
    },
    frame: {
      border: 'var(--border-interactive)',
      color: 'var(--text-secondary)',
      fontWeight: 500,
      fontSize: 'var(--mono-3)',
      padding: '2px 8px',
    },
  };
  return <span style={{ ...base, ...variants[variant], ...style }}>{children}</span>;
}
