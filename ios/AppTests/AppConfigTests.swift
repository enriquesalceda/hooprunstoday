import Testing

@testable import HoopRuns

@Suite("AppConfig")
struct AppConfigTests {
    @Test("reads the API URL and Clerk key from Info.plist values")
    func reads() throws {
        let config = try AppConfig(info: [
            "APIBaseURL": "http://localhost:8080",
            "ClerkPublishableKey": "pk_test_abc",
        ])
        #expect(config.apiBaseURL.absoluteString == "http://localhost:8080")
        #expect(config.clerkPublishableKey == "pk_test_abc")
    }

    @Test(
        "rejects missing or empty values",
        arguments: [
            [:],
            ["APIBaseURL": "http://localhost:8080"],
            ["ClerkPublishableKey": "pk_test_abc"],
            ["APIBaseURL": "", "ClerkPublishableKey": "pk_test_abc"],
            ["APIBaseURL": "http://localhost:8080", "ClerkPublishableKey": ""],
        ] as [[String: String]]
    )
    func missing(_ info: [String: String]) {
        #expect(throws: AppConfig.Missing.self) { try AppConfig(info: info) }
    }

    @Test("the bundled Info.plist is wired to Config/App.xcconfig")
    func bundled() throws {
        let config = try AppConfig.load()
        #expect(config.apiBaseURL.absoluteString == "http://localhost:8080")
        #expect(config.clerkPublishableKey.hasPrefix("pk_"))
    }
}
