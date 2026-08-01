import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ProfileView } from "@/app/you/profile-view";
import { getCourts } from "@/lib/api/courts";
import { getMe } from "@/lib/api/me";

export default async function YouPage() {
  const { userId, getToken } = await auth();
  if (!userId) {
    redirect("/join");
  }

  const token = await getToken();
  if (!token) {
    redirect("/join");
  }

  const me = await getMe(token);
  if (!me.ok) {
    if (me.code === "not_found") {
      redirect("/join/record");
    }
    throw new Error("could not load your record");
  }

  const courtsResult = await getCourts();
  const courtName = courtsResult.ok
    ? courtsResult.courts.find((c) => c.id === me.player.homeCourtId)?.name
    : undefined;

  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: 1000,
          maxWidth: "100%",
          padding: "var(--space-8) var(--gutter-web) var(--space-13)",
        }}
      >
        <ProfileView player={me.player} courtName={courtName} />
      </div>
    </main>
  );
}
