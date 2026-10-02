const expoPreset = require("jest-expo/jest-preset");

// Packages that ship untranspiled ESM and must go through Babel. The base
// list mirrors jest-expo's default; msw and its deps are our additions.
const transpilePackages = [
  "(jest-)?react-native",
  "@react-native(-community)?",
  "expo(nent)?",
  "@expo(nent)?/.*",
  "@expo-google-fonts/.*",
  "react-navigation",
  "@react-navigation/.*",
  "@sentry/react-native",
  "native-base",
  "react-native-svg",
  "msw",
  "@mswjs/.*",
  "@open-draft/.*",
  "@bundled-es-modules/.*",
  "rettime",
  "until-async",
  "strict-event-emitter",
  "outvariant",
  "is-node-process",
];

module.exports = {
  ...expoPreset,
  moduleNameMapper: {
    ...expoPreset.moduleNameMapper,
    "^@/(.*)$": "<rootDir>/src/$1",
    // msw's export map blocks "msw/node" under the react-native condition
    // (the app runtime would use msw/native), but Jest tests run in Node —
    // point straight at the CJS build, matching the web package's usage.
    "^msw/node$": "<rootDir>/node_modules/msw/lib/node/index.js",
  },
  testMatch: ["<rootDir>/src/**/*.test.@(ts|tsx)"],
  transformIgnorePatterns: [
    `node_modules/(?!(${transpilePackages.join("|")}))`,
  ],
  transform: {
    ...expoPreset.transform,
    // jest-expo only transforms .[jt]sx? files; ESM-only deps (e.g. msw's
    // rettime) ship .mjs, so route those through the same Babel transformer.
    "^.+\\.mjs$": expoPreset.transform["\\.[jt]sx?$"],
  },
};
