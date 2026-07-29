import * as React from 'react';

/** A player post in the bulletin feed. */
export interface BulletinRowProps {
  /** Always `@lowercase_snake`. Underlined; taps through to that player's profile. */
  handle: string;
  /** Relative time, caps: "4M AGO", "18M AGO". */
  when: string;
  /** Short court name, caps: "PRINCE ALFRED". */
  court: string;
  /** User-written body — the one place sentence case is allowed. */
  text: string;
  platform?: 'mobile' | 'web';
  onHandleClick?: () => void;
  style?: React.CSSProperties;
}
export function BulletinRow(props: BulletinRowProps): JSX.Element;
