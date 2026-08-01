import { describe, expect, it } from "vitest";

import { dobToIso, missingFields, validateHeightValue, type RecordDraft } from "@/domain/record";

const complete: RecordDraft = {
  realName: "Jordan Miller",
  handle: "jordan_miller",
  dob: { d: "13", m: "07", y: "2000" },
  heightValue: `6'2"`,
  positions: ["WING"],
  homeCourtId: "court-1",
};

describe("dobToIso", () => {
  it("converts complete real dates", () => {
    expect(dobToIso({ d: "13", m: "07", y: "2000" })).toBe("2000-07-13");
    expect(dobToIso({ d: "29", m: "02", y: "2004" })).toBe("2004-02-29");
  });

  it("pads single-digit days and months", () => {
    expect(dobToIso({ d: "6", m: "5", y: "1985" })).toBe("1985-05-06");
    expect(dobToIso({ d: "1", m: "12", y: "2000" })).toBe("2000-12-01");
  });

  it("rejects incomplete or impossible dates", () => {
    expect(dobToIso({ d: "", m: "07", y: "2000" })).toBeNull();
    expect(dobToIso({ d: "13", m: "07", y: "200" })).toBeNull();
    expect(dobToIso({ d: "31", m: "02", y: "2001" })).toBeNull();
    expect(dobToIso({ d: "00", m: "07", y: "2000" })).toBeNull();
    expect(dobToIso({ d: "13", m: "13", y: "2000" })).toBeNull();
  });
});

describe("validateHeightValue", () => {
  it("accepts 1-10 chars after trimming", () => {
    expect(validateHeightValue(`6'2"`)).toBeNull();
    expect(validateHeightValue("188")).toBeNull();
  });

  it("rejects empty and oversized values", () => {
    expect(validateHeightValue("  ")).toMatch(/1–10/);
    expect(validateHeightValue("9".repeat(11))).toMatch(/1–10/);
  });
});

describe("missingFields", () => {
  it("is empty when the draft is complete", () => {
    expect(missingFields(complete)).toEqual([]);
  });

  it("lists outstanding requirements in the design order", () => {
    expect(
      missingFields({
        realName: "",
        handle: "x",
        dob: { d: "", m: "", y: "" },
        heightValue: "",
        positions: [],
        homeCourtId: "",
      }),
    ).toEqual(["REAL NAME", "HANDLE", "DATE OF BIRTH", "HEIGHT", "POSITION", "HOME COURT"]);
  });

  it("tracks partial completion", () => {
    expect(missingFields({ ...complete, positions: [], homeCourtId: "" })).toEqual([
      "POSITION",
      "HOME COURT",
    ]);
  });
});
