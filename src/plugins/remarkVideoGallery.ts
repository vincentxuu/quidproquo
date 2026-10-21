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
  layout?: 'routes';
}

const KNOWN_KEYS = Object.keys(videoGalleries);

export function parseVideoGalleryFence(body: string): VideoGallerySpec {
  const fields: Record<string, string> = {};
  for (const line of body.split('\n')) {
    const match = line.match(/^\s*(key|lang|ids|layout)\s*:\s*(.*?)\s*$/);
    if (match) fields[match[1]] = match[2];
  }

  const key = fields.key;
  if (!key) throw new Error('video gallery: "key" is required');
  const gallery = videoGalleries[key];
  if (!gallery) throw new Error(`video gallery: unknown key "${key}" (known: ${KNOWN_KEYS.join(', ')})`);
  if (!gallery.videos.length) throw new Error(`video gallery: "${key}" has no videos`);

  const lang = fields.lang;
  if (lang !== 'zh-TW' && lang !== 'en') throw new Error('video gallery: "lang" must be zh-TW or en');

  const ids = fields.ids?.split(',').map((id) => id.trim());
  if (ids && (ids.some((id) => !gallery.videos.some((video) => video.id === id)) || new Set(ids).size !== ids.length)) {
    throw new Error('video gallery: "ids" must contain unique video IDs from the selected gallery');
  }
  const videos = ids ? ids.map((id) => gallery.videos.find((video) => video.id === id)!) : gallery.videos;
  if (fields.layout !== undefined && fields.layout !== 'routes') {
    throw new Error('video gallery: "layout" must be routes or omitted');
  }
  return { key, lang, videos, ...(fields.layout ? { layout: 'routes' as const } : {}) };
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

export function renderVideoGallery({ lang, videos, layout }: VideoGallerySpec): string {
  const playlist = layout === 'routes';
  const playable = videos.filter((video) => video.embed !== false);
  const first = playable[0];
  const heading = lang === 'en' ? 'Route videos' : '路線影片';
  const externalLabel = lang === 'en' ? 'opens on YouTube' : '在 YouTube 開啟';
  const previousLabel = lang === 'en' ? 'Previous videos' : '上一組影片';
  const nextLabel = lang === 'en' ? 'Next videos' : '下一組影片';

  const caption = first
    ? `${playlist ? '' : `${escapeHtml(lang === 'en' ? first.routeEn : first.route)} · `}${escapeHtml(lang === 'en' ? first.noteEn : first.note)} · ${escapeHtml(first.channel)}`
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
        `<img src="https://i.ytimg.com/vi/${video.id}/mqdefault.jpg" alt="" width="320" height="180" loading="lazy" decoding="async" draggable="false">`,
        `<span class="video-gallery__length">${escapeHtml(video.length)}</span>`,
        '</span>',
      ].join('');

      if (playlist) {
        const metadata = `<span class="video-gallery__metadata"><span class="video-gallery__note">${note}</span><span class="video-gallery__channel">${channel}</span></span>`;
        if (video.embed === false) {
          return [
            '<li class="video-gallery__item">',
            `<a class="video-gallery__external-row video-gallery__external-link" draggable="false" href="${escapeHtml(watchHref(video.id))}" target="_blank" rel="noopener noreferrer" title="${title}">`,
            thumb,
            `<span class="video-gallery__metadata"><span class="video-gallery__note">${note.replace(/[；;]\s*(?:僅外部連結|link only)/g, '')}</span><span class="video-gallery__channel">${channel}</span><span class="video-gallery__external-action">${lang === 'en' ? 'Watch on YouTube (opens in new tab)' : '在 YouTube 觀看（另開分頁）'}</span></span>`,
            '</a>',

            '</li>',
          ].join('');
        }
        return [
          '<li class="video-gallery__item">',
          `<button type="button" class="video-gallery__choice" data-video-gallery-pick data-video-id="${video.id}" data-video-title="${title}" data-video-label="${note} · ${channel}" title="${title}"${video.id === first?.id ? ' aria-current="true"' : ''}>`,
          thumb, metadata, '</button>', '</li>',
        ].join('');
      }

      if (video.embed === false) {
        return [
          '<li class="video-gallery__item">',
          `<a draggable="false" class="video-gallery__card video-gallery__card--external" href="${escapeHtml(watchHref(video.id))}" target="_blank" rel="noopener noreferrer" title="${title} — ${externalLabel}">`,
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
        `<a draggable="false" class="video-gallery__card" href="${escapeHtml(watchHref(video.id))}" data-video-gallery-pick data-video-id="${video.id}" data-video-title="${title}" data-video-label="${route} · ${note} · ${channel}" title="${title}"${isFirst ? ' aria-current="true"' : ''}>`,
        thumb,
        `<span class="video-gallery__route">${route}</span>`,
        `<span class="video-gallery__note">${note} · ${channel}</span>`,
        '</a>',
        '</li>',
      ].join('');
    })
    .join('');

  if (playlist) {
    return [
      `<section class="video-gallery video-gallery--playlist" data-video-gallery aria-label="${escapeHtml(heading)}">`,
      player,
      `<ul class="video-gallery__playlist" data-video-gallery-rail>${cards}</ul>`,
      '</section>',
    ].join('');
  }

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

