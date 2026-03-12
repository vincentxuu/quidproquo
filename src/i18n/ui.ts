// src/i18n/ui.ts
export const languages = {
  'zh-TW': '中文',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'zh-TW';

export const ui = {
  'zh-TW': {
    'nav.home': '首頁',
    'nav.categories': '分類',
    'nav.tags': '標籤',
    'site.tagline': '技術、攀岩、衝浪、咖啡，以及其他一切。',
    'post.backtocategories': '← 所有分類',
    'post.backtotags': '← 所有標籤',
    'post.articles': '篇文章',
    'lang.switch': 'English',
    'lang.switch.href': '/en',
  },
  en: {
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.tags': 'Tags',
    'site.tagline': 'Tech, climbing, surfing, coffee, and everything else.',
    'post.backtocategories': '← All categories',
    'post.backtotags': '← All tags',
    'post.articles': 'posts',
    'lang.switch': '中文',
    'lang.switch.href': '/',
  },
} as const;

export type UiKey = keyof typeof ui['zh-TW'];
