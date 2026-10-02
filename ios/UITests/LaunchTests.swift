import XCTest

final class LaunchTests: XCTestCase {
    @MainActor
    func testSignedOutLaunchAsksForAnEmail() {
        let app = XCUIApplication()
        app.launchArguments = ["-uitest-signed-out"]
        app.launch()

        XCTAssertTrue(app.staticTexts["HOOPRUNS.TODAY"].waitForExistence(timeout: 5))
        XCTAssertTrue(app.staticTexts["IDENTITY CHECK"].waitForExistence(timeout: 15))
        XCTAssertFalse(app.buttons["TRANSMIT CODE"].isEnabled)

        let email = app.textFields["Email"]
        email.tap()
        email.typeText("jordan@court.com")
        XCTAssertTrue(app.buttons["TRANSMIT CODE"].isEnabled)
        XCTAssertEqual(app.staticTexts["identity-hint"].label, "READY · ONE-TIME CODE, NO PASSWORD TO FORGET")
    }
}
