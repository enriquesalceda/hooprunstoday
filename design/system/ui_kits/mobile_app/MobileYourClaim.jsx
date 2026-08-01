import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { FactTable } from '../../components/data/FactTable.jsx';
import { Button } from '../../components/core/Button.jsx';

export function MobileYourClaim({ flow }) {
  const c = flow.claim;
  if (!c) return null;
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px var(--gutter-mobile)' }}><BackLink label="PROFILE" onClick={() => flow.go('profile')} /></div>
      <span style={{ padding: '4px var(--gutter-mobile) 0', fontFamily: 'var(--font-display)', fontSize: 'var(--display-3)', lineHeight: 'var(--lh-display)', color: 'var(--text-primary)' }}>YOUR CLAIM</span>
      <SectionLabel style={{ padding: '8px var(--gutter-mobile) 0' }}>WAITING ON {c.vs}</SectionLabel>
      <div style={{ margin: '22px var(--gutter-mobile) 0', border: 'var(--border-pending)', padding: '14px 12px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-6)', lineHeight: 0.85, color: 'var(--pending-ink)' }}>{c.score}</span>
        <span style={{ flex: 'none', marginBottom: 6, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-2)', letterSpacing: 'var(--track-label)', color: 'var(--pending-ink)' }}>PENDING</span>
      </div>
      <FactTable style={{ margin: '12px var(--gutter-mobile) 0' }} rows={c.facts} />
      <span style={{ margin: '12px var(--gutter-mobile) 0', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)', lineHeight: 1.5 }}>{c.note}</span>
      <div style={{ flex: 1, minHeight: 20 }} />
      <Button style={{ margin: '0 var(--gutter-mobile) var(--space-4)' }} disabled={c.nudged} onClick={flow.nudge}>{c.nudged ? 'NUDGE SENT' : 'NUDGE ' + c.vs}</Button>
      <span
        onClick={flow.withdraw}
        style={{ padding: '0 var(--gutter-mobile) var(--space-11)', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-4)', color: 'var(--text-faint)', cursor: 'pointer' }}
      >WITHDRAW CLAIM</span>
    </div>
  );
}
