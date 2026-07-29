import * as React from 'react';

/**
 * One court in the Radar directory.
 * @startingPoint section="Court" subtitle="Directory row with live chip and on-court banner" viewport="700x260"
 */
export interface CourtRowProps {
  /** Court name, caps. Wraps on two lines at 34px (mobile) / 46px (web). */
  name: string;
  /** One decimal, unit rendered by the component: `0.4 KM`. */
  distanceKm: string | number;
  /** Add 1 yourself when the viewer is checked in here. */
  onCourtCount: number;
  /** Next scheduled run, e.g. "3V3 HALFCOURT" or "OPEN RUN 18:00". */
  nextRun: string;
  /** Shows the ● LIVE chip. */
  live?: boolean;
  /** Shows the inverted "you are on this court" banner. */
  youAreHere?: boolean;
  /** Court subdomain shown in that banner, e.g. "waterloo-oval.hoopruns.today". */
  subdomain?: string;
  platform?: 'mobile' | 'web';
  onClick?: () => void;
  style?: React.CSSProperties;
}
export function CourtRow(props: CourtRowProps): JSX.Element;
