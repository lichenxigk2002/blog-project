// jest.config.js
module.exports = {
    testEnvironment: 'jsdom', // 测试环境
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'], // 测试文件设置，在每个测试文件运行前执行setup.ts
    transform: {  // 转换器，将ts/tsx文件转换为js文件
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: {
                jsx: 'react-jsx'
            }
        }],
    },
    testMatch: [  // 测试文件匹配，匹配src目录下的所有ts/tsx文件
        '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
        '<rootDir>/src/**/*.test.(ts|tsx)',
    ],
    moduleNameMapper: {  // 模块名称映射，将css/less/scss/sass文件映射为identity-obj-proxy，Jest会用identity-obj-proxy替换，返回一个对象，键值相同
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    preset: 'ts-jest/presets/js-with-ts',  // 预设，使用ts-jest/presets/js-with-ts预设
    transformIgnorePatterns: [  // 忽略转换，忽略node_modules目录下的所有.mjs文件
        'node_modules/(?!(.*\\.mjs$))'
    ]
};