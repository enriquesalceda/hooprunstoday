import Foundation

/// Values from Config/App.xcconfig, surfaced through Info.plist.
struct AppConfig {
    struct Missing: Error, CustomStringConvertible {
        let key: String
        var description: String { "\(key) missing from Info.plist — see Config/App.xcconfig" }
    }

    let apiBaseURL: URL
    let clerkPublishableKey: String

    init(info: [String: Any]) throws {
        guard let base = info["APIBaseURL"] as? String, !base.isEmpty, let url = URL(string: base) else {
            throw Missing(key: "APIBaseURL")
        }
        guard let key = info["ClerkPublishableKey"] as? String, !key.isEmpty else {
            throw Missing(key: "ClerkPublishableKey")
        }
        apiBaseURL = url
        clerkPublishableKey = key
    }

    static func load(from bundle: Bundle = .main) throws -> AppConfig {
        try AppConfig(info: bundle.infoDictionary ?? [:])
    }
}
