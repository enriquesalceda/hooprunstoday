import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { createPlayerRecord } from "@/app/join/record/actions";
import { RecordForm } from "@/app/join/record/record-form";

export default async function RecordPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/join");
  }

  return (
    <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: 640,
          maxWidth: "100%",
          padding: "var(--space-12) var(--gutter-web) var(--space-14)",
        }}
      >
        <RecordForm action={createPlayerRecord} />
      </div>
    </main>
  );
}
