import Domain
import Testing

@testable import Features

@MainActor
@Suite("SignInModel")
struct SignInModelTests {
    private let auth = FakeAuthenticator()

    private func model(onSignedIn: @escaping @MainActor () -> Void = {}) -> SignInModel {
        SignInModel(auth: auth, onSignedIn: onSignedIn, verifyDelay: { _ in })
    }

    // MARK: O1 — identity

    @Test("starts on the identity step with TRANSMIT disabled")
    func initial() {
        let model = model()
        #expect(model.step == .identity)
        #expect(!model.canTransmit)
        #expect(model.identityHint == "YOUR EMAIL NEVER APPEARS ON YOUR PROFILE.")
    }

    @Test("a valid email enables TRANSMIT and changes the hint")
    func validEmail() {
        let model = model()
        model.email = "jordan@court.com"
        #expect(model.canTransmit)
        #expect(model.identityHint == "READY · ONE-TIME CODE, NO PASSWORD TO FORGET")
    }

    @Test("strips whitespace as the player types")
    func strips() {
        let model = model()
        model.email = " jordan @court.com "
        #expect(model.email == "jordan@court.com")
    }

    @Test("transmitting sends the code and moves to the code step")
    func transmit() async {
        let model = model()
        model.email = "jordan@court.com"
        await model.transmit()
        #expect(auth.sentTo == ["jordan@court.com"])
        #expect(model.step == .code)
        #expect(model.maskedEmail == "j•••••@court.com")
        #expect(model.code == CodeEntry())
    }

    @Test("does not transmit an invalid email")
    func transmitInvalid() async {
        let model = model()
        model.email = "jordan@"
        await model.transmit()
        #expect(auth.sentTo.isEmpty)
        #expect(model.step == .identity)
    }

    @Test("a failed send stays on identity and says so")
    func sendFails() async {
        auth.sendError = Boom()
        let model = model()
        model.email = "jordan@court.com"
        await model.transmit()
        #expect(model.step == .identity)
        #expect(model.identityHint == "CODE NOT SENT · CHECK THE ADDRESS AND RETRY")
        #expect(!model.isSending)
    }

    @Test("editing the email clears a send error")
    func editClearsError() async {
        auth.sendError = Boom()
        let model = model()
        model.email = "jordan@court.com"
        await model.transmit()
        model.email = "jordan@court.co"
        #expect(model.identityHint == "READY · ONE-TIME CODE, NO PASSWORD TO FORGET")
    }

    // MARK: O2 — code

    private func onCodeStep(onSignedIn: @escaping @MainActor () -> Void = {}) async -> SignInModel {
        let model = model(onSignedIn: onSignedIn)
        model.email = "jordan@court.com"
        await model.transmit()
        return model
    }

    @Test("six digits auto-verify and a verified code signs in")
    func verifies() async {
        var signedIn = false
        let model = await onCodeStep { signedIn = true }
        model.typeCode("424242")
        await model.pendingVerify?.value
        #expect(auth.verified == ["424242"])
        #expect(signedIn)
    }

    @Test("fewer than six digits do not verify")
    func partial() async {
        let model = await onCodeStep()
        model.typeCode("4242")
        #expect(model.pendingVerify == nil)
        #expect(auth.verified.isEmpty)
    }

    @Test("a wrong code spends an attempt and stays on the code step")
    func rejected() async {
        auth.verifyResult = .success(.rejected)
        var signedIn = false
        let model = await onCodeStep { signedIn = true }
        model.typeCode("000000")
        await model.pendingVerify?.value
        #expect(model.code.attemptsLeft == 2)
        #expect(model.code.hint.text == "CODE REJECTED · 2 ATTEMPTS LEFT")
        #expect(!signedIn)
    }

    @Test("a failed check keeps the attempt")
    func checkFails() async {
        auth.verifyResult = .failure(Boom())
        let model = await onCodeStep()
        model.typeCode("424242")
        await model.pendingVerify?.value
        #expect(model.code.attemptsLeft == 3)
        #expect(model.code.hint.text == "CODE NOT CHECKED · RETRY")
    }

    @Test("editing during the verify delay cancels the pending check")
    func editCancels() async {
        let model = SignInModel(
            auth: auth, onSignedIn: {}, verifyDelay: { _ in try await Task.sleep(for: .seconds(60)) })
        model.email = "jordan@court.com"
        await model.transmit()
        model.typeCode("424242")
        let pending = model.pendingVerify
        model.typeCode("42424")
        await pending?.value
        #expect(auth.verified.isEmpty)
    }

    @Test("resend is ignored during the cooldown")
    func resendCooldown() async {
        let model = await onCodeStep()
        await model.resend()
        #expect(auth.resends == 0)
    }

    @Test("resend after the cooldown sends a new code and starts over")
    func resend() async {
        auth.verifyResult = .success(.rejected)
        let model = await onCodeStep()
        model.typeCode("000000")
        await model.pendingVerify?.value
        for _ in 0..<CodeEntry.resendSeconds { model.tick() }
        await model.resend()
        #expect(auth.resends == 1)
        #expect(model.code == CodeEntry())
    }

    @Test("a failed resend returns to identity with the send error")
    func resendFails() async {
        auth.resendError = Boom()
        let model = await onCodeStep()
        for _ in 0..<CodeEntry.resendSeconds { model.tick() }
        await model.resend()
        #expect(model.step == .identity)
        #expect(model.identityHint == "CODE NOT SENT · CHECK THE ADDRESS AND RETRY")
    }

    @Test("back returns to identity keeping the email")
    func back() async {
        let model = await onCodeStep()
        model.back()
        #expect(model.step == .identity)
        #expect(model.email == "jordan@court.com")
    }
}
