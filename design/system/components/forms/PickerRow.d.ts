import * as React from 'react';

/** Framed row that opens a sub-screen or an inline list. Reads as a sibling of FieldRow. */
export interface PickerRowProps {
  /** Caps label: `HOME COURT`, `LEAGUE TEAM`. */
  label: string;
  /** Chosen value; falsy shows `placeholder` in faint ink. */
  value?: string;
  /** Empty-state text. `SELECT` for required, `OPTIONAL` for not. */
  placeholder?: string;
  /** `→` opens a sub-screen; `↓`/`↑` toggles an inline list below. */
  glyph?: string;
  onClick?: () => void;
  platform?: 'mobile' | 'web';
  style?: React.CSSProperties;
}
export function PickerRow(props: PickerRowProps): JSX.Element;
