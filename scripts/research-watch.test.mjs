import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { sourceId } from './research-pool.mjs';
import { createPlan, buildReport, writeReport, loadSnapshot } from './research-watch.mjs';

const config = { id: 'joyama', title: '城山', category: 'climbing', topic: 'crags', tags: ['joyama'], article_paths: ['article.md'], place_terms: ['城山'], queries: [{ id: 'open', query: '城山 クライミング', route: 'Missing' }], known_pages: [], channel_limit: 8, query_limit: 4 };
const taxonomy = { categories: [{ id: 'climbing', label: '攀岩', topics: [{ id: 'crags', label: '岩場' }] }, { id: 'ai', label: 'AI', topics: [{ id: 'agents', label: 'Agents' }] }], sourceTypes: ['channel', 'video', 'web-page', 'paper'] };
const source = (url, extra = {}) => ({ id: sourceId(url), canonical_url: url, url, title: 'Saved', source_type: 'video', categories: ['climbing'], topics: ['crags'], tags: ['joyama'], aliases: [], metadata: {}, ...extra });
const snapshot = (sources = [], observations = []) => ({ taxonomy, sources, observations });
const plan = snap => createPlan(config, '2026-10-24', snap);
const result = (url = 'https://youtu.be/zCYhFu-EqjI') => ({ url, title: '城山 [candidate]\n| item', source_type: 'video' });
const evidence = (p, results = [result()]) => ({ requests: [{ request_id: p.requests.at(-1).id, tool: 'actual-search', status: 'ok', coverage: 'First five public search cards, snippet only.', results }] });
function fixture(t, snap = snapshot()) {
  const root = mkdtempSync(join(tmpdir(), 'watch-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, '.research/pool/climbing'), { recursive: true });
  writeFileSync(join(root, '.research/pool/taxonomy.json'), JSON.stringify(taxonomy));
  for (const c of taxonomy.categories) {
    mkdirSync(join(root, '.research/pool', c.id), { recursive: true });
    for (const [name, rows] of [['sources', snap.sources.filter(s => s.categories.includes(c.id))], ['observations', snap.observations], ['searches', []]]) {
      if (name === 'observations' && c.id !== 'climbing') continue;
      writeFileSync(join(root, '.research/pool', c.id, `${name}.jsonl`), rows.map(JSON.stringify).join('\n') + (rows.length ? '\n' : ''));
    }
  }
  return root;
}

test('weekly stable rotation covers every channel without duplicates, year boundary stays monotonic', () => {
  const snap = snapshot(Array.from({ length: 61 }, (_, i) => source(`https://example.com/channel/${i}`, { source_type: 'channel' })));
  const first = plan(snap), same = createPlan(config, '2026-10-25', snap);
  assert.deepEqual(first.requests, same.requests);
  assert.equal(new Set(first.requests.filter(r => r.kind === 'channel').map(r => r.id)).size, 8);
  const all = new Set();
  for (let i = 0; i < 8; i++) {
    const date = new Date(Date.UTC(2026, 9, 24 + 7 * i)).toISOString().slice(0, 10);
    createPlan(config, date, snap).requests.filter(r => r.kind === 'channel').forEach(r => all.add(r.id));
  }
  assert.equal(all.size, 61);
  const a = createPlan(config, '2026-12-28', snap), b = createPlan(config, '2027-01-04', snap);
  assert.equal(b.rotation_week, a.rotation_week + 1);
  assert.throws(() => createPlan(config, '2026-02-30', snap), /calendar/);
});

test('canonical and saved aliases deduplicate across requests; markdown and status stay honest', () => {
  const saved = source('https://www.youtube.com/@known', { source_type: 'channel', aliases: ['https://www.youtube.com/channel/UC123'] });
  const snap = snapshot([saved]);
  const p = plan(snap);
  const input = evidence(p, [result('https://www.youtube.com/channel/UC123'), result('https://www.youtube.com/@KNOWN/videos')]);
  const built = buildReport(p, input, snap);
  assert.equal(built.sources.length, 1);
  assert.equal(built.sources[0].url, saved.canonical_url);
  assert.equal(built.summary.known_sources, 1);
  assert.equal(built.summary.new_sources, 0);
  const newBuilt = buildReport(p, evidence(p), snap);
  assert.match(newBuilt.report, /\\\[candidate\\\]/);
  assert.match(newBuilt.report, /\\\| item/);
  assert.equal(newBuilt.sources[0].read_status, 'snippet');
  assert.deepEqual(newBuilt.sources[0].used_in, []);
});

test('missing requests and failed attempts remain incomplete, distinct from bounded zero results', () => {
  const p = createPlan({ ...config, known_pages: ['https://example.com/author'] }, '2026-10-24', snapshot());
  let built = buildReport(p, evidence(p, []), snapshot());
  assert.equal(built.summary.complete, false);
  assert.deepEqual(built.summary.missing_requests, ['page-1']);
  assert.match(built.searches[0].gap, /bounded/);
  const input = evidence(p, []);
  input.requests.push({ request_id: 'page-1', tool: 'fetch', status: 'failed', coverage: 'HTTP attempt only.', error: '403 Forbidden', results: [] });
  built = buildReport(p, input, snapshot());
  assert.equal(built.summary.missing_requests.length, 0);
  assert.equal(built.summary.failed_requests, 1);
  assert.equal(built.summary.complete, false);
});

test('cross-category source is reused and explicit prior rejection/selection is protected', () => {
  const saved = source('https://example.com/paper', { categories: ['ai'], topics: ['agents'], source_type: 'paper' });
  for (const decision of ['rejected', 'selected']) {
    const snap = snapshot([saved], [{ source_id: saved.id, observed_at: '2026-10-23', decision, used_in: [] }]);
    const built = buildReport(plan(snap), evidence(plan(snap), [{ ...result(saved.url), source_type: 'paper' }]), snap);
    assert.equal(built.summary.known_sources, 1);
    assert.equal(built.sources[0].decision, decision);
    assert.deepEqual(built.sources[0].used_in, []);
  }
});

test('route gaps require explicit coverage data; new outsider ranks before known source', () => {
  const saved = source('https://example.com/old');
  const snap = snapshot([saved]);
  let built = buildReport(plan(snap), evidence(plan(snap), [result(saved.url), result()]), snap);
  assert.equal(built.summary.candidates[0].known, false);
  assert.equal(built.summary.candidates[0].uncovered_route, false);
  const p = createPlan({ ...config, covered_routes: ['Other'] }, '2026-10-24', snap);
  built = buildReport(p, evidence(p, [{ ...result(), route: 'Missing' }]), snap);
  assert.equal(built.summary.candidates[0].uncovered_route, true);
  assert.equal(built.summary.candidates[0].priority, 0);
});

test('route-targeted query cannot label a general index as a route source or uncovered route', () => {
  const snap = snapshot();
  const p = createPlan({ ...config, covered_routes: ['Other'] }, '2026-10-24', snap);
  const built = buildReport(p, evidence(p, [{ url: 'https://example.com/all-routes', title: 'General crag route index', source_type: 'web-page' }]), snap);
  const candidate = built.summary.candidates[0];
  assert.equal(candidate.source_route, null);
  assert.deepEqual(candidate.query_routes, ['Missing']);
  assert.equal(candidate.uncovered_route, false);
  assert.notEqual(candidate.priority, 0);
  assert.equal(built.sources[0].metadata.source_route, undefined);
  assert.equal(built.sources[0].metadata.route, undefined);
  assert.deepEqual(built.sources[0].metadata.query_routes, ['Missing']);
  assert.match(built.report, /來源路線未確認/);
  assert.match(built.report, /查詢脈絡（非來源路線）：Missing/);
});

test('actual fallback query is preserved instead of the planned search text', () => {
  const p = plan(snapshot()), input = evidence(p, []);
  input.requests[0].query = 'https://example.com/actual-source-feed';
  const built = buildReport(p, input, snapshot());
  assert.equal(built.searches[0].query, input.requests[0].query);
  assert.notEqual(built.searches[0].query, p.requests[0].query);
});

test('invalid evidence rejects all writes and output generation', t => {
  const root = fixture(t), p = plan(loadSnapshot(root));
  const original = readFileSync(join(root, '.research/pool/climbing/sources.jsonl'), 'utf8');
  for (const bad of [
    { requests: [{ ...evidence(p).requests[0], request_id: 'invented' }] },
    { requests: [evidence(p).requests[0], evidence(p).requests[0]] },
    evidence(p, [result(), { ...result('file:///private'), title: 'Bad' }]),
    evidence(p, [result(), { ...result(), source_type: 'invented' }]),
    { requests: [{ ...evidence(p).requests[0], coverage: '' }] },
  ]) {
    assert.throws(() => writeReport(root, join(root, 'out'), p, bad, true));
    assert.equal(readFileSync(join(root, '.research/pool/climbing/sources.jsonl'), 'utf8'), original);
    assert.equal(existsSync(join(root, 'out')), false);
  }
});

test('pool writes are explicit and replay is idempotent without overwriting prior observations', t => {
  const root = fixture(t), p = plan(loadSnapshot(root)), input = evidence(p);
  writeReport(root, join(root, 'report'), p, input);
  assert.equal(loadSnapshot(root).sources.length, 0);
  writeReport(root, join(root, 'report'), p, input, true);
  const once = readFileSync(join(root, '.research/pool/climbing/observations.jsonl'), 'utf8');
  writeReport(root, join(root, 'report'), p, input, true);
  const twice = readFileSync(join(root, '.research/pool/climbing/observations.jsonl'), 'utf8');
  // Rediscovery wording changes if the report is rebuilt against the now-known source;
  // exact run replays must still remain a single candidate observation.
  assert.equal(twice, once);
  assert.equal(loadSnapshot(root).sources.length, 1);
});

test('report output I/O failure leaves all real pool files unchanged', t => {
  const root = fixture(t), p = plan(loadSnapshot(root)), input = evidence(p);
  const before = Object.fromEntries(['sources', 'observations', 'searches'].map(name => [name, readFileSync(join(root, '.research/pool/climbing', `${name}.jsonl`), 'utf8')]));
  // Fail after report.md and summary.json have been written, proving that the
  // entire artifact set, not just its directory, must persist before pool apply.
  mkdirSync(join(root, 'blocked-report/sources.jsonl'), { recursive: true });
  assert.throws(() => writeReport(root, join(root, 'blocked-report'), p, input, true), /EISDIR|illegal operation/i);
  assert.equal(existsSync(join(root, 'blocked-report/report.md')), true);
  for (const name of ['sources', 'observations', 'searches']) {
    assert.equal(readFileSync(join(root, '.research/pool/climbing', `${name}.jsonl`), 'utf8'), before[name]);
  }
  const outputParent = join(root, 'not-a-directory');
  writeFileSync(outputParent, 'occupied');
  assert.throws(() => writeReport(root, join(outputParent, 'report'), p, input, true));
  assert.equal(loadSnapshot(root).sources.length, 0);
  assert.equal(loadSnapshot(root).observations.length, 0);
});
