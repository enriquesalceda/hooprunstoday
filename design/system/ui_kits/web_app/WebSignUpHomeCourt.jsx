import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';

export function WebSignUpHomeCourt({ flow }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '18px var(--gutter-web) 0' }}><BackLink label="RECORD" onClick={() => flow.go('record')} /></div>
      <span style={{ padding: '12px var(--gutter-web) 0', fontFamily: 'var(--font-display)', fontSize: 'var(--display-5)', lineHeight: 'var(--lh-display-loose)', color: 'var(--text-primary)' }}>HOME COURT</span>
      <SectionLabel style={{ padding: '10px var(--gutter-web) 16px' }}>COURT DIRECTORY // {flow.courts.length} TRACKED · PICK WHERE YOU RUN MOST</SectionLabel>
      {flow.courts.map((c) => {
        const on = c.id === flow.homeCourtId;
        return (
          <div
            key={c.id}
            onClick={() => flow.pickCourt(c.id)}
            style={{
              borderBottom: 'var(--border-hairline)',
              padding: '22px var(--gutter-web)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              background: on ? 'var(--selected-bg)' : 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-5)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-4)', lineHeight: 'var(--lh-display-loose)', color: on ? 'var(--selected-ink)' : 'var(--text-primary)', textWrap: 'balance' }}>{c.name}</span>
              {on && <span style={{ flex: 'none', marginTop: 4, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-2)', background: 'var(--surface-app)', color: 'var(--text-primary)', padding: '4px 8px' }}>▶ HOME</span>}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-9)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-4)', color: on ? 'var(--selected-ink)' : 'var(--text-secondary)' }}>
              <span style={{ whiteSpace: 'nowrap' }}>{c.distanceKm} KM</span>
              <span style={{ whiteSpace: 'nowrap' }}>{c.onCourtCount} ON COURT</span>
              <span style={{ whiteSpace: 'nowrap' }}>{c.type}</span>
            </div>
          </div>
        );
      })}
      <span style={{ padding: '16px var(--gutter-web) var(--space-11)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)' }}>HOME COURT SHOWS ON YOUR PROFILE. CHANGE IT ANY TIME.</span>
    </div>
  );
}
