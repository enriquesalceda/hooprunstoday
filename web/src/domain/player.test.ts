import { describe, expect, it } from "vitest";

import { validateHandle, validateRealName } from "@/domain/player";

describe("validateHandle", () => {
  it("accepts 3-20 chars of a-z, 0-9 and underscore", () => {
    expect(validateHandle("jordan_miller")).toBeNull();
    expect(validateHandle("ab_")).toBeNull();
    expect(validateHandle("a".repeat(20))).toBeNull();
  });

  it("normalizes case before validating", () => {
    expect(validateHandle("Jordan_Miller")).toBeNull();
  });

  it("rejects handles outside the rules", () => {
    expect(validateHandle("")).toMatch(/3–20/);
    expect(validateHandle("ab")).toMatch(/3–20/);
    expect(validateHandle("a".repeat(21))).toMatch(/3–20/);
    expect(validateHandle("jordan miller")).toMatch(/3–20/);
    expect(validateHandle("jordan-miller")).toMatch(/3–20/);
  });
});

describe("validateRealName", () => {
  it("accepts 1-80 chars after trimming", () => {
    expect(validateRealName("Jordan Miller")).toBeNull();
    expect(validateRealName("  J  ")).toBeNull();
    expect(validateRealName("a".repeat(80))).toBeNull();
  });

  it("rejects empty or oversized names", () => {
    expect(validateRealName("")).toMatch(/1–80/);
    expect(validateRealName("   ")).toMatch(/1–80/);
    expect(validateRealName("a".repeat(81))).toMatch(/1–80/);
  });
});
