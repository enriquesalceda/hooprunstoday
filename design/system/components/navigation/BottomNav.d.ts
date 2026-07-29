import * as React from 'react';

/** The mobile tab bar. Three destinations: RADAR / LOG GAME / YOU. */
export interface BottomNavProps {
  options?: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export function BottomNav(props: BottomNavProps): JSX.Element;
