import Testing

@testable import Domain

@Suite("Player")
struct PlayerTests {
    @Test("displays the handle with an @")
    func displayHandle() {
        let player = Player.fixture(handle: "jordan23")
        #expect(player.displayHandle == "@JORDAN23")
    }
}

extension Player {
    static func fixture(handle: String = "jordan23") -> Player {
        Player(
            id: "p_1",
            handle: handle,
            realName: "Jordan Lee",
            dateOfBirth: "1995-04-12",
            height: Height(value: "6'2", unit: .feet),
            positions: ["PG"],
            homeCourtId: "c_1"
        )
    }
}
