import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { CodeInput } from '../../components/forms/CodeInput.jsx';

const TONE = { strong: 'var(--text-primary)', muted: 'var(--pending-ink)', faint: 'var(--text-faint)' };

export function MobileSignUpCode({ flow }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px var(--gutter-mobile)' }}><BackLink label="EMAIL" onClick={() => flow.go('identity')} /></div>
      <span style={{ padding: '4px var(--gutter-mobile) 0', fontFamily: 'var(--font-display)', fontSize: 'var(--display-3)', lineHeight: 'var(--lh-display)', color: 'var(--text-primary)' }}>ENTER CODE</span>
      <SectionLabel style={{ padding: '8px var(--gutter-mobile) 0' }}>SENT TO {flow.emailMasked} · EXPIRES IN 10:00</SectionLabel>
      <CodeInput style={{ margin: '22px var(--gutter-mobile) 0' }} value={flow.code} onChange={flow.setCode} state={flow.codeState} />
      <span style={{ margin: '12px var(--gutter-mobile) 0', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-2)', letterSpacing: 'var(--track-label)', color: TONE[flow.codeHintTone] }}>{flow.codeHint}</span>
      <div style={{ flex: 1, minHeight: 'var(--space-9)' }} />
      <span
        onClick={flow.resend}
        style={{
          padding: '0 var(--gutter-mobile) var(--space-9)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: 'var(--mono-4)',
          color: flow.resendIn > 0 ? 'var(--text-faint)' : 'var(--text-primary)',
          cursor: flow.resendIn > 0 ? 'default' : 'pointer',
        }}
      >{flow.resendLabel}</span>
    </div>
  );
}
