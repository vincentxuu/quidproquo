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

export function renderIconSvg(name: IconName, opts: RenderIconOptions = {}): string {
  const { size = 16, cssSize, color = 'currentColor', class: cls, label, hidden } = opts;
  const { vb, body } = KOBOYO_ICONS[name];
  const [vw, vh] = vb;
  // Each icon has its own viewBox, so the browser's xMidYMid meet fit renders one
  // user unit as size / max(vw, vh) pixels. Invert that ratio so the added weight
  // is the same on screen regardless of how big the source grid is.
  const strokeWidth = (FATTEN_PX * Math.max(vw, vh)) / size;
  const dim = cssSize ?? String(size);
  const a11y = label ? ` role="img" aria-label="${escapeAttr(label)}"` : hidden ? ' aria-hidden="true"' : '';
  const attrs = `width="${dim}" height="${dim}" viewBox="0 0 ${vw} ${vh}" fill="${color}" stroke="${color}" stroke-width="${strokeWidth.toFixed(3)}" stroke-linejoin="round"${cls ? ` class="${escapeAttr(cls)}"` : ''}${a11y}`;
  return `<svg ${attrs}>${body}</svg>`;
}
