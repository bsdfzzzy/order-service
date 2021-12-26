module.exports = {
  globals: {
    'ts-jest': {
      isolatedModules: true,
      tsconfig: 'tsconfig.json',
    },
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.(test|spec).(ts|tsx|js)'],
  coveragePathIgnorePatterns: ['<rootDir>/test/helpers/', '<rootDir>/node_modules/'],
  clearMocks: true,
  preset: 'ts-jest',
  modulePaths: ['<rootDir>/src/'],
};
