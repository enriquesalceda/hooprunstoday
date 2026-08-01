import React from 'react';

/* Framed term → value rows. The product's way of explaining itself: a spec sheet, not
   a paragraph of reassurance. */
export function FactTable({ rows = [], platform = 'mobile', style }) {
  const web = platform === 'web';
  return (
    <div style={{ border: 'var(--border-hairline)', display: 'flex', flexDirection: 'column', ...style }}>
      {rows.map((r, i) => (
        <div key={r.term} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: web ? '16px 14px' : '14px 12px',
          borderBottom: i === rows.length - 1 ? 'none' : 'var(--border-faint)',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: web ? 'var(--mono-5)' : 'var(--mono-4)', color: 'var(--text-primary)' }}>{r.term}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: web ? 'var(--mono-3)' : 'var(--mono-2)', color: 'var(--text-secondary)', textAlign: 'right' }}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}
