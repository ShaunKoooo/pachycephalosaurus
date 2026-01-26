# i18n 多語系設定指南

## 安裝步驟

### 1. 安裝必要套件

```bash
npm install i18next react-i18next
npm install @react-native-async-storage/async-storage
```

或使用 yarn：

```bash
yarn add i18next react-i18next
yarn add @react-native-async-storage/async-storage
```

### 2. iOS 額外設定

```bash
cd ios && pod install && cd ..
```

### 3. 在 package.json 確認依賴

應該會看到以下依賴被新增：

```json
{
  "dependencies": {
    "i18next": "^23.x.x",
    "react-i18next": "^14.x.x",
    "@react-native-async-storage/async-storage": "^1.x.x"
  }
}
```

## 專案設定

### 1. 初始化 i18n（App.tsx 或 index.js）

在應用的最上層引入 i18n 配置：

```typescript
// App.tsx
import React from 'react';
import './src/locales'; // 初始化 i18n

function App() {
  return (
    // ... 你的應用程式碼
  );
}

export default App;
```

### 2. 資料夾結構確認

確認以下檔案結構已建立：

```
src/
├── locales/
│   ├── index.ts              ✅ i18n 配置檔
│   ├── types.ts              ✅ 語言型別定義
│   ├── README.md             ✅ 使用說明
│   ├── en/                   ✅ 英文翻譯
│   │   ├── common.json
│   │   ├── auth.json
│   │   └── ...
│   ├── zh-TW/                ✅ 繁體中文翻譯
│   │   └── ...
│   └── ... (其他 12 種語言)
├── components/
│   └── LanguageSwitcher.tsx  ✅ 語言切換元件
└── examples/
    └── i18nUsageExamples.tsx ✅ 使用範例
```

## CoFitApp 整合步驟

### Step 1: 修改 App.tsx

```typescript
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import './src/locales'; // 初始化 i18n

// Tab Screens
import HomeScreen from './src/screens/HomeScreen';
import DiaryScreen from './src/screens/DiaryScreen';
import ExpertScreen from './src/screens/ExpertScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ShopScreen from './src/screens/ShopScreen';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Diary" component={DiaryScreen} />
        <Tab.Screen name="Expert" component={ExpertScreen} />
        <Tab.Screen name="Notification" component={NotificationScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Shop" component={ShopScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
```

### Step 2: 在 Tab Screen 中使用翻譯

```typescript
// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation('home');
  const userName = 'User';

  return (
    <View>
      <Text>{t('greeting', { name: userName })}</Text>
      <Text>{t('dashboard.todayProgress')}</Text>
    </View>
  );
}
```

### Step 3: 在 Profile 加入語言設定

```typescript
// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher, LanguageButton } from '../components/LanguageSwitcher';

export default function ProfileScreen() {
  const { t } = useTranslation('profile');
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  return (
    <View>
      <Text>{t('title')}</Text>

      {/* 語言設定按鈕 */}
      <TouchableOpacity onPress={() => setShowLanguageModal(true)}>
        <Text>{t('settings.language')}</Text>
        <LanguageButton onPress={() => setShowLanguageModal(true)} />
      </TouchableOpacity>

      {/* 語言切換 Modal */}
      <LanguageSwitcher
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
    </View>
  );
}
```

## CoFitPro 整合步驟

CoFitPro 的整合方式類似，但 Tab 不同：

### 翻譯檔案調整

需要建立 CoFitPro 專屬的命名空間：

```
src/locales/
├── en/
│   ├── common.json         # 共用（與 CoFitApp 共用）
│   ├── auth.json          # 認證（與 CoFitApp 共用）
│   ├── clients.json       # CoFitPro: 我的客戶
│   ├── chat.json          # CoFitPro: 客戶對話
│   ├── community.json     # CoFitPro: 社群
│   ├── notification.json  # 通知（共用）
│   └── profile.json       # 我的（共用）
```

### 修改 i18n 配置

```typescript
// src/locales/index.ts (CoFitPro 版本)
const namespaces = [
  'common',
  'auth',
  'clients',      // CoFitPro 專用
  'chat',         // CoFitPro 專用
  'community',    // CoFitPro 專用
  'notification',
  'profile',
  'errors',
  'validation'
];
```

