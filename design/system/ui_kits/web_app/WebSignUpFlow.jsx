import React from 'react';
import { AppHeader } from '../../components/navigation/AppHeader.jsx';
import { SegmentedControl } from '../../components/navigation/SegmentedControl.jsx';
import { useSignupForm } from '../signupData.jsx';
import { WebSignUpIdentity } from './WebSignUpIdentity.jsx';
import { WebSignUpCode } from './WebSignUpCode.jsx';
import { WebSignUpRecord } from './WebSignUpRecord.jsx';
import { WebSignUpHomeCourt } from './WebSignUpHomeCourt.jsx';
import { WebSignUpGeofence } from './WebSignUpGeofence.jsx';
import { WebNewProfile } from './WebNewProfile.jsx';

export function WebSignUpFlow() {
  const flow = useSignupForm();
  const done = flow.screen === 'profile';
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: 'var(--surface-app)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'var(--font-mono)',
    }}>
      <AppHeader platform="web" geofence={flow.geoLabel} status={flow.sysStatus} clock={flow.clock}>
        {done && (
          <SegmentedControl
            padY={10}
            style={{ flex: 'none' }}
            value="you"
            options={[{ value: 'radar', label: 'RADAR' }, { value: 'log', label: 'LOG GAME' }, { value: 'you', label: 'YOU' }]}
          />
        )}
      </AppHeader>
      {flow.screen === 'identity' && <WebSignUpIdentity flow={flow} />}
      {flow.screen === 'code' && <WebSignUpCode flow={flow} />}
      {flow.screen === 'record' && <WebSignUpRecord flow={flow} />}
      {flow.screen === 'courtpick' && <WebSignUpHomeCourt flow={flow} />}
      {flow.screen === 'geofence' && <WebSignUpGeofence flow={flow} />}
      {done && <WebNewProfile flow={flow} />}
    </div>
  );
}
