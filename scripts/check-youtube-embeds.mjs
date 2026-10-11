#!/usr/bin/env node
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, relative, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

export function videoId(raw) {
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^(www\.|m\.)/, '');
    const [, kind, id] = url.pathname.split('/');
    const value = host === 'youtu.be' ? kind : ['youtube.com', 'youtube-nocookie.com'].includes(host)
      ? kind === 'watch' ? url.searchParams.get('v') : ['embed', 'live', 'shorts'].includes(kind) ? id : null : null;
    return /^[\w-]{11}$/.test(value ?? '') ? value : null;
  } catch { return null; }
}

export function discover(text, path) {
  const found = [];
  let fence = null;
  let body = [];
  let start = 0;
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    if (!fence) {
      const match = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
      if (match) { fence = { char: match[1][0], length: match[1].length, youtube: match[2].trim() === 'youtube' }; body = []; start = index + 1; }
    } else if (new RegExp(`^ {0,3}${fence.char}{${fence.length},}\\s*$`).test(line)) {
      if (fence.youtube) {
        const url = body.map(value => value.match(/^\s*url\s*:\s*(.*?)\s*$/)).find(Boolean)?.[1];
        found.push({ id: videoId(url), path, line: start, ...(videoId(url) ? {} : { reason: 'invalid_url' }) });
      }
      fence = null;
    } else { body.push(line); }
  }
  return found;
}

async function markdownFiles(path) {
  const entries = await readdir(path, { withFileTypes: true }).catch(error => error.code === 'ENOTDIR' ? null : Promise.reject(error));
  if (!entries) return /\.mdx?$/.test(path) ? [path] : [];
  const nested = await Promise.all(entries.sort((a, b) => a.name.localeCompare(b.name)).map(entry => entry.isDirectory() ? markdownFiles(resolve(path, entry.name)) : /\.mdx?$/.test(entry.name) ? [resolve(path, entry.name)] : []));
  return nested.flat();
}

export async function checkVideos(ids, { apiKey, fetchImpl = fetch, now = () => new Date().toISOString(), timeoutMs = 15000 } = {}) {
  const unique = [...new Set(ids)];
  const results = [];
  for (let offset = 0; offset < unique.length; offset += 50) {
    const batch = unique.slice(offset, offset + 50);
    if (!apiKey) { results.push(...batch.map(id => ({ id, checkedAt: null, embeddable: null, regionRestriction: null, status: 'unknown', reason: 'missing_api_key' }))); continue; }
    const checkedAt = now();
    try {
      const url = new URL('https://www.googleapis.com/youtube/v3/videos');
      url.searchParams.set('part', 'status,contentDetails');
      url.searchParams.set('id', batch.join(','));
      const response = await fetchImpl(url, { headers: { 'X-Goog-Api-Key': apiKey }, signal: AbortSignal.timeout(timeoutMs) });
      if (!response.ok) throw new Error(`http_${response.status}`);
      const payload = await response.json();
      if (!Array.isArray(payload.items)) throw new Error('invalid_api_response');
      const items = new Map(payload.items.map(item => [item.id, item]));
      results.push(...batch.map(id => {
        const item = items.get(id);
        const embeddable = typeof item?.status?.embeddable === 'boolean' ? item.status.embeddable : null;
        return { id, checkedAt, embeddable, regionRestriction: item?.contentDetails?.regionRestriction ?? null, status: embeddable === null ? 'unknown' : 'checked', ...(embeddable === null ? { reason: item ? 'missing_embeddable_status' : 'not_returned' } : {}) };
      }));
    } catch (error) {
      // Never expose request URLs, headers, API error bodies, or thrown fetch messages.
      const reason = /^http_\d+$|^invalid_api_response$/.test(error.message) ? error.message : error.name === 'TimeoutError' ? 'timeout' : 'request_failed';
      results.push(...batch.map(id => ({ id, checkedAt, embeddable: null, regionRestriction: null, status: 'unknown', reason })));
    }
  }
  return results;
}

export async function main(args = process.argv.slice(2)) {
  const paths = [];
  let output;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output') { output = args[++i]; if (!output) throw new Error('--output requires a path'); }
    else if (args[i] === '--help') { console.log('Usage: node scripts/check-youtube-embeds.mjs --output /tmp/youtube-embeds.json [post paths or directories]'); return; }
    else if (args[i].startsWith('--')) throw new Error(`Unknown option: ${args[i]}`);
    else paths.push(resolve(args[i]));
  }
  if (!output) throw new Error('--output is required');
  const files = [...new Set((await Promise.all((paths.length ? paths : [resolve('src/content/posts')]).map(markdownFiles))).flat())].sort();
  const occurrences = (await Promise.all(files.map(async file => discover(await readFile(file, 'utf8'), relative(process.cwd(), file))))).flat();
  const videos = await checkVideos(occurrences.filter(item => item.id).map(item => item.id), { apiKey: process.env.YOUTUBE_API_KEY });
  const report = { generatedAt: new Date().toISOString(), mode: process.env.YOUTUBE_API_KEY ? 'api_preflight' : 'inventory_only', filesScanned: files.length, invalidFences: occurrences.filter(item => !item.id), videos: videos.map(video => ({ ...video, occurrences: occurrences.filter(item => item.id === video.id).map(({ path, line }) => ({ path, line })) })) };
  await mkdir(dirname(resolve(output)), { recursive: true });
  await writeFile(resolve(output), JSON.stringify(report, null, 2) + '\n');
  console.log(`${report.mode}: ${videos.length} unique videos; ${videos.filter(video => video.status === 'checked').length} API statuses checked; ${report.invalidFences.length} invalid fences. Report: ${output}`);
  if (!process.env.YOUTUBE_API_KEY) console.log('No YOUTUBE_API_KEY: inventory only; embedding and playback have not been verified.');
  if (report.invalidFences.length || (process.env.YOUTUBE_API_KEY && videos.some(video => video.status === 'unknown'))) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
