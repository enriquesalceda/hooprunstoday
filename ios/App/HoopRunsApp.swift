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
        let config = AppConfig.load()
        let auth = ClerkAuthenticator(clerk: Clerk.configure(publishableKey: config.clerkPublishableKey))
        let api = APIClient(baseURL: config.apiBaseURL) { @MainActor in try await auth.token() }
        _model = State(initialValue: AppModel(auth: auth, loadMe: { await api.getMe() }))

        // UI tests start from a clean slate: the simulator keychain keeps
        // Clerk's session across reinstalls.
        if ProcessInfo.processInfo.arguments.contains("-uitest-signed-out") {
            Task { @MainActor in await auth.signOut() }
        }
    }

    var body: some Scene {
        WindowGroup {
            RootView(model: model)
        }
    }
}
