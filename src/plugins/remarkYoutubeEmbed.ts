// src/plugins/remarkYoutubeEmbed.ts
import type { Root } from 'mdast';

/**
 * Remark plugin: turns a ```youtube fence into a privacy-friendly embed.
 *
 *   ```youtube
 *   url: https://www.youtube.com/watch?v=MN9dGgmLyso
 *   title: Matt Pocock × Lauren Tan 直播對談
 *   start: 91
 *   captions: en
 *   ```
 *
 * `url` and `title` are required (title feeds the iframe's accessible name and the
 * fallback link); `start` is optional, in seconds. `captions` optionally requests
 * visible captions in the specified language. A malformed block throws so the
 * build fails instead of silently shipping a broken embed.
 */

const VIDEO_ID = /^[\w-]{11}$/;

export interface YoutubeEmbedSpec {
  id: string;
  title: string;
  start?: number;
  captions?: string;
}

export function extractVideoId(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, '');
  let id: string | null = null;
  if (host === 'youtu.be') {
    id = url.pathname.split('/')[1] ?? null;
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const [, kind, pathId] = url.pathname.split('/');
    id = kind === 'watch' ? url.searchParams.get('v') : ['embed', 'live', 'shorts'].includes(kind) ? (pathId ?? null) : null;
  }
  return id && VIDEO_ID.test(id) ? id : null;
}

export function parseYoutubeBlock(body: string): YoutubeEmbedSpec {
  const fields: Record<string, string> = {};
  for (const line of body.split('\n')) {
    const match = line.match(/^\s*(url|title|start|captions)\s*:\s*(.*?)\s*$/);
    if (match) fields[match[1]] = match[2];
  }

  const id = fields.url ? extractVideoId(fields.url) : null;
  if (!id) throw new Error(`youtube embed: missing or invalid "url" (got "${fields.url ?? ''}")`);
  if (!fields.title) throw new Error(`youtube embed: "title" is required (video ${id})`);

  let start: number | undefined;
  if (fields.start !== undefined) {
    start = Number(fields.start);
    if (!Number.isInteger(start) || start < 0) {
      throw new Error(`youtube embed: "start" must be a non-negative integer of seconds (got "${fields.start}")`);
    }
  }
  const captions = fields.captions;
  if (captions !== undefined && !/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(captions)) {
    throw new Error(`youtube embed: "captions" must be a language code (got "${captions}")`);
  }
  return { id, title: fields.title, start, ...(captions ? { captions } : {}) };
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function renderYoutubeEmbed({ id, title, start, captions }: YoutubeEmbedSpec): string {
  const params = new URLSearchParams();
  if (start) params.set('start', String(start));
  if (captions) {
    params.set('cc_lang_pref', captions);
    params.set('cc_load_policy', '1');
  }
  const query = params.toString();
  const embedSrc = `https://www.youtube-nocookie.com/embed/${id}${query ? `?${query}` : ''}`;
  const watchHref = `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ''}`;
  const safeTitle = escapeHtml(title);
  return [
    '<figure class="video-embed">',
    '<div class="video-embed__frame">',
    `<iframe src="${escapeHtml(embedSrc)}" title="${safeTitle}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`,
    '</div>',
    `<figcaption><a href="${escapeHtml(watchHref)}" target="_blank" rel="noopener noreferrer">YouTube：${safeTitle}</a></figcaption>`,
    '</figure>',
  ].join('');
}

type MdNode = { type: string; lang?: string | null; value?: string; children?: MdNode[] };

export function remarkYoutubeEmbed() {
  return function (tree: Root) {
    const walk = (node: MdNode) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'code' && child.lang === 'youtube') {
          return { type: 'html', value: renderYoutubeEmbed(parseYoutubeBlock(child.value ?? '')) };
        }
        walk(child);
        return child;
      });
    };
    walk(tree as unknown as MdNode);
  };
}
