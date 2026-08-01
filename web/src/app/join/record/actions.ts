"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import type { RecordFormState } from "@/app/join/record/state";
import { normalizeHandle, validateHandle, validateRealName } from "@/domain/player";
import { dobToIso, validateHeightValue } from "@/domain/record";
import { checkHandle } from "@/lib/api/handles";
import { createPlayer } from "@/lib/api/players";

export type HandleAvailability = "free" | "taken" | "invalid" | "error";

export async function checkHandleAvailability(handle: string): Promise<HandleAvailability> {
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) return "error";

  const result = await checkHandle(token, normalizeHandle(handle));
  if (!result.ok) return result.code;
  return result.available ? "free" : "taken";
}

export async function createPlayerRecord(
  _prev: RecordFormState,
  formData: FormData,
): Promise<RecordFormState> {
  const realName = String(formData.get("real_name") ?? "");
  const handle = String(formData.get("handle") ?? "");
  const dob = {
    d: String(formData.get("dob_d") ?? ""),
    m: String(formData.get("dob_m") ?? ""),
    y: String(formData.get("dob_y") ?? ""),
  };
  const heightValue = String(formData.get("height_value") ?? "");
  const heightUnit = String(formData.get("height_unit") ?? "");
  const homeCourtId = String(formData.get("home_court_id") ?? "");

  let positions: string[] = [];
  try {
    const parsed: unknown = JSON.parse(String(formData.get("positions") ?? "[]"));
    if (Array.isArray(parsed) && parsed.every((p): p is string => typeof p === "string")) {
      positions = parsed;
    }
  } catch {
    // fall through with an empty list; validated below
  }

  const fields: Record<string, string> = {};
  const realNameError = validateRealName(realName);
  if (realNameError) fields.real_name = realNameError;
  const handleError = validateHandle(handle);
  if (handleError) fields.handle = handleError;
  const dobIso = dobToIso(dob);
  if (!dobIso) fields.date_of_birth = "Enter a real date as DD / MM / YYYY.";
  const heightError = validateHeightValue(heightValue);
  if (heightError) fields.height = heightError;
  if (heightUnit !== "FT" && heightUnit !== "CM") fields.height = "Pick FT or CM.";
  if (positions.length === 0) fields.positions = "Select at least one position.";
  if (homeCourtId === "") fields.home_court_id = "Pick a home court.";
  if (Object.keys(fields).length > 0 || dobIso === null) {
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
    dateOfBirth: dobIso,
    height: { value: heightValue.trim(), unit: heightUnit === "CM" ? "CM" : "FT" },
    positions,
    homeCourtId,
  });

  if (result.ok) {
    redirect("/join/geofence");
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
