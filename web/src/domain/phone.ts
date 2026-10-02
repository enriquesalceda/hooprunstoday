// Mobile numbers for the waitlist's optional SMS alerts. The form collects a
// national number under a dialing code and sends E.164 to the API, which
// stays the validation authority. Mirrors the landing handoff's country table.

export type CountryCode = "US" | "CA" | "AU" | "GB" | "IE" | "NZ" | "ES" | "FR" | "DE" | "MX";

export type Country = {
  code: CountryCode;
  dial: string;
  min: number;
  max: number;
  groups: number[];
  placeholder: string;
  label: string;
  /* North American Numbering Plan: "(415) 555-0123" and a 1 trunk prefix. */
  nanp: boolean;
};

function country(
  code: CountryCode,
  dial: string,
  min: number,
  max: number,
  groups: number[],
  placeholder: string,
  nanp = false,
): Country {
  return { code, dial, min, max, groups, placeholder, nanp, label: `${code} +${dial}` };
}

export const COUNTRIES: readonly Country[] = [
  country("US", "1", 10, 10, [3, 3, 4], "(555) 000-0000", true),
  country("CA", "1", 10, 10, [3, 3, 4], "(555) 000-0000", true),
  country("AU", "61", 9, 9, [3, 3, 3], "412 345 678"),
  country("GB", "44", 10, 10, [4, 6], "7400 123456"),
  country("IE", "353", 9, 9, [2, 3, 4], "85 123 4567"),
  country("NZ", "64", 8, 10, [2, 3, 5], "21 123 4567"),
  country("ES", "34", 9, 9, [3, 3, 3], "612 345 678"),
  country("FR", "33", 9, 9, [1, 2, 2, 2, 2], "6 12 34 56 78"),
  country("DE", "49", 10, 11, [3, 8], "151 23456789"),
  country("MX", "52", 10, 10, [2, 4, 4], "55 1234 5678"),
];

export const DEFAULT_COUNTRY: CountryCode = "US";

export function countryByCode(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

/* National digits only: strips punctuation, a typed dialing code, and the
   trunk prefix people copy out of their contacts. */
export function cleanPhoneDigits(raw: string, c: Country): string {
  let digits = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+") && digits.startsWith(c.dial)) digits = digits.slice(c.dial.length);
  if (c.nanp) {
    if (digits.length > 10 && digits.startsWith("1")) digits = digits.slice(1);
  } else if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits.slice(0, c.max);
}

export function formatPhone(digits: string, c: Country): string {
  if (digits === "") return "";
  if (c.nanp) {
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  const out: string[] = [];
  let i = 0;
  for (let k = 0; k < c.groups.length && i < digits.length; k++) {
    const n = k === c.groups.length - 1 ? digits.length - i : c.groups[k];
    out.push(digits.slice(i, i + n));
    i += n;
  }
  return out.join(" ");
}

/* The next digit string after an edit to the formatted field. When backspace
   only removed a separator, the digits would not change, so drop one. */
export function phoneDigitsFromInput(raw: string, previousDigits: string, c: Country): string {
  const digits = cleanPhoneDigits(raw, c);
  const shrank = raw.length < formatPhone(previousDigits, c).length;
  return shrank && digits === previousDigits ? digits.slice(0, -1) : digits;
}

export function isValidPhoneLength(digits: string, c: Country): boolean {
  return digits.length >= c.min && digits.length <= c.max;
}

export function toE164(digits: string, c: Country): string {
  return `+${c.dial}${digits}`;
}
