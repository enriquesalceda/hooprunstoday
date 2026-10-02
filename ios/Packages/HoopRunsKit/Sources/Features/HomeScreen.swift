import DesignSystem
import SwiftUI

/// Placeholder until sign-in lands: the app chrome on the blacktop.
public struct HomeScreen: View {
    public init() {}

    public var body: some View {
        VStack(spacing: 0) {
            AppHeader()
            Spacer()
        }
        .background(Color(hex: Palette.surfaceApp))
    }
}

#Preview {
    HomeScreen()
        .onAppear { Fonts.register() }
}
