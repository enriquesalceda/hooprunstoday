// Mirrors backend/internal/domain/player.go — keep the two in sync.

const HANDLE_PATTERN = /^[a-z0-9_]{3,20}$/;

export function normalizeHandle(handle: string): string {
  return handle.toLowerCase();
}

/** Returns an error message, or null when valid. */
export function validateHandle(handle: string): string | null {
  if (!HANDLE_PATTERN.test(normalizeHandle(handle))) {
    return "Handles are 3–20 characters: a–z, 0–9, underscore.";
  }
  return null;
}

/** Returns an error message, or null when valid. */
export function validateRealName(realName: string): string | null {
  const trimmed = realName.trim();
  if (trimmed.length < 1 || trimmed.length > 80) {
    return "Real names are 1–80 characters.";
  }
  return null;
}
