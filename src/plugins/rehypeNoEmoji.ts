/**
 * Renders emoji in posts as the site's koboyo icons, without rewriting the Markdown sources.
 *
 * Runs last in the rehype chain and rewrites text nodes outside code (`pre`, `code`, `kbd`, ...):
 *
 * - Emoji with a koboyo counterpart become a tiny `<svg class="inline-icon"><use href="#ki-<name>"/></svg>`
 *   sized to the text. The geometry is written once per page: the icon names the document uses go out as
 *   `remarkPluginFrontmatter.inlineIcons`, and the post page renders one hidden sprite of `<symbol>`s after
 *   `<Content />` (render.ts renderIconSprite, same fattening as Icons.astro). Keeping the sprite out of the
 *   rendered Markdown keeps the path data out of Astro's content store. `🌏` → globe, `📄` → file-text,
 *   `✅` → check, `❌` → x, `⚠\uFE0F` → alert-triangle, `⭐` → star, `🎯` → target, and so on
 *   (EMOJI_ICONS below). Status marks keep their meaning for screen readers through `role="img"` and a
 *   zh-TW / en label picked from the page's frontmatter `lang`; the rest are `aria-hidden`.
 * - Colored dots and squares (`🔴🟡🟢`, `🟩🟦`) become small filled SVG shapes. Rows of them are usually a
 *   legend (severity, who owns a step), so red / yellow-orange / green keep their hue through the status
 *   tokens; other colors fall back to the text color, which still tells them apart from those three.
 * - A few marks are text by nature: medals → rank numbers (`🥇` → `1`), keycaps → digits, `🆕` in a
 *   cell → `NEW`, `🔶` → `△`, arrow emoji → plain arrows.
 * - Pictographs with no sensible icon are removed together with the space that followed them. When
 *   removal would leave an element with no content, a `•` is put in so a table cell does not go blank.
 * - Text symbols that are already monochrome (`★ ☆ ✓ ✗ ☐`, arrows, `™`) stay; a VS16 on them is dropped.
 * - Language pill (`> 🌏 [English version](…)`): an icon that is the only thing before the paragraph's
 *   only link moves inside the link as its first child, so the paragraph still has a single element child
 *   and PostLayout's `p:only-child > a:only-child` pill selector keeps matching.
 *
 * Frontmatter strings (title, description, tldr) are not part of the Markdown tree and are rendered as
 * plain text; `stripEmojiText` maps them to text symbols where they are shown.
 *
 * It must be the last rehype plugin: Astro collects headings after user rehype plugins, so the TOC and
 * heading ids are built from the rewritten text (the icon SVG is a raw node, which heading collection skips).
 */

import type { IconName } from '../components/icons/koboyo';
import { renderIconUse } from '../components/icons/render';

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

type FileLike = { data?: { astro?: { frontmatter?: { lang?: string; [key: string]: unknown } } } };
type Lang = 'zh' | 'en';

const SKIP_TAGS = new Set(['code', 'pre', 'kbd', 'samp', 'script', 'style', 'svg', 'math', 'textarea']);

/**
 * One emoji "unit": a keycap, a flag, or a pictograph with its modifiers, variation selectors and
 * ZWJ-joined parts. Text-default characters (`⚠`, `↔`, `™`) only count when a VS16 asks for color,
 * except the few listed bare (⚠ ✔ ✖ ‼ ⁉ ☑) because some platforms (iOS) still draw them as emoji. The
 * plain text marks `✓ ✗` are not emoji and stay text.
 */
