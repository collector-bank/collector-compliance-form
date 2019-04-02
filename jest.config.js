module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    rootDir: 'src',
    transform: {
        '^.+\\.(t|j)sx?$': 'ts-jest',
        '^.+\\.(css|svg)$': '<rootDir>/../file-mock.js',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(collector-portal-framework|react-formatted-number-input|react-datepicker)/)'
    ],
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.test.json',
        },
    },
};
