import test from 'node:test';
import assert from 'node:assert/strict';
import { HEADINGS, inspectPost, inspectPair } from './check-model-family-format.mjs';

function source(lang = 'zh-TW') {
  const refs = lang === 'en' ? 'References' : '參考資料';
  return `---\ntitle: family\ndate: 2026-10-10\ncategory: tech\nlang: ${lang}\ntldr: A bounded selection guide\nseries:\n  name: "${lang === 'en' ? 'AI Model Families' : 'AI 模型家族'}"\n  order: 26\n---\nIntro.\n\n` + HEADINGS[lang].map((h, i) => `## ${h}\n\n${i ? 'Known scope and limitations.' : '| Model | Access |\n|---|---|\n| A | API |'}\n\n`).join('') + `## ${refs}\n\n- [Official](https://example.com/model)\n`;
}
const file = '2026-10-10-ai-model-family-sample.md';

test('valid bilingual main articles align, glossary and history remain optional', () => {
  const zh = inspectPost(source(), file), en = inspectPost(source('en'), file.replace('.md', '-en.md'));
  assert.deepEqual(zh.errors, []); assert.deepEqual(en.errors, []); assert.deepEqual(inspectPair(zh, en), []);
});
test('missing and reordered sections fail even when heading counts match', () => {
  const s = source().replace('## 家族演化', '## TEMP').replace('## 架構與訓練取捨', '## 家族演化').replace('## TEMP', '## 架構與訓練取捨');
  assert.ok(inspectPost(s, file).errors.some(e => e.startsWith('H2 order')));
});
test('code fences cannot supply required headings or fake model matrices', () => {
  const s = source().replace('| Model | Access |\n|---|---|\n| A | API |', '```markdown\n| Model | Access |\n|---|---|\n| A | API |\n## Extra heading\n```');
  const result = inspectPost(s, file);
  assert.ok(result.errors.some(e => e.includes('model matrix')));
  assert.equal(result.headings.length, 8);
});
test('reference links must be real prose links and references remain final', () => {
  const s = source().replace('- [Official](https://example.com/model)', '```markdown\n[Official](https://example.com/model)\n```\n\n## Extra\nText.');
  const result = inspectPost(s, file);
  assert.ok(result.errors.some(e => e.includes('final H2')));
  assert.ok(result.errors.some(e => e.includes('external source')));
});
test('wrong localized series name, missing tldr and empty sections fail', () => {
  const s = source('en').replace('AI Model Families', 'AI 模型家族').replace('tldr: A bounded selection guide', 'tldr: ""').replace('## Family evolution\n\nKnown scope and limitations.', '## Family evolution\n\n### Empty child\n');
  const errors = inspectPost(s, file).errors;
  assert.ok(errors.some(e => e.startsWith('series.name')));
  assert.ok(errors.some(e => e.includes('tldr')));
  assert.ok(errors.some(e => e.includes('empty section')));
});
test('known cross-family guide retains task-based structure but still needs references', () => {
  const s = source().replace(HEADINGS['zh-TW'].map((h,i) => `## ${h}\n\n${i ? 'Known scope and limitations.' : '| Model | Access |\n|---|---|\n| A | API |'}\n\n`).join(''), '## ASR\n\nTask-specific comparison.\n\n');
  const result = inspectPost(s, '2026-08-26-ai-model-family-speech-audio.md');
  assert.equal(result.role, 'comparison'); assert.deepEqual(result.errors, []);
});
test('bilingual identity and publication drift fail independently of format', () => {
  const zh = inspectPost(source(), file);
  const en = inspectPost(source('en').replace('order: 26', 'order: 27').replace('category: tech', 'category: ai').replace('tldr:', 'draft: true\ntldr:'), file.replace('.md','-en.md'));
  assert.equal(inspectPair(zh, en).length, 3);
});
