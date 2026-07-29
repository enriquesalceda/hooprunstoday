import * as React from 'react';

/** The single primary action per screen. Pinned to the bottom, full width. */
export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  /** Hollow + 55% opacity. Never hide an action — show it unavailable. */
  disabled?: boolean;
  /** Defaults to var(--button-h) (60px mobile). Use var(--button-h-web) on desktop. */
  height?: number | string;
  style?: React.CSSProperties;
}
export function Button(props: ButtonProps): JSX.Element;
