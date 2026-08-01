import * as React from 'react';

/**
 * One side of a court vote: a claimed score and its running tally.
 * @startingPoint section="Data" subtitle="Court-vote sides, one selected" viewport="700x220"
 */
export interface VoteSideProps {
  /** Whose claim: `@southside_five CLAIM` or `YOUR CLAIM`. */
  who: string;
  /** The claimed score, e.g. "21 - 19". */
  score: string;
  /** Votes for this side, including the viewer's. */
  tally: number;
  /** The viewer voted for this side — inverts the whole block. */
  selected?: boolean;
  /** Voting is closed or already cast: no pointer, hairline border. */
  locked?: boolean;
  platform?: 'mobile' | 'web';
  onClick?: () => void;
  style?: React.CSSProperties;
}
export function VoteSide(props: VoteSideProps): JSX.Element;
