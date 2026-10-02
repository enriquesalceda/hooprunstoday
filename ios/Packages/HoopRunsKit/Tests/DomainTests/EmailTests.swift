import Testing

@testable import Domain

@Suite("Email")
struct EmailTests {
    @Test("accepts a plain address", arguments: ["jordan@court.com", "j.r+runs@mail.co.uk", "  jordan@court.com  "])
    func valid(_ email: String) {
        #expect(Email.isValid(email))
    }

    @Test(
        "rejects addresses missing a part or a real TLD",
        arguments: ["", "jordan", "jordan@", "@court.com", "jordan@court", "jordan@court.c", "jor dan@court.com"]
    )
    func invalid(_ email: String) {
        #expect(!Email.isValid(email))
    }

    @Test("strips whitespace as the player types")
    func clean() {
        #expect(Email.clean(" jor dan@court.com\n") == "jordan@court.com")
    }

    @Test("masks to the first character and the full domain")
    func mask() {
        #expect(Email.mask("jordan@gmail.com") == "j•••••@gmail.com")
        #expect(Email.mask(" j@x.io ") == "j•••••@x.io")
    }

    @Test("masks fully when there is no local part to show", arguments: ["jordan", "@gmail.com", ""])
    func maskFallback(_ email: String) {
        #expect(Email.mask(email) == "•••@•••")
    }
}
