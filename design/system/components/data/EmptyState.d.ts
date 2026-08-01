import * as React from 'react';

/**
 * Dashed placeholder for a section with no data yet.
 * @startingPoint section="Data" subtitle="Dashed empty rows for a new player" viewport="700x180"
 */
export interface EmptyStateProps {
  /** What's missing, caps: `NO GAMES LOGGED`. */
  label: string;
  /** Right-aligned next step: `LOG A SCORE TO OPEN YOUR RECORD`. */
  meta?: string;
  /** Center the label with no meta — for a badge row placeholder. */
  center?: boolean;
  platform?: 'mobile' | 'web';
  style?: React.CSSProperties;
}
export function EmptyState(props: EmptyStateProps): JSX.Element;
