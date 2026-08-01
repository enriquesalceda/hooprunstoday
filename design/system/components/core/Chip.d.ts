import * as React from 'react';

/** Small status/attribute marks. Interactive only when used as a multi-select. */
export interface ChipProps {
  children?: React.ReactNode;
  /** `solid` = ● LIVE. `outline` = badge or multi-select option. `frame` = court attribute. `pending` = dashed UNVOUCHED-style mark. */
  variant?: 'solid' | 'outline' | 'frame' | 'pending';
  /** Outline only: inverts the chip (white fill, dark ink) for multi-select. */
  selected?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export function Chip(props: ChipProps): JSX.Element;
