import { apiUrl } from "@/lib/api/client";

export type CheckHandleResult =
  | { ok: true; available: boolean }
  | { ok: false; code: "invalid" | "error" };

export async function checkHandle(token: string, handle: string): Promise<CheckHandleResult> {
  let res: Response;
  try {
    res = await fetch(`${apiUrl()}/api/v1/handles/${encodeURIComponent(handle)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return { ok: false, code: "error" };
  }

  if (res.status === 200) {
    const body = (await res.json()) as { available: boolean };
    return { ok: true, available: body.available };
  }
  if (res.status === 422) {
    return { ok: false, code: "invalid" };
  }
  return { ok: false, code: "error" };
}
