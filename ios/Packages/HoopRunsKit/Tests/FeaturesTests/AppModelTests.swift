import API
import Domain
import Testing

@testable import Features

@MainActor
@Suite("AppModel")
struct AppModelTests {
    private let auth = FakeAuthenticator()
    private let jordan = Player(
        id: "p_1",
        handle: "jordan23",
        realName: "Jordan Lee",
        dateOfBirth: "1995-04-12",
        height: Height(value: "6'2", unit: .feet),
        positions: [],
        homeCourtId: "c_1"
    )

    private func model(me: APIClient.MeResult) -> AppModel {
        AppModel(auth: auth, loadMe: { me })
    }

    @Test("starts by launching")
    func launching() {
        #expect(model(me: .notFound).route == .launching)
    }

    @Test("without a session, launch goes to sign in")
    func signedOut() async {
        let model = model(me: .notFound)
        await model.start()
        #expect(model.route == .signIn)
    }

    @Test("with a session and a record, launch lands signed in")
    func restored() async {
        auth.hasSession = true
        let model = model(me: .player(jordan))
        await model.start()
        #expect(model.route == .signedIn(jordan))
    }

    @Test("a player without a record lands on the record step")
    func noRecord() async {
        auth.hasSession = true
        let model = model(me: .notFound)
        await model.start()
        #expect(model.route == .recordPending)
    }

    @Test("an expired session signs out and returns to sign in")
    func unauthorized() async {
        auth.hasSession = true
        let model = model(me: .unauthorized)
        await model.start()
        #expect(model.route == .signIn)
        #expect(auth.signOuts == 1)
    }

    @Test("a failed load offers a retry")
    func failed() async {
        auth.hasSession = true
        let model = model(me: .failed)
        await model.start()
        #expect(model.route == .loadFailed)
    }

    @Test("signing in loads the record")
    func didSignIn() async {
        let model = model(me: .player(jordan))
        await model.start()
        await model.didSignIn()
        #expect(model.route == .signedIn(jordan))
    }

    @Test("sign out returns to sign in")
    func signOut() async {
        auth.hasSession = true
        let model = model(me: .player(jordan))
        await model.start()
        await model.signOut()
        #expect(model.route == .signIn)
        #expect(auth.signOuts == 1)
    }
}
