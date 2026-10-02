import Foundation
import Synchronization

/// Fakes the network at the HTTP boundary, the Swift analog of MSW: the real
/// APIClient runs against canned responses. Suites using it are serialized.
final class StubURLProtocol: URLProtocol {
    struct Response: Sendable {
        let status: Int
        let body: String
    }

    private static let handler = Mutex<(@Sendable (URLRequest) -> Response)?>(nil)
    private static let recorded = Mutex<[URLRequest]>([])

    static func respond(_ handler: @escaping @Sendable (URLRequest) -> Response) {
        self.handler.withLock { $0 = handler }
        recorded.withLock { $0 = [] }
    }

    static var requests: [URLRequest] { recorded.withLock { $0 } }

    static func session() -> URLSession {
        let configuration = URLSessionConfiguration.ephemeral
        configuration.protocolClasses = [StubURLProtocol.self]
        return URLSession(configuration: configuration)
    }

    override class func canInit(with request: URLRequest) -> Bool { true }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }

    override func startLoading() {
        Self.recorded.withLock { $0.append(request) }
        guard let handler = Self.handler.withLock({ $0 }), let url = request.url else {
            client?.urlProtocol(self, didFailWithError: URLError(.cannotConnectToHost))
            return
        }
        let stub = handler(request)
        let response = HTTPURLResponse(url: url, statusCode: stub.status, httpVersion: nil, headerFields: nil)!
        client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
        client?.urlProtocol(self, didLoad: Data(stub.body.utf8))
        client?.urlProtocolDidFinishLoading(self)
    }

    override func stopLoading() {}
}
