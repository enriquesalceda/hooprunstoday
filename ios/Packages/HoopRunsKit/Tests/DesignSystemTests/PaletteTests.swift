import Testing

@testable import DesignSystem

@Suite("Palette")
struct PaletteTests {
    @Test("blacktop surfaces match design/system/tokens/colors.css")
    func surfaces() {
        #expect(Palette.surfaceApp == 0x0D0D0C)
        #expect(Palette.surfaceTrack == 0x141413)
        #expect(Palette.surfaceRaised == 0x1A1A19)
        #expect(Palette.surfaceInverted == 0xFFFFFF)
    }

    @Test("text greys match the design tokens")
    func text() {
        #expect(Palette.textPrimary == 0xFFFFFF)
        #expect(Palette.textBody == 0xD9D7D2)
        #expect(Palette.textSecondary == 0xB5B3AF)
        #expect(Palette.textMuted == 0x8A8A85)
        #expect(Palette.textFaint == 0x6F6F6A)
        #expect(Palette.textOnInverted == 0x0D0D0C)
    }

    @Test("lines match the design tokens")
    func lines() {
        #expect(Palette.lineHairline == 0x2A2A28)
        #expect(Palette.lineFaint == 0x1F1F1E)
        #expect(Palette.lineInteractive == 0x444444)
        #expect(Palette.lineChip == 0x555555)
    }

    @Test("splits a hex value into sRGB components")
    func components() {
        let rgb = Palette.components(0xD9D7D2)
        #expect(rgb.red == 0xD9 / 255.0)
        #expect(rgb.green == 0xD7 / 255.0)
        #expect(rgb.blue == 0xD2 / 255.0)
    }
}
