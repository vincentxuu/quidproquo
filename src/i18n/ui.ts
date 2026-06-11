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
    'nav.about': '關於',
    'nav.categories': '分類',
    'nav.series': '系列',
    'nav.tags': '標籤',
    'nav.search': '搜尋',
    'nav.toggle-theme': '切換深色模式',
    'site.tagline': 'AI、技術、產品，攀岩、衝浪、咖啡，以及其他一切。',
    'post.backtocategories': '所有分類',
    'post.backtotags': '所有標籤',
    'post.articles': '篇文章',
    'post.reading-time': '分鐘',
    'post.toc': '目錄',
    'post.series': '系列',
    'post.prev': '上一篇',
    'post.next': '下一篇',
    'post.related': '相關文章',
    'series.empty': '目前還沒有系列文章。',
    'series.posts': '篇文章',
    'lang.switch': 'EN',
    'lang.switch.href': '/en',
    'untranslated.banner': '這篇文章目前沒有中文版本，先為你顯示中文首頁。',
    'untranslated.dismiss': '關閉',
    'glossary.beginner': '初學',
    'glossary.advanced': '進階',
    'glossary.fallback': '是本文中的技術名詞。',
    'glossary.search': '搜尋',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.categories': 'Categories',
    'nav.series': 'Series',
    'nav.tags': 'Tags',
    'nav.search': 'Search',
    'nav.toggle-theme': 'Toggle dark mode',
    'site.tagline': 'Tech, climbing, surfing, coffee, and everything else.',
    'post.backtocategories': 'All categories',
    'post.backtotags': 'All tags',
    'post.articles': 'posts',
    'post.reading-time': 'min',
    'post.toc': 'Table of Contents',
    'post.series': 'Series',
    'post.prev': 'Previous',
    'post.next': 'Next',
    'post.related': 'Related',
    'series.empty': 'No series published yet.',
    'series.posts': 'posts',
    'lang.switch': '中文',
    'lang.switch.href': '/',
    'untranslated.banner': "This article isn't available in English yet — showing the English home instead.",
    'untranslated.dismiss': 'Dismiss',
    'glossary.beginner': 'Beginner',
    'glossary.advanced': 'Advanced',
    'glossary.fallback': 'is a technical term used in this article.',
    'glossary.search': 'Search',
  },
} as const;

export type UiKey = keyof typeof ui['zh-TW'];
