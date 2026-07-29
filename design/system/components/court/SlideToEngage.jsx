import React from 'react';

/* Geofenced check-in. Deliberately physical: you must drag it 97% of the way.
   Release short and it snaps back over 280ms. Nothing else in the product works this way. */
export function SlideToEngage({ width = '100%', onEngage, idleLabel = '[ PULL SLIDER TO ENGAGE BEACON ]', threshold = 97, style }) {
  const [dragging, setDragging] = React.useState(false);
  const [pct, setPct] = React.useState(0);
  const startX = React.useRef(0);
  const el = React.useRef(null);
  const handle = 76;

  const travel = () => {
    const w = el.current ? el.current.offsetWidth : 0;
    return Math.max(1, w - handle);
  };
  const down = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startX.current = e.clientX - (pct / 100) * travel();
    setDragging(true);
  };
  const move = (e) => {
    if (!dragging) return;
    const x = e.clientX - startX.current;
    setPct(Math.max(0, Math.min(100, (x / travel()) * 100)));
  };
  const up = () => {
    if (!dragging) return;
    if (pct >= threshold) {
      setDragging(false);
      setPct(100);
      if (onEngage) onEngage();
    } else {
      setDragging(false);
      setPct(0);
    }
  };

  const shown = Math.round(pct);
  return (
    <div ref={el} style={{
      position: 'relative',
      width,
      height: 'var(--slider-h)',
      border: 'var(--border-interactive)',
      background: 'var(--surface-track)',
      touchAction: 'none',
      ...style,
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: 'var(--mono-4)',
        letterSpacing: 'var(--track-slider)',
        color: dragging ? 'var(--text-primary)' : 'var(--text-faint)',
        pointerEvents: 'none',
      }}>{dragging ? `ENGAGING // ${shown}%` : idleLabel}</div>
      <div
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: handle,
          height: '100%',
          background: 'var(--selected-bg)',
          color: 'var(--selected-ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 30,
          cursor: 'grab',
          userSelect: 'none',
          transform: `translateX(${(pct / 100) * travel()}px)`,
          transition: dragging ? 'none' : 'transform var(--dur-snap) var(--ease-snap)',
        }}>→</div>
    </div>
  );
}
