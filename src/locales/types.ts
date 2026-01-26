export const SUPPORTED_LANGUAGES = {
  'de': 'Deutsch',              // 德文
  'en': 'English',              // 英文
  'fr': 'Français',             // 法文
  'es': 'Español',              // 西班牙文
  'pt': 'Português',            // 葡萄牙文
  'it': 'Italiano',             // 義大利文
  'id': 'Bahasa Indonesia',     // 印尼文
  'ja': '日本語',               // 日文
  'ko': '한국어',               // 韓文
  'ms': 'Bahasa Melayu',        // 馬來文
  'th': 'ไทย',                  // 泰文
  'vi': 'Tiếng Việt',           // 越南文
  'zh-CN': '简体中文',          // 簡體中文
  'zh-TW': '繁體中文',          // 繁體中文
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

export const DEFAULT_LANGUAGE: LanguageCode = 'zh-TW';

// RTL (Right-to-Left) 語言列表
// 目前你的語言列表中沒有 RTL 語言（如阿拉伯文、希伯來文）
export const RTL_LANGUAGES: LanguageCode[] = [];
