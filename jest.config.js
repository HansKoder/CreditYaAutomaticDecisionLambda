/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testMatch: ["**/lambda.test.ts"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  clearMocks: true
};
