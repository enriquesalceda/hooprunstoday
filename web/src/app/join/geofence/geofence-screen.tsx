"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { GeofencePanel } from "@/app/join/geofence/geofence-panel";
import { LOCATED_KEY } from "@/components/chrome/live-header";

/* Thin wiring: browser geolocation + navigation. The panel stays pure. */
export function GeofenceScreen() {
  const router = useRouter();
  const [asking, setAsking] = useState(false);

  function finish(located: boolean) {
    if (located) {
      window.localStorage.setItem(LOCATED_KEY, "1");
    }
    router.push("/you");
  }

  function grant() {
    if (asking) return;
    if (!("geolocation" in navigator)) {
      finish(false);
      return;
    }
    setAsking(true);
    navigator.geolocation.getCurrentPosition(
      () => finish(true),
      () => finish(false), // denied or failed → browse-only, still usable
      { timeout: 10000 },
    );
  }

  return <GeofencePanel asking={asking} onGrant={grant} onSkip={() => finish(false)} />;
}
