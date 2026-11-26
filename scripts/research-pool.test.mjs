import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { canonicalizeUrl, sourceId } from './research-pool.mjs';

const SCRIPT = fileURLToPath(new URL('./research-pool.mjs', import.meta.url));
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'research-pool-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, '.research/pool'), { recursive: true });
  writeFileSync(join(root, '.research/pool/taxonomy.json'), JSON.stringify({
    categories: [
      { id: 'climbing', label: '攀岩', topics: [{ id: 'crags', label: '岩場' }] },
      { id: 'ai', label: 'AI', topics: [{ id: 'agents', label: 'Agents' }, { id: 'rag', label: 'RAG' }] },
    ],
    sourceTypes: ['video', 'channel', 'web-page', 'paper', 'documentation'],
  }));
  return root;
}
function cli(root, args, { ok = true } = {}) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args, '--root', root], { encoding: 'utf8' });
  if (ok) assert.equal(result.status, 0, result.stderr || result.stdout);
  else assert.notEqual(result.status, 0, result.stdout);
  return result;
}
function input(root, name, rows) {
  const path = join(root, name);
  writeFileSync(path, rows.map(row => typeof row === 'string' ? row : JSON.stringify(row)).join('\n') + '\n');
  return path;
}
function ingest(root, path, run = 'run-1', options = []) {
  return cli(root, ['ingest', '--input', path, '--category', 'climbing', '--topic', 'crags', '--research', run, ...options]);
}
function records(root, category, kind) {
  const text = readFileSync(join(root, '.research/pool', category, `${kind}.jsonl`), 'utf8');
  return text.split('\n').filter(Boolean).map(line => JSON.parse(line));
}
function snapshot(root) {
  const out = {};
  function visit(path) {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const next = join(path, entry.name);
      if (entry.isDirectory()) visit(next);
      else out[next.slice(root.length)] = readFileSync(next, 'utf8');
    }
  }
  visit(root);
  return out;
}
const video = { url: 'https://youtu.be/zCYhFu-EqjI?t=12', title: '城山 スタートレック', source_type: 'video', observed_at: '2026-10-24' };

test('canonical identity merges YouTube URL variants and known tracking, preserves general URL semantics', () => {
  const canonical = 'https://www.youtube.com/watch?v=zCYhFu-EqjI';
  for (const url of [video.url, canonical + '&utm_source=foo#t=4', 'https://m.youtube.com/shorts/zCYhFu-EqjI?feature=share', 'https://www.youtube-nocookie.com/embed/zCYhFu-EqjI']) {
    assert.equal(canonicalizeUrl(url), canonical);
    assert.equal(sourceId(url), sourceId(canonical));
  }
  assert.match(sourceId(canonical), /^src_[a-f0-9]{20}$/);
  assert.equal(canonicalizeUrl('https://www.youtube.com/@TAKEMOVIE/videos?view=0'), 'https://www.youtube.com/@takemovie');
  assert.equal(canonicalizeUrl('https://www.example.com/page?z=2&utm_campaign=x&a=1&fbclid=y#section'), 'https://www.example.com/page?a=1&z=2');
  assert.notEqual(sourceId('https://example.com/a?version=1'), sourceId('https://example.com/a?version=2'));
  assert.notEqual(sourceId('https://example.com/a'), sourceId('https://www.example.com/a'));
  for (const url of ['file:///secret', 'javascript:alert(1)', 'https://user:password@example.com/', 'nope']) assert.throws(() => canonicalizeUrl(url));
});

test('importing the module has no CLI side effects', () => {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `await import(${JSON.stringify(new URL('./research-pool.mjs', import.meta.url).href)});`], { encoding: 'utf8' });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, '');
});

test('ingest defaults to dry-run without creating pool files or directories', t => {
  const root = fixture(t);
  const path = input(root, 'input.jsonl', [video]);
  const before = snapshot(root);
  const result = JSON.parse(ingest(root, path).stdout);
  assert.equal(result.mode, 'dry-run');
  assert.equal(result.addedSources, 1);
  assert.equal(result.addedObservations, 1);
  assert.deepEqual(snapshot(root), before);
});

