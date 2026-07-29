import React from 'react';
import { Chip } from '../core/Chip.jsx';
import { OnCourtBanner } from './OnCourtBanner.jsx';

/* A court in the directory. Full-bleed, hairline-separated, no card. Tapping opens check-in. */
export function CourtRow({ name, distanceKm, onCourtCount, nextRun, live = false, youAreHere = false, subdomain, platform = 'mobile', onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const web = platform === 'web';
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: web ? 'var(--space-4)' : 'var(--space-3)',
        padding: web ? '22px var(--gutter-web)' : '16px var(--gutter-mobile)',
        borderBottom: 'var(--border-hairline)',
        background: hover ? 'var(--hover-bg)' : 'transparent',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-5)' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: web ? 'var(--display-4)' : 'var(--display-2)',
          lineHeight: 'var(--lh-display-loose)',
          color: 'var(--text-primary)',
          textWrap: 'balance',
        }}>{name}</span>
        {live && <Chip variant="solid" style={{ flex: 'none', marginTop: 4 }}>● LIVE</Chip>}
      </div>
      <div style={{
        display: 'flex',
        gap: web ? 'var(--space-9)' : 'var(--space-5)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 500,
        fontSize: web ? 'var(--mono-4)' : 'var(--mono-3)',
        color: 'var(--text-secondary)',
      }}>
        <span style={{ flex: 'none', whiteSpace: 'nowrap' }}>{distanceKm} KM</span>
        <span style={{ flex: 'none', whiteSpace: 'nowrap' }}>{onCourtCount} ON COURT</span>
        <span style={{ color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>NEXT: {nextRun}</span>
      </div>
      {youAreHere && <OnCourtBanner subdomain={subdomain} inset={!web} />}
    </div>
  );
}
