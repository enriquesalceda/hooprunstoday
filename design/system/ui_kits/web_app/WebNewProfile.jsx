import React from 'react';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { Chip } from '../../components/core/Chip.jsx';
import { SegmentedControl } from '../../components/navigation/SegmentedControl.jsx';
import { StatGrid } from '../../components/data/StatGrid.jsx';
import { EmptyState } from '../../components/data/EmptyState.jsx';

export function WebNewProfile({ flow }) {
  const p = flow.profile;
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <SectionLabel style={{ padding: '18px var(--gutter-web) 0' }}>RECORD CREATED · {flow.createdStamp}</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'var(--portrait-col-web) 1fr', gap: 'var(--space-12)', padding: '18px var(--gutter-web) var(--space-13)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '100%', height: 'var(--portrait-h-web)', background: 'var(--surface-well)', filter: 'grayscale(1) contrast(1.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', letterSpacing: 'var(--track-label)' }}>MONO PORTRAIT</span>
          </div>
          <div style={{ border: 'var(--border-hairline)', borderTop: 'none', padding: '16px 16px 14px', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 42, lineHeight: 'var(--lh-display-loose)', color: 'var(--text-primary)' }}>{p.name}</span>
              <Chip variant="pending" style={{ flex: 'none', marginTop: 4 }}>UNVOUCHED</Chip>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-4)', color: 'var(--text-secondary)' }}>
              <span>{p.height}</span>
              <span>{p.positions}</span>
              <span style={{ color: 'var(--text-primary)', textDecoration: 'underline', textUnderlineOffset: 3 }}>HOME: {p.home}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)' }}>{p.subdomain}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <SegmentedControl
            value={flow.tab}
            onChange={flow.setTab}
            options={[{ value: 'street', label: '[ STREET CRED ]' }, { value: 'league', label: '[ LEAGUE STATS ]' }]}
          />
          {flow.tab === 'street' ? (
            <div style={{ padding: 'var(--space-11) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-8)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-8)', lineHeight: 'var(--lh-display-tight)', color: 'var(--text-primary)' }}>000</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', paddingBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)' }}>STREET SCORE</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-7)', color: 'var(--text-primary)' }}>RANK: UNRANKED</span>
                </div>
              </div>
              <div style={{ border: 'var(--border-hairline)', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-4)', letterSpacing: 'var(--track-label)', color: 'var(--text-primary)' }}>CRED IS EARNED ON COURT</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-5)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>CHECK IN AT A COURT. RUN. GET VOUCHED BY THE PLAYERS YOU GUARDED. BADGES UNLOCK AT 3 VOUCHES EACH.</span>
              </div>
              <EmptyState platform="web" label="NO BADGES YET" center />
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)' }}>PEER-VOUCHED CAPABILITIES · 0 VOUCHES</span>
            </div>
          ) : (
            <div style={{ padding: 'var(--space-11) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              <StatGrid platform="web" stats={[{ value: '--', label: 'PPG' }, { value: '--', label: 'RPG' }, { value: '--', label: 'APG' }]} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <SectionLabel>ROSTERS + ACHIEVEMENTS</SectionLabel>
                <EmptyState platform="web" label={p.rosterLabel} meta={p.rosterMeta} />
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <SectionLabel>GAME LOG</SectionLabel>
            <EmptyState platform="web" label="NO GAMES LOGGED" meta="LOG A SCORE TO OPEN YOUR RECORD" />
          </div>
        </div>
      </div>
    </div>
  );
}
