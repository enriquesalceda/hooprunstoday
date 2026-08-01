import React from 'react';

/* Shared score-verification data + state machine. Both kits mount this; only layout differs. */

const SEED_INCOMING = [
  { id: 'p1', by: '@jordan_buckets', them: 21, me: 15, court: 'PRINCE ALFRED PARK', when: '18:40 TODAY', size: '3V3 HALFCOURT', format: 'CASUAL STREET RUN', eligible: 6, left: 2472 },
  { id: 'p2', by: '@tallboy_dee', them: 18, me: 21, court: 'REDFERN COMMUNITY CT', when: '21:05 YESTERDAY', size: '5V5 FULL', format: 'OFFICIAL LEAGUE FIXTURE', eligible: 9, left: 767 },
];
const SEED_CLAIMS = [
  { id: 'm1', vs: '@wolves_d2', me: 11, them: 8, court: 'WATERLOO OVAL', when: '17:20 TODAY', size: '1V1', format: 'CASUAL STREET RUN', left: 2000, nudged: false },
];
const SEED_VOTES = [
  { id: 'v1', court: 'PRINCE ALFRED PARK', when: 'SAT 14:00', size: '3V3 HALFCOURT', left: 5400, myVote: null, eligible: 8,
    a: { who: '@southside_five CLAIM', score: '21 - 19', tally: 3 },
    b: { who: '@newtown_outlaws CLAIM', score: '19 - 21', tally: 2 },
    voters: [
      { handle: '@jordan_buckets', state: 'VOTED' }, { handle: '@tallboy_dee', state: 'VOTED' },
      { handle: '@rim_run_kev', state: 'VOTED' }, { handle: '@a_cross', state: 'NOT VOTED' },
      { handle: '@deep_two', state: 'VOTED' }, { handle: '@YOU', state: 'NOT VOTED' },
    ] },
];
const SEED_SETTLED = [
  { label: '3V3 · W 21 - 15 VS @southside_five', meta: 'VERIFIED · STREET · JUL 12', pending: false },
  { label: '5V5 · L 18 - 21 VS @wolves_d2', meta: 'VERIFIED · LEAGUE · JUL 05', pending: false },
  { label: '1V1 · VOID 11 - 11 VS @deep_two', meta: 'TIED VOTE · NO CRED · JUN 28', pending: true },
];

export const VOUCH_BADGES = ['LOCKDOWN', 'SNIPER', 'GLUE GUY', 'MOTOR', 'HEAT CHECK', 'GLASS CLEANER'];

/* Win 6, verified loss 2, plus one per vouch sent back. Unverified games earn nothing. */
export const CRED = { win: 6, loss: 2 };

export function hms(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  const p = (n) => String(n).padStart(2, '0');
  return h > 0 ? h + 'H ' + p(m) + 'M' : p(m) + ':' + p(s);
}

const clone = (v) => JSON.parse(JSON.stringify(v));

