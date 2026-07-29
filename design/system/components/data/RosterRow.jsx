import React from 'react';

export function RosterRow({ name, meta, style }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: 'var(--space-3)',
      padding: '10px 0',
      borderBottom: 'var(--border-faint)',
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: 'var(--mono-5)',
      ...style,
    }}>
      <span style={{ color: 'var(--text-primary)' }}>{name}</span>
      <span style={{ color: 'var(--text-faint)', flex: 'none' }}>{meta}</span>
    </div>
  );
}
