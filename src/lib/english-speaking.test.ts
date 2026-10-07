import { describe, expect, it } from 'vitest';
import { parseProgress, scheduleReview, selectSession, speakingCards, speakingEvidence } from './english-speaking';
describe('speaking practice', () => {
  it('schedules retry, tomorrow, and growing fluent intervals', () => {
    const now = 1000;
    expect(scheduleReview(undefined, 0, now).due).toBe(now + 600_000);
    expect(scheduleReview(undefined, 1, now).due).toBe(now + 86_400_000);
    const first = scheduleReview(undefined, 2, now);
    expect(first.due).toBe(now + 3 * 86_400_000);
    expect(scheduleReview(first, 2, now).due).toBe(now + 6 * 86_400_000);
    expect(scheduleReview(first, 0, now).streak).toBe(0);
  });
  it('rejects malformed storage and drops invalid or unknown entries', () => {
    expect(parseProgress('{')).toEqual({});
    expect(parseProgress('[]')).toEqual({});
    const good = scheduleReview(undefined, 2, 1000);
    expect(parseProgress(JSON.stringify({ map: good, station: { ...good, due: -1 }, unknown: good }))).toEqual({ map: good });
  });
  it('does not carry found-ticket progress into the new presentation prompt', () => {
    const old = scheduleReview(undefined, 2, 1000);
    const progress = parseProgress(JSON.stringify({ ticket: old }));
    expect(progress).toEqual({});
    expect(selectSession(progress, 1000, 'due', 'travel')).toContain('ticket-present');
  });
  it('includes new cards and only due reviews, without mutating a selected session', () => {
    const progress = { map: scheduleReview(undefined, 2, 1000) };
    const selected = selectSession(progress, 1000, 'due');
    expect(selected).toHaveLength(18);
    expect(selectSession(progress, 1000, 'all', 'surf')).toEqual(['surf-waves', 'surf-entry']);
    expect(selected).not.toContain('map');
    progress.map = scheduleReview(undefined, 0, 0);
    expect(selected).not.toContain('map');
    expect(selectSession(progress, 600_000, 'due')).toHaveLength(19);
    expect(selectSession(progress, 0, 'all')).toHaveLength(19);
  });
  it('keeps evidence aligned with cards and article links on-site', () => {
    expect(Object.keys(speakingEvidence).sort()).toEqual(speakingCards.map(card => card.id).sort());
    for (const evidence of Object.values(speakingEvidence)) if (evidence.article) expect(evidence.article).toMatch(/^\/posts\/[a-z0-9-]+(\/[a-z0-9-]+)*\/?$/);
  });
});
