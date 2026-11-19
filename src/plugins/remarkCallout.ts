import type { Blockquote, Paragraph, PhrasingContent, Root, RootContent } from 'mdast';

/**
 * Turns blockquotes into typed callouts by adding `callout callout-<kind>` classes.
 *
 * Two inputs are recognised:
 * 1. GitHub alert syntax: the first line of the blockquote is `[!WARNING]`, `[!CAUTION]`,
 *    `[!TIP]`, `[!NOTE]` or `[!IMPORTANT]`. The marker is removed and replaced by a localized
 *    title paragraph (`callout-title`), so the kind is not conveyed by colour alone.
 * 2. Existing posts: the first paragraph starts with bold text such as `**警告**`, `**Warning**`,
 *    `**Caution**` (warning), `**提示**`, `**Tip**`, `**小提醒**` (tip) or `**注意**`, `**Note**`
 *    (note: zh 注意 and en Note are the same box in translated pairs). The bold text already
 *    names the kind, so nothing is removed.
 *
 * Plain blockquotes stay untouched and get the default brand note style from CSS.
 * NOTE / IMPORTANT map to that same default note, with a `callout-note` class.
 */

export type CalloutKind = 'note' | 'tip' | 'warning';

const ALERT_KINDS: Record<string, CalloutKind> = {
  NOTE: 'note',
  IMPORTANT: 'note',
  TIP: 'tip',
  WARNING: 'warning',
  CAUTION: 'warning',
};

const ALERT_TITLES: Record<string, { 'zh-TW': string; en: string }> = {
  NOTE: { 'zh-TW': '說明', en: 'Note' },
  IMPORTANT: { 'zh-TW': '重要', en: 'Important' },
  TIP: { 'zh-TW': '提示', en: 'Tip' },
  WARNING: { 'zh-TW': '注意', en: 'Warning' },
  CAUTION: { 'zh-TW': '小心', en: 'Caution' },
};

// Bold lead words used in existing posts. Trailing full-width or ASCII colon is ignored.
const BOLD_KINDS: Record<string, CalloutKind> = {
  注意: 'note',
  note: 'note',
  警告: 'warning',
  warning: 'warning',
  caution: 'warning',
  提示: 'tip',
  小提醒: 'tip',
  tip: 'tip',
};

const ALERT_RE = /^\[!(NOTE|IMPORTANT|TIP|WARNING|CAUTION)\][ \t]*(?:\r?\n|$)/;

function plainText(nodes: PhrasingContent[]): string {
  return nodes.map((n) => ('value' in n ? n.value : 'children' in n ? plainText(n.children as PhrasingContent[]) : '')).join('');
}

function addClasses(node: Blockquote, kind: CalloutKind) {
  const data = (node.data ??= {});
  const props = (data.hProperties ??= {}) as Record<string, unknown>;
  const existing = props.className;
  const list = Array.isArray(existing) ? existing.map(String) : typeof existing === 'string' ? existing.split(/\s+/).filter(Boolean) : [];
  props.className = [...list, 'callout', `callout-${kind}`];
}

/** Detects the callout kind of a blockquote and rewrites GitHub alert markers in place. */
export function applyCallout(node: Blockquote, lang: 'zh-TW' | 'en'): CalloutKind | null {
  const first = node.children[0];
  if (!first || first.type !== 'paragraph') return null;
  const lead = first.children[0];

  if (lead?.type === 'text') {
    const match = ALERT_RE.exec(lead.value);
    if (match) {
      const marker = match[1];
      const kind = ALERT_KINDS[marker];
      lead.value = lead.value.slice(match[0].length);
      if (!lead.value) first.children.shift();
      // A soft line break right after the marker would leave a leading newline; drop it.
      const next = first.children[0];
      if (next?.type === 'break') first.children.shift();
      if (first.children.length === 0) node.children.shift();
      const title: Paragraph = {
        type: 'paragraph',
        data: { hProperties: { className: ['callout-title'] } },
        children: [{ type: 'strong', children: [{ type: 'text', value: ALERT_TITLES[marker][lang] }] }],
      };
      node.children.unshift(title);
      addClasses(node, kind);
      return kind;
    }
  }

  if (lead?.type === 'strong') {
    const label = plainText(lead.children).trim().replace(/[：:]\s*$/, '').trim().toLowerCase();
    const kind = BOLD_KINDS[label];
    if (kind) {
      addClasses(node, kind);
      return kind;
    }
  }
  return null;
}

type FileLike = { data?: { astro?: { frontmatter?: { lang?: string } } } };

export function remarkCallout() {
  return (tree: Root, file?: FileLike) => {
    const lang = file?.data?.astro?.frontmatter?.lang === 'en' ? 'en' : 'zh-TW';
    const walk = (nodes: RootContent[]) => {
      for (const node of nodes) {
        if (node.type === 'blockquote') applyCallout(node, lang);
        if ('children' in node) walk(node.children as RootContent[]);
      }
    };
    walk(tree.children);
  };
}
