import DesignSystem
import Domain
import SwiftUI

/// Stand-ins until the profile (O6) and player record (O3) land.

struct SignedInScreen: View {
    let player: Player
    let onSignOut: () -> Void

    var body: some View {
        StatusScreen(
            title: [player.displayHandle],
            caption: "SIGNED IN · RECORD ON FILE · PROFILE ARRIVES NEXT",
            action: ("SIGN OUT", onSignOut)
        )
    }
}

struct RecordPendingScreen: View {
    let onSignOut: () -> Void

    var body: some View {
        StatusScreen(
            title: ["PLAYER", "RECORD"],
            caption: "SIGNED IN · NO RECORD YET · RECORD CREATION ARRIVES NEXT",
            action: ("SIGN OUT", onSignOut)
        )
    }
}

struct LoadFailedScreen: View {
    let onRetry: () -> Void
    let onSignOut: () -> Void

    var body: some View {
        StatusScreen(
            title: ["NO", "SIGNAL"],
            caption: "RECORD NOT LOADED · CHECK CONNECTION",
            action: ("RETRY", onRetry),
            secondary: ("SIGN OUT", onSignOut)
        )
    }
}

struct LoadingScreen: View {
    let caption: String

    var body: some View {
        VStack(alignment: .leading) {
            SectionLabel(caption)
                .padding(.top, Spacing.s9)
                .padding(.horizontal, Spacing.gutter)
            Spacer()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

private struct StatusScreen: View {
    let title: [String]
    let caption: String
    let action: (String, () -> Void)
    var secondary: (String, () -> Void)?

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Group {
                switch title.count {
                case 1: DisplayTitle(title[0])
                default: DisplayTitle(title[0], title[1])
                }
            }
            .padding(.top, Spacing.s9)
            SectionLabel(caption)
                .padding(.top, Spacing.s3)
            Spacer()
            if let secondary {
                Button(action: secondary.1) {
                    Text(secondary.0)
                        .font(.mono(TypeScale.mono4, weight: .bold))
                        .foregroundStyle(Color(hex: Palette.textSecondary))
                        .frame(maxWidth: .infinity, minHeight: Spacing.hitMin)
                }
                .buttonStyle(.plain)
            }
            PrimaryButton(action.0, action: action.1)
                .padding(.bottom, Spacing.gutter)
        }
        .padding(.horizontal, Spacing.gutter)
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
