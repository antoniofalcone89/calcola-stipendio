module.exports = {
  testMatch: [
    '**/test/**/*.test.js',
    '**/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  roots: ['<rootDir>/test', '<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': require.resolve('react-scripts/config/jest/babelTransform.js'),
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@mui|@emotion|date-fns))',
  ],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
