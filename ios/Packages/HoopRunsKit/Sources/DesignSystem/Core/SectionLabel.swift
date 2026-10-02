import SwiftUI

/// 9pt mono caption in faint ink. Always uppercase.
public struct SectionLabel: View {
    private let text: String

    public init(_ text: String) {
        self.text = text
    }

    public var body: some View {
        Text(text)
            .font(.mono(TypeScale.mono2))
            .foregroundStyle(Color(hex: Palette.textFaint))
    }
}
