import SwiftUI

/// The only round thing in the system. Pulses 1 → 0.15 → 1 every 1.6s.
public struct StatusDot: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var dimmed = false

    public init() {}

    public var body: some View {
        Circle()
            .fill(Color(hex: Palette.textPrimary))
            .frame(width: Spacing.dot, height: Spacing.dot)
            .opacity(dimmed ? 0.15 : 1)
            .onAppear {
                guard !reduceMotion else { return }
                withAnimation(.easeInOut(duration: 0.8).repeatForever(autoreverses: true)) {
                    dimmed = true
                }
            }
            .accessibilityHidden(true)
    }
}
