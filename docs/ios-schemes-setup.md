# Xcode Schemes 設定範例

## 目標設定範例

- **pachycephalosaurus** scheme → Bundle ID: `com.pachycephalosaurus.app` → 顯示名稱：Pachycephalosaurus

---

## 步驟 1: 建立 Schemes

1. 打開 Xcode: `cd ios && open Pachycephalosaurus.xcworkspace`
2. 上方工具列點擊 Scheme 選擇器 → **"Manage Schemes..."**
3. 點擊 **"+"** 建立新 Scheme：
   - Target: 選擇 `pachycephalosaurus`
   - Name: `pachycephalosaurus`
   - 勾選 **Shared**
4. 點擊 **"Close"**

---

## 步驟 2: 設定 Target

### pachycephalosaurus Target

1. 選擇 **pachycephalosaurus** target
2. **Build Settings** → 搜尋 **"Info.plist File"**
   - 設定為：`pachycephalosaurus/pachycephalosaurus.plist`
3. 搜尋 **"Product Bundle Identifier"**
   - 設定為：`com.pachycephalosaurus.app`

---

## 步驟 3: 設定 Pre-actions → 讓 Xcode build 直接去找 .env 檔

```
Pre-action 就是在編譯前自動指定該用哪個 .env 環境檔,這樣不同的 scheme 就能自動載入對應的設定
(例如不同的 API endpoints、app 名稱等),不需要手動切換環境變數檔案。
```

### pachycephalosaurus Scheme

1. 選擇 pachycephalosaurus scheme → **"Edit Scheme..."** (⌘<)
2. 左側選擇 **"Build"** → 展開 **"Pre-actions"**
3. 點擊 **"+"** → **"New Run Script Action"**
4. **Provide build settings from:** 選擇 `pachycephalosaurus`
5. Script:
   ```bash
   echo ".env.pachycephalosaurus" > /tmp/envfile
   ```
6. 點擊 **"Close"**

---

## 步驟 4: 設定簽名

### pachycephalosaurus

1. 選擇 pachycephalosaurus target → **Signing & Capabilities**
2. 勾選 **"Automatically manage signing"**
3. 選擇 **Team**

---

## 完成！

現在可以：
1. 選擇 pachycephalosaurus scheme → Run → 啟動 App

---

## 檢查清單

- [ ] Scheme 已建立 (pachycephalosaurus)
- [ ] Info.plist 設定為 `pachycephalosaurus/pachycephalosaurus.plist`
- [ ] Bundle ID 是 `com.pachycephalosaurus.app`
- [ ] Pre-action 設定完成
- [ ] Target 已設定 Signing

---