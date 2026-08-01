import React from 'react';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { Chip } from '../../components/core/Chip.jsx';
import { FieldRow } from '../../components/forms/FieldRow.jsx';
import { DateField } from '../../components/forms/DateField.jsx';
import { UnitToggle } from '../../components/forms/UnitToggle.jsx';
import { PickerRow } from '../../components/forms/PickerRow.jsx';
import { PickerList } from '../../components/forms/PickerList.jsx';
import { Button } from '../../components/core/Button.jsx';

export function MobileSignUpRecord({ flow }) {
  const gutter = { margin: '12px var(--gutter-mobile) 0' };
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <span style={{ padding: '18px var(--gutter-mobile) 0', fontFamily: 'var(--font-display)', fontSize: 'var(--display-3)', lineHeight: 'var(--lh-display)', color: 'var(--text-primary)' }}>PLAYER<br />RECORD</span>
      <SectionLabel style={{ padding: '8px var(--gutter-mobile) 0' }}>WRITES TO YOUR PUBLIC PROFILE · {flow.subdomainPreview}</SectionLabel>

      <SectionLabel style={{ padding: '20px var(--gutter-mobile) 0' }}>PORTRAIT</SectionLabel>
      <div style={{ margin: '8px var(--gutter-mobile) 0', height: 200, flex: 'none', background: 'var(--surface-well)', filter: 'grayscale(1) contrast(1.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', letterSpacing: 'var(--track-label)' }}>DROP A MONO PORTRAIT</span>
      </div>
      <span style={{ margin: '8px var(--gutter-mobile) 0', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)' }}>SHOT IN MONO · FACE VISIBLE · NO TEAM KIT REQUIRED</span>

      <FieldRow style={{ margin: '20px var(--gutter-mobile) 0' }} label="REAL NAME" placeholder="JORDAN MILLER" value={flow.realName} onChange={flow.setRealName} />
      <FieldRow style={gutter} label="@HANDLE" placeholder="jordan_miller" value={flow.handle} onChange={flow.setHandle} />
      <span style={{ margin: '8px var(--gutter-mobile) 0', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-1)', color: flow.handleState === 'free' ? 'var(--text-primary)' : 'var(--pending-ink)' }}>{flow.handleStatus}</span>

      <DateField style={{ margin: '16px var(--gutter-mobile) 0' }} day={flow.dob.day} month={flow.dob.month} year={flow.dob.year} onChange={flow.setDobPart} />
      <FieldRow
        style={gutter}
        label="HEIGHT"
        placeholder={flow.heightPlaceholder}
        value={flow.height}
        onChange={flow.setHeight}
        trailing={<UnitToggle options={['FT', 'CM']} value={flow.unit} onChange={flow.setUnit} />}
      />

      <SectionLabel style={{ padding: '20px var(--gutter-mobile) 0' }}>POSITION · SELECT ALL THAT APPLY</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', margin: '10px var(--gutter-mobile) 0' }}>
        {flow.positions.map((p) => (
          <Chip key={p} variant="outline" selected={flow.picked.indexOf(p) !== -1} onClick={() => flow.togglePosition(p)}>{p}</Chip>
        ))}
      </div>

      <PickerRow style={{ margin: '20px var(--gutter-mobile) 0' }} label="HOME COURT" value={flow.home && flow.home.name} glyph="→" onClick={() => flow.go('courtpick')} />
      <PickerRow style={gutter} label="LEAGUE TEAM" placeholder="OPTIONAL" value={flow.roster && flow.roster.name} glyph={flow.rosterOpen ? '↑' : '↓'} onClick={flow.toggleRoster} />
      {flow.rosterOpen && (
        <PickerList style={{ margin: '0 var(--gutter-mobile)' }} options={flow.rosters} value={flow.rosterId} onChange={flow.pickRoster} maxHeight={180} />
      )}
      <span style={{ margin: '8px var(--gutter-mobile) 0', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)', lineHeight: 1.5 }}>{flow.rosterNote}</span>

      <span style={{ margin: '20px var(--gutter-mobile) 0', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)', lineHeight: 1.5 }}>{flow.recordHint}</span>
      <Button style={{ margin: '12px var(--gutter-mobile) var(--space-9)' }} disabled={!flow.formOk} onClick={flow.createRecord}>CREATE PLAYER RECORD</Button>
    </div>
  );
}
