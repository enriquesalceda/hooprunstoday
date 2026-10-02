import Features

/// Hand-written fake for the Clerk seam. Scripted outcomes, recorded calls.
@MainActor
final class FakeAuthenticator: Authenticator {
    var hasSession = false
    var sendError: Error?
    var resendError: Error?
    var verifyResult: Result<VerifyOutcome, Error> = .success(.verified)
    var sessionToken: String? = "tok_123"

    private(set) var sentTo: [String] = []
    private(set) var resends = 0
    private(set) var verified: [String] = []
    private(set) var signOuts = 0

    func restoreSession() async -> Bool { hasSession }

    func sendCode(to email: String) async throws {
        sentTo.append(email)
        if let sendError { throw sendError }
    }

    func resendCode() async throws {
        resends += 1
        if let resendError { throw resendError }
    }

    func verify(code: String) async throws -> VerifyOutcome {
        verified.append(code)
        let outcome = try verifyResult.get()
        if outcome == .verified { hasSession = true }
        return outcome
    }

    func token() async throws -> String? { sessionToken }

    func signOut() async {
        signOuts += 1
        hasSession = false
    }
}

struct Boom: Error {}
