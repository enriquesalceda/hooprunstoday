import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { InboxRow } from '../../components/data/InboxRow.jsx';

export function MobileInbox({ flow }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px var(--gutter-mobile)' }}><BackLink label="PROFILE" onClick={() => flow.go('profile')} /></div>
      <span style={{ padding: '4px var(--gutter-mobile) 0', fontFamily: 'var(--font-display)', fontSize: 'var(--display-3)', lineHeight: 'var(--lh-display)', color: 'var(--text-primary)' }}>INBOX</span>
      <SectionLabel style={{ padding: '8px var(--gutter-mobile) 14px' }}>{flow.inboxSummary} · {flow.inbox.length} TOTAL</SectionLabel>
      {flow.inbox.map((n, i) => (
        <InboxRow key={n.kind + i} kind={n.kind} text={n.text} when={n.when} actionable={n.actionable} onClick={n.open} />
      ))}
      <span style={{ padding: 'var(--gutter-mobile)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-1)', color: 'var(--text-faint)', lineHeight: 1.5 }}>
        NOTHING IS PUSHED AT NIGHT. RUN ALERTS ONLY FOR YOUR HOME COURT.
      </span>
    </div>
  );
}
