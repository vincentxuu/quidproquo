import { describe, expect, it } from 'vitest';
import { DAILY_CHANNELS, countDailyChannels, getDailyChannelId } from './daily-content-types';

describe('Daily Digest content channels', () => {
  it('defines all fourteen reader-facing article channels', () => {
    expect(DAILY_CHANNELS.map(channel => channel.id)).toEqual([
      'daily',
      'weekly',
      'region',
      'arxiv',
      'github',
      'model-card',
      'security',
      'benchmark',
      'framework',
      'tool',
      'funding',
      'pricing',
      'ai-interview',
      'product-interview',
    ]);
  });

  it.each([
    ['AI 日報', 'daily'],
    ['AI Agent Arxiv Digest', 'arxiv'],
    ['AI Agent GitHub Digest', 'github'],
    ['AI Model Tracker', 'model-card'],
    ['AI Security Alert', 'security'],
    ['AI Benchmark Watch', 'benchmark'],
    ['AI Framework Changelog', 'framework'],
    ['AI Tool of the Day', 'tool'],
    ['AI Agent Funding', 'funding'],
    ['AI Pricing Watch', 'pricing'],
    ['AI Agent 週回顧', 'weekly'],
    ['AI Region Focus', 'region'],
    ['AI Engineer 面試日練', 'ai-interview'],
    ['Product Builder 面試日練', 'product-interview'],
  ])('maps series %s to %s', (seriesName, expected) => {
    expect(getDailyChannelId(seriesName)).toBe(expected);
  });

  it('uses type tags as a fallback and unknown content as a daily report', () => {
    expect(getDailyChannelId(undefined, ['ai-agent', 'model-release'])).toBe('model-card');
    expect(getDailyChannelId('Unregistered Daily Series', ['ai-agent', 'daily'])).toBe('daily');
  });

  it('normalizes harmless casing and whitespace without accepting partial names', () => {
    expect(getDailyChannelId('  AI AGENT ARXIV DIGEST  ')).toBe('arxiv');
    expect(getDailyChannelId('AI Agent GitHub Digest Extra')).toBe('daily');
  });

  it('counts posts through the same classifier used by the UI', () => {
    const counts = countDailyChannels([
      { seriesName: 'AI Security Alert' },
      { tags: ['security'] },
      { seriesName: 'AI Agent Funding' },
    ]);

    expect(counts.security).toBe(2);
    expect(counts.funding).toBe(1);
    expect(counts.arxiv).toBe(0);
  });
});
