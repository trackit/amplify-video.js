module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './scripts/setup.ts',
  globalTeardown: process.env.NODE_ENV === 'test' ? './scripts/teardown.ts' : null, // Jest automatically set NODE_ENV to test if it's not already set to something else.
  modulePathIgnorePatterns: ["<rootDir>/dist/"]
};