import { describe, expect, it } from "vitest";

import { hasClerkErrorCode } from "@/lib/auth/clerk-error";

describe("hasClerkErrorCode", () => {
  it("finds the code inside an API response error's errors list", () => {
    const error = {
      code: "api_response_error",
      errors: [{ code: "form_identifier_exists", message: "That email address is taken." }],
    };
    expect(hasClerkErrorCode(error, "form_identifier_exists")).toBe(true);
  });

  it("matches a code carried directly on the error", () => {
    expect(hasClerkErrorCode({ code: "form_identifier_exists" }, "form_identifier_exists")).toBe(true);
  });

  it("is false when no error carries the code", () => {
    const error = { code: "api_response_error", errors: [{ code: "form_param_format_invalid" }] };
    expect(hasClerkErrorCode(error, "form_identifier_exists")).toBe(false);
  });

  it("is false for no error or a non-object", () => {
    expect(hasClerkErrorCode(null, "form_identifier_exists")).toBe(false);
    expect(hasClerkErrorCode("boom", "form_identifier_exists")).toBe(false);
  });
});
