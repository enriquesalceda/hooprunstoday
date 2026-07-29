import React from 'react';
import { AppHeader } from '../../components/navigation/AppHeader.jsx';
import { SegmentedControl } from '../../components/navigation/SegmentedControl.jsx';
import { LockFlash } from '../../components/court/LockFlash.jsx';
import { WebRadar } from './WebRadar.jsx';
import { WebCheckIn } from './WebCheckIn.jsx';
import { WebProfile } from './WebProfile.jsx';
import { WebLogGame } from './WebLogGame.jsx';

const COURTS = [
  { id: 'c1', name: 'PRINCE ALFRED PARK', distanceKm: '0.4', onCourtCount: 14, nextRun: '3V3 HALFCOURT', live: true, coords: '-33.8926, 151.2033', type: 'OUTDOOR', subdomain: 'prince-alfred-park.hoopruns.today' },
  { id: 'c2', name: 'WATERLOO OVAL', distanceKm: '1.2', onCourtCount: 6, nextRun: '5V5 FULL', live: true, coords: '-33.9012, 151.2071', type: 'OUTDOOR', subdomain: 'waterloo-oval.hoopruns.today' },
  { id: 'c3', name: 'REDFERN COMMUNITY CT', distanceKm: '2.1', onCourtCount: 0, nextRun: 'OPEN RUN 18:00', live: false, coords: '-33.8934, 151.1988', type: 'INDOOR', subdomain: 'redfern-community-ct.hoopruns.today' },
];

const PROFILES = {
  you: { name: 'JORDAN MILLER', height: "6'2\"", position: 'GUARD', home: 'PRINCE ALFRED PARK', subdomain: 'jordan.miller.hoopruns.today', score: '875', rank: 'COURT LEGEND', badges: ['LOCKDOWN', 'SNIPER', 'GLUE GUY', 'MOTOR'], vouches: 61, ppg: '24.5', rpg: '6.2', apg: '7.1', teams: [{ name: 'NEWTOWN OUTLAWS', meta: 'DIV II · ACTIVE' }, { name: 'CITY 3X3 CHAMPION', meta: '2025' }] },
  jb: { name: 'JORDAN BUCKETS', height: "6'4\"", position: 'WING', home: 'WATERLOO OVAL', subdomain: 'jordan-buckets.hoopruns.today', score: '731', rank: 'REGULAR', badges: ['SNIPER', 'HEAT CHECK'], vouches: 34, ppg: '19.8', rpg: '4.4', apg: '2.9', teams: [{ name: 'WATERLOO WRECKERS', meta: 'DIV III · ACTIVE' }] },
  dee: { name: 'TALLBOY DEE', height: "6'9\"", position: 'CENTER', home: 'REDFERN COMMUNITY CT', subdomain: 'tallboy-dee.hoopruns.today', score: '804', rank: 'RIM GUARDIAN', badges: ['LOCKDOWN', 'GLASS CLEANER'], vouches: 47, ppg: '14.1', rpg: '11.6', apg: '1.8', teams: [{ name: 'REDFERN ALL-DAY', meta: 'DIV II · ACTIVE' }] },
};

const BULLETINS = [
  { id: 'b1', handle: '@jordan_buckets', uid: 'jb', when: '4M AGO', court: 'PRINCE ALFRED', text: 'Squads forming on West Hoop. Need one to hold court.' },
  { id: 'b2', handle: '@tallboy_dee', uid: 'dee', when: '18M AGO', court: 'REDFERN CT', text: 'Indoor run tonight. First nine make teams, losers sit.' },
  { id: 'b3', handle: '@jordan_buckets', uid: 'jb', when: '51M AGO', court: 'WATERLOO', text: 'Lights on till 22:00. Full court is open, pull up.' },
];

