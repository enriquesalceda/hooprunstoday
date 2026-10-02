import SwiftUI

/// One-line lockup for app chrome: Anton "HOOPRUNS" plus the inverted
/// ".TODAY" bar. Print/export contexts use design/assets/ instead.
public struct Logo: View {
    private let size: CGFloat

    public init(size: CGFloat = TypeScale.logo) {
        self.size = size
    }

    public var body: some View {
        HStack(spacing: (size * 0.27).rounded()) {
            Text("HOOPRUNS")
                .font(.display(size))
                .foregroundStyle(Color(hex: Palette.textPrimary))
            Text(".TODAY")
                .font(.custom("Helvetica-Bold", fixedSize: size * 0.38))
                .tracking(Tracking.bar.points(at: size * 0.38))
                .foregroundStyle(Color(hex: Palette.textOnInverted))
                .padding(EdgeInsets(top: size * 0.15, leading: size * 0.267, bottom: size * 0.15, trailing: size * 0.1))
                .background(Color(hex: Palette.surfaceInverted))
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("HOOPRUNS.TODAY")
        .accessibilityAddTraits(.isHeader)
    }
}
