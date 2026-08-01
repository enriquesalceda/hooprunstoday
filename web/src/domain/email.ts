// Gate for the TRANSMIT CODE button only — typing is never blocked.
// Same pattern as the design system's signupData state machine.
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}
