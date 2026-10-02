import Domain
import Foundation
import Testing

@testable import API

@Suite("GET /api/v1/players/me", .serialized)
struct GetMeTests {
    private let baseURL = URL(string: "https://api.test")!

    private func client(token: String? = "tok_123") -> APIClient {
        APIClient(baseURL: baseURL, session: StubURLProtocol.session(), token: { token })
    }

    @Test("sends the bearer token to the me endpoint")
    func request() async {
        StubURLProtocol.respond { _ in .init(status: 404, body: #"{"error":{"code":"player_not_found"}}"#) }
        _ = await client().getMe()
        let sent = StubURLProtocol.requests.first
        #expect(sent?.url?.absoluteString == "https://api.test/api/v1/players/me")
        #expect(sent?.httpMethod == "GET")
        #expect(sent?.value(forHTTPHeaderField: "Authorization") == "Bearer tok_123")
    }

    @Test("decodes the player on 200")
    func found() async {
        StubURLProtocol.respond { _ in
            .init(
                status: 200,
                body: """
                    {"id":"p_1","clerk_user_id":"user_1","real_name":"Jordan Lee","handle":"jordan23",
                     "date_of_birth":"1995-04-12","height":{"value":"6'2","unit":"FT"},
                     "positions":["PG","SG"],"home_court_id":"c_1","created_at":"2026-08-01T10:00:00Z"}
                    """
            )
        }
        let result = await client().getMe()
        #expect(
            result
                == .player(
                    Player(
                        id: "p_1",
                        handle: "jordan23",
                        realName: "Jordan Lee",
                        dateOfBirth: "1995-04-12",
                        height: Height(value: "6'2", unit: .feet),
                        positions: ["PG", "SG"],
                        homeCourtId: "c_1"
                    )
                )
        )
    }

    @Test("treats missing positions as none")
    func noPositions() async {
        StubURLProtocol.respond { _ in
            .init(
                status: 200,
                body: """
                    {"id":"p_1","real_name":"J","handle":"j","date_of_birth":"1995-04-12",
                     "height":{"value":"188","unit":"CM"},"positions":null,"home_court_id":"c_1"}
                    """
            )
        }
        guard case .player(let player) = await client().getMe() else {
            Issue.record("expected a player")
            return
        }
        #expect(player.positions == [])
        #expect(player.height.unit == .centimeters)
    }

    @Test("maps 404 player_not_found to notFound")
    func notFound() async {
        StubURLProtocol.respond { _ in
            .init(status: 404, body: #"{"error":{"code":"player_not_found","message":"no record yet"}}"#)
        }
        #expect(await client().getMe() == .notFound)
    }

    @Test("maps 401 to unauthorized")
    func unauthorized() async {
        StubURLProtocol.respond { _ in .init(status: 401, body: #"{"error":{"code":"unauthorized"}}"#) }
        #expect(await client().getMe() == .unauthorized)
    }

    @Test("is unauthorized without calling the API when there is no session token")
    func noToken() async {
        StubURLProtocol.respond { _ in .init(status: 200, body: "{}") }
        #expect(await client(token: nil).getMe() == .unauthorized)
        #expect(StubURLProtocol.requests.isEmpty)
    }

    @Test("fails on a server error", arguments: [500, 502])
    func serverError(_ status: Int) async {
        StubURLProtocol.respond { _ in .init(status: status, body: #"{"error":{"code":"internal"}}"#) }
        #expect(await client().getMe() == .failed)
    }

    @Test("fails on a height unit it does not know")
    func unknownUnit() async {
        StubURLProtocol.respond { _ in
            .init(
                status: 200,
                body: """
                    {"id":"p_1","real_name":"J","handle":"j","date_of_birth":"1995-04-12",
                     "height":{"value":"2","unit":"M"},"positions":[],"home_court_id":"c_1"}
                    """
            )
        }
        #expect(await client().getMe() == .failed)
    }

    @Test("fails on an unreadable body")
    func garbage() async {
        StubURLProtocol.respond { _ in .init(status: 200, body: "not json") }
        #expect(await client().getMe() == .failed)
    }
}
