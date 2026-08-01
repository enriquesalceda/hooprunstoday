import React from 'react';

/* Border style carries the data: solid = settled, dashed = waiting on someone.
   With `sublabel` it stacks into a two-line queue row (open claims, court votes). */
export function GameLogRow({ label, meta, sublabel, pending = false, platform = 'mobile', onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const web = platform === 'web';
  const stacked = !!sublabel;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: stacked ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: web ? 16 : 8,
        padding: web ? 14 : 12,
        border: pending ? 'var(--border-pending)' : 'var(--border-hairline)',
        cursor: onClick ? 'pointer' : 'default',
        background: hover && web && onClick ? 'var(--hover-bg)' : 'transparent',
        ...style,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: web ? 'var(--mono-6)' : 'var(--mono-5)',
          color: pending ? 'var(--pending-ink)' : 'var(--text-primary)',
        }}>{label}</span>
        {stacked && (
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: web ? 'var(--mono-2)' : 'var(--mono-1)', color: 'var(--text-faint)' }}>{sublabel}</span>
        )}
      </div>
      {meta && (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: web ? 'var(--mono-2)' : 'var(--mono-1)', color: 'var(--text-faint)', flex: 'none' }}>{meta}</span>
      )}
    </div>
  );
}
