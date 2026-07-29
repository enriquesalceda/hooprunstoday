import * as React from 'react';

/** One team's score. Always used as a pair in a 2-column grid. */
export interface ScoreInputProps {
  /** `TEAM A (YOUR SQUAD)` / `TEAM B (OPPONENTS)`. */
  label: string;
  value?: string;
  /** Receives a digits-only string (the component strips everything else). */
  onChange?: (value: string) => void;
  platform?: 'mobile' | 'web';
  style?: React.CSSProperties;
}
export function ScoreInput(props: ScoreInputProps): JSX.Element;
