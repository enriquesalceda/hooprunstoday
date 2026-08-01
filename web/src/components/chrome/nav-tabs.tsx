/* Header nav — appears only once the record exists. RADAR and LOG GAME sit
   dim until their features arrive; YOU carries the selected inversion. */
export function NavTabs({ selected = "YOU" }: { selected?: "RADAR" | "LOG GAME" | "YOU" }) {
  const cell = (label: string, extra?: React.CSSProperties) => {
    const on = label === selected;
    return (
      <span
        key={label}
        style={{
          width: 120,
          textAlign: "center",
          padding: "10px 0",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "var(--mono-4)",
          letterSpacing: "var(--track-nav)",
          background: on ? "var(--selected-bg)" : "var(--unselected-bg)",
          color: on ? "var(--selected-ink)" : "var(--unselected-ink)",
          opacity: on ? 1 : "var(--disabled-opacity)",
          ...extra,
        }}
      >
        {label}
      </span>
    );
  };

  return (
    <nav style={{ display: "flex", border: "var(--border-interactive)" }}>
      {cell("RADAR")}
      {cell("LOG GAME", { borderLeft: "var(--border-interactive)", borderRight: "var(--border-interactive)" })}
      {cell("YOU")}
    </nav>
  );
}
