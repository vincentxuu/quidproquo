import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { archiveBatch, main } from './research-watch-archive.mjs';
import { sourceId } from './research-pool.mjs';

const date = '2026-10-24';
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const writeJson = (path, value) => writeFileSync(path, JSON.stringify(value) + '\n');
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'watch-archive-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const base = join(root, '.work/run');
  mkdirSync(base, { recursive: true }); mkdirSync(join(root, '.research/pool/runs'), { recursive: true });
  const batch = { version: 1, batch_id: `${date}-research-watch-batch`, date, max_requests: 32,
    enabled_watch_count: 2, planned_requests: 2, execution_order: ['agents', 'devtools'], jobs: [] };
  for (const [index, [id, category, topic, sourceType]] of [['agents', 'ai', 'agents', 'paper'], ['devtools', 'tech', 'devtools', 'documentation']].entries()) {
    const directory = join(base, id); mkdirSync(directory);
    const run = `${date}-${id}-watch`, url = `https://example.org/${id}`;
    batch.jobs.push({ order: index + 1, watch_id: id, title: id, category, topic, run_id: run, request_count: 1,
      status: 'planned', plan_path: `${id}/plan.json`, summary_path: `${id}/summary.json`, deferred_reason: null, reason: '' });
    writeJson(join(directory, 'plan.json'), { version: 1, date, run_id: run, watch: { id, category, topic }, requests: [{ id: 'q', query: id }] });
    writeJson(join(directory, 'summary.json'), { run_id: run, date, planned_requests: 1, completed_requests: 1,
      failed_requests: 0, missing_requests: [], complete: true, new_sources: 1, known_sources: 0, candidates: [{ id: sourceId(url), known: false }] });
    writeFileSync(join(directory, 'sources.jsonl'), JSON.stringify({ url, title: `Public ${id}`, source_type: sourceType,
      read_status: 'snippet', coverage: 'Search titles only', tool: 'test-tool', evidence_refs: ['.work/old/report.md'],
      categories: [category], topics: [topic], tags: [], aliases: [], observed_at: date, decision: 'candidate', reason: 'Review next', used_in: [], metadata: {} }) + '\n');
    writeFileSync(join(directory, 'searches.jsonl'), JSON.stringify({ query: id, tool: 'test-tool', scope: 'Top one title', result_urls: [url], gap: '' }) + '\n');
    writeFileSync(join(directory, 'report.md'), `# ${id} candidate\nNot fully read.\n`);
    writeJson(join(directory, 'results.json'), { raw_tool_envelope: 'DO-NOT-ARCHIVE-RAW-RESULTS' });
  }
  const batchFile = join(base, 'batch.json'); writeJson(batchFile, batch);
  return { root, base, batchFile, output: join(root, '.research/pool/runs/unified.json') };
}

function sourceBytes(f) { return ['agents', 'devtools'].map(id => readFileSync(join(f.base, id, 'sources.jsonl'), 'utf8')); }

test('two topics compact into one durable file and runtime refs point to it', t => {
  const f = fixture(t), archive = archiveBatch(f.root, f.batchFile, f.output);
  assert.equal(archive.watches.length, 2);
  assert.equal(archive.summary.new_sources, 2);
  assert.equal(archive.watches[0].sources[0].source_type, 'paper');
  assert.equal(archive.watches[1].sources[0].source_type, 'documentation');
  for (const watch of archive.watches) {
    assert.deepEqual(watch.sources[0].evidence_refs, ['.research/pool/runs/unified.json']);
    const source = JSON.parse(readFileSync(join(f.base, watch.watch_id, 'sources.jsonl'), 'utf8'));
    assert.deepEqual(source.evidence_refs, watch.sources[0].evidence_refs);
  }
  assert.equal(readFileSync(f.output, 'utf8').includes('DO-NOT-ARCHIVE-RAW-RESULTS'), false);
  assert.equal(json(f.output).summary.complete, true);
  // Re-archiving the same batch is safe and preserves one archive identity.
  archiveBatch(f.root, f.batchFile, f.output);
  assert.equal(json(f.output).batch.batch_id, archive.batch.batch_id);
});

test('missing summary remains pending and does not archive stale candidate artifacts', t => {
  const f = fixture(t);
  unlinkSync(join(f.base, 'devtools/summary.json'));
  const before = sourceBytes(f)[1], archive = archiveBatch(f.root, f.batchFile, f.output);
  const pending = archive.watches.find(watch => watch.watch_id === 'devtools');
  assert.equal(archive.summary.complete, false);
  assert.equal(pending.status, 'pending');
  assert.equal(pending.summary, null);
  assert.deepEqual(pending.sources, []);
  assert.deepEqual(pending.searches, []);
  assert.equal(pending.report, null);
  assert.equal(sourceBytes(f)[1], before);
});

