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
    'nav.search': '搜尋',
    'nav.toggle-theme': '切換深色模式',
    'site.tagline': '技術、攀岩、衝浪、咖啡，以及其他一切。',
    'post.backtocategories': '← 所有分類',
    'post.backtotags': '← 所有標籤',
    'post.articles': '篇文章',
    'post.reading-time': '分鐘',
    'post.toc': '目錄',
    'post.series': '系列',
    'post.prev': '上一篇',
    'post.next': '下一篇',
    'post.related': '相關文章',
    'lang.switch': 'EN',
    'lang.switch.href': '/en',
  },
  en: {
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.tags': 'Tags',
    'nav.search': 'Search',
    'nav.toggle-theme': 'Toggle dark mode',
    'site.tagline': 'Tech, climbing, surfing, coffee, and everything else.',
    'post.backtocategories': '← All categories',
    'post.backtotags': '← All tags',
    'post.articles': 'posts',
    'post.reading-time': 'min',
    'post.toc': 'Table of Contents',
    'post.series': 'Series',
    'post.prev': 'Previous',
    'post.next': 'Next',
    'post.related': 'Related',
    'lang.switch': '中文',
    'lang.switch.href': '/',
  },
} as const;

export type UiKey = keyof typeof ui['zh-TW'];
