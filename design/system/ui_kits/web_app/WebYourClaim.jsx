import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { FactTable } from '../../components/data/FactTable.jsx';
import { Button } from '../../components/core/Button.jsx';

export function WebYourClaim({ flow }) {
  const c = flow.claim;
  if (!c) return null;
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <div style={{ flex: 1, minWidth: 'min-content', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-7)', padding: 'var(--space-14)' }}>
        <BackLink label="PROFILE" onClick={() => flow.go('profile')} style={{ alignSelf: 'flex-start' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-4)', letterSpacing: 'var(--track-label)', color: 'var(--text-faint)' }}>YOU CLAIMED</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-9)', lineHeight: 0.82, color: 'var(--pending-ink)' }}>{c.score}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-6)', letterSpacing: 'var(--track-label)', border: 'var(--border-pending)', color: 'var(--pending-ink)', padding: '6px 10px' }}>PENDING</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-4)', color: 'var(--text-faint)' }}>WAITING ON {c.vs}</span>
        </div>
      </div>
      <div style={{ flex: '0 1 520px', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', borderLeft: 'var(--border-hairline)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-7)', padding: 'var(--space-14) var(--space-13)' }}>
        <SectionLabel>YOUR CLAIM</SectionLabel>
        <FactTable platform="web" rows={c.facts} />
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', lineHeight: 1.6 }}>{c.note}</span>
        <Button height="var(--button-h-web)" disabled={c.nudged} onClick={flow.nudge}>{c.nudged ? 'NUDGE SENT' : 'NUDGE ' + c.vs}</Button>
        <span
          onClick={flow.withdraw}
          style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-4)', color: 'var(--text-faint)', cursor: 'pointer' }}
        >WITHDRAW CLAIM</span>
      </div>
    </div>
  );
}
