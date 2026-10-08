import { describe, expect, it } from 'vitest';
import { canRecord, canReplay, dialoguesFor, groupCheatSheet, parseProgress, resolveDialogue, scheduleReview, selectSession, speakingCards, speakingDialogues, speakingEvidence, speakingScenarios } from './english-speaking';
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
    expect(selected).toHaveLength(129);
    expect(selectSession(progress, 1000, 'all', 'surf')).toEqual(['surf-waves', 'surf-entry']);
    expect(selected).not.toContain('map');
    progress.map = scheduleReview(undefined, 0, 0);
    expect(selected).not.toContain('map');
    expect(selectSession(progress, 600_000, 'due')).toHaveLength(130);
    expect(selectSession(progress, 0, 'all')).toHaveLength(130);
  });
  it('keeps evidence aligned with cards and article links on-site', () => {
    expect(Object.keys(speakingEvidence).sort()).toEqual(speakingCards.map(card => card.id).sort());
    for (const evidence of Object.values(speakingEvidence)) if (evidence.article) expect(evidence.article).toMatch(/^\/posts\/[a-z0-9-]+(\/[a-z0-9-]+)*\/?$/);
  });
  it('groups a cheat sheet by family in the given order without losing cards', () => {
    const order = ['go', 'have'];
    const groups = groupCheatSheet('travel', order);
    expect(groups.slice(0, 2).map(group => group.family)).toEqual(order);
    const travel = speakingCards.filter(card => card.scenario === 'travel');
    expect(groups.flatMap(group => group.cards).map(card => card.id).sort()).toEqual(travel.map(card => card.id).sort());
    for (const group of groups) expect(group.cards.every(card => card.family === group.family && card.scenario === 'travel')).toBe(true);
    const rest = groups.slice(2).map(group => group.family);
    expect(rest).toEqual([...new Set(travel.map(card => card.family))].filter(family => !order.includes(family)));
    expect(groupCheatSheet('surf').flatMap(group => group.cards).map(card => card.id)).toEqual(['surf-waves', 'surf-entry']);
  });
  it('offers a replay only when enabled and the batch has sentences', () => {
    expect(canReplay(true, ['map'])).toBe(true);
    expect(canReplay(true, [])).toBe(false);
    expect(canReplay(false, ['map'])).toBe(false);
  });
  it('falls back to the plain flow unless recording is enabled, secure, and supported', () => {
    const supported = { isSecureContext: true, navigator: { mediaDevices: { getUserMedia: () => undefined } }, MediaRecorder: function MediaRecorder() {} };
    expect(canRecord(true, supported)).toBe(true);
    expect(canRecord(false, supported)).toBe(false);
    expect(canRecord(true, { ...supported, isSecureContext: false })).toBe(false);
    expect(canRecord(true, { ...supported, navigator: {} })).toBe(false);
    expect(canRecord(true, { ...supported, MediaRecorder: undefined })).toBe(false);
    expect(canRecord(true, {})).toBe(false);
  });
  it('keeps every role-play in a real scenario, with unique ids and at least one line for the learner', () => {
    const scenarios = speakingScenarios.map(scenario => scenario.id);
    expect(new Set(speakingDialogues.map(dialogue => dialogue.id)).size).toBe(speakingDialogues.length);
    for (const dialogue of speakingDialogues) {
      expect(scenarios).toContain(dialogue.scenario);
      expect(dialogue.title && dialogue.role && dialogue.note).toBeTruthy();
      expect(dialogue.note).toContain('自己寫的練習示例');
      expect(dialogue.turns.some(turn => turn.who === 'you')).toBe(true);
      for (const turn of dialogue.turns) {
        expect(turn.en.trim()).toBe(turn.en);
        expect(turn.en).not.toBe('');
        expect(turn.en).not.toContain("'");
        if (turn.who === 'you') expect(turn.zh).not.toBe('');
        else expect(turn).not.toHaveProperty('zh');
      }
    }
  });
  it('points role-play lines only at cards of the same scenario, and reuses the card prompt when the sentence is the card', () => {
    const cards = new Map<string, typeof speakingCards[number]>(speakingCards.map(card => [card.id, card]));
    for (const dialogue of speakingDialogues) for (const turn of dialogue.turns) {
      if (turn.who !== 'you' || !turn.cardId) continue;
      const card = cards.get(turn.cardId);
      expect(card, `${dialogue.id}: ${turn.cardId}`).toBeDefined();
      expect(card!.scenario).toBe(dialogue.scenario);
      if (turn.en.replace(/^(Yes\.|Thanks\.|Hi,) /, '') === card!.en) expect(turn.zh).toBe(card!.zh);
    }
  });
  it('resolves role-play links per scenario and offers none when the tool is off', () => {
    expect(dialoguesFor(true, 'work').map(dialogue => dialogue.id)).toEqual(['work-help', 'work-standup']);
    expect(dialoguesFor(true, 'surf')).toEqual([]);
    expect(dialoguesFor(false, 'work')).toEqual([]);
    expect(resolveDialogue(true, 'work', 'work-standup')?.id).toBe('work-standup');
    expect(resolveDialogue(true, 'work', 'travel-restaurant')?.id).toBe('work-help');
    expect(resolveDialogue(true, 'work')?.id).toBe('work-help');
    expect(resolveDialogue(true, 'surf', 'work-help')).toBeUndefined();
    expect(resolveDialogue(false, 'work', 'work-help')).toBeUndefined();
  });
  it('keeps company and product names out of the interview role-play', () => {
    for (const dialogue of dialoguesFor(true, 'interview')) for (const turn of dialogue.turns) expect(turn.en).not.toMatch(/MaiAgent|Claude|OpenAI|Google|Anthropic|GPT/i);
  });
});
