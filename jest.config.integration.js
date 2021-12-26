module.exports = {
  globals: {
    'ts-jest': {
      isolatedModules: true,
      tsconfig: 'tsconfig.json',
    },
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/integration-test/**/*.(test|spec).(ts|tsx|js)'],
  coveragePathIgnorePatterns: ['<rootDir>/test/helpers/', '<rootDir>/node_modules/', '<rootDir>/src/typeorm/'],
  clearMocks: true,
  preset: 'ts-jest',
};
