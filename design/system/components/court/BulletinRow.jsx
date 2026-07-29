import React from 'react';

/* A post on THE BLACKTOP BULLETIN. The body is the only sentence-case text in the product. */
export function BulletinRow({ handle, when, court, text, platform = 'mobile', onHandleClick, style }) {
  const [hover, setHover] = React.useState(false);
  const web = platform === 'web';
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      padding: web ? '14px var(--space-9)' : '12px var(--gutter-mobile)',
      borderBottom: 'var(--border-faint)',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <span
          onClick={onHandleClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 'var(--mono-6)',
            color: hover ? 'var(--text-secondary)' : 'var(--text-primary)',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            cursor: onHandleClick ? 'pointer' : 'default',
          }}>{handle}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)' }}>
          {when} · {court}
        </span>
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 500,
        fontSize: 'var(--body-size)',
        lineHeight: web ? 'var(--body-lh-web)' : 'var(--body-lh)',
        color: 'var(--text-body)',
        textWrap: 'pretty',
      }}>{text}</span>
    </div>
  );
}
