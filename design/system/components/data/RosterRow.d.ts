import * as React from 'react';

/** Team or achievement line under ROSTERS + ACHIEVEMENTS. */
export interface RosterRowProps {
  /** Team or award, caps: "NEWTOWN OUTLAWS", "CITY 3X3 CHAMPION". */
  name: string;
  /** Division + status, or a year: "DIV II · ACTIVE", "2025". */
  meta: string;
  style?: React.CSSProperties;
}
export function RosterRow(props: RosterRowProps): JSX.Element;
