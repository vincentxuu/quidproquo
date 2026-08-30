import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import buildPromptfooTests from './promptfoo-tests.mjs'
import { loadRagDataset, parseRagDataset } from './golden-dataset.mjs'

test('loads the canonical 21-case golden dataset with one Promptfoo retrieval contract', () => {
  const dataset = loadRagDataset(path.resolve('docs/rag-golden-dataset.json'))
  assert.equal(dataset.schema_version, '1.0')
  assert.equal(dataset.cases.length, 21)
  assert.equal(dataset.cases.at(-1).id, 'q21')

  const promptfooTests = buildPromptfooTests()
  assert.equal(promptfooTests.length, 1)
  assert.equal(promptfooTests[0].vars.caseId, 'q21')
  assert.deepEqual(promptfooTests[0].assert[0].config.requiredSources, [
    'learning/2026-08-20-stanford-cs-course-map',
    'learning/2026-08-21-mit-ai-ml-course-map',
    'learning/2026-08-21-cmu-ai-ml-course-map',
    'learning/2026-08-21-berkeley-ai-ml-course-map',
  ])
})

test('loads the shared offline fixture without treating it as live evidence', () => {
  const fixture = loadRagDataset(path.resolve('docs/rag-golden-fixture.json'), { fixture: true })
  assert.equal(fixture.evidence_kind, 'offline-fixture')
  assert.equal(fixture.cases.length, 5)
  assert.equal(fixture.cases.at(-1).id, 'q21')
})

test('rejects duplicate ids and unsupported schema versions', () => {
  const testCase = {
    id: 'q1',
    query: 'query',
    expected_answer_points: [],
    expected_sources: [],
    forbidden_claims: [],
    allowed_trace_patterns: [],
  }
  assert.throws(() => parseRagDataset({
    schema_version: '2.0',
    dataset_id: 'bad',
    evidence_kind: 'golden-contract',
    cases: [testCase],
  }), /Unsupported RAG dataset schema_version/)
  assert.throws(() => parseRagDataset({
    schema_version: '1.0',
    dataset_id: 'duplicates',
    evidence_kind: 'golden-contract',
    cases: [testCase, { ...testCase }],
  }), /Duplicate RAG case id/)
})
