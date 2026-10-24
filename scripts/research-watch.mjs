#!/usr/bin/env node
/** Offline watch planning/reporting. A research agent supplies real tool results. */
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync, mkdtempSync, cpSync, rmSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { canonicalizeUrl, sourceId } from './research-pool.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const POOL_SCRIPT = fileURLToPath(new URL('./research-pool.mjs', import.meta.url));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const str = value => typeof value === 'string' && value.trim().length > 0;
const list = value => Array.isArray(value) && value.every(str);
const md = value => String(value ?? '').replace(/[\r\n]+/g, ' ').replace(/[\\`*_[\]<>|]/g, '\\$&');
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const lines = path => existsSync(path) ? readFileSync(path, 'utf8').split('\n').filter(Boolean).map(JSON.parse) : [];
const unique = values => [...new Set(values)];

export function loadSnapshot(root) {
  const taxonomy = json(join(root, '.research/pool/taxonomy.json'));
  const sources = [], observations = [];
  for (const category of taxonomy.categories) {
    sources.push(...lines(join(root, '.research/pool', category.id, 'sources.jsonl')));
    observations.push(...lines(join(root, '.research/pool', category.id, 'observations.jsonl')));
  }
  return { taxonomy, sources, observations };
}

export function validateConfig(config, snapshot) {
  assert(/^[a-z][a-z0-9-]*$/.test(config.id ?? ''), 'Invalid watch id');
  assert(str(config.title), 'Watch title is required');
  const category = snapshot.taxonomy.categories.find(c => c.id === config.category);
  assert(category?.topics.some(t => t.id === config.topic), 'Unknown watch category/topic');
  for (const key of ['tags', 'article_paths']) assert(list(config[key]), `${key} must be a string array`);
  for (const key of ['context_terms', 'place_terms']) if (config[key] !== undefined) assert(list(config[key]), `${key} must be a string array`);
  if (config.enabled !== undefined) assert(typeof config.enabled === 'boolean', 'enabled must be boolean');
  if (config.known_source_types !== undefined) {
    assert(list(config.known_source_types) && new Set(config.known_source_types).size === config.known_source_types.length, 'known_source_types must be a unique string array');
    assert(config.known_source_types.every(type => snapshot.taxonomy.sourceTypes.includes(type)), 'Unknown known_source_types entry');
  }
  assert(Array.isArray(config.queries), 'queries must be an array');
  const ids = new Set();
  for (const q of config.queries) {
    assert(/^[a-z0-9-]+$/.test(q.id ?? '') && !ids.has(q.id), 'Query ids must be unique safe strings');
    assert(str(q.query) && (q.route === undefined || str(q.route)), 'Invalid query/route');
    ids.add(q.id);
  }
  assert(list(config.known_pages ?? []), 'known_pages must be a URL array');
  for (const url of config.known_pages ?? []) canonicalizeUrl(url);
  for (const [key, fallback, max] of [['source_limit', 8, 20], ['channel_limit', 8, 20], ['query_limit', 4, 12]]) {
    assert(Number.isInteger(config[key] ?? fallback) && (config[key] ?? fallback) >= 1 && (config[key] ?? fallback) <= max, `${key} out of bounds`);
  }
  if (config.covered_routes !== undefined) assert(list(config.covered_routes), 'covered_routes must be a string array');
}

function readWatchSettings(root, snapshot) {
  const path = join(root, '.research/watch-config.json');
  if (!existsSync(path)) return null;
  const settings = json(path);
  assert(settings && typeof settings === 'object' && !Array.isArray(settings), 'watch-config must be an object');
  for (const key of ['enabled', 'auto_pool_topics']) assert(typeof settings[key] === 'boolean', `watch-config ${key} must be boolean`);
  for (const [key, fallback, max] of [['source_limit', 4, 20], ['query_limit', 2, 2]]) {
    const value = settings[key] === undefined ? fallback : settings[key];
    assert(Number.isInteger(value) && value >= 1 && value <= max, `watch-config ${key} out of bounds`);
  }
  const disabled = settings.disabled_topics === undefined ? [] : settings.disabled_topics;
  assert(list(disabled) && new Set(disabled).size === disabled.length, 'watch-config disabled_topics must be a unique string array');
  for (const pair of disabled) {
    const parts = pair.split('/'), [categoryId, topicId] = parts;
    assert(parts.length === 2 && snapshot.taxonomy.categories.some(c => c.id === categoryId && c.topics.some(t => t.id === topicId)), `Unknown disabled topic: ${pair}`);
  }
  return { ...settings, source_limit: settings.source_limit ?? 4, query_limit: settings.query_limit ?? 2, disabled_topics: disabled };
}

export function listWatchlists(root, enabledOnly = false) {
  const snapshot = loadSnapshot(root), directory = join(root, '.research/watchlists');
  const settings = readWatchSettings(root, snapshot);
  const explicit = (existsSync(directory) ? readdirSync(directory).filter(name => name.endsWith('.json')) : []).map(name => {
    const config = json(join(directory, name));
    validateConfig(config, snapshot);
    assert(name === `${config.id}.json`, `Watch filename must match id: ${name}`);
    return { ...config, enabled: config.enabled === true && settings?.enabled !== false, origin: 'watchlist',
      known_source_types: config.known_source_types ?? snapshot.taxonomy.sourceTypes,
      source_limit: config.source_limit ?? config.channel_limit ?? 8 };
  });
  const watches = [...explicit];
  if (settings?.enabled && settings.auto_pool_topics) {
    const overridden = new Set(explicit.filter(watch => watch.enabled).map(watch => `${watch.category}/${watch.topic}`));
    for (const category of snapshot.taxonomy.categories) {
      for (const topic of category.topics) {
        const pair = `${category.id}/${topic.id}`;
        if (settings.disabled_topics.includes(pair) || overridden.has(pair)) continue;
        if (!snapshot.sources.some(source => source.categories.includes(category.id) && source.topics.includes(topic.id))) continue;
        const watch = { id: `${category.id}-${topic.id}`, title: `${category.label}／${topic.label}研究追蹤`,
          category: category.id, topic: topic.id, enabled: true, origin: 'pool-topic', tags: [], article_paths: [],
          context_terms: [`${category.label} ${topic.label}`], known_source_types: [...snapshot.taxonomy.sourceTypes],
          source_limit: settings.source_limit, query_limit: settings.query_limit,
          queries: [
            { id: 'primary-zh', query: `${category.label} ${topic.label} 官方 一手資料 研究與實務更新` },
            { id: 'primary-en', query: `Find official primary sources and recent research or practical guides about ${category.id} ${topic.id}.` },
          ] };
        validateConfig(watch, snapshot);
        const collision = watches.findIndex(existing => existing.id === watch.id);
        if (collision >= 0) {
          const existing = watches[collision];
          assert(!existing.enabled && existing.category === watch.category && existing.topic === watch.topic, `Automatic watch id conflicts with explicit watch: ${watch.id}`);
          // A disabled specialization does not opt its entire pool topic out.
          watches.splice(collision, 1);
        }
        watches.push(watch);
      }
    }
  }
  return watches.filter(watch => !enabledOnly || watch.enabled).sort((a, b) => a.category.localeCompare(b.category) || a.topic.localeCompare(b.topic) || a.id.localeCompare(b.id));
}

export function createPlan(config, date, snapshot) {
  validateConfig(config, snapshot);
  const parsed = new Date(`${date}T00:00:00Z`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(+parsed) && parsed.toISOString().slice(0, 10) === date, 'Invalid calendar date');
  // Monday-based contiguous week index, not day-of-year (which repeats rotations in January).
  const week = Math.floor((+parsed - Date.UTC(1970, 0, 5)) / 604800000);
  const matches = snapshot.sources.filter(s => s.categories.includes(config.category) && s.topics.includes(config.topic) && config.tags.every(tag => s.tags.includes(tag)));
  const allowedTypes = new Set(config.known_source_types ?? snapshot.taxonomy.sourceTypes);
  const sources = matches.filter(s => allowedTypes.has(s.source_type)).sort((a, b) => a.id.localeCompare(b.id));
  const sourceLimit = config.source_limit ?? config.channel_limit ?? 8;
  const limit = Math.min(sourceLimit, sources.length);
  const selected = Array.from({ length: limit }, (_, i) => sources[(week * sourceLimit + i) % sources.length]);
  const context = config.context_terms?.[0] ?? config.place_terms?.[0] ?? config.title;
  const queries = config.queries;
  const queryLimit = Math.min(config.query_limit ?? 4, queries.length);
  const selectedQueries = Array.from({ length: queryLimit }, (_, i) => queries[(week * (config.query_limit ?? 4) + i) % queries.length]);
  const requests = [
    ...selected.map(s => ({ id: `${s.source_type === 'channel' ? 'channel' : 'source'}-${s.id}`, kind: s.source_type === 'channel' ? 'channel' : 'source', source_type: s.source_type, source_id: s.id, url: s.canonical_url, query: `${context} ${s.title}`, title: s.title })),
    ...(config.known_pages ?? []).slice(0, 4).map((url, i) => ({ id: `page-${i + 1}`, kind: 'page', url: canonicalizeUrl(url), query: url })),
    ...selectedQueries.map(q => ({ id: `query-${q.id}`, kind: 'query', query: q.query, ...(q.route ? { route: q.route } : {}) })),
  ];
  return { version: 1, watch: config, date, run_id: `${date}-${config.id}-watch`, rotation_week: week,
    known_source_count: sources.length, selected_source_count: selected.length, source_limit: sourceLimit,
    known_channel_count: sources.filter(s => s.source_type === 'channel').length, selected_channel_count: selected.filter(s => s.source_type === 'channel').length, requests };
}

export function buildReport(plan, evidence, snapshot) {
  validateConfig(plan.watch, snapshot);
  assert(str(plan.run_id) && /^\d{4}-\d{2}-\d{2}$/.test(plan.date), 'Invalid plan run/date');
  assert(Array.isArray(plan.requests) && plan.requests.every(r => str(r.id) && str(r.query)), 'Invalid plan requests');
  const planned = new Map(plan.requests.map(r => [r.id, r]));
  assert(planned.size === plan.requests.length, 'Duplicate plan request id');
  assert(Array.isArray(evidence.requests), 'Evidence needs requests');
  const aliases = new Map();
  for (const source of snapshot.sources) {
    aliases.set(source.canonical_url, source);
    for (const alias of source.aliases ?? []) {
      try { aliases.set(canonicalizeUrl(alias), source); } catch { /* Legacy non-URL aliases are not identities. */ }
    }
  }
  const seen = new Set(), candidates = new Map(), attempts = [], searches = [];
  const types = new Set(snapshot.taxonomy.sourceTypes);
  for (const attempt of evidence.requests) {
    assert(planned.has(attempt.request_id), `Unknown request id: ${attempt.request_id}`);
    assert(!seen.has(attempt.request_id), `Duplicate request id: ${attempt.request_id}`);
    seen.add(attempt.request_id);
    assert(str(attempt.tool) && str(attempt.coverage), 'Every attempt needs actual tool and coverage');
    if (attempt.query !== undefined) assert(str(attempt.query), 'Actual query must be nonempty');
    assert(['ok', 'failed'].includes(attempt.status), 'Invalid attempt status');
    assert(Array.isArray(attempt.results), 'Attempt results must be an array');
    if (attempt.status === 'failed') assert(str(attempt.error) && attempt.results.length === 0, 'Failed attempts require an error and no results');
    const request = planned.get(attempt.request_id), resultUrls = [];
    for (const result of attempt.results) {
      const canonical = canonicalizeUrl(result.url);
      assert(str(result.title) && types.has(result.source_type), 'Result needs title and supported source_type');
      for (const key of ['route', 'published_at', 'creator_source_id', 'reason']) if (result[key] !== undefined) assert(str(result[key]), `Invalid result ${key}`);
      if (result.published_at) assert(Number.isFinite(Date.parse(result.published_at)), 'Invalid published_at');
      const known = aliases.get(canonical);
      if (result.creator_source_id) assert(snapshot.sources.some(s => s.id === result.creator_source_id && s.source_type === 'channel'), 'Unknown creator_source_id');
      const id = known?.id ?? sourceId(canonical);
      const previous = snapshot.observations.filter(o => o.source_id === id && o.run_id !== plan.run_id).sort((a, b) => a.observed_at.localeCompare(b.observed_at));
      const latest = previous.at(-1);
      const adopted = previous.some(o => o.decision === 'selected' && o.used_in?.some(p => plan.watch.article_paths.includes(p)));
      // A discovery is never sufficient evidence to overrule a past selection/rejection.
      const protectedDecision = latest?.decision === 'rejected' ? 'rejected' : adopted || previous.some(o => o.decision === 'selected') ? 'selected' : latest?.decision === 'selected' ? 'selected' : 'candidate';
      // A route-targeted query may return a general index or unrelated route.
      // Only explicit result evidence can identify the source's route.
      const route = result.route;
      // Generic discovery is about new sources. Missing channel metadata on a
      // paper/documentation page does not establish a previously unknown author.
      const outsider = !known;
      const uncovered = Boolean(route && Array.isArray(plan.watch.covered_routes) && !plan.watch.covered_routes.includes(route));
      const priority = known ? 3 : uncovered ? 0 : outsider ? 1 : 2;
      const existing = candidates.get(id);
      const item = existing ?? {
        id, url: known?.canonical_url ?? canonical, title: known?.title ?? result.title, source_type: known?.source_type ?? result.source_type,
        known: Boolean(known), previous_decision: latest?.decision ?? null, decision: protectedDecision, priority,
        source_route: route ?? null, query_routes: [], uncovered_route: uncovered, outsider, request_ids: [], tools: [], coverages: [], reasons: [], aliases: [],
        ...(result.published_at ? { published_at: result.published_at } : {}), ...(result.creator_source_id ? { creator_source_id: result.creator_source_id } : {}),
      };
      item.request_ids = unique([...item.request_ids, request.id]); item.tools = unique([...item.tools, attempt.tool]);
      if (request.route) item.query_routes = unique([...item.query_routes, request.route]);
      item.coverages = unique([...item.coverages, attempt.coverage]); item.reasons = unique([...item.reasons, result.reason ?? 'Discovery candidate; content and relevance need human review.']);
      if (route && !item.source_route) item.source_route = route;
      if (priority < item.priority) { item.priority = priority; item.source_route = route ?? item.source_route; item.uncovered_route = uncovered; item.outsider = outsider; }
      if (result.url !== item.url) item.aliases = unique([...item.aliases, result.url]);
      candidates.set(id, item); resultUrls.push(item.url);
    }
    attempts.push({ request_id: request.id, status: attempt.status, tool: attempt.tool, coverage: attempt.coverage, count: attempt.results.length, error: attempt.error ?? null });
    searches.push({ query: attempt.query ?? request.query, tool: attempt.tool, searched_at: plan.date, scope: attempt.coverage, result_urls: unique(resultUrls), gap: attempt.status === 'failed' ? `Failed: ${attempt.error}` : attempt.results.length ? '' : 'No matching results in this bounded attempt; not evidence of absence.' });
  }
  const missing = plan.requests.filter(r => !seen.has(r.id)).map(r => r.id);
  const items = [...candidates.values()].sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
  const rows = items.map(item => ({ url: item.url, title: item.title, source_type: item.source_type, aliases: item.aliases,
    tags: plan.watch.tags, categories: [plan.watch.category], topics: [plan.watch.topic], observed_at: plan.date,
    read_status: 'snippet', coverage: `Discovery-only evidence. ${item.coverages.join(' | ')}`, tool: item.tools.join(' + '),
    decision: item.decision, reason: `${item.previous_decision ? `Previously saved (${item.previous_decision}); discovery does not supersede earlier reading or decisions. ` : ''}${item.reasons.join(' | ')}`,
    used_in: [], evidence_refs: [], metadata: { watch_id: plan.watch.id, suggested_article_paths: plan.watch.article_paths, query_routes: item.query_routes, ...(item.source_route ? { source_route: item.source_route } : {}), ...(item.published_at ? { published_at: item.published_at } : {}), ...(item.creator_source_id ? { creator_source_id: item.creator_source_id } : {}) } }));
  const summary = { run_id: plan.run_id, date: plan.date, planned_requests: plan.requests.length, completed_requests: attempts.filter(a => a.status === 'ok').length,
    failed_requests: attempts.filter(a => a.status === 'failed').length, missing_requests: missing, complete: missing.length === 0 && attempts.every(a => a.status === 'ok'),
    new_sources: items.filter(i => !i.known).length, known_sources: items.filter(i => i.known).length, candidates: items, attempts };
  const report = [`# ${md(plan.watch.title)}候選報告`, '', `日期：${plan.date}；run：${md(plan.run_id)}`, '',
    `範圍：${attempts.length}/${plan.requests.length} 次已嘗試，失敗 ${summary.failed_requests} 次，未執行 ${missing.length} 次。${summary.complete ? '本次計畫均已嘗試成功。' : '覆蓋不完整，不得解讀為沒有新來源。'}`,
    `新增 ${summary.new_sources} 個來源；已知 ${summary.known_sources} 個。所有結果僅作候選發現，未完成內容閱讀或影片觀看。`, '',
    `建議文章：${plan.watch.article_paths.map(md).join('、')}（尚未採用，不寫入 used_in）`, '',
    '| 優先 | 來源 | 狀態 | 主題脈絡／待查理由 |', '| --- | --- | --- | --- |',
    ...items.map(i => `| ${i.priority} | [${md(i.title)}](<${i.url.replace(/>/g, '%3E')}>) | ${i.known ? `已知／${md(i.previous_decision ?? '未判定')}` : '新候選'} | ${md([i.source_route ? `來源路線：${i.source_route}` : i.query_routes.length ? '來源涵蓋未確認' : '', i.query_routes.length ? `查詢脈絡（不代表來源涵蓋）：${i.query_routes.join('、')}` : '', ...i.reasons].filter(Boolean).join('；'))} |`), '',
    '## 搜尋覆蓋', '', ...attempts.map(a => `- ${md(a.request_id)}：${a.status}；${md(a.tool)}；${md(a.coverage)}；${a.count} 筆${a.error ? `；${md(a.error)}` : ''}`),
    ...missing.map(id => `- ${md(id)}：未執行`), '', '零結果僅代表本次查詢範圍。發布日期若有保存，來自提供者標記，未獨立查證；既有來源不會因此自動變成最新或已讀。', ''].join('\n');
  return { summary, report, sources: rows, searches };
}

