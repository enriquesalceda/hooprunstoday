import React from 'react';

/* DD / MM / YYYY in one framed row. Three cells, slash separators, digits only. */
export function DateField({ label = 'BORN', day = '', month = '', year = '', onChange, platform = 'mobile', style }) {
  const web = platform === 'web';
  const cell = (val, len, ph, key, w) => (
    <input
      key={key}
      type="tel"
      inputMode="numeric"
      maxLength={len}
      value={val}
      placeholder={ph}
      onChange={(e) => onChange && onChange(key, e.target.value.replace(/[^0-9]/g, '').slice(0, len))}
      style={{
        width: w,
        flex: 'none',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: 'var(--text-primary)',
        caretColor: 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: web ? 'var(--mono-9)' : 'var(--mono-8)',
        padding: web ? '18px 0' : '16px 0',
        textAlign: 'center',
      }}
    />
  );
  const slash = (k) => (
    <span key={k} style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: web ? 'var(--mono-9)' : 'var(--mono-8)', color: 'var(--text-faint)', display: 'flex', alignItems: 'center' }}>/</span>
  );
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
      {cell(day, 2, 'DD', 'day', web ? 46 : 52)}
      {slash('s1')}
      {cell(month, 2, 'MM', 'month', web ? 46 : 52)}
      {slash('s2')}
      {cell(year, 4, 'YYYY', 'year', web ? 64 : 72)}
    </div>
  );
}
