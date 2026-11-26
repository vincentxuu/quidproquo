import { readFileSync, readdirSync } from 'node:fs';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { englishContentContext, englishContentEntries, englishPracticeHref } from './english-content';
import { speakingCards, speakingScenarios } from './english-speaking';
import { isPublishedPostData } from '../utils/publishing';

function postData(id: string) {
  const file = new URL(`../content/posts/${id}.md`, import.meta.url);
  return matter(readFileSync(file, 'utf8')).data;
}

describe('English learning content directory', () => {
  it('resolves Chinese and English article ids and internal paths to the same entry', () => {
    const id = 'learning/2026-10-07-work-standup-english';
    const entry = englishContentContext(id);
    expect(entry?.scenario).toBe('work');
    for (const path of [id, `${id}-en`, `/posts/${id}/`, `/posts/${id}-en/`, `posts/${id}-en/`, `/${id}/`]) {
      expect(englishContentContext(path)).toBe(entry);
    }
  });

  it('does not classify unrelated or malformed paths through keywords or tags', () => {
    for (const id of [
      'learning/2026-10-14-language-translation-mobile-reading',
      'ai/2026-08-26-understanding-ai-models-tokenization',
      '/english/26-10-07-work-standup-english/',
      'learning/not-an-english-speaking-post',
      'https://other.example/posts/learning/2026-10-07-work-standup-english/',
      'learning/2026-10-07-work-standup-english-en-en',
      '',
    ]) expect(englishContentContext(id)).toBeUndefined();
  });

  it('keeps one thirty-four-part series while retaining useful directory sections', () => {
    expect(englishContentEntries).toHaveLength(34);
    expect(new Set(englishContentEntries.map(entry => entry.id)).size).toBe(34);
    expect(englishContentEntries.map(entry => entry.order)).toEqual(Array.from({ length: 34 }, (_, i) => i));
    expect(englishContentEntries.filter(entry => entry.section === 'materials')).toHaveLength(15);
    expect(englishContentEntries.filter(entry => entry.section === 'methods')).toHaveLength(3);
    expect(englishContentEntries.filter(entry => entry.section === 'courses')).toHaveLength(16);
    expect(englishContentEntries[0].id).toBe('learning/2026-10-19-english-speaking-practice-overview');
    expect(englishContentContext('learning/2026-10-08-shadowing-evidence')?.section).toBe('methods');
    expect(englishContentContext('learning/2026-10-08-travel-airport-hotel-restaurant-english')?.section).toBe('materials');
    expect(englishContentContext('learning/2026-10-19-nativecamp-speaking-practice')?.section).toBe('courses');
  });

  it('links only to existing published articles in both languages', () => {
    for (const entry of englishContentEntries) {
      for (const [suffix, lang] of [['', 'zh-TW'], ['-en', 'en']]) {
        const data = postData(entry.id + suffix);
        expect(data.lang, entry.id + suffix).toBe(lang);
        expect(typeof data.title).toBe('string');
        expect(isPublishedPostData({ date: new Date(data.date), draft: data.draft }), entry.id + suffix).toBe(true);
        expect(englishContentContext(entry.id + suffix)).toBe(entry);
        expect(data.series, entry.id + suffix).toEqual({
          name: lang === 'en' ? 'English Speaking Practice' : '英文口說練習',
          order: entry.order,
        });
      }
    }
  });

  it('includes every published series chapter in the hub, in both languages', () => {
    const directory = new URL('../content/posts/learning/', import.meta.url);
    const publishedIds = new Set<string>();
    for (const file of readdirSync(directory).filter(file => file.endsWith('.md'))) {
      const data = matter(readFileSync(new URL(file, directory), 'utf8')).data;
      if (!['英文口說練習', 'English Speaking Practice'].includes(data.series?.name)) continue;
      if (!isPublishedPostData({ date: new Date(data.date), draft: data.draft })) continue;
      const id = `learning/${file.replace(/\.md$/, '')}`;
      expect(englishContentContext(id), id).toBeDefined();
      publishedIds.add(id);
    }
    expect(publishedIds).toEqual(new Set(englishContentEntries.flatMap(entry => [entry.id, `${entry.id}-en`])));
  });

  it('routes scenarios to available cards and distinguishes research from a matching card set', () => {
    const scenarios = new Set(speakingScenarios.map(scenario => scenario.id));
    for (const entry of englishContentEntries) {
      const href = englishPracticeHref(entry);
      expect(href).toMatch(/^\/english\/#(?:home\/[a-z]+|shadow\/travel|practice-area)$/);
      if (entry.scenario) {
        expect(scenarios.has(entry.scenario)).toBe(true);
        expect(speakingCards.some(card => card.scenario === entry.scenario)).toBe(true);
        expect(href).toBe(`/english/#home/${entry.scenario}`);
      }
      if (entry.section === 'materials') expect(entry.scenario).toBeDefined();
    }
    expect(englishPracticeHref(englishContentContext('learning/2026-10-08-shadowing-evidence')!)).toBe('/english/#shadow/travel');
    expect(englishPracticeHref(englishContentContext('learning/2026-09-03-work-english-speaking-tips')!)).toBe('/english/#home/work');
    expect(englishPracticeHref(englishContentContext('learning/2026-10-10-agency-ai-shadowing')!)).toBe('/english/#practice-area');
    expect(speakingCards.some(card => card.scenario === 'travel')).toBe(true);
  });
});
