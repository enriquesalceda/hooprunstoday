import Testing

@testable import Domain

@Suite("CodeEntry")
struct CodeEntryTests {
    @Test("starts empty with three attempts and the resend cooldown running")
    func initial() {
        let entry = CodeEntry()
        #expect(entry.digits == "")
        #expect(entry.attemptsLeft == 3)
        #expect(entry.resendIn == 28)
        #expect(entry.hint == .init(text: "6 DIGITS · PASTE OR TYPE", tone: .faint))
        #expect(entry.cells == .normal)
        #expect(entry.resendLabel == "RESEND CODE IN 0:28")
    }

    @Test("keeps only digits, capped at six")
    func digitsOnly() {
        var entry = CodeEntry()
        entry.type("12a3 4-5678")
        #expect(entry.digits == "123456")
    }

    @Test("a full code is ready to verify and says so")
    func complete() {
        var entry = CodeEntry()
        entry.type("123456")
        #expect(entry.isComplete)
        #expect(entry.hint == .init(text: "VERIFYING…", tone: .primary))
    }

    @Test("beginVerify hands out the code once and blocks edits while verifying")
    func beginVerify() {
        var entry = CodeEntry()
        entry.type("123456")
        #expect(entry.beginVerify() == "123456")
        #expect(entry.beginVerify() == nil)
        entry.type("1")
        #expect(entry.digits == "123456")
    }

    @Test("beginVerify refuses an incomplete code")
    func beginVerifyIncomplete() {
        var entry = CodeEntry()
        entry.type("123")
        #expect(entry.beginVerify() == nil)
    }

    @Test("a rejection spends an attempt, clears the code and dashes the cells")
    func reject() {
        var entry = CodeEntry()
        entry.type("000000")
        _ = entry.beginVerify()
        entry.reject()
        #expect(entry.digits == "")
        #expect(entry.attemptsLeft == 2)
        #expect(entry.cells == .rejected)
        #expect(entry.hint == .init(text: "CODE REJECTED · 2 ATTEMPTS LEFT", tone: .muted, isAlert: true))
    }

    @Test("the last attempt is singular")
    func singular() {
        var entry = CodeEntry()
        for _ in 0..<2 {
            entry.type("000000")
            _ = entry.beginVerify()
            entry.reject()
        }
        #expect(entry.hint.text == "CODE REJECTED · 1 ATTEMPT LEFT")
    }

    @Test("typing again clears the rejection")
    func typingClearsRejection() {
        var entry = CodeEntry()
        entry.type("000000")
        _ = entry.beginVerify()
        entry.reject()
        entry.type("1")
        #expect(entry.cells == .normal)
        #expect(entry.hint.text == "6 DIGITS · PASTE OR TYPE")
    }

    @Test("three rejections lock the input until a resend")
    func lock() {
        var entry = CodeEntry()
        for _ in 0..<3 {
            entry.type("000000")
            _ = entry.beginVerify()
            entry.reject()
        }
        #expect(entry.isLocked)
        #expect(entry.cells == .locked)
        #expect(entry.hint == .init(text: "TOO MANY ATTEMPTS · REQUEST A NEW CODE", tone: .primary, isAlert: true))
        entry.type("123456")
        #expect(entry.digits == "")
    }

    @Test("a failed check (not a wrong code) keeps the attempt and asks to retry")
    func failed() {
        var entry = CodeEntry()
        entry.type("123456")
        _ = entry.beginVerify()
        entry.fail()
        #expect(entry.attemptsLeft == 3)
        #expect(entry.digits == "")
        #expect(entry.hint == .init(text: "CODE NOT CHECKED · RETRY", tone: .muted, isAlert: true))
    }

    @Test("the resend cooldown counts down to zero, then resend is offered")
    func cooldown() {
        var entry = CodeEntry()
        for _ in 0..<19 { entry.tick() }
        #expect(entry.resendLabel == "RESEND CODE IN 0:09")
        #expect(!entry.canResend)
        for _ in 0..<20 { entry.tick() }
        #expect(entry.resendIn == 0)
        #expect(entry.canResend)
        #expect(entry.resendLabel == "RESEND CODE")
    }

    @Test("a resend starts over: fresh attempts, empty code, cooldown restarted")
    func resent() {
        var entry = CodeEntry()
        for _ in 0..<3 {
            entry.type("000000")
            _ = entry.beginVerify()
            entry.reject()
        }
        for _ in 0..<28 { entry.tick() }
        entry.resent()
        #expect(entry == CodeEntry())
    }
}
