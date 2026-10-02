import Domain
import Observation

/// Drives O1 (identity) → O2 (code). Mirrors the web join flow
/// (web/src/app/join/_components/join-flow.tsx).
@MainActor
@Observable
public final class SignInModel {
    public enum Step: Equatable { case identity, code }

    public typealias Delay = @Sendable (Duration) async throws -> Void

    /// Six digits verify on their own after this pause, so a paste or a
    /// last keystroke is visible before the check starts.
    static let verifyPause = Duration.milliseconds(260)

    public private(set) var step = Step.identity
    public private(set) var isSending = false
    public private(set) var code = CodeEntry()
    private(set) var pendingVerify: Task<Void, Never>?
    private var sendFailed = false

    public var email = "" {
        didSet {
            let cleaned = Email.clean(email)
            if cleaned != email { email = cleaned }
            sendFailed = false
        }
    }

    private let auth: any Authenticator
    private let onSignedIn: @MainActor () -> Void
    private let verifyDelay: Delay

    public init(
        auth: any Authenticator,
        onSignedIn: @escaping @MainActor () -> Void,
        verifyDelay: @escaping Delay = { try await Task.sleep(for: $0) }
    ) {
        self.auth = auth
        self.onSignedIn = onSignedIn
        self.verifyDelay = verifyDelay
    }

    public var canTransmit: Bool { Email.isValid(email) && !isSending }

    public var identityHint: String {
        if sendFailed { return "CODE NOT SENT · CHECK THE ADDRESS AND RETRY" }
        return Email.isValid(email)
            ? "READY · ONE-TIME CODE, NO PASSWORD TO FORGET"
            : "YOUR EMAIL NEVER APPEARS ON YOUR PROFILE."
    }

    public var maskedEmail: String { Email.mask(email) }

    public func transmit() async {
        guard canTransmit else { return }
        isSending = true
        defer { isSending = false }
        do {
            try await auth.sendCode(to: email)
            code = CodeEntry()
            step = .code
        } catch {
            sendFailed = true
        }
    }

    public func back() {
        pendingVerify?.cancel()
        step = .identity
    }

    public func typeCode(_ raw: String) {
        pendingVerify?.cancel()
        pendingVerify = nil
        code.type(raw)
        guard code.isComplete else { return }
        pendingVerify = Task { [verifyDelay] in
            do { try await verifyDelay(Self.verifyPause) } catch { return }
            await verify()
        }
    }

    /// One second of the resend cooldown. The code screen calls it while visible.
    public func tick() {
        code.tick()
    }

    public func resend() async {
        guard code.canResend else { return }
        pendingVerify?.cancel()
        do {
            try await auth.resendCode()
            code.resent()
        } catch {
            sendFailed = true
            step = .identity
        }
    }

    private func verify() async {
        guard let digits = code.beginVerify() else { return }
        do {
            switch try await auth.verify(code: digits) {
            case .verified: onSignedIn()
            case .rejected: code.reject()
            }
        } catch {
            code.fail()
        }
    }
}
