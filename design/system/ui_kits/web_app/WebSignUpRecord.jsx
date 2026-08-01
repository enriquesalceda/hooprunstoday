import React from 'react';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { Chip } from '../../components/core/Chip.jsx';
import { FieldRow } from '../../components/forms/FieldRow.jsx';
import { DateField } from '../../components/forms/DateField.jsx';
import { UnitToggle } from '../../components/forms/UnitToggle.jsx';
import { PickerRow } from '../../components/forms/PickerRow.jsx';
import { PickerList } from '../../components/forms/PickerList.jsx';
import { Button } from '../../components/core/Button.jsx';

export function WebSignUpRecord({ flow }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 1000, maxWidth: '100%', boxSizing: 'border-box', padding: 'var(--space-12) var(--gutter-web) var(--space-14)', display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-5)', lineHeight: 'var(--lh-display-loose)', color: 'var(--text-primary)' }}>PLAYER RECORD</span>
        <SectionLabel style={{ paddingTop: 'var(--space-4)' }}>WRITES TO YOUR PUBLIC PROFILE · {flow.subdomainPreview}</SectionLabel>

        <div style={{ display: 'grid', gridTemplateColumns: 'var(--portrait-col-web) 1fr', gap: 'var(--space-12)', paddingTop: 'var(--space-11)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <SectionLabel>PORTRAIT</SectionLabel>
            <div style={{ width: '100%', height: 'var(--portrait-h-web)', background: 'var(--surface-well)', filter: 'grayscale(1) contrast(1.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', letterSpacing: 'var(--track-label)' }}>DROP A MONO PORTRAIT</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', lineHeight: 1.6 }}>SHOT IN MONO · FACE VISIBLE · NO TEAM KIT REQUIRED</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', minWidth: 0 }}>
            <FieldRow platform="web" label="REAL NAME" placeholder="JORDAN MILLER" value={flow.realName} onChange={flow.setRealName} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <FieldRow platform="web" label="@HANDLE" placeholder="jordan_miller" value={flow.handle} onChange={flow.setHandle} />
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-2)', color: flow.handleState === 'free' ? 'var(--text-primary)' : 'var(--pending-ink)' }}>{flow.handleStatus}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
              <DateField platform="web" day={flow.dob.day} month={flow.dob.month} year={flow.dob.year} onChange={flow.setDobPart} />
              <FieldRow
                platform="web"
                label="HEIGHT"
                placeholder={flow.heightPlaceholder}
                value={flow.height}
                onChange={flow.setHeight}
                trailing={<UnitToggle options={['FT', 'CM']} value={flow.unit} onChange={flow.setUnit} width={48} />}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingTop: 'var(--space-3)' }}>
              <SectionLabel>POSITION · SELECT ALL THAT APPLY</SectionLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                {flow.positions.map((p) => (
                  <Chip key={p} variant="outline" selected={flow.picked.indexOf(p) !== -1} onClick={() => flow.togglePosition(p)}>{p}</Chip>
                ))}
              </div>
            </div>

            <PickerRow platform="web" style={{ marginTop: 'var(--space-3)' }} label="HOME COURT" value={flow.home && flow.home.name} glyph="→" onClick={() => flow.go('courtpick')} />
            <PickerRow platform="web" label="LEAGUE TEAM" placeholder="OPTIONAL" value={flow.roster && flow.roster.name} glyph={flow.rosterOpen ? '↑' : '↓'} onClick={flow.toggleRoster} />
            {flow.rosterOpen && (
              <PickerList platform="web" attached={false} maxHeight={180} options={flow.rosters} value={flow.rosterId} onChange={flow.pickRoster} />
            )}
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', lineHeight: 1.6 }}>{flow.rosterNote}</span>
          </div>
        </div>

        <span style={{ paddingTop: 'var(--space-11)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', lineHeight: 1.6 }}>{flow.recordHint}</span>
        <Button style={{ marginTop: 'var(--space-5)' }} height="var(--button-h-web)" disabled={!flow.formOk} onClick={flow.createRecord}>CREATE PLAYER RECORD</Button>
      </div>
    </div>
  );
}