test('cross-run observations preserve full and partial scopes without globally upgrading source reading', t => {
  const root = fixture(t);
  const first = input(root, 'first.jsonl', [{ ...video, read_status: 'read', coverage: 'Complete authored page, sections 1–4.', tool: 'manual' }]);
  ingest(root, first, 'run-full', ['--write']);
  const firstObservation = records(root, 'climbing', 'observations')[0];
  const second = input(root, 'second.jsonl', [{ ...video, url: 'https://www.youtube.com/shorts/zCYhFu-EqjI', read_status: 'partial', coverage: 'Description only.', tool: 'search' }]);
  ingest(root, second, 'run-partial', ['--write']);
  const sources = records(root, 'climbing', 'sources');
  assert.equal(sources.length, 1);
  assert.equal(sources[0].read_status, undefined);
  assert.ok(sources[0].aliases.includes(video.url));
  assert.ok(sources[0].aliases.includes('https://www.youtube.com/shorts/zCYhFu-EqjI'));
  const observations = records(root, 'climbing', 'observations');
  assert.equal(observations.length, 2);
  assert.deepEqual(observations[0], firstObservation);
  assert.deepEqual(observations.map(row => row.read_status), ['read', 'partial']);
  assert.equal(observations[0].run_id, 'run-full');
  assert.equal(observations[1].run_id, 'run-partial');
  ingest(root, second, 'run-partial', ['--write']);
  assert.equal(records(root, 'climbing', 'observations').length, 2, 'identical observation replay must be idempotent');
});

test('invalid second row is rejected before any writes, including an existing pool', t => {
  const root = fixture(t);
  ingest(root, input(root, 'seed.jsonl', [video]), 'seed', ['--write']);
  for (const invalid of [
    '{broken json',
    { url: 'file:///bad', title: 'Bad' },
    { url: 'https://example.com/bad', title: 'Bad', read_status: 'read' },
    { url: 'https://example.com/bad', title: 'Bad', tags: 'not-an-array' },
  ]) {
    const path = input(root, 'invalid.jsonl', [{ url: 'https://example.com/new', title: 'New' }, invalid]);
    const before = snapshot(root);
    cli(root, ['ingest', '--input', path, '--category', 'climbing', '--topic', 'crags', '--research', 'broken-run', '--write'], { ok: false });
    assert.deepEqual(snapshot(root), before);
  }
});

test('cross-category reuse stores one physical source and searches honor category/topic/type/query/limit', t => {
  const root = fixture(t);
  const path = input(root, 'first.jsonl', [video]);
  ingest(root, path, 'climbing-run', ['--write']);
  cli(root, ['ingest', '--input', path, '--category', 'ai', '--topic', 'agents', '--research', 'ai-run', '--write']);
  assert.equal(records(root, 'climbing', 'sources').length, 1);
  assert.equal(records(root, 'ai', 'sources').length, 0);
  assert.deepEqual(records(root, 'climbing', 'sources')[0].categories, ['climbing', 'ai']);
  assert.equal(records(root, 'ai', 'observations').length, 1);
  const result = JSON.parse(cli(root, ['search', '--category', 'ai', '--topic', 'agents', '--type', 'video', '--query', 'スタートレック', '--limit', '1', '--json']).stdout);
  assert.equal(result.total, 1);
  assert.equal(result.results.length, 1);
  assert.equal(result.results[0].observations.length, 2);
  const empty = JSON.parse(cli(root, ['search', '--category', 'ai', '--topic', 'rag', '--json']).stdout);
  assert.equal(empty.total, 0);
  assert.equal(JSON.parse(cli(root, ['search', '--type', 'paper', '--json']).stdout).total, 0);
  cli(root, ['search', '--category', 'ai', '--topic', 'crags'], { ok: false });
  assert.equal(JSON.parse(cli(root, ['check', '--json']).stdout).sources, 1);
});

