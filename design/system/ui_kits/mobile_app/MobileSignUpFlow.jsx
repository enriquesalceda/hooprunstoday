import React from 'react';
import { AppHeader } from '../../components/navigation/AppHeader.jsx';
import { SegmentedControl } from '../../components/navigation/SegmentedControl.jsx';
import { useSignupForm } from '../signupData.jsx';
import { MobileSignUpIdentity } from './MobileSignUpIdentity.jsx';
import { MobileSignUpCode } from './MobileSignUpCode.jsx';
import { MobileSignUpRecord } from './MobileSignUpRecord.jsx';
import { MobileSignUpHomeCourt } from './MobileSignUpHomeCourt.jsx';
import { MobileSignUpGeofence } from './MobileSignUpGeofence.jsx';
import { MobileNewProfile } from './MobileNewProfile.jsx';

export function MobileSignUpFlow() {
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
      <AppHeader geofence={flow.geoLabel} status={flow.sysStatus} clock={flow.clock} />
      {flow.screen === 'identity' && <MobileSignUpIdentity flow={flow} />}
      {flow.screen === 'code' && <MobileSignUpCode flow={flow} />}
      {flow.screen === 'record' && <MobileSignUpRecord flow={flow} />}
      {flow.screen === 'courtpick' && <MobileSignUpHomeCourt flow={flow} />}
      {flow.screen === 'geofence' && <MobileSignUpGeofence flow={flow} />}
      {done && <MobileNewProfile flow={flow} />}
      {done && (
        <SegmentedControl
          frame="top"
          padY={15}
          style={{ flex: 'none' }}
          value="you"
          options={[{ value: 'radar', label: 'RADAR' }, { value: 'log', label: 'LOG GAME' }, { value: 'you', label: 'YOU' }]}
        />
      )}
    </div>
  );
}
