import type { ReactNode } from "react";

import { LiveHeader } from "@/components/chrome/live-header";
import { NavTabs } from "@/components/chrome/nav-tabs";

export default function YouLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--surface-app)",
      }}
    >
      <LiveHeader>
        <NavTabs selected="YOU" />
      </LiveHeader>
      {children}
    </div>
  );
}
