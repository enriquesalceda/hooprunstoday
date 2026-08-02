// The one place that knows the backend's leads endpoint and JSON contract.

import { apiUrl } from "@/lib/api/client";
import type { ContactMethod } from "@/domain/lead";

export type Lead = {
  id: string;
  name: string;
  contactMethod: ContactMethod;
  contact: string;
  createdAt: string;
};

export type CreateLeadErrorCode =
  | "validation_failed"
  | "malformed_json"
  | "internal"
  | "network";

export type CreateLeadResult =
  | { ok: true; lead: Lead }
  | { ok: false; code: CreateLeadErrorCode; fields?: Record<string, string> };

export type CreateLeadInput = {
  name: string;
  contactMethod: ContactMethod;
  contact: string;
};

export async function createLead(input: CreateLeadInput): Promise<CreateLeadResult> {
  let res: Response;
  try {
    res = await fetch(`${apiUrl()}/api/v1/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        contact_method: input.contactMethod,
        contact: input.contact,
      }),
    });
  } catch {
    return { ok: false, code: "network" };
  }

  if (res.status === 201) {
    const body = (await res.json()) as {
      id: string;
      name: string;
      contact_method: ContactMethod;
      contact: string;
      created_at: string;
    };
    return {
      ok: true,
      lead: {
        id: body.id,
        name: body.name,
        contactMethod: body.contact_method,
        contact: body.contact,
        createdAt: body.created_at,
      },
    };
  }

  const body = (await res.json().catch(() => null)) as {
    error?: { code?: string; fields?: Record<string, string> };
  } | null;
  const code = (body?.error?.code ?? "internal") as CreateLeadErrorCode;
  const fields = body?.error?.fields;
  return fields ? { ok: false, code, fields } : { ok: false, code };
}
