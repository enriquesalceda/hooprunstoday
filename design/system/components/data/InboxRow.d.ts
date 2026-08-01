import * as React from 'react';

/** One notification in the inbox. */
export interface InboxRowProps {
  /** Type in caps: `SCORE CLAIM`, `COURT VOTE`, `VOUCH`, `RUN ALERT`. */
  kind: string;
  /** Body copy — the one place in the product that stays sentence case. */
  text: string;
  /** `41:12 LEFT` for deadlines, `2H AGO` for things that already happened. */
  when: string;
  /** Something is owed by the viewer: white kind label, body in body ink, row tappable. */
  actionable?: boolean;
  platform?: 'mobile' | 'web';
  onClick?: () => void;
  style?: React.CSSProperties;
}
export function InboxRow(props: InboxRowProps): JSX.Element;
