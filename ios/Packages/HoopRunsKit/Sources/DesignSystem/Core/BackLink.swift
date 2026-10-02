import SwiftUI

/// `← LABEL` in 10pt bold mono, secondary ink.
public struct BackLink: View {
    private let label: String
    private let action: () -> Void

    public init(_ label: String, action: @escaping () -> Void) {
        self.label = label
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            Text("← \(label)")
                .font(.mono(TypeScale.mono4, weight: .bold))
                .foregroundStyle(Color(hex: Palette.textSecondary))
                .frame(minHeight: Spacing.hitMin)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Back to \(label.lowercased())")
    }
}
