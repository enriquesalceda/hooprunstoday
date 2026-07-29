import * as React from 'react';

/**
 * The Hoopruns.today wordmark lockup.
 * @startingPoint section="Brand" subtitle="Stacked and one-line lockups, ink or paper" viewport="700x260"
 */
export interface LogoProps {
  /** Stacked (primary, min 64px tall) or one-line (headers, banners, print footers). */
  variant?: 'stacked' | 'oneline';
  /** `ink` = black mark for paper surfaces. `paper` = white mark for blacktop surfaces. */
  tone?: 'ink' | 'paper';
  /** Wordmark cap height in px. Everything else scales from this. Stacked min 64, one-line min 24. */
  size?: number;
  /** The .TODAY bar. Hide it below 120px in icon contexts (per assets/README.txt). */
  showBar?: boolean;
  style?: React.CSSProperties;
}
export function Logo(props: LogoProps): JSX.Element;
