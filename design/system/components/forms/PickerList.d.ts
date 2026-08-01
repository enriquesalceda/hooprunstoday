import * as React from 'react';

/** Inline expandable option list. Pairs with PickerRow. */
export interface PickerListOption {
  id: string;
  /** Left-hand label, caps. */
  name: string;
  /** Right-hand metadata, e.g. "DIV II". */
  meta?: string;
}
export interface PickerListProps {
  options?: PickerListOption[];
  value?: string;
  onChange?: (id: string) => void;
  /** Scroll cap in px. 232 mobile, 244 web. */
  maxHeight?: number;
  /** True when it hangs directly off the row above it (drops the top border). */
  attached?: boolean;
  platform?: 'mobile' | 'web';
  style?: React.CSSProperties;
}
export function PickerList(props: PickerListProps): JSX.Element;
