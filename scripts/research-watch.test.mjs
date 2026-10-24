import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { sourceId } from './research-pool.mjs';
import { createPlan, buildReport, writeReport, loadSnapshot, listWatchlists, validateConfig } from './research-watch.mjs';

const config = { id: 'joyama', title: '城山', category: 'climbing', topic: 'crags', tags: ['joyama'], article_paths: ['article.md'], place_terms: ['城山'], queries: [{ id: 'open', query: '城山 クライミング', route: 'Missing' }], known_pages: [], channel_limit: 8, query_limit: 4 };
const taxonomy = { categories: [{ id: 'climbing', label: '攀岩', topics: [{ id: 'crags', label: '岩場' }] }, { id: 'ai', label: 'AI', topics: [{ id: 'agents', label: 'Agents' }] }, { id: 'tech', label: '技術', topics: [{ id: 'devtools', label: '開發工具' }] }], sourceTypes: ['channel', 'video', 'web-page', 'paper', 'organization', 'repository', 'documentation'] };
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

test('generic tech watch rotates repositories and documentation using a shared source budget', () => {
  const types = ['repository', 'documentation', 'repository', 'documentation'];
  const snap = snapshot(types.map((type, i) => source(`https://example.com/tech/${i}`, { source_type: type, categories: ['tech'], topics: ['devtools'], tags: ['runtime'] })));
  const watch = { ...config, id: 'runtime-tools', category: 'tech', topic: 'devtools', tags: ['runtime'], context_terms: ['runtime'], place_terms: undefined, queries: [], known_source_types: ['repository', 'documentation'], source_limit: 2 };
  const first = createPlan(watch, '2026-10-24', snap), next = createPlan(watch, '2026-10-31', snap);
  assert.equal(first.known_source_count, 4);
  assert.equal(first.selected_source_count, 2);
  assert.equal(first.source_limit, 2);
  assert.ok(first.requests.every(r => r.kind === 'source' && types.includes(r.source_type)));
  assert.equal(new Set([...first.requests, ...next.requests].map(r => r.source_id)).size, 4);
  assert.equal(first.selected_channel_count, 0);
});

test('AI watch defaults to every taxonomy source type and papers are new sources, not inferred authors', () => {
  const snap = snapshot([
    source('https://example.com/paper', { source_type: 'paper', categories: ['ai'], topics: ['agents'], tags: [] }),
    source('https://example.com/lab', { source_type: 'organization', categories: ['ai'], topics: ['agents'], tags: [] }),
  ]);
  const watch = { ...config, id: 'ai-agents', category: 'ai', topic: 'agents', tags: [], place_terms: undefined, channel_limit: undefined, queries: [{ id: 'open', query: 'agent research papers' }] };
  const p = createPlan(watch, '2026-10-24', snap);
  assert.deepEqual(p.requests.filter(r => r.kind === 'source').map(r => r.source_type).sort(), ['organization', 'paper']);
  assert.equal(p.source_limit, 8);
  const built = buildReport(p, evidence(p, [{ url: 'https://example.com/new-paper', title: 'New paper', source_type: 'paper' }]), snap);
  assert.equal(built.summary.new_sources, 1);
  assert.equal(built.summary.candidates[0].creator_source_id, undefined);
  assert.doesNotMatch(built.report, /新作者|new author|new creator/i);
  assert.match(built.report, /新增 1 個來源/);
});

test('source_limit takes precedence over legacy channel_limit while channel-only configuration remains compatible', () => {
  const snap = snapshot(Array.from({ length: 10 }, (_, i) => source(`https://example.com/ch/${i}`, { source_type: 'channel' })));
  const legacy = createPlan({ ...config, channel_limit: 3 }, '2026-10-24', snap);
  assert.equal(legacy.selected_source_count, 3);
  assert.equal(legacy.selected_channel_count, 3);
  assert.ok(legacy.requests.filter(r => r.kind === 'channel').every(r => r.source_type === 'channel' && r.id.startsWith('channel-src_')));
  const generic = createPlan({ ...config, source_limit: 2, channel_limit: 3, known_source_types: ['channel'] }, '2026-10-24', snap);
  assert.equal(generic.selected_source_count, 2);
  assert.throws(() => validateConfig({ ...config, source_limit: 21 }, snap), /source_limit/);
  assert.throws(() => validateConfig({ ...config, known_source_types: ['unknown'] }, snap), /source_types/);
  assert.throws(() => validateConfig({ ...config, enabled: 'yes' }, snap), /enabled/);
});

