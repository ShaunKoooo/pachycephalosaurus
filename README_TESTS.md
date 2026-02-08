# 🧪 測試快速參考

> **📖 需要詳細說明？** 請參閱 [docs/TESTING.md](docs/TESTING.md)

---

## 🚀 執行測試

```bash
# 基本命令
npm test                    # 執行所有測試
npm run test:watch          # 監聽模式（開發推薦）
npm run test:coverage       # 查看覆蓋率
npm run test:auth           # 只測試登入功能

# 進階命令
npm test -- --testPathPattern="MyComponent"      # 測試特定檔案
npm test -- --testNamePattern="登入"             # 測試符合名稱的案例
npm test -- --onlyChanged                        # 只測試變更的檔案
npm test -- --verbose                            # 詳細輸出
npm test -- --no-coverage                        # 跳過覆蓋率（加速）
```

---

## 📁 測試檔案放哪裡？

採用 **Co-location** 架構，測試放在源碼旁邊的 `__tests__` 目錄：

```
src/
├── components/auth/
│   ├── __tests__/
│   │   ├── EmailLoginForm.test.tsx    ← 測試檔案
│   │   └── PhoneLoginForm.test.tsx
│   ├── EmailLoginForm.tsx              ← 源碼
│   └── PhoneLoginForm.tsx
│
├── store/slices/
│   ├── __tests__/
│   │   └── authSlice.test.ts
│   └── authSlice.ts
│
└── utils/
    ├── __tests__/
    │   └── dateHelpers.test.ts
    └── dateHelpers.ts
```

**命名規則**: `源碼檔名.test.ts(x)`

---

## ✍️ 測試範例

### Redux Slice 測試

```typescript
// src/store/slices/__tests__/mySlice.test.ts
import { configureStore } from '@reduxjs/toolkit';
import myReducer, { myAction } from '../mySlice';

describe('mySlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { my: myReducer },
    });
  });

  it('應該處理 myAction', () => {
    const initialState = myReducer(undefined, { type: 'unknown' });
    const state = myReducer(initialState, myAction('test'));
    expect(state.data).toBe('test');
  });
});
```

### React 組件測試

```typescript
// src/components/__tests__/MyComponent.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('應該渲染正確', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('標題')).toBeTruthy();
  });

  it('應該處理點擊', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<MyComponent onPress={mockOnPress} />);
    fireEvent.press(getByText('按鈕'));
    expect(mockOnPress).toHaveBeenCalled();
  });
});
```

### 工具函數測試

```typescript
// src/utils/__tests__/myHelper.test.ts
import { myFunction } from '../myHelper';

describe('myFunction', () => {
  it('應該正確處理輸入', () => {
    expect(myFunction('input')).toBe('output');
  });

  it('應該處理邊界情況', () => {
    expect(myFunction('')).toBe('');
    expect(myFunction(null)).toBeNull();
  });
});
```

---

## 🎯 測試撰寫清單

### 寫測試時要包含什麼？

- [ ] **渲染測試** - 檢查元素是否正確顯示
- [ ] **互動測試** - 測試按鈕點擊、輸入等
- [ ] **邏輯測試** - 驗證 Redux、函數計算等
- [ ] **錯誤處理** - 測試失敗情況
- [ ] **邊界情況** - 空值、極端值等

### 測試檔案基本結構

```typescript
describe('元件或功能名稱', () => {
  beforeEach(() => {
    // 每個測試前的準備工作
    jest.clearAllMocks();
  });

  describe('功能分組 1', () => {
    it('應該做某件事', () => {
      // Arrange（準備）
      const input = 'test';

      // Act（執行）
      const result = myFunction(input);

      // Assert（驗證）
      expect(result).toBe('expected');
    });
  });

  describe('功能分組 2', () => {
    it('應該處理錯誤情況', () => {
      // 測試實作
    });
  });
});
```

---

## 🛠️ 已配置的環境

專案已在 `__tests__/setup.ts` 中配置好：

- ✅ AsyncStorage
- ✅ react-native-config
- ✅ react-i18next
- ✅ React Native Animated

**需要新的 Mock？** 在測試檔案頂部加入：

```typescript
jest.mock('@/path/to/module', () => ({
  functionName: jest.fn(),
}));
```
---

## 💡 常用技巧

### 測試 async 操作

```typescript
it('應該處理異步操作', async () => {
  const { getByText } = render(<MyComponent />);

  fireEvent.press(getByText('提交'));

  await waitFor(() => {
    expect(getByText('成功')).toBeTruthy();
  });
});
```

### Mock 函數

```typescript
const mockFunction = jest.fn().mockResolvedValue('result');
const mockFunction = jest.fn().mockRejectedValue(new Error('error'));
```

### 測試 Redux dispatch

```typescript
it('應該 dispatch action', async () => {
  await store.dispatch(myAction());
  const state = store.getState().my;
  expect(state.data).toBeDefined();
});
```

---

**詳細說明**: 查看 [docs/TESTING.md](docs/TESTING.md)

---

**最後更新**: 2026-02-08
