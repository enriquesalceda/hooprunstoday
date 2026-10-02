import DesignSystem
import SwiftUI

/// The app's single window: chrome on top, the current route below.
public struct RootView: View {
    @State private var model: AppModel

    public init(model: AppModel) {
        _model = State(initialValue: model)
    }

    public var body: some View {
        VStack(spacing: 0) {
            AppHeader()
            content
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .background(Color(hex: Palette.surfaceApp))
        .preferredColorScheme(.dark)
        .task { await model.start() }
    }

    @ViewBuilder private var content: some View {
        switch model.route {
        case .launching:
            LoadingScreen(caption: "SYS_BOOT…")
        case .signIn:
            SignInFlow(auth: model.auth) { Task { await model.didSignIn() } }
        case .loadingPlayer:
            LoadingScreen(caption: "LOADING RECORD…")
        case .signedIn(let player):
            SignedInScreen(player: player) { Task { await model.signOut() } }
        case .recordPending:
            RecordPendingScreen { Task { await model.signOut() } }
        case .loadFailed:
            LoadFailedScreen(
                onRetry: { Task { await model.retry() } },
                onSignOut: { Task { await model.signOut() } }
            )
        }
    }
}
