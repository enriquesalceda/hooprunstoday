/// A player record, mirroring the API's player shape
/// (backend/internal/adapter/http/create_player.go).
public struct Player: Equatable, Sendable {
    public let id: String
    public let handle: String
    public let realName: String
    /// `YYYY-MM-DD`.
    public let dateOfBirth: String
    public let height: Height
    public let positions: [String]
    public let homeCourtId: String

    public init(
        id: String,
        handle: String,
        realName: String,
        dateOfBirth: String,
        height: Height,
        positions: [String],
        homeCourtId: String
    ) {
        self.id = id
        self.handle = handle
        self.realName = realName
        self.dateOfBirth = dateOfBirth
        self.height = height
        self.positions = positions
        self.homeCourtId = homeCourtId
    }

    public var displayHandle: String { "@\(handle.uppercased())" }
}

public struct Height: Equatable, Sendable {
    public enum Unit: String, Equatable, Sendable {
        case feet = "FT"
        case centimeters = "CM"
    }

    /// Free-form as entered: `6'2` for feet, `188` for centimeters.
    public let value: String
    public let unit: Unit

    public init(value: String, unit: Unit) {
        self.value = value
        self.unit = unit
    }
}
