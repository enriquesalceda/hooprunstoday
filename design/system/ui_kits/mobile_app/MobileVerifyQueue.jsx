import React from 'react';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { ClaimCard } from '../../components/data/ClaimCard.jsx';
import { GameLogRow } from '../../components/data/GameLogRow.jsx';
import { EmptyState } from '../../components/data/EmptyState.jsx';

/* The queue lives on the profile: white frames need your call, dashed frames are waiting
   on someone else, and the settled log sits underneath. */
export function MobileVerifyQueue({ flow }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px var(--gutter-mobile) 12px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-3)', lineHeight: 'var(--lh-display-loose)', color: 'var(--text-primary)' }}>JORDAN<br />MILLER</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, paddingBottom: 4, flex: 'none' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)' }}>STREET SCORE</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-2)', lineHeight: 0.85, color: 'var(--text-primary)' }}>{flow.streetScore}</span>
        </div>
      </div>

      {flow.incoming.length > 0 && (
        <React.Fragment>
          <SectionLabel style={{ padding: '6px var(--gutter-mobile) 8px' }}>AWAITING YOUR CALL // {flow.incoming.length}</SectionLabel>
          {flow.incoming.map((i) => (
            <ClaimCard key={i.id} style={{ margin: '0 var(--gutter-mobile) 8px' }} by={i.by} score={i.score} verdict={i.verdict} meta={i.when} onClick={i.open} />
          ))}
        </React.Fragment>
      )}

      {flow.votes.length > 0 && (
        <React.Fragment>
          <SectionLabel style={{ padding: '10px var(--gutter-mobile) 8px' }}>COURT VOTES OPEN // {flow.votes.length}</SectionLabel>
          {flow.votes.map((v) => (
            <GameLogRow key={v.id} style={{ margin: '0 var(--gutter-mobile) 8px' }} pending label={v.label} sublabel={v.sublabel} meta={v.meta} onClick={v.open} />
          ))}
        </React.Fragment>
      )}

      <SectionLabel style={{ padding: '10px var(--gutter-mobile) 8px' }}>YOUR OPEN CLAIMS // {flow.claims.length}</SectionLabel>
      {flow.claims.length > 0 ? flow.claims.map((c) => (
        <GameLogRow key={c.id} style={{ margin: '0 var(--gutter-mobile) 8px' }} pending label={c.label} meta={c.meta} onClick={c.open} />
      )) : (
        <EmptyState style={{ margin: '0 var(--gutter-mobile) 8px' }} label="NO OPEN CLAIMS" meta="LOG A SCORE TO OPEN ONE" />
      )}

      <SectionLabel style={{ padding: '10px var(--gutter-mobile) 8px' }}>SETTLED GAME LOG // {flow.settled.length}</SectionLabel>
      {flow.settled.map((g) => (
        <GameLogRow key={g.label} style={{ margin: '0 var(--gutter-mobile) 8px' }} label={g.label} meta={g.meta} pending={g.pending} />
      ))}
      <span style={{ padding: '4px var(--gutter-mobile) var(--space-9)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)', lineHeight: 1.5 }}>
        UNVERIFIED GAMES EARN NO CRED. A VERIFIED LOSS STILL COUNTS AS A GAME PLAYED.
      </span>
    </div>
  );
}
