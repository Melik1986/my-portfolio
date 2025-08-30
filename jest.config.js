const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    'gsap': '<rootDir>/tests/__mocks__/gsap.js',
    'gsap/(.*)': '<rootDir>/tests/__mocks__/gsap.js',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/tests/e2e/'],
  transformIgnorePatterns: [
    'node_modules/(?!(gsap)/)'
  ],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
}

module.exports = createJestConfig(customJestConfig)