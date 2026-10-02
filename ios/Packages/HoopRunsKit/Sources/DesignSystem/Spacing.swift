import CoreGraphics

/// From design/system/tokens/spacing.css and borders.css. Square, always:
/// there is no corner radius except the status dot, and no shadows.
public enum Spacing {
    public static let gutter: CGFloat = 16
    public static let hitMin: CGFloat = 44
    public static let dot: CGFloat = 6
    public static let hairline: CGFloat = 1
    public static let button: CGFloat = 60

    // 2px-resolution scale, lifted from the prototypes
    public static let s1: CGFloat = 4
    public static let s2: CGFloat = 6
    public static let s3: CGFloat = 8
    public static let s4: CGFloat = 10
    public static let s5: CGFloat = 12
    public static let s9: CGFloat = 20
    public static let s10: CGFloat = 22
}
