module.exports = {
  preset: 'react-native',

  // 測試檔案匹配模式
  testMatch: [
    '**/__tests__/**/*.(test|spec).[jt]s?(x)',
    '**/*.(test|spec).[jt]s?(x)',
  ],

  // 設定檔案
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],

  // 模組路徑映射（支援 @ alias）
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // 轉換忽略
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@reduxjs/toolkit|react-redux|immer)/)',
  ],

  // 覆蓋率收集
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/index.ts',
    '!src/locales/**',
  ],

  // 覆蓋率門檻
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 50,
      functions: 60,
      lines: 60,
    },
  },
};
