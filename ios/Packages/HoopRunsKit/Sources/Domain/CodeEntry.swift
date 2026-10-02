/// The O2 code step as a value: digits, attempts, lock and resend cooldown.
/// Mirrors the web join flow (web/src/app/join/_components/join-flow.tsx).
/// Time is driven by explicit `tick()` calls, one per second.
public struct CodeEntry: Equatable, Sendable {
    public static let length = 6
    public static let maxAttempts = 3
    public static let resendSeconds = 28

    public enum Cells: Equatable, Sendable { case normal, rejected, locked }

    public struct Hint: Equatable, Sendable {
        public enum Tone: Equatable, Sendable { case faint, muted, primary }

        public let text: String
        public let tone: Tone
        public let isAlert: Bool

        public init(text: String, tone: Tone, isAlert: Bool = false) {
            self.text = text
            self.tone = tone
            self.isAlert = isAlert
        }
    }

    public private(set) var digits = ""
    public private(set) var attemptsLeft = maxAttempts
    public private(set) var resendIn = resendSeconds
    public private(set) var isVerifying = false
    private var rejected = false
    private var failed = false

    public init() {}

    public var isComplete: Bool { digits.count == Self.length }
    public var isLocked: Bool { attemptsLeft == 0 }
    public var canResend: Bool { resendIn == 0 }

    public var cells: Cells {
        if isLocked { return .locked }
        return rejected ? .rejected : .normal
    }

    public var hint: Hint {
        if isLocked { return Hint(text: "TOO MANY ATTEMPTS · REQUEST A NEW CODE", tone: .primary, isAlert: true) }
        if rejected {
            let plural = attemptsLeft == 1 ? "" : "S"
            return Hint(text: "CODE REJECTED · \(attemptsLeft) ATTEMPT\(plural) LEFT", tone: .muted, isAlert: true)
        }
        if failed { return Hint(text: "CODE NOT CHECKED · RETRY", tone: .muted, isAlert: true) }
        if isVerifying || isComplete { return Hint(text: "VERIFYING…", tone: .primary) }
        return Hint(text: "6 DIGITS · PASTE OR TYPE", tone: .faint)
    }

    public var resendLabel: String {
        canResend ? "RESEND CODE" : "RESEND CODE IN 0:\(resendIn < 10 ? "0" : "")\(resendIn)"
    }

    /// Replaces the typed value. Ignored while locked or verifying.
    public mutating func type(_ raw: String) {
        guard !isLocked, !isVerifying else { return }
        digits = String(raw.filter(\.isASCIIDigit).prefix(Self.length))
        rejected = false
        failed = false
    }

    /// Returns the code to check, at most once per complete entry.
    public mutating func beginVerify() -> String? {
        guard isComplete, !isLocked, !isVerifying else { return nil }
        isVerifying = true
        return digits
    }

    /// Wrong code: spend an attempt and start the entry over.
    public mutating func reject() {
        isVerifying = false
        attemptsLeft = max(0, attemptsLeft - 1)
        digits = ""
        rejected = true
    }

    /// The check itself failed (network, config): keep the attempt.
    public mutating func fail() {
        isVerifying = false
        digits = ""
        failed = true
    }

    public mutating func tick() {
        resendIn = max(0, resendIn - 1)
    }

    public mutating func resent() {
        self = CodeEntry()
    }
}

extension Character {
    fileprivate var isASCIIDigit: Bool { ("0"..."9").contains(self) }
}
