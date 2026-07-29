import React from 'react';

/* The lockup, rebuilt to the brand-sheet construction values. Prefer the PNG/SVG
   files in assets/ for print or anywhere the exact file is available. */
export function Logo({ variant = 'stacked', tone = 'paper', size = 48, showBar = true, style }) {
  const ink = tone === 'ink' ? 'var(--ink-900)' : 'var(--paper-000)';
  const barInk = tone === 'ink' ? 'var(--paper-000)' : 'var(--ink-900)';
  const stacked = variant === 'stacked';
  const word = {
    fontFamily: 'var(--font-display)',
    fontWeight: 400,
    fontSize: size,
    lineHeight: stacked ? 'var(--lh-logo)' : 1,
    letterSpacing: stacked ? 'var(--track-logo)' : 'normal',
    color: ink,
  };
  const barBase = {
    background: ink,
    color: barInk,
    fontFamily: 'var(--font-ui)',
    fontWeight: 700,
    borderRadius: 'var(--radius-none)',
  };

  if (!stacked) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.27), ...style }}>
        <span style={word}>HOOPRUNS</span>
        {showBar && (
          <span style={{
            ...barBase,
            fontSize: size * 0.333,
            letterSpacing: 'var(--track-bar)',
            padding: `${size * 0.15}px ${size * 0.1}px ${size * 0.15}px ${size * 0.267}px`,
          }}>.TODAY</span>
        )}
      </span>
    );
  }

  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', ...style }}>
      <span style={word}>HOOP</span>
      <span style={word}>RUNS</span>
      {showBar && (
        <span style={{
          ...barBase,
          marginTop: size * 0.128,
          textAlign: 'center',
          fontSize: size * 0.154,
          letterSpacing: 'var(--track-bar-lg)',
          padding: `${size * 0.085}px 0 ${size * 0.085}px ${size * 0.064}px`,
        }}>.TODAY</span>
      )}
    </span>
  );
}
