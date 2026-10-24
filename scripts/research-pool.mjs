#!/usr/bin/env node
/** Local public-source index. Ingest is a dry run unless --write is explicit. */
import { createHash, randomUUID } from 'node:crypto';
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, readdirSync, renameSync, writeFileSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const READ_STATUSES = new Set(['read', 'partial', 'abstract', 'snippet', 'blocked']);
const DECISIONS = new Set(['candidate', 'selected', 'rejected', 'unresolved']);
const TRACKING = /^(utm_.*|fbclid|gclid)$/i;
const digest = value => createHash('sha256').update(value).digest('hex').slice(0, 20);

export function canonicalizeUrl(input) {
  if (typeof input !== 'string' || !input.trim()) throw new Error('URL must be a nonempty string');
  let url;
  try { url = new URL(input.trim()); } catch { throw new Error(`Invalid URL: ${input}`); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('Only public HTTP(S) URLs without credentials are supported');
  }
  const host = url.hostname.toLowerCase();
  const youtube = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host);
  const parts = url.pathname.split('/').filter(Boolean);
  let videoId;
  if (host === 'youtu.be' || host === 'www.youtu.be') videoId = parts[0];
  else if (youtube && parts[0] === 'watch') videoId = url.searchParams.get('v');
  else if (youtube && ['shorts', 'embed', 'live'].includes(parts[0])) videoId = parts[1];
  if (videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId)) return `https://www.youtube.com/watch?v=${videoId}`;
  if (youtube && parts[0]?.startsWith('@')) return `https://www.youtube.com/${parts[0].toLowerCase()}`;
  url.hash = '';
  for (const key of [...url.searchParams.keys()]) if (TRACKING.test(key)) url.searchParams.delete(key);
  url.searchParams.sort();
  return url.href;
}

export function sourceId(url) {
  return `src_${digest(canonicalizeUrl(url))}`;
}

