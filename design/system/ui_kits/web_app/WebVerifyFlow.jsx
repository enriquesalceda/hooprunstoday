import React from 'react';
import { AppHeader } from '../../components/navigation/AppHeader.jsx';
import { SegmentedControl } from '../../components/navigation/SegmentedControl.jsx';
import { useVerifyQueue } from '../verifyData.jsx';
import { WebVerifyQueue } from './WebVerifyQueue.jsx';
import { WebVerifyClaim } from './WebVerifyClaim.jsx';
import { WebVouch } from './WebVouch.jsx';
import { WebCounterScore } from './WebCounterScore.jsx';
import { WebCourtVote } from './WebCourtVote.jsx';
import { WebYourClaim } from './WebYourClaim.jsx';
import { WebInbox } from './WebInbox.jsx';

export function WebVerifyFlow() {
  const flow = useVerifyQueue();
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
      <AppHeader platform="web" geofence={flow.neighborhood} status={flow.waitingLabel} clock={flow.clock} onLogoClick={() => flow.go('profile')}>
        <SegmentedControl
          padY={10}
          style={{ flex: 'none' }}
          value="you"
          onChange={(v) => { if (v === 'you') flow.go('profile'); }}
          options={[{ value: 'radar', label: 'RADAR' }, { value: 'log', label: 'LOG GAME' }, { value: 'you', label: 'YOU' }]}
        />
      </AppHeader>
      {flow.screen === 'profile' && <WebVerifyQueue flow={flow} />}
      {flow.screen === 'verify' && <WebVerifyClaim flow={flow} />}
      {flow.screen === 'vouch' && <WebVouch flow={flow} />}
      {flow.screen === 'dispute' && <WebCounterScore flow={flow} />}
      {flow.screen === 'vote' && <WebCourtVote flow={flow} />}
      {flow.screen === 'claim' && <WebYourClaim flow={flow} />}
      {flow.screen === 'inbox' && <WebInbox flow={flow} />}
    </div>
  );
}
