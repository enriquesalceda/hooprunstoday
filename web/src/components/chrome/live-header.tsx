"use client";

import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";

import { AppHeader } from "@/components/chrome/app-header";

export const LOCATED_KEY = "hoopruns_located";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readLocated() {
  return window.localStorage.getItem(LOCATED_KEY) === "1";
}

/* AppHeader with the geofence state read from this browser. Neighborhood
   names arrive with the real geo features; until then the label is a
   plain machine state. */
export function LiveHeader({ children }: { children?: ReactNode }) {
  const located = useSyncExternalStore(subscribe, readLocated, () => false);

  return (
    <AppHeader
      geofence={located ? "ACTIVE" : "PENDING"}
      status={located ? "SYS_ACTIVE" : "SYS_STANDBY"}
    >
      {children}
    </AppHeader>
  );
}
