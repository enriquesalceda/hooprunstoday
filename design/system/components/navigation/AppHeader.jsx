import React from 'react';
import { Logo } from '../brand/Logo.jsx';
import { Telemetry } from '../core/Telemetry.jsx';

/* Mobile: logo + live status, then a second line of geofence/clock.
   Web: one 58px row — logo, nav slot (children), full telemetry. */
export function AppHeader({ platform = 'mobile', geofence, status, clock, onLogoClick, children, style }) {
  const web = platform === 'web';
  if (web) {
    return (
      <div style={{
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-11)',
        padding: '0 var(--gutter-web)',
        height: 'var(--header-h-web)',
        borderBottom: 'var(--border-hairline)',
        ...style,
      }}>
        <span onClick={onLogoClick} style={{ cursor: onLogoClick ? 'pointer' : 'default' }}>
          <Logo variant="oneline" size={20} />
        </span>
        {children}
        <Telemetry geofence={geofence} status={status} clock={clock} />
      </div>
    );
  }
  return (
    <div style={{
      flex: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      padding: '12px var(--gutter-mobile) 10px',
      borderBottom: 'var(--border-hairline)',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-5)' }}>
        <span onClick={onLogoClick} style={{ cursor: onLogoClick ? 'pointer' : 'default' }}>
          <Logo variant="oneline" size={17} />
        </span>
        <Telemetry status={status} />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)',
        fontWeight: 500,
        fontSize: 'var(--mono-2)',
        color: 'var(--text-faint)',
      }}>
        <span>GEOFENCE: {geofence}</span>
        <span>{clock}</span>
      </div>
    </div>
  );
}
