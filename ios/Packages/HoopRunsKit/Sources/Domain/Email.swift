import Foundation

/// Email rules for the identity step. Mirrors web/src/domain/email.ts and
/// maskEmail in web/src/components/forms/email-field.tsx.
public enum Email {
    /// Gates TRANSMIT CODE; typing is never blocked.
    public static func isValid(_ email: String) -> Bool {
        email.trimmingCharacters(in: .whitespacesAndNewlines)
            .wholeMatch(of: /[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}/) != nil
    }

    /// Whitespace is stripped on every change.
    public static func clean(_ raw: String) -> String {
        raw.filter { !$0.isWhitespace }
    }

    /// `j•••••@gmail.com`: first character, five bullets, the full domain.
    public static func mask(_ email: String) -> String {
        let trimmed = email.trimmingCharacters(in: .whitespacesAndNewlines)
        guard let first = trimmed.first, let at = trimmed.firstIndex(of: "@"), at != trimmed.startIndex else {
            return "•••@•••"
        }
        return "\(first)•••••\(trimmed[at...])"
    }
}
