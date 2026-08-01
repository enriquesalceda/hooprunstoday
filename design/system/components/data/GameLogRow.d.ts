import * as React from 'react';

/** One logged game, or a queue row. The only component where border *style* encodes state. */
export interface GameLogRowProps {
  /** `3V3 · W 21 - 15 VS @southside_five` — size, result, score, opponent. */
  label: string;
  /** `VERIFIED · STREET · JUL 12` or `PENDING · 41:12 LEFT`. */
  meta?: string;
  /** Second line under the label — turns the row into a two-line queue row. */
  sublabel?: string;
  /** Dashed border + muted ink: waiting on someone else. */
  pending?: boolean;
  platform?: 'mobile' | 'web';
  onClick?: () => void;
  style?: React.CSSProperties;
}
export function GameLogRow(props: GameLogRowProps): JSX.Element;
