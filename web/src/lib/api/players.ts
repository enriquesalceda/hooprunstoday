// The one place that knows the backend's endpoints and JSON contract.

export type Player = {
  id: string;
  clerkUserId: string;
  realName: string;
  handle: string;
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
};

function apiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return url;
}

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
      body: JSON.stringify({ real_name: input.realName, handle: input.handle }),
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
      created_at: string;
    };
    return {
      ok: true,
      player: {
        id: body.id,
        clerkUserId: body.clerk_user_id,
        realName: body.real_name,
        handle: body.handle,
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
