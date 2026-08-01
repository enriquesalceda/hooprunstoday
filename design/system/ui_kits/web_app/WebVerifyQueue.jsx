import React from 'react';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { ClaimCard } from '../../components/data/ClaimCard.jsx';
import { GameLogRow } from '../../components/data/GameLogRow.jsx';
import { EmptyState } from '../../components/data/EmptyState.jsx';

/* Queues in the main column, settled log in the rail — the same split as Radar. */
export function WebVerifyQueue({ flow }) {
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <div style={{ flex: 1.5, minWidth: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px var(--gutter-web) 14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-7)', borderBottom: 'var(--border-hairline)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-4)', lineHeight: 'var(--lh-display-loose)', color: 'var(--text-primary)' }}>JORDAN MILLER</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flex: 'none' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)' }}>STREET SCORE</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-3)', lineHeight: 0.85, color: 'var(--text-primary)' }}>{flow.streetScore}</span>
          </div>
        </div>

        <div
          onClick={() => flow.go('inbox')}
          style={{ padding: '13px var(--gutter-web)', borderBottom: 'var(--border-hairline)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-5)', cursor: 'pointer' }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-4)', letterSpacing: 'var(--track-nav)', color: 'var(--text-primary)' }}>INBOX</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)' }}>{flow.inboxSummary} · {flow.inbox.length} TOTAL →</span>
        </div>

        {flow.incoming.length > 0 && (
          <React.Fragment>
            <SectionLabel style={{ padding: '20px var(--gutter-web) 10px' }}>AWAITING YOUR CALL // {flow.incoming.length}</SectionLabel>
            {flow.incoming.map((i) => (
              <ClaimCard key={i.id} platform="web" style={{ margin: '0 var(--gutter-web) 10px' }} by={i.by} score={i.score} verdict={i.verdict} meta={i.meta} action="REVIEW →" onClick={i.open} />
            ))}
          </React.Fragment>
        )}

        {flow.votes.length > 0 && (
          <React.Fragment>
            <SectionLabel style={{ padding: '12px var(--gutter-web) 10px' }}>COURT VOTES OPEN // {flow.votes.length}</SectionLabel>
            {flow.votes.map((v) => (
              <GameLogRow key={v.id} platform="web" style={{ margin: '0 var(--gutter-web) 10px' }} pending label={v.label} sublabel={v.sublabel} meta={v.meta} onClick={v.open} />
            ))}
          </React.Fragment>
        )}

        <SectionLabel style={{ padding: '12px var(--gutter-web) 10px' }}>YOUR OPEN CLAIMS // {flow.claims.length}</SectionLabel>
        {flow.claims.length > 0 ? flow.claims.map((c) => (
          <GameLogRow key={c.id} platform="web" style={{ margin: '0 var(--gutter-web) 10px' }} pending label={c.label} meta={c.meta} onClick={c.open} />
        )) : (
          <EmptyState platform="web" style={{ margin: '0 var(--gutter-web) 10px' }} label="NO OPEN CLAIMS" meta="LOG A SCORE TO OPEN ONE" />
        )}
        <span style={{ padding: '10px var(--gutter-web) var(--space-11)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', lineHeight: 1.6 }}>
          UNVERIFIED GAMES EARN NO CRED. A VERIFIED LOSS STILL COUNTS AS A GAME PLAYED.
        </span>
      </div>

      <div style={{ width: 'var(--rail-web)', flex: 'none', borderLeft: 'var(--border-hairline)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <SectionLabel style={{ padding: '20px var(--space-9) 10px' }}>SETTLED GAME LOG // {flow.settled.length}</SectionLabel>
        {flow.settled.map((g) => (
          <div key={g.label} style={{ margin: '0 var(--space-9) 8px' }}>
            <GameLogRow platform="web" label={g.label} meta={g.meta} pending={g.pending} />
          </div>
        ))}
      </div>
    </div>
  );
}
