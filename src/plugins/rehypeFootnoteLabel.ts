/**
 * Localizes the GFM footnote section on zh-TW pages.
 *
 * remark-rehype emits `<h2 id="footnote-label">Footnotes</h2>` and back-reference links with
 * `aria-label="Back to reference N"` for every page, regardless of language. This plugin reads the
 * page language from frontmatter (`file.data.astro.frontmatter.lang`, default zh-TW) and rewrites
 * both for zh-TW. English pages are left as is.
 *
 * It must run as a rehype plugin: Astro collects headings (for the TOC) after user rehype plugins,
 * so the TOC picks up the localized label.
 */

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

type FileLike = { data?: { astro?: { frontmatter?: { lang?: string } } } };

export const ZH_FOOTNOTE_LABEL = '註腳';

function isBackref(node: HastNode): boolean {
  const p = node.properties ?? {};
  return node.tagName === 'a' && (p.dataFootnoteBackref !== undefined || p['data-footnote-backref'] !== undefined);
}

export function rehypeFootnoteLabel() {
  return (tree: HastNode, file?: FileLike) => {
    if (file?.data?.astro?.frontmatter?.lang === 'en') return;
    const visit = (node: HastNode) => {
      if (node.type === 'element') {
        if (node.properties?.id === 'footnote-label') {
          node.children = [{ type: 'text', value: ZH_FOOTNOTE_LABEL }];
        } else if (isBackref(node)) {
          const label = node.properties?.ariaLabel;
          if (typeof label === 'string') {
            const n = /(\d+(?:-\d+)?)\s*$/.exec(label)?.[1];
            node.properties!.ariaLabel = n ? `回到引用處 ${n}` : '回到引用處';
          }
        }
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
