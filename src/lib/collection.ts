import mediaCollection from '../data/media-collection.json';

export type MediaType = 'anime' | 'film' | 'drama';

export type WatchStatus = 'finished' | 'watching' | 'dropped';

export interface CollectionWork {
  slug: string;
  type: MediaType;
  title: string;
  originalTitle: string;
  year: number;
  genres: string[];
  poster: string | null;
  externalIds: Record<string, string>;
  synopsis: string;
  /** 站主手填 1~10，AI 不代勞 */
  rating: number;
  status: WatchStatus;
  /** 站主手填一句話 */
  oneLiner: string;
  favoriteScenes: string[];
  audience: string;
  review: string;
  tier: 'favorite' | 'loved' | 'watched';
  /** 連結既有/未來影評文章，如 film/2026-01-01-xxx */
  postSlugs: string[];
  deep: {
    characters: unknown[];
    scenes: unknown[];
    meaning: string;
  };
}

const raw = mediaCollection as { works: CollectionWork[] };

export function getCollection(): CollectionWork[] {
  return raw.works;
}

export function getWorksByType(type: MediaType): CollectionWork[] {
  return raw.works
    .filter((w) => w.type === type)
    .sort((a, b) => b.rating - a.rating || b.year - a.year);
}

/** 真愛 TOP 5：tier favorite 優先，依評分排序 */
export function getTopWorks(limit = 5): CollectionWork[] {
  const tierRank = { favorite: 0, loved: 1, watched: 2 } as const;
  return [...raw.works]
    .sort((a, b) => tierRank[a.tier] - tierRank[b.tier] || b.rating - a.rating)
    .slice(0, limit);
}

export function getWorkBySlug(slug: string): CollectionWork | undefined {
  return raw.works.find((w) => w.slug === slug);
}

export function getTypeLabel(type: MediaType, lang: string): string {
  const labels: Record<MediaType, { 'zh-TW': string; en: string }> = {
    anime: { 'zh-TW': '動漫', en: 'Anime' },
    film: { 'zh-TW': '電影', en: 'Films' },
    drama: { 'zh-TW': '戲劇', en: 'Dramas' },
  };
  return labels[type][lang === 'en' ? 'en' : 'zh-TW'];
}

export function getTypeHref(type: MediaType, lang: string): string {
  const base = lang === 'en' ? '/en/collection' : '/collection';
  return `${base}?type=${type}`;
}

export function getStatusLabel(status: WatchStatus, lang: string): string {
  const labels: Record<WatchStatus, { 'zh-TW': string; en: string }> = {
    finished: { 'zh-TW': '看完', en: 'Finished' },
    watching: { 'zh-TW': '追更中', en: 'Watching' },
    dropped: { 'zh-TW': '棄了', en: 'Dropped' },
  };
  return labels[status][lang === 'en' ? 'en' : 'zh-TW'];
}

/**
 * 沒有海報圖時的視覺替代：由 slug 從精選的暗色雙色調（duotone）色板挑一組，
 * 避免隨機亮色漸層——這是「放映廳」的基調，Phase 2 海報下載後即可替換。
 */
const DUOTONES: ReadonlyArray<readonly [string, string]> = [
  ['#1a0d10', '#5b1a24'], // oxblood
  ['#0c1220', '#1d3557'], // midnight
  ['#0d1a14', '#1f513a'], // forest
  ['#170d1f', '#4a1d63'], // plum
  ['#1d1206', '#6b4312'], // bronze
  ['#101418', '#313d4d'], // steel
  ['#08201f', '#155e5a'], // deep sea
  ['#200a17', '#7c2d4e'], // wine
];

export function getGradientFor(slug: string): string {
  let hash = 0;
  for (const ch of slug) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  const [from, to] = DUOTONES[Math.abs(hash) % DUOTONES.length];
  return `linear-gradient(165deg, ${from} 0%, ${to} 78%)`;
}

export function collectionHref(lang: string): string {
  return lang === 'en' ? '/en/collection' : '/collection';
}
