# 多語系 (i18n) 架構說明

## 支援語言

本專案支援以下 14 種語言：

- 🇩🇪 德文 (de)
- 🇺🇸 英文 (en)
- 🇫🇷 法文 (fr)
- 🇪🇸 西班牙文 (es)
- 🇵🇹 葡萄牙文 (pt)
- 🇮🇹 義大利文 (it)
- 🇮🇩 印尼文 (id)
- 🇯🇵 日文 (ja)
- 🇰🇷 韓文 (ko)
- 🇲🇾 馬來文 (ms)
- 🇹🇭 泰文 (th)
- 🇻🇳 越南文 (vi)
- 🇨🇳 簡體中文 (zh-CN)
- 🇹🇼 繁體中文 (zh-TW) - **預設語言**

## 資料夾結構

```
src/locales/
├── de/           # 德文
├── en/           # 英文
├── fr/           # 法文
├── es/           # 西班牙文
├── pt/           # 葡萄牙文
├── it/           # 義大利文
├── id/           # 印尼文
├── ja/           # 日文
├── ko/           # 韓文
├── ms/           # 馬來文
├── th/           # 泰文
├── vi/           # 越南文
├── zh-CN/        # 簡體中文
└── zh-TW/        # 繁體中文
    ├── common.json        # 共用文字
    ├── auth.json         # 認證相關
    ├── home.json         # 首頁 Tab
    ├── diary.json        # 日記 Tab
    ├── expert.json       # 專家 Tab
    ├── notification.json # 通知 Tab
    ├── profile.json      # 我的 Tab
    ├── shop.json         # 商城 Tab
    ├── errors.json       # 錯誤訊息
    └── validation.json   # 表單驗證
```

## 安裝依賴

```bash
npm install i18next react-i18next
npm install @react-native-async-storage/async-storage
```

## 使用方式

### 1. 初始化 i18n（在 App.tsx）

```typescript
import './src/locales'; // 引入 i18n 配置

function App() {
  // ... 你的 App 程式碼
}
```

### 2. 在元件中使用翻譯

#### 基本使用
```typescript
import { useTranslation } from 'react-i18next';

function HomeScreen() {
  const { t } = useTranslation('home');

  return (
    <View>
      <Text>{t('title')}</Text>
      <Text>{t('dashboard.todayProgress')}</Text>
    </View>
  );
}
```

#### 使用多個命名空間
```typescript
function DiaryScreen() {
  const { t } = useTranslation(['diary', 'common']);

  return (
    <View>
      <Text>{t('diary:title')}</Text>
      <Button title={t('common:button.save')} />
    </View>
  );
}
```

#### 使用變數插值
```typescript
function WelcomeScreen() {
  const { t } = useTranslation('home');
  const userName = 'John';

  return (
    <Text>{t('greeting', { name: userName })}</Text>
    // 輸出: "Hello, John!" (英文) 或 "你好，John！" (中文)
  );
}
```

#### 使用複數形式
```typescript
function ClientsScreen() {
  const { t } = useTranslation('clients');
  const clientCount = 5;

  return (
    <Text>{t('list.totalClients', { count: clientCount })}</Text>
    // count === 1: "1 client"
    // count > 1: "5 clients"
  );
}
```

### 3. 切換語言

#### 使用語言切換元件
```typescript
import { LanguageSwitcher, LanguageButton } from './components/LanguageSwitcher';

function SettingsScreen() {
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  return (
    <View>
      <LanguageButton onPress={() => setShowLanguageModal(true)} />

      <LanguageSwitcher
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
    </View>
  );
}
```

#### 程式化切換語言
```typescript
import { changeLanguage } from './locales';

async function switchToEnglish() {
  await changeLanguage('en');
}
```

### 4. 取得當前語言
```typescript
import { getCurrentLanguage } from './locales';

const currentLang = getCurrentLanguage();
console.log(currentLang); // 'zh-TW', 'en', etc.
```

## 新增翻譯

### 步驟 1: 在英文檔案中新增 key
```json
// src/locales/en/home.json
{
  "newFeature": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}
```

### 步驟 2: 在其他語言檔案中新增對應翻譯
```json
// src/locales/zh-TW/home.json
{
  "newFeature": {
    "title": "新功能",
    "description": "這是一個新功能"
  }
}
```

### 步驟 3: 在程式碼中使用
```typescript
const { t } = useTranslation('home');
<Text>{t('newFeature.title')}</Text>
```

## 翻譯檔案命名規範

### Key 命名規則
- 使用 camelCase
- 語意化命名
- 巢狀結構組織相關翻譯

✅ 好的範例：
```json
{
  "login": {
    "title": "Log In",
    "emailPlaceholder": "Enter your email"
  }
}
```

❌ 不好的範例：
```json
{
  "text1": "Log In",
  "txt_email_ph": "Enter your email"
}
```

## 翻譯管理流程

### 開發階段
1. 開發者在 `en/` 目錄新增英文翻譯
2. 程式碼使用 `t()` 函式引用翻譯 key

### 翻譯階段
1. 匯出所有英文 JSON 檔案
2. 交給翻譯團隊或使用翻譯平台（如 Crowdin、Lokalise）
3. 翻譯完成後匯入對應語言目錄

### 測試階段
1. 切換到各語言測試
2. 檢查缺失的翻譯（開發模式會顯示警告）

## 常見問題

### Q: 如何處理缺失的翻譯？
A: 系統會自動 fallback 到英文翻譯，開發模式會在 console 顯示警告。

### Q: 如何新增新語言？
A:
1. 在 `src/locales/types.ts` 的 `SUPPORTED_LANGUAGES` 新增語言代碼
2. 建立新的語言資料夾（如 `ar/`）
3. 複製英文檔案並翻譯

### Q: 翻譯檔案太大怎麼辦？
A: 可以進一步細分命名空間，例如將 `home.json` 拆成 `home-dashboard.json`、`home-widgets.json` 等。

### Q: 如何處理動態內容？
A: 使用變數插值：
```typescript
t('welcome', { name: userName, count: itemCount })
```

## 效能優化

### 1. 按需載入
目前所有翻譯在應用啟動時載入，如果檔案太大可改為：
```typescript
// 動態載入特定命名空間
await i18n.loadNamespaces('shop');
```

### 2. 翻譯檔案壓縮
- 移除不必要的空白
- 使用簡短的 key（但仍保持語意）

### 3. 快取
- AsyncStorage 會快取使用者選擇的語言
- i18next 有內建記憶體快取

## TypeScript 支援

如需型別檢查，可建立型別定義檔：

```typescript
// types/i18next.d.ts
import 'react-i18next';
import common from '../locales/en/common.json';
import auth from '../locales/en/auth.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      auth: typeof auth;
      // ... 其他命名空間
    };
  }
}
```

這樣可以在使用 `t()` 時獲得自動完成和型別檢查。
