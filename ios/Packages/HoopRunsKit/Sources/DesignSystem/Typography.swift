import SwiftUI

/// Point sizes from design/system/tokens/typography.css (mobile scale).
public enum TypeScale {
    // display — Anton, always 400, always caps
    public static let logo: CGFloat = 17
    public static let display2: CGFloat = 34
    public static let display3: CGFloat = 40

    // mono — labels, data, actions
    public static let mono1: CGFloat = 8.5
    public static let mono2: CGFloat = 9
    public static let mono3: CGFloat = 9.5
    public static let mono4: CGFloat = 10
    public static let mono6: CGFloat = 11
    public static let mono7: CGFloat = 12
    public static let mono8: CGFloat = 13
}

/// Letter-spacing in em, as the tokens define it. Grows with importance.
public enum Tracking: Double {
    case label = 0.06
    case nav = 0.1
    case slider = 0.12
    case action = 0.14
    case bar = 0.3
    case barLarge = 0.4

    public func points(at size: CGFloat) -> CGFloat {
        (rawValue * size * 1000).rounded() / 1000
    }
}

extension Font {
    /// Anton. Call `Fonts.register()` at launch before using it.
    public static func display(_ size: CGFloat) -> Font {
        .custom(Fonts.display, fixedSize: size)
    }

    /// The system monospace. Weight 500 for anything read, 700 for anything tapped.
    public static func mono(_ size: CGFloat, weight: Font.Weight = .medium) -> Font {
        .system(size: size, weight: weight, design: .monospaced)
    }
}
