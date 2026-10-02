import Foundation

/// Values from Config/App.xcconfig, read once from Info.plist.
struct AppConfig {
    let apiBaseURL: URL
    let clerkPublishableKey: String

    static func load(from bundle: Bundle = .main) -> AppConfig {
        guard
            let base = bundle.object(forInfoDictionaryKey: "APIBaseURL") as? String,
            let url = URL(string: base),
            let key = bundle.object(forInfoDictionaryKey: "ClerkPublishableKey") as? String,
            !key.isEmpty
        else {
            fatalError("APIBaseURL / ClerkPublishableKey missing from Info.plist — see Config/App.xcconfig")
        }
        return AppConfig(apiBaseURL: url, clerkPublishableKey: key)
    }
}
