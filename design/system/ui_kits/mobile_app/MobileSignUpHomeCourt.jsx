import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';

/* Home-court picker. Same row anatomy as Radar's CourtRow, minus the live chip, plus a
   fully inverted selected row — this is a choice, not a destination. */
export function MobileSignUpHomeCourt({ flow }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px var(--gutter-mobile)' }}><BackLink label="RECORD" onClick={() => flow.go('record')} /></div>
      <span style={{ padding: '4px var(--gutter-mobile) 0', fontFamily: 'var(--font-display)', fontSize: 'var(--display-3)', lineHeight: 'var(--lh-display)', color: 'var(--text-primary)' }}>HOME COURT</span>
      <SectionLabel style={{ padding: '8px var(--gutter-mobile) 14px' }}>COURT DIRECTORY // {flow.courts.length} TRACKED · PICK WHERE YOU RUN MOST</SectionLabel>
      {flow.courts.map((c) => {
        const on = c.id === flow.homeCourtId;
        return (
          <div
            key={c.id}
            onClick={() => flow.pickCourt(c.id)}
            style={{
              borderBottom: 'var(--border-hairline)',
              padding: '16px var(--gutter-mobile)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              background: on ? 'var(--selected-bg)' : 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-2)', lineHeight: 'var(--lh-display-loose)', color: on ? 'var(--selected-ink)' : 'var(--text-primary)', textWrap: 'balance' }}>{c.name}</span>
              {on && <span style={{ flex: 'none', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-2)', background: 'var(--surface-app)', color: 'var(--text-primary)', padding: '3px 6px' }}>▶ HOME</span>}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-6)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-3)', color: on ? 'var(--selected-ink)' : 'var(--text-secondary)' }}>
              <span style={{ whiteSpace: 'nowrap' }}>{c.distanceKm} KM</span>
              <span style={{ whiteSpace: 'nowrap' }}>{c.onCourtCount} ON COURT</span>
              <span style={{ whiteSpace: 'nowrap' }}>{c.type}</span>
            </div>
          </div>
        );
      })}
      <span style={{ padding: '14px var(--gutter-mobile) var(--space-9)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)', lineHeight: 1.5 }}>HOME COURT SHOWS ON YOUR PROFILE. CHANGE IT ANY TIME.</span>
    </div>
  );
}
