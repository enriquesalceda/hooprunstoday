import React from 'react';
import { StatusDot } from './StatusDot.jsx';

/* The header's instrument cluster. Never wraps — the clock ticks every second. */
export function Telemetry({ geofence, status, clock, style }) {
  const item = { whiteSpace: 'nowrap' };
  return (
    <div style={{
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: 'var(--mono-2)',
      color: 'var(--text-faint)',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {geofence && <span style={item}>GEOFENCE: {geofence}</span>}
      {status && (
        <span style={{ ...item, display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)' }}>
          <StatusDot />
          <span>{status}</span>
        </span>
      )}
      {clock && <span style={item}>{clock}</span>}
    </div>
  );
}
