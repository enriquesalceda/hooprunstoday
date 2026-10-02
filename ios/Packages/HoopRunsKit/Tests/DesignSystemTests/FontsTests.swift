import CoreText
import Testing

@testable import DesignSystem

@Suite("Fonts")
struct FontsTests {
    @Test("registers the bundled Anton so it resolves by PostScript name")
    func antonResolves() {
        Fonts.register()
        let font = CTFontCreateWithName(Fonts.display as CFString, 20, nil)
        #expect(CTFontCopyPostScriptName(font) as String == Fonts.display)
    }

    @Test("registering twice is harmless")
    func idempotent() {
        Fonts.register()
        Fonts.register()
    }
}
