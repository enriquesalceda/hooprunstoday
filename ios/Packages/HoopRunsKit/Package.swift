// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "HoopRunsKit",
    platforms: [.iOS(.v26), .macOS(.v26)],
    products: [
        .library(name: "Domain", targets: ["Domain"]),
        .library(name: "API", targets: ["API"]),
        .library(name: "DesignSystem", targets: ["DesignSystem"]),
        .library(name: "Features", targets: ["Features"]),
    ],
    targets: [
        .target(name: "Domain"),
        .testTarget(name: "DomainTests", dependencies: ["Domain"]),
        .target(name: "API", dependencies: ["Domain"]),
        .testTarget(name: "APITests", dependencies: ["API", "Domain"]),
        .target(
            name: "DesignSystem",
            resources: [.process("Fonts")]
        ),
        .testTarget(name: "DesignSystemTests", dependencies: ["DesignSystem"]),
        .target(name: "Features", dependencies: ["Domain", "API", "DesignSystem"]),
        .testTarget(name: "FeaturesTests", dependencies: ["Features", "API", "Domain"]),
    ]
)
