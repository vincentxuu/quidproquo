import { readFileSync } from 'node:fs';
import type { Root } from 'mdast';
import { describe, expect, it } from 'vitest';
import { parseVideoPractice, renderVideoPractice, remarkVideoPractice } from './remarkVideoPractice';

const exercise = {
  title: 'Practice', videoId: 'MN9dGgmLyso', start: 91, end: 110,
  question: 'What would you check?', answer: 'A quality standard.',
  phrases: [{ term: 'quality standard', meaning: '品質標準', example: 'We need a quality standard.' }],
  prompt: 'Describe your own task.', modelAnswer: 'I check the result against a rubric.', lang: 'zh-TW' as const,
};

describe('video practice content safety', () => {
  it('fails on invalid JSON, timing, language or incomplete teaching fields', () => {
    expect(() => parseVideoPractice('not JSON')).toThrow(/JSON/);
    for (const patch of [{ end: 90 }, { start: -1 }, { lang: 'xx' }, { answer: '' }, { videoId: 'x" onclick=' }, { phrases: [{ term: 'x' }] }]) {
      expect(() => parseVideoPractice(JSON.stringify({ ...exercise, ...patch }))).toThrow(/video-practice/);
    }
  });
  it('escapes authored text and exposes answers through native disclosures', () => {
    const html = renderVideoPractice({ ...exercise, title: '<img onerror="alert(1)">', phrases: [{ term: '<script>', meaning: '"unsafe"', example: '<iframe>' }] });
    expect(html).not.toContain('<img');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;img');
    expect(html).toContain('<details>');
    expect(html).toContain('並非影片逐字稿');
    expect(html).toContain('data-practice-controls hidden');
    expect(html).toContain('data-practice-source');
  });
  it('renders an actionable workbench with its own bounded player and labelled answer fields', () => {
    const html = renderVideoPractice(exercise, 4);
    expect(html).toContain('data-practice-mode="read"');
    expect(html).toContain('data-practice-mode="practice" aria-pressed="false"');
    expect(html).toContain('data-youtube-loop-start="91" data-youtube-loop-end="110"');
    expect(html).toContain('youtube-nocookie.com/embed/MN9dGgmLyso');
    expect(html).not.toMatch(/&(?:amp;)?end=/);
    expect(html).toContain('<label for="video-practice-4-answer">');
    expect(html).toContain('<textarea id="video-practice-4-answer"');
    expect(html).toContain('<label for="video-practice-4-speaking">');
    expect(html).toContain('<textarea id="video-practice-4-speaking"');
    expect(html.match(/data-practice-done=/g)).toHaveLength(3);
    expect(html).toContain('<progress data-practice-progress-bar max="3" value="0"');
    expect(html).toContain('不會送出或自動評分');
    // Video and lookup remain outside the optional exercise disclosure.
    const optionalStart = html.indexOf('<details data-practice-exercises');
    expect(html.indexOf('<iframe')).toBeLessThan(optionalStart);
    expect(html.indexOf('video-practice__phrases')).toBeLessThan(optionalStart);
    expect(html.indexOf('<textarea')).toBeGreaterThan(optionalStart);
    expect(html).not.toContain('data-practice-workspace hidden');
    expect(html).not.toContain('data-practice-exercises open');
  });
  it('validates sentence ranges, bilingual text and chronological non-overlap', () => {
    const sentences = [{ start: 91, end: 95.5, en: 'Test sentence.', zh: '測試句子。' }, { start: 95.5, end: 110, en: 'Next.', zh: '下一句。' }];
    expect(parseVideoPractice(JSON.stringify({ ...exercise, sentences })).sentences).toEqual(sentences);
    for (const invalid of [null, [], [{}], [{ ...sentences[0], start: 90 }], [{ ...sentences[0], end: 111 }], [{ ...sentences[0], end: 91 }], [{ ...sentences[0], start: '91' }], [{ ...sentences[0], zh: '' }], [sentences[1], sentences[0]], [sentences[0], { ...sentences[1], start: 95 }]]) {
      expect(() => parseVideoPractice(JSON.stringify({ ...exercise, sentences: invalid }))).toThrow(/video-practice:/);
    }
  });
  it('renders selected bilingual replay buttons safely and omits the list when absent', () => {
    const html = renderVideoPractice({ ...exercise, sentences: [{ start: 91, end: 95, en: '<script>quoted text</script>', zh: '「翻譯」' }], captionNote: '字幕 <note>' });
    expect(html).toContain('data-practice-sentence data-start="91" data-end="95" aria-pressed="false"');
    expect(html).toContain('1:31–1:35');
    expect(html).toContain('字幕 &lt;note&gt;');
    expect(html).toContain('video-practice__media--bilingual');
    expect(html).toContain('data-practice-prev aria-label="上一句"');
    expect(html).toContain('data-practice-next aria-label="下一句"');
    expect(html).toContain('data-practice-sentence-index role="status" aria-live="polite"');
    expect(html).toContain('段落雙語字幕 · 1 句');
    expect(html).toContain('<ol tabindex="0" aria-label="可捲動的雙語句子">');
    expect(() => parseVideoPractice(JSON.stringify({ ...exercise, captionNote: 3 }))).toThrow(/captionNote/);
    expect(html).toContain('lang="en">&lt;script&gt;quoted text&lt;/script&gt;');
    expect(html).toContain('lang="zh-TW">「翻譯」');
    expect(html).toContain('點句子循環練習');
    expect(html).not.toContain('<script>');
    expect(renderVideoPractice(exercise)).not.toContain('data-practice-sentence');
  });
  it('validates complete clip coverage while accepting explicitly unavailable captions', () => {
    const clip = { title: 'First', start: 100, end: 110, sentences: [{ start: 100, end: 105, en: 'One.', zh: '一。' }, { start: 105, end: 110, en: 'Two.', zh: '二。' }] };
    expect(parseVideoPractice(JSON.stringify({ ...exercise, clips: [clip, { title: 'No captions', start: 200, end: 210, sentences: [] }] })).clips).toHaveLength(2);
    for (const clips of [[], [{ ...clip, title: '' }], [{ ...clip, end: 99 }], [{ ...clip, sentences: [{ ...clip.sentences[0], start: 101 }, clip.sentences[1]] }], [{ ...clip, sentences: [clip.sentences[0]] }], [{ ...clip, sentences: [clip.sentences[0], { ...clip.sentences[1], start: 106 }] }], [{ ...clip, sentences: [clip.sentences[0], { ...clip.sentences[1], start: 104 }] }]]) {
      expect(() => parseVideoPractice(JSON.stringify({ ...exercise, clips }))).toThrow(/video-practice:/);
    }
  });
  it('allows explicitly partial coverage without allowing out-of-bounds or overlapping rows', () => {
    const clip = { title: 'Partial', start: 100, end: 130, captionCoverage: 'partial' as const, sentences: [{ start: 102, end: 110, en: 'Existing quotation.', zh: '既有引句。' }, { start: 115, end: 120, en: 'Another quotation.', zh: '另一句。' }] };
    expect(parseVideoPractice(JSON.stringify({ ...exercise, clips: [clip] })).clips?.[0].captionCoverage).toBe('partial');
    const html = renderVideoPractice({ ...exercise, clips: [clip] });
    expect(html).toContain('data-practice-partial role="status"');
    expect(html).toContain('精選原音對照，非完整逐字稿');
    expect(html).toContain('精選句子對照 · 2 句');
    for (const bad of [{ ...clip, captionCoverage: 'unknown' }, { ...clip, sentences: [{ ...clip.sentences[0], start: 99 }] }, { ...clip, sentences: [{ ...clip.sentences[0], end: 131 }] }, { ...clip, sentences: [clip.sentences[0], { ...clip.sentences[1], start: 109 }] }]) {
      expect(() => parseVideoPractice(JSON.stringify({ ...exercise, clips: [bad] }))).toThrow(/video-practice:/);
    }
  });
  it('renders three selectors, one player and distinct caption panels with honest empty state', () => {
    const html = renderVideoPractice({ ...exercise, clips: [
      { title: '<First>', start: 100, end: 110, sentences: [{ start: 100, end: 110, en: 'One.', zh: '一。' }] },
      { title: 'Second', start: 200, end: 220, sentences: [] },
      { title: 'Third', start: 300, end: 330, sentences: [] },
    ] });
    expect(html.match(/data-practice-clip="/g)).toHaveLength(3);
    expect(html.match(/<iframe/g)).toHaveLength(1);
    expect(html).toContain('data-practice-clip="0" data-start="100" data-end="110" aria-pressed="true"');
    expect(html).toContain('data-practice-clip-panel="0" aria-label=');
    expect(html).toContain('data-practice-clip-panel="1" hidden');
    expect(html).toContain('data-practice-clip-panel="2" hidden');
    expect(html).toContain('&lt;First&gt;');
    expect(html).toContain('1:40–1:50 · 10 秒');
    expect(html).toContain('此片段尚無可用雙語字幕');
    expect(html).toContain('data-youtube-loop-start="100" data-youtube-loop-end="110"');
  });
  it('validates all clip teaching fields and renders authored lessons with or without captions', () => {
    const teaching = { goal: '辨認驗證動作', note: 'check against + 標準', prompt: '說說你如何驗證工作', example: 'I check <my work> against the requirements.' };
    const clip = { title: 'Lesson', start: 100, end: 110, sentences: [], teaching };
    expect(parseVideoPractice(JSON.stringify({ ...exercise, clips: [clip] })).clips?.[0].teaching).toEqual(teaching);
    for (const invalid of [null, [], 'text', {}, ...Object.keys(teaching).flatMap((key) => [{ ...teaching, [key]: '' }, { ...teaching, [key]: '  ' }, { ...teaching, [key]: 1 }])]) {
      expect(() => parseVideoPractice(JSON.stringify({ ...exercise, clips: [{ ...clip, teaching: invalid }] }))).toThrow(/teaching/);
    }
    const html = renderVideoPractice({ ...exercise, clips: [clip, { ...clip, start: 200, end: 210, sentences: [{ start: 200, end: 210, en: 'Source.', zh: '原音。' }] }] });
    expect(html.match(/class="video-practice__teaching"/g)).toHaveLength(2);
    expect(html).toContain('data-practice-clip-panel="1" hidden');
    expect(html).toContain('本段怎麼練');
    expect(html).not.toContain('<details class="video-practice__teaching" open');
    const secondPanel = html.slice(html.indexOf('data-practice-clip-panel="1"'));
    expect(secondPanel.indexOf('<ol')).toBeLessThan(secondPanel.indexOf('class="video-practice__teaching"'));
    expect(html).toContain('語言重點');
    expect(html).toContain('開口練習');
    expect(html).toContain('本站自擬例句（非原字幕）');
    expect(html).toContain('I check &lt;my work&gt; against the requirements.');
    expect(html).toContain('此片段尚無可用雙語字幕');
    expect(html).toContain('選片段 → 按「播放整段」→ 點對照句重播。');
    const english = renderVideoPractice({ ...exercise, lang: 'en', clips: [clip] });
    expect(english).toContain('Our example · not original captions');
  });
  it('places the exercise before long content at render time so hash links do not jump', () => {
    const tree: Root = { type: 'root', children: [
      { type: 'paragraph', children: [{ type: 'text', value: 'Start practice' }] },
      { type: 'heading', depth: 2, children: [{ type: 'text', value: 'Long article' }] },
      { type: 'code', lang: 'video-practice', value: JSON.stringify(exercise) },
    ] };
    remarkVideoPractice()(tree);
    expect(tree.children.map((node) => node.type)).toEqual(['paragraph', 'html', 'heading']);
  });
  it('replaces nested fences with uniquely labelled exercises and leaves other code alone', () => {
    const tree: Root = { type: 'root', children: [{ type: 'blockquote', children: [
      { type: 'code', lang: 'video-practice', value: JSON.stringify(exercise) },
      { type: 'code', lang: 'video-practice', value: JSON.stringify(exercise) },
      { type: 'code', lang: 'json', value: '{}' },
    ] }] };
    remarkVideoPractice()(tree);
    const children = (tree.children[0] as { children: { type: string; value: string }[] }).children;
    expect(children[0].value).toContain('aria-labelledby="video-practice-0"');
    expect(children[1].value).toContain('aria-labelledby="video-practice-1"');
    expect(children[2].type).toBe('code');
  });
});

// Delivery regression: a paragraph cannot silently shrink back to a one-line demo.
describe('published practice passage coverage', () => {
  for (const suffix of ['', '-en']) {
    it(`keeps the Dan Koe${suffix} clips usable without empty learning panels`, () => {
      const source = readFileSync(new URL(`../content/posts/career/2026-10-12-dan-koe-multiple-interests-ai-skill-stack${suffix}.md`, import.meta.url), 'utf8');
      const fence = source.match(/```video-practice\n([\s\S]*?)\n```/);
      expect(fence).not.toBeNull();
      const practice = parseVideoPractice(fence![1]);
      expect(practice.clips).toHaveLength(3);
      for (const clip of practice.clips!) {
        expect(clip.sentences.length).toBeGreaterThan(0);
        expect(clip.teaching).toBeDefined();
        expect(clip.captionCoverage).toBe('partial');
      }
    });
    it(`keeps the Poteto${suffix} passage continuous and substantial`, () => {
      const source = readFileSync(new URL(`../content/posts/ai/2026-10-07-poteto-trust-ladder-verification-first${suffix}.md`, import.meta.url), 'utf8');
      const fence = source.match(/```video-practice\n([\s\S]*?)\n```/);
      expect(fence).not.toBeNull();
      const passage = parseVideoPractice(fence![1]);
      expect(passage.clips?.map(({ start, end }) => [start, end])).toEqual([[1002.16, 1044.949], [1365.6, 1419.76], [2967.52, 3027.68]]);
      expect(passage.clips?.[0].captionCoverage).toBe('partial');
      const firstClip = passage.clips![0];
      const rows = firstClip.sentences;
      expect(rows.length).toBeGreaterThanOrEqual(3);
      expect(rows.at(-1)!.end - rows[0].start).toBeGreaterThanOrEqual(20);
      expect(rows[0].start).toBe(firstClip.start);
      expect(rows.at(-1)!.end).toBeLessThanOrEqual(firstClip.end);
      for (let index = 1; index < rows.length; index++) expect(rows[index].start).toBe(rows[index - 1].end);
      expect(rows.map((row) => row.en).join(' ').split(/\s+/).length).toBeGreaterThanOrEqual(50);
    });
  }
});

describe('complete bilingual source transcript', () => {
  const transcript = { note: '繁中為機器翻譯，尚未逐句人工校訂。', sentences: [
    { start: 0, end: 2.25, en: 'Opening.', zh: '開場。' },
    { start: 250.5, end: 253, en: 'Later in the video.', zh: '影片稍後的內容。' },
  ] };
  it('accepts full source timing independently of the initial practice excerpt', () => {
    expect(parseVideoPractice(JSON.stringify({ ...exercise, transcript })).transcript).toEqual(transcript);
  });
  it('rejects empty, malformed, non-bilingual and overlapping transcript data', () => {
    for (const invalid of [null, [], {}, { ...transcript, note: '' }, { ...transcript, sentences: [] },
      { ...transcript, sentences: [null] }, { ...transcript, sentences: [{ ...transcript.sentences[0], start: -1 }] },
      { ...transcript, sentences: [{ ...transcript.sentences[0], end: 0 }] },
      { ...transcript, sentences: [{ ...transcript.sentences[0], zh: ' ' }] },
      { ...transcript, sentences: [{ ...transcript.sentences[0], end: '2' }] },
      { ...transcript, sentences: [transcript.sentences[1], transcript.sentences[0]] },
      { ...transcript, sentences: [transcript.sentences[0], { ...transcript.sentences[1], start: 2 }] },
    ]) expect(() => parseVideoPractice(JSON.stringify({ ...exercise, transcript: invalid }))).toThrow(/video-practice:.*transcript/);
  });
  it('renders every full source row beside the preserved excerpt controls, with accessible replay buttons and provenance', () => {
    const html = renderVideoPractice({ ...exercise, transcript, clips: [{ title: 'Selected clip', start: 91, end: 110, captionCoverage: 'partial', sentences: [{ start: 92, end: 94, en: 'Excerpt.', zh: '節錄。' }] }] }, 7);
    expect(html).toContain('data-practice-transcript aria-labelledby="video-practice-7-transcript"');
    expect(html).toContain('全文字幕 · 2 段');
    expect(html).toContain(transcript.note);
    expect(html).toContain('data-practice-sentence data-start="0" data-end="2.25"');
    expect(html).toContain('data-practice-sentence data-start="250.5" data-end="253"');
    expect(html).toContain('aria-label="可捲動的完整中英字幕"');
    expect(html).toContain('data-practice-clip="0"');
    expect(html).not.toContain('data-practice-clip-panel');
    expect(html.match(/data-practice-sentence data-start=/g)).toHaveLength(2);
    expect(html).toContain('<div class="video-practice__caption-panels"><section');
    expect(html).toContain('data-full-start="0" data-full-end="253"');
    for (const mode of ['bilingual', 'en', 'zh', 'hidden']) expect(html).toContain(`value="${mode}"`);
    expect(html.match(/<iframe/g)).toHaveLength(1);
    const escaped = renderVideoPractice({ ...exercise, transcript: { note: '<unsafe>', sentences: [{ start: 0, end: 1, en: '<script>', zh: '<img>' }] } });
    expect(escaped).toContain('&lt;script&gt;');
    expect(escaped).toContain('&lt;unsafe&gt;');
    expect(escaped).not.toContain('<script>');
    expect(renderVideoPractice(exercise)).not.toContain('data-practice-transcript');
  });
});
