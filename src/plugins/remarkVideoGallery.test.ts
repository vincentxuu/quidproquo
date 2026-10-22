import type { Root } from 'mdast';
import { describe, expect, it } from 'vitest';
import { parseVideoGalleryFence, renderVideoGallery, remarkVideoGallery } from './remarkVideoGallery';

describe('parseVideoGalleryFence', () => {
  it('resolves the key to the crag video list', () => {
    const spec = parseVideoGalleryFence('key: insubong\nlang: en');
    expect(spec.key).toBe('insubong');
    expect(spec.lang).toBe('en');
    expect(spec.videos.length).toBeGreaterThan(1);
  });

  it('rejects a missing key, an unknown key and a bad lang', () => {
    expect(() => parseVideoGalleryFence('lang: zh-TW')).toThrow(/key/);
    expect(() => parseVideoGalleryFence('key: nowhere\nlang: zh-TW')).toThrow(/unknown key/);
    expect(() => parseVideoGalleryFence('key: insubong\nlang: fr')).toThrow(/lang/);
  });
});

describe('renderVideoGallery', () => {
  const spec = parseVideoGalleryFence('key: insubong\nlang: zh-TW');
  const html = renderVideoGallery(spec);

  it('renders exactly one player, starting on the first embeddable clip', () => {
    expect(html.match(/<iframe/g)).toHaveLength(1);
    expect(html).toContain('data-video-gallery-player');
    expect(html).toContain('embed/HLiRmyV9aBc');
  });

  it('keeps embed-disabled clips out of the player', () => {
    expect(html).not.toContain('data-video-id="XQE74rkLVRs"');
    expect(html).not.toContain('data-video-id="MQrD0McDfqQ"');
  });

  it('renders one card per clip and keeps non-embeddable clips as links', () => {
    expect(html.match(/class="video-gallery__item"/g)).toHaveLength(spec.videos.length);
    expect(html).toContain('video-gallery__card--external');
    expect(html).toContain('MQrD0McDfqQ');
    expect(html).not.toContain('data-video-id="MQrD0McDfqQ"');
  });

  it('uses English labels on the English page', () => {
    const en = renderVideoGallery(parseVideoGalleryFence('key: insubong\nlang: en'));
    expect(en).toContain('Pigeon 5.7 A0 (west face)');
    expect(en).not.toContain('（西面）');
  });

  it('escapes markup in titles and labels', () => {
    const out = renderVideoGallery({
      key: 'synthetic',
      lang: 'zh-TW',
      videos: [
        { id: 'abcdefghijk', title: 'a "b" <c>', route: 'r', routeEn: 'r', note: 'n', noteEn: 'n', length: '1:00', channel: 'c' },
      ],
    });
    expect(out).toContain('a &quot;b&quot; &lt;c&gt;');
    expect(out).not.toContain('<c>');
  });
});


describe('route-specific video selection', () => {
  it('renders only the requested route clips in the requested order', () => {
    const spec = parseVideoGalleryFence('key: insubong\nlang: en\nids: HxdmcFZcFuU, 4UdmiJv42x8');
    expect(spec.videos.map(video => video.id)).toEqual(['HxdmcFZcFuU', '4UdmiJv42x8']);
    const html = renderVideoGallery(spec);
    expect(html).toContain('embed/HxdmcFZcFuU');
    expect(html).not.toContain('HLiRmyV9aBc');
  });

  it('rejects unknown, empty and repeated selections', () => {
    for (const ids of ['unknown', '', 'HLiRmyV9aBc, HLiRmyV9aBc']) {
      expect(() => parseVideoGalleryFence(`key: insubong\nlang: en\nids: ${ids}`)).toThrow(/ids/);
    }
  });
});

