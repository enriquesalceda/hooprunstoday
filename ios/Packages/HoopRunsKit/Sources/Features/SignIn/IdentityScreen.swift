import DesignSystem
import SwiftUI

/// O1 — IDENTITY CHECK. One screen for new and returning players.
struct IdentityScreen: View {
    @Bindable var model: SignInModel

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    DisplayTitle("IDENTITY", "CHECK")
                        .padding(.top, Spacing.s9)
                    SectionLabel("EMAIL VERIFICATION · ONE ADDRESS, ONE PLAYER")
                        .padding(.top, Spacing.s3)
                    EmailField(text: $model.email) { Task { await model.transmit() } }
                        .padding(.top, Spacing.s10)
                    Text(model.identityHint)
                        .font(.mono(TypeScale.mono1))
                        .foregroundStyle(Color(hex: Palette.textFaint))
                        .lineSpacing(TypeScale.mono1 * 0.5)
                        .padding(.top, Spacing.s3)
                        .accessibilityIdentifier("identity-hint")
                }
                .padding(.horizontal, Spacing.gutter)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .scrollBounceBehavior(.basedOnSize)

            Text("EXISTING PLAYER? SAME EMAIL, SAME RECORD.")
                .font(.mono(TypeScale.mono1))
                .foregroundStyle(Color(hex: Palette.textFaint))
                .padding(.horizontal, Spacing.gutter)
                .padding(.bottom, Spacing.s4)
            PrimaryButton(model.isSending ? "TRANSMITTING…" : "TRANSMIT CODE") {
                Task { await model.transmit() }
            }
            .disabled(!model.canTransmit)
            .padding([.horizontal, .bottom], Spacing.gutter)
        }
    }
}
