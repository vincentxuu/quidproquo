// Shared SVG markup for koboyo icons. Icons.astro and the rehypeNoEmoji Markdown
// plugin both go through renderIconSvg, so an icon looks the same in the site
// chrome and inside a post.
import { KOBOYO_ICONS, type IconName } from './koboyo';

/**
 * Extra weight, in rendered pixels, added by stroking the filled outline.
 *
 * The koboyo art is drawn much lighter than the stroke-width:2 Lucide geometry
 * it replaced — at 11-16px it otherwise reads as a grey hairline next to body
 * text. 0.9px was picked by rendering the set at 11/13/16/24px and comparing
 * against the old icons; below ~0.7 the icons still look disabled, above ~1.1
 * the denser ones (brain-circuit, server-cog) start filling in.
 */
export const FATTEN_PX = 0.9;

export interface RenderIconOptions {
  /** Rendered size in px. Also used to compute the fattening stroke. */
  size?: number;
  /** CSS size for width/height when it differs from `size` (e.g. '1em' inline in text). */
  cssSize?: string;
  /** Ink colour; drives both fill and the fattening stroke. */
  color?: string;
  class?: string;
  /** Accessible name (role="img"). */
  label?: string;
  /** Mark as decorative (aria-hidden). Ignored when `label` is set. Icons.astro leaves both unset, so its output is unchanged. */
  hidden?: boolean;
}

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * Stroke width, in the icon's own user units, that adds FATTEN_PX on screen at `size` px.
 * Each icon has its own viewBox, so the browser's xMidYMid meet fit renders one
 * user unit as size / max(vw, vh) pixels. Invert that ratio so the added weight
 * is the same on screen regardless of how big the source grid is.
 */
function fattenStroke(name: IconName, size: number): string {
  const [vw, vh] = KOBOYO_ICONS[name].vb;
  return ((FATTEN_PX * Math.max(vw, vh)) / size).toFixed(3);
}

const a11yAttrs = (label?: string, hidden?: boolean) =>
  label ? ` role="img" aria-label="${escapeAttr(label)}"` : hidden ? ' aria-hidden="true"' : '';

export function renderIconSvg(name: IconName, opts: RenderIconOptions = {}): string {
  const { size = 16, cssSize, color = 'currentColor', class: cls, label, hidden } = opts;
  const { vb, body } = KOBOYO_ICONS[name];
  const [vw, vh] = vb;
  const dim = cssSize ?? String(size);
  const attrs = `width="${dim}" height="${dim}" viewBox="0 0 ${vw} ${vh}" fill="${color}" stroke="${color}" stroke-width="${fattenStroke(name, size)}" stroke-linejoin="round"${cls ? ` class="${escapeAttr(cls)}"` : ''}${a11yAttrs(label, hidden)}`;
  return `<svg ${attrs}>${body}</svg>`;
}

// --- Sprite form, for Markdown posts. Each inline icon is a `<use>` reference and the geometry is
// written once per page as a `<symbol>`; a post with hundreds of ✅ or ★ otherwise repeats the same
// path data hundreds of times. The symbol carries the same fattening stroke as renderIconSvg at `size`,
// so a referenced icon looks identical to an inline one drawn at that size.

export const SPRITE_ID_PREFIX = 'ki-';

/** `<symbol id="ki-<name>">` with the icon geometry, for a hidden sprite `<svg>`. */
export function renderIconSymbol(name: IconName, opts: { size?: number } = {}): string {
  const { size = 16 } = opts;
  const { vb, body } = KOBOYO_ICONS[name];
  return `<symbol id="${SPRITE_ID_PREFIX}${name}" viewBox="0 0 ${vb[0]} ${vb[1]}"><g fill="currentColor" stroke="currentColor" stroke-width="${fattenStroke(name, size)}" stroke-linejoin="round">${body}</g></symbol>`;
}

/** A tiny `<svg>` that draws `name` from the page sprite (see renderIconSymbol). */
export function renderIconUse(name: IconName, opts: Pick<RenderIconOptions, 'cssSize' | 'class' | 'label' | 'hidden'> = {}): string {
  const { cssSize = '1em', class: cls, label, hidden } = opts;
  return `<svg${cls ? ` class="${escapeAttr(cls)}"` : ''} width="${cssSize}" height="${cssSize}"${a11yAttrs(label, hidden)}><use href="#${SPRITE_ID_PREFIX}${name}"/></svg>`;
}

/**
 * The hidden sprite holding every symbol a page uses (the post page renders it after <Content />). Not `display:none`: some browsers then refuse to
 * render `<use>` references into it. Zero-size and absolutely positioned so it takes no space.
 */
export function renderIconSprite(names: Iterable<IconName>, opts: { size?: number } = {}): string {
  // Unknown names (e.g. a stale content cache from before an icon was renamed) are skipped, not fatal.
  const symbols = [...new Set(names)].filter((n) => n in KOBOYO_ICONS).sort().map((n) => renderIconSymbol(n, opts)).join('');
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">${symbols}</svg>`;
}
