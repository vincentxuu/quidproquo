import type { Root } from 'mdast';
import { describe, expect, it } from 'vitest';
import { parseDiagram, remarkDiagram, renderDiagram } from './remarkDiagram';

const svg = '<svg viewBox="0 0 400 200"><path class="dg-line" d="M10 10H100" marker-end="url(#arrow)" data-step="1"/><rect class="dg-box" x="100" y="0" width="80" height="40" data-step="2"/></svg>';
const body = (header: string, drawing = svg) => `${header}\n---\n${drawing}`;
const ok = 'title: 測試\ndesc: 兩個元件\nstep: 送出\nstep: 處理';

describe('diagram spec', () => {
  it('parses header, steps and viewBox', () => {
    const spec = parseDiagram(body(ok));
    expect(spec).toMatchObject({ title: '測試', width: 400, height: 200, steps: ['送出', '處理'], lang: 'zh-TW' });
  });

  it('fails the build on unsafe or off-system SVG', () => {
    for (const drawing of [
      '<svg viewBox="0 0 400 200"><script>alert(1)</script></svg>',
      '<svg viewBox="0 0 400 200"><rect fill="#ff0000"/></svg>',
      '<svg viewBox="0 0 400 200"><rect stroke="red"/></svg>',
      '<svg viewBox="0 0 400 200"><rect style="fill:red"/></svg>',
      '<svg viewBox="0 0 400 200"><text font-family="Comic Sans">x</text></svg>',
      '<svg viewBox="0 0 400 200"><a href="https://evil.example">x</a></svg>',
      '<svg viewBox="0 0 400 200"><rect onclick="x()"/></svg>',
      '<svg viewBox="0 0 1200 200"></svg>',
      '<svg width="400"></svg>',
    ]) {
      expect(() => parseDiagram(body('title: x\ndesc: y', drawing)), drawing).toThrow(/diagram/);
    }
    expect(() => parseDiagram(body('desc: y'))).toThrow(/title/);
    expect(() => parseDiagram(body('title: x'))).toThrow(/desc/);
    expect(() => parseDiagram(body('title: x\ndesc: y\nstep: only one'))).toThrow(/data-step 2/);
    expect(() => parseDiagram(body('title: x\ndesc: y\nstep: a\nstep: b\nstep: c'))).toThrow(/step 3/);
    expect(() => parseDiagram(svg)).toThrow(/---/);
    expect(parseDiagram(body('title: x\ndesc: y', '<svg viewBox="0 0 400 200"><rect class="dg-box" fill="none"/></svg>')).steps).toEqual([]);
  });

  it('adds accessible names, shares markers once per page and prefixes other ids', () => {
    const first = renderDiagram(parseDiagram(body(ok, '<svg viewBox="0 0 400 200"><defs><pattern id="dots"/></defs><rect fill="url(#dots)"/><path class="dg-line" marker-end="url(#arrow-accent)" data-step="1 2"/></svg>')), 0);
    expect(first).toContain('role="img" aria-labelledby="diagram-0-title diagram-0-desc"');
    expect(first).toContain('<title id="diagram-0-title">測試</title>');
    expect(first).toContain('id="dg-arrow-active"');
    expect(first).toContain('url(#dg-arrow-accent)');
    expect(first).toContain('id="dg0-dots"');
    expect(first).toContain('url(#dg0-dots)');
    expect(first).toContain('data-flow-total="2"');
    const second = renderDiagram(parseDiagram(body('title: <b>\ndesc: y', '<svg viewBox="0 0 400 200"><rect class="dg-box"/></svg>')), 1);
    expect(second).not.toContain('<marker');
    expect(second).not.toContain('data-flow-total');
    expect(second).toContain('&lt;b&gt;');
  });

  it('takes the post language from frontmatter', () => {
    const tree = { type: 'root', children: [{ type: 'code', lang: 'diagram', value: body(ok) }] } as unknown as Root;
    remarkDiagram()(tree, { data: { astro: { frontmatter: { lang: 'en' } } } });
    expect((tree.children[0] as unknown as { value: string }).value).toContain('All 2 steps');
  });
});
