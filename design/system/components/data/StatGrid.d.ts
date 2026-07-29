import * as React from 'react';

/** Framed row of league averages. Three columns in the product (PPG/RPG/APG). */
export interface StatGridProps {
  /** Value is a naked number string — no units, no "avg". */
  stats?: { value: string | number; label: string }[];
  platform?: 'mobile' | 'web';
  style?: React.CSSProperties;
}
export function StatGrid(props: StatGridProps): JSX.Element;
