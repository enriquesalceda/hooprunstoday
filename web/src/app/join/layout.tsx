import type { ReactNode } from "react";

import { AppHeader } from "@/components/chrome/app-header";

export default function JoinLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--surface-app)",
        overflow: "hidden",
      }}
    >
      <AppHeader />
      {children}
    </div>
  );
}
