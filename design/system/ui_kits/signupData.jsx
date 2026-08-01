import React from 'react';
import { maskEmail } from '../components/forms/EmailField.jsx';

/* Shared sign-up data + state machine. Both kits mount the same flow; only layout differs.
   Auth is a Clerk email OTP — there is no phone number anywhere in this product. */

export const POSITIONS = ['POINT GUARD', 'SHOOTING GUARD', 'WING', 'FORWARD', 'CENTER'];

export const ROSTERS = [
  { id: 't1', name: 'NEWTOWN OUTLAWS', meta: 'DIV II' },
  { id: 't2', name: 'WATERLOO WRECKERS', meta: 'DIV III' },
  { id: 't3', name: 'REDFERN ALL-DAY', meta: 'DIV II' },
];

export const SIGNUP_COURTS = [
  { id: 'c1', name: 'PRINCE ALFRED PARK', distanceKm: '0.4', onCourtCount: 14, type: 'OUTDOOR' },
  { id: 'c2', name: 'WATERLOO OVAL', distanceKm: '1.2', onCourtCount: 6, type: 'OUTDOOR' },
  { id: 'c3', name: 'REDFERN COMMUNITY CT', distanceKm: '2.1', onCourtCount: 0, type: 'INDOOR' },
];

/* Demo only — the real check is a server call. */
export const TAKEN_HANDLES = ['jordan', 'buckets', 'dee', 'admin', 'hoopruns', 'test'];

export const GEOFENCE_FACTS = [
  { term: 'COURT CHECK-IN', value: 'REQUIRES PROXIMITY MATCH' },
  { term: 'BROWSING COURTS', value: 'WORKS WITHOUT LOCATION' },
  { term: 'BACKGROUND TRACKING', value: 'NEVER' },
  { term: 'STORED HISTORY', value: 'CHECK-INS ONLY' },
];

const digits = (v) => v.replace(/[^0-9]/g, '');
const emailValid = (v) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(v.trim());
const slug = (v) => v.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

