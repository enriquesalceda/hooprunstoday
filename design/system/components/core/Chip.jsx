import React from 'react';

/* Four chips, four jobs: solid = live/now, outline = peer-vouched badge, frame = static
   attribute, pending = dashed, unverified. `selected` inverts an outline chip for
   multi-select (positions at sign-up) — same inversion as every other selected state. */
export function Chip({ children, variant = 'outline', selected = false, onClick, style }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    borderRadius: 'var(--radius-none)',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
    cursor: onClick ? 'pointer' : 'default',
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
      background: selected ? 'var(--selected-bg)' : 'var(--unselected-bg)',
      color: selected ? 'var(--selected-ink)' : 'var(--text-body)',
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
    pending: {
      border: 'var(--border-pending)',
      color: 'var(--pending-ink)',
      fontWeight: 700,
      fontSize: 'var(--mono-1)',
      letterSpacing: 'var(--track-label)',
      padding: '4px 7px',
    },
  };
  return <span onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>{children}</span>;
}
