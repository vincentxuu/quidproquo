import { describe, expect, it } from 'vitest';
import type { Post } from './content';
import {
  findSeriesSlugConflicts,
  getSeriesHref,
  getSeriesMeta,
  getSeriesMetaBySlug,
  getSeriesSummaries,
  SERIES_CATEGORIES,
  validateSeriesDefinitions,
} from './series';
import { getSeriesNavs } from './seriesNav';

const STANFORD_SERIES = [
  ['stanford-cs', 'Stanford CS 主線課程導讀', "Reading Stanford's Main-Line CS Courses"],
  ['stanford-cs103', 'Stanford CS103 導讀', 'Reading Stanford CS103'],
  ['stanford-cs107', 'Stanford CS107 導讀', 'Reading Stanford CS107'],
  ['stanford-cs109', 'Stanford CS109 導讀', 'Reading Stanford CS109'],
  ['stanford-cs111', 'Stanford CS111 導讀', 'Reading Stanford CS111'],
  ['stanford-cs161', 'Stanford CS161 導讀', 'Reading Stanford CS161'],
  ['stanford-cs221', 'Stanford CS221 導讀', 'Reading Stanford CS221'],
  ['stanford-cs229', 'Stanford CS229 導讀', 'Reading Stanford CS229'],
  ['cs230', 'Stanford CS230 導讀', 'Reading Stanford CS230'],
  ['stanford-cs336', 'Stanford CS336 導讀', 'Reading Stanford CS336'],
  ['stanford-cs124', 'Stanford CS124 導讀', 'Reading Stanford CS124'],
  ['stanford-cs228', 'Stanford CS228 導讀', 'Reading Stanford CS228'],
  ['stanford-cs224n', 'Stanford CS224N 導讀', 'Reading Stanford CS224N'],
  ['stanford-cs224u', 'Stanford CS224U 導讀', 'Reading Stanford CS224U'],
  ['stanford-cs224v', 'Stanford CS224V 導讀', 'Reading Stanford CS224V'],
  ['stanford-cs224w', 'Stanford CS224W 導讀', 'Reading Stanford CS224W'],
  ['stanford-cs329z', 'Stanford CS329Z 導讀', 'Reading Stanford CS329Z'],
  ['stanford-cs329a', 'Stanford CS329A 導讀', 'Reading Stanford CS329A'],
  ['cs146s', 'CS146S：AI 原生開發十週', 'CS146S: Ten Weeks of AI-Native Development'],
] as const;

function post(
  id: string,
  lang: 'zh-TW' | 'en',
  series: { name: string; order: number },
  additionalSeries: { name: string; order: number }[] = [],
  date = '2026-01-01',
): Post {
  return {
    id,
    collection: 'posts',
    body: '',
    data: {
      title: id,
      date: new Date(date),
      category: 'learning',
      tags: [],
      lang,
      draft: false,
      series,
      additionalSeries,
    },
  } as unknown as Post;
}

