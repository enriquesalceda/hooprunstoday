import React from 'react';

/* A framed row that opens something: a sub-screen (glyph "→") or an inline list ("↓"/"↑").
   Same anatomy as FieldRow so a form reads as one column of identical rows. */
export function PickerRow({ label, value, placeholder = 'SELECT', glyph = '→', onClick, platform = 'mobile', style }) {
  const [hover, setHover] = React.useState(false);
  const web = platform === 'web';
  const empty = !value;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: 'var(--border-interactive)',
        display: 'flex',
        alignItems: 'stretch',
        cursor: 'pointer',
        background: hover && web ? 'var(--hover-bg)' : 'transparent',
        ...style,
      }}
    >
      <span style={{
        width: web ? 120 : 'auto',
        flex: 'none',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: web ? 'var(--mono-2)' : 'var(--mono-1)',
        color: 'var(--text-secondary)',
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        borderRight: 'var(--border-hairline)',
        whiteSpace: 'nowrap',
      }}>{label}</span>
      <span style={{
        flex: 1,
        minWidth: 0,
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: web ? 'var(--mono-8)' : 'var(--mono-7)',
        color: empty ? 'var(--text-faint)' : 'var(--text-primary)',
        padding: web ? '19px 14px' : '17px 12px',
      }}>{value || placeholder}</span>
      <span style={{
        width: web ? 48 : 44,
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontSize: web ? 22 : 20,
        color: 'var(--text-secondary)',
        borderLeft: 'var(--border-hairline)',
      }}>{glyph}</span>
    </div>
  );
}
