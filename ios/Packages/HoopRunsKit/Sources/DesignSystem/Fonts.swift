import CoreText
import Foundation

/// Two families, zero exceptions (design/system/tokens/typography.css):
/// Anton for numbers, names and headlines; monospace for every label,
/// button and datum.
public enum Fonts {
    /// PostScript name of the bundled Anton (display, one weight).
    public static let display = "Anton-Regular"

    /// Registers the package's bundled fonts with the process. Call once at
    /// launch; repeat calls are no-ops.
    public static func register() {
        _ = registration
    }

    private static let registration: Void = {
        guard let url = Bundle.module.url(forResource: "Anton-Regular", withExtension: "ttf") else {
            assertionFailure("Anton-Regular.ttf missing from DesignSystem resources")
            return
        }
        CTFontManagerRegisterFontsForURL(url as CFURL, .process, nil)
    }()
}
