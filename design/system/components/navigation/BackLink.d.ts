import * as React from 'react';

/** Text-only back affordance at the top-left of a pushed screen. */
export interface BackLinkProps {
  /** Destination name, not "back". Rendered as `← RADAR`. */
  label?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export function BackLink(props: BackLinkProps): JSX.Element;
