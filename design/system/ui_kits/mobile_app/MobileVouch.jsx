import React from 'react';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { Chip } from '../../components/core/Chip.jsx';
import { Button } from '../../components/core/Button.jsx';

/* Confirming a score is what unlocks a vouch — the honest bookkeeping and the reputation
   system are the same gesture. That is the reason to verify instead of ghosting. */
export function MobileVouch({ flow }) {
  const s = flow.sel;
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <SectionLabel style={{ padding: '20px var(--gutter-mobile) 0' }}>SCORE CONFIRMED · {s && s.score} VS {s && s.by}</SectionLabel>
      <span style={{ padding: '10px var(--gutter-mobile) 0', fontFamily: 'var(--font-display)', fontSize: 'var(--display-3)', lineHeight: 'var(--lh-display)', color: 'var(--text-primary)' }}>VOUCH A<br />CAPABILITY</span>
      <SectionLabel style={{ padding: '8px var(--gutter-mobile) 0' }}>YOU GUARDED THEM. WHAT WAS REAL?</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', margin: '22px var(--gutter-mobile) 0' }}>
        {flow.badges.map((b) => (
          <Chip key={b} variant="outline" selected={flow.picked.indexOf(b) !== -1} onClick={() => flow.toggleBadge(b)}>{b}</Chip>
        ))}
      </div>
      <span style={{ margin: '14px var(--gutter-mobile) 0', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)', lineHeight: 1.5 }}>{flow.vouchHint}</span>
      <div style={{ flex: 1, minHeight: 20 }} />
      <Button style={{ margin: '0 var(--gutter-mobile) var(--space-4)' }} disabled={!flow.picked.length} onClick={flow.sendVouch}>SEND VOUCH</Button>
      <span
        onClick={flow.skipVouch}
        style={{ padding: '0 var(--gutter-mobile) var(--space-11)', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-4)', color: 'var(--text-faint)', cursor: 'pointer' }}
      >SKIP — SCORE STANDS EITHER WAY</span>
    </div>
  );
}
