import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { FactTable } from '../../components/data/FactTable.jsx';
import { Button } from '../../components/core/Button.jsx';

export function WebVerifyClaim({ flow }) {
  const s = flow.sel;
  if (!s) return null;
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <div style={{ flex: 1, minWidth: 'min-content', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-7)', padding: 'var(--space-14)' }}>
        <BackLink label="PROFILE" onClick={() => flow.go('profile')} style={{ alignSelf: 'flex-start' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-4)', letterSpacing: 'var(--track-label)', color: 'var(--text-faint)' }}>{s.by} CLAIMS</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-9)', lineHeight: 0.82, color: 'var(--text-primary)' }}>{s.score}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-6)', letterSpacing: 'var(--track-label)', background: 'var(--selected-bg)', color: 'var(--selected-ink)', padding: '6px 10px' }}>{s.verdict}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-4)', color: 'var(--text-faint)' }}>{s.size} · {s.court}</span>
        </div>
      </div>
      <div style={{ flex: '0 1 520px', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', borderLeft: 'var(--border-hairline)', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-7)', padding: 'var(--space-14) var(--space-13)' }}>
        <SectionLabel>SCORE CLAIM</SectionLabel>
        <FactTable platform="web" rows={s.facts} />
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', lineHeight: 1.6 }}>{flow.verifyNote}</span>
        <Button height="var(--button-h-web)" onClick={flow.confirm}>CONFIRM SCORE</Button>
        <div
          onClick={flow.openDispute}
          style={{ height: 54, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-6)', letterSpacing: 'var(--track-slider)', cursor: 'pointer', border: 'var(--border-interactive)', color: 'var(--text-primary)' }}
        >DISPUTE THIS SCORE</div>
      </div>
    </div>
  );
}
