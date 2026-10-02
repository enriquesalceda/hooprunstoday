// Validation for the GET ON THE LIST form, run on submit — typing is never
// blocked. Mirrors the backend's domain.NewLead rules; the API stays the
// authority.

import { isValidEmail } from "@/domain/email";
import { countryByCode, isValidPhoneLength, type CountryCode } from "@/domain/phone";

export type ContactMethod = "EMAIL" | "MOBILE";

export type LeadDraft = {
  name: string;
  email: string;
  /* national digits only; "" means no SMS alerts */
  phone: string;
  country: CountryCode;
};

export type LeadFieldError = "required" | "invalid";

export type LeadErrors = Partial<Record<"name" | "email" | "phone", LeadFieldError>>;

export function validateLead(draft: LeadDraft): LeadErrors {
  const errors: LeadErrors = {};
  if (draft.name.trim() === "") errors.name = "required";
  const email = draft.email.trim();
  if (email === "") errors.email = "required";
  else if (email.length > 254 || !isValidEmail(email)) errors.email = "invalid";
  if (draft.phone !== "" && !isValidPhoneLength(draft.phone, countryByCode(draft.country))) {
    errors.phone = "invalid";
  }
  return errors;
}

const NAME_MAX = 50;

/* Live shaping of the name field: no leading spaces, capital after every
   word boundary, capped length. */
export function titleCaseName(raw: string): string {
  return raw
    .replace(/^\s+/, "")
    .slice(0, NAME_MAX)
    .replace(/(^|[\s'-])(\p{Ll})/gu, (_, boundary: string, letter: string) => boundary + letter.toUpperCase());
}

/* Display form for the success line: "YOU'RE ON THE LIST, JORDAN." */
export function firstName(name: string): string {
  return (name.trim().split(/\s+/)[0] ?? "").toUpperCase();
}
