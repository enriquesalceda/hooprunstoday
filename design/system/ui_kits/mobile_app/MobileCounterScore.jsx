import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { ScoreInput } from '../../components/forms/ScoreInput.jsx';
import { Button } from '../../components/core/Button.jsx';

export function MobileCounterScore({ flow }) {
  const s = flow.sel;
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px var(--gutter-mobile)' }}><BackLink label="CLAIM" onClick={() => flow.go('verify')} /></div>
      <span style={{ padding: '4px var(--gutter-mobile) 0', fontFamily: 'var(--font-display)', fontSize: 'var(--display-3)', lineHeight: 'var(--lh-display)', color: 'var(--text-primary)' }}>COUNTER<br />SCORE</span>
      <SectionLabel style={{ padding: '8px var(--gutter-mobile) 0' }}>{s && s.by} CLAIMED {s && s.score} · PUT UP YOURS</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', margin: '22px var(--gutter-mobile) 0' }}>
        <ScoreInput label={flow.counterMineLabel} value={flow.counter.mine} onChange={(v) => flow.setCounterPart('mine', v)} />
        <ScoreInput label={flow.counterTheirsLabel} value={flow.counter.theirs} onChange={(v) => flow.setCounterPart('theirs', v)} />
      </div>
      <span style={{ margin: '12px var(--gutter-mobile) 0', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)', lineHeight: 1.5 }}>{flow.disputeHint}</span>
      <div style={{ flex: 1, minHeight: 20 }} />
      <Button style={{ margin: '0 var(--gutter-mobile) var(--space-11)' }} disabled={!flow.counterOk} onClick={flow.submitCounter}>OPEN COURT VOTE</Button>
    </div>
  );
}
