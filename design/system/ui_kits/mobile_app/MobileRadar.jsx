import React from 'react';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { CourtRow } from '../../components/court/CourtRow.jsx';
import { BulletinRow } from '../../components/court/BulletinRow.jsx';

export function MobileRadar({ courts = [], bulletins = [], checkedIn, onOpenCourt, onOpenProfile }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <SectionLabel style={{ padding: '14px var(--gutter-mobile) 8px' }}>COURT DIRECTORY // {courts.length} TRACKED</SectionLabel>
      {courts.map((c) => (
        <CourtRow
          key={c.id}
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
      <SectionLabel style={{ padding: '16px var(--gutter-mobile) 8px' }}>THE BLACKTOP BULLETIN</SectionLabel>
      {bulletins.map((b) => (
        <BulletinRow key={b.id} handle={b.handle} when={b.when} court={b.court} text={b.text} onHandleClick={() => onOpenProfile(b.uid)} />
      ))}
    </div>
  );
}
