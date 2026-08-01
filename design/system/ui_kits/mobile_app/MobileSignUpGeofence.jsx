import React from 'react';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { FactTable } from '../../components/data/FactTable.jsx';
import { Button } from '../../components/core/Button.jsx';

export function MobileSignUpGeofence({ flow }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <span style={{ padding: '20px var(--gutter-mobile) 0', fontFamily: 'var(--font-display)', fontSize: 'var(--display-3)', lineHeight: 'var(--lh-display)', color: 'var(--text-primary)' }}>GEOFENCE<br />ACCESS</span>
      <SectionLabel style={{ padding: '8px var(--gutter-mobile) 0' }}>CHECK-INS ARE VERIFIED BY PROXIMITY, NOT BY TRUST</SectionLabel>
      <FactTable style={{ margin: '24px var(--gutter-mobile) 0' }} rows={flow.facts} />
      <span style={{ margin: '12px var(--gutter-mobile) 0', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)', lineHeight: 1.5 }}>LOCATION IS READ ONLY WHILE THE APP IS OPEN.</span>
      <div style={{ flex: 1, minHeight: 'var(--space-9)' }} />
      <Button style={{ margin: '0 var(--gutter-mobile) var(--space-5)' }} onClick={flow.grantLocation}>GRANT LOCATION ACCESS</Button>
      <span
        onClick={flow.skipLocation}
        style={{ padding: '0 var(--gutter-mobile) var(--space-11)', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-4)', color: 'var(--text-faint)', cursor: 'pointer' }}
      >SKIP — BROWSE ONLY</span>
    </div>
  );
}
