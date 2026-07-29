import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { Chip } from '../../components/core/Chip.jsx';
import { SlideToEngage } from '../../components/court/SlideToEngage.jsx';

export function WebCheckIn({ court, geofence, onBack, onEngage }) {
  if (!court) return null;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ padding: '18px var(--gutter-web) 0' }}><BackLink label="RADAR" onClick={onBack} /></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-7)', padding: 'var(--gutter-web)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-7)', lineHeight: 'var(--lh-display)', color: 'var(--text-primary)', textAlign: 'center', textWrap: 'balance', maxWidth: 900 }}>{court.name}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-4)', color: 'var(--text-secondary)' }}>
          <span>{court.coords}</span>
          <Chip variant="frame">{court.type}</Chip>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-8)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-4)', color: 'var(--text-faint)' }}>
          <span>{court.onCourtCount} ON COURT</span>
          <span>NEXT: {court.nextRun}</span>
        </div>
      </div>
      <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-5)', paddingBottom: 'var(--space-15)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)' }}>
          PROXIMITY_VERIFIED: TRUE · GEOFENCE MATCH {geofence}
        </span>
        <SlideToEngage width="var(--slider-track-web)" onEngage={onEngage} />
      </div>
    </div>
  );
}
