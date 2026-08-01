import React from 'react';

/* One claim in a court vote, with its tally. Selecting a side inverts it whole — the same
   selection-is-inversion rule as every other control. */
export function VoteSide({ who, score, tally, selected = false, locked = false, platform = 'mobile', onClick, style }) {
  const web = platform === 'web';
  return (
    <div
      onClick={locked ? undefined : onClick}
      style={{
        border: '1px solid ' + (selected ? 'var(--paper-000)' : (locked ? 'var(--line-hairline)' : 'var(--line-interactive)')),
        padding: web ? '18px 16px' : '14px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: web ? 16 : 12,
        cursor: locked ? 'default' : 'pointer',
        background: selected ? 'var(--selected-bg)' : 'transparent',
        ...style,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: web ? 6 : 5, minWidth: 0 }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: web ? 'var(--mono-4)' : 'var(--mono-2)',
          letterSpacing: 'var(--track-label)',
          color: selected ? 'var(--selected-ink)' : 'var(--text-faint)',
        }}>{who}</span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: web ? 'var(--display-5)' : 'var(--display-3)',
          lineHeight: 0.9,
          color: selected ? 'var(--selected-ink)' : 'var(--text-primary)',
        }}>{score}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flex: 'none' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: web ? 'var(--display-4)' : 'var(--display-2)',
          lineHeight: 0.9,
          color: selected ? 'var(--selected-ink)' : 'var(--text-primary)',
        }}>{tally}</span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 500,
          fontSize: web ? 'var(--mono-2)' : 'var(--mono-1)',
          color: selected ? 'var(--selected-ink)' : 'var(--text-faint)',
        }}>{tally === 1 ? 'VOTE' : 'VOTES'}</span>
      </div>
    </div>
  );
}
