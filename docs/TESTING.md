# 測試架構指南

> **⚡ 快速開始？** 請參閱 [README_TESTS.md](../README_TESTS.md)

本文檔詳細說明專案的測試架構設計、目錄規劃和撰寫規範，幫助團隊理解測試系統的整體設計思路。

---

## 📋 目錄

1. [測試架構設計](#測試架構設計)
2. [完整目錄結構](#完整目錄結構)
3. [測試分層策略](#測試分層策略)
4. [測試範本詳解](#測試範本詳解)
5. [配置說明](#配置說明)
6. [最佳實踐](#最佳實踐)

---

## 測試架構設計

### 為什麼選擇 Co-location？

**Co-location（就近放置）** 是指測試檔案與源碼放在同一目錄下。

#### 優點

✅ **易於維護** - 修改功能時，測試就在旁邊，不會忘記更新
✅ **易於重構** - 移動/刪除功能時，測試會一起移動/刪除
✅ **易於理解** - 一眼就知道某個功能有沒有測試
✅ **減少路徑複雜度** - import 路徑更短（`../Component` vs `../../../src/components/Component`）
✅ **符合業界標準** - React、Next.js、Vue 等主流框架推薦的做法

#### 替代方案對比

| 方案 | 結構 | 優點 | 缺點 |
|------|------|------|------|
| **Co-location**（本專案） | `src/components/__tests__/` | 易維護、易理解 | 資料夾變多 |
| 集中式 | `__tests__/components/` | 測試集中管理 | 重構困難、路徑長 |
| 混合式 | 兩者混用 | - | 不一致、混亂 |

---

### 標準專案結構

```
專案根目錄/
│
├── __tests__/                          # ⚙️ 測試配置（非源碼測試）
│   ├── setup.ts                        # 測試環境設定
│   └── App.test.tsx                    # App 入口測試
│
├── src/
│   │
│   ├── components/                     # 🎨 UI 組件
│   │   │
│   │   ├── auth/                       # 登入相關組件
│   │   │   ├── __tests__/
│   │   │   │   ├── EmailLoginForm.test.tsx
│   │   │   │   ├── PhoneLoginForm.test.tsx
│   │   │   │   └── CountryCodePicker.test.tsx
│   │   │   ├── EmailLoginForm.tsx
│   │   │   ├── PhoneLoginForm.tsx
│   │   │   ├── CountryCodePicker.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── calendar/                   # 日曆組件
│   │   │   ├── __tests__/
│   │   │   │   ├── WeekStrip.test.tsx
│   │   │   │   └── MonthCalendar.test.tsx
│   │   │   ├── WeekStrip.tsx
│   │   │   └── MonthCalendar.tsx
│   │   │
│   │   └── shared/                     # 共用組件
│   │       ├── __tests__/
│   │       │   ├── Button.test.tsx
│   │       │   ├── Toast.test.tsx
│   │       │   └── Modal.test.tsx
│   │       ├── Button.tsx
│   │       ├── Toast.tsx
│   │       └── Modal.tsx
│   │
│   ├── screens/                        # 📱 頁面
│   │   ├── auth/
│   │   │   ├── __tests__/
│   │   │   │   └── LoginPage.test.tsx
│   │   │   └── LoginPage.tsx
│   │   │
│   │   └── profile/
│   │       ├── __tests__/
│   │       │   └── ProfilePage.test.tsx
│   │       └── ProfilePage.tsx
│   │
│   ├── store/                          # 🗄️ Redux Store
│   │   │
│   │   ├── api/                        # RTK Query API
│   │   │   ├── __tests__/
│   │   │   │   ├── authApi.test.ts
│   │   │   │   ├── userApi.test.ts
│   │   │   │   └── baseApi.test.ts
│   │   │   ├── authApi.ts
│   │   │   ├── userApi.ts
│   │   │   └── baseApi.ts
│   │   │
│   │   └── slices/                     # Redux Slices
│   │       ├── __tests__/
│   │       │   ├── authSlice.test.ts
│   │       │   └── userSlice.test.ts
│   │       ├── authSlice.ts
│   │       └── userSlice.ts
│   │
│   ├── hooks/                          # 🪝 Custom Hooks
│   │   ├── __tests__/
│   │   │   ├── useAuth.test.ts
│   │   │   └── useDebounce.test.ts
│   │   ├── useAuth.ts
│   │   └── useDebounce.ts
│   │
│   ├── utils/                          # 🔧 工具函數
│   │   ├── __tests__/
│   │   │   ├── dateHelpers.test.ts
│   │   │   ├── validation.test.ts
│   │   │   └── formatters.test.ts
│   │   ├── dateHelpers.ts
│   │   ├── validation.ts
│   │   └── formatters.ts
│   │
│   └── navigation/                     # 🧭 導航
│       ├── __tests__/
│       │   ├── RootNavigator.test.tsx
│       │   └── TabNavigator.test.tsx
│       ├── RootNavigator.tsx
│       └── TabNavigator.tsx
│
├── e2e/                                # 🔄 E2E 測試（可選）
│   ├── auth.e2e.ts
│   └── onboarding.e2e.ts
│
├── jest.config.js                      # ⚙️ Jest 配置
└── package.json                        # 📦 測試腳本
```

### 特殊情況處理

#### 情況 1: 組件資料夾內有多個檔案

```
src/components/UserCard/
├── __tests__/
│   ├── UserCard.test.tsx               # 主組件測試
│   ├── UserAvatar.test.tsx             # 子組件測試
│   └── UserCard.integration.test.tsx   # 整合測試（可選）
├── UserCard.tsx
├── UserAvatar.tsx
├── UserCard.styles.ts                  # 樣式不需要測試
├── UserCard.types.ts                   # 類型不需要測試
└── index.ts                            # export 不需要測試
```

#### 情況 2: 只有幾個簡單檔案的目錄

```
src/theme/
├── __tests__/
│   └── colors.test.ts                  # 集中測試簡單的檔案
├── colors.ts
├── spacing.ts
└── typography.ts
```

#### 情況 3: 整合測試

```
src/features/checkout/
├── __tests__/
│   ├── CheckoutForm.test.tsx           # 單元測試
│   ├── PaymentStep.test.tsx            # 單元測試
│   └── checkout.integration.test.tsx   # 整合測試（多個組件）
├── CheckoutForm.tsx
└── PaymentStep.tsx
```

---

## 測試分層策略

### 測試層級對應

| 層級 | 測試類型 | 工具 | 比例 | 範例 |
|------|---------|------|------|------|
| **L1** | 單元測試 | Jest + RTL | 70% | Redux slice、工具函數、單個組件 |
| **L2** | 整合測試 | Jest + RTL | 20% | 組件 + Redux、多個組件協同 |
| **L3** | E2E 測試 | Detox | 10% | 完整登入流程、購物結帳流程 |

### 測試優先級

#### 高優先級（必須測試）
- ✅ Redux Slices（業務邏輯核心）
- ✅ API 層（資料來源）
- ✅ 核心業務組件（登入、結帳等）
- ✅ 工具函數（計算、驗證等）

#### 中優先級（建議測試）
- ✅ 共用組件（Button、Modal 等）
- ✅ Custom Hooks
- ✅ 頁面組件
- ✅ 導航邏輯

#### 低優先級（可選測試）
- ⏸ 純展示組件（無邏輯）
- ⏸ 樣式檔案
- ⏸ 類型定義
- ⏸ Constants

---

## 測試範本詳解

### 1. Redux Slice 完整範本

```typescript
// src/store/slices/__tests__/cartSlice.test.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
} from '../cartSlice';

describe('cartSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    // 每個測試前建立新的 store
    store = configureStore({
      reducer: { cart: cartReducer },
    });
  });

  describe('初始狀態', () => {
    it('應該返回正確的初始狀態', () => {
      const state = cartReducer(undefined, { type: 'unknown' });

      expect(state).toEqual({
        items: [],
        total: 0,
        loading: false,
        error: null,
      });
    });
  });

  describe('reducers', () => {
    it('應該添加商品到購物車', () => {
      const item = { id: '1', name: 'Product', price: 100 };

      store.dispatch(addItem(item));

      const state = store.getState().cart;
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(item);
    });

    it('應該移除購物車商品', () => {
      const item = { id: '1', name: 'Product', price: 100 };

      store.dispatch(addItem(item));
      store.dispatch(removeItem('1'));

      const state = store.getState().cart;
      expect(state.items).toHaveLength(0);
    });

    it('應該更新商品數量', () => {
      const item = { id: '1', name: 'Product', price: 100, quantity: 1 };

      store.dispatch(addItem(item));
      store.dispatch(updateQuantity({ id: '1', quantity: 3 }));

      const state = store.getState().cart;
      expect(state.items[0].quantity).toBe(3);
    });

    it('應該清空購物車', () => {
      store.dispatch(addItem({ id: '1', name: 'Product', price: 100 }));
      store.dispatch(clearCart());

      const state = store.getState().cart;
      expect(state.items).toHaveLength(0);
    });
  });

  describe('邊界情況', () => {
    it('應該處理重複添加相同商品', () => {
      const item = { id: '1', name: 'Product', price: 100 };

      store.dispatch(addItem(item));
      store.dispatch(addItem(item));

      const state = store.getState().cart;
      // 根據你的業務邏輯決定：累加數量 or 保持一個
      expect(state.items.length).toBeGreaterThan(0);
    });

    it('應該處理移除不存在的商品', () => {
      store.dispatch(removeItem('non-existent'));

      const state = store.getState().cart;
      expect(state.items).toHaveLength(0);
    });
  });
});
```

### 2. React 組件完整範本

```typescript
// src/components/__tests__/LoginForm.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoginForm } from '../LoginForm';
import authReducer from '@/store/slices/authSlice';

// Mock 外部依賴
jest.mock('@/store/api/authApi', () => ({
  useLoginMutation: jest.fn(),
}));

describe('LoginForm', () => {
  let store: ReturnType<typeof configureStore>;
  let mockLogin: jest.Mock;

  beforeEach(() => {
    // 建立測試用 store
    store = configureStore({
      reducer: { auth: authReducer },
    });

    // Mock login mutation
    mockLogin = jest.fn();
    const { useLoginMutation } = require('@/store/api/authApi');
    useLoginMutation.mockReturnValue([mockLogin, { isLoading: false }]);

    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <LoginForm {...props} />
      </Provider>
    );
  };

  describe('渲染測試', () => {
    it('應該渲染所有表單元素', () => {
      const { getByPlaceholderText, getByText } = renderComponent();

      expect(getByPlaceholderText('Email')).toBeTruthy();
      expect(getByPlaceholderText('密碼')).toBeTruthy();
      expect(getByText('登入')).toBeTruthy();
    });

    it('應該顯示標題', () => {
      const { getByText } = renderComponent();
      expect(getByText('會員登入')).toBeTruthy();
    });
  });

  describe('表單互動', () => {
    it('應該能夠輸入 email', () => {
      const { getByPlaceholderText } = renderComponent();
      const input = getByPlaceholderText('Email');

      fireEvent.changeText(input, 'test@example.com');

      expect(input.props.value).toBe('test@example.com');
    });

    it('應該能夠輸入密碼', () => {
      const { getByPlaceholderText } = renderComponent();
      const input = getByPlaceholderText('密碼');

      fireEvent.changeText(input, 'password123');

      expect(input.props.value).toBe('password123');
    });

    it('應該切換密碼顯示狀態', () => {
      const { getByPlaceholderText, getByTestId } = renderComponent();
      const passwordInput = getByPlaceholderText('密碼');
      const toggleButton = getByTestId('toggle-password-visibility');

      // 初始應該隱藏
      expect(passwordInput.props.secureTextEntry).toBe(true);

      // 點擊切換
      fireEvent.press(toggleButton);
      expect(passwordInput.props.secureTextEntry).toBe(false);

      // 再次點擊
      fireEvent.press(toggleButton);
      expect(passwordInput.props.secureTextEntry).toBe(true);
    });
  });

  describe('表單驗證', () => {
    it('當輸入為空時應該禁用登入按鈕', () => {
      const { getByText } = renderComponent();
      const button = getByText('登入');

      // 檢查按鈕是否禁用（根據你的 Button 組件實作）
      expect(button.props.disabled).toBe(true);
    });

    it('當輸入完整時應該啟用登入按鈕', () => {
      const { getByPlaceholderText, getByText } = renderComponent();

      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('密碼'), 'password123');

      const button = getByText('登入');
      expect(button.props.disabled).toBe(false);
    });
  });

  describe('登入流程', () => {
    it('應該在提交時調用登入 API', async () => {
      mockLogin.mockResolvedValue({ data: { token: 'abc123' } });

      const { getByPlaceholderText, getByText } = renderComponent();

      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('密碼'), 'password123');
      fireEvent.press(getByText('登入'));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('登入成功後應該調用 onSuccess 回調', async () => {
      const mockOnSuccess = jest.fn();
      mockLogin.mockResolvedValue({ data: { token: 'abc123' } });

      const { getByPlaceholderText, getByText } = renderComponent({
        onSuccess: mockOnSuccess,
      });

      fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('密碼'), 'password123');
      fireEvent.press(getByText('登入'));

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('登入失敗時應該顯示錯誤訊息', async () => {
      const mockOnError = jest.fn();
      mockLogin.mockRejectedValue({ message: '帳號或密碼錯誤' });

      const { getByPlaceholderText, getByText } = renderComponent({
        onError: mockOnError,
      });

      fireEvent.changeText(getByPlaceholderText('Email'), 'wrong@example.com');
      fireEvent.changeText(getByPlaceholderText('密碼'), 'wrong');
      fireEvent.press(getByText('登入'));

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('帳號或密碼錯誤');
      });
    });
  });
});
```

### 3. 工具函數完整範本

```typescript
// src/utils/__tests__/dateHelpers.test.ts
import {
  formatDate,
  isToday,
  getDaysBetween,
  addDays,
} from '../dateHelpers';

describe('dateHelpers', () => {
  describe('formatDate', () => {
    it('應該正確格式化日期', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15');
    });

    it('應該處理無效日期', () => {
      expect(formatDate(null, 'YYYY-MM-DD')).toBe('');
      expect(formatDate(undefined, 'YYYY-MM-DD')).toBe('');
    });

    it('應該支援不同格式', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/01/2024');
      expect(formatDate(date, 'YYYY年MM月DD日')).toBe('2024年01月15日');
    });
  });

  describe('isToday', () => {
    it('應該正確判斷今天', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('應該判斷昨天不是今天', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('getDaysBetween', () => {
    it('應該計算兩個日期之間的天數', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-10');
      expect(getDaysBetween(start, end)).toBe(9);
    });

    it('應該處理反向日期', () => {
      const start = new Date('2024-01-10');
      const end = new Date('2024-01-01');
      expect(getDaysBetween(start, end)).toBe(-9);
    });

    it('應該處理同一天', () => {
      const date = new Date('2024-01-01');
      expect(getDaysBetween(date, date)).toBe(0);
    });
  });

  describe('addDays', () => {
    it('應該正確增加天數', () => {
      const date = new Date('2024-01-01');
      const result = addDays(date, 5);
      expect(formatDate(result, 'YYYY-MM-DD')).toBe('2024-01-06');
    });

    it('應該處理負數（減少天數）', () => {
      const date = new Date('2024-01-10');
      const result = addDays(date, -5);
      expect(formatDate(result, 'YYYY-MM-DD')).toBe('2024-01-05');
    });

    it('應該處理跨月', () => {
      const date = new Date('2024-01-30');
      const result = addDays(date, 5);
      expect(formatDate(result, 'YYYY-MM-DD')).toBe('2024-02-04');
    });
  });
});
```

### 4. Custom Hooks 完整範本

```typescript
// src/hooks/__tests__/useDebounce.test.ts
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('應該返回初始值', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('應該在延遲後更新值', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // 更新值
    rerender({ value: 'updated', delay: 500 });

    // 立即檢查，應該還是舊值
    expect(result.current).toBe('initial');

    // 推進時間
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // 現在應該是新值
    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('應該取消之前的延遲', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'first', delay: 500 });
    act(() => jest.advanceTimersByTime(300));

    rerender({ value: 'second', delay: 500 });
    act(() => jest.advanceTimersByTime(300));

    // 只有最後一個值會生效
    expect(result.current).toBe('initial');

    act(() => jest.advanceTimersByTime(200));
    expect(result.current).toBe('second');
  });
});
```

### 5. 整合測試範本

```typescript
// src/features/checkout/__tests__/checkout.integration.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CheckoutFlow } from '../CheckoutFlow';
import cartReducer from '@/store/slices/cartSlice';
import orderReducer from '@/store/slices/orderSlice';

describe('Checkout Integration', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer,
        order: orderReducer,
      },
      preloadedState: {
        cart: {
          items: [
            { id: '1', name: 'Product 1', price: 100, quantity: 2 },
          ],
          total: 200,
        },
      },
    });
  });

  it('應該完成完整的結帳流程', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <CheckoutFlow />
      </Provider>
    );

    // Step 1: 填寫收件資訊
    fireEvent.changeText(getByPlaceholderText('姓名'), '測試用戶');
    fireEvent.changeText(getByPlaceholderText('地址'), '測試地址');
    fireEvent.press(getByText('下一步'));

    // Step 2: 選擇付款方式
    await waitFor(() => {
      expect(getByText('選擇付款方式')).toBeTruthy();
    });
    fireEvent.press(getByText('信用卡'));
    fireEvent.press(getByText('下一步'));

    // Step 3: 確認訂單
    await waitFor(() => {
      expect(getByText('確認訂單')).toBeTruthy();
    });
    fireEvent.press(getByText('確認付款'));

    // 驗證結果
    await waitFor(() => {
      expect(getByText('訂單完成')).toBeTruthy();
    });
  });
});
```

---

## 配置說明

### Jest 配置深度解析

```javascript
module.exports = {
  // React Native preset 包含：
  // - babel-jest 轉換
  // - react-native 特定設定
  // - jsdom 環境（模擬瀏覽器）
  preset: 'react-native',

  // 測試檔案匹配模式
  // 支援 .test.ts/.test.tsx/.spec.ts/.spec.tsx
  testMatch: [
    '**/__tests__/**/*.(test|spec).[jt]s?(x)',
    '**/*.(test|spec).[jt]s?(x)',
  ],

  // 測試前載入的設定檔
  // 用於全域 mock 和環境配置
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],

  // 路徑別名映射
  // 讓測試可以使用 @/ 作為 src/ 的別名
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // 轉換忽略模式
  // 這些 node_modules 需要被 babel 轉換
  // 因為它們使用 ES6 語法
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@reduxjs/toolkit|react-redux|immer)/)',
  ],

  // 覆蓋率收集範圍
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',        // 包含所有 src 下的 ts/tsx
    '!src/**/*.d.ts',            // 排除類型定義
    '!src/**/__tests__/**',      // 排除測試檔案本身
    '!src/**/index.ts',          // 排除 barrel exports
    '!src/locales/**',           // 排除翻譯檔案
  ],

  // 覆蓋率門檻
  // 低於此門檻測試會失敗
  coverageThreshold: {
    global: {
      statements: 60,   // 語句覆蓋率
      branches: 50,     // 分支覆蓋率（if/else）
      functions: 60,    // 函數覆蓋率
      lines: 60,        // 行覆蓋率
    },
  },
};
```

### 為什麼需要這些配置？

#### transformIgnorePatterns
```javascript
// ❌ 不設定會發生什麼？
// 錯誤：SyntaxError: Unexpected token 'export'
// 原因：node_modules 的 ES6 程式碼不會被轉換

// ✅ 設定後
transformIgnorePatterns: [
  'node_modules/(?!(react-native|@react-navigation)/)',
]
// 這些模組會被 babel 轉換成 CommonJS
```

#### moduleNameMapper
```javascript
// ❌ 不設定
import { MyComponent } from '../../../components/MyComponent';

// ✅ 設定後
import { MyComponent } from '@/components/MyComponent';
// 更簡潔、不受檔案位置影響
```

### 測試環境設定詳解

```typescript
// __tests__/setup.ts

/**
 * 1. Mock AsyncStorage
 * 為什麼：測試環境沒有真實的 AsyncStorage
 * 效果：所有 AsyncStorage 調用都會被 mock
 */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

/**
 * 2. Mock react-native-config
 * 為什麼：測試環境無法讀取 .env 檔案
 * 效果：提供固定的環境變數
 */
jest.mock('react-native-config', () => ({
  APP_TYPE: 'test',
  API_URL: 'https://api-test.example.com',
}));

/**
 * 3. Mock react-i18next
 * 為什麼：避免測試時載入翻譯檔案
 * 效果：t('key') 直接返回 'key'
 */
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() },
  }),
}));

/**
 * 4. Mock Animated
 * 為什麼：測試環境不需要真實動畫
 * 效果：動畫立即完成
 */
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), {
  virtual: true,
});

/**
 * 5. 靜音 console
 * 為什麼：測試時減少不必要的輸出
 * 效果：console.error/warn 不會顯示
 */
beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

/**
 * 6. 設定 timeout
 * 為什麼：某些 async 測試需要更長時間
 * 效果：測試不會過早超時
 */
jest.setTimeout(10000);
```

---

## 最佳實踐

### 1. 測試命名規範

```typescript
// ✅ 使用「應該...」的格式，清楚描述預期行為
it('應該在點擊按鈕後顯示成功訊息', () => {})
it('應該在輸入無效 email 時顯示錯誤', () => {})
it('應該正確計算購物車總金額', () => {})

// ❌ 避免模糊或技術性的命名
it('測試按鈕', () => {})
it('test handleClick', () => {})
it('測試 1', () => {})
```

### 2. AAA 模式（Arrange-Act-Assert）

```typescript
it('應該計算折扣後的價格', () => {
  // Arrange（準備）- 設定測試資料
  const originalPrice = 1000;
  const discountPercent = 20;

  // Act（執行）- 執行被測試的功能
  const finalPrice = calculateDiscount(originalPrice, discountPercent);

  // Assert（驗證）- 驗證結果
  expect(finalPrice).toBe(800);
});
```

### 3. 測試獨立性

```typescript
// ✅ 好的做法 - 每個測試獨立
describe('ShoppingCart', () => {
  beforeEach(() => {
    // 每個測試前重置
    store = configureStore({
      reducer: { cart: cartReducer },
    });
  });

  it('測試 1', () => {
    store.dispatch(addItem({ id: '1' }));
    expect(store.getState().cart.items).toHaveLength(1);
  });

  it('測試 2', () => {
    // 從乾淨的狀態開始，不依賴測試 1
    store.dispatch(addItem({ id: '2' }));
    expect(store.getState().cart.items).toHaveLength(1);
  });
});

// ❌ 不好的做法 - 測試之間有依賴
let sharedCart = [];

it('測試 1', () => {
  sharedCart.push('item1');
});

it('測試 2', () => {
  // 依賴測試 1 的結果
  expect(sharedCart).toHaveLength(1);
});
```

### 4. 避免測試實作細節

```typescript
// ✅ 測試行為（使用者看到什麼）
it('應該在登入成功後導航到首頁', async () => {
  const { getByText } = render(<LoginPage />);

  fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
  fireEvent.changeText(getByPlaceholderText('密碼'), 'password123');
  fireEvent.press(getByText('登入'));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });
});

// ❌ 測試實作（內部實作方式）
it('應該調用 handleLogin 方法', () => {
  const spy = jest.spyOn(LoginPage.prototype, 'handleLogin');
  const { getByText } = render(<LoginPage />);

  fireEvent.press(getByText('登入'));

  expect(spy).toHaveBeenCalled();
});
```

### 5. 測試邊界情況

```typescript
describe('calculateAge', () => {
  // 正常情況
  it('應該正確計算年齡', () => {
    expect(calculateAge('2000-01-01')).toBe(24);
  });

  // 邊界情況
  it('應該處理今天出生（0歲）', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(calculateAge(today)).toBe(0);
  });

  it('應該處理閏年', () => {
    expect(calculateAge('2000-02-29')).toBeDefined();
  });

  it('應該處理未來日期', () => {
    expect(() => calculateAge('2030-01-01')).toThrow();
  });

  it('應該處理無效日期', () => {
    expect(() => calculateAge('invalid')).toThrow();
  });

  it('應該處理 null/undefined', () => {
    expect(() => calculateAge(null)).toThrow();
    expect(() => calculateAge(undefined)).toThrow();
  });
});
```

### 6. Mock 策略

#### 何時該 Mock？

```typescript
// ✅ 需要 Mock 的情況
- 外部 API 調用（fetch、axios）
- AsyncStorage、SecureStorage
- 導航（react-navigation）
- 第三方服務（Analytics、Crashlytics）
- 時間相關（Date.now()）
- 隨機數（Math.random()）

// ❌ 不需要 Mock 的情況
- 被測試的模組本身
- 簡單的工具函數
- 常數定義
```

#### Mock 的層級

```typescript
// 檔案層級 Mock（測試檔案頂部）
jest.mock('@/api/userApi', () => ({
  fetchUser: jest.fn(),
}));

describe('UserProfile', () => {
  // 測試層級 Mock（beforeEach）
  beforeEach(() => {
    const { fetchUser } = require('@/api/userApi');
    fetchUser.mockResolvedValue({ id: 1, name: 'Test' });
  });

  it('個別測試的 Mock', () => {
    // 測試內 Mock（覆寫 beforeEach）
    const { fetchUser } = require('@/api/userApi');
    fetchUser.mockRejectedValue(new Error('Not found'));

    // 測試實作
  });
});
```

### 7. 使用 describe 組織測試

```typescript
describe('UserProfile', () => {
  // 第一層：功能大分類
  describe('渲染', () => {
    it('應該顯示使用者名稱', () => {});
    it('應該顯示使用者頭像', () => {});
    it('應該顯示使用者角色', () => {});
  });

  describe('編輯功能', () => {
    // 第二層：子功能
    describe('開啟編輯模式', () => {
      it('應該顯示編輯按鈕', () => {});
      it('應該切換到編輯模式', () => {});
    });

    describe('儲存變更', () => {
      it('應該驗證輸入', () => {});
      it('應該調用 API', () => {});
      it('應該顯示成功訊息', () => {});
    });
  });

  describe('錯誤處理', () => {
    it('應該處理載入失敗', () => {});
    it('應該處理儲存失敗', () => {});
  });
});
```

### 8. 測試覆蓋率平衡

```typescript
// 不是所有程式碼都需要 100% 覆蓋率

// ✅ 高覆蓋率（90%+）
- 業務邏輯核心
- 金錢計算
- 資料驗證
- 權限檢查

// ✅ 中覆蓋率（70%+）
- Redux slices
- API 層
- 核心組件

// ✅ 低覆蓋率（50%+）
- UI 組件
- 樣式相關

// ⏸ 可不測試
- 純展示組件
- 常數定義
- 類型定義
```

---

## 常見問題深度解答

### Q: 何時寫測試？何時不寫？

**建議寫測試**:
1. 新增功能（TDD：先寫測試再寫程式）
2. 修復 bug（先寫測試重現問題，再修復）
3. 重構程式碼（確保行為不變）
4. 核心業務邏輯（登入、付款、計算等）
5. 公用函數（會被多處使用）

**可以不寫測試**:
1. 原型開發階段（快速驗證想法）
2. 純展示組件（無邏輯）
3. 一次性腳本
4. 即將被刪除的程式碼

### Q: 測試粒度如何拿捏？

**測試粒度金字塔**:

```
細粒度（多）
  ↓
├─ 工具函數          每個函數多個測試（正常、邊界、錯誤）
├─ Redux Reducers    每個 action 一個測試
├─ Hooks             每個狀態變化一個測試
├─ 組件              每個功能點一個測試
├─ 頁面              關鍵流程測試
└─ E2E               完整用戶旅程
  ↑
粗粒度（少）
```

### Q: 如何測試 React Navigation？

```typescript
// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: { id: '123' },
  }),
}));

// 測試
it('應該導航到詳情頁', () => {
  const { getByText } = render(<MyScreen />);

  fireEvent.press(getByText('查看詳情'));

  expect(mockNavigate).toHaveBeenCalledWith('Detail', { id: '123' });
});
```

### Q: 如何測試 AsyncStorage？

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// 已在 setup.ts 中全域 mock
// 在測試中直接使用

it('應該儲存資料到 AsyncStorage', async () => {
  await saveUserData({ name: 'Test' });

  expect(AsyncStorage.setItem).toHaveBeenCalledWith(
    '@user',
    JSON.stringify({ name: 'Test' })
  );
});

it('應該從 AsyncStorage 讀取資料', async () => {
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
    JSON.stringify({ name: 'Test' })
  );

  const data = await loadUserData();

  expect(data.name).toBe('Test');
});
```

### Q: 如何測試倒數計時？

```typescript
describe('Countdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('應該正確倒數', () => {
    const { getByText } = render(<Countdown seconds={60} />);

    // 初始
    expect(getByText('60')).toBeTruthy();

    // 推進 1 秒
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByText('59')).toBeTruthy();

    // 推進到結束
    act(() => {
      jest.advanceTimersByTime(59000);
    });

    expect(getByText('0')).toBeTruthy();
  });
});
```

### Q: 測試失敗如何除錯？

**步驟化除錯流程**:

1. **看錯誤訊息**
   ```bash
   npm test -- --verbose
   ```

2. **檢查是否是 async 問題**
   ```typescript
   // 加上 await waitFor
   await waitFor(() => {
     expect(getByText('成功')).toBeTruthy();
   });
   ```

3. **印出當前狀態**
   ```typescript
   const { debug } = render(<MyComponent />);
   debug(); // 印出當前 DOM
   ```

4. **檢查 mock 配置**
   ```typescript
   console.log(mockFunction.mock.calls); // 看 mock 被調用的次數和參數
   ```

5. **隔離測試**
   ```bash
   # 只跑單一測試
   npm test -- --testNamePattern="特定測試名稱"
   ```

---

## 進階主題

### 測試 Redux Thunk 的錯誤處理

```typescript
it('應該處理 API 錯誤', async () => {
  // Mock API 失敗
  const { authApi } = require('@/store/api/authApi');
  authApi.endpoints.login.initiate.mockReturnValue({
    unwrap: jest.fn().mockRejectedValue({
      message: '帳號不存在',
    }),
  });

  await store.dispatch(loginAsync({ email: 'test@example.com' }));

  const state = store.getState().auth;
  expect(state.error).toBe('帳號不存在');
  expect(state.isAuthenticated).toBe(false);
});
```

### 測試 React Context

```typescript
const TestWrapper = ({ children }) => (
  <MyContext.Provider value={mockContextValue}>
    {children}
  </MyContext.Provider>
);

it('應該使用 context 值', () => {
  const { getByText } = render(<MyComponent />, {
    wrapper: TestWrapper,
  });

  expect(getByText(mockContextValue.userName)).toBeTruthy();
});
```

### 快照測試（Snapshot Testing）

```typescript
// 用於 UI 一致性測試
it('應該匹配快照', () => {
  const tree = renderer.create(<MyComponent />).toJSON();
  expect(tree).toMatchSnapshot();
});

// 更新快照
// npm test -- -u
```

---

## 參考資源

### 官方文檔
- [Jest 官方文檔](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Redux Toolkit Testing](https://redux-toolkit.js.org/usage/usage-guide#testing)
- [Testing Library 查詢指南](https://testing-library.com/docs/queries/about)

### 推薦閱讀
- [Kent C. Dodds - Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Test Driven Development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

### 相關工具
- [MSW (Mock Service Worker)](https://mswjs.io/) - API mocking
- [Detox](https://wix.github.io/Detox/) - E2E testing for React Native
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger) - 除錯工具

---

**最後更新**: 2026-02-08
**維護者**: Development Team