function runPool(root, command, input, plan, write = false) {
  const args = [POOL_SCRIPT, command, '--input', input, '--category', plan.watch.category, '--topic', plan.watch.topic, '--research', plan.run_id, '--root', root];
  if (write) args.push('--write');
  const result = spawnSync(process.execPath, args, { encoding: 'utf8' });
  assert(result.status === 0, result.stderr || result.stdout || 'Pool command failed');
  return JSON.parse(result.stdout);
}

export function writeReport(root, output, plan, evidence, writePool = false) {
  const built = buildReport(plan, evidence, loadSnapshot(root));
  const reportRef = relative(root, join(output, 'report.md'));
  for (const row of built.sources) row.evidence_refs = [reportRef];
  // Preflight both commands against a private pool copy so unknown result references and
  // malformed observations cannot cause partial real-pool writes.
  const scratch = mkdtempSync(join(tmpdir(), 'research-watch-'));
  try {
    mkdirSync(join(scratch, '.research'), { recursive: true });
    cpSync(join(root, '.research/pool'), join(scratch, '.research/pool'), { recursive: true, filter: path => !path.endsWith('.write.lock') });
    const sourcePath = join(scratch, 'sources.jsonl'), searchPath = join(scratch, 'searches.jsonl');
    writeFileSync(sourcePath, built.sources.map(JSON.stringify).join('\n') + (built.sources.length ? '\n' : ''));
    writeFileSync(searchPath, built.searches.map(JSON.stringify).join('\n') + (built.searches.length ? '\n' : ''));
    runPool(scratch, 'ingest', sourcePath, plan, true);
    runPool(scratch, 'record-search', searchPath, plan, true);
    // Persist every evidence artifact before publishing references to it in the pool.
    // Output I/O failure must leave the real pool untouched. Pool writes still use
    // the existing two-command, nontransactional protocol after this point.
    mkdirSync(output, { recursive: true });
    writeFileSync(join(output, 'report.md'), built.report);
    writeFileSync(join(output, 'summary.json'), JSON.stringify(built.summary, null, 2) + '\n');
    writeFileSync(join(output, 'sources.jsonl'), readFileSync(sourcePath));
    writeFileSync(join(output, 'searches.jsonl'), readFileSync(searchPath));
    if (writePool) {
      runPool(root, 'ingest', sourcePath, plan, true);
      runPool(root, 'record-search', searchPath, plan, true);
    }
    return built.summary;
  } finally { rmSync(scratch, { recursive: true, force: true }); }
}

