// The one place that knows the backend's endpoints and JSON contract.

import { apiUrl } from "@/lib/api/client";

export type Height = { value: string; unit: "FT" | "CM" };

export type Player = {
  id: string;
  clerkUserId: string;
  realName: string;
  handle: string;
  dateOfBirth: string; // YYYY-MM-DD
  height: Height;
  positions: string[];
  homeCourtId: string;
  createdAt: string;
};

export type CreatePlayerErrorCode =
  | "handle_taken"
  | "player_exists"
  | "validation_failed"
  | "unauthorized"
  | "malformed_json"
  | "internal"
  | "network";

export type CreatePlayerResult =
  | { ok: true; player: Player }
  | { ok: false; code: CreatePlayerErrorCode; fields?: Record<string, string> };

type CreatePlayerInput = {
  realName: string;
  handle: string;
  dateOfBirth: string; // YYYY-MM-DD
  height: Height;
  positions: string[];
  homeCourtId: string;
};

export async function createPlayer(
  token: string,
  input: CreatePlayerInput,
): Promise<CreatePlayerResult> {
  let res: Response;
  try {
    res = await fetch(`${apiUrl()}/api/v1/players`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        real_name: input.realName,
        handle: input.handle,
        date_of_birth: input.dateOfBirth,
        height: input.height,
        positions: input.positions,
        home_court_id: input.homeCourtId,
      }),
    });
  } catch {
    return { ok: false, code: "network" };
  }

  if (res.status === 201) {
    const body = (await res.json()) as {
      id: string;
      clerk_user_id: string;
      real_name: string;
      handle: string;
      date_of_birth: string;
      height: Height;
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
        positions: body.positions,
        homeCourtId: body.home_court_id,
        createdAt: body.created_at,
      },
    };
  }

  const body = (await res.json().catch(() => null)) as {
    error?: { code?: string; fields?: Record<string, string> };
  } | null;
  const code = (body?.error?.code ?? "internal") as CreatePlayerErrorCode;
  const fields = body?.error?.fields;
  return fields ? { ok: false, code, fields } : { ok: false, code };
}
