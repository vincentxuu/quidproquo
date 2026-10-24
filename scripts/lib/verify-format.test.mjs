import test from 'node:test';
import assert from 'node:assert/strict';
import { formatFailure } from './verify-format.mjs';

const warnings = Array.from({ length: 40 }, (_, i) => `file${i}.ts:1:1 - warning ts(6385): 'X' is deprecated.`);

test('短輸出原樣保留', () => {
  const out = formatFailure('a\nb\nc');
  assert.deepEqual(out, ['a', 'b', 'c']);
});

test('錯誤排在 30 行之後也會被印出來', () => {
  const detail = ['[types] Generated', '[check] Getting diagnostics', 'start', ...warnings,
    "src/a.astro:1548:15 - error ts(7053): Element implicitly has an 'any' type", '   1548 readStore[readPath]', '   ~~~', ...warnings, 'Result (1 file): 1 error'].join('\n');
  const out = formatFailure(detail).join('\n');
  assert.match(out, /ts\(7053\)/);
  assert.match(out, /readStore\[readPath\]/);
  assert.match(out, /Result \(1 file\): 1 error/);
  assert.match(out, /省略 \d+ 行/);
});

test('總行數不超過上限加省略提示', () => {
  const errors = Array.from({ length: 60 }, (_, i) => `f${i}.ts - error ts(2322): bad`);
  const out = formatFailure(['h1', 'h2', 'h3', ...errors, 't1', 't2', 't3', 't4', 't5'].join('\n'));
  assert.ok(out.length <= 31, `got ${out.length}`);
  assert.match(out.at(-6), /省略/);
});

test('只有警告時不假裝有錯誤，只留開頭與結尾', () => {
  const out = formatFailure(['h1', 'h2', 'h3', ...warnings, 't1', 't2', 't3', 't4', 't5'].join('\n'));
  assert.ok(!out.some((l) => l.includes('warning')));
  assert.equal(out[0], 'h1');
  assert.equal(out.at(-1), 't5');
});

test('去掉 ANSI 色碼', () => {
  const out = formatFailure('\u001b[91merror\u001b[0m x');
  assert.deepEqual(out, ['error x']);
});
