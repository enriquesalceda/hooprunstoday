import React from 'react';

/* A score someone logged against you, waiting on your call. Solid white frame is the
   whole signal: in this product a white border means it needs YOU, dashed means it is
   waiting on someone else. */
export function ClaimCard({ by, score, verdict, meta, action, platform = 'mobile', onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const web = platform === 'web';
  const handle = (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      fontSize: web ? 'var(--mono-7)' : 'var(--mono-6)',
      color: 'var(--text-primary)',
      textDecoration: 'underline',
      textUnderlineOffset: 3,
    }}>{by}</span>
  );
  const bigScore = (
    <span style={{
      fontFamily: 'var(--font-display)',
      fontSize: web ? 'var(--display-4)' : 'var(--display-2)',
      lineHeight: 0.9,
      color: 'var(--text-primary)',
    }}>{score}</span>
  );
  const verdictChip = (
    <span style={{
      flex: 'none',
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      fontSize: web ? 'var(--mono-4)' : 'var(--mono-2)',
      letterSpacing: 'var(--track-label)',
      background: 'var(--selected-bg)',
      color: 'var(--selected-ink)',
      padding: web ? '5px 9px' : '4px 7px',
    }}>{verdict}</span>
  );
  const metaLine = (
    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: web ? 'var(--mono-2)' : 'var(--mono-1)', color: 'var(--text-faint)' }}>{meta}</span>
  );

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: 'var(--border-inverted)',
        padding: web ? 16 : 12,
        cursor: onClick ? 'pointer' : 'default',
        background: hover && web ? 'var(--hover-bg)' : 'transparent',
        display: 'flex',
        alignItems: web ? 'center' : 'stretch',
        justifyContent: 'space-between',
        gap: web ? 20 : 8,
        flexDirection: web ? 'row' : 'column',
        ...style,
      }}
    >
      {web ? (
        <React.Fragment>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              {handle}
              {metaLine}
            </div>
            {bigScore}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flex: 'none' }}>
            {verdictChip}
            {action && (
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-4)', letterSpacing: 'var(--track-nav)', color: 'var(--text-primary)' }}>{action}</span>
            )}
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            {handle}
            {metaLine}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
            {bigScore}
            {verdictChip}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
