import Testing

@testable import HoopRuns

@Suite("ClerkAuthenticator error classification")
struct ClerkErrorClassificationTests {
    @Test(
        "wrong, expired or exhausted codes count as rejections",
        arguments: ["form_code_incorrect", "verification_expired", "verification_failed"]
    )
    func rejections(_ code: String) {
        #expect(ClerkAuthenticator.isRejection(code: code))
    }

    @Test(
        "anything else means the check itself failed",
        arguments: ["form_identifier_exists", "rate_limit_exceeded", "network_error", ""]
    )
    func failures(_ code: String) {
        #expect(!ClerkAuthenticator.isRejection(code: code))
    }

    @Test("an existing email switches sign-up to sign-in")
    func existingEmail() {
        #expect(ClerkAuthenticator.isExistingEmail(code: "form_identifier_exists"))
        #expect(!ClerkAuthenticator.isExistingEmail(code: "form_param_format_invalid"))
    }
}