describe('route table layout', () => {
  it('rejects unknown layouts', () => {
    expect(() => parseVideoGalleryFence('key: insubong\nlang: en\nlayout: stacked')).toThrow(/layout/);
  });

  it('requires an immediately preceding table', () => {
    const tree = { type: 'root', children: [{ type: 'code', lang: 'video-gallery', value: 'key: insubong\nlang: en\nlayout: routes' }] };
    expect(() => remarkVideoGallery()(tree as Root)).toThrow(/preceding table/);
  });

  it('preserves route notes and maps ascent clips including external links without loading players', () => {
    const cell = (value: string) => ({ type: 'tableCell', children: [{ type: 'text', value }] });
    const row = (values: string[]) => ({ type: 'tableRow', children: values.map(cell) });
    const tree = { type: 'root', children: [
      { type: 'table', children: [row(['Route', 'Grade', 'Free grade', 'Length', 'Face', 'Notes']), row(['Pigeon / 비둘기', '5.7 A0', '5.7', '89 m', 'West', 'Preserve the aid-rating disagreement.']), row(['Insu A', '5.8', '5.8', '115 m', 'East', 'Guide only'])] },
      { type: 'code', lang: 'video-gallery', value: 'key: insubong\nlang: en\nlayout: routes' },
    ] };
    remarkVideoGallery()(tree as Root);
    expect(tree.children).toHaveLength(1);
    const html = (tree.children[0] as unknown as { value: string }).value;
    expect(html).toContain('Preserve the aid-rating disagreement.');
    expect(html).toContain('data-route-name="Pigeon"');
    expect(html).toContain('View videos (2)');
    expect(html).toContain('watch?v=XQE74rkLVRs');
    expect(html).toContain('data-src="https://www.youtube-nocookie.com/embed/HLiRmyV9aBc');
    expect(html).not.toMatch(/<iframe[^>]*\ssrc=/);
    expect(html).not.toContain('Id8LRtAsqlA');
    expect(html).toContain('<th scope="col">Videos</th>');
    expect(html).toContain('<td class="route-videos__video-cell" data-label="Videos">—</td>');
    expect(html).toContain('data-route-panel hidden');
    expect(html).toContain('class="route-videos__poster"');
    expect(html).toMatch(/<div class="route-videos__entry"><span class="route-videos__poster"><img[^>]*><\/span><button/);
    const routeButton = html.match(/<button[^>]*data-route-open[^>]*>[\s\S]*?<\/button>/)?.[0];
    expect(routeButton).toContain('View videos (2)');
    expect(routeButton).not.toContain('<img');
    expect(html).not.toContain('route-videos__play');
    expect(html).toContain('data-label="Notes"');
    expect(html).toContain('<noscript><a draggable="false" href="https://www.youtube.com/watch?v=HLiRmyV9aBc"');
  });
});


describe('route video playlist', () => {
  const spec = parseVideoGalleryFence('key: insubong\nlang: zh-TW\nlayout: routes');
  const html = renderVideoGallery(spec);

  it('uses native selection buttons and a vertical list without horizontal navigation', () => {
    expect(html).toContain('video-gallery--playlist');
    expect(html).toContain('<ul class="video-gallery__playlist" data-video-gallery-rail>');
    expect(html.match(/<button type="button" class="video-gallery__choice"/g)).toHaveLength(spec.videos.filter(video => video.embed !== false).length);
    expect(html).toContain('aria-current="true"');
    expect(html).not.toContain('data-video-gallery-prev');
    expect(html).not.toContain('data-video-gallery-next');
    expect(html).not.toContain('video-gallery__route');
  });

  it('makes external viewing a separate explicit action and retains every clip', () => {
    expect(spec.videos).toHaveLength(11);
    for (const video of spec.videos) expect(html).toContain(video.id);
    expect(html).toContain('<a class="video-gallery__external-row video-gallery__external-link"');
    expect(html).toContain('target="_blank" rel="noopener noreferrer"');
    expect(html).toContain('在 YouTube 觀看（另開分頁）');
    expect(html).not.toContain('僅外部連結');
    expect(html).not.toContain('video-gallery__card--external');
    const english = renderVideoGallery({ ...spec, lang: 'en' });
    expect(english).toContain('Watch on YouTube');
    for (const tag of html.match(/<(?:img|a)\b[^>]*>/g) ?? []) expect(tag).toContain('draggable="false"');
  });
});
