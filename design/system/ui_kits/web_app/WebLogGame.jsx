import React from 'react';
import { SegmentedControl } from '../../components/navigation/SegmentedControl.jsx';
import { ScoreInput } from '../../components/forms/ScoreInput.jsx';
import { FieldRow } from '../../components/forms/FieldRow.jsx';
import { Button } from '../../components/core/Button.jsx';

export function WebLogGame({ form, onForm, onTransmit }) {
  const handle = form.oppHandle.trim();
  const ready = form.scoreA !== '' && form.scoreB !== '' && handle.length > 1;
  const at = handle[0] === '@' ? handle : '@' + handle;
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 'var(--form-col-web)', maxWidth: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-12) var(--gutter-web) var(--space-14)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-5)', lineHeight: 'var(--lh-display-loose)', color: 'var(--text-primary)' }}>POST-GAME RECORD</span>
        <span style={{ paddingTop: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)' }}>
          SCORE TRANSACTION · REQUIRES OPPONENT VERIFICATION
        </span>
        <SegmentedControl
          style={{ marginTop: 'var(--space-10)' }}
          tracking="var(--track-label)"
          value={form.gameType}
          onChange={(v) => onForm({ gameType: v })}
          options={[{ value: 'STREET', label: 'CASUAL STREET RUN' }, { value: 'LEAGUE', label: 'OFFICIAL LEAGUE FIXTURE' }]}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
          <ScoreInput platform="web" label="TEAM A (YOUR SQUAD)" value={form.scoreA} onChange={(v) => onForm({ scoreA: v })} />
          <ScoreInput platform="web" label="TEAM B (OPPONENTS)" value={form.scoreB} onChange={(v) => onForm({ scoreB: v })} />
        </div>
        <FieldRow platform="web" style={{ marginTop: 'var(--space-6)' }} label="OPP CAPTAIN" placeholder="@handle" value={form.oppHandle} onChange={(v) => onForm({ oppHandle: v })} />
        <span style={{ marginTop: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)' }}>
          {ready ? `READY · WRITES PENDING TX · PINGS ${at}` : 'ENTER BOTH SCORES + OPPOSING CAPTAIN HANDLE'}
        </span>
        <Button style={{ marginTop: 'var(--space-12)' }} height="var(--button-h-web)" disabled={!ready} onClick={onTransmit}>TRANSMIT SCORE DATA</Button>
      </div>
    </div>
  );
}
