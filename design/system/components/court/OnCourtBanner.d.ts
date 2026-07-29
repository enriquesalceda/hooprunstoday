import * as React from 'react';

/** The only place the product addresses the user directly. */
export interface OnCourtBannerProps {
  /** Court subdomain, e.g. "prince-alfred-park.hoopruns.today". */
  subdomain?: string;
  /** `true` on mobile: full-width inside the row at 9px. `false` on web: shrink-wrapped at 10px. */
  inset?: boolean;
  style?: React.CSSProperties;
}
export function OnCourtBanner(props: OnCourtBannerProps): JSX.Element;