test('legacy registration adapts unknown source types and queued/skipped without pretending to read', t => {
  const root = fixture(t);
  const path = input(root, 'legacy.jsonl', [
    { url: 'https://example.com/queued', title: 'Queued', source_type: 'official', read_status: 'queued', tried: 'search excerpt', reason: 'read later' },
    { url: 'https://example.com/skipped', title: 'Skipped', source_type: 'media', read_status: 'skipped', reason: 'duplicate explanation' },
  ]);
  ingest(root, path, 'legacy', ['--write']);
  const sources = records(root, 'climbing', 'sources');
  assert.equal(sources[0].source_type, 'web-page');
  assert.equal(sources[0].metadata.original_source_type, 'official');
  assert.equal(sources[0].metadata.original_read_status, 'queued');
  const observations = records(root, 'climbing', 'observations');
  assert.ok(observations.every(row => row.read_status === 'snippet' && row.tool === 'unknown'));
  assert.equal(observations[1].decision, 'rejected');
  assert.match(observations[0].reason, /read later.*\nTried: search excerpt/);
});

test('check rejects duplicate canonical sources and broken cross-file references, ignores run metadata', t => {
  const root = fixture(t);
  ingest(root, input(root, 'seed.jsonl', [video]), 'seed', ['--write']);
  mkdirSync(join(root, '.research/pool/runs'));
  writeFileSync(join(root, '.research/pool/runs/run.json'), '{"arbitrary":"run metadata"}');
  cli(root, ['check']);
  const path = join(root, '.research/pool/climbing/sources.jsonl');
  const before = readFileSync(path, 'utf8');
  writeFileSync(path, before + before);
  assert.match(cli(root, ['check'], { ok: false }).stderr, /Duplicate source ID/);
  writeFileSync(path, before);
  const observationPath = join(root, '.research/pool/climbing/observations.jsonl');
  const observation = records(root, 'climbing', 'observations')[0];
  observation.source_id = 'src_missing';
  writeFileSync(observationPath, JSON.stringify(observation) + '\n');
  assert.match(cli(root, ['check'], { ok: false }).stderr, /unknown source/);
});

test('check validates search references and classification', t => {
  const root = fixture(t);
  ingest(root, input(root, 'seed.jsonl', [video]), 'seed', ['--write']);
  const search = {
    id: 'search-1', run_id: 'run-1', searched_at: '2026-10-24', categories: ['climbing'], topics: ['crags'],
    query: '城山 スタートレック', tool: 'youtube', scope: 'first loaded results', result_source_ids: [sourceId(video.url)], gap: '',
  };
  const path = join(root, '.research/pool/climbing/searches.jsonl');
  writeFileSync(path, JSON.stringify(search) + '\n');
  assert.equal(JSON.parse(cli(root, ['check', '--json']).stdout).searches, 1);
  search.result_source_ids = ['src_missing'];
  writeFileSync(path, JSON.stringify(search) + '\n');
  assert.match(cli(root, ['check'], { ok: false }).stderr, /unknown result source/);
  search.result_source_ids = [];
  search.topics = ['agents'];
  writeFileSync(path, JSON.stringify(search) + '\n');
  assert.match(cli(root, ['check'], { ok: false }).stderr, /does not belong/);
});

test('invalid flags, bounds and classifications exit nonzero', t => {
  const root = fixture(t);
  for (const args of [
    ['search', '--limit', '0'], ['search', '--limit', '1.5'], ['search', '--limit', 'x'],
    ['search', '--query'], ['search', '--write'], ['search', '--category', '../climbing'],
    ['search', '--type', 'unknown'], ['search', '--topic', 'unknown'], ['check', '--limit', '2'],
    ['search', '--limit', '1', '--limit', '2'], ['wrong'], ['ingest', '--research', 'run'],
  ]) cli(root, args, { ok: false });
});

