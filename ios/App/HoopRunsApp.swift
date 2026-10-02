import DesignSystem
import Features
import SwiftUI

/// Composition root: the only place that wires concrete dependencies.
@main
struct HoopRunsApp: App {
    init() {
        Fonts.register()
    }

    var body: some Scene {
        WindowGroup {
            HomeScreen()
        }
    }
}
