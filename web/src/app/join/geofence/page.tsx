import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { GeofenceScreen } from "@/app/join/geofence/geofence-screen";

export default async function GeofencePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/join");
  }

  return <GeofenceScreen />;
}
