import React from 'react';

/* The dashed frame that stands in for absent data. Never hide a section — show that it
   exists and is empty, and say what fills it. */
export function EmptyState({ label, meta, center = false, platform = 'mobile', style }) {
  const web = platform === 'web';
  return (
    <div style={{
      border: 'var(--border-pending)',
      padding: web ? '14px' : '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: center ? 'center' : 'space-between',
      gap: 10,
      ...style,
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: web ? 'var(--mono-6)' : 'var(--mono-5)',
        letterSpacing: center ? 'var(--track-label)' : 'normal',
        color: 'var(--pending-ink)',
      }}>{label}</span>
      {meta && (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: web ? 'var(--mono-2)' : 'var(--mono-1)', color: 'var(--text-faint)', flex: 'none' }}>{meta}</span>
      )}
    </div>
  );
}
