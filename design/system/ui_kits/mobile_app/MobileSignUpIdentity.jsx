import React from 'react';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { EmailField } from '../../components/forms/EmailField.jsx';
import { Button } from '../../components/core/Button.jsx';

export function MobileSignUpIdentity({ flow }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <span style={{ padding: '20px var(--gutter-mobile) 0', fontFamily: 'var(--font-display)', fontSize: 'var(--display-3)', lineHeight: 'var(--lh-display)', color: 'var(--text-primary)' }}>IDENTITY<br />CHECK</span>
      <SectionLabel style={{ padding: '8px var(--gutter-mobile) 0' }}>EMAIL VERIFICATION · ONE ADDRESS, ONE PLAYER</SectionLabel>
      <EmailField style={{ margin: '22px var(--gutter-mobile) 0' }} value={flow.email} onChange={flow.setEmail} />
      <span style={{ margin: '8px var(--gutter-mobile) 0', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)', lineHeight: 1.5 }}>{flow.emailHint}</span>
      <div style={{ flex: 1, minHeight: 'var(--space-9)' }} />
      <span style={{ padding: '0 var(--gutter-mobile) 10px', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)' }}>EXISTING PLAYER? SAME EMAIL, SAME RECORD.</span>
      <Button style={{ margin: '0 var(--gutter-mobile) var(--gutter-mobile)' }} disabled={!flow.emailOk} onClick={flow.sendCode}>TRANSMIT CODE</Button>
    </div>
  );
}
