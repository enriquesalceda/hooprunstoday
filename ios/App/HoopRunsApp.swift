import API
import ClerkKit
import DesignSystem
import Features
import SwiftUI

/// Composition root: the only place that wires concrete dependencies.
@main
struct HoopRunsApp: App {
    @State private var model: AppModel

    init() {
        Fonts.register()
        let config: AppConfig
        do {
            config = try AppConfig.load()
        } catch {
            fatalError("\(error)")
        }
        let auth = ClerkAuthenticator(
            clerk: Clerk.configure(publishableKey: config.clerkPublishableKey),
            startSignedOut: ProcessInfo.processInfo.arguments.contains("-uitest-signed-out")
        )
        let api = APIClient(baseURL: config.apiBaseURL) { @MainActor in try await auth.token() }
        _model = State(initialValue: AppModel(auth: auth, loadMe: { await api.getMe() }))
    }

    var body: some Scene {
        WindowGroup {
            RootView(model: model)
        }
    }
}
