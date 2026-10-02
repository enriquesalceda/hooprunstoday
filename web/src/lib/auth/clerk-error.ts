/* Clerk's API errors arrive as `ClerkAPIResponseError`, whose own `code` is
   the generic "api_response_error"; the meaningful codes (e.g.
   "form_identifier_exists") live in its `errors` list. Check both. */
export function hasClerkErrorCode(error: unknown, code: string): boolean {
  if (typeof error !== "object" || error === null) return false;
  if ("code" in error && error.code === code) return true;
  if (!("errors" in error) || !Array.isArray(error.errors)) return false;
  return error.errors.some(
    (e: unknown) => typeof e === "object" && e !== null && "code" in e && e.code === code,
  );
}
