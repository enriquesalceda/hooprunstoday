import React from 'react';

/* A notification. The kind label is the only thing that shouts; unactionable notices are
   muted so the queue reads as "what needs me" rather than "what happened". */
export function InboxRow({ kind, text, when, actionable = false, platform = 'mobile', onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const web = platform === 'web';
  const kindEl = (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      fontSize: 'var(--mono-1)',
      letterSpacing: 'var(--track-label)',
      color: actionable ? 'var(--text-primary)' : 'var(--text-muted)',
      width: web ? 96 : 'auto',
      flex: 'none',
    }}>{kind}</span>
  );
  const whenEl = (
    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)', flex: 'none' }}>{when}</span>
  );
  const textEl = (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: web ? 'var(--mono-7)' : 'var(--mono-6)',
      color: actionable ? 'var(--text-body)' : 'var(--text-muted)',
      lineHeight: 1.5,
      textWrap: 'pretty',
    }}>{text}</span>
  );

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderTop: 'var(--border-faint)',
        padding: web ? '16px 0' : '13px var(--gutter-mobile)',
        display: 'flex',
        gap: web ? 20 : 5,
        flexDirection: web ? 'row' : 'column',
        alignItems: web ? 'baseline' : 'stretch',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        background: hover && web && onClick ? 'var(--hover-bg)' : 'transparent',
        ...style,
      }}
    >
      {web ? (
        <React.Fragment>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, minWidth: 0 }}>
            {kindEl}
            {textEl}
          </div>
          {whenEl}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            {kindEl}
            {whenEl}
          </div>
          {textEl}
        </React.Fragment>
      )}
    </div>
  );
}
