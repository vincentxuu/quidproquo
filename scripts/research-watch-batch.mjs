#!/usr/bin/env node
/** Offline batching only: planned work is never represented as executed research. */
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createPlan, listWatchlists, loadSnapshot } from './research-watch.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assert = (value, message) => { if (!value) throw new Error(message); };
const safeId = value => typeof value === 'string' && /^[a-z][a-z0-9-]*$/.test(value);
const count = value => Number.isInteger(value) && value >= 0;
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const writeJson = (path, value) => writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
const md = value => String(value).replace(/[\r\n]+/g, ' ').replace(/[\\`*_[\]<>|]/g, '\\$&');

function validateDate(date) {
  const parsed = new Date(`${date}T00:00:00Z`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(+parsed) && parsed.toISOString().slice(0, 10) === date, 'Invalid calendar date');
}

export function planBatch(root, date, maxRequests = 32) {
  validateDate(date);
  assert(Number.isInteger(maxRequests) && maxRequests >= 1 && maxRequests <= 1024, 'max-requests must be an integer from 1 to 1024');
  // listWatchlists validates every config, including disabled configs, before filtering.
  const sortedWatches = listWatchlists(root, true), snapshot = loadSnapshot(root);
  const week = Math.floor((Date.parse(`${date}T00:00:00Z`) - Date.UTC(1970, 0, 5)) / 604800000);
  const offset = sortedWatches.length ? ((week % sortedWatches.length) + sortedWatches.length) % sortedWatches.length : 0;
  const watches = [...sortedWatches.slice(offset), ...sortedWatches.slice(0, offset)];
  let allocated = 0;
  const plans = new Map(), jobs = [];
  for (const watch of watches) {
    const plan = createPlan(watch, date, snapshot);
    const fits = plan.requests.length > 0 && allocated + plan.requests.length <= maxRequests;
    const deferredReason = fits ? null : plan.requests.length === 0 ? 'no_requests' : plan.requests.length > maxRequests ? 'over_budget_single_watch' : 'global_budget_deferred';
    const job = { order: jobs.length + 1, watch_id: watch.id, title: watch.title, category: watch.category, topic: watch.topic,
      run_id: plan.run_id, request_count: plan.requests.length, status: fits ? 'planned' : 'deferred',
      plan_path: `${watch.id}/plan.json`, summary_path: `${watch.id}/summary.json`,
      deferred_reason: deferredReason,
      reason: fits ? '' : deferredReason === 'no_requests' ? 'Watch has no runnable requests; configure sources or queries before execution.' : deferredReason === 'over_budget_single_watch' ? `over_budget_single_watch: ${plan.requests.length} requests exceed the entire global budget ${maxRequests}; adjust this watch or the budget manually. Rotation cannot make this watch fit.` : `Whole watch deferred: ${plan.requests.length} requests exceed remaining global budget ${maxRequests - allocated}. No requests executed.` };
    if (fits) { allocated += plan.requests.length; plans.set(watch.id, plan); }
    jobs.push(job);
  }
  return { batch: { version: 1, batch_id: `${date}-research-watch-batch`, date, max_requests: maxRequests,
    rotation_week: week, rotation_offset: offset, sorted_watch_ids: sortedWatches.map(watch => watch.id),
    execution_order: jobs.map(job => job.watch_id), enabled_watch_count: watches.length, planned_requests: allocated, jobs }, plans };
}

export function writeBatchPlan(root, date, output, maxRequests = 32) {
  const built = planBatch(root, date, maxRequests);
  // Generate and validate all plans before writing any outputs.
  mkdirSync(output, { recursive: true });
  for (const [id, plan] of built.plans) {
    mkdirSync(join(output, id), { recursive: true });
    writeJson(join(output, id, 'plan.json'), plan);
  }
  writeJson(join(output, 'batch.json'), built.batch);
  return built.batch;
}

function validateBatch(batch) {
  assert(batch && batch.version === 1 && Array.isArray(batch.jobs), 'Invalid batch manifest');
  validateDate(batch.date);
  assert(batch.batch_id === `${batch.date}-research-watch-batch`, 'Batch id/date mismatch');
  assert(count(batch.max_requests) && batch.max_requests >= 1 && batch.max_requests <= 1024, 'Invalid batch budget');
  assert(batch.enabled_watch_count === batch.jobs.length, 'Batch watch count mismatch');
  const seen = new Set(); let requests = 0;
  assert(Array.isArray(batch.execution_order) && JSON.stringify(batch.execution_order) === JSON.stringify(batch.jobs.map(job => job.watch_id)), 'Batch execution order mismatch');
  for (const [index, job] of batch.jobs.entries()) {
    assert(job.order === index + 1, 'Job execution order mismatch');
    assert(safeId(job.watch_id) && !seen.has(job.watch_id), 'Invalid or duplicate batch watch id');
    seen.add(job.watch_id);
    assert(safeId(job.category) && safeId(job.topic) && typeof job.title === 'string' && job.title.trim(), 'Invalid job classification/title');
    assert(job.run_id === `${batch.date}-${job.watch_id}-watch`, 'Job run id mismatch');
    assert(['planned', 'deferred'].includes(job.status) && count(job.request_count), 'Invalid job status/request count');
    assert(job.plan_path === `${job.watch_id}/plan.json` && job.summary_path === `${job.watch_id}/summary.json`, 'Unsafe or mismatched job paths');
    if (job.status === 'planned') requests += job.request_count;
    else assert(typeof job.reason === 'string' && job.reason.trim() && ['no_requests', 'over_budget_single_watch', 'global_budget_deferred'].includes(job.deferred_reason), 'Deferred job needs a reason');
  }
  assert(requests === batch.planned_requests && requests <= batch.max_requests, 'Batch request budget mismatch');
}

function readJobSummary(base, job, batch) {
  const path = join(base, job.summary_path);
  if (!existsSync(path)) return null;
  const location = relative(realpathSync(base), realpathSync(path));
  assert(location && !isAbsolute(location) && !location.startsWith(`..${sep}`) && location !== '..', 'Summary path escapes batch directory');
  const summary = readJson(path);
  assert(summary.run_id === job.run_id && summary.date === batch.date, `Summary run/date mismatch for ${job.watch_id}`);
  assert(summary.planned_requests === job.request_count, `Summary request count mismatch for ${job.watch_id}`);
  for (const key of ['completed_requests', 'failed_requests', 'new_sources', 'known_sources']) assert(count(summary[key]), `Invalid summary ${key}`);
  assert(Array.isArray(summary.missing_requests) && summary.missing_requests.every(id => typeof id === 'string') && new Set(summary.missing_requests).size === summary.missing_requests.length, 'Invalid missing requests');
  assert(summary.completed_requests + summary.failed_requests + summary.missing_requests.length === job.request_count, 'Summary coverage count mismatch');
  assert(typeof summary.complete === 'boolean' && summary.complete === (summary.failed_requests === 0 && summary.missing_requests.length === 0), 'Summary completion mismatch');
  assert(Array.isArray(summary.candidates), 'Summary candidates must be an array');
  const ids = new Set(); let fresh = 0;
  for (const item of summary.candidates) {
    assert(/^src_[a-f0-9]{20}$/.test(item.id ?? '') && !ids.has(item.id) && typeof item.known === 'boolean', 'Invalid or duplicate candidate identity');
    ids.add(item.id); if (!item.known) fresh++;
  }
  assert(fresh === summary.new_sources && summary.candidates.length - fresh === summary.known_sources, 'Summary source count mismatch');
  return summary;
}

export function reportBatch(batchFile) {
  const batch = readJson(batchFile), base = dirname(resolve(batchFile));
  validateBatch(batch);
  const newIds = new Set(), knownIds = new Set();
  const jobs = batch.jobs.map(job => {
    if (job.status === 'deferred') return { ...job, status: 'deferred' };
    const summary = readJobSummary(base, job, batch);
    if (!summary) return { ...job, status: 'pending', reason: 'No per-watch summary exists; execution is not confirmed.' };
    for (const candidate of summary.candidates) (candidate.known ? knownIds : newIds).add(candidate.id);
    return { ...job, status: summary.complete ? 'complete' : summary.failed_requests === job.request_count && job.request_count > 0 ? 'failed' : 'incomplete',
      completed_requests: summary.completed_requests, failed_requests: summary.failed_requests,
      missing_requests: summary.missing_requests, new_sources: summary.new_sources, known_sources: summary.known_sources,
      reason: summary.complete ? '' : 'Per-watch evidence reports failures or unexecuted requests; coverage remains incomplete.' };
  });
  const counts = Object.fromEntries(['complete', 'incomplete', 'failed', 'pending', 'deferred'].map(status => [status, jobs.filter(job => job.status === status).length]));
  const summary = { version: 1, batch_id: batch.batch_id, date: batch.date, max_requests: batch.max_requests,
    planned_requests: batch.planned_requests, execution_order: batch.execution_order, complete: jobs.length > 0 && jobs.every(job => job.status === 'complete'),
    status_counts: counts, completed_watches: counts.complete, new_sources: newIds.size, known_sources: [...knownIds].filter(id => !newIds.has(id)).length,
    new_source_ids: [...newIds].sort(), jobs };
  const report = ['# 分類研究批次候選報告', '', `日期：${batch.date}；批次：${batch.batch_id}`, '',
    `全域請求預算 ${batch.max_requests}；已規劃 ${batch.planned_requests}。規劃不代表已執行。`,
    `完成 ${counts.complete}；不完整 ${counts.incomplete}；失敗 ${counts.failed}；待執行 ${counts.pending}；延後 ${counts.deferred}。`,
    `跨主題去重後新增 ${newIds.size} 個來源。候選僅代表發現，不能當作已讀或已採用。`, '',
    `本週處理次序：${batch.execution_order.map(md).join(' → ') || '無啟用項目'}。次序按週輪換；超過整輪預算的單一watch仍需人工調整。`, '',
    '| 次序 | 類別／主題 | 追蹤項目 | 狀態 | 請求數 | 說明 |', '| --- | --- | --- | --- | --- | --- |',
    ...jobs.map(job => `| ${job.order} | ${md(job.category)}/${md(job.topic)} | ${md(job.title)} (${job.watch_id}) | ${job.status} | ${job.request_count} | ${md(job.reason)} |`), '',
    '延後、缺少報告或部分失敗均不算成功，也不能推論沒有新來源。本工具不連網、不寫pool、不修改文章。', ''].join('\n');
  return { summary, report };
}

export function writeBatchReport(batchFile, output) {
  const built = reportBatch(batchFile);
  mkdirSync(output, { recursive: true });
  writeFileSync(join(output, 'batch-report.md'), built.report);
  writeJson(join(output, 'batch-summary.json'), built.summary);
  return built.summary;
}

export function main(args = process.argv.slice(2)) {
  try {
    const command = args.shift();
    if (!command || command === '--help') {
      console.log('research-watch-batch plan --date YYYY-MM-DD --output DIR [--max-requests 32] [--root ROOT]\nresearch-watch-batch report --batch FILE --output DIR [--root ROOT]\nOffline planning/reporting only; never executes research or writes pool.'); return 0;
    }
    assert(['plan', 'report'].includes(command), 'Unknown command');
    const allowed = command === 'plan' ? ['date', 'output', 'max-requests', 'root'] : ['batch', 'output', 'root'];
    const options = { root: ROOT }, seen = new Set();
    for (let i = 0; i < args.length; i++) {
      const key = args[i].replace(/^--/, '');
      assert(args[i].startsWith('--') && allowed.includes(key) && !seen.has(key), `Invalid/repeated argument ${args[i]}`);
      assert(typeof args[i + 1] === 'string' && args[i + 1].trim() && !args[i + 1].startsWith('--'), `Missing ${key}`);
      options[key] = args[++i]; seen.add(key);
    }
    assert(typeof options.output === 'string' && options.output.trim(), '--output is required');
    const summary = command === 'plan'
      ? writeBatchPlan(resolve(options.root), options.date, resolve(options.output), options['max-requests'] === undefined ? 32 : Number(options['max-requests']))
      : (assert(typeof options.batch === 'string' && options.batch.trim(), '--batch is required'), writeBatchReport(resolve(options.batch), resolve(options.output)));
    console.log(JSON.stringify(summary)); return 0;
  } catch (error) { console.error(`research-watch-batch: ${error.message}`); return 1; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) process.exitCode = main();
