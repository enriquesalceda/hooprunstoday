import SwiftUI

/// Framed email input with an `EMAIL` label cell. Typed text keeps its case.
public struct EmailField: View {
    @Binding private var text: String
    private let onSubmit: () -> Void

    public init(text: Binding<String>, onSubmit: @escaping () -> Void = {}) {
        _text = text
        self.onSubmit = onSubmit
    }

    public var body: some View {
        HStack(spacing: 0) {
            Text("EMAIL")
                .font(.mono(TypeScale.mono1, weight: .bold))
                .foregroundStyle(Color(hex: Palette.textSecondary))
                .padding(.horizontal, Spacing.s5)
                .frame(maxHeight: .infinity)
                .overlay(alignment: .trailing) {
                    Rectangle().fill(Color(hex: Palette.lineHairline)).frame(width: Spacing.hairline)
                }
            TextField(
                "",
                text: $text,
                prompt: Text(verbatim: "you@court.com").foregroundStyle(Color(hex: Palette.textFaint))
            )
            .font(.mono(TypeScale.mono8, weight: .bold))
            .foregroundStyle(Color(hex: Palette.textPrimary))
            .tint(Color(hex: Palette.textPrimary))
            .emailEntry()
            .submitLabel(.send)
            .onSubmit(onSubmit)
            .padding(.horizontal, Spacing.s5)
            .padding(.vertical, Spacing.gutter)
            .accessibilityLabel("Email")
        }
        .fixedSize(horizontal: false, vertical: true)
        .overlay(Rectangle().strokeBorder(Color(hex: Palette.lineInteractive), lineWidth: Spacing.hairline))
    }
}

extension View {
    @ViewBuilder fileprivate func emailEntry() -> some View {
        #if os(iOS)
            self
                .keyboardType(.emailAddress)
                .textContentType(.emailAddress)
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
        #else
            self.autocorrectionDisabled()
        #endif
    }
}
