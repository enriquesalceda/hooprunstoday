import * as React from 'react';

/** Name → meta line. Rosters, achievements, and court-vote voter rolls. */
export interface RosterRowProps {
  /** Team, award, or handle. */
  name: string;
  /** `DIV II · ACTIVE`, `2025`, or `VOTED` / `NOT VOTED`. */
  meta: string;
  /** Dim the name — used for voters who haven't cast yet. */
  muted?: boolean;
  platform?: 'mobile' | 'web';
  style?: React.CSSProperties;
}
export function RosterRow(props: RosterRowProps): JSX.Element;
