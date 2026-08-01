import { apiUrl } from "@/lib/api/client";
import type { Player } from "@/lib/api/players";

export type GetMeResult =
  | { ok: true; player: Player }
  | { ok: false; code: "not_found" | "unauthorized" | "error" };

export async function getMe(token: string): Promise<GetMeResult> {
  let res: Response;
  try {
    res = await fetch(`${apiUrl()}/api/v1/players/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return { ok: false, code: "error" };
  }

  if (res.status === 200) {
    const body = (await res.json()) as {
      id: string;
      clerk_user_id: string;
      real_name: string;
      handle: string;
      date_of_birth: string;
      height: { value: string; unit: "FT" | "CM" };
      positions: string[];
      home_court_id: string;
      created_at: string;
    };
    return {
      ok: true,
      player: {
        id: body.id,
        clerkUserId: body.clerk_user_id,
        realName: body.real_name,
        handle: body.handle,
        dateOfBirth: body.date_of_birth,
        height: body.height,
        positions: body.positions ?? [],
        homeCourtId: body.home_court_id,
        createdAt: body.created_at,
      },
    };
  }
  if (res.status === 404) return { ok: false, code: "not_found" };
  if (res.status === 401) return { ok: false, code: "unauthorized" };
  return { ok: false, code: "error" };
}
