import { describe, expect, it } from 'vitest';
import { calculateReadingTime } from './remarkReadingTime';

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
