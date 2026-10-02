import Foundation
import Testing

@testable import DesignSystem

@Suite("LocalClock")
struct LocalClockTests {
    private let calendar: Calendar = {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(identifier: "Australia/Sydney")!
        return calendar
    }()

    @Test("formats wall-clock time as zero-padded HH:MM:SS LOCAL")
    func padded() {
        let date = calendar.date(from: DateComponents(year: 2026, month: 10, day: 2, hour: 7, minute: 5, second: 9))!
        #expect(LocalClock.format(date, calendar: calendar) == "07:05:09 LOCAL")
    }

    @Test("uses a 24-hour clock")
    func twentyFourHour() {
        let date = calendar.date(from: DateComponents(year: 2026, month: 10, day: 2, hour: 21, minute: 30, second: 0))!
        #expect(LocalClock.format(date, calendar: calendar) == "21:30:00 LOCAL")
    }
}
