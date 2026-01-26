import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_LANGUAGE, LanguageCode, SUPPORTED_LANGUAGES } from './types';

// 靜態載入翻譯資源（React Native 需要靜態 require）
const resources = {
  de: {
    common: require('./de/common.json'),
    auth: require('./de/auth.json'),
    home: require('./de/home.json'),
    diary: require('./de/diary.json'),
    expert: require('./de/expert.json'),
    notification: require('./de/notification.json'),
    profile: require('./de/profile.json'),
    shop: require('./de/shop.json'),
    errors: require('./de/errors.json'),
    validation: require('./de/validation.json'),
  },
  en: {
    common: require('./en/common.json'),
    auth: require('./en/auth.json'),
    home: require('./en/home.json'),
    diary: require('./en/diary.json'),
    expert: require('./en/expert.json'),
    notification: require('./en/notification.json'),
    profile: require('./en/profile.json'),
    shop: require('./en/shop.json'),
    errors: require('./en/errors.json'),
    validation: require('./en/validation.json'),
  },
  fr: {
    common: require('./fr/common.json'),
    auth: require('./fr/auth.json'),
    home: require('./fr/home.json'),
    diary: require('./fr/diary.json'),
    expert: require('./fr/expert.json'),
    notification: require('./fr/notification.json'),
    profile: require('./fr/profile.json'),
    shop: require('./fr/shop.json'),
    errors: require('./fr/errors.json'),
    validation: require('./fr/validation.json'),
  },
  es: {
    common: require('./es/common.json'),
    auth: require('./es/auth.json'),
    home: require('./es/home.json'),
    diary: require('./es/diary.json'),
    expert: require('./es/expert.json'),
    notification: require('./es/notification.json'),
    profile: require('./es/profile.json'),
    shop: require('./es/shop.json'),
    errors: require('./es/errors.json'),
    validation: require('./es/validation.json'),
  },
  pt: {
    common: require('./pt/common.json'),
    auth: require('./pt/auth.json'),
    home: require('./pt/home.json'),
    diary: require('./pt/diary.json'),
    expert: require('./pt/expert.json'),
    notification: require('./pt/notification.json'),
    profile: require('./pt/profile.json'),
    shop: require('./pt/shop.json'),
    errors: require('./pt/errors.json'),
    validation: require('./pt/validation.json'),
  },
  it: {
    common: require('./it/common.json'),
    auth: require('./it/auth.json'),
    home: require('./it/home.json'),
    diary: require('./it/diary.json'),
    expert: require('./it/expert.json'),
    notification: require('./it/notification.json'),
    profile: require('./it/profile.json'),
    shop: require('./it/shop.json'),
    errors: require('./it/errors.json'),
    validation: require('./it/validation.json'),
  },
  id: {
    common: require('./id/common.json'),
    auth: require('./id/auth.json'),
    home: require('./id/home.json'),
    diary: require('./id/diary.json'),
    expert: require('./id/expert.json'),
    notification: require('./id/notification.json'),
    profile: require('./id/profile.json'),
    shop: require('./id/shop.json'),
    errors: require('./id/errors.json'),
    validation: require('./id/validation.json'),
  },
  ja: {
    common: require('./ja/common.json'),
    auth: require('./ja/auth.json'),
    home: require('./ja/home.json'),
    diary: require('./ja/diary.json'),
    expert: require('./ja/expert.json'),
    notification: require('./ja/notification.json'),
    profile: require('./ja/profile.json'),
    shop: require('./ja/shop.json'),
    errors: require('./ja/errors.json'),
    validation: require('./ja/validation.json'),
  },
  ko: {
    common: require('./ko/common.json'),
    auth: require('./ko/auth.json'),
    home: require('./ko/home.json'),
    diary: require('./ko/diary.json'),
    expert: require('./ko/expert.json'),
    notification: require('./ko/notification.json'),
    profile: require('./ko/profile.json'),
    shop: require('./ko/shop.json'),
    errors: require('./ko/errors.json'),
    validation: require('./ko/validation.json'),
  },
  ms: {
    common: require('./ms/common.json'),
    auth: require('./ms/auth.json'),
    home: require('./ms/home.json'),
    diary: require('./ms/diary.json'),
    expert: require('./ms/expert.json'),
    notification: require('./ms/notification.json'),
    profile: require('./ms/profile.json'),
    shop: require('./ms/shop.json'),
    errors: require('./ms/errors.json'),
    validation: require('./ms/validation.json'),
  },
  th: {
    common: require('./th/common.json'),
    auth: require('./th/auth.json'),
    home: require('./th/home.json'),
    diary: require('./th/diary.json'),
    expert: require('./th/expert.json'),
    notification: require('./th/notification.json'),
    profile: require('./th/profile.json'),
    shop: require('./th/shop.json'),
    errors: require('./th/errors.json'),
    validation: require('./th/validation.json'),
  },
  vi: {
    common: require('./vi/common.json'),
    auth: require('./vi/auth.json'),
    home: require('./vi/home.json'),
    diary: require('./vi/diary.json'),
    expert: require('./vi/expert.json'),
    notification: require('./vi/notification.json'),
    profile: require('./vi/profile.json'),
    shop: require('./vi/shop.json'),
    errors: require('./vi/errors.json'),
    validation: require('./vi/validation.json'),
  },
  'zh-CN': {
    common: require('./zh-CN/common.json'),
    auth: require('./zh-CN/auth.json'),
    home: require('./zh-CN/home.json'),
    diary: require('./zh-CN/diary.json'),
    expert: require('./zh-CN/expert.json'),
    notification: require('./zh-CN/notification.json'),
    profile: require('./zh-CN/profile.json'),
    shop: require('./zh-CN/shop.json'),
    errors: require('./zh-CN/errors.json'),
    validation: require('./zh-CN/validation.json'),
  },
  'zh-TW': {
    common: require('./zh-TW/common.json'),
    auth: require('./zh-TW/auth.json'),
    home: require('./zh-TW/home.json'),
    diary: require('./zh-TW/diary.json'),
    expert: require('./zh-TW/expert.json'),
    notification: require('./zh-TW/notification.json'),
    profile: require('./zh-TW/profile.json'),
    shop: require('./zh-TW/shop.json'),
    errors: require('./zh-TW/errors.json'),
    validation: require('./zh-TW/validation.json'),
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'auth', 'home', 'diary', 'expert', 'notification', 'profile', 'shop', 'errors', 'validation'],

    interpolation: {
      escapeValue: false, // React Native 已處理 XSS
    },

    react: {
      useSuspense: false, // React Native 不需要 Suspense
    },

    // 開發環境下顯示缺失的翻譯 key
    saveMissing: __DEV__,
    missingKeyHandler: (_lngs, ns, key) => {
      if (__DEV__) {
        console.warn(`Missing translation key: [${ns}] ${key}`);
      }
    },
  });

// 從持久化儲存載入使用者偏好語言
const initLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('userLanguage');
    if (savedLanguage && savedLanguage in SUPPORTED_LANGUAGES) {
      await i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.error('Failed to load saved language:', error);
  }
};

initLanguage();

// 語言切換輔助函式
export const changeLanguage = async (lng: LanguageCode) => {
  try {
    await i18n.changeLanguage(lng);
    await AsyncStorage.setItem('userLanguage', lng);
    return true;
  } catch (error) {
    console.error('Failed to change language:', error);
    return false;
  }
};

export const getCurrentLanguage = (): LanguageCode => {
  return i18n.language as LanguageCode;
};

export const getAvailableLanguages = () => {
  return SUPPORTED_LANGUAGES;
};

export default i18n;
