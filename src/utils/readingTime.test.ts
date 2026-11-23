import { describe, expect, it } from 'vitest';
import { calculateReadingTime, getReadingTime, markdownToReadableText } from './readingTime';

describe('calculateReadingTime', () => {
  it('counts CJK text by characters instead of whitespace-separated words', () => {
    const text = '這是一段沒有空白的中文內容。'.repeat(120);

    expect(calculateReadingTime(text)).toBeGreaterThan(1);
  });

  it('counts latin text by words', () => {
    const text = Array.from({ length: 401 }, () => 'word').join(' ');

    expect(calculateReadingTime(text)).toBe(3);
  });

  it('supports mixed CJK and latin content', () => {
    const text = `${'中文內容'.repeat(250)} ${Array.from({ length: 200 }, () => 'word').join(' ')}`;

    expect(calculateReadingTime(text)).toBe(3);
  });
});

describe('markdownToReadableText', () => {
  it('drops fenced blocks and link targets but keeps link text', () => {
    const md = '前言 [連結文字](https://example.com/a-very-long-path)\n\n```diagram\ntitle: x\n```\n\n結尾 https://bare.example.com';

    const text = markdownToReadableText(md);

    expect(text).toContain('連結文字');
    expect(text).not.toContain('example.com');
    expect(text).not.toContain('title');
  });
});

describe('getReadingTime', () => {
  it('reads the entry body and is never below one minute', () => {
    expect(getReadingTime({ body: '' })).toBe(1);
    expect(getReadingTime({ body: '字'.repeat(1600) })).toBe(4);
  });
});