test('missing late input leaves archive absent and every runtime source unchanged', t => {
  const f = fixture(t), before = sourceBytes(f);
  unlinkSync(join(f.base, 'devtools/report.md'));
  assert.throws(() => archiveBatch(f.root, f.batchFile, f.output), /Missing archive input/);
  assert.equal(existsSync(f.output), false);
  assert.deepEqual(sourceBytes(f), before);
});

test('invalid later JSONL leaves prior archive and runtime sources untouched', t => {
  const f = fixture(t); archiveBatch(f.root, f.batchFile, f.output);
  const previous = readFileSync(f.output, 'utf8'), before = sourceBytes(f);
  writeFileSync(join(f.base, 'devtools/searches.jsonl'), JSON.stringify({ query: null, tool: 'tool', scope: '', result_urls: [] }) + '\n');
  assert.throws(() => archiveBatch(f.root, f.batchFile, f.output), /Malformed prepared search/);
  assert.equal(readFileSync(f.output, 'utf8'), previous);
  assert.deepEqual(sourceBytes(f), before);
});

test('input symlink escaping batch is rejected before writes', t => {
  const f = fixture(t), before = sourceBytes(f), outside = join(f.root, 'outside.md');
  writeFileSync(outside, 'Outside batch'); unlinkSync(join(f.base, 'devtools/report.md'));
  symlinkSync(outside, join(f.base, 'devtools/report.md'));
  assert.throws(() => archiveBatch(f.root, f.batchFile, f.output), /symlink escapes/);
  assert.equal(existsSync(f.output), false);
  assert.deepEqual(sourceBytes(f), before);
});

test('output outside research, output symlink escape and unrelated overwrite are rejected', t => {
  const f = fixture(t), before = sourceBytes(f);
  assert.throws(() => archiveBatch(f.root, f.batchFile, join(f.root, 'outside.json')), /under repository .research/);
  const outsideDirectory = join(f.root, 'outside-dir'); mkdirSync(outsideDirectory);
  symlinkSync(outsideDirectory, join(f.root, '.research/escape'));
  assert.throws(() => archiveBatch(f.root, f.batchFile, join(f.root, '.research/escape/result.json')), /under repository .research|Output symlink/);
  writeJson(f.output, { unrelated: true });
  const original = readFileSync(f.output, 'utf8');
  assert.throws(() => archiveBatch(f.root, f.batchFile, f.output), /overwrite unrelated/);
  assert.equal(readFileSync(f.output, 'utf8'), original);
  assert.deepEqual(sourceBytes(f), before);
});

test('plan mismatch and unsafe manifest paths do not write evidence', t => {
  const f = fixture(t), before = sourceBytes(f);
  const planPath = join(f.base, 'devtools/plan.json'), plan = json(planPath);
  writeJson(planPath, { ...plan, run_id: 'wrong' });
  assert.throws(() => archiveBatch(f.root, f.batchFile, f.output), /Plan mismatch/);
  assert.equal(existsSync(f.output), false);
  writeJson(planPath, plan);
  const batch = json(f.batchFile); batch.jobs[1].summary_path = '../private.json'; writeJson(f.batchFile, batch);
  assert.throws(() => archiveBatch(f.root, f.batchFile, f.output), /Unsafe or mismatched job paths/);
  assert.deepEqual(sourceBytes(f), before);
});

test('CLI validates explicit required inputs', () => {
  assert.equal(main(['--batch', 'missing']), 1);
  assert.equal(main(['--unexpected', 'value']), 1);
});


test('same batch changed report or source rows cannot replace historical evidence', t => {
  const f = fixture(t); archiveBatch(f.root, f.batchFile, f.output);
  const originalArchive = readFileSync(f.output, 'utf8');
  const reportPath = join(f.base, 'devtools/report.md');
  const originalReport = readFileSync(reportPath, 'utf8');
  writeFileSync(reportPath, originalReport + 'A later research observation.\n');
  let before = sourceBytes(f);
  assert.throws(() => archiveBatch(f.root, f.batchFile, f.output), /different content; use a new output filename/);
  assert.equal(readFileSync(f.output, 'utf8'), originalArchive);
  assert.deepEqual(sourceBytes(f), before);

  writeFileSync(reportPath, originalReport);
  const sourcePath = join(f.base, 'devtools/sources.jsonl');
  const row = JSON.parse(readFileSync(sourcePath, 'utf8'));
  row.title = 'Updated title from later discovery';
  writeFileSync(sourcePath, JSON.stringify(row) + '\n');
  before = sourceBytes(f);
  assert.throws(() => archiveBatch(f.root, f.batchFile, f.output), /different content; use a new output filename/);
  assert.equal(readFileSync(f.output, 'utf8'), originalArchive);
  assert.deepEqual(sourceBytes(f), before);

  const newOutput = join(f.root, '.research/pool/runs/unified-later.json');
  archiveBatch(f.root, f.batchFile, newOutput);
  assert.equal(json(newOutput).watches[1].sources[0].title, row.title);
  assert.equal(readFileSync(f.output, 'utf8'), originalArchive);
});
