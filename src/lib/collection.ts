import mediaCollection from '../data/media-collection.json';
import mediaCollectionMeta from '../data/media-collection.meta.json';
import mediaCollectionYoutube from '../data/media-collection.youtube.json';

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
  /** 站主手填：每看一次一筆，重看次數＝筆數（不另存） */
  watches?: WatchRecord[];
  deep: {
    /** 站主挑的角色；name 對得上 meta.cast 的 character 時，演員牆會標出來 */
    characters: DeepCharacter[];
    scenes: DeepScene[];
    meaning: string;
  };
}

export interface WatchRecord {
  /** YYYY-MM-DD 或 YYYY-MM */
  date: string;
  note?: string;
}

export interface DeepCharacter {
  name: string;
  actor?: string;
  image?: string;
  /** 站主的看法 */
  take: string;
  spoiler?: boolean;
}

export interface DeepScene {
  title: string;
  /** 出處，如 S01E05 或 1:12:30 */
  ref?: string;
  image?: string;
  take: string;
  spoiler?: boolean;
}

/** scripts/collection-meta.mjs 產生的客觀資料（media-collection.meta.json），站主不手改 */
export interface WorkMeta {
  fetchedAt: string;
  source: Partial<Record<'tmdb' | 'anilist' | 'mal', string>>;
  backdrop: string | null;
  tagline: string | null;
  /** 電影＝片長；動漫＝單集分鐘 */
  runtime: number | null;
  episodes: number | null;
  seasons: number | null;
  /** 動漫系列的各季（沿 AniList 續集關聯收集）；themes[].season 是這裡的索引 */
  seasonList?: SeasonInfo[];
  /** 動漫＝製作公司；劇集＝電視台 */
  studios: string[];
  directors: { name: string; role: string }[];
  cast: CastCredit[];
  themes: ThemeSong[];
}

export interface CastCredit {
  /** 演員（動漫為日文聲優）；可能缺 */
  name: string | null;
  character: string | null;
  characterRomaji?: string;
  image: string | null;
  order: number;
  role?: 'MAIN' | 'SUPPORTING' | 'BACKGROUND';
}

export interface SeasonInfo {
  title: string;
  native: string | null;
  year: number | null;
  episodes: number | null;
  status: string;
}

export interface ThemeSong {
  type: 'op' | 'ed';
  title: string;
  artist: string | null;
  episodes: string | null;
  spotify: string | null;
  /** MyAnimeList 附的 YouTube Music 影片 id（未驗證可嵌入；頁面改用 getThemeVideo） */
  youtube?: string | null;
  /** seasonList 的索引 */
  season?: number;
}

/** scripts/collection-youtube.mjs 產生、站主確認的主題曲影片（media-collection.youtube.json） */
export interface ThemeVideo {
  id: string;
  channel: string;
  videoTitle: string;
  source: 'myanimelist' | 'search';
  confirmed: boolean;
  /** 站主判定不對（collection-review 按 n）：頁面不嵌入，重跑抓影片腳本也不覆蓋 */
  rejected?: boolean;
}

const meta = mediaCollectionMeta as unknown as { works: Record<string, WorkMeta> };
const videos = mediaCollectionYoutube as unknown as { works: Record<string, Record<string, ThemeVideo>> };

export function getWorkMeta(slug: string): WorkMeta | null {
  return meta.works[slug] ?? null;
}

/** 自動挑選或站主確認過的官方影片；沒有或被站主拒絕就回 null（頁面只顯示 Spotify） */
export function getThemeVideo(slug: string, themeTitle: string): ThemeVideo | null {
  const video = videos.works[slug]?.[themeTitle];
  return video && !video.rejected ? video : null;
}

/** Spotify 歌曲網址 → 嵌入播放器用的 track id */
export function spotifyTrackId(url: string | null): string | null {
  return url?.match(/open\.spotify\.com\/track\/([A-Za-z0-9]+)/)?.[1] ?? null;
}

// JSON 匯入推論不出字面型別（type、status、externalIds 各筆鍵不同），經 unknown 轉成手寫的 CollectionWork
const raw = mediaCollection as unknown as { works: CollectionWork[] };

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
 * 海報替身：明亮 duotone。
 * 設計：每個海報是一組明亮 pair；文字色由 CSS 從 room 主題解析（light 用深色 fg、dark 用白 fg）。
 * Phase 2 海報下載後，poster 非空即可改用 <img>。
 */
export interface PosterStyle {
  background: string;
  color: 'inherit';
}

const DUOTONES: ReadonlyArray<readonly [string, string]> = [
  ['#1a6b7a', '#d0e9e8'],   // teal steel → mist
  ['#a95d4e', '#f2e2c5'],   // terracotta → parchment
  ['#3d7a47', '#dfe3c9'],   // forest → sage linen
  ['#8a3d77', '#eadbef'],   // plum → lilac
  ['#5d5a39', '#d7c899'],   // olive → straw
  ['#1b4d63', '#c5e0e6'],   // deep sea → sky
  ['#b33f4a', '#f3dbc2'],   // brick → blush
  ['#6a7d45', '#e2dfb5'],   // grass → lichen
];

export function getPosterStyle(slug: string): PosterStyle {
  let hash = 0;
  for (const ch of slug) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  const [from, to] = DUOTONES[Math.abs(hash) % DUOTONES.length];
  return {
    background: `linear-gradient(165deg, ${from} 0%, ${to} 78%)`,
    color: 'inherit',
  };
}

export function getGradientFor(slug: string): string {
  return getPosterStyle(slug).background;
}

export function collectionHref(lang: string): string {
  return lang === 'en' ? '/en/collection' : '/collection';
}
