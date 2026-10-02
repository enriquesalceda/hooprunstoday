"use client";

import { useState } from "react";

import { firstName, titleCaseName, validateLead, type LeadErrors } from "@/domain/lead";
import {
  COUNTRIES,
  countryByCode,
  DEFAULT_COUNTRY,
  formatPhone,
  phoneDigitsFromInput,
  toE164,
  type CountryCode,
} from "@/domain/phone";
import type { CreateLeadInput, CreateLeadResult } from "@/lib/api/leads";

import styles from "./lead-form.module.css";

type Props = {
  action: (input: CreateLeadInput) => Promise<CreateLeadResult>;
};

const fieldCopy = {
  name: { required: "ENTER YOUR FIRST NAME", invalid: "ENTER YOUR FIRST NAME" },
  email: { required: "PLEASE ENTER YOUR EMAIL ADDRESS", invalid: "PLEASE ENTER A VALID EMAIL ADDRESS" },
  phone: { required: "ENTER A VALID MOBILE NUMBER", invalid: "ENTER A VALID MOBILE NUMBER" },
} as const;

const SEND_FAILED = "COULDN’T SEND. TRY AGAIN.";

type Sent = { first: string; phone: string | null };

function ErrorChip({ children }: { children: string }) {
  return (
    <span role="alert" className={styles.error}>
      {children}
    </span>
  );
}

/* The waitlist form: first name, email, optional mobile for SMS launch
   alerts. Validation runs on submit and marks fields; typing is never
   blocked. A hidden "company" field catches bots, which get a fake success. */
export function LeadForm({ action }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState("");
  const [honey, setHoney] = useState("");
  const [errors, setErrors] = useState<LeadErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Sent | null>(null);

  const c = countryByCode(country);

  if (sent !== null) {
    return (
      <div className={styles.sent}>
        <span className={styles.sentLine}>
          YOU&apos;RE ON THE LIST{sent.first === "" ? "." : `, ${sent.first}.`}
        </span>
        {sent.phone !== null && (
          <span className={styles.sentSub}>VIP DROP ALERTS ON · {sent.phone}</span>
        )}
      </div>
    );
  }

  const clearError = (field: keyof LeadErrors) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setFormError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (honey !== "") {
      setSent({ first: "", phone: null });
      return;
    }
    const found = validateLead({ name, email, phone, country });
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setSending(true);
    setErrors({});
    setFormError(null);
    const result = await action({
      name: name.trim(),
      contactMethod: "EMAIL",
      contact: email.trim().toLowerCase(),
      phone: phone === "" ? null : toE164(phone, c),
    });
    setSending(false);
    if (result.ok) {
      setSent({ first: firstName(name), phone: phone === "" ? null : `+${c.dial} ${formatPhone(phone, c)}` });
      return;
    }
    setFormError(SEND_FAILED);
  };

  return (
    <form onSubmit={submit} noValidate className={styles.form}>
      <div className={styles.row}>
        <div className={`${styles.field} ${styles.name}`}>
          <input
            name="firstName"
            type="text"
            placeholder="FIRST NAME"
            aria-label="First name"
            aria-invalid={errors.name !== undefined}
            autoComplete="given-name"
            autoCapitalize="words"
            maxLength={50}
            value={name}
            onChange={(e) => {
              setName(titleCaseName(e.target.value));
              clearError("name");
            }}
            onBlur={() => setName((v) => v.trim())}
            className={styles.input}
          />
          {errors.name !== undefined && <ErrorChip>{fieldCopy.name[errors.name]}</ErrorChip>}
        </div>

        <div className={`${styles.field} ${styles.email}`}>
          <input
            name="email"
            type="email"
            inputMode="email"
            placeholder="EMAIL ADDRESS"
            aria-label="Email address"
            aria-invalid={errors.email !== undefined}
            autoComplete="email"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.replace(/\s/g, ""));
              clearError("email");
            }}
            className={styles.input}
          />
          {errors.email !== undefined && <ErrorChip>{fieldCopy.email[errors.email]}</ErrorChip>}
        </div>

        <div className={`${styles.field} ${styles.mobile}`}>
          <div className={styles.phoneFrame} aria-invalid={errors.phone !== undefined}>
            <div className={styles.countryWrap}>
              <select
                name="country"
                aria-label="Country dialing code"
                autoComplete="tel-country-code"
                value={country}
                onChange={(e) => {
                  const next = countryByCode(e.target.value);
                  setCountry(next.code);
                  setPhone((v) => v.slice(0, next.max));
                  clearError("phone");
                }}
                className={styles.country}
              >
                {COUNTRIES.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span aria-hidden="true" className={styles.caret}>
                ▼
              </span>
            </div>
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder={c.placeholder}
              aria-label="Mobile number (optional)"
              autoComplete="tel-national"
              value={formatPhone(phone, c)}
              onChange={(e) => {
                setPhone(phoneDigitsFromInput(e.target.value, phone, c));
                clearError("phone");
              }}
              className={styles.phone}
            />
          </div>
          {errors.phone !== undefined ? (
            <ErrorChip>{fieldCopy.phone[errors.phone]}</ErrorChip>
          ) : (
            <span className={styles.hint}>OPTIONAL · VIP DROP ALERTS</span>
          )}
        </div>

        <button type="submit" disabled={sending} className={`${styles.field} ${styles.submit} ${styles.button}`}>
          {sending ? (
            <>
              <span className={styles.pulse} />
              SENDING
            </>
          ) : (
            "GET ON THE LIST"
          )}
        </button>
      </div>

      <div aria-hidden="true" className={styles.honeypot}>
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
        />
      </div>

      {formError !== null && <ErrorChip>{formError}</ErrorChip>}

      <p className={styles.consent}>
        By providing your phone number, you agree to receive launch alerts via SMS. Consent is not a
        condition of purchase. Reply STOP to cancel. Msg &amp; data rates may apply.
      </p>
    </form>
  );
}
