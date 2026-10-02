// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "HoopRunsKit",
    platforms: [.iOS(.v26), .macOS(.v26)],
    products: [
        .library(name: "DesignSystem", targets: ["DesignSystem"]),
        .library(name: "Features", targets: ["Features"]),
    ],
    targets: [
        .target(
            name: "DesignSystem",
            resources: [.process("Fonts")]
        ),
        .testTarget(name: "DesignSystemTests", dependencies: ["DesignSystem"]),
        .target(name: "Features", dependencies: ["DesignSystem"]),
    ]
)
