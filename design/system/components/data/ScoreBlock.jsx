import React from 'react';

/* The street score. Biggest type in the product, with its labels tucked into the baseline. */
export function ScoreBlock({ value, label = 'STREET SCORE', rank, platform = 'mobile', style }) {
  const web = platform === 'web';
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: web ? 'var(--space-8)' : 'var(--space-5)', ...style }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: web ? 'var(--display-8)' : 'var(--display-7)',
        lineHeight: 'var(--lh-display-tight)',
        color: 'var(--text-primary)',
      }}>{value}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', paddingBottom: web ? 8 : 6 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)' }}>{label}</span>
        {rank && <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: web ? 'var(--mono-7)' : 'var(--mono-6)', color: 'var(--text-primary)' }}>RANK: {rank}</span>}
      </div>
    </div>
  );
}
