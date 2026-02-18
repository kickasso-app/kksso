const nextJest = require("next/jest");

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleNameMapper: {
    "^components/(.*)$": "<rootDir>/components/$1",
    "^services/(.*)$": "<rootDir>/services/$1",
    "^config/(.*)$": "<rootDir>/config/$1",
    "^hooks/(.*)$": "<rootDir>/hooks/$1",
    "^layouts/(.*)$": "<rootDir>/layouts/$1",
    "^lib/(.*)$": "<rootDir>/lib/$1",
    "^styles/(.*)$": "<rootDir>/styles/$1",
    "^app/(.*)$": "<rootDir>/app/$1",
    "^public/(.*)$": "<rootDir>/public/$1"
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);