const EMOJI_RE =
  /[#*0-9]\uFE0F?\u20E3|\p{Regional_Indicator}{2}|(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F|[\u26A0\u2714\u2716\u203C\u2049\u2611])(?:\p{Emoji_Modifier}|\uFE0F|\uFE0E|[\u{E0020}-\u{E007F}])*(?:\u200D(?:\p{Emoji_Presentation}|\p{Extended_Pictographic})(?:\p{Emoji_Modifier}|\uFE0F)*)*/gu;

const LABELS = {
  yes: { zh: '是', en: 'Yes' },
  no: { zh: '否', en: 'No' },
  caution: { zh: '注意', en: 'Caution' },
  unclear: { zh: '待確認', en: 'Unclear' },
  star: { zh: '星', en: 'Star' },
} as const;

/** Emoji → koboyo icon. `label` makes it a meaningful mark (role="img"); otherwise it is decorative. */
export const EMOJI_ICONS: Record<string, { icon: IconName; label?: keyof typeof LABELS }> = {
  '🌏': { icon: 'globe' },
  '🌍': { icon: 'globe' },
  '🌎': { icon: 'globe' },
  '🌐': { icon: 'globe' },
  '📄': { icon: 'file-text' },
  '📃': { icon: 'file-text' },
  '📝': { icon: 'pencil' },
  '✏': { icon: 'pencil' },
  '📖': { icon: 'book-open' },
  '📚': { icon: 'book-open' },
  '✅': { icon: 'check', label: 'yes' },
  '✔': { icon: 'check', label: 'yes' },
  '☑': { icon: 'check', label: 'yes' },
  '❌': { icon: 'x', label: 'no' },
  '❎': { icon: 'x', label: 'no' },
  '✖': { icon: 'x', label: 'no' },
  '⛔': { icon: 'x', label: 'no' },
  '⚠': { icon: 'alert-triangle', label: 'caution' },
  '🚨': { icon: 'alert-triangle', label: 'caution' },
  '❓': { icon: 'help-circle', label: 'unclear' },
  '❔': { icon: 'help-circle', label: 'unclear' },
  // In Markdown text ⭐ / 🌟 are turned into ★ first and go through the star rules below; this entry
  // only serves stripEmojiText.
  '⭐': { icon: 'star-solid', label: 'star' },
  '🌟': { icon: 'star-solid', label: 'star' },
  '🎯': { icon: 'target' },
  '📌': { icon: 'pin' },
  '📍': { icon: 'pin' },
  '⏰': { icon: 'clock' },
  '⏱': { icon: 'clock' },
  '🕒': { icon: 'clock' },
  '⏳': { icon: 'hourglass' },
  '⌛': { icon: 'hourglass' },
  '🧭': { icon: 'compass' },
  '🎬': { icon: 'clapperboard' },
  '🎥': { icon: 'clapperboard' },
  '💡': { icon: 'lightbulb' },
  '🔒': { icon: 'lock' },
  '🔐': { icon: 'lock' },
  '🚧': { icon: 'construction' },
  '🔎': { icon: 'search' },
  '🔍': { icon: 'search' },
  '🔄': { icon: 'refresh-cw' },
  '🔁': { icon: 'refresh-cw' },
  '💰': { icon: 'coin' },
  '💸': { icon: 'coin' },
  '🪙': { icon: 'coin' },
  '🧾': { icon: 'receipt' },
  '🧩': { icon: 'puzzle' },
  '🛡': { icon: 'shield' },
  '🛠': { icon: 'wrench' },
  '🔧': { icon: 'wrench' },
  '⚙': { icon: 'settings' },
  '🔗': { icon: 'link' },
  '📋': { icon: 'list-checks' },
  '🏠': { icon: 'home' },
};

/** Marks that are text by nature. Keys are base code points (no VS16). */
const EMOJI_TEXT: Record<string, string> = {
  '❗': '!',
  '❕': '!',
  '‼': '!!',
  '⁉': '!?',
  '🔶': '△',
  '🔸': '△',
  '🔷': '◆',
  '🔹': '◆',
  '🥇': '1',
  '🥈': '2',
  '🥉': '3',
  '⬆': '↑',
  '⬇': '↓',
  '⬅': '←',
  '➡': '→',
};

type Shape = 'circle' | 'square';
/** Colored dots and squares: shape plus the status token that keeps the hue (if any). */
const SWATCHES: Record<string, { shape: Shape; color?: string; hollow?: boolean }> = {
  '🔴': { shape: 'circle', color: 'var(--danger)' },
  '🟠': { shape: 'circle', color: 'var(--warning-border)' },
  '🟡': { shape: 'circle', color: 'var(--warning-border)' },
  '🟢': { shape: 'circle', color: 'var(--success-border)' },
  '🔵': { shape: 'circle' },
  '🟣': { shape: 'circle' },
  '🟤': { shape: 'circle' },
  '⚫': { shape: 'circle' },
  '⚪': { shape: 'circle', hollow: true },
  '🟥': { shape: 'square', color: 'var(--danger)' },
  '🟧': { shape: 'square', color: 'var(--warning-border)' },
  '🟨': { shape: 'square', color: 'var(--warning-border)' },
  '🟩': { shape: 'square', color: 'var(--success-border)' },
  '🟦': { shape: 'square' },
  '🟪': { shape: 'square' },
  '🟫': { shape: 'square' },
  '⬛': { shape: 'square' },
  '⬜': { shape: 'square', hollow: true },
};

/** Decorative emoji with no icon that sometimes stand alone (a table cell, `（🆕）`). */
const STANDALONE_FALLBACK: Record<string, string> = { '🆕': 'NEW' };
const GENERIC_FALLBACK = '•';

/** Already-text symbols: a VS16 on them is dropped, the symbol stays. */
const KEEP_TEXT_RE = /^[\u00A9\u00AE\u2122\u2190-\u21FF\u2934\u2935\u2605\u2606\u2610\u2612\u2713\u2717\u3030\u303D]$/u;

const OPEN_PAREN = new Set(['(', '（', '[', '【']);
const CLOSE_PAREN = new Set([')', '）', ']', '】']);

/** Inline icons are drawn at 1em; the fattening stroke is computed for this nominal size. */
const INLINE_NOMINAL_PX = 16;
export const INLINE_ICON_CLASS = 'inline-icon';
/** remarkPluginFrontmatter key listing the koboyo icons a post uses (for the page sprite). */
export const INLINE_ICONS_KEY = 'inlineIcons';
/** Size the sprite's fattening stroke is computed for; pass it to renderIconSprite. */
export const INLINE_ICON_SPRITE_PX = INLINE_NOMINAL_PX;

type Piece =
  | { type: 'text'; value: string }
  | { type: 'html'; html: string }
  | { type: 'icon'; icon: IconName; label?: keyof typeof LABELS; base: string }
  | { type: 'swatch'; shape: Shape; color?: string; hollow?: boolean; base: string };

function baseOf(seq: string): string {
  if (/^[#*0-9]/.test(seq)) return seq[0];
  return String.fromCodePoint(seq.codePointAt(0)!);
}

/**
 * Splits one string into text, icon and swatch pieces. Reports whether anything changed and which
 * fallback to use if decorative removals leave the containing element empty.
 */
function rewrite(input: string): { pieces: Piece[]; changed: boolean; fallback?: string } {
  const pieces: Piece[] = [];
  let buf = '';
  let last = 0;
  let changed = false;
  let fallback: string | undefined;
  const flush = () => {
    if (buf) pieces.push({ type: 'text', value: buf });
    buf = '';
  };

  for (const m of input.matchAll(EMOJI_RE)) {
    const seq = m[0];
    const start = m.index!;
    const end = start + seq.length;
    buf += input.slice(last, start);
    last = end;
    changed = true;

    const base = baseOf(seq);
    const isZwj = seq.includes('\u200D');

    if (/^[#*0-9]/.test(seq)) {
      buf += base;
      continue;
    }
    if (!isZwj && EMOJI_ICONS[base]) {
      flush();
      pieces.push({ type: 'icon', ...EMOJI_ICONS[base], base });
      continue;
    }
    if (!isZwj && SWATCHES[base]) {
      flush();
      pieces.push({ type: 'swatch', ...SWATCHES[base], base });
      continue;
    }
    if (!isZwj && EMOJI_TEXT[base] !== undefined) {
      buf += EMOJI_TEXT[base];
      continue;
    }
    if (!isZwj && KEEP_TEXT_RE.test(base)) {
      buf += base;
      continue;
    }

    // Decorative with no icon: remove. `（🆕）` keeps a word, or drops the now-empty brackets.
    const prev = buf.at(-1);
    const next = input[end];
    if (prev && next && OPEN_PAREN.has(prev) && CLOSE_PAREN.has(next)) {
      if (STANDALONE_FALLBACK[base]) {
        buf += STANDALONE_FALLBACK[base];
      } else {
        buf = buf.slice(0, -1);
        last = end + 1;
        if (buf.endsWith(' ')) buf = buf.slice(0, -1);
      }
      continue;
    }
    fallback ??= STANDALONE_FALLBACK[base] ?? GENERIC_FALLBACK;
    // Drop the single space that separated the icon from what followed it, unless the emoji was glued
    // to the previous word (`쥐고👊 일어서`): then that space is the word gap and stays.
    const prevIsGap = prev === undefined || /\s/.test(prev);
    if (prevIsGap && (next === ' ' || next === '\u00A0' || next === '\u3000')) last = end + 1;
  }
  buf += input.slice(last);
  flush();
  return { pieces, changed, fallback };
}

function swatchSvg(shape: Shape, color: string | undefined, hollow: boolean | undefined): string {
  const ink = color ?? 'currentColor';
  const paint = hollow ? `fill="none" stroke="${ink}" stroke-width="1.5"` : `fill="${ink}"`;
  const mark = shape === 'circle' ? `<circle cx="8" cy="8" r="5.5" ${paint}/>` : `<rect x="2.5" y="2.5" width="11" height="11" rx="1" ${paint}/>`;
  return `<svg width="1em" height="1em" viewBox="0 0 16 16" class="${INLINE_ICON_CLASS}" aria-hidden="true">${mark}</svg>`;
}

function pieceToNode(p: Piece, lang: Lang): HastNode {
  if (p.type === 'text') return { type: 'text', value: p.value };
  if (p.type === 'html') return { type: 'raw', value: p.html };
  if (p.type === 'swatch') return { type: 'raw', value: swatchSvg(p.shape, p.color, p.hollow) };
  const label = p.label ? LABELS[p.label][lang] : undefined;
  return { type: 'raw', value: iconRef(p.icon, label) };
}

/**
 * Icons used by the document being processed. Each inline icon is a `<use href="#ki-…">` reference;
 * rehypeNoEmoji appends one hidden sprite with these symbols at the end of the tree. The transform is
 * synchronous, so a module-level set scoped to one call is safe.
 */
let usedIcons: Set<IconName> | undefined;

function iconRef(name: IconName, label?: string): string {
  usedIcons?.add(name);
  return renderIconUse(name, { cssSize: '1em', class: INLINE_ICON_CLASS, label, hidden: !label });
}

function hasContent(node: HastNode, except: Set<HastNode>): boolean {
  if (except.has(node)) return false;
  if (node.type === 'text') return /\S/.test(node.value ?? '');
  if (node.type === 'raw') return true;
  if (node.type === 'element') {
    if (['img', 'svg', 'video', 'iframe'].includes(node.tagName ?? '')) return true;
    return (node.children ?? []).some((c) => hasContent(c, except));
  }
  return false;
}

// ---------------------------------------------------------------------------------------------------
// Stars. ★ / ☆ are text symbols, not emoji, but the site draws them with koboyo icons too. They carry
// three different meanings in the posts, and each gets its own accessible name:
//   - rating runs (`★★☆`, `★★½`, and a lone `★` that opens a table cell or follows `theCrag`):
//     one `span.star-rating` with role="img" and a label ("2 / 3", "2.5 星"), stars inside aria-hidden;
//   - counts (`23.2k★`, `★ 1.2k`, a `★` column header): one star with role="img" label 星 / stars;
//   - markers (`★ 人類看得懂嗎`, ☆ inside a name like スター☆トレック): decorative, aria-hidden.
// koboyo has only an outlined star; `star-solid` is the same path without its inner contour.
// ---------------------------------------------------------------------------------------------------

const STAR_RUN_RE = /[★☆][\uFE0E\uFE0F]?(?:[★☆][\uFE0E\uFE0F]?)*(?:½|⯨)?/gu;

function starIcon(filled: boolean, label?: string): string {
  return iconRef(filled ? 'star-solid' : 'star', label);
}

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function ratingLabel(filled: number, total: number, half: boolean, lang: Lang): string {
  const n = half ? filled + 0.5 : filled;
  if (total > filled) return lang === 'en' ? `${n} out of ${total + (half ? 1 : 0)}` : `${n} / ${total + (half ? 1 : 0)}`;
  // All filled: the posts never say what the scale is (theCrag is 0–3, Mountain Project 0–4), so give
  // the count rather than inventing a maximum.
  return lang === 'en' ? `${n} ${n === 1 ? 'star' : 'stars'}` : `${n} 星`;
}

function ratingHtml(run: string, lang: Lang): string {
  const stars = [...run.replace(/[\uFE0E\uFE0F]/g, '')];
  const half = stars.at(-1) === '½' || stars.at(-1) === '⯨';
  const body = half ? stars.slice(0, -1) : stars;
  const filled = body.filter((c) => c === '★').length;
  const icons = body.map((c) => starIcon(c === '★')).join('') + (half ? '<span aria-hidden="true">½</span>' : '');
  return `<span class="star-rating" role="img" aria-label="${escapeAttr(ratingLabel(filled, body.length, half, lang))}">${icons}</span>`;
}

type StarContext = { cell?: 'td' | 'th' };

/** Splits stars out of a text node, then runs the emoji rewrite on the text in between. */
function rewriteWithStars(raw: string, lang: Lang, ctx: StarContext): ReturnType<typeof rewrite> {
  // ⭐ / 🌟 are the emoji spelling of ★ (`⭐ 104,523`, `⭐⭐⭐`): same three meanings, same handling.
  const input = raw.replace(/[⭐🌟][\uFE0E\uFE0F]?/gu, '★');
  if (!/[★☆]/.test(input)) return rewrite(raw);
  const normalized = input !== raw;
  const pieces: Piece[] = [];
  let changed = false;
  let fallback: string | undefined;
  let last = 0;
  const pushText = (text: string) => {
    if (!text) return;
    const r = rewrite(text);
    pieces.push(...r.pieces);
    changed ||= r.changed;
    fallback ??= r.fallback;
  };
  for (const m of input.matchAll(STAR_RUN_RE)) {
    const run = m[0];
    const start = m.index!;
    const before = input.slice(0, start);
    const after = input.slice(start + run.length);
    pushText(input.slice(last, start));
    last = start + run.length;
    changed = true;
    const count = [...run.replace(/[\uFE0E\uFE0F½⯨]/g, '')].length;
    const solo = run.replace(/[\uFE0E\uFE0F]/g, '');
    if (count >= 2 || /[½⯨]$/.test(solo)) {
      pieces.push({ type: 'html', html: ratingHtml(run, lang) });
      continue;
    }
    if (solo === '☆') {
      pieces.push({ type: 'html', html: starIcon(false) });
      continue;
    }
    // A lone ★.
    const atCellStart = ctx.cell !== undefined && !/\S/.test(before);
    const nextToNumber = /[\d.,]+[kKmM]?\s?$/.test(before) || /^\s?\d/.test(after);
    const countLabel = lang === 'en' ? 'stars' : '星';
    if (nextToNumber || (ctx.cell === 'th' && atCellStart && !/\S/.test(after))) {
      pieces.push({ type: 'html', html: starIcon(true, countLabel) });
    } else if ((ctx.cell === 'td' && atCellStart && /^\s*(?:[;；,，、]|$)/.test(after)) || /theCrag\s?$/i.test(before)) {
      pieces.push({ type: 'html', html: ratingHtml('★', lang) });
    } else {
      pieces.push({ type: 'html', html: starIcon(true) });
    }
  }
  pushText(input.slice(last));
  return { pieces, changed: changed || normalized, fallback };
}

/**
 * Raw HTML nodes (remark plugins such as remarkVideoGallery's route tables emit their markup as raw
 * strings; rehype-raw only parses them after every user plugin has run) get the same rewrite on their
 * text between tags. Text inside code / pre / script / style / svg / textarea is left alone.
 */
const HTML_TOKEN_RE = /<!--[\s\S]*?-->|<\/?[a-zA-Z][^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>/g;
const NEEDS_REWRITE_RE = /[★☆⭐🌟]|[#*0-9]\uFE0F?\u20E3|\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F|[⚠✔✖‼⁉☑]/u;

function rewriteRawHtml(html: string, lang: Lang): string {
  if (!NEEDS_REWRITE_RE.test(html)) return html;
  let out = '';
  let last = 0;
  let skipDepth = 0;
  let cell: 'td' | 'th' | undefined;
  const rewriteText = (text: string) => {
    if (skipDepth > 0 || !NEEDS_REWRITE_RE.test(text)) return text;
    const { pieces } = rewriteWithStars(text, lang, { cell });
    return pieces.map((p) => (p.type === 'text' ? p.value : (pieceToNode(p, lang).value ?? ''))).join('');
  };
  for (const m of html.matchAll(HTML_TOKEN_RE)) {
    const text = html.slice(last, m.index);
    if (text) {
      out += rewriteText(text);
      if (/\S/.test(text)) cell = undefined;
    }
    const tag = m[0];
    out += tag;
    last = m.index! + tag.length;
    const name = /^<\/?([a-zA-Z][\w-]*)/.exec(tag)?.[1]?.toLowerCase();
    if (!name) continue;
    const closing = tag.startsWith('</');
    if (SKIP_TAGS.has(name) && !tag.endsWith('/>')) skipDepth = Math.max(0, skipDepth + (closing ? -1 : 1));
    cell = !closing && (name === 'td' || name === 'th') ? name : undefined;
  }
  out += rewriteText(html.slice(last));
  return out;
}

function processChildren(parent: HastNode, lang: Lang) {
  const children = parent.children;
  if (!children) return;
  const out: HastNode[] = [];
  const emptied: { node: HastNode; fallback: string }[] = [];

  for (const child of children) {
    if (child.type === 'element') {
      if (!SKIP_TAGS.has(child.tagName ?? '')) processChildren(child, lang);
      out.push(child);
      continue;
    }
    if (child.type === 'raw' && child.value) {
      child.value = rewriteRawHtml(child.value, lang);
      out.push(child);
      continue;
    }
    if (child.type !== 'text' || !child.value) {
      out.push(child);
      continue;
    }
    const cellStart = (parent.tagName === 'td' || parent.tagName === 'th') && out.every((c) => c.type === 'text' && !/\S/.test(c.value ?? ''));
    const { pieces, changed, fallback } = rewriteWithStars(child.value, lang, { cell: cellStart ? (parent.tagName as 'td' | 'th') : undefined });
    if (!changed) {
      out.push(child);
      continue;
    }
    const hasVisible = pieces.some((p) => p.type !== 'text' || /\S/.test(p.value));
    for (const p of pieces) out.push(pieceToNode(p, lang));
    if (!hasVisible && fallback) {
      // Placeholder so a fallback can be put back if the whole element is now blank.
      const placeholder: HastNode = { type: 'text', value: '' };
      out.push(placeholder);
      emptied.push({ node: placeholder, fallback });
    }
  }

  parent.children = out;
  if (emptied.length > 0) {
    const placeholders = new Set(emptied.map((e) => e.node));
    if (!parent.children.some((c) => hasContent(c, placeholders))) {
      emptied[0].node.value = emptied[0].fallback;
    }
  }
  parent.children = parent.children.filter((c) => !(c.type === 'text' && c.value === ''));
  if (parent.tagName === 'p') moveLeadingIconIntoLink(parent);
}

/**
 * `<p>[icon] <a>English version</a></p>` → `<p><a>[icon] English version</a></p>`: only when the
 * paragraph holds nothing but icons, whitespace and exactly one link after them.
 */
function moveLeadingIconIntoLink(p: HastNode) {
  const kids = p.children ?? [];
  const linkIndex = kids.findIndex((c) => c.type === 'element');
  if (linkIndex <= 0) return;
  const link = kids[linkIndex];
  if (link.tagName !== 'a') return;
  const before = kids.slice(0, linkIndex);
  const after = kids.slice(linkIndex + 1);
  const isBlank = (c: HastNode) => c.type === 'text' && !/\S/.test(c.value ?? '');
  if (!before.some((c) => c.type === 'raw')) return;
  if (!before.every((c) => c.type === 'raw' || isBlank(c)) || !after.every(isBlank)) return;
  const lead = before.filter((c) => c.type === 'raw');
  link.children = [...lead, { type: 'text', value: ' ' }, ...(link.children ?? [])];
  p.children = [link, ...after];
}

export function rehypeNoEmoji() {
  return (tree: HastNode, file?: FileLike) => {
    const lang: Lang = file?.data?.astro?.frontmatter?.lang === 'en' ? 'en' : 'zh';
    usedIcons = new Set();
    try {
      processChildren(tree, lang);
      // The sprite itself is NOT added to the tree: the rendered HTML lands in Astro's content store,
      // and the globe alone (~2 KB of path data) on ~6,800 pages would put ~14 MB back in it. Only the
      // icon names go out, as remarkPluginFrontmatter; the post page renders the sprite after <Content />.
      if (usedIcons.size > 0 && file?.data) {
        file.data.astro ??= {};
        file.data.astro.frontmatter ??= {};
        file.data.astro.frontmatter[INLINE_ICONS_KEY] = [...usedIcons].sort();
      }
    } finally {
      usedIcons = undefined;
    }
  };
}


/** Text fallbacks for places that can only hold plain text (frontmatter strings, attributes). */
const ICON_AS_TEXT: Partial<Record<IconName, string>> = {
  check: '✓',
  x: '✗',
  'alert-triangle': '⚠\uFE0E',
  'help-circle': '?',
  star: '☆',
  'star-solid': '★',
};

/**
 * Plain-string variant for frontmatter text (titles, descriptions, tldr) and attributes: status marks
 * become monochrome text symbols (`✅` → `✓`, `⭐` → `★`), swatches become `●`/`■`, and every other emoji
 * is dropped.
 */
export function stripEmojiText(input: string): string {
  if (!input) return input;
  const { pieces, changed } = rewrite(input);
  if (!changed) return input;
  let out = '';
  for (const p of pieces) {
    if (p.type === 'text') out += p.value;
    else if (p.type === 'swatch') out += p.shape === 'circle' ? (p.hollow ? '○' : '●') : p.hollow ? '□' : '■';
    else if (p.type === 'icon') {
      const t = ICON_AS_TEXT[p.icon];
      if (t) out += t;
    }
    // `html` pieces (star ratings) come only from rewriteWithStars, never from rewrite().
  }
  // Dropped icons leave their surrounding spaces: collapse doubles and trim the ends they touched.
  out = out.replace(/ {2,}/g, ' ');
  if (!/^\s/.test(input)) out = out.trimStart();
  if (!/\s$/.test(input)) out = out.trimEnd();
  return out;
}
