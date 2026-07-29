import React from 'react';

/* League box score. Framed grid, internal 1px column dividers, Anton numbers over mono labels. */
export function StatGrid({ stats = [], platform = 'mobile', style }) {
  const web = platform === 'web';
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${stats.length || 1}, 1fr)`,
      border: 'var(--border-hairline)',
      ...style,
    }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{
          padding: web ? '20px 0 16px' : '16px 0 12px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          borderLeft: i === 0 ? 'none' : 'var(--border-hairline)',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: web ? 'var(--display-4)' : 'var(--display-2)',
            lineHeight: 1,
            color: 'var(--text-primary)',
          }}>{s.value}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)' }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
