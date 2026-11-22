import type { Blockquote, Paragraph, Root } from 'mdast';
import { describe, expect, it } from 'vitest';
import { remarkCallout } from './remarkCallout';

const text = (value: string) => ({ type: 'text' as const, value });
const strong = (value: string) => ({ type: 'strong' as const, children: [text(value)] });
const para = (...children: Paragraph['children']): Paragraph => ({ type: 'paragraph', children });
const quote = (...children: Blockquote['children']): Blockquote => ({ type: 'blockquote', children });

function run(node: Blockquote, lang?: string): Blockquote {
  const tree: Root = { type: 'root', children: [node] };
  remarkCallout()(tree, { data: { astro: { frontmatter: lang ? { lang } : {} } } });
  return tree.children[0] as Blockquote;
}

const classes = (node: Blockquote) => (node.data?.hProperties as { className?: string[] } | undefined)?.className;

describe('remarkCallout', () => {
  it('maps GitHub alert markers to a kind, strips the marker and adds a localized title', () => {
    const out = run(quote(para(text('[!WARNING]\n價格會變動。'))));
    expect(classes(out)).toEqual(['callout', 'callout-warning']);
    expect(out.children).toHaveLength(2);
    expect(out.children[0]).toMatchObject({ data: { hProperties: { className: ['callout-title'] } }, children: [strong('注意')] });
    expect(out.children[1]).toMatchObject({ children: [text('價格會變動。')] });
  });

  it('uses English titles on en pages and maps CAUTION/TIP/NOTE/IMPORTANT', () => {
    expect(classes(run(quote(para(text('[!CAUTION]\nx'))), 'en'))).toEqual(['callout', 'callout-warning']);
    expect(classes(run(quote(para(text('[!TIP]\nx')))))).toEqual(['callout', 'callout-tip']);
    expect(classes(run(quote(para(text('[!NOTE]\nx')))))).toEqual(['callout', 'callout-note']);
    const important = run(quote(para(text('[!IMPORTANT]\nx'))), 'en');
    expect(classes(important)).toEqual(['callout', 'callout-note']);
    expect(important.children[0]).toMatchObject({ children: [strong('Important')] });
  });

  it('drops the marker paragraph when the body starts in the next paragraph', () => {
    const out = run(quote(para(text('[!TIP]')), para(text('body'))));
    expect(out.children).toHaveLength(2);
    expect(out.children[1]).toMatchObject({ children: [text('body')] });
  });

  it('recognises bold lead words used in existing posts, with or without a colon', () => {
    for (const label of ['警告', '警告：', 'Warning', 'Caution:']) {
      expect(classes(run(quote(para(strong(label), text(' x'))))), label).toEqual(['callout', 'callout-warning']);
    }
    for (const label of ['提示', 'Tip', '小提醒：']) {
      expect(classes(run(quote(para(strong(label), text(' x'))))), label).toEqual(['callout', 'callout-tip']);
    }
    // zh 注意 and en Note are the default note box (translated pairs must match).
    for (const label of ['注意', '注意：', 'Note', 'Note:']) {
      expect(classes(run(quote(para(strong(label), text(' x'))))), label).toEqual(['callout', 'callout-note']);
    }
    // Bold text must match exactly; it stays a lead word, nothing is removed.
    const out = run(quote(para(strong('警告'), text('：x'))));
    expect(out.children[0]).toMatchObject({ children: [strong('警告'), text('：x')] });
  });

  it('leaves other blockquotes alone', () => {
    for (const node of [
      quote(para(text('plain'))),
      quote(para(strong('注意符號方向。'), text(' x'))),
      quote(para({ type: 'link', url: '/en', children: [text('English version')] })),
      quote(para(text('mid [!WARNING] marker'))),
    ]) {
      expect(classes(run(node))).toBeUndefined();
    }
  });
});
