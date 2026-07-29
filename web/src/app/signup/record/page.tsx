import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { createPlayerRecord } from "@/app/signup/record/actions";
import { RecordForm } from "@/app/signup/record/record-form";

export default async function RecordPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/signup");
  }

  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <RecordForm action={createPlayerRecord} />
    </main>
  );
}
