import SwiftUI

/// The only button in the system: full width, 60pt, square. Enabled is
/// inverted white; disabled is an outline at 55%.
public struct PrimaryButton: View {
    @Environment(\.isEnabled) private var isEnabled
    private let title: String
    private let action: () -> Void

    public init(_ title: String, action: @escaping () -> Void) {
        self.title = title
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            Text(title)
                .font(.mono(TypeScale.mono7, weight: .bold))
                .tracking(Tracking.action.points(at: TypeScale.mono7))
                .foregroundStyle(Color(hex: isEnabled ? Palette.textOnInverted : Palette.textFaint))
                .frame(maxWidth: .infinity, minHeight: Spacing.button)
                .background(isEnabled ? Color(hex: Palette.surfaceInverted) : .clear)
                .overlay(Rectangle().strokeBorder(Color(hex: Palette.textPrimary), lineWidth: Spacing.hairline))
                .opacity(isEnabled ? 1 : 0.55)
        }
        .buttonStyle(.plain)
    }
}
