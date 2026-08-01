import React from 'react';
import { BackLink } from '../../components/navigation/BackLink.jsx';
import { SectionLabel } from '../../components/core/SectionLabel.jsx';
import { InboxRow } from '../../components/data/InboxRow.jsx';

export function WebInbox({ flow }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 820, maxWidth: '100%', boxSizing: 'border-box', padding: 'var(--gutter-web) var(--gutter-web) var(--space-14)', display: 'flex', flexDirection: 'column' }}>
        <BackLink label="PROFILE" onClick={() => flow.go('profile')} style={{ alignSelf: 'flex-start' }} />
        <span style={{ paddingTop: 'var(--space-6)', fontFamily: 'var(--font-display)', fontSize: 'var(--display-5)', lineHeight: 'var(--lh-display-loose)', color: 'var(--text-primary)' }}>INBOX</span>
        <SectionLabel style={{ padding: 'var(--space-4) 0 var(--space-7)' }}>{flow.inboxSummary} · {flow.inbox.length} TOTAL</SectionLabel>
        {flow.inbox.map((n, i) => (
          <InboxRow key={n.kind + i} platform="web" kind={n.kind} text={n.text} when={n.when} actionable={n.actionable} onClick={n.open} />
        ))}
        <span style={{ paddingTop: 'var(--space-9)', fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', lineHeight: 1.6 }}>
          NOTHING IS PUSHED AT NIGHT. RUN ALERTS ONLY FOR YOUR HOME COURT.
        </span>
      </div>
    </div>
  );
}
