import * as React from 'react';

/** One logged game. The only component where border *style* encodes state. */
export interface GameLogRowProps {
  /** `W 21 - 15 VS @southside_five` — result letter, score, opponent handle. */
  label: string;
  /** `VERIFIED · STREET · JUL 12` or `PENDING · LEAGUE · TODAY`. */
  meta: string;
  /** Dashed border + muted ink until the opposing captain verifies. */
  pending?: boolean;
  style?: React.CSSProperties;
}
export function GameLogRow(props: GameLogRowProps): JSX.Element;
