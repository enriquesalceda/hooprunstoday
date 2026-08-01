import React from 'react';

/* Text field as a single framed row: mono label cell, value, optional trailing control
   (a unit toggle, a glyph) inside the same 1px frame. */
export function FieldRow({ label, value = '', onChange, placeholder, trailing, platform = 'mobile', style }) {
  const web = platform === 'web';
  return (
    <div style={{ border: 'var(--border-interactive)', display: 'flex', alignItems: 'stretch', ...style }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: web ? 'var(--mono-2)' : 'var(--mono-1)',
        color: 'var(--text-secondary)',
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        borderRight: 'var(--border-hairline)',
        whiteSpace: 'nowrap',
        flex: 'none',
      }}>{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{
          flex: 1,
          minWidth: 0,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text-primary)',
          caretColor: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: web ? 'var(--mono-9)' : 'var(--mono-8)',
          padding: web ? '18px 14px' : '14px 12px',
        }}
      />
      {trailing}
    </div>
  );
}
