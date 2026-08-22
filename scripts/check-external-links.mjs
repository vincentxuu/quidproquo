// 外部連結健檢。會打網路，所以「不」放進 pnpm verify / pre-commit——
// 用法：pnpm check:links [檔案或目錄...] [--all] [--concurrency=8] [--timeout=10000]
// 不給路徑時預設只掃最近 14 天內修改過的文章；--all 掃全站（很慢）。
import fs from 'node:fs';
import path from 'node:path';

const POSTS_ROOT = path.resolve('src/content/posts');
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? Number(hit.split('=')[1]) : fallback;
};
const CONCURRENCY = flag('concurrency', 8);
const TIMEOUT_MS = flag('timeout', 10000);
const SCAN_ALL = args.includes('--all');
const paths = args.filter((a) => !a.startsWith('--'));

// 這些站對 HEAD／機器人特別敏感，回 403/429 不代表連結壞掉
const SOFT_HOSTS = [
  'x.com', 'twitter.com', 'linkedin.com', 'reddit.com', 'medium.com',
  'sciencedirect.com', 'springer.com', 'link.springer.com', 'tandfonline.com',
  'jstor.org', 'ieee.org', 'acm.org', 'wiley.com', 'onlinelibrary.wiley.com',
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const next = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(next) : next.endsWith('.md') ? [next] : [];
  });
}

function selectFiles() {
  if (paths.length > 0) {
    return paths.flatMap((p) => (fs.statSync(p).isDirectory() ? walk(path.resolve(p)) : [path.resolve(p)]));
  }
  const all = walk(POSTS_ROOT);
  if (SCAN_ALL) return all;
  const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  return all.filter((f) => fs.statSync(f).mtimeMs >= cutoff);
}

function collectLinks(files) {
  const byUrl = new Map();
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '');
    // URL 內可能含括號（論文 PDF 檔名常見），允許一層巢狀，否則會在第一個 `)` 截斷
    for (const match of source.matchAll(/\]\((https?:\/\/(?:[^()\s]|\([^()\s]*\))+)\)/g)) {
      const url = match[1].replace(/[.,;]+$/, '');
      if (!byUrl.has(url)) byUrl.set(url, new Set());
      byUrl.get(url).add(file);
    }
  }
  return byUrl;
}

async function probe(url) {
  const headers = {
    // 不偽裝身分，但給一個可辨識的 UA，避免被當成空 UA 的爬蟲直接擋掉
    'user-agent': 'quidproquo-link-check/1.0 (+https://quidproquo.cc)',
    accept: '*/*',
  };
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        headers,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (res.ok) return { ok: true, status: res.status };
      if (method === 'GET') return { ok: false, status: res.status };
      if (![403, 405, 429, 501].includes(res.status)) return { ok: false, status: res.status };
    } catch (error) {
      if (method === 'GET') return { ok: false, status: 0, reason: error.name ?? String(error) };
    }
  }
  return { ok: false, status: 0, reason: 'unknown' };
}

async function runPool(items, worker) {
  const results = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        results[index] = await worker(items[index]);
      }
    }),
  );
  return results;
}

async function main() {
  const files = selectFiles();
  const byUrl = collectLinks(files);
  const urls = [...byUrl.keys()];
  console.log(`Checking ${urls.length} external link(s) across ${files.length} file(s)${SCAN_ALL ? '' : '（預設只掃 14 天內改過的，加 --all 掃全站）'}...\n`);

  const results = await runPool(urls, async (url) => ({ url, ...(await probe(url)) }));

  const broken = [];
  const soft = [];
  for (const result of results) {
    if (result.ok) continue;
    const host = (() => { try { return new URL(result.url).hostname.replace(/^www\./, ''); } catch { return ''; } })();
    const listed = SOFT_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
    // 403/429 幾乎都是擋機器人而不是連結死掉；逾時同理。真正的死連結是 404/410。
    const isSoft = [403, 429].includes(result.status) || (listed && result.status === 0);
    (isSoft ? soft : broken).push(result);
  }

  const describe = (r) => `  ${r.status || r.reason || 'ERR'}  ${r.url}\n${[...byUrl.get(r.url)].map((f) => `        ${path.relative(process.cwd(), f)}`).join('\n')}`;

  if (soft.length > 0) {
    console.log(`需人工確認（這些站常擋機器人，不一定真的壞）：${soft.length}`);
    for (const r of soft) console.log(describe(r));
    console.log('');
  }

  if (broken.length === 0) {
    console.log(`OK: no broken external links among ${urls.length} checked.`);
    return;
  }

  console.log(`壞掉的連結：${broken.length}`);
  for (const r of broken) console.log(describe(r));
  console.log(`\nSummary: ${broken.length} broken / ${soft.length} needs-review / ${urls.length} checked.`);
  process.exitCode = 1;
}

main();
