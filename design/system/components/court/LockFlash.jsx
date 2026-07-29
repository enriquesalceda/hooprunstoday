import React from 'react';

/* The payoff. Full-viewport white, 750ms, then the app cuts back to Radar. */
export function LockFlash({ visible = false, text = 'LOCKED.', size = 'var(--display-9)', style }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 60,
      background: 'var(--surface-inverted)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: size, color: 'var(--text-on-inverted)' }}>{text}</span>
    </div>
  );
}
