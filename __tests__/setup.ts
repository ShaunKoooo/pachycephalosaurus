/**
 * Jest 測試設定檔
 * 這個檔案會在所有測試執行前載入
 */

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-config
jest.mock('react-native-config', () => ({
  APP_TYPE: 'cofitapp',
  API_URL: 'https://api-test.example.com',
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
      // 簡單的翻譯 mock，返回 key 和參數
      if (params) {
        let result = key;
        Object.keys(params).forEach((param) => {
          result = result.replace(`{{${param}}}`, params[param]);
        });
        return result;
      }
      return key;
    },
    i18n: {
      changeLanguage: jest.fn(),
      language: 'zh-TW',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock React Native 動畫
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), {
  virtual: true,
});

// 靜音 console 錯誤和警告（在測試中）
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    // 忽略特定的警告
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Warning: useLayoutEffect') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    // 忽略特定的警告
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Animated:') || args[0].includes('componentWillReceiveProps'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// 全域測試 timeout
jest.setTimeout(10000);
