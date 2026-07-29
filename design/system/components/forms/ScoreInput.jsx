import React from 'react';

/* Digits only, up to 3, set in Anton at the largest size a form ever uses. */
export function ScoreInput({ label, value = '', onChange, platform = 'mobile', style }) {
  const web = platform === 'web';
  return (
    <div style={{ border: 'var(--border-interactive)', display: 'flex', flexDirection: 'column', ...style }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: web ? 'var(--mono-2)' : 'var(--mono-1)',
        color: 'var(--text-secondary)',
        padding: web ? '9px 12px' : '8px 10px',
        borderBottom: 'var(--border-hairline)',
      }}>{label}</span>
      <input
        type="tel"
        inputMode="numeric"
        maxLength={3}
        placeholder="00"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value.replace(/[^0-9]/g, ''))}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text-primary)',
          caretColor: 'var(--text-primary)',
          fontFamily: 'var(--font-display)',
          fontSize: web ? 'var(--display-6)' : 'var(--display-5)',
          textAlign: 'center',
          padding: web ? '12px 0 16px' : '8px 0 12px',
        }}
      />
    </div>
  );
}
