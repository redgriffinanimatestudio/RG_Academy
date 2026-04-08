export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/api/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
