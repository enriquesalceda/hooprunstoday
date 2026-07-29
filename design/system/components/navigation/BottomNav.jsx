import React from 'react';
import { SegmentedControl } from './SegmentedControl.jsx';

/* Mobile tab bar. 3 segments, 15px vertical padding, 1px top border, nothing else. */
export function BottomNav({ options, value, onChange, style }) {
  return (
    <SegmentedControl
      options={options}
      value={value}
      onChange={onChange}
      frame="top"
      padY={15}
      style={{ flex: 'none', ...style }}
    />
  );
}
