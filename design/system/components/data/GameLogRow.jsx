import React from 'react';

/* Border style carries the data: solid = verified by the opponent, dashed = still pending. */
export function GameLogRow({ label, meta, pending = false, style }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-3)',
      padding: '12px',
      border: pending ? 'var(--border-pending)' : 'var(--border-hairline)',
      ...style,
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: 'var(--mono-5)',
        color: pending ? 'var(--pending-ink)' : 'var(--text-primary)',
      }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)', flex: 'none' }}>{meta}</span>
    </div>
  );
}
