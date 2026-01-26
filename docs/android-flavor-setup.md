# 新增 Android Product Flavor 步驟指南（範例）

## 情境範例

假設你要新增一個新的 App，例如 **Pachycephalosaurus APP**

---

## Android 設定步驟

### 1. 建立環境變數檔案

建立 `.env.pachycephalosaurus`：

```bash
# Pachycephalosaurus App Configuration
ENV=production
APP_NAME=Pachycephalosaurus
BUNDLE_ID_IOS=com.pachycephalosaurus.app
BUNDLE_ID_ANDROID=com.pachycephalosaurus.app
DISPLAY_NAME=Pachycephalosaurus

# API Configuration
API_URL=https://api.pachycephalosaurus.com
API_TIMEOUT=30000
```

---

### 2. 更新 build.gradle

編輯 `android/app/build.gradle`：

#### 2.1 加入環境變數檔案對應

```gradle
project.ext.envConfigFiles = [
    pachycephalosaurusDebug: ".env.pachycephalosaurus",
    pachycephalosaurusRelease: ".env.pachycephalosaurus",
]
```

#### 2.2 加入 Signing Config（如果需要）

```gradle
signingConfigs {
    pachycephalosaurus {
        storeFile file("../../pachycephalosaurus.jks")
        storePassword "your_store_password"
        keyAlias "your_key_alias"
        keyPassword "your_key_password"
    }
}
```

#### 2.3 加入新的 Product Flavor

```gradle
flavorDimensions "app"

productFlavors {
    pachycephalosaurus {
        dimension "app"
        applicationId "com.pachycephalosaurus.app"
        resValue "string", "app_name", "Pachycephalosaurus"
        // 使用對應的簽名配置
        signingConfig signingConfigs.pachycephalosaurus
    }
}
```

---

### 3. 建立 Flavor 專屬資源

建立資料夾結構：

```bash
mkdir -p android/app/src/pachycephalosaurus/res/values
mkdir -p android/app/src/pachycephalosaurus/res/drawable
mkdir -p android/app/src/pachycephalosaurus/res/mipmap-{hdpi,mdpi,xhdpi,xxhdpi,xxxhdpi}
```

建立 `android/app/src/pachycephalosaurus/res/values/strings.xml`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Pachycephalosaurus</string>
    <string name="expo_splash_screen_resize_mode" translatable="false">contain</string>
    <string name="expo_splash_screen_status_bar_translucent" translatable="false">false</string>
    <string moduleConfig="true" name="CodePushDeploymentKey">YOUR_DEPLOYMENT_KEY</string>
    <string moduleConfig="true" name="CodePushServerUrl">https://codepush.appsonair.com</string>
</resources>
```

建立 `android/app/src/pachycephalosaurus/res/values/colors.xml`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="iconBackground">#FFFFFF</color>
    <color name="colorPrimary">#004F51</color>
    <color name="colorPrimaryDark">#ffffff</color>
    <color name="splashscreen_background">#FFFFFF</color>
</resources>
```

建立 `android/app/src/pachycephalosaurus/res/drawable/splashscreen.xml`：

```xml
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item android:drawable="@color/splashscreen_background"/>
</layer-list>
```

---

### 4. 更新 package.json 腳本

```json
{
  "scripts": {
    "android:pachycephalosaurus": "react-native run-android --mode=pachycephalosaurusDebug --appId=com.pachycephalosaurus.app"
  }
}
```

---

### 5. Sync 並測試

#### 方法 1: 使用 Android Studio

1. File → Sync Project with Gradle Files
2. Build → Select Build Variant → 選擇 `pachycephalosaurusDebug`
3. Run

#### 方法 2: 使用終端

```bash
# Debug 版本
./gradlew assemblePachycephalosaurusDebug

# Release 版本
./gradlew assemblePachycephalosaurusRelease

# 直接運行
npm run android:pachycephalosaurus
```

---

## 檢查清單

- [ ] 建立 `.env.pachycephalosaurus` 環境變數檔案
- [ ] 更新 `build.gradle` 的 `envConfigFiles`
- [ ] 新增 `productFlavors` 配置
- [ ] 建立 flavor 資源資料夾結構
- [ ] 建立 `strings.xml`
- [ ] 建立 `colors.xml`
- [ ] 建立 `splashscreen.xml`
- [ ] 準備 App 圖示（放入各 mipmap 資料夾）
- [ ] 更新 `package.json` 腳本
- [ ] Gradle Sync 成功
- [ ] 測試 Debug 建置
- [ ] 測試 Release 建置

---

## 多 Flavor 範例

如果你有多個環境，可以這樣設定：

```gradle
flavorDimensions "app"

productFlavors {
    pachycephalosaurus {
        dimension "app"
        applicationId "com.pachycephalosaurus.app"
        resValue "string", "app_name", "Pachycephalosaurus"
        signingConfig signingConfigs.pachycephalosaurus
    }

    pachycephalosaurusStaging {
        dimension "app"
        applicationId "com.pachycephalosaurus.staging"
        resValue "string", "app_name", "Pachy Staging"
        signingConfig signingConfigs.pachycephalosaurusStaging
    }

    pachycephalosaurusPro {
        dimension "app"
        applicationId "com.pachycephalosaurus.pro"
        resValue "string", "app_name", "Pachy Pro"
        signingConfig signingConfigs.pachycephalosaurusPro
    }
}
```

對應的 `envConfigFiles`:

```gradle
project.ext.envConfigFiles = [
    pachycephalosaurusDebug: ".env.pachycephalosaurus",
    pachycephalosaurusRelease: ".env.pachycephalosaurus",
    pachycephalosaurusStagingDebug: ".env.pachycephalosaurus.staging",
    pachycephalosaurusStagingRelease: ".env.pachycephalosaurus.staging",
    pachycephalosaurusProDebug: ".env.pachycephalosaurus.pro",
    pachycephalosaurusProRelease: ".env.pachycephalosaurus.pro",
]
```

---

## 常見問題

### Q: 編譯時找不到資源？
**A**: 確認資源檔案路徑正確，並執行 Gradle Sync

### Q: CodePush 錯誤？
**A**: 確認 `strings.xml` 中的 `CodePushDeploymentKey` 已正確設定

### Q: 應用程式無法安裝？
**A**: 檢查 `applicationId` 是否與已安裝的應用程式衝突

### Q: Signing 錯誤？
**A**: 確認 `.jks` 檔案路徑正確，密碼正確
