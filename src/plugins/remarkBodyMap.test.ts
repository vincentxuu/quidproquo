import type { Root } from 'mdast';
import { describe, expect, it } from 'vitest';
import { BODY_PARTS } from '../data/bodyMap';
import { BODY_LABELS, JOINTS, parseBodyMap, remarkBodyMap, renderBodyMap } from './remarkBodyMap';

const ok = 'title: Heel hook\ndesc: 背面人體圖\nview: back\nwork: hamstring, gluteal\nstretch: adductors\ninjury: knee';

describe('body map spec', () => {
  it('parses roles, view and defaults', () => {
    expect(parseBodyMap(ok)).toMatchObject({
      title: 'Heel hook',
      view: 'back',
      lang: 'zh-TW',
      roles: { work: ['hamstring', 'gluteal'], stretch: ['adductors'], injury: ['knee'] },
    });
    expect(parseBodyMap('title: x\ndesc: y\nwork: forearm、hands').view).toBe('both');
  });

  it('fails the build on mistakes an author would not notice', () => {
    expect(() => parseBodyMap('desc: y\nwork: forearm')).toThrow(/title/);
    expect(() => parseBodyMap('title: x\nwork: forearm')).toThrow(/desc/);
    expect(() => parseBodyMap('title: x\ndesc: y')).toThrow(/at least one/);
    expect(() => parseBodyMap('title: x\ndesc: y\nwork: lats')).toThrow(/unknown part "lats"/);
    expect(() => parseBodyMap('title: x\ndesc: y\nwork: forearm\ninjury: forearm')).toThrow(/more than one role/);
    expect(() => parseBodyMap('title: x\ndesc: y\nview: front\nwork: hamstring')).toThrow(/not visible/);
    expect(() => parseBodyMap('title: x\ndesc: y\nview: side\nwork: forearm')).toThrow(/view/);
    expect(() => parseBodyMap('title: x\ndesc: y\ncolor: red\nwork: forearm')).toThrow(/unknown line/);
  });

  it('every label is drawable: a muscle region or a joint marker', () => {
    const regions = new Set(BODY_PARTS.map((p) => ({ knees: 'knee', ankles: 'ankle' })[p.slug] ?? p.slug));
    for (const name of Object.keys(BODY_LABELS)) expect(regions.has(name) || JOINTS[name], name).toBeTruthy();
  });
});

describe('body map render', () => {
  it('colours parts by role and draws joint markers only where no region exists', () => {
    const html = renderBodyMap(parseBodyMap(ok));
    expect(html).toContain('viewBox="724 60 724 1310"');
    expect(html.match(/bm-part--work/g)).toHaveLength(2);
    expect(html).toContain('bm-part--stretch');
    // 背面沒有膝蓋肌群塊，所以畫兩個關節點
    expect(html.match(/bm-joint--injury/g)).toHaveLength(2);
    expect(html).toContain('大腿後側（膕旁肌）、臀肌');
    expect(html).not.toMatch(/\s(?:fill|stroke|style)=/);
  });

  it('front knee is a region, not a marker', () => {
    const html = renderBodyMap(parseBodyMap('title: x\ndesc: y\nview: front\ninjury: knee'));
    expect(html).toContain('bm-part--injury');
    expect(html).not.toContain('bm-joint');
  });

  it('escapes author text and switches language', () => {
    const html = renderBodyMap(parseBodyMap('title: <b>x</b>\ndesc: "y"\nwork: forearm', 'en'));
    expect(html).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(html).toContain('Working');
    expect(html).toContain('>Front<');
  });

  it('replaces only ```body fences', () => {
    const tree = { type: 'root', children: [{ type: 'code', lang: 'body', value: ok }, { type: 'code', lang: 'js', value: 'x' }] } as unknown as Root;
    remarkBodyMap()(tree, { data: { astro: { frontmatter: { lang: 'zh-TW' } } } });
    expect(tree.children.map((n) => n.type)).toEqual(['html', 'code']);
  });
});
