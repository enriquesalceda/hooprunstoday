import { describe, expect, it } from "vitest";

import { canSubmitLead, firstName, isValidMobile } from "@/domain/lead";

describe("isValidMobile", () => {
  it("accepts plain digit numbers", () => {
    expect(isValidMobile("0412345678")).toBe(true);
  });

  it("accepts international numbers with punctuation people type", () => {
    expect(isValidMobile("+61 (412) 345-678")).toBe(true);
  });

  it("rejects numbers that are too short", () => {
    expect(isValidMobile("12345")).toBe(false);
  });

  it("rejects numbers that are too long", () => {
    expect(isValidMobile("1234567890123456")).toBe(false);
  });

  it("rejects letters", () => {
    expect(isValidMobile("call me maybe")).toBe(false);
  });

  it("rejects a plus sign that is not leading", () => {
    expect(isValidMobile("04+12345678")).toBe(false);
  });

  it("rejects the empty string", () => {
    expect(isValidMobile("")).toBe(false);
  });
});

describe("canSubmitLead", () => {
  it("allows a named email lead with a valid address", () => {
    expect(canSubmitLead({ name: "Jordan", method: "EMAIL", contact: "j@court.com" })).toBe(true);
  });

  it("allows a named mobile lead with a valid number", () => {
    expect(canSubmitLead({ name: "Jordan", method: "MOBILE", contact: "0412345678" })).toBe(true);
  });

  it("blocks a blank name", () => {
    expect(canSubmitLead({ name: "   ", method: "EMAIL", contact: "j@court.com" })).toBe(false);
  });

  it("blocks an invalid email", () => {
    expect(canSubmitLead({ name: "Jordan", method: "EMAIL", contact: "not-an-email" })).toBe(false);
  });

  it("blocks an invalid mobile", () => {
    expect(canSubmitLead({ name: "Jordan", method: "MOBILE", contact: "12" })).toBe(false);
  });
});

describe("firstName", () => {
  it("takes the first word of a full name", () => {
    expect(firstName("  jordan miller ")).toBe("JORDAN");
  });

  it("uppercases for the display suffix", () => {
    expect(firstName("Quique")).toBe("QUIQUE");
  });

  it("returns empty for a blank name", () => {
    expect(firstName("   ")).toBe("");
  });
});
