// src/plugins/remarkVideoGallery.ts
import type { Root } from 'mdast';
import { videoGalleries, type GalleryVideo } from '../data/climbing-videos';

/**
 * Remark plugin: turns a ```video-gallery fence into one player plus a sideways
 * rail of thumbnails. The clip list lives in `src/data/climbing-videos.ts` so a
 * crag's videos are authored once and rendered in both language versions.
 *
 *   ```video-gallery
 *   key: insubong
 *   lang: zh-TW
 *   ```
 *
 * `key` must exist in the data file and `lang` must be zh-TW or en; anything else
 * throws so a typo fails the build instead of shipping an empty gallery.
 */

export type GalleryLang = 'zh-TW' | 'en';

export interface VideoGallerySpec {
  key: string;
  lang: GalleryLang;
  videos: GalleryVideo[];
}

const KNOWN_KEYS = Object.keys(videoGalleries);

export function parseVideoGalleryFence(body: string): VideoGallerySpec {
  const fields: Record<string, string> = {};
  for (const line of body.split('\n')) {
    const match = line.match(/^\s*(key|lang)\s*:\s*(.*?)\s*$/);
    if (match) fields[match[1]] = match[2];
  }

  const key = fields.key;
  if (!key) throw new Error('video gallery: "key" is required');
  const gallery = videoGalleries[key];
  if (!gallery) throw new Error(`video gallery: unknown key "${key}" (known: ${KNOWN_KEYS.join(', ')})`);
  if (!gallery.videos.length) throw new Error(`video gallery: "${key}" has no videos`);

  const lang = fields.lang;
  if (lang !== 'zh-TW' && lang !== 'en') throw new Error('video gallery: "lang" must be zh-TW or en');

  return { key, lang, videos: gallery.videos };
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const embedSrc = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1`;
const watchHref = (id: string) => `https://www.youtube.com/watch?v=${id}`;

function cardLabels(video: GalleryVideo, lang: GalleryLang) {
  return {
    route: escapeHtml(lang === 'en' ? video.routeEn : video.route),
    note: escapeHtml(lang === 'en' ? video.noteEn : video.note),
    channel: escapeHtml(video.channel),
    title: escapeHtml(video.title),
  };
}

export function renderVideoGallery({ lang, videos }: VideoGallerySpec): string {
  const playable = videos.filter((video) => video.embed !== false);
  const first = playable[0];
  const heading = lang === 'en' ? 'Route videos' : '路線影片';
  const externalLabel = lang === 'en' ? 'opens on YouTube' : '在 YouTube 開啟';
  const previousLabel = lang === 'en' ? 'Previous videos' : '上一組影片';
  const nextLabel = lang === 'en' ? 'Next videos' : '下一組影片';

  const caption = first
    ? `${escapeHtml(lang === 'en' ? first.routeEn : first.route)} · ${escapeHtml(lang === 'en' ? first.noteEn : first.note)} · ${escapeHtml(first.channel)}`
    : '';

  const player = first
    ? [
        '<div class="video-gallery__player">',
        '<div class="video-gallery__frame">',
        `<iframe data-video-gallery-player src="${escapeHtml(embedSrc(first.id))}" title="${escapeHtml(first.title)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`,
        '</div>',
        `<p class="video-gallery__now" data-video-gallery-now aria-live="polite">${caption}</p>`,
        '</div>',
      ].join('')
    : '';

  const cards = videos
    .map((video) => {
      const { route, note, channel, title } = cardLabels(video, lang);
      const thumb = [
        '<span class="video-gallery__thumb">',
        `<img src="https://i.ytimg.com/vi/${video.id}/mqdefault.jpg" alt="" width="320" height="180" loading="lazy" decoding="async">`,
        `<span class="video-gallery__length">${escapeHtml(video.length)}</span>`,
        '</span>',
      ].join('');

      if (video.embed === false) {
        return [
          '<li class="video-gallery__item">',
          `<a class="video-gallery__card video-gallery__card--external" href="${escapeHtml(watchHref(video.id))}" target="_blank" rel="noopener noreferrer" title="${title} — ${externalLabel}">`,
          thumb,
          `<span class="video-gallery__route">${route} <span class="video-gallery__external" aria-hidden="true">↗</span></span>`,
          `<span class="video-gallery__note">${note} · ${channel}</span>`,
          '</a>',
          '</li>',
        ].join('');
      }

      const isFirst = video.id === first?.id;
      return [
        '<li class="video-gallery__item">',
        `<a class="video-gallery__card" href="${escapeHtml(watchHref(video.id))}" data-video-gallery-pick data-video-id="${video.id}" data-video-title="${title}" data-video-label="${route} · ${note} · ${channel}" title="${title}"${isFirst ? ' aria-current="true"' : ''}>`,
        thumb,
        `<span class="video-gallery__route">${route}</span>`,
        `<span class="video-gallery__note">${note} · ${channel}</span>`,
        '</a>',
        '</li>',
      ].join('');
    })
    .join('');

  return [
    `<section class="video-gallery" data-video-gallery aria-label="${escapeHtml(heading)}">`,
    player,
    '<div class="video-gallery__rail-wrap">',
    `<button type="button" class="video-gallery__nav video-gallery__nav--prev" data-video-gallery-prev aria-label="${escapeHtml(previousLabel)}" hidden>‹</button>`,
    `<ul class="video-gallery__rail" data-video-gallery-rail>${cards}</ul>`,
    `<button type="button" class="video-gallery__nav video-gallery__nav--next" data-video-gallery-next aria-label="${escapeHtml(nextLabel)}" hidden>›</button>`,
    '</div>',
    '</section>',
  ].join('');
}

type MdNode = { type: string; lang?: string | null; value?: string; children?: MdNode[] };

export function remarkVideoGallery() {
  return function (tree: Root) {
    const walk = (node: MdNode) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'code' && child.lang === 'video-gallery') {
          return { type: 'html', value: renderVideoGallery(parseVideoGalleryFence(child.value ?? '')) };
        }
        walk(child);
        return child;
      });
    };
    walk(tree as unknown as MdNode);
  };
}