export function main(args = process.argv.slice(2)) {
  try {
    const command = args.shift();
    if (!command || command === '--help') {
      console.log('research-watch list [--enabled] [--root ROOT] [--json]\nresearch-watch plan --watch ID --date YYYY-MM-DD --output DIR [--root ROOT]\nresearch-watch report --plan FILE --input RESULTS.json --output DIR [--root ROOT] [--write-pool]\nOffline: a research agent executes planned requests using available research tools.'); return 0;
    }
    assert(['list', 'plan', 'report'].includes(command), 'Unknown command');
    const options = { root: ROOT }, seen = new Set();
    const allowed = command === 'list' ? ['enabled', 'root', 'json'] : command === 'plan' ? ['watch', 'date', 'output', 'root'] : ['plan', 'input', 'output', 'root', 'write-pool'];
    for (let i = 0; i < args.length; i++) {
      const key = args[i].replace(/^--/, '');
      assert(args[i].startsWith('--') && allowed.includes(key) && !seen.has(key), `Invalid/repeated argument ${args[i]}`);
      seen.add(key);
      if (['write-pool', 'enabled', 'json'].includes(key)) options[key] = true;
      else { assert(str(args[i + 1]) && !args[i + 1].startsWith('--'), `Missing ${key}`); options[key] = args[++i]; }
    }
    options.root = resolve(options.root);
    if (command === 'list') {
      const watches = listWatchlists(options.root, Boolean(options.enabled));
      if (options.json) console.log(JSON.stringify(watches, null, 2));
      else console.log(watches.map(watch => `${watch.category}/${watch.topic}\t${watch.id}\t${watch.enabled ? 'enabled' : 'disabled'}\t${watch.title}`).join('\n'));
      return 0;
    }
    assert(str(options.output), '--output is required');
    if (command === 'plan') {
      assert(/^[a-z][a-z0-9-]*$/.test(options.watch ?? ''), '--watch must be a safe id');
      const plan = createPlan(json(join(options.root, '.research/watchlists', `${options.watch}.json`)), options.date, loadSnapshot(options.root));
      mkdirSync(options.output, { recursive: true }); writeFileSync(join(options.output, 'plan.json'), JSON.stringify(plan, null, 2) + '\n');
      console.log(JSON.stringify({ run_id: plan.run_id, requests: plan.requests.length, output: resolve(options.output) }));
    } else {
      assert(str(options.plan) && str(options.input), '--plan and --input are required');
      const summary = writeReport(options.root, resolve(options.output), json(options.plan), json(options.input), Boolean(options['write-pool']));
      console.log(JSON.stringify({ run_id: summary.run_id, complete: summary.complete, new_sources: summary.new_sources, known_sources: summary.known_sources, write_pool: Boolean(options['write-pool']) }));
    }
    return 0;
  } catch (error) { console.error(`research-watch: ${error.message}`); return 1; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = main();
