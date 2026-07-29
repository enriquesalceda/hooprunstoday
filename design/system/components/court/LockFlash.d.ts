import * as React from 'react';

/** Full-bleed white confirmation flash after a successful check-in. */
export interface LockFlashProps {
  visible?: boolean;
  /** `LOCKED.` — keep the period. */
  text?: string;
  /** var(--display-7) on mobile (84–92px), var(--display-9) on web (140px). */
  size?: string | number;
  style?: React.CSSProperties;
}
export function LockFlash(props: LockFlashProps): JSX.Element;
