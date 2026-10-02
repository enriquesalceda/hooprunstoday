import XCTest

final class LaunchTests: XCTestCase {
    @MainActor
    func testLaunchShowsTheAppChrome() {
        let app = XCUIApplication()
        app.launch()

        XCTAssertTrue(app.staticTexts["HOOPRUNS.TODAY"].waitForExistence(timeout: 5))
        XCTAssertTrue(app.staticTexts["SYS_STANDBY"].exists)
        XCTAssertTrue(app.staticTexts["GEOFENCE: PENDING"].exists)
    }
}
