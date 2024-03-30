/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/utils/prismaMock.ts'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
    moduleNameMapper: {
        '^@/controllers/(.*)$': '<rootDir>/controllers/$1',
        '^@/utils/(.*)$': '<rootDir>/utils/$1',
    },
    coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/utils/cronjobs'],
};