import * as React from 'react';

/** Unit switcher that sits inside a FieldRow frame (FT/CM). */
export interface UnitToggleProps {
  /** Short caps units, 2–3 max: `['FT', 'CM']`. */
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
  /** Segment width in px. 46 mobile, 48 web. */
  width?: number;
  style?: React.CSSProperties;
}
export function UnitToggle(props: UnitToggleProps): JSX.Element;
