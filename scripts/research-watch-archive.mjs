#!/usr/bin/env node
/** Compact prepared watch artifacts into one durable evidence file. No network or pool writes. */
import { existsSync, mkdirSync, readFileSync, realpathSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { reportBatch } from './research-watch-batch.mjs';
import { canonicalizeUrl, sourceId } from './research-pool.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assert = (value, message) => { if (!value) throw new Error(message); };
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const inside = (base, path) => { const r = relative(base, path); return r === '' || (!isAbsolute(r) && r !== '..' && !r.startsWith(`..${sep}`)); };
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const jsonl = path => readFileSync(path, 'utf8').split('\n').filter(line => line.trim()).map((line, i) => { const row = JSON.parse(line); assert(object(row), `Invalid JSONL object at ${path}:${i + 1}`); return row; });
const text = value => typeof value === 'string' && value.trim().length > 0;

function safeInput(base, name) {
  const path = resolve(base, name);
  assert(inside(base, path) && path !== base, 'Input path escapes batch directory');
  assert(existsSync(path), `Missing archive input: ${name}`);
  assert(inside(base, realpathSync(path)), 'Input symlink escapes batch directory');
  return path;
}

function canonicalDestination(path) {
  let ancestor = path;
  while (!existsSync(ancestor)) ancestor = dirname(ancestor);
  return resolve(realpathSync(ancestor), relative(ancestor, path));
}

function destination(root, output) {
  const research = join(root, '.research');
  assert(existsSync(research) && inside(root, realpathSync(research)), 'Research directory escapes repository');
  assert(inside(research, output) && output !== research && output.endsWith('.json'), 'Archive output must be a JSON file under repository .research');
  let ancestor = output;
  while (!existsSync(ancestor)) ancestor = dirname(ancestor);
  assert(inside(research, realpathSync(ancestor)), 'Output symlink escapes research directory');
}

export function prepareArchive(rootInput, batchInput, outputInput) {
  const root = realpathSync(resolve(rootInput)), batchFile = realpathSync(resolve(batchInput));
  const base = dirname(batchFile), output = canonicalDestination(resolve(outputInput));
  assert(inside(root, base), 'Batch must belong to the repository');
  destination(root, output);
  const batch = json(batchFile), built = reportBatch(batchFile);
  const refs = relative(root, output).split(sep).join('/');
  const inputs = new Set([batchFile]), rewrites = [], watches = [];
  for (const job of built.summary.jobs) {
    if (job.status === 'deferred') { watches.push({ watch_id: job.watch_id, status: 'deferred', reason: job.reason }); continue; }
    const planPath = safeInput(base, job.plan_path); inputs.add(realpathSync(planPath));
    const plan = json(planPath);
    assert(plan.run_id === job.run_id && plan.date === batch.date && plan.watch?.id === job.watch_id && plan.watch.category === job.category && plan.watch.topic === job.topic && Array.isArray(plan.requests) && plan.requests.length === job.request_count, `Plan mismatch for ${job.watch_id}`);
    if (job.status === 'pending') {
      watches.push({ watch_id: job.watch_id, status: 'pending', plan, summary: null, sources: [], searches: [], report: null });
      continue;
    }
    const paths = Object.fromEntries(['summary.json', 'sources.jsonl', 'searches.jsonl', 'report.md'].map(name => [name, safeInput(base, `${job.watch_id}/${name}`)]));
    for (const path of Object.values(paths)) inputs.add(realpathSync(path));
    const summary = json(paths['summary.json']), sources = jsonl(paths['sources.jsonl']), searches = jsonl(paths['searches.jsonl']);
    assert(sources.length === summary.candidates.length, `Source count mismatch for ${job.watch_id}`);
    const expectedIds = new Set(summary.candidates.map(row => row.id)), actualIds = new Set();
    for (const row of sources) {
      assert(text(row.url) && text(row.title) && text(row.source_type) && ['read', 'partial', 'abstract', 'snippet', 'blocked'].includes(row.read_status) && text(row.tool) && typeof row.coverage === 'string' && Array.isArray(row.evidence_refs), `Malformed prepared source in ${job.watch_id}`);
      const id = sourceId(canonicalizeUrl(row.url));
      assert(expectedIds.has(id) && !actualIds.has(id), `Source identity mismatch for ${job.watch_id}`);
      actualIds.add(id); row.evidence_refs = [refs];
    }
    assert(searches.length === summary.completed_requests + summary.failed_requests, `Search count mismatch for ${job.watch_id}`);
    for (const row of searches) assert(text(row.query) && text(row.tool) && typeof row.scope === 'string' && Array.isArray(row.result_urls), `Malformed prepared search in ${job.watch_id}`);
    const report = readFileSync(paths['report.md'], 'utf8');
    assert(text(report), `Empty report for ${job.watch_id}`);
    watches.push({ watch_id: job.watch_id, status: job.status, plan, summary, sources, searches, report });
    rewrites.push({ path: paths['sources.jsonl'], content: sources.map(row => JSON.stringify(row)).join('\n') + (sources.length ? '\n' : '') });
  }
  assert(!inputs.has(existsSync(output) ? realpathSync(output) : output), 'Archive output cannot overwrite an input');
  const archive = { version: 1, batch, summary: built.summary, watches };
  if (existsSync(output)) {
    const previous = json(output);
    assert(previous.version === 1 && previous.batch?.batch_id === batch.batch_id && Array.isArray(previous.watches), 'Archive output would overwrite unrelated content');
    assert(isDeepStrictEqual(previous, archive), 'Archive already exists with different content; use a new output filename to preserve historical evidence');
  }
  return { output, archive, rewrites };
}

function replaceFile(path, content) {
  const temp = `${path}.${process.pid}.archive.tmp`;
  try { writeFileSync(temp, content, { flag: 'wx' }); renameSync(temp, path); }
  finally { if (existsSync(temp)) unlinkSync(temp); }
}

export function archiveBatch(root, batchFile, output) {
  // All input paths and content are checked before the first output or source rewrite.
  const prepared = prepareArchive(root, batchFile, output);
  mkdirSync(dirname(prepared.output), { recursive: true });
  replaceFile(prepared.output, JSON.stringify(prepared.archive, null, 2) + '\n');
  // The durable evidence exists before any ingestable source can reference it.
  for (const rewrite of prepared.rewrites) replaceFile(rewrite.path, rewrite.content);
  return prepared.archive;
}

export function main(args = process.argv.slice(2)) {
  try {
    if (!args.length || args.includes('--help')) { console.log('research-watch-archive --batch FILE --output FILE.json [--root ROOT]\nOffline compact evidence archive; rewrites runtime source evidence_refs only. Does not write pool.'); return 0; }
    const options = { root: ROOT }, seen = new Set();
    for (let i = 0; i < args.length; i++) {
      const key = args[i].replace(/^--/, '');
      assert(args[i].startsWith('--') && ['batch', 'output', 'root'].includes(key) && !seen.has(key), `Invalid or repeated argument ${args[i]}`);
      const value = args[++i]; assert(text(value) && !value.startsWith('--'), `Missing ${key}`);
      options[key] = value; seen.add(key);
    }
    assert(options.batch && options.output, '--batch and --output are required');
    const archive = archiveBatch(options.root, options.batch, options.output);
    console.log(JSON.stringify({ batch_id: archive.batch.batch_id, watches: archive.watches.length, complete: archive.summary.complete, output: resolve(options.output) }));
    return 0;
  } catch (error) { console.error(`research-watch-archive: ${error.message}`); return 1; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = main();
