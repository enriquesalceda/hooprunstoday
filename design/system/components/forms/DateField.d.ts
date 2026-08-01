import * as React from 'react';

/** Date of birth as three digit cells in one frame. */
export interface DateFieldProps {
  label?: string;
  day?: string;
  month?: string;
  year?: string;
  /** Called with the part name and its digits-only value. */
  onChange?: (part: 'day' | 'month' | 'year', value: string) => void;
  platform?: 'mobile' | 'web';
  style?: React.CSSProperties;
}
export function DateField(props: DateFieldProps): JSX.Element;
