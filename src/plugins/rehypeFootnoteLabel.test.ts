import { describe, expect, it } from 'vitest';
import { rehypeFootnoteLabel, ZH_FOOTNOTE_LABEL } from './rehypeFootnoteLabel';

function footnoteSection() {
  return {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'section',
        properties: { dataFootnotes: true, className: ['footnotes'] },
        children: [
          { type: 'element', tagName: 'h2', properties: { id: 'footnote-label', className: ['sr-only'] }, children: [{ type: 'text', value: 'Footnotes' }] },
          {
            type: 'element',
            tagName: 'a',
            properties: { href: '#user-content-fnref-1', dataFootnoteBackref: '', ariaLabel: 'Back to reference 1' },
            children: [{ type: 'text', value: '↩' }],
          },
        ],
      },
    ],
  };
}

const file = (lang?: string) => ({ data: { astro: { frontmatter: lang ? { lang } : {} } } });

describe('rehypeFootnoteLabel', () => {
  it('rewrites the footnote heading and back-reference labels on zh-TW pages', () => {
    const tree = footnoteSection();
    rehypeFootnoteLabel()(tree, file());
    const section = tree.children[0];
    expect(section.children[0].children).toEqual([{ type: 'text', value: ZH_FOOTNOTE_LABEL }]);
    expect(section.children[1].properties.ariaLabel).toBe('回到引用處 1');
  });

  it('leaves en pages untouched', () => {
    const tree = footnoteSection();
    rehypeFootnoteLabel()(tree, file('en'));
    expect(tree.children[0].children[0].children).toEqual([{ type: 'text', value: 'Footnotes' }]);
    expect(tree.children[0].children[1].properties.ariaLabel).toBe('Back to reference 1');
  });
});
