// Record-screen rules. Mirrors backend validation; the backend stays the
// authority.

import { validateHandle, validateRealName } from "@/domain/player";

export type DobParts = { d: string; m: string; y: string };

export type RecordDraft = {
  realName: string;
  handle: string;
  dob: DobParts;
  heightValue: string;
  positions: string[];
  homeCourtId: string;
};

/** Converts DD/MM/YYYY parts to ISO YYYY-MM-DD, or null when not a real
 *  date. Single-digit day/month are padded — "6 / 5" reads as 06/05. */
export function dobToIso(parts: DobParts): string | null {
  const d = parts.d.padStart(2, "0");
  const m = parts.m.padStart(2, "0");
  const y = parts.y;
  if (!/^\d{2}$/.test(d) || !/^\d{2}$/.test(m) || !/^\d{4}$/.test(y)) return null;
  const day = Number(d);
  const month = Number(m);
  const year = Number(y);
  const date = new Date(Date.UTC(year, month - 1, day));
  const real =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return real ? `${y}-${m}-${d}` : null;
}

/** Returns an error message, or null when valid. */
export function validateHeightValue(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length < 1 || trimmed.length > 10) {
    return "Height is 1–10 characters.";
  }
  return null;
}

const STILL_NEEDED_ORDER: [string, (draft: RecordDraft) => boolean][] = [
  ["REAL NAME", (r) => validateRealName(r.realName) === null],
  ["HANDLE", (r) => validateHandle(r.handle) === null],
  ["DATE OF BIRTH", (r) => dobToIso(r.dob) !== null],
  ["HEIGHT", (r) => validateHeightValue(r.heightValue) === null],
  ["POSITION", (r) => r.positions.length >= 1],
  ["HOME COURT", (r) => r.homeCourtId !== ""],
];

/** Outstanding requirements in the design's fixed order. */
export function missingFields(draft: RecordDraft): string[] {
  return STILL_NEEDED_ORDER.filter(([, complete]) => !complete(draft)).map(([label]) => label);
}
