import * as React from 'react';

/** Single-line text input with a mono label cell on the left. */
export interface FieldRowProps {
  /** Short caps label: `OPP CAPTAIN`. */
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  /** `@handle` for player fields. */
  placeholder?: string;
  platform?: 'mobile' | 'web';
  style?: React.CSSProperties;
}
export function FieldRow(props: FieldRowProps): JSX.Element;
