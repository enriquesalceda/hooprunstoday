import * as React from 'react';

/** Header status cluster: geofence · live dot + system status · local clock. */
export interface TelemetryProps {
  /** Neighborhood the geofence matched, e.g. "NEWTOWN, SYD". */
  geofence?: string;
  /** `SYS_ACTIVE`, or `IN_GAME @ PRINCE` when checked in. */
  status?: string;
  /** Ticking local time, e.g. "18:42:07 LOCAL". */
  clock?: string;
  style?: React.CSSProperties;
}
export function Telemetry(props: TelemetryProps): JSX.Element;
