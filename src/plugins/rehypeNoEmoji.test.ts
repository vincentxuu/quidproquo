import { describe, expect, it } from 'vitest';
import { renderIconUse } from '../components/icons/render';
import { emojiToSource, rehypeNoEmoji, stripEmojiText } from './rehypeNoEmoji';

type Node = { type: string; tagName?: string; value?: string; properties?: Record<string, unknown>; children?: Node[] };

const text = (value: string): Node => ({ type: 'text', value });
const el = (tagName: string, children: Node[], properties: Record<string, unknown> = {}): Node => ({ type: 'element', tagName, properties, children });
type File = { data: { astro: { frontmatter: Record<string, unknown> } } };
let lastFile: File;
const run = (children: Node[], lang?: string) => {
  const tree: Node = { type: 'root', children };
  lastFile = { data: { astro: { frontmatter: lang ? { lang } : {} } } };
  rehypeNoEmoji()(tree, lastFile);
  return tree;
};
const textOf = (node: Node): string =>
  node.type === 'text' ? node.value ?? '' : (node.children ?? []).map(textOf).join('');
const raws = (node: Node): string[] =>
  node.type === 'raw' ? [node.value ?? ''] : (node.children ?? []).flatMap(raws);

describe('rehypeNoEmoji', () => {
  it('puts the language-pill globe inside the link so the paragraph keeps a single element child', () => {
    const tree = run([el('blockquote', [el('p', [text('🌏 '), el('a', [text('English version')], { href: '/en' })])])]);
    const p = tree.children![0].children![0];
    expect(p.children).toHaveLength(1);
    const a = p.children![0];
    expect(a.tagName).toBe('a');
    expect(a.children![0].type).toBe('raw');
    expect(a.children![0].value).toContain('class="inline-icon"');
    expect(a.children![0].value).toContain('aria-hidden="true"');
    expect(textOf(a)).toBe(' English version');
  });

  it('leaves a list icon outside the link when the paragraph has other content', () => {
    const tree = run([el('p', [text('📄 '), el('a', [text('Digest')]), text(' 補充')])]);
    expect(tree.children![0].children![0].type).toBe('raw');
    expect(tree.children![0].children![1]).toEqual(text(' '));
  });

  it('lists each used icon once in remarkPluginFrontmatter and adds no sprite to the tree', () => {
    const tree = run([el('p', [text('✅ ✅ ❌')]), el('td', [text('★★☆')])]);
    expect(lastFile.data.astro.frontmatter.inlineIcons).toEqual(['check', 'star', 'star-solid', 'x']);
    expect(tree.children).toHaveLength(2);
  });

  it('leaves the frontmatter alone on a page without icons', () => {
    run([el('p', [text('no icons here')])]);
    expect(lastFile.data.astro.frontmatter.inlineIcons).toBeUndefined();
  });

  it('emits tiny <use> references to the shared sprite', () => {
    const tree = run([el('li', [text('📄 '), el('a', [text('Digest')])])]);
    expect(raws(tree)[0]).toBe(renderIconUse('file-text', { class: 'inline-icon', hidden: true }));
  });

  it('labels status marks for screen readers in the page language', () => {
    const zh = raws(run([el('td', [text('✅')]), el('td', [text('❌')]), el('p', [text('⚠\uFE0F 版本提醒')])]));
    expect(zh[0]).toContain('role="img" aria-label="是"');
    expect(zh[1]).toContain('aria-label="否"');
    expect(zh[2]).toContain('aria-label="注意"');
    const en = raws(run([el('td', [text('✔')]), el('td', [text('✖')])], 'en'));
    expect(en[0]).toContain('aria-label="Yes"');
    expect(en[1]).toContain('aria-label="No"');
  });

  it('draws the text marks ✓ ✗ as the same check / x icons as ✅ ❌', () => {
    const zh = raws(run([el('td', [text('✓')]), el('td', [text('✗')])]));
    expect(zh[0]).toContain('aria-label="是"');
    expect(zh[1]).toContain('aria-label="否"');
  });

  it('keeps text symbols that are not emoji', () => {
    const tree = run([el('p', [text('☐ ↔ ™\uFE0F')])]);
    expect(raws(tree)).toEqual([]);
    expect(textOf(tree)).toBe('☐ ↔ ™');
  });

  it('renders shortcodes exactly like the emoji they name', () => {
    const fromEmoji = raws(run([el('p', [text('🌏 ⚠\uFE0F 🔴')])]));
    const fromCode = raws(run([el('p', [text(':globe: :warning: :red-circle:')])]));
    expect(fromCode).toEqual(fromEmoji);
    expect(textOf(run([el('p', [text(':not-a-code: 12:30:00')])]))).toBe(':not-a-code: 12:30:00');
  });
});

