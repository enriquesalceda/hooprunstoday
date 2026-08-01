import { apiUrl } from "@/lib/api/client";

export type Court = {
  id: string;
  name: string;
  courtType: "OUTDOOR" | "INDOOR";
};

export type GetCourtsResult = { ok: true; courts: Court[] } | { ok: false };

export async function getCourts(): Promise<GetCourtsResult> {
  let res: Response;
  try {
    res = await fetch(`${apiUrl()}/api/v1/courts`);
  } catch {
    return { ok: false };
  }
  if (!res.ok) {
    return { ok: false };
  }

  const body = (await res.json()) as {
    courts: { id: string; name: string; court_type: "OUTDOOR" | "INDOOR" }[];
  };
  return {
    ok: true,
    courts: body.courts.map((c) => ({ id: c.id, name: c.name, courtType: c.court_type })),
  };
}
