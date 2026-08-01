import React from 'react';

/* Email OTP entry: N cells driven by one invisible full-size input. Border style carries
   state — solid while typing, dashed once rejected or locked out. */
export function CodeInput({ length = 6, value = '', onChange, state = 'default', platform = 'mobile', style }) {
  const web = platform === 'web';
  const bad = state === 'error' || state === 'locked';
  const locked = state === 'locked';
  const cells = [];
  for (let i = 0; i < length; i++) {
    const filled = i < value.length;
    cells.push(
      <div key={i} style={{
        height: web ? 82 : 62,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontSize: web ? 44 : 34,
        color: 'var(--text-primary)',
        border: '1px ' + (bad ? 'dashed' : 'solid') + ' ' + (bad ? 'var(--pending-line)' : (filled ? 'var(--text-primary)' : 'var(--line-interactive)')),
        background: filled && state !== 'error' ? 'var(--surface-track)' : 'transparent',
        opacity: locked ? 'var(--disabled-opacity)' : 1,
      }}>{value[i] || ''}</div>
    );
  }
  return (
    <div style={{ position: 'relative', ...style }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + length + ', 1fr)', gap: 8 }}>{cells}</div>
      <input
        type="tel"
        inputMode="numeric"
        maxLength={length}
        value={value}
        disabled={locked}
        onChange={(e) => onChange && onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, length))}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: 16,
          cursor: 'pointer',
          caretColor: 'transparent',
        }}
      />
    </div>
  );
}