const SEED_GAMES = [
  { id: 'g1', label: 'W 21 - 15 VS @southside_five', meta: 'VERIFIED · STREET · JUL 12', pending: false },
  { id: 'g2', label: 'L 18 - 21 VS @wolves_d2', meta: 'VERIFIED · LEAGUE · JUL 05', pending: false },
];

function useClock() {
  const [clock, setClock] = React.useState('--:--:--');
  React.useEffect(() => {
    const p = (n) => String(n).padStart(2, '0');
    const tick = () => { const d = new Date(); setClock(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())} LOCAL`); };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return clock;
}

const GEOFENCE = 'NEWTOWN, SYD';

export function WebApp() {
  const [screen, setScreen] = React.useState('radar');
  const [profileId, setProfileId] = React.useState('you');
  const [courtId, setCourtId] = React.useState('c1');
  const [tab, setTab] = React.useState('street');
  const [checkedIn, setCheckedIn] = React.useState(null);
  const [flash, setFlash] = React.useState(false);
  const [games, setGames] = React.useState(SEED_GAMES);
  const [form, setForm] = React.useState({ scoreA: '', scoreB: '', oppHandle: '', gameType: 'STREET' });
  const clock = useClock();

  const court = COURTS.find((c) => c.id === courtId);
  const onCourt = checkedIn ? COURTS.find((c) => c.id === checkedIn) : null;
  const status = onCourt ? `IN_GAME @ ${onCourt.name.split(' ')[0]}` : 'SYS_ACTIVE';
  const patch = (p) => setForm((s) => ({ ...s, ...p }));

  const engage = () => {
    setFlash(true);
    setTimeout(() => { setFlash(false); setCheckedIn(courtId); setScreen('radar'); }, 750);
  };

  const transmit = () => {
    const a = +form.scoreA, b = +form.scoreB;
    const h = form.oppHandle.trim();
    const at = h[0] === '@' ? h : '@' + h;
    setGames((g) => [{ id: 'g' + Date.now(), label: `${a >= b ? 'W' : 'L'} ${a} - ${b} VS ${at}`, meta: `PENDING · ${form.gameType} · TODAY`, pending: true }, ...g]);
    setForm({ scoreA: '', scoreB: '', oppHandle: '', gameType: 'STREET' });
    setProfileId('you');
    setTab('street');
    setScreen('profile');
  };

  const navValue = screen === 'log' ? 'log' : (screen === 'profile' && profileId === 'you' ? 'you' : 'radar');

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
      <AppHeader platform="web" geofence={GEOFENCE} status={status} clock={clock} onLogoClick={() => setScreen('radar')}>
        <SegmentedControl
          padY={10}
          style={{ flex: 'none' }}
          value={navValue}
          onChange={(v) => {
            if (v === 'radar') setScreen('radar');
            else if (v === 'log') setScreen('log');
            else { setProfileId('you'); setTab('street'); setScreen('profile'); }
          }}
          options={[{ value: 'radar', label: 'RADAR' }, { value: 'log', label: 'LOG GAME' }, { value: 'you', label: 'YOU' }]}
        />
      </AppHeader>

      {screen === 'radar' && (
        <WebRadar
          courts={COURTS}
          bulletins={BULLETINS}
          checkedIn={checkedIn}
          onOpenCourt={(id) => { setCourtId(id); setScreen('checkin'); }}
          onOpenProfile={(uid) => { setProfileId(uid); setTab('street'); setScreen('profile'); }}
        />
      )}
      {screen === 'checkin' && <WebCheckIn court={court} geofence={GEOFENCE} onBack={() => setScreen('radar')} onEngage={engage} />}
      {screen === 'profile' && (
        <WebProfile profile={PROFILES[profileId]} games={games} tab={tab} onTab={setTab} onBack={() => setScreen('radar')} onHome={() => setScreen('radar')} />
      )}
      {screen === 'log' && <WebLogGame form={form} onForm={patch} onTransmit={transmit} />}

      <LockFlash visible={flash} />
    </div>
  );
}
