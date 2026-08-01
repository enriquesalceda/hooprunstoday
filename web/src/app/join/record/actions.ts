"use server";

import { auth } from "@clerk/nextjs/server";

import type { RecordFormState } from "@/app/join/record/state";
import { normalizeHandle, validateHandle, validateRealName } from "@/domain/player";
import { createPlayer } from "@/lib/api/players";

export async function createPlayerRecord(
  _prev: RecordFormState,
  formData: FormData,
): Promise<RecordFormState> {
  const realName = String(formData.get("real_name") ?? "");
  const handle = String(formData.get("handle") ?? "");

  const fields: Record<string, string> = {};
  const realNameError = validateRealName(realName);
  if (realNameError) fields.real_name = realNameError;
  const handleError = validateHandle(handle);
  if (handleError) fields.handle = handleError;
  if (Object.keys(fields).length > 0) {
    return { status: "error", message: "Some fields are invalid.", fields };
  }

  const { getToken } = await auth();
  const token = await getToken();
  if (!token) {
    return { status: "error", message: "Your session expired — sign in again." };
  }

  const result = await createPlayer(token, {
    realName: realName.trim(),
    handle: normalizeHandle(handle),
  });

  if (result.ok) {
    return {
      status: "created",
      handle: result.player.handle,
      createdAt: result.player.createdAt,
    };
  }

  switch (result.code) {
    case "handle_taken":
      return {
        status: "error",
        message: "That handle is already claimed.",
        fields: { handle: "Pick another handle." },
      };
    case "player_exists":
      return { status: "error", message: "A record already exists for this account." };
    case "validation_failed":
      return { status: "error", message: "Some fields are invalid.", fields: result.fields };
    case "unauthorized":
      return { status: "error", message: "Your session expired — sign in again." };
    default:
      return { status: "error", message: "Something went wrong. Try again." };
  }
}
