import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { Chip } from '../../components/core/Chip.jsx';
import { SlideToEngage } from '../../components/court/SlideToEngage.jsx';

export function MobileCheckIn({ court, geofence, onBack, onEngage }) {
  if (!court) return null;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ padding: '14px var(--gutter-mobile) 0' }}><BackLink label="RADAR" onClick={onBack} /></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-5)', padding: 'var(--gutter-mobile)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-5)', lineHeight: 'var(--lh-display)', color: 'var(--text-primary)', textWrap: 'balance' }}>{court.name}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-3)', color: 'var(--text-secondary)' }}>
          <span>{court.coords}</span>
          <Chip variant="frame">{court.type}</Chip>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-6)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-3)', color: 'var(--text-faint)' }}>
          <span>{court.onCourtCount} ON COURT</span>
          <span>NEXT: {court.nextRun}</span>
        </div>
      </div>
      <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingBottom: 'var(--space-11)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', padding: '0 var(--gutter-mobile)' }}>
          PROXIMITY_VERIFIED: TRUE · GEOFENCE MATCH {geofence}
        </span>
        <SlideToEngage width="100%" onEngage={onEngage} style={{ borderLeft: 'none', borderRight: 'none' }} />
      </div>
    </div>
  );
}
