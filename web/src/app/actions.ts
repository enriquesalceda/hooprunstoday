"use server";

import { createLead, type CreateLeadInput, type CreateLeadResult } from "@/lib/api/leads";

// Actions are public POST endpoints — narrow the untrusted input to the
// shapes the API knows; the backend domain is the validation authority.
export async function submitLead(input: CreateLeadInput): Promise<CreateLeadResult> {
  return createLead({
    name: String(input.name),
    contactMethod: input.contactMethod === "MOBILE" ? "MOBILE" : "EMAIL",
    contact: String(input.contact),
  });
}
