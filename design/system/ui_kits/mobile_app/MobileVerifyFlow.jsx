import React from 'react';
import { AppHeader } from '../../components/navigation/AppHeader.jsx';
import { BottomNav } from '../../components/navigation/BottomNav.jsx';
import { useVerifyQueue } from '../verifyData.jsx';
import { MobileVerifyQueue } from './MobileVerifyQueue.jsx';
import { MobileVerifyClaim } from './MobileVerifyClaim.jsx';
import { MobileVouch } from './MobileVouch.jsx';
import { MobileCounterScore } from './MobileCounterScore.jsx';
import { MobileCourtVote } from './MobileCourtVote.jsx';
import { MobileYourClaim } from './MobileYourClaim.jsx';
import { MobileInbox } from './MobileInbox.jsx';

export function MobileVerifyFlow() {
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
      <AppHeader
        geofence={flow.neighborhood}
        status={flow.waitingLabel}
        clock={flow.clock}
        onLogoClick={() => flow.go('inbox')}
      />
      {flow.screen === 'profile' && <MobileVerifyQueue flow={flow} />}
      {flow.screen === 'verify' && <MobileVerifyClaim flow={flow} />}
      {flow.screen === 'vouch' && <MobileVouch flow={flow} />}
      {flow.screen === 'dispute' && <MobileCounterScore flow={flow} />}
      {flow.screen === 'vote' && <MobileCourtVote flow={flow} />}
      {flow.screen === 'claim' && <MobileYourClaim flow={flow} />}
      {flow.screen === 'inbox' && <MobileInbox flow={flow} />}
      <BottomNav
        value="you"
        onChange={(v) => { if (v === 'you') flow.go('profile'); }}
        options={[{ value: 'radar', label: 'RADAR' }, { value: 'log', label: 'LOG GAME' }, { value: 'you', label: 'YOU' }]}
      />
    </div>
  );
}