describe('rehypeNoEmoji stars', () => {
  const solid = renderIconUse('star-solid', { class: 'inline-icon', hidden: true });
  const outline = renderIconUse('star', { class: 'inline-icon', hidden: true });

  it('turns a rating run into one labelled group of hidden star icons', () => {
    const [html] = raws(run([el('td', [text('★★☆')])]));
    expect(html).toBe(`<span class="star-rating" role="img" aria-label="2 / 3">${solid}${solid}${outline}</span>`);
    const [en] = raws(run([el('p', [text('rated ★★☆ overall')])], 'en'));
    expect(en).toContain('aria-label="2 out of 3"');
  });

  it('labels all-filled runs and half stars by count, without inventing a maximum', () => {
    expect(raws(run([el('p', [text('經典 ★★★。')])]))[0]).toContain('aria-label="3 星"');
    expect(raws(run([el('p', [text('classic (★★½)')])], 'en'))[0]).toContain('aria-label="2.5 stars"');
    expect(raws(run([el('p', [text('theCrag ★, 4 bolts')])], 'en'))[0]).toContain('aria-label="1 star"');
  });

  it('treats a lone ★ that opens a table cell as a one-star rating, but not a ★ that opens a sentence', () => {
    expect(raws(run([el('td', [text('★')])]))[0]).toContain('class="star-rating"');
    expect(raws(run([el('td', [text('★; all bolts')])]))[0]).toContain('aria-label="1 星"');
    expect(raws(run([el('td', [text('★ The one nobody thought of')])]))[0]).toBe(solid);
  });

  it('labels stars used as a count', () => {
    const label = renderIconUse('star-solid', { class: 'inline-icon', label: '星' });
    expect(raws(run([el('p', [text('23.2k★')])]))[0]).toBe(label);
    expect(raws(run([el('p', [text('⭐ 104,523')])]))[0]).toBe(label);
    expect(raws(run([el('th', [text('★')])]))[0]).toBe(label);
  });

  it('draws marker stars and a lone ☆ as hidden icons', () => {
    expect(raws(run([el('li', [text('★ 人類看得懂嗎')])]))).toEqual([solid]);
    const tree = run([el('p', [text('スター☆トレック')])]);
    expect(raws(tree)).toEqual([outline]);
    expect(textOf(tree)).toBe('スタートレック');
  });

  it('leaves stars in code alone', () => {
    const tree = run([el('pre', [el('code', [text('★★☆')])])]);
    expect(raws(tree)).toEqual([]);
  });

  it('maps ranks, keycaps and arrows to text', () => {
    expect(textOf(run([el('td', [text('70.8%（🥇）')])]))).toBe('70.8%（1）');
    expect(textOf(run([el('p', [text('1\uFE0F\u20E3 one ⬆\uFE0F up')])]))).toBe('1 one ↑ up');
  });

  it('draws colored dots as small filled shapes that keep status hues', () => {
    const [red, purple] = raws(run([el('p', [text('🔴 High、🟣 Pre-existing')])]));
    expect(red).toContain('<circle');
    expect(red).toContain('fill="var(--danger)"');
    expect(purple).toContain('fill="currentColor"');
  });

  it('drops emoji with no icon together with the following space', () => {
    expect(textOf(run([el('h3', [text('🆕 建議加入')])]))).toBe('建議加入');
    expect(textOf(run([el('p', [text('a 🐙 b')])]))).toBe('a b');
    expect(textOf(run([el('p', [text('주먹 쥐고👊 일어서')])]))).toBe('주먹 쥐고 일어서');
  });

  it('keeps a cell from going blank and handles bracketed emoji', () => {
    expect(textOf(run([el('td', [text('🐙')])]))).toBe('•');
    expect(textOf(run([el('td', [text('未進前 10（🆕）')])]))).toBe('未進前 10（NEW）');
    expect(textOf(run([el('p', [text('x（🐙）y')])]))).toBe('xy');
  });

  it('leaves code, pre and kbd untouched', () => {
    const tree = run([el('pre', [el('code', [text('✅ 🌏')])]), el('p', [el('code', [text('⭐')]), el('kbd', [text('⌘')])])]);
    expect(textOf(tree)).toBe('✅ 🌏⭐⌘');
    expect(raws(tree)).toEqual([]);
  });

  it('is a no-op on text without emoji', () => {
    const node = text('沒有 emoji 的段落 → 箭頭照留');
    const tree = run([el('p', [node])]);
    expect(tree.children![0].children![0]).toBe(node);
  });
});

describe('stripEmojiText', () => {
  it('maps status marks to text symbols and drops the rest', () => {
    expect(stripEmojiText('✅ 支援 ❌ 不支援')).toBe('✓ 支援 ✗ 不支援');
    expect(stripEmojiText('**repo**（⭐ 104,523）')).toBe('**repo**（★ 104,523）');
    expect(stripEmojiText('⚠\uFE0F 版本提醒')).toBe('⚠\uFE0E 版本提醒');
    expect(stripEmojiText('SHUN 🇯🇵')).toBe('SHUN');
    expect(stripEmojiText('📄 Digest')).toBe('Digest');
  });
});

describe('emojiToSource', () => {
  it('writes each emoji as what renders the same without one', () => {
    expect(emojiToSource('> 🌏 [English version](/x)').text).toBe('> :globe: [English version](/x)');
    expect(emojiToSource('✅ 支援 ❌ 不支援 ✓').text).toBe('✓ 支援 ✗ 不支援 ✓');
    expect(emojiToSource('⭐⭐⭐ 🥇 1️⃣ 🔴').text).toBe('★★★ 1 1 :red-circle:');
    expect(emojiToSource('🚀 發布（🆕）').text).toBe('發布（NEW）');
  });
});
