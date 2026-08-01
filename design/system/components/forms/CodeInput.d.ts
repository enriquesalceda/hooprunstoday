import * as React from 'react';

/**
 * One-time email code entry (Clerk email OTP).
 * @startingPoint section="Forms" subtitle="Six-digit code with rejected and locked states" viewport="700x180"
 */
export interface CodeInputProps {
  length?: number;
  value?: string;
  /** Receives a digits-only string, capped at `length`. */
  onChange?: (value: string) => void;
  /** `error` = dashed after a rejection. `locked` = dashed, dimmed, input disabled. */
  state?: 'default' | 'error' | 'locked';
  platform?: 'mobile' | 'web';
  style?: React.CSSProperties;
}
export function CodeInput(props: CodeInputProps): JSX.Element;
