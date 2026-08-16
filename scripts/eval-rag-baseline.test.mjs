import assert from 'node:assert/strict';
import test from 'node:test';
import { buildOfflineResponse, scoreCase } from './eval-rag-baseline.mjs';

const rubric = {
  id: 'case-1',
  category: 'concept',
  expected_answer_points: ['區分向量檢索與關鍵字檢索', '說明兩者互補'],
  expected_sources: ['posts/ai'],
  forbidden_claims: ['兩者完全相同'],
};

test('offline fixture requires independent candidate output', () => {
  assert.throws(
    () => buildOfflineResponse({ ...rubric, fixture_answer: 'expected copied as answer' }),
    /candidate_answer and candidate_sources/,
  );
});

test('scores candidate output against golden answer points and sources', () => {
  const source = 'https://quidproquo.cc/posts/ai/hybrid-search';
  const result = scoreCase(
    rubric,
    `向量檢索與關鍵字檢索的定位不同，兩者互補。[Hybrid search](${source})`,
    [{ url: source }],
  );

  assert.equal(result.answerRelevance, 1);
  assert.equal(result.contextRecall, 1);
  assert.equal(result.faithfulness, 1);
  assert.equal(result.passed, true);
});

test('fails a fluent answer that misses golden expectations', () => {
  const result = scoreCase(rubric, '這是一段很流暢，但沒有回答指定概念的文字。', []);

  assert.equal(result.answerRelevance, 0);
  assert.equal(result.contextRecall, 0);
  assert.equal(result.passed, false);
});

test('forbidden claims fail even when sources and expected terms are present', () => {
  const source = 'https://quidproquo.cc/posts/ai/hybrid-search';
  const result = scoreCase(
    rubric,
    `向量檢索與關鍵字檢索可以互補，但兩者完全相同。[Hybrid search](${source})`,
    [{ source_url: source }],
  );

  assert.equal(result.faithfulness, 0);
  assert.equal(result.answerRelevance, 0);
  assert.deepEqual(result.forbiddenClaims, ['兩者完全相同']);
  assert.equal(result.passed, false);
});

test('not-in-kb case passes only without fabricated sources or citations', () => {
  const notInKb = {
    id: 'unknown',
    category: 'not-in-kb',
    expected_answer_points: ['明確回覆未知範圍'],
    expected_sources: [],
    forbidden_claims: ['虛構具體內容'],
  };
  const result = scoreCase(notInKb, '我明確回覆：這是未知範圍，無法從站內資料確認。', []);

  assert.equal(result.faithfulness, 1);
  assert.equal(result.contextRecall, 1);
  assert.equal(result.answerRelevance, 1);
  assert.equal(result.passed, true);
});
