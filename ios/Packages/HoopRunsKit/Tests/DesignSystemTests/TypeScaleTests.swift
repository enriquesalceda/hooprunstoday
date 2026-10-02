import Testing

@testable import DesignSystem

@Suite("TypeScale")
struct TypeScaleTests {
    @Test("mono sizes match design/system/tokens/typography.css")
    func mono() {
        #expect(TypeScale.mono1 == 8.5)
        #expect(TypeScale.mono2 == 9)
        #expect(TypeScale.mono4 == 10)
        #expect(TypeScale.mono7 == 12)
        #expect(TypeScale.mono8 == 13)
    }

    @Test("display sizes match the mobile scale")
    func display() {
        #expect(TypeScale.logo == 17)
        #expect(TypeScale.display2 == 34)
        #expect(TypeScale.display3 == 40)
    }

    @Test("tracking is expressed in em and converts to points at a given size")
    func tracking() {
        #expect(Tracking.bar.points(at: 10) == 3)
        #expect(Tracking.nav.points(at: 10) == 1)
    }
}

@Suite("Spacing")
struct SpacingTests {
    @Test("layout constants match design/system/tokens/spacing.css")
    func layout() {
        #expect(Spacing.gutter == 16)
        #expect(Spacing.hitMin == 44)
        #expect(Spacing.dot == 6)
        #expect(Spacing.hairline == 1)
        #expect(Spacing.button == 60)
        #expect(Spacing.s9 == 20)
        #expect(Spacing.s10 == 22)
    }
}
