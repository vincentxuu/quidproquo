import test from 'node:test';
import assert from 'node:assert/strict';
import { isNoise, parseLine, filterCandidates, shiftDays, toDate } from './yt-candidates.mjs';

const item = (over = {}) => ({ id: 'abcdefghijk', date: '2025-03-01', duration: 600, channel: 'Hard Is Easy', title: 'Quickdraw test', source: 'channel', dateKind: 'approx', ...over });

test('parses yt-dlp tab output and rejects junk lines', () => {
  assert.deepEqual(parseLine('abcdefghijk\t20250301\t600\tHowNOT2\tQuickdraw | test'), { id: 'abcdefghijk', date: '2025-03-01', duration: 600, channel: 'HowNOT2', title: 'Quickdraw | test' });
  assert.equal(parseLine('WARNING: something'), null);
  assert.equal(toDate('NA'), null);
});

test('flags the noise seen in the 2026-10-24 quickdraw search', () => {
  assert.equal(isNoise({ title: '퀵드로우 추천 판매순위 Top10', channel: '어바웃쇼핑', duration: 300 }), 'noise_pattern');
  assert.equal(isNoise({ title: 'ヌンチャクアーティストによるヌンチャクの選び方', channel: 'ニンジャHIROKI', duration: 600 }), 'noise_pattern');
  assert.equal(isNoise({ title: 'Rep Quickdraw Review: The FASTEST Adjustable Dumbbell?', channel: 'Strength & Steel', duration: 600 }), 'noise_pattern');
  assert.equal(isNoise({ title: 'Top 10 quickdraws in 2024 That You Need to Know', channel: 'Shopping Show', duration: 90 }), 'noise_pattern');
  assert.equal(isNoise({ title: 'Which climbing quickdraw clips the fastest?', channel: 'Treeline Review', duration: 24 }), 'too_short');
  assert.equal(isNoise({ title: 'Buying Sport Climbing Quickdraws – Know the Differences', channel: 'Mike Vert', duration: 539 }), null);
});

test('approximate channel dates get a margin; exact dates use the real threshold', () => {
  const opts = { match: /quick ?draw/i, since: '2024-01-01', minSeconds: 90 };
  assert.equal(shiftDays('2024-01-01', -270), '2023-04-06');
  // 頻道列表顯示 2023-10（大約），可能其實是 2024，要留下等 --verify
  assert.equal(filterCandidates([item({ date: '2023-10-24' })], opts).kept.length, 1);
  // 確切日期 2023-12-11 就排除
  assert.equal(filterCandidates([item({ date: '2023-12-11', dateKind: 'exact' })], opts).kept.length, 0);
  assert.equal(filterCandidates([item({ date: '2022-10-24' })], opts).dropped.too_old, 1);
});

test('keyword results must look like climbing; duplicates and off-topic are dropped', () => {
  const opts = { match: /quick ?draw/i, since: '2024-01-01', minSeconds: 90 };
  const { kept, dropped } = filterCandidates([
    item({ source: 'search:quickdraw', date: null, dateKind: 'unknown', title: 'QuickDraw Mod', channel: 'Toddy' }),
    item({ id: 'bbbbbbbbbbb', source: 'search:quickdraw', date: null, dateKind: 'unknown', title: 'Climbing quickdraw basics' }),
    item({ id: 'bbbbbbbbbbb', title: 'Climbing quickdraw basics' }),
    item({ id: 'ccccccccccc', title: 'New cams 2026' }),
  ], opts);
  assert.deepEqual(kept.map(k => k.id), ['bbbbbbbbbbb']);
  assert.equal(dropped.not_climbing, 1);
  assert.equal(dropped.duplicate, 1);
  assert.equal(dropped.off_topic, 1);
});
