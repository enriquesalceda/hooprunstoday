import * as React from 'react';

/** Small non-interactive status/attribute marks. */
export interface ChipProps {
  children?: React.ReactNode;
  /** `solid` = ● LIVE. `outline` = street-cred badge. `frame` = court attribute (OUTDOOR). */
  variant?: 'solid' | 'outline' | 'frame';
  style?: React.CSSProperties;
}
export function Chip(props: ChipProps): JSX.Element;
