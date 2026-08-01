import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { VoteSide } from '../../components/data/VoteSide.jsx';
import { RosterRow } from '../../components/data/RosterRow.jsx';

export function MobileCourtVote({ flow }) {
  const v = flow.vote;
  if (!v) return null;
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px var(--gutter-mobile)' }}><BackLink label="PROFILE" onClick={() => flow.go('profile')} /></div>
      <span style={{ padding: '4px var(--gutter-mobile) 0', fontFamily: 'var(--font-display)', fontSize: 'var(--display-3)', lineHeight: 'var(--lh-display)', color: 'var(--text-primary)' }}>COURT VOTE</span>
      <SectionLabel style={{ padding: '8px var(--gutter-mobile) 0' }}>{v.size} · {v.court} · CLOSES IN {v.left}</SectionLabel>
      <div style={{ margin: '22px var(--gutter-mobile) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {v.sides.map((s) => (
          <VoteSide key={s.key} who={s.who} score={s.score} tally={s.tally} selected={s.selected} locked={!!v.myVote} onClick={() => flow.castVote(s.key)} />
        ))}
      </div>
      <span style={{ margin: '12px var(--gutter-mobile) 0', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-2)', letterSpacing: 'var(--track-label)', color: v.myVote ? 'var(--text-faint)' : 'var(--text-primary)' }}>{flow.voteHint}</span>
      <SectionLabel style={{ padding: '20px var(--gutter-mobile) 8px' }}>ON COURT THAT RUN // {v.eligible} ELIGIBLE</SectionLabel>
      <div style={{ margin: '0 var(--gutter-mobile)' }}>
        {v.voters.map((p) => <RosterRow key={p.handle} name={p.handle} meta={p.state} muted={p.state !== 'VOTED'} />)}
      </div>
      <span style={{ padding: '14px var(--gutter-mobile) var(--space-11)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)', lineHeight: 1.5 }}>
        MAJORITY SETTLES IT. A TIE AT CLOSE VOIDS THE GAME — NO CRED EITHER WAY.
      </span>
    </div>
  );
}
