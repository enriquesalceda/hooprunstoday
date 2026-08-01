export type RecordFormState =
  | { status: "idle" }
  | { status: "error"; message: string; fields?: Record<string, string> };
