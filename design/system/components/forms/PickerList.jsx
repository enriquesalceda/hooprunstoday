import React from 'react';

/* The expandable option list under a PickerRow. Selection inverts the row.
   Scrolls in place — it never becomes a modal or a native select. */
export function PickerList({ options = [], value, onChange, maxHeight = 232, attached = true, platform = 'mobile', style }) {
  const web = platform === 'web';
  return (
    <div style={{
      border: 'var(--border-hairline)',
      borderTop: attached ? 'none' : 'var(--border-hairline)',
      maxHeight,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <div
            key={o.id}
            onClick={() => onChange && onChange(o.id)}
            style={{
              padding: web ? '13px 14px' : '13px 12px',
              borderBottom: 'var(--border-faint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              cursor: 'pointer',
              background: on ? 'var(--selected-bg)' : 'var(--unselected-bg)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: web ? 'var(--mono-6)' : 'var(--mono-5)',
              color: on ? 'var(--selected-ink)' : 'var(--text-primary)',
            }}>{o.name}</span>
            {o.meta && (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
                fontSize: web ? 'var(--mono-2)' : 'var(--mono-1)',
                color: on ? 'var(--selected-ink)' : 'var(--text-faint)',
                flex: 'none',
              }}>{o.meta}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
