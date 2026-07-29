import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { Chip } from '../../components/core/Chip.jsx';
import { SegmentedControl } from '../../components/navigation/SegmentedControl.jsx';
import { ScoreBlock } from '../../components/data/ScoreBlock.jsx';
import { StatGrid } from '../../components/data/StatGrid.jsx';
import { GameLogRow } from '../../components/data/GameLogRow.jsx';
import { RosterRow } from '../../components/data/RosterRow.jsx';

export function WebProfile({ profile, games = [], tab, onTab, onBack, onHome }) {
  if (!profile) return null;
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '18px var(--gutter-web) 0' }}><BackLink label="RADAR" onClick={onBack} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'var(--portrait-col-web) 1fr', gap: 'var(--space-12)', padding: '18px var(--gutter-web) var(--space-13)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '100%', height: 'var(--portrait-h-web)', background: 'var(--surface-well)', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'grayscale(1) contrast(1.08)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', letterSpacing: 'var(--track-label)' }}>MONO PORTRAIT · GRAYSCALE(1) CONTRAST(1.08)</span>
      </div>
          <div style={{ border: 'var(--border-hairline)', borderTop: 'none', padding: '16px 16px 14px', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-3)', lineHeight: 'var(--lh-display-loose)', color: 'var(--text-primary)' }}>{profile.name}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-4)', color: 'var(--text-secondary)' }}>
              <span>{profile.height}</span>
              <span>{profile.position}</span>
              <span onClick={onHome} style={{ color: 'var(--text-primary)', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>HOME: {profile.home}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)' }}>{profile.subdomain}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <SegmentedControl
            value={tab}
            onChange={onTab}
            options={[{ value: 'street', label: '[ STREET CRED ]' }, { value: 'league', label: '[ LEAGUE STATS ]' }]}
          />
          {tab === 'street' ? (
            <div style={{ padding: 'var(--space-11) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              <ScoreBlock platform="web" value={profile.score} rank={profile.rank} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                {profile.badges.map((b) => <Chip key={b} variant="outline">{b}</Chip>)}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)' }}>
                PEER-VOUCHED CAPABILITIES · {profile.vouches} VOUCHES
              </span>
            </div>
          ) : (
            <div style={{ padding: 'var(--space-11) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              <StatGrid platform="web" stats={[{ value: profile.ppg, label: 'PPG' }, { value: profile.rpg, label: 'RPG' }, { value: profile.apg, label: 'APG' }]} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <SectionLabel>ROSTERS + ACHIEVEMENTS</SectionLabel>
                {profile.teams.map((t) => <RosterRow key={t.name} name={t.name} meta={t.meta} />)}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <SectionLabel>GAME LOG</SectionLabel>
            {games.map((g) => <GameLogRow key={g.id} label={g.label} meta={g.meta} pending={g.pending} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
