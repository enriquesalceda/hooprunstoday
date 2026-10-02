import SwiftUI

/// O1 → O2. Screen changes are instant: the system has no transitions.
struct SignInFlow: View {
    @State private var model: SignInModel

    init(auth: any Authenticator, onSignedIn: @escaping @MainActor () -> Void) {
        _model = State(initialValue: SignInModel(auth: auth, onSignedIn: onSignedIn))
    }

    var body: some View {
        switch model.step {
        case .identity: IdentityScreen(model: model)
        case .code: CodeScreen(model: model)
        }
    }
}