type MdNode = { type: string; lang?: string | null; value?: string; url?: string; children?: MdNode[] };

function inlineText(node: MdNode): string {
  return node.value ?? (node.children ?? []).map(inlineText).join('');
}

function renderInline(node: MdNode): string {
  const content = (node.children ?? []).map(renderInline).join('');
  switch (node.type) {
    case 'text': return escapeHtml(node.value ?? '');
    case 'inlineCode': return `<code>${escapeHtml(node.value ?? '')}</code>`;
    case 'strong': return `<strong>${content}</strong>`;
    case 'emphasis': return `<em>${content}</em>`;
    case 'link': {
      const url = node.url ?? '';
      return /^(https?:|mailto:|\/|#)/i.test(url)
        ? `<a href="${escapeHtml(url)}">${content}</a>` : content;
    }
    case 'break': return '<br>';
    default: return content || escapeHtml(node.value ?? '');
  }
}

export function renderRouteVideoTable(table: MdNode, spec: VideoGallerySpec): string {
  const rows = table.children ?? [];
  const en = spec.lang === 'en';
  const videoHeading = en ? 'Videos' : '影片';
  const labels = (rows[0]?.children ?? []).map(inlineText);
  const body = rows.map((row, index) => {
    const cells = row.children ?? [];
    const name = inlineText(cells[0] ?? { type: 'text' });
    const matched = spec.videos.filter(video => !/descent/i.test(video.routeEn)
      && name.startsWith(video.routeEn.split(' 5.')[0]));
    const base = matched[0]?.routeEn.split(' 5.')[0] ?? name.split(/[／/]/)[0].trim();
    const original = cells.map((cell, cellIndex) => {
      const tag = index === 0 || cellIndex === 0 ? 'th' : 'td';
      const scope = tag === 'th' ? ` scope="${index === 0 ? 'col' : 'row'}"` : '';
      const label = index > 0 ? ` data-label="${escapeHtml(labels[cellIndex] ?? '')}"` : '';
      return `<${tag}${scope}${label}>${renderInline(cell)}</${tag}>`;
    }).join('');
    if (index === 0) return `<thead><tr>${original}<th scope="col">${videoHeading}</th></tr></thead>`;
    const thumb = matched.find(video => video.embed !== false) ?? matched[0];
    const gallery = matched.length ? renderVideoGallery({ ...spec, videos: matched })
      .replace(/(<iframe\b[^>]*?) src=/g, '$1 data-src=') : '';
    const trigger = thumb ? `<div class="route-videos__entry"><span class="route-videos__poster"><img src="https://i.ytimg.com/vi/${thumb.id}/mqdefault.jpg" alt="" width="160" height="90" loading="lazy" decoding="async" draggable="false"></span><button type="button" class="route-videos__trigger" data-route-open aria-expanded="false" aria-label="${escapeHtml(en ? `Watch ${base}: ${matched.length} videos` : `觀看 ${base}：${matched.length} 支影片`)}">${en ? `View videos (${matched.length})` : `查看影片（${matched.length}）`}</button></div><noscript><a draggable="false" href="${escapeHtml(watchHref(thumb.id))}" target="_blank" rel="noopener noreferrer">${en ? 'Watch on YouTube' : '在 YouTube 觀看'}</a></noscript><template data-route-gallery>${gallery}</template>` : '—';
    return `<tr data-route-row data-route-name="${escapeHtml(base)}">${original}<td class="route-videos__video-cell" data-label="${videoHeading}">${trigger}</td></tr>`;
  });
  return `<div class="route-videos" data-route-videos data-lang="${spec.lang}"><div class="route-videos__scroll"><table class="route-videos__table">${body[0] ?? ''}<tbody>${body.slice(1).join('')}</tbody></table></div><aside class="route-videos__panel" data-route-panel hidden aria-label="${en ? 'Route videos' : '路線影片'}"><header><strong data-route-heading></strong><button type="button" data-route-close>${en ? 'Close' : '關閉'}</button></header><div data-route-content></div></aside></div>`;
}

export function remarkVideoGallery() {
  return function (tree: Root) {
    const walk = (node: MdNode) => {
      if (!node.children) return;
      const result: MdNode[] = [];
      for (const child of node.children) {
        if (child.type === 'code' && child.lang === 'video-gallery') {
          const spec = parseVideoGalleryFence(child.value ?? '');
          if (spec.layout === 'routes') {
            const previous = result.pop();
            if (previous?.type !== 'table') throw new Error('video gallery: routes layout requires an immediately preceding table');
            result.push({ type: 'html', value: renderRouteVideoTable(previous, spec) });
          } else {
            result.push({ type: 'html', value: renderVideoGallery(spec) });
          }
        } else {
          walk(child);
          result.push(child);
        }
      }
      node.children = result;
    };
    walk(tree as unknown as MdNode);
  };
}