## 測試 i18n 功能

### 1. 檢查預設語言

```bash
npm start
# 或
yarn start
```

應用啟動後，預設應顯示繁體中文。

### 2. 測試語言切換

1. 進入 Profile 頁面
2. 點擊語言設定
3. 切換到不同語言
4. 檢查 UI 是否正確更新

### 3. 檢查缺失翻譯

開發模式下，如果有缺失的翻譯 key，console 會顯示警告：

```
[i18n] Missing translation key: [home] dashboard.newFeature
```

## 常見問題排解

### 問題 1: 翻譯沒有顯示，顯示 key 值

**原因**: 翻譯檔案載入失敗或 key 不存在

**解決方式**:
1. 檢查 JSON 檔案格式是否正確（不能有尾隨逗號）
2. 確認 key 路徑正確
3. 檢查 console 是否有錯誤訊息

### 問題 2: 切換語言後沒反應

**原因**: AsyncStorage 權限問題或 i18n 未正確初始化

**解決方式**:
```typescript
// 檢查 AsyncStorage 是否正常運作
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.getItem('userLanguage').then(lang => {
  console.log('Saved language:', lang);
});
```

### 問題 3: iOS 無法儲存語言偏好

**原因**: 未執行 pod install

**解決方式**:
```bash
cd ios
pod install
cd ..
npm start -- --reset-cache
```

### 問題 4: TypeScript 報錯

**原因**: 缺少型別定義

**解決方式**:
```bash
npm install --save-dev @types/i18next
```

或在 `tsconfig.json` 中加入：
```json
{
  "compilerOptions": {
    "types": ["i18next"]
  }
}
```

## 後續維護

### 新增翻譯

1. 在 `en/` 目錄新增英文翻譯
2. 執行翻譯（手動或使用翻譯服務）
3. 更新其他 13 種語言的對應檔案

### 翻譯服務建議

- **Crowdin**: 團隊協作翻譯平台
- **Lokalise**: 開發者友善的翻譯管理系統
- **Google Translate API**: 快速機器翻譯（需人工校對）
- **DeepL API**: 高品質機器翻譯

### 自動化腳本

可以建立腳本來檢查缺失的翻譯：

```bash
# scripts/check-translations.js
const fs = require('fs');
const path = require('path');

const languages = ['de', 'en', 'fr', 'es', 'pt', 'it', 'id', 'ja', 'ko', 'ms', 'th', 'vi', 'zh-CN', 'zh-TW'];
const namespaces = ['common', 'auth', 'home', 'diary', 'expert', 'notification', 'profile', 'shop', 'errors', 'validation'];

languages.forEach(lang => {
  namespaces.forEach(ns => {
    const filePath = path.join(__dirname, '../src/locales', lang, `${ns}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`Missing: ${lang}/${ns}.json`);
    }
  });
});
```

執行檢查：
```bash
node scripts/check-translations.js
```

## 效能監控

監控 i18n 對應用效能的影響：

```typescript
// src/utils/i18nPerformance.ts
import i18n from '../locales';

export const measureTranslationTime = (key: string, ns: string) => {
  const start = performance.now();
  const result = i18n.t(key, { ns });
  const end = performance.now();

  if (end - start > 10) { // 超過 10ms
    console.warn(`Slow translation: ${ns}:${key} took ${end - start}ms`);
  }

  return result;
};
```

## 完成檢查清單

- [ ] 安裝 i18next 和 react-i18next
- [ ] 安裝 AsyncStorage
- [ ] iOS 執行 pod install
- [ ] 建立 14 種語言資料夾
- [ ] 建立基礎翻譯檔案（至少英文和繁體中文）
- [ ] 在 App.tsx 引入 i18n
- [ ] 建立 LanguageSwitcher 元件
- [ ] 在至少一個頁面測試翻譯功能
- [ ] 測試語言切換功能
- [ ] 檢查 AsyncStorage 語言儲存功能
- [ ] 確認開發模式下的警告訊息正常運作

完成以上步驟後，你的多語系系統就建置完成了！
