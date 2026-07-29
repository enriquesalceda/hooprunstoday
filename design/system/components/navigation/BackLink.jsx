import React from 'react';

export function BackLink({ label = 'RADAR', onClick, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <span
      role="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: 'var(--mono-4)',
        color: hover ? 'var(--hover-ink)' : 'var(--text-secondary)',
        cursor: 'pointer',
        userSelect: 'none',
        textTransform: 'uppercase',
        ...style,
      }}>← {label}</span>
  );
}
