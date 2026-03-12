// src/i18n/utils.ts
import { ui, defaultLang, type Lang, type UiKey } from './ui';

export type { Lang };

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first === 'en') return 'en';
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return (ui[lang][key] ?? ui[defaultLang][key]) as string;
  };
}
