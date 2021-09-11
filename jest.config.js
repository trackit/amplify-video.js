module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './scripts/setup.ts',
  globalTeardown: './scripts/teardown.ts',
  modulePathIgnorePatterns: ["<rootDir>/dist/"]
};