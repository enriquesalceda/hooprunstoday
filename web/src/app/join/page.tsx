import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { JoinFlow } from "@/app/join/_components/join-flow";

export default async function JoinPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/join/record");
  }

  return <JoinFlow />;
}
