import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { checkHandleAvailability, createPlayerRecord } from "@/app/join/record/actions";
import { RecordFlow } from "@/app/join/record/record-flow";
import { getCourts } from "@/lib/api/courts";

export default async function RecordPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/join");
  }

  const courtsResult = await getCourts();
  const courts = courtsResult.ok ? courtsResult.courts : [];

  return (
    <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: 1000,
          maxWidth: "100%",
          padding: "var(--space-12) var(--gutter-web) var(--space-14)",
        }}
      >
        <RecordFlow
          courts={courts}
          action={createPlayerRecord}
          checkAvailability={checkHandleAvailability}
        />
      </div>
    </main>
  );
}
