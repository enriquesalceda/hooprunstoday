import * as React from 'react';

/** App chrome. Present on every screen of both products. */
export interface AppHeaderProps {
  /** `mobile` = two stacked lines. `web` = single 58px row with a nav slot. */
  platform?: 'mobile' | 'web';
  geofence?: string;
  status?: string;
  clock?: string;
  onLogoClick?: () => void;
  /** Web only: the centered SegmentedControl acting as primary nav. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function AppHeader(props: AppHeaderProps): JSX.Element;
