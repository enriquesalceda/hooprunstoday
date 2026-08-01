import React from 'react';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { EmailField } from '../../components/forms/EmailField.jsx';
import { Button } from '../../components/core/Button.jsx';

/* Split slate: the statement carries the left, the one interaction sits in a fixed-basis
   panel behind a hairline. The panel must shrink, never clip — flex: 0 1 520px. */
export function WebSignUpIdentity({ flow }) {
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <div style={{ flex: 1, minWidth: 'min-content', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-8)', padding: 'var(--space-14)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-7)', lineHeight: 0.9, color: 'var(--text-primary)' }}>IDENTITY<br />CHECK</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-4)', letterSpacing: 'var(--track-label)', color: 'var(--text-faint)' }}>ONE ADDRESS, ONE PLAYER · NO PASSWORD TO FORGET</span>
      </div>
      <div style={{ flex: '0 1 520px', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', borderLeft: 'var(--border-hairline)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-6)', padding: 'var(--space-14) var(--space-13)' }}>
        <SectionLabel>EMAIL VERIFICATION</SectionLabel>
        <EmailField platform="web" value={flow.email} onChange={flow.setEmail} />
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', lineHeight: 1.6 }}>{flow.emailHint}</span>
        <Button height="var(--button-h-web)" disabled={!flow.emailOk} onClick={flow.sendCode}>TRANSMIT CODE</Button>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)' }}>EXISTING PLAYER? SAME EMAIL, SAME RECORD.</span>
      </div>
    </div>
  );
}
