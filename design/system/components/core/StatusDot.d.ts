import * as React from 'react';

/** 6px white dot, pulsing 1 → 0.15 → 1 over 1.6s. Signals a live session or a live court. */
export interface StatusDotProps {
  size?: number | string;
  /** Off for a static/offline indicator. */
  pulse?: boolean;
  style?: React.CSSProperties;
}
export function StatusDot(props: StatusDotProps): JSX.Element;