export function useSignupForm({ handleCheckMs = 600, resendSeconds = 28, neighborhood = 'NEWTOWN, SYD' } = {}) {
  const [screen, setScreen] = React.useState('identity');
  const [clock, setClock] = React.useState('--:--:--');
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [rejected, setRejected] = React.useState(false);
  const [attempts, setAttempts] = React.useState(3);
  const [resendIn, setResendIn] = React.useState(resendSeconds);
  const [realName, setRealName] = React.useState('');
  const [handle, setHandle] = React.useState('');
  const [checking, setChecking] = React.useState(false);
  const [dob, setDob] = React.useState({ day: '', month: '', year: '' });
  const [height, setHeight] = React.useState('');
  const [unit, setUnit] = React.useState('FT');
  const [picked, setPicked] = React.useState([]);
  const [homeCourtId, setHomeCourtId] = React.useState(null);
  const [rosterOpen, setRosterOpen] = React.useState(false);
  const [rosterId, setRosterId] = React.useState(null);
  const [located, setLocated] = React.useState(false);
  const [tab, setTab] = React.useState('street');
  const [createdStamp, setCreatedStamp] = React.useState('');
  const handleTimer = React.useRef(null);
  const codeTimer = React.useRef(null);

  React.useEffect(() => {
    const p = (n) => String(n).padStart(2, '0');
    const tick = () => { const d = new Date(); setClock(p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) + ' LOCAL'); };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    if (screen !== 'code' || resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [screen, resendIn]);

  React.useEffect(() => () => { clearTimeout(handleTimer.current); clearTimeout(codeTimer.current); }, []);

  const home = SIGNUP_COURTS.find((c) => c.id === homeCourtId);
  const roster = ROSTERS.find((t) => t.id === rosterId);
  const locked = attempts <= 0;
  const h = slug(handle);
  const handleState = h.length === 0 ? 'empty' : (h.length < 3 ? 'short' : (checking ? 'checking' : (TAKEN_HANDLES.indexOf(h) === -1 ? 'free' : 'taken')));
  const dobDone = dob.day.length === 2 && dob.month.length === 2 && dob.year.length === 4;
  const missing = [];
  if (slug(realName).length < 2) missing.push('REAL NAME');
  if (handleState !== 'free') missing.push('HANDLE');
  if (!dobDone) missing.push('DATE OF BIRTH');
  if (!height.trim()) missing.push('HEIGHT');
  if (!picked.length) missing.push('POSITION');
  if (!homeCourtId) missing.push('HOME COURT');
  const formOk = missing.length === 0;

  return {
    screen, go: setScreen, clock, neighborhood,
    sysStatus: located ? 'SYS_ACTIVE' : 'SYS_STANDBY',
    geoLabel: located ? neighborhood : 'PENDING',

    email,
    setEmail: (v) => setEmail(v.replace(/\s/g, '')),
    emailOk: emailValid(email),
    emailHint: emailValid(email)
      ? 'READY · ONE-TIME CODE, NO PASSWORD TO FORGET'
      : 'YOUR EMAIL NEVER APPEARS ON YOUR PROFILE.',
    emailMasked: maskEmail(email),
    sendCode: () => { setScreen('code'); setCode(''); setRejected(false); setResendIn(resendSeconds); },

    code, codeState: locked ? 'locked' : (rejected ? 'error' : 'default'),
    setCode: (v) => {
      if (locked) return;
      setCode(v);
      setRejected(false);
      clearTimeout(codeTimer.current);
      if (v.length === 6) {
        codeTimer.current = setTimeout(() => {
          if (v === '000000') { setRejected(true); setAttempts((a) => Math.max(0, a - 1)); setCode(''); }
          else { setScreen('record'); setRejected(false); }
        }, 260);
      }
    },
    codeHint: locked
      ? 'TOO MANY ATTEMPTS · REQUEST A NEW CODE'
      : (rejected
        ? 'CODE REJECTED · ' + attempts + (attempts === 1 ? ' ATTEMPT LEFT' : ' ATTEMPTS LEFT')
        : (code.length === 6 ? 'VERIFYING…' : '6 DIGITS · PASTE OR TYPE')),
    codeHintTone: locked ? 'strong' : (rejected ? 'muted' : (code.length === 6 ? 'strong' : 'faint')),
    resendIn,
    resendLabel: resendIn > 0 ? 'RESEND CODE IN 0:' + String(resendIn).padStart(2, '0') : 'RESEND CODE',
    resend: () => { if (resendIn <= 0) { setResendIn(resendSeconds); setCode(''); setRejected(false); setAttempts(3); } },

    realName, setRealName: (v) => setRealName(v.toUpperCase()),
    handle,
    setHandle: (v) => {
      setHandle(v.toLowerCase());
      setChecking(true);
      clearTimeout(handleTimer.current);
      handleTimer.current = setTimeout(() => setChecking(false), handleCheckMs);
    },
    handleState,
    handleStatus: {
      empty: '3–20 CHARACTERS · LOWERCASE, NUMBERS, UNDERSCORE',
      short: 'TOO SHORT · MINIMUM 3 CHARACTERS',
      checking: 'CHECKING AVAILABILITY…',
      taken: 'TAKEN · TRY ' + h + '_hoops',
      free: 'AVAILABLE · ' + h + '.hoopruns.today',
    }[handleState],
    subdomainPreview: handleState === 'free' ? h + '.hoopruns.today' : 'HANDLE PENDING',
    dob, setDobPart: (part, v) => setDob((d) => ({ ...d, [part]: v })),
    height, setHeight: (v) => setHeight(v.toUpperCase()),
    unit, setUnit,
    heightPlaceholder: unit === 'FT' ? "6'2\"" : '188',
    positions: POSITIONS, picked,
    togglePosition: (p) => setPicked((cur) => (cur.indexOf(p) === -1 ? cur.concat([p]) : cur.filter((x) => x !== p))),
    courts: SIGNUP_COURTS, homeCourtId, home,
    pickCourt: (id) => { setHomeCourtId(id); setScreen('record'); },
    rosters: ROSTERS, rosterOpen, roster, rosterId,
    toggleRoster: () => setRosterOpen((o) => !o),
    pickRoster: (id) => { setRosterId((cur) => (cur === id ? null : id)); setRosterOpen(false); },
    rosterNote: roster
      ? 'LINKED · STATS SYNC PENDING · PPG/RPG/APG APPEAR AFTER FIRST SYNC'
      : 'LINK A ROSTER TO SYNC LEAGUE STATS. SKIP IT AND STREET CRED STANDS ALONE.',

    formOk,
    recordHint: formOk ? 'READY · CREATES ' + h + '.hoopruns.today' : 'STILL NEEDED: ' + missing.join(' · '),
    createRecord: () => {
      if (!formOk) return;
      const p = (n) => String(n).padStart(2, '0');
      const d = new Date();
      setCreatedStamp(p(d.getHours()) + ':' + p(d.getMinutes()) + ' TODAY');
      setScreen('geofence');
    },

    facts: GEOFENCE_FACTS,
    located,
    grantLocation: () => { setLocated(true); setScreen('profile'); setTab('street'); },
    skipLocation: () => { setLocated(false); setScreen('profile'); setTab('street'); },

    tab, setTab, createdStamp: createdStamp || 'JUST NOW',
    profile: {
      name: realName || 'NEW PLAYER',
      height: height || '—',
      positions: picked.length ? picked.join(' / ') : '—',
      home: home ? home.name : 'UNSET',
      subdomain: h ? h + '.hoopruns.today' : 'handle.hoopruns.today',
      rosterLabel: roster ? roster.name : 'NO LEAGUE TEAM LINKED',
      rosterMeta: roster ? 'STATS SYNC PENDING' : 'LINK ONE IN SETTINGS',
    },

    restart: () => {
      setScreen('identity'); setEmail('');
      setCode(''); setRejected(false); setAttempts(3); setResendIn(resendSeconds);
      setRealName(''); setHandle(''); setChecking(false); setDob({ day: '', month: '', year: '' });
      setHeight(''); setUnit('FT'); setPicked([]); setHomeCourtId(null);
      setRosterOpen(false); setRosterId(null); setLocated(false); setTab('street'); setCreatedStamp('');
    },
  };
}
