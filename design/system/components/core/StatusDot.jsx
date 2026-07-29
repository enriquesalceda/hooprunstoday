import React from 'react';

/* The only round thing in the system. Pulses forever while the session is live. */
export function StatusDot({ size, pulse = true, style }) {
  return (
    <span style={{
      display: 'inline-block',
      width: size || 'var(--dot-size)',
      height: size || 'var(--dot-size)',
      background: 'var(--text-primary)',
      borderRadius: 'var(--radius-dot)',
      animation: pulse ? 'hr-pulse var(--dur-pulse) infinite' : 'none',
      flex: 'none',
      ...style,
    }} />
  );
}
