import React from 'react';

/* Two or three tiny segments that live inside a FieldRow's frame. Same inversion as
   SegmentedControl, sized to sit flush in a 1px field. */
export function UnitToggle({ options = [], value, onChange, width = 46, style }) {
  return (
    <React.Fragment>
      {options.map((opt) => {
        const on = opt === value;
        return (
          <div
            key={opt}
            onClick={() => onChange && onChange(opt)}
            style={{
              width,
              flex: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: 'var(--mono-2)',
              letterSpacing: 'var(--track-label)',
              cursor: 'pointer',
              userSelect: 'none',
              borderLeft: 'var(--border-interactive)',
              background: on ? 'var(--selected-bg)' : 'var(--unselected-bg)',
              color: on ? 'var(--selected-ink)' : 'var(--unselected-ink)',
              ...style,
            }}
          >{opt}</div>
        );
      })}
    </React.Fragment>
  );
}
