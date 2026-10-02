import SwiftUI

/// Mobile app chrome (design/README.md, "App Chrome"): logo and live status
/// on the first line, geofence and the local clock on the second, a hairline
/// underneath.
public struct AppHeader: View {
    private let status: String
    private let geofence: String

    public init(status: String = "SYS_STANDBY", geofence: String = "PENDING") {
        self.status = status
        self.geofence = geofence
    }

    public var body: some View {
        VStack(spacing: Spacing.s3) {
            HStack {
                Logo()
                Spacer()
                HStack(spacing: Spacing.s2) {
                    StatusDot()
                    Text(status)
                        .font(.mono(TypeScale.mono2))
                        .foregroundStyle(Color(hex: Palette.textSecondary))
                }
            }
            HStack {
                Text("GEOFENCE: \(geofence)")
                Spacer()
                TimelineView(.periodic(from: .now, by: 1)) { context in
                    Text(LocalClock.format(context.date))
                        .monospacedDigit()
                }
            }
            .font(.mono(TypeScale.mono2))
            .foregroundStyle(Color(hex: Palette.textFaint))
        }
        .padding(.horizontal, Spacing.gutter)
        .padding(.vertical, Spacing.s4)
        .overlay(alignment: .bottom) {
            Rectangle()
                .fill(Color(hex: Palette.lineHairline))
                .frame(height: Spacing.hairline)
        }
    }
}
