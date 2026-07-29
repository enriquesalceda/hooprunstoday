import { SignUp } from "@clerk/nextjs";

// Plain Clerk-prebuilt flow for now; the design-faithful custom phone-OTP
// form replaces this once the design package is finished.
export default function SignUpPage() {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <SignUp routing="hash" fallbackRedirectUrl="/signup/record" />
    </main>
  );
}
