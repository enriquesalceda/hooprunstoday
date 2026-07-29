import React from 'react';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { CourtRow } from '../../components/court/CourtRow.jsx';
import { BulletinRow } from '../../components/court/BulletinRow.jsx';

export function WebRadar({ courts = [], bulletins = [], checkedIn, onOpenCourt, onOpenProfile }) {
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <div style={{ flex: 1.5, overflowY: 'auto' }}>
        <SectionLabel style={{ padding: '20px var(--gutter-web) 8px' }}>COURT DIRECTORY // {courts.length} TRACKED</SectionLabel>
        {courts.map((c) => (
          <CourtRow
            key={c.id}
            platform="web"
            name={c.name}
            distanceKm={c.distanceKm}
            onCourtCount={checkedIn === c.id ? c.onCourtCount + 1 : c.onCourtCount}
            nextRun={c.nextRun}
            live={c.live}
            youAreHere={checkedIn === c.id}
            subdomain={c.subdomain}
            onClick={() => onOpenCourt(c.id)}
          />
        ))}
      </div>
      <div style={{ width: 'var(--rail-web)', flex: 'none', borderLeft: 'var(--border-hairline)', overflowY: 'auto' }}>
        <SectionLabel style={{ padding: '20px var(--space-9) 8px' }}>THE BLACKTOP BULLETIN</SectionLabel>
        {bulletins.map((b) => (
          <BulletinRow key={b.id} platform="web" handle={b.handle} when={b.when} court={b.court} text={b.text} onHandleClick={() => onOpenProfile(b.uid)} />
        ))}
      </div>
    </div>
  );
}
