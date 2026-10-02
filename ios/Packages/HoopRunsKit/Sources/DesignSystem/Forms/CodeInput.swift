import SwiftUI

/// Six square cells over one hidden text field, so paste and the keyboard's
/// one-time-code suggestion fill the whole code at once.
public struct CodeInput: View {
    public enum State: Equatable { case normal, rejected, locked }

    @Binding private var text: String
    private let length: Int
    private let state: State
    @FocusState private var focused: Bool

    public init(text: Binding<String>, length: Int = 6, state: State) {
        _text = text
        self.length = length
        self.state = state
    }

    public var body: some View {
        ZStack {
            TextField("", text: $text)
                .codeEntry()
                .focused($focused)
                .foregroundStyle(.clear)
                .tint(.clear)
                .accessibilityLabel("Six digit code")
                .accessibilityValue(text)
            HStack(spacing: Spacing.s3) {
                ForEach(0..<length, id: \.self) { index in
                    cell(digit: digit(at: index))
                }
            }
            .allowsHitTesting(false)
            .accessibilityHidden(true)
        }
        .contentShape(Rectangle())
        .onTapGesture { focused = true }
        .disabled(state == .locked)
        .opacity(state == .locked ? 0.55 : 1)
        .onAppear { focused = true }
    }

    private func digit(at index: Int) -> String? {
        guard index < text.count else { return nil }
        return String(text[text.index(text.startIndex, offsetBy: index)])
    }

    @ViewBuilder private func cell(digit: String?) -> some View {
        let dashed = state != .normal
        Text(digit ?? " ")
            .font(.display(TypeScale.display2))
            .foregroundStyle(Color(hex: Palette.textPrimary))
            .frame(maxWidth: .infinity, minHeight: 62, maxHeight: 62)
            .background(digit != nil && !dashed ? Color(hex: Palette.surfaceTrack) : .clear)
            .overlay {
                if dashed {
                    Rectangle().strokeBorder(
                        Color(hex: Palette.textFaint),
                        style: StrokeStyle(lineWidth: Spacing.hairline, dash: [3, 3])
                    )
                } else {
                    Rectangle().strokeBorder(
                        Color(hex: digit != nil ? Palette.textPrimary : Palette.lineInteractive),
                        lineWidth: Spacing.hairline
                    )
                }
            }
    }
}

extension View {
    @ViewBuilder fileprivate func codeEntry() -> some View {
        #if os(iOS)
            self
                .keyboardType(.numberPad)
                .textContentType(.oneTimeCode)
        #else
            self
        #endif
    }
}
