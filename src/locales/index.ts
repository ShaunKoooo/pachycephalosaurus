import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_LANGUAGE, LanguageCode, SUPPORTED_LANGUAGES } from './types';

// 動態載入所有語言的翻譯資源
const loadResources = () => {
  const resources: Record<string, any> = {};

  const languages: LanguageCode[] = Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[];
  const namespaces = ['common', 'auth', 'home', 'diary', 'expert', 'notification', 'profile', 'shop', 'errors', 'validation'];

  languages.forEach(lang => {
    resources[lang] = {};
    namespaces.forEach(ns => {
      try {
        resources[lang][ns] = require(`./${lang}/${ns}.json`);
      } catch (error) {
        // 如果某個語言的某個命名空間不存在，使用英文作為後備
        console.warn(`Missing translation: ${lang}/${ns}.json`);
        try {
          resources[lang][ns] = require(`./en/${ns}.json`);
        } catch {
          resources[lang][ns] = {};
        }
      }
    });
  });

  return resources;
};

const resources = loadResources();

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
    missingKeyHandler: (lngs, ns, key) => {
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
