// Gate for the PUT ME ON THE LIST button only — typing is never blocked.
// Mirrors the backend's domain.NewLead rules; the API stays the authority.

import { isValidEmail } from "@/domain/email";

export type ContactMethod = "EMAIL" | "MOBILE";

export type LeadDraft = {
  name: string;
  method: ContactMethod;
  contact: string;
};

const MOBILE_PATTERN = /^\+?[0-9]{7,15}$/;
// Punctuation people type into phone numbers; stripped before validation.
const MOBILE_NOISE = /[\s\-().]/g;

export function isValidMobile(mobile: string): boolean {
  return MOBILE_PATTERN.test(mobile.trim().replace(MOBILE_NOISE, ""));
}

export function canSubmitLead(draft: LeadDraft): boolean {
  if (draft.name.trim() === "") return false;
  return draft.method === "EMAIL" ? isValidEmail(draft.contact) : isValidMobile(draft.contact);
}

/* Display form for the success panel: "YOU'RE ON THE LIST, JORDAN." */
export function firstName(name: string): string {
  return (name.trim().split(/\s+/)[0] ?? "").toUpperCase();
}
