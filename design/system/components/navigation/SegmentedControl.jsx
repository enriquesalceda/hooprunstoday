import React from 'react';

/* The one selection pattern in the product: selected inverts to white, unselected is
   transparent + muted, segments divided by 1px. Drives tabs, bottom nav, format pickers. */
export function SegmentedControl({ options = [], value, onChange, frame = 'box', padY = 13, fontSize = 'var(--mono-4)', tracking = 'var(--track-nav)', style }) {
  const [hover, setHover] = React.useState(null);
  const frames = {
    box: { border: 'var(--border-interactive)' },
    top: { borderTop: 'var(--border-interactive)' },
    none: {},
  };
  return (
    <div style={{ display: 'flex', ...frames[frame], ...style }}>
      {options.map((opt, i) => {
        const selected = opt.value === value;
        const hot = hover === opt.value && !selected;
        return (
          <div
            key={opt.value}
            role="button"
            onClick={() => onChange && onChange(opt.value)}
            onMouseEnter={() => setHover(opt.value)}
            onMouseLeave={() => setHover(null)}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: `${padY}px 4px`,
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize,
              letterSpacing: tracking,
              textTransform: 'uppercase',
              cursor: 'pointer',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              background: selected ? 'var(--selected-bg)' : 'var(--unselected-bg)',
              color: selected ? 'var(--selected-ink)' : (hot ? 'var(--hover-ink)' : 'var(--unselected-ink)'),
              borderLeft: i === 0 ? 'none' : 'var(--border-interactive)',
            }}
          >{opt.label}</div>
        );
      })}
    </div>
  );
}
