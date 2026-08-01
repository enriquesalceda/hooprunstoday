"use client";

import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CodeStep, type CodeHint } from "@/app/join/_components/code-step";
import { IdentityStep } from "@/app/join/_components/identity-step";
import { maskEmail } from "@/components/forms/email-field";
import type { CodeInputState } from "@/components/forms/code-input";
import { isValidEmail } from "@/domain/email";

const RESEND_SECONDS = 28;
const MAX_ATTEMPTS = 3;
const VERIFY_DELAY_MS = 260;

type Step = "identity" | "code";
type Mode = "signUp" | "signIn";

/* Thin Clerk wiring; the step components stay pure. One entry serves both
   new and returning players (SAME EMAIL, SAME RECORD): signUp.create tells
   us which path applies. Clerk owns delivery and rate limits — the local
   attempt counter mirrors them for the UI. */
export function JoinFlow() {
  const router = useRouter();
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();

  const [step, setStep] = useState<Step>("identity");
  const [mode, setMode] = useState<Mode>("signUp");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [identityError, setIdentityError] = useState<string | undefined>(undefined);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const verifyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (step !== "code" || resendIn === 0) return;
    const id = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [step, resendIn]);

  useEffect(() => () => clearTimeout(verifyTimer.current ?? undefined), []);

  const ready = isValidEmail(email) && !!signUp && !!signIn;

  function enterCodeStep(nextMode: Mode) {
    setMode(nextMode);
    setStep("code");
    setCode("");
    setCodeError(false);
    setAttempts(MAX_ATTEMPTS);
    setResendIn(RESEND_SECONDS);
  }

  async function transmit() {
    if (!ready || sending || !signUp || !signIn) return;
    setSending(true);
    setIdentityError(undefined);

    const { error: createError } = await signUp.create({ emailAddress: email });

    if (createError && createError.code === "form_identifier_exists") {
      const { error: signInError } = await signIn.create({ identifier: email });
      const { error: sendError } = signInError ? { error: signInError } : await signIn.emailCode.sendCode();
      setSending(false);
      if (sendError) {
        setIdentityError("CODE NOT SENT · CHECK THE ADDRESS AND RETRY");
        return;
      }
      enterCodeStep("signIn");
      return;
    }

    if (createError) {
      setSending(false);
      setIdentityError("CODE NOT SENT · CHECK THE ADDRESS AND RETRY");
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    setSending(false);
    if (sendError) {
      setIdentityError("CODE NOT SENT · CHECK THE ADDRESS AND RETRY");
      return;
    }
    enterCodeStep("signUp");
  }

  async function attempt(fullCode: string) {
    if (!signUp || !signIn) return;
    setVerifying(true);

    const { error: verifyError } =
      mode === "signUp"
        ? await signUp.verifications.verifyEmailCode({ code: fullCode })
        : await signIn.emailCode.verifyCode({ code: fullCode });

    if (verifyError) {
      setVerifying(false);
      setCodeError(true);
      setAttempts((a) => Math.max(0, a - 1));
      setCode("");
      return;
    }

    const { error: finalizeError } =
      mode === "signUp" ? await signUp.finalize() : await signIn.finalize();
    setVerifying(false);
    if (finalizeError) {
      setCodeError(true);
      setCode("");
      return;
    }
    router.push("/join/record");
  }

  function onCodeChange(value: string) {
    if (attempts === 0) return;
    setCodeError(false);
    setCode(value);
    clearTimeout(verifyTimer.current ?? undefined);
    if (value.length === 6) {
      verifyTimer.current = setTimeout(() => void attempt(value), VERIFY_DELAY_MS);
    }
  }

  async function resend() {
    if (!signUp || !signIn) return;
    const { error } =
      mode === "signUp" ? await signUp.verifications.sendEmailCode() : await signIn.emailCode.sendCode();
    if (error) {
      setIdentityError("CODE NOT SENT · CHECK THE ADDRESS AND RETRY");
      setStep("identity");
      return;
    }
    setCode("");
    setCodeError(false);
    setAttempts(MAX_ATTEMPTS);
    setResendIn(RESEND_SECONDS);
  }

  if (step === "identity") {
    return (
      <IdentityStep
        email={email}
        onEmailChange={setEmail}
        ready={ready}
        sending={sending}
        error={identityError}
        onTransmit={() => void transmit()}
      />
    );
  }

  const codeState: CodeInputState = attempts === 0 ? "locked" : codeError ? "error" : "default";
  const hint: CodeHint =
    attempts === 0
      ? { text: "TOO MANY ATTEMPTS · REQUEST A NEW CODE", ink: "var(--text-primary)" }
      : codeError
        ? {
            text: `CODE REJECTED · ${attempts} ATTEMPT${attempts === 1 ? "" : "S"} LEFT`,
            ink: "var(--text-muted)",
          }
        : verifying || code.length === 6
          ? { text: "VERIFYING…", ink: "var(--text-primary)" }
          : { text: "6 DIGITS · PASTE OR TYPE", ink: "var(--text-faint)" };

  return (
    <CodeStep
      emailMasked={maskEmail(email)}
      code={code}
      onCodeChange={onCodeChange}
      state={codeState}
      hint={hint}
      resendIn={resendIn}
      onResend={() => void resend()}
      onBack={() => {
        setStep("identity");
        setCode("");
        setCodeError(false);
      }}
    />
  );
}
