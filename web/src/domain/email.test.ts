import { describe, expect, it } from "vitest";

import { isValidEmail } from "@/domain/email";

describe("isValidEmail", () => {
  it("accepts ordinary addresses", () => {
    expect(isValidEmail("jordan@court.com")).toBe(true);
    expect(isValidEmail("j.m+clerk_test@gmail.com")).toBe(true);
    expect(isValidEmail("A@B.CO")).toBe(true);
  });

  it("rejects incomplete addresses", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("jordan")).toBe(false);
    expect(isValidEmail("jordan@")).toBe(false);
    expect(isValidEmail("jordan@court")).toBe(false);
    expect(isValidEmail("jordan@court.c")).toBe(false);
    expect(isValidEmail("jor dan@court.com")).toBe(false);
  });
});
