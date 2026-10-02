import ClerkKit
import Features

/// Adapts Clerk's iOS SDK to the `Authenticator` seam. Mirrors the web flow:
/// try sign-up first; an existing email (`form_identifier_exists`) switches
/// to an email-code sign-in. Thin by design — covered end to end, not unit
/// tested.
@MainActor
final class ClerkAuthenticator: Authenticator {
    private enum Attempt {
        case signUp(SignUp)
        case signIn(SignIn)
    }

    struct NoAttemptInProgress: Error {}
    struct Incomplete: Error { let status: String }

    /// Clerk codes that mean "this code is wrong or no longer valid", as
    /// opposed to the check itself failing.
    private static let rejectionCodes: Set<String> = [
        "form_code_incorrect", "verification_expired", "verification_failed",
    ]

    private let clerk: Clerk
    private var attempt: Attempt?

    init(clerk: Clerk) {
        self.clerk = clerk
    }

    func restoreSession() async -> Bool {
        // Clerk loads its environment and any persisted client on configure.
        for _ in 0..<100 where !clerk.isLoaded {
            try? await Task.sleep(for: .milliseconds(100))
        }
        return clerk.session != nil
    }

    func sendCode(to email: String) async throws {
        do {
            let signUp = try await clerk.auth.signUp(emailAddress: email)
            attempt = .signUp(try await signUp.sendEmailCode())
        } catch let error as ClerkAPIError where error.code == "form_identifier_exists" {
            attempt = .signIn(try await clerk.auth.signInWithEmailCode(emailAddress: email))
        }
    }

    func resendCode() async throws {
        switch attempt {
        case .signUp(let signUp): attempt = .signUp(try await signUp.sendEmailCode())
        case .signIn(let signIn): attempt = .signIn(try await signIn.sendEmailCode())
        case nil: throw NoAttemptInProgress()
        }
    }

    func verify(code: String) async throws -> VerifyOutcome {
        do {
            let sessionId: String?
            switch attempt {
            case .signUp(let signUp):
                let result = try await signUp.verifyEmailCode(code)
                attempt = .signUp(result)
                guard result.status == .complete else { throw Incomplete(status: "\(result.status)") }
                sessionId = result.createdSessionId
            case .signIn(let signIn):
                let result = try await signIn.verifyCode(code)
                attempt = .signIn(result)
                guard result.status == .complete else { throw Incomplete(status: "\(result.status)") }
                sessionId = result.createdSessionId
            case nil:
                throw NoAttemptInProgress()
            }
            if clerk.session == nil, let sessionId {
                try await clerk.auth.setActive(sessionId: sessionId)
            }
            attempt = nil
            return .verified
        } catch let error as ClerkAPIError where Self.rejectionCodes.contains(error.code) {
            return .rejected
        }
    }

    func token() async throws -> String? {
        try await clerk.auth.getToken()
    }

    func signOut() async {
        attempt = nil
        try? await clerk.auth.signOut()
    }
}
