import * as React from 'react';

/** One hero number with its label and rank. Used for the street score. */
export interface ScoreBlockProps {
  value: string | number;
  label?: string;
  /** Unglossed street rank: "COURT LEGEND", "RIM GUARDIAN", "REGULAR". */
  rank?: string;
  platform?: 'mobile' | 'web';
  style?: React.CSSProperties;
}
export function ScoreBlock(props: ScoreBlockProps): JSX.Element;
