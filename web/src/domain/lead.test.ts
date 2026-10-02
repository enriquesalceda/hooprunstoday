import { describe, expect, it } from "vitest";

import { firstName, titleCaseName, validateLead } from "@/domain/lead";

const valid = { name: "Jordan", email: "j@court.com", phone: "", country: "US" as const };

describe("validateLead", () => {
  it("passes a named email lead", () => {
    expect(validateLead(valid)).toEqual({});
  });

  it("requires a name", () => {
    expect(validateLead({ ...valid, name: "   " })).toEqual({ name: "required" });
  });

  it("requires an email", () => {
    expect(validateLead({ ...valid, email: "" })).toEqual({ email: "required" });
  });

  it("rejects a malformed email", () => {
    expect(validateLead({ ...valid, email: "not-an-email" })).toEqual({ email: "invalid" });
  });

  it("accepts a phone of the right length for its country", () => {
    expect(validateLead({ ...valid, phone: "4155550123" })).toEqual({});
  });

  it("rejects a phone of the wrong length for its country", () => {
    expect(validateLead({ ...valid, phone: "415555" })).toEqual({ phone: "invalid" });
  });

  it("reports every failing field at once", () => {
    expect(validateLead({ name: "", email: "", phone: "1", country: "AU" })).toEqual({
      name: "required",
      email: "required",
      phone: "invalid",
    });
  });
});

describe("titleCaseName", () => {
  it("capitalises each word as it is typed", () => {
    expect(titleCaseName("jordan miller")).toBe("Jordan Miller");
  });

  it("capitalises after hyphens and apostrophes", () => {
    expect(titleCaseName("mary-jane o'neil")).toBe("Mary-Jane O'Neil");
  });

  it("strips leading whitespace and caps the length", () => {
    expect(titleCaseName("   jo")).toBe("Jo");
    expect(titleCaseName("a".repeat(60))).toHaveLength(50);
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