function fail(message) { throw new Error(message); }
function string(value, name, { empty = false } = {}) {
  if (typeof value !== 'string' || (!empty && !value.trim())) fail(`${name} must be a ${empty ? '' : 'nonempty '}string`);
}
function strings(value, name, { nonempty = false } = {}) {
  if (!Array.isArray(value) || (nonempty && !value.length) || value.some(v => typeof v !== 'string' || !v.trim())) fail(`${name} must be an array of nonempty strings`);
  if (new Set(value).size !== value.length) fail(`${name} has duplicate values`);
}
function object(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${name} must be an object`);
}
function date(value, name) {
  string(value, name);
  if (!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value) || !Number.isFinite(Date.parse(value))) fail(`${name} must be an ISO date or timestamp`);
}
function jsonLines(path) {
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8').split('\n').flatMap((line, index) => {
    if (!line.trim()) return [];
    let value;
    try { value = JSON.parse(line); } catch { fail(`${path}:${index + 1}: invalid JSON`); }
    object(value, `${path}:${index + 1}`);
    return [value];
  });
}
function taxonomy(root) {
  const path = join(root, '.research/pool/taxonomy.json');
  if (!existsSync(path)) fail(`Missing taxonomy: ${path}`);
  const data = JSON.parse(readFileSync(path, 'utf8'));
  object(data, 'taxonomy');
  if (!Array.isArray(data.categories)) fail('taxonomy.categories must be an array');
  strings(data.sourceTypes, 'taxonomy.sourceTypes', { nonempty: true });
  const categories = new Map();
  for (const category of data.categories) {
    object(category, 'category');
    if (!/^[a-z][a-z0-9-]*$/.test(category.id ?? '')) fail(`Unsafe category id: ${category.id}`);
    string(category.label, 'category.label');
    if (categories.has(category.id)) fail(`Duplicate category: ${category.id}`);
    if (!Array.isArray(category.topics)) fail(`category ${category.id} needs topics`);
    const topics = new Set();
    for (const topic of category.topics) {
      if (!/^[a-z][a-z0-9-]*$/.test(topic.id ?? '')) fail(`Unsafe topic id: ${topic.id}`);
      string(topic.label, 'topic.label');
      if (topics.has(topic.id)) fail(`Duplicate topic: ${category.id}/${topic.id}`);
      topics.add(topic.id);
    }
    categories.set(category.id, topics);
  }
  return { data, categories, sourceTypes: new Set(data.sourceTypes) };
}
function classification(categories, topics, tax, label) {
  strings(categories, `${label}.categories`, { nonempty: true });
  strings(topics, `${label}.topics`);
  for (const category of categories) if (!tax.categories.has(category)) fail(`${label}: unknown category ${category}`);
  for (const topic of topics) if (!categories.some(category => tax.categories.get(category).has(topic))) fail(`${label}: topic ${topic} does not belong to its categories`);
}

function load(root) {
  const tax = taxonomy(root);
  const base = join(root, '.research/pool');
  const files = new Map();
  for (const entry of readdirSync(base, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (!tax.categories.has(entry.name)) {
      if (['sources', 'observations', 'searches'].some(kind => existsSync(join(base, entry.name, `${kind}.jsonl`)))) fail(`Unknown category directory: ${entry.name}`);
      continue;
    }
    for (const kind of ['sources', 'observations', 'searches']) {
      const path = join(base, entry.name, `${kind}.jsonl`);
      files.set(path, { path, category: entry.name, kind, records: jsonLines(path) });
    }
  }
  return { root, tax, files };
}

export function validatePool(pool) {
  const sources = new Map();
  const urls = new Set();
  const observations = new Set();
  const searches = new Set();
  for (const file of pool.files.values()) {
    if (file.kind !== 'sources') continue;
    for (const source of file.records) {
      string(source.id, 'source.id');
      string(source.url, 'source.url');
      string(source.canonical_url, 'source.canonical_url');
      if (canonicalizeUrl(source.canonical_url) !== source.canonical_url || canonicalizeUrl(source.url) !== source.canonical_url) fail(`Source ${source.id}: noncanonical or mismatched URL`);
      if (source.id !== sourceId(source.canonical_url)) fail(`Source ${source.id}: ID does not match canonical URL`);
      if (sources.has(source.id)) fail(`Duplicate source ID: ${source.id}`);
      if (urls.has(source.canonical_url)) fail(`Duplicate canonical URL: ${source.canonical_url}`);
      string(source.title, 'source.title');
      if (!pool.tax.sourceTypes.has(source.source_type)) fail(`Source ${source.id}: unknown type ${source.source_type}`);
      classification(source.categories, source.topics, pool.tax, `source ${source.id}`);
      if (!source.categories.includes(file.category)) fail(`Source ${source.id}: storage category not listed`);
      strings(source.tags, 'source.tags');
      strings(source.aliases, 'source.aliases');
      object(source.metadata, 'source.metadata');
      sources.set(source.id, source);
      urls.add(source.canonical_url);
    }
  }
  let observationCount = 0;
  let searchCount = 0;
  for (const file of pool.files.values()) {
    if (file.kind === 'sources') continue;
    for (const record of file.records) {
      const kind = file.kind === 'observations' ? 'observation' : 'search';
      string(record.id, `${kind}.id`);
      const seen = kind === 'observation' ? observations : searches;
      if (seen.has(record.id)) fail(`Duplicate ${kind} ID: ${record.id}`);
      seen.add(record.id);
      string(record.run_id, `${kind}.run_id`);
      string(record.tool, `${kind}.tool`);
      if (kind === 'observation') {
        observationCount += 1;
        const source = sources.get(record.source_id);
        if (!source) fail(`Observation ${record.id}: unknown source ${record.source_id}`);
        if (!source.categories.includes(file.category)) fail(`Observation ${record.id}: category not present on source`);
        date(record.observed_at, 'observation.observed_at');
        if (!READ_STATUSES.has(record.read_status)) fail(`Observation ${record.id}: invalid read_status`);
        string(record.coverage, 'observation.coverage', { empty: record.read_status !== 'read' });
        if (!DECISIONS.has(record.decision)) fail(`Observation ${record.id}: invalid decision`);
        string(record.reason, 'observation.reason', { empty: true });
        strings(record.used_in, 'observation.used_in');
        strings(record.evidence_refs, 'observation.evidence_refs');
      } else {
        searchCount += 1;
        date(record.searched_at, 'search.searched_at');
        classification(record.categories, record.topics, pool.tax, `search ${record.id}`);
        if (!record.categories.includes(file.category)) fail(`Search ${record.id}: storage category not listed`);
        string(record.query, 'search.query');
        string(record.scope, 'search.scope', { empty: true });
        string(record.gap, 'search.gap', { empty: true });
        strings(record.result_source_ids, 'search.result_source_ids');
        for (const id of record.result_source_ids) if (!sources.has(id)) fail(`Search ${record.id}: unknown result source ${id}`);
      }
    }
  }
  return { sources: sources.size, observations: observationCount, searches: searchCount };
}

const union = (...arrays) => [...new Set(arrays.flat())];
function ensureFile(pool, category, kind) {
  const path = join(pool.root, '.research/pool', category, `${kind}.jsonl`);
  if (!pool.files.has(path)) pool.files.set(path, { path, category, kind, records: [] });
  return pool.files.get(path);
}
function saveFiles(files) {
  // All records are validated before any writes. Rename each prepared sibling atomically.
  // The caller holds the write lock. Renames are not a cross-file transaction.
  const pending = [];
  try {
    for (const file of files) {
      mkdirSync(dirname(file.path), { recursive: true });
      const temp = `${file.path}.${process.pid}.${pending.length}.tmp`;
      const text = file.records.map(record => JSON.stringify(record)).join('\n');
      writeFileSync(temp, text ? text + '\n' : '', { flag: 'wx' });
      pending.push({ temp, path: file.path });
    }
    for (const { temp, path } of pending) renameSync(temp, path);
  } finally {
    for (const { temp } of pending) if (existsSync(temp)) unlinkSync(temp);
  }
}

function acquireWriteLock(root) {
  const directory = join(root, '.research/pool');
  if (!existsSync(directory)) fail(`Missing pool directory: ${directory}`);
  const path = join(directory, '.write.lock');
  const ownership = JSON.stringify({ pid: process.pid, token: randomUUID() });
  let fd;
  try { fd = openSync(path, 'wx'); }
  catch (error) {
    if (error.code === 'EEXIST') fail(`Pool writer is busy: ${path}. Retry after the current writer finishes; stale locks are not removed automatically.`);
    throw error;
  }
  try { writeFileSync(fd, ownership); }
  catch (error) { closeSync(fd); if (existsSync(path)) unlinkSync(path); throw error; }
  return () => {
    closeSync(fd);
    try {
      // Do not remove a replacement lock belonging to another process.
      if (readFileSync(path, 'utf8') === ownership) unlinkSync(path);
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  };
}

function ingest(pool, options) {
  if (!options.input || !options.category || !options.topic || !options.research) fail('ingest requires --input, --category, --topic and --research');
  if (!pool.tax.categories.has(options.category) || !pool.tax.categories.get(options.category).has(options.topic)) fail('Unknown category/topic combination');
  const path = resolve(options.input);
  if (!existsSync(path)) fail(`Input file not found: ${path}`);
  const input = jsonLines(path);
  const existing = new Map();
  for (const file of pool.files.values()) if (file.kind === 'sources') for (const source of file.records) existing.set(source.id, { file, source });
  const sourceFile = ensureFile(pool, options.category, 'sources');
  const observationFile = ensureFile(pool, options.category, 'observations');
  ensureFile(pool, options.category, 'searches');
  const observationIds = new Set([...pool.files.values()].filter(f => f.kind === 'observations').flatMap(f => f.records.map(r => r.id)));
  const changed = new Set();
  let addedSources = 0;
  let addedObservations = 0;
  for (const [index, row] of input.entries()) {
    const label = `input row ${index + 1}`;
    const canonical = canonicalizeUrl(row.canonical_url ?? row.url);
    const id = sourceId(canonical);
    const originalUrl = row.url ?? row.canonical_url;
    if (canonicalizeUrl(originalUrl) !== canonical) fail(`${label}: url and canonical_url differ`);
    string(row.title, `${label}.title`);
    const originalType = row.source_type ?? 'unknown';
    const type = pool.tax.sourceTypes.has(originalType) ? originalType : 'web-page';
    let status = row.read_status ?? 'snippet';
    let decision = row.decision ?? (status === 'skipped' ? 'rejected' : 'candidate');
    if (['queued', 'skipped'].includes(status)) status = 'snippet';
    if (!READ_STATUSES.has(status)) fail(`${label}: unsupported read_status ${status}`);
    if (!DECISIONS.has(decision)) fail(`${label}: unsupported decision ${decision}`);
    const coverage = row.coverage ?? row.scope ?? '';
    string(coverage, `${label}.coverage`, { empty: status !== 'read' });
    const metadata = { ...(row.metadata ?? {}) };
    if (row.metadata !== undefined) object(row.metadata, `${label}.metadata`);
    for (const key of ['aliases', 'categories', 'topics', 'tags']) if (row[key] !== undefined) strings(row[key], `${label}.${key}`);
    if (type !== originalType) metadata.original_source_type = originalType;
    if (row.read_status && row.read_status !== status) metadata.original_read_status = row.read_status;
    for (const key of ['published', 'authority_score', 'relevance_score', 'tried']) if (row[key] !== undefined) metadata[key] = row[key];
    if (row.id !== undefined && row.id !== id) metadata.original_id = row.id;
    const aliases = union(row.aliases ?? [], originalUrl !== canonical ? [originalUrl] : []);
    const categories = union([options.category], row.categories ?? []);
    const topics = union([options.topic], row.topics ?? []);
    const source = { id, canonical_url: canonical, url: originalUrl, title: row.title, source_type: type,
      categories, topics, tags: row.tags ?? [], aliases, metadata };
    const found = existing.get(id);
    if (found) {
      // Preserve established identity/title/metadata. Discovery context is merged conservatively.
      found.source.categories = union(found.source.categories, categories);
      found.source.topics = union(found.source.topics, topics);
      found.source.tags = union(found.source.tags, source.tags);
      found.source.aliases = union(found.source.aliases, source.aliases, source.url !== found.source.url ? [source.url] : []);
      changed.add(found.file);
    } else {
      sourceFile.records.push(source);
      existing.set(id, { file: sourceFile, source });
      changed.add(sourceFile);
      addedSources += 1;
    }
    const observation = {
      source_id: id, run_id: options.research, observed_at: row.observed_at ?? new Date().toISOString().slice(0, 10),
      read_status: status, coverage, tool: row.tool ?? 'unknown', decision, reason: row.reason ?? '',
      used_in: row.used_in ?? [], evidence_refs: row.evidence_refs ?? [],
    };
    if (row.tried) observation.reason = [observation.reason, `Tried: ${row.tried}`].filter(Boolean).join('\n');
    const record = { id: `obs_${digest(JSON.stringify(observation))}`, ...observation };
    if (!observationIds.has(record.id)) {
      observationFile.records.push(record);
      observationIds.add(record.id);
      changed.add(observationFile);
      addedObservations += 1;
    }
  }
  const counts = validatePool(pool);
  for (const file of pool.files.values()) if (file.category === options.category && !existsSync(file.path)) changed.add(file);
  if (options.write) saveFiles(changed);
  return { mode: options.write ? 'write' : 'dry-run', inputRecords: input.length, addedSources, addedObservations, ...counts };
}

function recordSearch(pool, options) {
  if (!options.input || !options.category || !options.topic || !options.research) fail('record-search requires --input, --category, --topic and --research');
  if (!pool.tax.categories.has(options.category) || !pool.tax.categories.get(options.category).has(options.topic)) fail('Unknown category/topic combination');
  const path = resolve(options.input);
  if (!existsSync(path)) fail(`Input file not found: ${path}`);
  const input = jsonLines(path);
  const sources = [...pool.files.values()].filter(file => file.kind === 'sources').flatMap(file => file.records);
  const byUrl = new Map(sources.map(source => [source.canonical_url, source.id]));
  const ids = new Set(sources.map(source => source.id));
  const searches = [...pool.files.values()].filter(file => file.kind === 'searches').flatMap(file => file.records);
  const existing = new Set(searches.map(search => search.id));
  const file = ensureFile(pool, options.category, 'searches');
  let addedSearches = 0;
  for (const [index, row] of input.entries()) {
    const label = `input row ${index + 1}`;
    string(row.query, `${label}.query`);
    for (const key of ['categories', 'topics', 'result_source_ids', 'result_urls']) if (row[key] !== undefined) strings(row[key], `${label}.${key}`);
    const resultIds = [...(row.result_source_ids ?? [])];
    for (const id of resultIds) if (!ids.has(id)) fail(`${label}: unknown result source ${id}; register sources before recording their search`);
    for (const url of row.result_urls ?? []) {
      const canonical = canonicalizeUrl(url);
      if (!byUrl.has(canonical)) fail(`${label}: unknown result URL ${url}; register it first or record an explicit gap with no result reference`);
      resultIds.push(byUrl.get(canonical));
    }
    const search = {
      run_id: options.research, searched_at: row.searched_at ?? new Date().toISOString().slice(0, 10),
      categories: union([options.category], row.categories ?? []), topics: union([options.topic], row.topics ?? []),
      query: row.query, tool: row.tool ?? 'unknown', scope: row.scope ?? '',
      result_source_ids: union(resultIds), gap: row.gap ?? '',
    };
    const record = { id: `search_${digest(JSON.stringify(search))}`, ...search };
    if (!existing.has(record.id)) {
      file.records.push(record);
      existing.add(record.id);
      addedSearches += 1;
    }
  }
  const counts = validatePool(pool);
  if (options.write && addedSearches) saveFiles([file]);
  return { mode: options.write ? 'write' : 'dry-run', inputRecords: input.length, addedSearches, ...counts };
}

const normalize = value => String(value).normalize('NFKC').toLowerCase();
function search(pool, options) {
  if (options.category && !pool.tax.categories.has(options.category)) fail(`Unknown category: ${options.category}`);
  if (options.topic && !(options.category ? pool.tax.categories.get(options.category).has(options.topic) : [...pool.tax.categories.values()].some(topics => topics.has(options.topic)))) fail(`Unknown topic: ${options.topic}`);
  if (options.type && !pool.tax.sourceTypes.has(options.type)) fail(`Unknown source type: ${options.type}`);
  const terms = normalize(options.query ?? '').split(/\s+/).filter(Boolean);
  const observations = [...pool.files.values()].filter(f => f.kind === 'observations').flatMap(f => f.records);
  const matches = [...pool.files.values()].filter(f => f.kind === 'sources').flatMap(f => f.records).filter(source => {
    if (options.category && !source.categories.includes(options.category)) return false;
    if (options.topic && !source.topics.includes(options.topic)) return false;
    if (options.type && source.source_type !== options.type) return false;
    const notes = observations.filter(obs => obs.source_id === source.id).map(obs => [obs.run_id, obs.coverage, obs.reason].join(' '));
    const haystack = normalize([source.title, source.canonical_url, ...source.categories, ...source.topics, ...source.tags, ...source.aliases, JSON.stringify(source.metadata), ...notes].join(' '));
    return terms.every(term => haystack.includes(term));
  });
  return {
    total: matches.length, limit: options.limit,
    results: matches.slice(0, options.limit).map(source => ({ ...source, observations: observations.filter(obs => obs.source_id === source.id) })),
  };
}

const HELP = `Usage:
  node scripts/research-pool.mjs search [--category ID] [--topic ID] [--type TYPE] [--query TEXT] [--limit N] [--json]
  node scripts/research-pool.mjs ingest --input FILE.jsonl --category ID --topic ID --research RUN_ID [--write] [--json]
  node scripts/research-pool.mjs record-search --input FILE.jsonl --category ID --topic ID --research RUN_ID [--write] [--json]
  node scripts/research-pool.mjs check [--json]
All commands accept --root REPOSITORY. No network requests. Both write commands default to dry-run.
Each canonical source is stored once, in its first category; later categories are merged into it.
Observations preserve per-run reading scope. A saved source is not automatically verified or current.`;

export function main(args = process.argv.slice(2)) {
  let releaseLock;
  try {
    if (!args.length || args.includes('--help') || args.includes('-h')) { console.log(HELP); return 0; }
    const command = args[0];
    if (!['search', 'ingest', 'record-search', 'check'].includes(command)) fail(`Unknown command: ${command}`);
    const allowed = {
      search: new Set(['root', 'category', 'topic', 'type', 'query', 'limit', 'json']),
      ingest: new Set(['root', 'input', 'category', 'topic', 'research', 'write', 'json']),
      'record-search': new Set(['root', 'input', 'category', 'topic', 'research', 'write', 'json']),
      check: new Set(['root', 'json']),
    }[command];
    const options = { root: DEFAULT_ROOT, limit: 20 };
    const seen = new Set();
    for (let i = 1; i < args.length; i += 1) {
      const flag = args[i];
      if (!flag.startsWith('--') || !allowed.has(flag.slice(2))) fail(`Invalid argument: ${flag}`);
      const key = flag.slice(2);
      if (seen.has(key)) fail(`Repeated argument: ${flag}`);
      seen.add(key);
      if (['write', 'json'].includes(key)) { options[key] = true; continue; }
      const value = args[++i];
      if (!value || value.startsWith('--')) fail(`Missing value for ${flag}`);
      options[key] = value;
    }
    if (seen.has('limit')) {
      options.limit = Number(options.limit);
      if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 10000) fail('--limit must be an integer between 1 and 10000');
    }
    options.root = resolve(options.root);
    if (options.write) releaseLock = acquireWriteLock(options.root);
    const pool = load(options.root);
    const before = validatePool(pool);
    const output = command === 'check' ? { ok: true, ...before }
      : command === 'ingest' ? ingest(pool, options)
        : command === 'record-search' ? recordSearch(pool, options) : search(pool, options);
    if (options.json || command !== 'search') console.log(JSON.stringify(output, null, 2));
    else {
      console.log(`${output.total} saved matches; showing up to ${output.limit}. Saved evidence may need rechecking.`);
      for (const source of output.results) {
        console.log(`\n${source.id} [${source.categories.join(',')}/${source.topics.join(',')}] ${source.title}\n${source.canonical_url}`);
        for (const obs of source.observations) {
          console.log(`  ${obs.observed_at} ${obs.run_id}: ${obs.read_status}; ${obs.decision}; ${obs.coverage || 'coverage not recorded'}`);
          if (obs.reason) console.log(`    Reason: ${obs.reason}`);
          if (obs.used_in.length) console.log(`    Used in: ${obs.used_in.join(', ')}`);
        }
      }
      if (!output.total) console.log('No saved match does not mean no public source exists.');
    }
    return 0;
  } catch (error) {
    console.error(`research-pool: ${error.message}`);
    return 1;
  } finally {
    releaseLock?.();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = main();
