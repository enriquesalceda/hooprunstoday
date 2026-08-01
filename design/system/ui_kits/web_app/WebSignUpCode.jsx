import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { CodeInput } from '../../components/forms/CodeInput.jsx';

const TONE = { strong: 'var(--text-primary)', muted: 'var(--pending-ink)', faint: 'var(--text-faint)' };

export function WebSignUpCode({ flow }) {
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <div style={{ flex: 1, minWidth: 'min-content', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-8)', padding: 'var(--space-14)' }}>
        <BackLink label="EMAIL" onClick={() => flow.go('identity')} style={{ alignSelf: 'flex-start' }} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-7)', lineHeight: 0.9, color: 'var(--text-primary)' }}>ENTER<br />CODE</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-4)', color: 'var(--text-faint)' }}>SENT TO {flow.emailMasked} · EXPIRES IN 10:00</span>
      </div>
      <div style={{ flex: '0 1 520px', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', borderLeft: 'var(--border-hairline)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-7)', padding: 'var(--space-14) var(--space-13)' }}>
        <SectionLabel>SIX DIGITS</SectionLabel>
        <CodeInput platform="web" value={flow.code} onChange={flow.setCode} state={flow.codeState} />
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-3)', letterSpacing: 'var(--track-label)', color: TONE[flow.codeHintTone] }}>{flow.codeHint}</span>
        <span
          onClick={flow.resend}
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 'var(--mono-4)',
            color: flow.resendIn > 0 ? 'var(--text-faint)' : 'var(--text-primary)',
            cursor: flow.resendIn > 0 ? 'default' : 'pointer',
          }}
        >{flow.resendLabel}</span>
      </div>
    </div>
  );
}
