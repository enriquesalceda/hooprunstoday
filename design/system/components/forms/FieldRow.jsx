import React from 'react';

/* Text field as a single framed row: mono label cell, then the value. */
export function FieldRow({ label, value = '', onChange, placeholder, platform = 'mobile', style }) {
  const web = platform === 'web';
  return (
    <div style={{ border: 'var(--border-interactive)', display: 'flex', alignItems: 'center', ...style }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: web ? 'var(--mono-2)' : 'var(--mono-1)',
        color: 'var(--text-secondary)',
        padding: '0 12px',
        alignSelf: 'stretch',
        display: 'flex',
        alignItems: 'center',
        borderRight: 'var(--border-hairline)',
        whiteSpace: 'nowrap',
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
          padding: web ? '16px 14px' : '14px 12px',
        }}
      />
    </div>
  );
}
