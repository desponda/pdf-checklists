module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/cache/**',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  verbose: true
}; 