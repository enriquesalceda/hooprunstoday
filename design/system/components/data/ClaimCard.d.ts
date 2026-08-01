import * as React from 'react';

/**
 * An incoming score claim awaiting the viewer's confirmation.
 * @startingPoint section="Data" subtitle="Claim awaiting your call" viewport="700x220"
 */
export interface ClaimCardProps {
  /** Claimant handle, `@lowercase_snake`. */
  by: string;
  /** Score as the claimant stated it, e.g. "21 - 15" (them first). */
  score: string;
  /** What it means for the viewer: `YOU WON` / `YOU LOST` / `TIED`. */
  verdict: string;
  /** Squad size, court, and countdown: `3V3 HALFCOURT · PRINCE ALFRED PARK · AUTO-VERIFIES IN 41:12`. On mobile this sits beside the handle. */
  meta: string;
  /** Web only: trailing affordance, e.g. `REVIEW →`. */
  action?: string;
  platform?: 'mobile' | 'web';
  onClick?: () => void;
  style?: React.CSSProperties;
}
export function ClaimCard(props: ClaimCardProps): JSX.Element;
