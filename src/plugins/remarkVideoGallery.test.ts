import { describe, expect, it } from 'vitest';
import { parseVideoGalleryFence, renderVideoGallery } from './remarkVideoGallery';

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
