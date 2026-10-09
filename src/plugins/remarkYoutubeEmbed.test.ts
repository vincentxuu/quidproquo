import { describe, expect, it } from 'vitest';
import { extractVideoId, parseYoutubeBlock, remarkYoutubeEmbed, renderYoutubeEmbed } from './remarkYoutubeEmbed';

describe('extractVideoId', () => {
  it.each([
    'https://www.youtube.com/watch?v=MN9dGgmLyso',
    'https://youtu.be/MN9dGgmLyso?t=91',
    'https://www.youtube.com/live/MN9dGgmLyso',
    'https://www.youtube-nocookie.com/embed/MN9dGgmLyso',
  ])('reads the id from %s', (url) => {
    expect(extractVideoId(url)).toBe('MN9dGgmLyso');
  });

  it('rejects non-YouTube hosts and malformed ids', () => {
    expect(extractVideoId('https://example.com/watch?v=MN9dGgmLyso')).toBeNull();
    expect(extractVideoId('https://www.youtube.com/watch?v=short')).toBeNull();
    expect(extractVideoId('not a url')).toBeNull();
  });
});

describe('parseYoutubeBlock', () => {
  it('parses url, title and start', () => {
    expect(parseYoutubeBlock('url: https://youtu.be/MN9dGgmLyso\ntitle: 直播\nstart: 91')).toEqual({
      id: 'MN9dGgmLyso',
      title: '直播',
      start: 91,
    });
  });

  it('throws on missing url, missing title, or bad start', () => {
    expect(() => parseYoutubeBlock('title: x')).toThrow(/url/);
    expect(() => parseYoutubeBlock('url: https://youtu.be/MN9dGgmLyso')).toThrow(/title/);
    expect(() => parseYoutubeBlock('url: https://youtu.be/MN9dGgmLyso\ntitle: x\nstart: 1:31')).toThrow(/start/);
  });
});

describe('renderYoutubeEmbed', () => {
  it('uses the no-cookie domain, lazy loading and an escaped title', () => {
    const html = renderYoutubeEmbed({ id: 'MN9dGgmLyso', title: 'A "quoted" <b>', start: 91 });

    expect(html).toContain('src="https://www.youtube-nocookie.com/embed/MN9dGgmLyso?start=91"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('title="A &quot;quoted&quot; &lt;b&gt;"');
    expect(html).toContain('href="https://www.youtube.com/watch?v=MN9dGgmLyso&amp;t=91s"');
  });
});

describe('remarkYoutubeEmbed', () => {
  it('replaces youtube code nodes and leaves other fences alone', () => {
    const tree = {
      type: 'root',
      children: [
        { type: 'code', lang: 'youtube', value: 'url: https://youtu.be/MN9dGgmLyso\ntitle: 直播' },
        { type: 'code', lang: 'mermaid', value: 'flowchart TD' },
      ],
    };

    remarkYoutubeEmbed()(tree as never);

    expect(tree.children[0].type).toBe('html');
    expect(tree.children[1].type).toBe('code');
  });
});
