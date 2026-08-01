import React from 'react';
import { FactTable } from '../../components/data/FactTable.jsx';
import { Button } from '../../components/core/Button.jsx';

export function WebSignUpGeofence({ flow }) {
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <div style={{ flex: 1, minWidth: 'min-content', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-8)', padding: 'var(--space-14)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-7)', lineHeight: 0.9, color: 'var(--text-primary)' }}>GEOFENCE<br />ACCESS</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-4)', letterSpacing: 'var(--track-label)', color: 'var(--text-faint)' }}>CHECK-INS ARE VERIFIED BY PROXIMITY, NOT BY TRUST</span>
      </div>
      <div style={{ flex: '0 1 520px', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', borderLeft: 'var(--border-hairline)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-7)', padding: 'var(--space-14) var(--space-13)' }}>
        <FactTable platform="web" rows={flow.facts} />
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', lineHeight: 1.6 }}>LOCATION IS READ ONLY WHILE THE TAB IS OPEN.</span>
        <Button height="var(--button-h-web)" onClick={flow.grantLocation}>GRANT LOCATION ACCESS</Button>
        <span
          onClick={flow.skipLocation}
          style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-4)', color: 'var(--text-faint)', cursor: 'pointer' }}
        >SKIP — BROWSE ONLY</span>
      </div>
    </div>
  );
}
