import React from 'react';

/* Email entry — the single identity field for sign-in and sign-up. No phone number exists
   in this product: verification is a Clerk email OTP. */
export function EmailField({ label = 'EMAIL', value = '', onChange, placeholder = 'you@court.com', platform = 'mobile', style }) {
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
        type="email"
        inputMode="email"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value.replace(/\s/g, ''))}
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
          padding: web ? '18px 14px' : '16px 12px',
        }}
      />
    </div>
  );
}

/* Mask for the code screen: keep the first character and the whole domain. */
export function maskEmail(v = '') {
  const e = v.trim();
  const at = e.indexOf('@');
  if (at < 1) return '•••@•••';
  return e[0] + '•••••' + e.slice(at);
}
