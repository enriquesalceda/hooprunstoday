import * as React from 'react';

/**
 * Mutually-exclusive selection. The core interaction pattern of the whole product.
 * @startingPoint section="Navigation" subtitle="Tabs, bottom nav, and format pickers" viewport="700x200"
 */
export interface SegmentedControlProps {
  options?: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  /** `box` = full 1px frame (tabs, pickers). `top` = top border only (bottom nav). */
  frame?: 'box' | 'top' | 'none';
  /** Vertical padding per segment. 13 for tabs/pickers, 15 for bottom nav. */
  padY?: number;
  fontSize?: string;
  /** var(--track-nav) by default; drop to var(--track-label) for long labels. */
  tracking?: string;
  style?: React.CSSProperties;
}
export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
