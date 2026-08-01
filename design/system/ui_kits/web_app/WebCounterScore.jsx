import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { ScoreInput } from '../../components/forms/ScoreInput.jsx';
import { Button } from '../../components/core/Button.jsx';

export function WebCounterScore({ flow }) {
  const s = flow.sel;
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 'var(--form-col-web)', maxWidth: '100%', boxSizing: 'border-box', padding: 'var(--space-12) var(--gutter-web) var(--space-14)', display: 'flex', flexDirection: 'column' }}>
        <BackLink label="CLAIM" onClick={() => flow.go('verify')} style={{ alignSelf: 'flex-start' }} />
        <span style={{ paddingTop: 'var(--space-7)', fontFamily: 'var(--font-display)', fontSize: 'var(--display-5)', lineHeight: 'var(--lh-display-loose)', color: 'var(--text-primary)' }}>COUNTER SCORE</span>
        <SectionLabel style={{ paddingTop: 'var(--space-4)' }}>{s && s.by} CLAIMED {s && s.score} IN A {s && s.size} · PUT UP YOURS</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-10)' }}>
          <ScoreInput platform="web" label={flow.counterMineLabel} value={flow.counter.mine} onChange={(v) => flow.setCounterPart('mine', v)} />
          <ScoreInput platform="web" label={flow.counterTheirsLabel} value={flow.counter.theirs} onChange={(v) => flow.setCounterPart('theirs', v)} />
        </div>
        <span style={{ marginTop: 'var(--space-5)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', lineHeight: 1.6 }}>{flow.disputeHint}</span>
        <Button style={{ marginTop: 'var(--space-12)' }} height="var(--button-h-web)" disabled={!flow.counterOk} onClick={flow.submitCounter}>OPEN COURT VOTE</Button>
      </div>
    </div>
  );
}
