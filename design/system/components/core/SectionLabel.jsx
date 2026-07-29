import React from 'react';

/* Every content block is introduced by one of these. Machine register: "COURT DIRECTORY // 3 TRACKED". */
export function SectionLabel({ children, style }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: 'var(--mono-2)',
      color: 'var(--text-faint)',
      textTransform: 'uppercase',
      ...style,
    }}>{children}</div>
  );
}
