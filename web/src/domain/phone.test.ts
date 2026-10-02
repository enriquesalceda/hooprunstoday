import { describe, expect, it } from "vitest";

import {
  COUNTRIES,
  cleanPhoneDigits,
  countryByCode,
  formatPhone,
  isValidPhoneLength,
  phoneDigitsFromInput,
  toE164,
} from "@/domain/phone";

const US = countryByCode("US");
const AU = countryByCode("AU");
const FR = countryByCode("FR");

describe("countryByCode", () => {
  it("finds a listed country", () => {
    expect(countryByCode("GB").dial).toBe("44");
  });

  it("falls back to the US for anything unknown", () => {
    expect(countryByCode("ZZ").code).toBe("US");
  });

  it("labels every country with its dialing code", () => {
    expect(COUNTRIES.map((c) => c.label)).toContain("AU +61");
  });
});

describe("cleanPhoneDigits", () => {
  it("keeps only digits", () => {
    expect(cleanPhoneDigits("(415) 555-0123", US)).toBe("4155550123");
  });

  it("drops the country's dialing code when typed with a plus", () => {
    expect(cleanPhoneDigits("+61 412 345 678", AU)).toBe("412345678");
  });

  it("drops a leading trunk zero outside North America", () => {
    expect(cleanPhoneDigits("0412 345 678", AU)).toBe("412345678");
  });

  it("drops a leading 1 on an overlong North American number", () => {
    expect(cleanPhoneDigits("1 415 555 0123", US)).toBe("4155550123");
  });

  it("caps at the country's maximum length", () => {
    expect(cleanPhoneDigits("41555501239999", US)).toBe("4155550123");
  });
});

describe("formatPhone", () => {
  it("returns empty for no digits", () => {
    expect(formatPhone("", US)).toBe("");
  });

  it("formats North American numbers progressively", () => {
    expect(formatPhone("41", US)).toBe("(41");
    expect(formatPhone("41555", US)).toBe("(415) 55");
    expect(formatPhone("4155550123", US)).toBe("(415) 555-0123");
  });

  it("groups other countries with spaces", () => {
    expect(formatPhone("412345678", AU)).toBe("412 345 678");
    expect(formatPhone("612345678", FR)).toBe("6 12 34 56 78");
  });

  it("puts any overflow into the last group", () => {
    expect(formatPhone("15123456789", countryByCode("DE"))).toBe("151 23456789");
  });
});

describe("phoneDigitsFromInput", () => {
  it("cleans fresh input", () => {
    expect(phoneDigitsFromInput("(415) 555-01", "41555501", US)).toBe("41555501");
  });

  it("removes a digit when backspace only ate a separator", () => {
    // "412 345" → user deletes the space → "412345" would still clean to 412345
    expect(phoneDigitsFromInput("412345", "412345", AU)).toBe("41234");
  });
});

describe("isValidPhoneLength", () => {
  it("accepts a number within the country's bounds", () => {
    expect(isValidPhoneLength("4155550123", US)).toBe(true);
    expect(isValidPhoneLength("21123456", countryByCode("NZ"))).toBe(true);
  });

  it("rejects a number that is too short", () => {
    expect(isValidPhoneLength("415555", US)).toBe(false);
  });
});

describe("toE164", () => {
  it("prefixes the dialing code", () => {
    expect(toE164("412345678", AU)).toBe("+61412345678");
  });
});
