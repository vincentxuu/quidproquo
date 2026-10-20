import type { Lang } from '../i18n/utils';

export const POSTS_PER_PAGE = 20;

export interface Page<T> {
  items: T[];
  current: number;
  total: number;
}

export function pageCount(length: number): number {
  return Math.max(1, Math.ceil(length / POSTS_PER_PAGE));
}

export function getPage<T>(items: T[], current: number): Page<T> {
  const start = (current - 1) * POSTS_PER_PAGE;
  return { items: items.slice(start, start + POSTS_PER_PAGE), current, total: pageCount(items.length) };
}

export function homePageHref(lang: Lang, page: number): string {
  const base = lang === 'en' ? '/en' : '';
  return page === 1 ? `${base}/` : `${base}/page/${page}`;
}

export function categoryPath(category: string, type?: string, page = 1): string {
  return [category, type, page > 1 ? String(page) : undefined].filter(Boolean).join('/');
}

export function categoryHref(lang: Lang, category: string, type?: string, page = 1): string {
  return `${lang === 'en' ? '/en/categories' : '/categories'}/${categoryPath(category, type, page)}`;
}
