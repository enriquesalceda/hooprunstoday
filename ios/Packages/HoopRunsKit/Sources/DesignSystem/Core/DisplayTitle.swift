import SwiftUI

/// Anton headline, one line per entry, stacked at line-height 0.92.
public struct DisplayTitle: View {
    private let lines: [String]
    private let size: CGFloat

    public init(_ lines: String..., size: CGFloat = TypeScale.display3) {
        self.lines = lines
        self.size = size
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ForEach(lines, id: \.self) { line in
                Text(line)
                    .font(.display(size))
                    .foregroundStyle(Color(hex: Palette.textPrimary))
                    .frame(height: size * 0.92)
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(lines.joined(separator: " "))
        .accessibilityAddTraits(.isHeader)
    }
}
