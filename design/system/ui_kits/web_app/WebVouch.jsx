import React from 'react';
import { Chip } from '../../components/core/Chip.jsx';
import { Button } from '../../components/core/Button.jsx';

export function WebVouch({ flow }) {
  const s = flow.sel;
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <div style={{ flex: 1, minWidth: 'min-content', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-8)', padding: 'var(--space-14)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-4)', color: 'var(--text-faint)' }}>SCORE CONFIRMED · {s && s.score} VS {s && s.by}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--display-7)', lineHeight: 0.9, color: 'var(--text-primary)' }}>VOUCH A<br />CAPABILITY</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-4)', letterSpacing: 'var(--track-label)', color: 'var(--text-faint)' }}>YOU GUARDED THEM. WHAT WAS REAL?</span>
      </div>
      <div style={{ flex: '0 1 520px', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', borderLeft: 'var(--border-hairline)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-8)', padding: 'var(--space-14) var(--space-13)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          {flow.badges.map((b) => (
            <Chip key={b} variant="outline" selected={flow.picked.indexOf(b) !== -1} onClick={() => flow.toggleBadge(b)}>{b}</Chip>
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 'var(--mono-2)', color: 'var(--text-faint)', lineHeight: 1.6 }}>{flow.vouchHint}</span>
        <Button height="var(--button-h-web)" disabled={!flow.picked.length} onClick={flow.sendVouch}>SEND VOUCH</Button>
        <span
          onClick={flow.skipVouch}
          style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--mono-4)', color: 'var(--text-faint)', cursor: 'pointer' }}
        >SKIP — SCORE STANDS EITHER WAY</span>
      </div>
    </div>
  );
}
