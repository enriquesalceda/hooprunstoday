import Foundation

/// The header's telemetry clock: `HH:MM:SS LOCAL`, 24-hour, zero-padded.
public enum LocalClock {
    public static func format(_ date: Date, calendar: Calendar = .current) -> String {
        let parts = calendar.dateComponents([.hour, .minute, .second], from: date)
        let pad = { (n: Int?) in String(format: "%02d", n ?? 0) }
        return "\(pad(parts.hour)):\(pad(parts.minute)):\(pad(parts.second)) LOCAL"
    }
}
