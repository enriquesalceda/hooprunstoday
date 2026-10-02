import SwiftUI

/// Semantic colors from design/system/tokens/colors.css, as 0xRRGGBB.
/// Black, white, and the greys between — no hue anywhere.
public enum Palette {
    // surfaces
    public static let surfaceApp: UInt32 = 0x0D0D0C
    public static let surfaceTrack: UInt32 = 0x141413
    public static let surfaceRaised: UInt32 = 0x1A1A19
    public static let surfaceInverted: UInt32 = 0xFFFFFF

    // text
    public static let textPrimary: UInt32 = 0xFFFFFF
    public static let textBody: UInt32 = 0xD9D7D2
    public static let textSecondary: UInt32 = 0xB5B3AF
    public static let textMuted: UInt32 = 0x8A8A85
    public static let textFaint: UInt32 = 0x6F6F6A
    public static let textOnInverted: UInt32 = 0x0D0D0C

    // lines
    public static let lineHairline: UInt32 = 0x2A2A28
    public static let lineFaint: UInt32 = 0x1F1F1E
    public static let lineInteractive: UInt32 = 0x444444
    public static let lineChip: UInt32 = 0x555555

    static func components(_ hex: UInt32) -> (red: Double, green: Double, blue: Double) {
        (
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255
        )
    }
}

extension Color {
    public init(hex: UInt32) {
        let rgb = Palette.components(hex)
        self.init(.sRGB, red: rgb.red, green: rgb.green, blue: rgb.blue)
    }
}
