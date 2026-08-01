import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { FactTable } from '../../components/data/FactTable.jsx';
import { Button } from '../../components/core/Button.jsx';

export function MobileVerifyClaim({ flow }) {
  const s = flow.sel;
  if (!s) return null;
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px var(--gutter-mobile)' }}><BackLink label="PROFILE" onClick={() => flow.go('profile')} /></div>
      <span style={{ padding: '4px var(--gutter-mobile) 0', fontFamily: 'var(--font-display)', fontSize: 'var(--display-3)', lineHeight: 'var(--lh-display)', color: 'var(--text-primary)' }}>SCORE CLAIM</span>
      <SectionLabel style={{ padding: '8px var(--gutter-mobile) 0' }}>CONFIRM IT OR PUT UP YOUR OWN NUMBER</SectionLabel>
      <div style={{ margin: '22px var(--gutter-mobile) 0', border: 'var(--border-interactive)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 12px 12px', borderBottom: 'var(--border-hairline)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)' }}>THEY CLAIM</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-6)', lineHeight: 0.85, color: 'var(--text-primary)' }}>{s.score}</span>
            <span style={{ flex: 'none', marginBottom: 6, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-4)', letterSpacing: 'var(--track-label)', background: 'var(--selected-bg)', color: 'var(--selected-ink)', padding: '5px 8px' }}>{s.verdict}</span>
          </div>
        </div>
        <FactTable rows={s.facts} style={{ border: 'none' }} />
      </div>
      <span style={{ margin: '12px var(--gutter-mobile) 0', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)', lineHeight: 1.5 }}>{flow.verifyNote}</span>
      <div style={{ flex: 1, minHeight: 20 }} />
      <Button style={{ margin: '0 var(--gutter-mobile) var(--space-4)' }} onClick={flow.confirm}>CONFIRM SCORE</Button>
      <div
        onClick={flow.openDispute}
        style={{ margin: '0 var(--gutter-mobile) var(--space-11)', height: 52, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-6)', letterSpacing: 'var(--track-slider)', cursor: 'pointer', border: 'var(--border-interactive)', color: 'var(--text-primary)' }}
      >DISPUTE THIS SCORE</div>
    </div>
  );
}
