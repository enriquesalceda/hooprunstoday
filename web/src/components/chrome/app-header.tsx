import type { ReactNode } from "react";

import { Clock } from "@/components/chrome/clock";
import { Logo } from "@/components/chrome/logo";
import { StatusDot } from "@/components/chrome/status-dot";

type Props = {
  geofence?: string;
  status?: string;
  children?: ReactNode; // nav slot — appears only once the record exists
};

export function AppHeader({ geofence = "PENDING", status = "SYS_STANDBY", children }: Props) {
  return (
    <header
      style={{
        flex: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-11)",
        padding: "0 var(--gutter-web)",
        height: "var(--header-h-web)",
        borderBottom: "var(--border-hairline)",
      }}
    >
      <Logo size={20} />
      {children}
      <div
        style={{
          flex: "none",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-8)",
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          fontSize: "var(--mono-2)",
          color: "var(--text-faint)",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ whiteSpace: "nowrap" }}>GEOFENCE: {geofence}</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            color: "var(--text-secondary)",
            whiteSpace: "nowrap",
          }}
        >
          <StatusDot />
          <span>{status}</span>
        </span>
        <Clock />
      </div>
    </header>
  );
}
