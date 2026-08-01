import * as React from 'react';

/** The system's only free-text input. Label sits inside the frame, never above it. */
export interface FieldRowProps {
  /** Short caps label: `OPP CAPTAIN`, `REAL NAME`, `@HANDLE`. */
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Control rendered inside the frame after the input — e.g. a UnitToggle or a glyph cell. */
  trailing?: React.ReactNode;
  platform?: 'mobile' | 'web';
  style?: React.CSSProperties;
}
export function FieldRow(props: FieldRowProps): JSX.Element;
