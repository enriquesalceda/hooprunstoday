/// The seam between the app and its identity provider (Clerk). Features
/// depend on this; the Clerk adapter in App/ implements it, and tests use a
/// hand-written fake.
@MainActor
public protocol Authenticator: AnyObject {
    /// Waits for any persisted session to load. True when one is active.
    func restoreSession() async -> Bool
    /// Starts email-code verification: sign up a new email, or sign in an
    /// existing one. Throws when the code could not be sent.
    func sendCode(to email: String) async throws
    func resendCode() async throws
    /// Throws when the check itself failed (network, config) rather than
    /// the code being wrong.
    func verify(code: String) async throws -> VerifyOutcome
    /// A fresh session JWT for the API, or nil when signed out.
    func token() async throws -> String?
    func signOut() async
}

public enum VerifyOutcome: Equatable, Sendable {
    case verified
    case rejected
}
