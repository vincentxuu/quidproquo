import { describe, expect, it } from 'vitest';
import { pickSession, requeue, SESSION_SIZE, speakingCards as allCards, canRecord, canReplay, clipKey, clipUrl, parseVoice, speakingSentences, speakingVoices, dialoguesFor, fixOptions, fluencyOriginalMinutes, fluencyRounds, fluencyTopicsFor, formatClock, formatDuration, freeTalkFor, freeTalkPrompts, pickTopic, recordingFileName, secondsLeft, shadowRates, groupCheatSheet, interviewQuestionGroups, interviewQuestions, parseProgress, questionsFor, resolveDialogue, scheduleReview, selectSession, shuffleQuestions, speakingCards, speakingDialogues, speakingEvidence, speakingScenarios } from './english-speaking';
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
    expect(selected).toHaveLength(178);
    expect(selectSession(progress, 1000, 'all', 'surf')).toEqual(['surf-waves', 'surf-entry']);
    expect(selected).not.toContain('map');
    progress.map = scheduleReview(undefined, 0, 0);
    expect(selected).not.toContain('map');
    expect(selectSession(progress, 600_000, 'due')).toHaveLength(179);
    expect(selectSession(progress, 0, 'all')).toHaveLength(179);
  });
  it('keeps evidence aligned with cards and article links on-site', () => {
    expect(Object.keys(speakingEvidence).sort()).toEqual(speakingCards.map(card => card.id).sort());
    for (const evidence of Object.values(speakingEvidence)) if (evidence.article) expect(evidence.article).toMatch(/^\/posts\/[a-z0-9-]+(\/[a-z0-9-]+)*\/?$/);
  });
  it('keeps colleague health and lunch practice independent of article pages', () => {
    const cards = speakingCards.filter(card => card.id.startsWith('daily-health-') || card.id.startsWith('daily-lunch-'));
    expect(cards).toHaveLength(14);
    for (const card of cards) expect(speakingEvidence[card.id].article).toBeUndefined();
    expect(speakingDialogues.filter(dialogue => dialogue.id.startsWith('daily-colleague-'))).toHaveLength(2);
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
  it('keeps interview questions unique, sourced, grouped, and within the planned size', () => {
    expect(interviewQuestions.length).toBeGreaterThanOrEqual(20);
    expect(interviewQuestions.length).toBeLessThanOrEqual(24);
    expect(new Set(interviewQuestions.map(question => question.id)).size).toBe(interviewQuestions.length);
    expect(new Set(interviewQuestions.map(question => question.en)).size).toBe(interviewQuestions.length);
    const groups: string[] = interviewQuestionGroups.map(group => group.id);
    for (const group of groups) expect(interviewQuestions.some(question => question.group === group), group).toBe(true);
    for (const question of interviewQuestions) {
      expect(question.id).toMatch(/^iq-[a-z-]+$/);
      expect(groups).toContain(question.group);
      expect(question.en.trim()).toBe(question.en);
      expect(question.en).not.toBe('');
      expect(question.en).not.toContain("'");
      expect(question.zh).not.toBe('');
      expect(question.source.title).not.toBe('');
      expect(question.source.url).toMatch(/^https:\/\/[a-z0-9.-]+\//);
      expect(`${question.en} ${question.zh}`).not.toMatch(/MaiAgent|Claude|OpenAI|Google|Anthropic|GPT/i);
      if (question.en.startsWith('Tell me about a time')) expect(question.structure).toBe('star');
    }
  });
  it('points interview questions only at existing interview cards, at most four each and without repeats', () => {
    const cards = new Map<string, typeof speakingCards[number]>(speakingCards.map(card => [card.id, card]));
    for (const question of interviewQuestions) {
      expect(question.answerCards.length).toBeLessThanOrEqual(4);
      expect(new Set(question.answerCards).size).toBe(question.answerCards.length);
      for (const id of question.answerCards) expect(cards.get(id)?.scenario, `${question.id}: ${id}`).toBe('interview');
    }
    expect(interviewQuestions.some(question => question.answerCards.length === 0)).toBe(true);
  });
  it('offers interview questions only for the interview scenario and only when the tool is on', () => {
    expect(questionsFor(true, 'interview')).toBe(interviewQuestions);
    expect(questionsFor(true, 'work')).toEqual([]);
    expect(questionsFor(false, 'interview')).toEqual([]);
  });
  it('shuffles a round so every question appears exactly once, without changing the input', () => {
    const ids = interviewQuestions.map(question => question.id);
    const before = [...ids];
    for (const random of [Math.random, () => 0, () => 0.999999]) {
      const order = shuffleQuestions(ids, random);
      expect(order).toHaveLength(ids.length);
      expect([...order].sort()).toEqual([...ids].sort());
    }
    expect(ids).toEqual(before);
    expect(shuffleQuestions(ids, () => 0)).not.toEqual(ids);
    expect(shuffleQuestions([])).toEqual([]);
  });
  it('keeps free-talk prompts unique, open, six to eight per scenario, and free of company or product names', () => {
    expect(new Set(freeTalkPrompts.map(prompt => prompt.id)).size).toBe(freeTalkPrompts.length);
    expect(new Set(freeTalkPrompts.map(prompt => prompt.en)).size).toBe(freeTalkPrompts.length);
    for (const scenario of speakingScenarios) {
      const prompts = freeTalkFor(true, scenario.id);
      expect(prompts.length, scenario.id).toBeGreaterThanOrEqual(6);
      expect(prompts.length, scenario.id).toBeLessThanOrEqual(8);
      for (const prompt of prompts) expect(prompt.id.startsWith(`ft-${scenario.id}-`), prompt.id).toBe(true);
      expect(freeTalkFor(false, scenario.id)).toEqual([]);
    }
    const questions = new Set(interviewQuestions.map(question => question.en));
    for (const prompt of freeTalkPrompts) {
      expect(prompt.id).toMatch(/^ft-[a-z-]+$/);
      expect(prompt.en.trim()).toBe(prompt.en);
      expect(prompt.en).toMatch(/[.?]$/);
      expect(prompt.en).not.toContain("'");
      expect(prompt.zh).not.toBe('');
      expect(prompt).not.toHaveProperty('source');
      expect(questions.has(prompt.en)).toBe(false);
      expect(`${prompt.en} ${prompt.zh}`).not.toMatch(/MaiAgent|Claude|OpenAI|Google|Anthropic|GPT|Copilot|Cursor|Gemini|Amazon|Meta|Microsoft/i);
    }
  });
  it('shortens every fluency round, keeps three rounds, and stays below the original minutes', () => {
    expect(fluencyRounds).toHaveLength(3);
    expect(fluencyOriginalMinutes).toEqual([4, 3, 2]);
    fluencyRounds.forEach((seconds, round) => {
      expect(seconds).toBeLessThan(fluencyOriginalMinutes[round] * 60);
      if (round) expect(seconds).toBeLessThan(fluencyRounds[round - 1]);
    });
  });
  it('takes fluency topics from interview questions for interviews and from free-talk prompts elsewhere', () => {
    expect(fluencyTopicsFor(true, 'interview')).toBe(interviewQuestions);
    for (const scenario of speakingScenarios) {
      expect(fluencyTopicsFor(false, scenario.id)).toEqual([]);
      if (scenario.id !== 'interview') expect(fluencyTopicsFor(true, scenario.id)).toEqual(freeTalkFor(true, scenario.id));
      for (const topic of fluencyTopicsFor(true, scenario.id)) expect(topic.id && topic.en && topic.zh).toBeTruthy();
    }
  });
  it('picks a random topic from the list and avoids the one just practised', () => {
    const ids = ['a', 'b', 'c'];
    expect(pickTopic(ids, () => 0)).toBe('a');
    expect(pickTopic(ids, () => 0.999999)).toBe('c');
    expect(pickTopic(ids, () => 1)).toBe('c');
    expect(pickTopic(ids, () => 0, 'a')).toBe('b');
    for (let run = 0; run < 20; run += 1) expect(pickTopic(ids, Math.random, 'b')).not.toBe('b');
    expect(pickTopic(['a'], () => 0.5, 'a')).toBe('a');
    expect(pickTopic([])).toBeUndefined();
    expect(ids).toEqual(['a', 'b', 'c']);
  });
  it('counts a round down to zero without going negative, and formats the time', () => {
    expect(secondsLeft(120_000, 0)).toBe(120);
    expect(secondsLeft(120_000, 1)).toBe(120);
    expect(secondsLeft(120_000, 119_001)).toBe(1);
    expect(secondsLeft(120_000, 120_000)).toBe(0);
    expect(secondsLeft(120_000, 500_000)).toBe(0);
    expect(formatClock(120)).toBe('2:00');
    expect(formatClock(90)).toBe('1:30');
    expect(formatClock(9)).toBe('0:09');
    expect(formatClock(-3)).toBe('0:00');
    expect(fluencyRounds.map(formatDuration)).toEqual(['2 分鐘', '1 分 30 秒', '1 分鐘']);
    expect(formatDuration(45)).toBe('45 秒');
  });
  it('names a downloaded recording by local date and prompt id, with an extension matching the recording', () => {
    const date = new Date(2026, 9, 8, 23, 30);
    expect(recordingFileName('ft-travel-dream-trip', date, 'audio/webm;codecs=opus')).toBe('speaking-2026-10-08-ft-travel-dream-trip.webm');
    expect(recordingFileName('ft-work-blocked', new Date(2027, 0, 5), 'audio/mp4')).toBe('speaking-2027-01-05-ft-work-blocked.m4a');
    expect(recordingFileName('ft-daily-lately', date, 'audio/ogg')).toMatch(/\.ogg$/);
    expect(recordingFileName('ft-daily-lately', date)).toMatch(/\.webm$/);
    expect(recordingFileName('../a b', date)).toBe('speaking-2026-10-08-ab.webm');
    expect(recordingFileName('', date)).toBe('speaking-2026-10-08-recording.webm');
  });
  it('offers three speech rates up to normal speed and fix options with unique ids', () => {
    expect(shadowRates).toEqual([0.7, 0.85, 1]);
    expect(new Set(fixOptions.map(option => option.id)).size).toBe(fixOptions.length);
    expect(fixOptions.length).toBeGreaterThanOrEqual(3);
    for (const option of fixOptions) expect(option.label && option.tip).toBeTruthy();
  });
  it('lists every line that can be read aloud once and gives each a distinct clip key', () => {
    const sentences = speakingSentences();
    expect(new Set(sentences).size).toBe(sentences.length);
    for (const text of [speakingCards[0].en, speakingDialogues[0].turns[0].en, interviewQuestions[0].en, freeTalkPrompts[0].en]) expect(sentences).toContain(text);
    const keys = sentences.map(clipKey);
    expect(new Set(keys).size).toBe(sentences.length);
    for (const key of keys) expect(key).toMatch(/^[0-9a-f]{14}$/);
    expect(clipKey('I’ve got a map.')).toBe(clipKey('I’ve got a map.'));
    expect(clipKey('I’ve got a map.')).not.toBe(clipKey('I’ve got a map'));
  });
  it('plays a clip only when the tool is on and that voice has one for the sentence', () => {
    const text = speakingCards[0].en;
    const clips = { thalia: [clipKey(text)], arcas: [] };
    expect(clipUrl(true, clips, 'thalia', text)).toBe(`/audio/speaking/thalia/${clipKey(text)}.mp3`);
    expect(clipUrl(false, clips, 'thalia', text)).toBe('');
    expect(clipUrl(true, clips, 'arcas', text)).toBe('');
    expect(clipUrl(true, clips, 'draco', text)).toBe('');
    expect(clipUrl(true, clips, 'thalia', `${text} Really.`)).toBe('');
  });
  it('falls back to the first voice for an unknown or missing choice', () => {
    expect(parseVoice('pandora')).toBe('pandora');
    expect(parseVoice('nobody')).toBe(speakingVoices[0].id);
    expect(parseVoice(null)).toBe(speakingVoices[0].id);
    expect(new Set(speakingVoices.map(voice => voice.id)).size).toBe(speakingVoices.length);
  });
  it('caps a sitting and moves on to the cards practised least recently', () => {
    const ids = allCards.filter(card => card.scenario === 'interview').map(card => card.id);
    expect(ids.length).toBeGreaterThan(SESSION_SIZE * 2);
    expect(pickSession(false, {}, 1000, 'all', 'interview')).toEqual(ids);
    const first = pickSession(true, {}, 1000, 'all', 'interview');
    expect(first).toEqual(ids.slice(0, SESSION_SIZE));
    const progress = Object.fromEntries(first.map((id, position) => [id, { due: 5000 + position, reviewed: 2000 + position, rating: 1 as const, streak: 0 }]));
    expect(pickSession(true, progress, 3000, 'all', 'interview')).toEqual(ids.slice(SESSION_SIZE, SESSION_SIZE * 2));
    // A review puts the longest-overdue card first, fills up with new cards, and leaves out what is not due yet.
    const review = pickSession(true, { ...progress, [ids[3]]: { due: 10, reviewed: 5, rating: 0, streak: 0 } }, 3000, 'due', 'interview');
    expect(review).toHaveLength(SESSION_SIZE);
    expect(review[0]).toBe(ids[3]);
    expect(review.slice(1)).toEqual(ids.slice(SESSION_SIZE, SESSION_SIZE * 2 - 1));
    expect(pickSession(true, {}, 1000, 'all', 'surf').length).toBeLessThan(SESSION_SIZE);
  });
  it('brings a card rated "cannot say it yet" back once at the end of the sitting', () => {
    const session = ['a', 'b', 'c'];
    expect(requeue(true, session, 0, 0)).toEqual(['a', 'b', 'c', 'a']);
    expect(requeue(true, session, 0, 1)).toEqual(session);
    expect(requeue(true, session, 0, 2)).toEqual(session);
    expect(requeue(false, session, 0, 0)).toEqual(session);
    expect(requeue(true, session, 5, 0)).toEqual(session);
    const again = ['a', 'b', 'c', 'a'];
    expect(requeue(true, again, 0, 0)).toEqual(again);
    expect(requeue(true, again, 3, 0)).toEqual(again);
    expect(requeue(true, again, 1, 0)).toEqual(['a', 'b', 'c', 'a', 'b']);
  });
});