describe('Stanford course series registry', () => {
  it('keeps every production slug and localized name globally unique', () => {
    expect(validateSeriesDefinitions()).toEqual([]);
  });

  it('rejects duplicate slugs and names across different series', () => {
    expect(validateSeriesDefinitions([
      { slug: 'first', names: { 'zh-TW': '第一個系列', en: 'First series' } },
      { slug: 'first', names: { 'zh-TW': '第二個系列', en: 'Second series' } },
      { slug: 'third', names: { 'zh-TW': '第三個系列', en: 'First series' } },
    ])).toEqual([
      'Duplicate series slug: first',
      'Duplicate series name: First series',
    ]);
  });

  it('allows one series to use the same name in both languages', () => {
    expect(validateSeriesDefinitions([
      { slug: 'same-name', names: { 'zh-TW': 'Same Name', en: 'Same Name' } },
    ])).toEqual([]);
  });

  it('does not lose duplicate names when the first slug is an empty string', () => {
    expect(validateSeriesDefinitions([
      { slug: '', names: { 'zh-TW': '共用名稱', en: 'Empty slug' } },
      { slug: 'second', names: { 'zh-TW': '共用名稱', en: 'Second series' } },
    ])).toContain('Duplicate series name: 共用名稱');
  });

  it.each(STANFORD_SERIES)('maps %s across both languages', (slug, zhName, enName) => {
    expect(getSeriesMeta(zhName).slug).toBe(slug);
    expect(getSeriesMeta(enName).slug).toBe(slug);
    expect(getSeriesMetaBySlug(slug)?.names).toEqual({ 'zh-TW': zhName, en: enName });
    expect(getSeriesHref(zhName, 'zh-TW')).toBe(`/series/${slug}`);
    expect(getSeriesHref(enName, 'en')).toBe(`/en/series/${slug}`);
  });

  it('registers 品味修煉 with one stable cross-language slug', () => {
    expect(getSeriesMeta('品味修煉').slug).toBe('taste-cultivation');
    expect(getSeriesMeta('Cultivating Taste').slug).toBe('taste-cultivation');
    expect(getSeriesMetaBySlug('taste-cultivation')?.names).toEqual({
      'zh-TW': '品味修煉',
      en: 'Cultivating Taste',
    });
    expect(getSeriesHref('品味修煉', 'zh-TW')).toBe('/series/taste-cultivation');
    expect(getSeriesHref('Cultivating Taste', 'en')).toBe('/en/series/taste-cultivation');
  });

  it('keeps an unregistered Chinese fallback slug decoded for Astro', () => {
    const name = '尚未登錄系列';
    const summary = getSeriesSummaries([
      post('learning/unregistered-series', 'zh-TW', { name, order: 1 }),
    ], 'zh-TW', new Date('2026-08-22'))[0];

    expect(getSeriesMeta(name).slug).toBe(name);
    expect(summary.slug).toBe(name);
    expect(getSeriesHref(name, 'zh-TW')).toBe(`/series/${name}`);
    expect(encodeURI(getSeriesHref(name, 'zh-TW')))
      .toBe(`/series/${encodeURIComponent(name)}`);
  });

  it('merges posts that name the same series in either language into one summary', () => {
    const summaries = getSeriesSummaries([
      post('tech/model-family-claude-en', 'en', { name: 'AI Model Families', order: 1 }),
      post('tech/model-family-deepseek-en', 'en', { name: 'AI 模型家族', order: 2 }),
    ], 'en', new Date('2026-08-22'));

    expect(summaries).toHaveLength(1);
    expect(summaries[0]).toMatchObject({ slug: 'ai', name: 'AI Model Families', count: 2 });
  });

  it('keeps previously colliding series on their own registered slugs', () => {
    expect(getSeriesMeta('AI 模型家族').slug).toBe('ai');
    expect(getSeriesMeta('AI 搜尋正在重寫內容生意').slug).toBe('ai-search-content-business');
    expect(getSeriesMeta('AI Agent 記憶工程').slug).toBe('ai-agent-memory');
    expect(getSeriesMeta('AI Agent 週回顧').slug).toBe('ai-agent-weekly-review');
    expect(getSeriesMeta('AI Agent Weekly Review').slug).toBe('ai-agent-weekly-review');
  });

  it('rejects unregistered series whose fallback slug collides or drops non-ASCII text', () => {
    expect(findSeriesSlugConflicts(['純中文新系列'])).toEqual([]);
    expect(findSeriesSlugConflicts(['brand new series'])).toEqual([]);
    expect(findSeriesSlugConflicts(['AI 新系列'])).toEqual([
      'Series "AI 新系列" mixes ASCII and non-ASCII text; register it in SERIES_DEFINITIONS (fallback slug would be "ai")',
      'Unregistered series "AI 新系列" falls back to slug "ai", which a registered series already owns',
    ]);
    expect(findSeriesSlugConflicts(['Foo Bar', 'foo-bar'])).toEqual([
      'Unregistered series "foo-bar" and "Foo Bar" both fall back to slug "foo-bar"',
    ]);
    expect(() => getSeriesSummaries([
      post('learning/mixed', 'zh-TW', { name: 'AI 新系列', order: 1 }),
    ], 'zh-TW', new Date('2026-08-22'))).toThrow('Series slug conflicts');
  });

  it('links series navigation across posts that spell the series name differently', () => {
    const first = post('tech/model-family-claude-en', 'en', { name: 'AI Model Families', order: 1 });
    const second = post('tech/model-family-deepseek-en', 'en', { name: 'AI 模型家族', order: 2 });
    const [nav] = getSeriesNavs(second, [first, second]);

    expect(nav.total).toBe(2);
    expect(nav.prev?.slug).toBe(first.id);
  });

  it('keeps the umbrella series limited to representative memberships', () => {
    const guide = post(
      'learning/stanford-cs161-guide',
      'zh-TW',
      { name: 'Stanford CS161 導讀', order: 1 },
      [{ name: 'Stanford CS 主線課程導讀', order: 6 }],
    );
    const lecture = post(
      'learning/stanford-cs161-lecture-01',
      'zh-TW',
      { name: 'Stanford CS161 導讀', order: 2 },
    );

    const summaries = getSeriesSummaries([guide, lecture], 'zh-TW', new Date('2026-08-21'));
    expect(summaries.find(item => item.slug === 'stanford-cs')?.posts.map(item => item.id))
      .toEqual([guide.id]);
    expect(summaries.find(item => item.slug === 'stanford-cs161')?.posts.map(item => item.id))
      .toEqual([guide.id, lecture.id]);
  });

  it('sorts series summaries by the newest member date, not the final reading order', () => {
    const newestFirst = post(
      'learning/newest-first',
      'zh-TW',
      { name: 'Stanford CS161 導讀', order: 1 },
      [],
      '2026-08-20',
    );
    const olderLast = post(
      'learning/older-last',
      'zh-TW',
      { name: 'Stanford CS161 導讀', order: 2 },
      [],
      '2026-08-01',
    );
    const middleDate = post(
      'learning/middle-date',
      'zh-TW',
      { name: 'Stanford CS103 導讀', order: 1 },
      [],
      '2026-08-15',
    );

    const summaries = getSeriesSummaries(
      [newestFirst, olderLast, middleDate],
      'zh-TW',
      new Date('2026-08-21'),
    );

    expect(summaries.map(item => item.slug)).toEqual(['stanford-cs161', 'stanford-cs103']);
    expect(summaries[0].latestDate).toEqual(new Date('2026-08-20'));
    expect(summaries[0].posts.map(item => item.id)).toEqual([newestFirst.id, olderLast.id]);
  });

  it('assigns stable navigation categories to registered and fallback series', () => {
    const course = post('learning/statistics', 'zh-TW', { name: '從考試到 ML/AI 的統計學導讀', order: 1 });
    const fallback = post('learning/fallback', 'zh-TW', { name: '新的學習系列', order: 1 });
    const summaries = getSeriesSummaries([course, fallback], 'zh-TW', new Date('2026-08-21'));

    expect(SERIES_CATEGORIES.map(category => category.id)).toEqual([
      'courses',
      'exams-interviews',
      'ai-agents',
      'engineering',
      'updates',
      'other',
    ]);
    expect(summaries.find(item => item.slug === 'statistics-ml-ai')?.category).toBe('exams-interviews');
    expect(summaries.find(item => item.name === '新的學習系列')?.category).toBe('other');
  });

  it('keeps interview drills with exams even though they publish daily', () => {
    const registered = post('daily/drill', 'zh-TW', { name: 'AI Engineer 面試日練', order: 1 });
    const unregistered = post('daily/drill-en', 'zh-TW', { name: 'Product Builder Interview Drill', order: 1 });
    const digest = post('daily/arxiv', 'zh-TW', { name: 'AI Agent Arxiv Digest', order: 1 });
    const summaries = getSeriesSummaries([registered, unregistered, digest], 'zh-TW', new Date('2026-08-21'));

    expect(summaries.find(item => item.slug === 'ai-engineer-interview-daily')?.category).toBe('exams-interviews');
    expect(summaries.find(item => item.name === 'Product Builder Interview Drill')?.category).toBe('exams-interviews');
    expect(summaries.find(item => item.name === 'AI Agent Arxiv Digest')?.category).toBe('updates');
  });

  it('tags course series with a school and leaves other series untagged', () => {
    const names = ['Stanford CS230 導讀', 'MIT 6.S191 導讀', '台大李宏毅 機器學習 2026 Spring 導讀', '世界名校 AI／CS 課程地圖', 'AI 證照備考'];
    const summaries = getSeriesSummaries(
      names.map((name, index) => post(`ai/school-${index}`, 'zh-TW', { name, order: 1 })),
      'zh-TW',
      new Date('2026-08-21'),
    );

    expect(names.map(name => summaries.find(item => item.name === name)?.school)).toEqual([
      'stanford', 'mit', 'taiwan', 'cross-school', undefined,
    ]);
  });

  it('navigates primary and additional series independently with canonical post slugs', () => {
    const masterPrevious = post(
      'learning/stanford-cs111-guide-en',
      'en',
      { name: 'Reading Stanford CS111', order: 1 },
      [{ name: "Reading Stanford's Main-Line CS Courses", order: 5 }],
    );
    const guide = post(
      'learning/stanford-cs161-guide-en',
      'en',
      { name: 'Reading Stanford CS161', order: 1 },
      [{ name: "Reading Stanford's Main-Line CS Courses", order: 6 }],
    );
    const lecture = post(
      'learning/stanford-cs161-lecture-01-en',
      'en',
      { name: 'Reading Stanford CS161', order: 2 },
    );

    expect(getSeriesNavs(guide, [masterPrevious, guide, lecture])).toEqual([
      {
        name: 'Reading Stanford CS161',
        current: 1,
        total: 2,
        next: { slug: lecture.id, title: lecture.data.title },
      },
      {
        name: "Reading Stanford's Main-Line CS Courses",
        current: 6,
        total: 2,
        prev: { slug: masterPrevious.id, title: masterPrevious.data.title },
      },
    ]);
  });
});