test('record-search resolves existing URL identities, defaults to dry-run and preserves earlier queries', t => {
  const root = fixture(t);
  ingest(root, input(root, 'seed.jsonl', [video]), 'seed', ['--write']);
  const row = { query: '城山 スタートレック', tool: 'youtube', scope: 'first 10 results', gap: 'No English-language match reviewed.', result_urls: ['https://www.youtube.com/shorts/zCYhFu-EqjI'], searched_at: '2026-10-24' };
  const path = input(root, 'queries.jsonl', [row]);
  const args = ['record-search', '--input', path, '--category', 'climbing', '--topic', 'crags', '--research', 'query-run-1'];
  const before = snapshot(root);
  const dryRun = JSON.parse(cli(root, args).stdout);
  assert.equal(dryRun.addedSearches, 1);
  assert.equal(dryRun.mode, 'dry-run');
  assert.deepEqual(snapshot(root), before);
  cli(root, [...args, '--write']);
  const oldSearch = records(root, 'climbing', 'searches')[0];
  assert.deepEqual(oldSearch.result_source_ids, [sourceId(video.url)]);
  assert.equal(oldSearch.gap, row.gap);
  assert.equal(JSON.parse(cli(root, [...args, '--write']).stdout).addedSearches, 0);
  const secondPath = input(root, 'next-queries.jsonl', [{ query: '城山 グランブルー', result_source_ids: [], gap: 'Only unrelated recommendations were loaded.', searched_at: '2026-10-25' }]);
  cli(root, ['record-search', '--input', secondPath, '--category', 'climbing', '--topic', 'crags', '--research', 'query-run-2', '--write']);
  const searches = records(root, 'climbing', 'searches');
  assert.equal(searches.length, 2);
  assert.deepEqual(searches[0], oldSearch);
  assert.equal(searches[1].tool, 'unknown');
  assert.equal(searches[1].run_id, 'query-run-2');
  assert.equal(records(root, 'climbing', 'sources').length, 1, 'search records must not create sources');
});

test('record-search refuses unknown IDs and URLs before writing any query', t => {
  const root = fixture(t);
  ingest(root, input(root, 'seed.jsonl', [video]), 'seed', ['--write']);
  for (const invalid of [
    { query: 'bad id', result_source_ids: ['src_missing'] },
    { query: 'bad URL', result_urls: ['https://example.com/not-registered'] },
    { query: 'bad URL scheme', result_urls: ['file:///private'] },
    { query: 'invalid type', result_urls: 'https://example.com/not-array' },
  ]) {
    const path = input(root, 'bad-searches.jsonl', [{ query: 'valid query', result_source_ids: [sourceId(video.url)] }, invalid]);
    const before = snapshot(root);
    cli(root, ['record-search', '--input', path, '--category', 'climbing', '--topic', 'crags', '--research', 'queries', '--write'], { ok: false });
    assert.deepEqual(snapshot(root), before);
  }
});

test('both writers reject a busy pool lock without removing it or mutating data, release owned locks on errors', t => {
  const root = fixture(t);
  const path = input(root, 'seed.jsonl', [video]);
  ingest(root, path, 'seed', ['--write']);
  const queries = input(root, 'queries.jsonl', [{ query: 'known video', result_urls: [video.url] }]);
  const lock = join(root, '.research/pool/.write.lock');
  const owner = '{"pid":999999,"token":"another-writer"}';
  writeFileSync(lock, owner);
  for (const [command, file] of [['ingest', path], ['record-search', queries]]) {
    const before = snapshot(root);
    assert.match(cli(root, [command, '--input', file, '--category', 'climbing', '--topic', 'crags', '--research', 'competing-run', '--write'], { ok: false }).stderr, /writer is busy/);
    assert.deepEqual(snapshot(root), before);
    assert.equal(readFileSync(lock, 'utf8'), owner);
  }
  rmSync(lock);
  const invalid = input(root, 'invalid.jsonl', [{ query: 'unknown source', result_source_ids: ['src_missing'] }]);
  const before = snapshot(root);
  cli(root, ['record-search', '--input', invalid, '--category', 'climbing', '--topic', 'crags', '--research', 'invalid-run', '--write'], { ok: false });
  assert.deepEqual(snapshot(root), before, 'failed command must release its own temporary lock');
  assert.equal(JSON.parse(cli(root, ['record-search', '--input', queries, '--category', 'climbing', '--topic', 'crags', '--research', 'works-after-error', '--write']).stdout).addedSearches, 1);
});

test('search can find a source through the scope and reason recorded on a later observation', t => {
  const root = fixture(t);
  const path = input(root, 'seed.jsonl', [{ ...video, reason: 'Contains approach observations not present in the title.' }]);
  ingest(root, path, 'seed', ['--write']);
  const result = JSON.parse(cli(root, ['search', '--query', 'approach observations', '--json']).stdout);
  assert.equal(result.total, 1);
});
