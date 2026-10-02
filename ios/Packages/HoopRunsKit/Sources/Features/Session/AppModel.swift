import API
import Domain
import Observation

/// Top-level routing: restore the session, then let `GET /players/me`
/// decide where a signed-in player lands.
@MainActor
@Observable
public final class AppModel {
    public enum Route: Equatable {
        case launching
        case signIn
        case loadingPlayer
        case signedIn(Player)
        /// Signed in, but no player record yet (404). O3 comes next.
        case recordPending
        case loadFailed
    }

    public typealias LoadMe = @Sendable () async -> APIClient.MeResult

    public private(set) var route = Route.launching

    public let auth: any Authenticator
    private let loadMe: LoadMe

    public init(auth: any Authenticator, loadMe: @escaping LoadMe) {
        self.auth = auth
        self.loadMe = loadMe
    }

    public func start() async {
        if await auth.restoreSession() {
            await loadPlayer()
        } else {
            route = .signIn
        }
    }

    public func didSignIn() async {
        await loadPlayer()
    }

    public func retry() async {
        await loadPlayer()
    }

    public func signOut() async {
        await auth.signOut()
        route = .signIn
    }

    private func loadPlayer() async {
        route = .loadingPlayer
        switch await loadMe() {
        case .player(let player): route = .signedIn(player)
        case .notFound: route = .recordPending
        case .unauthorized: await signOut()
        case .failed: route = .loadFailed
        }
    }
}
