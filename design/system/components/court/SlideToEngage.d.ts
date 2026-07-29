import * as React from 'react';

/**
 * Geofenced check-in control. The signature interaction of the product.
 * @startingPoint section="Court" subtitle="Drag-to-97% check-in beacon" viewport="700x180"
 */
export interface SlideToEngageProps {
  /** 640px on web; '100%' full-bleed on mobile. Handle is always 76px square. */
  width?: number | string;
  /** Fires once the drag passes the threshold. Follow it with LockFlash, then navigate. */
  onEngage?: () => void;
  /** Idle track label. Keep the bracket form. */
  idleLabel?: string;
  /** Percentage required to commit. 97 by default — do not lower it. */
  threshold?: number;
  style?: React.CSSProperties;
}
export function SlideToEngage(props: SlideToEngageProps): JSX.Element;
