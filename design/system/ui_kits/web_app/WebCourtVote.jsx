import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { VoteSide } from '../../components/data/VoteSide.jsx';
import { RosterRow } from '../../components/data/RosterRow.jsx';

/* Sides in the main column, voter roll in the rail — the tally is the point, so it gets
   the space and the eligibility list stays visible beside it. */
export function WebCourtVote({ flow }) {
  const v = flow.vote;
  if (!v) return null;
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <div style={{ flex: 1.4, minWidth: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: 'var(--gutter-web)' }}>
        <BackLink label="PROFILE" onClick={() => flow.go('profile')} style={{ alignSelf: 'flex-start' }} />
        <span style={{ paddingTop: 'var(--space-6)', fontFamily: 'var(--font-display)', fontSize: 'var(--display-5)', lineHeight: 'var(--lh-display-loose)', color: 'var(--text-primary)' }}>COURT VOTE</span>
        <SectionLabel style={{ paddingTop: 'var(--space-4)' }}>{v.size} · {v.court} · CLOSES IN {v.left}</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', paddingTop: 'var(--space-11)' }}>
          {v.sides.map((s) => (
            <VoteSide key={s.key} platform="web" who={s.who} score={s.score} tally={s.tally} selected={s.selected} locked={!!v.myVote} onClick={() => flow.castVote(s.key)} />
          ))}
        </div>
        <span style={{ paddingTop: 'var(--space-6)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-4)', letterSpacing: 'var(--track-label)', color: v.myVote ? 'var(--text-faint)' : 'var(--text-primary)' }}>{flow.voteHint}</span>
        <span style={{ paddingTop: 'var(--space-8)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', lineHeight: 1.6 }}>
          MAJORITY SETTLES IT. A TIE AT CLOSE VOIDS THE GAME — NO CRED EITHER WAY.
        </span>
      </div>
      <div style={{ width: 'var(--portrait-col-web)', flex: 'none', borderLeft: 'var(--border-hairline)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <SectionLabel style={{ padding: '20px var(--space-9) 10px' }}>ON COURT THAT RUN // {v.eligible} ELIGIBLE</SectionLabel>
        <div style={{ margin: '0 var(--space-9)' }}>
          {v.voters.map((p) => <RosterRow key={p.handle} platform="web" name={p.handle} meta={p.state} muted={p.state !== 'VOTED'} />)}
        </div>
      </div>
    </div>
  );
}
