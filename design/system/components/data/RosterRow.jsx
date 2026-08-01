import React from 'react';

/* Hairline-divided name → meta list. `muted` dims the name for anyone who hasn't acted
   yet (a voter roll), so the list reads as a checklist rather than a roster. */
export function RosterRow({ name, meta, muted = false, platform = 'mobile', style }) {
  const web = platform === 'web';
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: 'var(--space-3)',
      padding: web ? '13px 0' : '10px 0',
      borderBottom: 'var(--border-faint)',
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: web ? 'var(--mono-6)' : 'var(--mono-5)',
      ...style,
    }}>
      <span style={{ color: muted ? 'var(--text-muted)' : 'var(--text-primary)', fontWeight: 700 }}>{name}</span>
      <span style={{ color: 'var(--text-faint)', flex: 'none', fontWeight: 500, fontSize: web ? 'var(--mono-2)' : 'var(--mono-1)' }}>{meta}</span>
    </div>
  );
}
