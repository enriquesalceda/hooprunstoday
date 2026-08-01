import * as React from 'react';

/**
 * Email address entry. The only identity field in the product.
 * @startingPoint section="Forms" subtitle="Email entry and its masked form" viewport="700x160"
 */
export interface EmailFieldProps {
  label?: string;
  value?: string;
  /** Receives the value with whitespace stripped. */
  onChange?: (value: string) => void;
  placeholder?: string;
  platform?: 'mobile' | 'web';
  style?: React.CSSProperties;
}
export function EmailField(props: EmailFieldProps): JSX.Element;
/** `jordan@gmail.com` → `j•••••@gmail.com`. Used on the code screen. */
export function maskEmail(value?: string): string;