test('list validates every watch and only explicitly enabled watches enter batch output', t => {
  const root = fixture(t), directory = join(root, '.research/watchlists');
  mkdirSync(directory, { recursive: true });
  const configs = [
    { ...config, id: 'z-climbing', enabled: true },
    { ...config, id: 'a-ai', category: 'ai', topic: 'agents', enabled: false },
    { ...config, id: 'b-ai', category: 'ai', topic: 'agents' },
  ];
  for (const watch of configs) writeFileSync(join(directory, `${watch.id}.json`), JSON.stringify(watch));
  const all = listWatchlists(root);
  assert.deepEqual(all.map(w => w.id), ['a-ai', 'b-ai', 'z-climbing']);
  assert.equal(all.find(w => w.id === 'b-ai').enabled, false);
  assert.deepEqual(listWatchlists(root, true).map(w => w.id), ['z-climbing']);
  const script = fileURLToPath(new URL('./research-watch.mjs', import.meta.url));
  const cli = spawnSync(process.execPath, [script, 'list', '--enabled', '--root', root, '--json'], { encoding: 'utf8' });
  assert.equal(cli.status, 0, cli.stderr);
  assert.deepEqual(JSON.parse(cli.stdout).map(w => w.id), ['z-climbing']);
  writeFileSync(join(directory, 'bad-disabled.json'), JSON.stringify({ ...config, id: 'bad-disabled', category: 'unknown', enabled: false }));
  assert.throws(() => listWatchlists(root, true), /category\/topic/);
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
  assert.match(built.report, /來源涵蓋未確認/);
  assert.match(built.report, /查詢脈絡（不代表來源涵蓋）：Missing/);
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

test('paper watch report does not impose climbing route framing', () => {
  const snap = snapshot();
  const p = createPlan({ ...config, title: 'Agent paper watch', category: 'ai', topic: 'agents', place_terms: undefined, context_terms: ['agents'], queries: [{ id: 'papers', query: 'agent papers' }] }, '2026-10-24', snap);
  const built = buildReport(p, evidence(p, [{ ...result(), source_type: 'paper' }]), snap);
  assert.doesNotMatch(built.report, /來源路線|路線／理由/);
  assert.match(built.report, /主題脈絡／待查理由/);
  assert.equal(built.sources[0].source_type, 'paper');
});

function settings(root, overrides = {}) {
  writeFileSync(join(root, '.research/watch-config.json'), JSON.stringify({ enabled: true, auto_pool_topics: true, source_limit: 4, query_limit: 2, disabled_topics: [], ...overrides }));
}

test('automatic watches follow populated pool topics across categories and grow with new research', t => {
  const rows = [source('https://example.com/crag'), source('https://example.com/agent-paper', { categories: ['ai'], topics: ['agents'], source_type: 'paper', tags: [] })];
  const root = fixture(t, snapshot(rows));
  settings(root);
  const watches = listWatchlists(root, true);
  assert.deepEqual(watches.map(watch => watch.id), ['ai-agents', 'climbing-crags']);
  assert.ok(watches.every(watch => watch.origin === 'pool-topic' && watch.enabled && watch.source_limit === 4 && watch.query_limit === 2));
  assert.ok(watches.every(watch => watch.article_paths.length === 0 && watch.tags.length === 0));
  assert.ok(watches.every(watch => watch.known_source_types.length === taxonomy.sourceTypes.length && watch.queries.length === 2));
  assert.ok(watches.every(watch => !/2026|城山|joyama/i.test(watch.queries.map(query => query.query).join(' '))));
  const aiPlan = createPlan(watches[0], '2026-10-24', loadSnapshot(root));
  assert.equal(aiPlan.requests[0].source_type, 'paper');
  assert.equal(aiPlan.requests[0].kind, 'source');
  assert.equal(aiPlan.requests.filter(request => request.kind === 'query').length, 2);
  writeFileSync(join(root, '.research/pool/tech/sources.jsonl'), JSON.stringify(source('https://example.com/tool-docs', { categories: ['tech'], topics: ['devtools'], source_type: 'documentation', tags: [] })) + '\n');
  assert.deepEqual(listWatchlists(root, true).map(watch => watch.id), ['ai-agents', 'climbing-crags', 'tech-devtools']);
});

test('a disabled place watch does not suppress automatic category/topic research', t => {
  const root = fixture(t, snapshot([source('https://example.com/crag')]));
  settings(root);
  mkdirSync(join(root, '.research/watchlists'));
  writeFileSync(join(root, '.research/watchlists/joyama.json'), JSON.stringify({ ...config, enabled: false }));
  assert.deepEqual(listWatchlists(root, true).map(watch => watch.id), ['climbing-crags']);
  const all = listWatchlists(root);
  assert.equal(all.find(watch => watch.id === 'joyama').origin, 'watchlist');
  assert.equal(all.find(watch => watch.id === 'joyama').enabled, false);
});

test('enabled explicit topic settings override automatic defaults without duplicate coverage', t => {
  const root = fixture(t, snapshot([source('https://example.com/crag')]));
  settings(root);
  mkdirSync(join(root, '.research/watchlists'));
  writeFileSync(join(root, '.research/watchlists/joyama.json'), JSON.stringify({ ...config, enabled: true, source_limit: 1 }));
  const active = listWatchlists(root, true);
  assert.equal(active.length, 1);
  assert.equal(active[0].id, 'joyama');
  assert.equal(active[0].origin, 'watchlist');
  assert.equal(active[0].source_limit, 1);
  assert.equal(active[0].queries[0].query, config.queries[0].query);
});

test('automatic topic exclusions and global controls do not fabricate empty watches', t => {
  const root = fixture(t, snapshot([source('https://example.com/crag'), source('https://example.com/paper', { categories: ['ai'], topics: ['agents'], source_type: 'paper', tags: [] })]));
  settings(root, { disabled_topics: ['climbing/crags'] });
  assert.deepEqual(listWatchlists(root, true).map(watch => watch.id), ['ai-agents']);
  settings(root, { auto_pool_topics: false });
  assert.deepEqual(listWatchlists(root, true), []);
  mkdirSync(join(root, '.research/watchlists'));
  writeFileSync(join(root, '.research/watchlists/joyama.json'), JSON.stringify({ ...config, enabled: true }));
  settings(root, { enabled: false });
  assert.deepEqual(listWatchlists(root, true), []);
  assert.equal(listWatchlists(root)[0].enabled, false);
});

test('automatic settings reject malformed controls, limits and taxonomy exclusions', t => {
  const root = fixture(t);
  for (const invalid of [
    { enabled: 'yes' }, { auto_pool_topics: 1 }, { source_limit: 0 }, { source_limit: 21 },
    { query_limit: 0 }, { query_limit: 3 }, { source_limit: null }, { query_limit: '2' }, { disabled_topics: null }, { disabled_topics: 'ai/agents' },
    { disabled_topics: ['ai/agents', 'ai/agents'] }, { disabled_topics: ['unknown/agents'] },
    { disabled_topics: ['ai/unknown'] }, { disabled_topics: ['ai/agents/'] },
  ]) {
    settings(root, invalid);
    assert.throws(() => listWatchlists(root, true), /watch-config|disabled topic/);
  }
});

test('a disabled explicit watch with the generated topic id yields to automatic research', t => {
  const root = fixture(t, snapshot([source('https://example.com/crag')]));
  settings(root);
  mkdirSync(join(root, '.research/watchlists'));
  writeFileSync(join(root, '.research/watchlists/climbing-crags.json'), JSON.stringify({ ...config, id: 'climbing-crags', enabled: false }));
  const watches = listWatchlists(root);
  assert.equal(watches.length, 1);
  assert.equal(watches[0].id, 'climbing-crags');
  assert.equal(watches[0].origin, 'pool-topic');
  assert.equal(watches[0].enabled, true);
});
