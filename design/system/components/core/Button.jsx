import React from 'react';

/* The primary action. Selection-by-inversion: enabled = white fill, disabled = hollow at 55%. */
export function Button({ children, onClick, disabled = false, height, style }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        width: '100%',
        height: height || 'var(--button-h)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: 'var(--mono-7)',
        letterSpacing: 'var(--track-action)',
        textTransform: 'uppercase',
        background: disabled ? 'var(--unselected-bg)' : 'var(--selected-bg)',
        color: disabled ? 'var(--disabled-ink)' : 'var(--selected-ink)',
        border: 'var(--border-inverted)',
        borderRadius: 'var(--radius-none)',
        opacity: disabled ? 'var(--disabled-opacity)' : 1,
        cursor: disabled ? 'default' : 'pointer',
        ...style,
      }}
    >{children}</button>
  );
}
