import * as React from 'react';

/** Framed term → value rows. Used to state permissions, rules, and terms plainly. */
export interface FactTableProps {
  rows?: { term: string; value: string }[];
  platform?: 'mobile' | 'web';
  style?: React.CSSProperties;
}
export function FactTable(props: FactTableProps): JSX.Element;
