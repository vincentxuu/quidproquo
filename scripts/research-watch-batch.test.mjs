import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { sourceId } from './research-pool.mjs';
import { planBatch, reportBatch, writeBatchPlan, writeBatchReport } from './research-watch-batch.mjs';

const date = '2026-10-12';
const taxonomy = { categories: [
  { id: 'ai', label: 'AI', topics: [{ id: 'agents', label: 'Agents' }] },
  { id: 'climbing', label: '攀岩', topics: [{ id: 'crags', label: '岩場' }] },
], sourceTypes: ['paper', 'channel', 'video', 'web-page'] };
const config = (id, category, topic, enabled = true) => ({ id, title: id, category, topic, enabled,
  tags: [], article_paths: [], context_terms: [id], queries: [{ id: 'discover', query: `${id} sources` }],
  known_pages: [], known_source_types: taxonomy.sourceTypes, source_limit: 8, query_limit: 4 });
function fixture(t, configs = [config('joyama', 'climbing', 'crags'), config('agents', 'ai', 'agents'), config('disabled', 'ai', 'agents', false)]) {
  const root = mkdtempSync(join(tmpdir(), 'watch-batch-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, '.research/pool'), { recursive: true });
  mkdirSync(join(root, '.research/watchlists'), { recursive: true });
  writeFileSync(join(root, '.research/pool/taxonomy.json'), JSON.stringify(taxonomy));
  for (const c of taxonomy.categories) {
    mkdirSync(join(root, '.research/pool', c.id), { recursive: true });
    for (const kind of ['sources', 'observations', 'searches']) writeFileSync(join(root, '.research/pool', c.id, `${kind}.jsonl`), '');
  }
  for (const c of configs) writeFileSync(join(root, '.research/watchlists', `${c.id}.json`), JSON.stringify(c));
  return root;
}
const json = path => JSON.parse(readFileSync(path, 'utf8'));
function summary(job, extras = {}) {
  return { run_id: job.run_id, date, planned_requests: job.request_count, completed_requests: job.request_count,
    failed_requests: 0, missing_requests: [], complete: true, new_sources: 0, known_sources: 0, candidates: [], ...extras };
}
function saveSummary(output, job, value) {
  mkdirSync(join(output, job.watch_id), { recursive: true });
  writeFileSync(join(output, job.summary_path), JSON.stringify(value));
}

test('plans every enabled watch across categories in stable order, disabled watch never gets a job', t => {
  const root = fixture(t), output = join(root, 'batch');
  const batch = writeBatchPlan(root, date, output);
  assert.deepEqual(batch.jobs.map(job => job.watch_id), ['agents', 'joyama']);
  assert.equal(batch.enabled_watch_count, 2);
  assert.equal(batch.planned_requests, 2);
  assert.equal(existsSync(join(output, 'disabled')), false);
  assert.equal(json(join(output, 'agents/plan.json')).watch.category, 'ai');
  assert.equal(json(join(output, 'joyama/plan.json')).watch.category, 'climbing');
  assert.deepEqual(json(join(output, 'batch.json')), batch);
});

test('global request budget defers a whole watch and records the reason without making an empty plan', t => {
  const root = fixture(t), output = join(root, 'batch');
  const batch = writeBatchPlan(root, date, output, 1);
  assert.equal(batch.planned_requests, 1);
  assert.equal(batch.jobs[0].status, 'planned');
  assert.equal(batch.jobs[1].status, 'deferred');
  assert.match(batch.jobs[1].reason, /budget/);
  assert.equal(existsSync(join(output, 'joyama/plan.json')), false);
  const built = reportBatch(join(output, 'batch.json'));
  assert.equal(built.summary.status_counts.deferred, 1);
  assert.equal(built.summary.status_counts.pending, 1);
  assert.equal(built.summary.complete, false);
});

test('missing summary stays pending, failed and incomplete watch evidence never becomes success', t => {
  const configs = [config('a', 'ai', 'agents'), config('b', 'ai', 'agents'), config('c', 'climbing', 'crags')];
  const root = fixture(t, configs), output = join(root, 'batch');
  const batch = writeBatchPlan(root, date, output);
  saveSummary(output, batch.jobs[0], summary(batch.jobs[0], { completed_requests: 0, failed_requests: 1, complete: false }));
  saveSummary(output, batch.jobs[1], summary(batch.jobs[1], { completed_requests: 0, missing_requests: ['query-discover'], complete: false }));
  const built = writeBatchReport(join(output, 'batch.json'), join(root, 'report'));
  assert.deepEqual(built.jobs.map(job => job.status), ['failed', 'incomplete', 'pending']);
  assert.equal(built.complete, false);
  assert.equal(built.jobs[0].failed_requests, 1);
  assert.deepEqual(built.jobs[1].missing_requests, ['query-discover']);
  assert.match(readFileSync(join(root, 'report/batch-report.md'), 'utf8'), /pending/);
});

test('cross-watch shared canonical source counts once, not the sum of watch candidate counts', t => {
  const root = fixture(t), output = join(root, 'batch');
  const batch = writeBatchPlan(root, date, output);
  const candidate = { id: sourceId('https://example.org/shared'), known: false };
  for (const job of batch.jobs) saveSummary(output, job, summary(job, { new_sources: 1, candidates: [candidate] }));
  const built = reportBatch(join(output, 'batch.json'));
  assert.equal(built.summary.new_sources, 1);
  assert.equal(built.summary.completed_watches, 2);
  assert.equal(built.summary.complete, true);
  assert.deepEqual(built.summary.new_source_ids, [candidate.id]);
  assert.equal(built.summary.jobs.reduce((n, job) => n + job.new_sources, 0), 2);
});

test('rejects wrong job paths or another run summary before writing any batch report', t => {
  const root = fixture(t), output = join(root, 'batch');
  const batch = writeBatchPlan(root, date, output), file = join(output, 'batch.json');
  const changed = structuredClone(batch);
  changed.jobs[0].summary_path = '../other/summary.json';
  writeFileSync(file, JSON.stringify(changed));
  assert.throws(() => writeBatchReport(file, join(root, 'report')), /paths/);
  assert.equal(existsSync(join(root, 'report')), false);
  writeFileSync(file, JSON.stringify(batch));
  saveSummary(output, batch.jobs[0], summary(batch.jobs[1]));
  assert.throws(() => writeBatchReport(file, join(root, 'report')), /run\/date mismatch/);
  assert.equal(existsSync(join(root, 'report')), false);
});

test('rejects a summary symlink escaping the batch directory', t => {
  const root = fixture(t), output = join(root, 'batch');
  const batch = writeBatchPlan(root, date, output);
  const outside = join(root, 'outside.json');
  writeFileSync(outside, JSON.stringify(summary(batch.jobs[0])));
  symlinkSync(outside, join(output, batch.jobs[0].summary_path));
  assert.throws(() => reportBatch(join(output, 'batch.json')), /escapes/);
});

test('validates disabled configs and date/budget before creating output files', t => {
  const invalid = config('disabled', 'ai', 'unknown', false);
  const root = fixture(t, [invalid]);
  assert.throws(() => writeBatchPlan(root, date, join(root, 'out')), /category\/topic/);
  assert.equal(existsSync(join(root, 'out')), false);
  assert.throws(() => planBatch(root, '2026-02-30'), /calendar/);
  assert.throws(() => planBatch(root, date, -1), /max-requests/);
});

test('empty enabled watch is deferred instead of reporting a successful empty scan', t => {
  const watch = { ...config('empty', 'ai', 'agents'), queries: [] };
  const root = fixture(t, [watch]), output = join(root, 'batch');
  const batch = writeBatchPlan(root, date, output);
  assert.equal(batch.jobs[0].status, 'deferred');
  assert.match(batch.jobs[0].reason, /no runnable/);
  assert.equal(reportBatch(join(output, 'batch.json')).summary.complete, false);
});

test('weekly rotation gives a later watch a turn under the same limited global budget', t => {
  const root = fixture(t);
  const first = planBatch(root, date, 1).batch;
  const next = planBatch(root, '2026-10-19', 1).batch;
  assert.deepEqual(first.sorted_watch_ids, next.sorted_watch_ids);
  assert.notEqual(first.jobs.find(job => job.status === 'planned').watch_id, next.jobs.find(job => job.status === 'planned').watch_id);
  assert.deepEqual(first.jobs.map(job => job.order), [1, 2]);
});

test('a watch larger than the whole budget is explicitly deferred for manual adjustment', t => {
  const watch = config('large', 'ai', 'agents');
  watch.queries.push({ id: 'other', query: 'another query' });
  const root = fixture(t, [watch]), output = join(root, 'batch');
  const batch = writeBatchPlan(root, date, output, 1);
  assert.equal(batch.jobs[0].deferred_reason, 'over_budget_single_watch');
  assert.match(batch.jobs[0].reason, /manually/);
  const built = reportBatch(join(output, 'batch.json'));
  assert.match(built.report, /over\\_budget\\_single\\_watch/);
  assert.match(built.report, /本週處理次序：large/);
  assert.equal(built.summary.complete, false);
});
