import Domain
import Foundation

/// The one HTTP client for the Go API. The only place that knows endpoints.
/// A fresh session token is fetched per request: Clerk tokens live ~60s.
public struct APIClient: Sendable {
    public typealias TokenProvider = @Sendable () async throws -> String?

    private let baseURL: URL
    private let session: URLSession
    private let token: TokenProvider

    public init(baseURL: URL, session: URLSession = .shared, token: @escaping TokenProvider) {
        self.baseURL = baseURL
        self.session = session
        self.token = token
    }

    public enum MeResult: Equatable, Sendable {
        case player(Player)
        case notFound
        case unauthorized
        case failed
    }

    /// `GET /api/v1/players/me`: the signed-in player's record, if one exists.
    public func getMe() async -> MeResult {
        guard let bearer = try? await token() else { return .unauthorized }
        var request = URLRequest(url: baseURL.appending(path: "api/v1/players/me"))
        request.setValue("Bearer \(bearer)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        guard let (data, response) = try? await session.data(for: request),
            let http = response as? HTTPURLResponse
        else { return .failed }

        switch http.statusCode {
        case 200:
            guard let player = (try? decoder.decode(PlayerDTO.self, from: data))?.domain else { return .failed }
            return .player(player)
        case 401:
            return .unauthorized
        case 404 where errorCode(in: data) == "player_not_found":
            return .notFound
        default:
            return .failed
        }
    }

    private var decoder: JSONDecoder {
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        return decoder
    }

    /// Reads `code` from the API's error envelope: `{"error":{"code","message","fields?"}}`.
    private func errorCode(in data: Data) -> String? {
        struct Envelope: Decodable {
            struct Body: Decodable { let code: String }
            let error: Body
        }
        return (try? decoder.decode(Envelope.self, from: data))?.error.code
    }
}

private struct PlayerDTO: Decodable {
    struct HeightDTO: Decodable {
        let value: String
        let unit: String
    }

    let id: String
    let realName: String
    let handle: String
    let dateOfBirth: String
    let height: HeightDTO
    let positions: [String]?
    let homeCourtId: String

    var domain: Player? {
        guard let unit = Height.Unit(rawValue: height.unit) else { return nil }
        return Player(
            id: id,
            handle: handle,
            realName: realName,
            dateOfBirth: dateOfBirth,
            height: Height(value: height.value, unit: unit),
            positions: positions ?? [],
            homeCourtId: homeCourtId
        )
    }
}