export function useVerifyQueue({ autoVerifyHours = 48, vouchOnConfirm = true, neighborhood = 'NEWTOWN, SYD' } = {}) {
  const [screen, setScreen] = React.useState('profile');
  const [clock, setClock] = React.useState('--:--:--');
  const [selId, setSelId] = React.useState('p1');
  const [voteId, setVoteId] = React.useState(null);
  const [claimId, setClaimId] = React.useState('m1');
  const [counter, setCounter] = React.useState({ mine: '', theirs: '' });
  const [picked, setPicked] = React.useState([]);
  const [streetScore, setStreetScore] = React.useState(875);
  const [incoming, setIncoming] = React.useState(clone(SEED_INCOMING));
  const [claims, setClaims] = React.useState(clone(SEED_CLAIMS));
  const [votes, setVotes] = React.useState(clone(SEED_VOTES));
  const [settled, setSettled] = React.useState(clone(SEED_SETTLED));

  React.useEffect(() => {
    const p = (n) => String(n).padStart(2, '0');
    const tick = () => {
      const d = new Date();
      setClock(p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) + ' LOCAL');
      const dec = (arr) => arr.map((x) => ({ ...x, left: Math.max(0, x.left - 1) }));
      setIncoming(dec);
      setClaims(dec);
      setVotes(dec);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const sel = incoming.find((i) => i.id === selId) || incoming[0] || null;
  const claim = claims.find((c) => c.id === claimId) || claims[0] || null;
  const vote = votes.find((v) => v.id === voteId) || votes[0] || null;
  const waiting = incoming.length + votes.filter((v) => !v.myVote).length;
  const solo = sel && sel.size === '1V1';

  const settle = (vouched) => {
    if (!sel) { setScreen('profile'); return; }
    const won = sel.me > sel.them;
    setSettled((s) => [{
      label: sel.size.split(' ')[0] + ' · ' + (won ? 'W ' : 'L ') + sel.me + ' - ' + sel.them + ' VS ' + sel.by,
      meta: 'VERIFIED BY YOU · ' + (sel.format === 'OFFICIAL LEAGUE FIXTURE' ? 'LEAGUE' : 'STREET') + ' · TODAY',
      pending: false,
    }, ...s]);
    setStreetScore((n) => n + (won ? CRED.win : CRED.loss) + (vouched ? picked.length : 0));
    setIncoming((arr) => arr.filter((i) => i.id !== sel.id));
    setPicked([]);
    setScreen('profile');
  };

  return {
    screen, go: setScreen, clock, neighborhood,
    waitingLabel: waiting > 0 ? waiting + ' WAITING' : 'SYS_ACTIVE',
    waitingCount: waiting,
    streetScore,

    incoming: incoming.map((i) => ({
      id: i.id, by: i.by,
      score: i.them + ' - ' + i.me,
      verdict: i.me > i.them ? 'YOU WON' : (i.me === i.them ? 'TIED' : 'YOU LOST'),
      meta: i.size + ' · ' + i.court + ' · AUTO-VERIFIES IN ' + hms(i.left),
      when: i.when,
      open: () => { setSelId(i.id); setScreen('verify'); },
    })),
    claims: claims.map((c) => ({
      id: c.id,
      label: c.size + ' · ' + (c.me >= c.them ? 'W ' : 'L ') + c.me + ' - ' + c.them + ' VS ' + c.vs,
      meta: (c.nudged ? 'NUDGED · ' : 'PENDING · ') + hms(c.left) + ' LEFT',
      open: () => { setClaimId(c.id); setScreen('claim'); },
    })),
    votes: votes.map((v) => ({
      id: v.id,
      label: v.myVote ? 'YOU VOTED · AWAITING CLOSE' : 'YOUR VOTE IS NEEDED',
      sublabel: v.a.score + ' VS ' + v.b.score + ' · CLOSES IN ' + hms(v.left),
      meta: v.court,
      open: () => { setVoteId(v.id); setScreen('vote'); },
    })),
    settled,

    sel: sel ? {
      by: sel.by, size: sel.size, court: sel.court,
      score: sel.them + ' - ' + sel.me,
      verdict: sel.me > sel.them ? 'YOU WON' : (sel.me === sel.them ? 'TIED' : 'YOU LOST'),
      facts: [
        { term: 'CLAIMED BY', value: sel.by },
        { term: 'FORMAT', value: sel.size },
        { term: 'FIXTURE', value: sel.format },
        { term: 'COURT', value: sel.court },
        { term: 'PLAYED', value: sel.when },
        { term: 'ELIGIBLE VERIFIERS', value: solo ? 'YOU + ' + (sel.eligible - 1) + ' WITNESSES' : sel.eligible + ' ON COURT' },
        { term: 'AUTO-VERIFIES IN', value: hms(sel.left) },
      ],
    } : null,
    verifyNote: 'ANY PLAYER CHECKED IN AT THAT COURT CAN VERIFY. SILENCE VERIFIES IT AFTER ' + autoVerifyHours + ' HOURS.',
    confirm: () => { if (vouchOnConfirm) { setPicked([]); setScreen('vouch'); } else settle(false); },
    openDispute: () => { setCounter({ mine: '', theirs: '' }); setScreen('dispute'); },

    badges: VOUCH_BADGES,
    picked,
    toggleBadge: (b) => setPicked((c) => (c.indexOf(b) === -1 ? c.concat([b]) : c.filter((x) => x !== b))),
    vouchHint: picked.length
      ? 'SENDS ' + picked.length + ' VOUCH' + (picked.length === 1 ? '' : 'ES') + ' TO ' + (sel ? sel.by : '') + ' · BADGES UNLOCK AT 3 EACH'
      : 'A VOUCH IS WORTH MORE THAN A WIN. PICK ONLY WHAT YOU ACTUALLY SAW.',
    sendVouch: () => { if (picked.length) settle(true); },
    skipVouch: () => settle(false),

    counter,
    setCounterPart: (part, v) => setCounter((c) => ({ ...c, [part]: v.replace(/[^0-9]/g, '') })),
    counterOk: counter.mine !== '' && counter.theirs !== '',
    counterMineLabel: solo ? 'YOU' : 'YOUR SQUAD',
    counterTheirsLabel: solo ? (sel ? sel.by : 'THEM') : 'THEIR SQUAD',
    disputeHint: (counter.mine !== '' && counter.theirs !== '')
      ? (solo
        ? 'OPENS A COURT VOTE · NO CAPTAINS IN A 1V1, SO ' + (sel.eligible - 1) + ' WITNESSES DECIDE'
        : 'OPENS A COURT VOTE · ' + (sel ? sel.eligible : 0) + ' PLAYERS ON COURT THAT RUN DECIDE')
      : 'ENTER BOTH SCORES · YOUR NUMBER GOES UP BESIDE THEIRS',
    submitCounter: () => {
      if (!sel || counter.mine === '' || counter.theirs === '') return;
      const nv = {
        id: 'v' + Date.now(), court: sel.court, when: sel.when, size: sel.size,
        left: autoVerifyHours * 3600, eligible: sel.eligible, myVote: null,
        a: { who: sel.by + ' CLAIM', score: sel.them + ' - ' + sel.me, tally: 0 },
        b: { who: 'YOUR CLAIM', score: counter.theirs + ' - ' + counter.mine, tally: 0 },
        voters: [
          { handle: sel.by, state: 'VOTED' }, { handle: '@YOU', state: 'VOTED' },
          { handle: '@rim_run_kev', state: 'NOT VOTED' }, { handle: '@a_cross', state: 'NOT VOTED' },
          { handle: '@deep_two', state: 'NOT VOTED' },
        ],
      };
      setIncoming((arr) => arr.filter((i) => i.id !== sel.id));
      setVotes((arr) => [nv, ...arr]);
      setVoteId(nv.id);
      setCounter({ mine: '', theirs: '' });
      setScreen('vote');
    },

    vote: vote ? {
      court: vote.court, size: vote.size, left: hms(vote.left), eligible: vote.eligible, myVote: vote.myVote,
      sides: ['a', 'b'].map((k) => ({
        key: k, who: vote[k].who, score: vote[k].score,
        tally: vote[k].tally + (vote.myVote === k ? 1 : 0),
        selected: vote.myVote === k,
      })),
      voters: vote.voters,
    } : null,
    castVote: (k) => setVotes((arr) => arr.map((v) => (v.id === (vote && vote.id) && !v.myVote
      ? { ...v, myVote: k, voters: v.voters.map((p) => (p.handle === '@YOU' ? { handle: p.handle, state: 'VOTED' } : p)) }
      : v))),
    voteHint: vote && vote.myVote ? 'YOUR VOTE IS IN · MAJORITY AT CLOSE SETTLES THE SCORE' : 'TAP THE SCORE YOU SAW',

    claim: claim ? {
      vs: claim.vs, score: claim.me + ' - ' + claim.them, nudged: claim.nudged,
      facts: [
        { term: claim.size === '1V1' ? 'OPPONENT' : 'OPP CAPTAIN', value: claim.vs },
        { term: 'FORMAT', value: claim.size },
        { term: 'FIXTURE', value: claim.format },
        { term: 'COURT', value: claim.court },
        { term: 'PLAYED', value: claim.when },
        { term: 'AUTO-VERIFIES IN', value: hms(claim.left) },
      ],
      note: claim.nudged
        ? 'NUDGED ONCE. ONE PING IS ALL YOU GET — SILENCE STILL VERIFIES IT IN ' + hms(claim.left) + '.'
        : 'IT VERIFIES ITSELF IN ' + hms(claim.left) + ' IF THEY STAY QUIET. NUDGE ONCE IF YOU WANT IT SOONER.',
    } : null,
    nudge: () => setClaims((arr) => arr.map((c) => (c.id === claimId ? { ...c, nudged: true } : c))),
    withdraw: () => { setClaims((arr) => arr.filter((c) => c.id !== claimId)); setScreen('profile'); },

    inbox: [
      ...incoming.map((i) => ({
        kind: 'SCORE CLAIM', when: hms(i.left) + ' LEFT', actionable: true,
        text: i.by + ' logged a ' + i.size + ' ' + i.them + ' - ' + i.me + ' against you at ' + i.court + '.',
        open: () => { setSelId(i.id); setScreen('verify'); },
      })),
      ...votes.filter((v) => !v.myVote).map((v) => ({
        kind: 'COURT VOTE', when: hms(v.left) + ' LEFT', actionable: true,
        text: 'Two squads claim different scores at ' + v.court + '. You were on court — break the tie.',
        open: () => { setVoteId(v.id); setScreen('vote'); },
      })),
      { kind: 'VOUCH', when: '2H AGO', actionable: false, text: '@rim_run_kev vouched you for LOCKDOWN. That is 61 vouches.' },
      { kind: 'RUN ALERT', when: '5H AGO', actionable: false, text: 'Six on court at Prince Alfred Park. Next run is 3v3 halfcourt.' },
    ],
    inboxSummary: waiting > 0 ? waiting + ' NEED A RESPONSE' : 'NOTHING NEEDS YOU',

    restart: () => {
      setScreen('profile'); setSelId('p1'); setVoteId(null); setClaimId('m1');
      setCounter({ mine: '', theirs: '' }); setPicked([]); setStreetScore(875);
      setIncoming(clone(SEED_INCOMING)); setClaims(clone(SEED_CLAIMS));
      setVotes(clone(SEED_VOTES)); setSettled(clone(SEED_SETTLED));
    },
  };
}
