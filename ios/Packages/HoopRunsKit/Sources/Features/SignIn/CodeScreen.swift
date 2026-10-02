import DesignSystem
import Domain
import SwiftUI

/// O2 — ENTER CODE. Six digits verify on their own; no submit button.
struct CodeScreen: View {
    let model: SignInModel

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            BackLink("EMAIL") { model.back() }
                .padding(.horizontal, Spacing.gutter)
            DisplayTitle("ENTER CODE")
                .padding(.top, Spacing.s1)
                .padding(.horizontal, Spacing.gutter)
            SectionLabel("SENT TO \(model.maskedEmail) · EXPIRES IN 10:00")
                .padding(.top, Spacing.s3)
                .padding(.horizontal, Spacing.gutter)
            CodeInput(
                text: Binding(get: { model.code.digits }, set: { model.typeCode($0) }),
                length: CodeEntry.length,
                state: cellState
            )
            .padding(.top, Spacing.s10)
            .padding(.horizontal, Spacing.gutter)
            Text(model.code.hint.text)
                .font(.mono(TypeScale.mono2, weight: .bold))
                .tracking(Tracking.label.points(at: TypeScale.mono2))
                .foregroundStyle(Color(hex: hintColor))
                .padding(.top, Spacing.s5)
                .padding(.horizontal, Spacing.gutter)
                .accessibilityIdentifier("code-hint")
                .accessibilityAddTraits(model.code.hint.isAlert ? .updatesFrequently : [])
            Spacer(minLength: Spacing.s9)
            Button {
                Task { await model.resend() }
            } label: {
                Text(model.code.resendLabel)
                    .font(.mono(TypeScale.mono4, weight: .bold))
                    .foregroundStyle(Color(hex: model.code.canResend ? Palette.textPrimary : Palette.textFaint))
                    .frame(minHeight: Spacing.hitMin)
            }
            .buttonStyle(.plain)
            .disabled(!model.code.canResend)
            .padding(.horizontal, Spacing.gutter)
            .padding(.bottom, Spacing.s9)
        }
        .task {
            // The resend cooldown only runs while this screen is showing.
            while !Task.isCancelled {
                try? await Task.sleep(for: .seconds(1))
                model.tick()
            }
        }
    }

    private var cellState: CodeInput.State {
        switch model.code.cells {
        case .normal: .normal
        case .rejected: .rejected
        case .locked: .locked
        }
    }

    private var hintColor: UInt32 {
        switch model.code.hint.tone {
        case .faint: Palette.textFaint
        case .muted: Palette.textMuted
        case .primary: Palette.textPrimary
        }
    }
}
