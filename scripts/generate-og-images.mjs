// scripts/generate-og-images.mjs
// Postbuild script: generates OG images for all posts using Satori + Resvg
// Run after: astro build
//
// Resvg's render() is a synchronous native call, so async concurrency (Promise.all)
// does not parallelize it — only worker_threads (separate OS threads) do. Cache-miss
// generation is fanned out across worker threads; cache hits stay on the main thread
// since they're just a file copy.

import { copyFileSync, existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { availableParallelism } from 'node:os';
import { resolve, join } from 'node:path';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import matter from 'gray-matter';

const POSTS_DIR = resolve('src/content/posts');
const OUT_DIR = resolve('dist/client/og');
const CACHE_DIR = resolve('.cache/og-images');
const FONT_PATH = resolve('public/fonts/NotoSansTC-Medium.otf');
const TEMPLATE_VERSION = '2026-08-29-v1';
const MAX_WORKERS = 8;

const catColors = {
  tech: '#1a1a1a',
  ai: '#6d28d9',
  product: '#0369a1',
  education: '#b45309',
  life: '#15803d',
};

function collectMarkdownFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath));
    } else if (entry.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function slugFromPath(fullPath) {
  // The content loader uses `category/filename` as the ID
  const relative = fullPath.replace(POSTS_DIR + '/', '');
  return relative.replace(/\.md$/, '');
}

function sha256(input) {
  return createHash('sha256').update(input).digest('hex');
}

function cachePathFor(parts) {
  return join(CACHE_DIR, `${sha256(JSON.stringify(parts))}.png`);
}

async function generateOgImage({ title, category, fontData }) {
  const { default: satori } = await import('satori');
  const { Resvg } = await import('@resvg/resvg-js');
  const badgeColor = catColors[category] ?? '#1a2e1a';

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '1200px',
          height: '630px',
          background: '#ffffff',
          padding: '60px 80px',
          fontFamily: 'Noto Sans TC',
          borderTop: '6px solid #1a2e1a',
        },
        children: [
          {
            type: 'span',
            props: {
              style: {
                background: badgeColor,
                color: '#fff',
                fontSize: '18px',
                fontWeight: 500,
                padding: '4px 14px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              },
              children: category,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: title.length > 40 ? '48px' : '58px',
                fontWeight: 500,
                color: '#1a1a1a',
                lineHeight: 1.25,
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: '26px', color: '#4a7c59', fontWeight: 500 },
              children: 'quidproquo.cc',
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans TC',
          data: fontData,
          weight: 500,
          style: 'normal',
        },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  return resvg.render().asPng();
}

if (isMainThread) {
  main().catch(err => {
    console.error('[og-images] Error:', err);
    process.exit(1);
  });
} else {
  runWorker().catch(err => {
    console.error('[og-images] Worker error:', err);
    process.exit(1);
  });
}

async function writeCachedOgImage({ cacheKey, outPath, generate }) {
  mkdirSync(join(outPath, '..'), { recursive: true });
  const cachedPath = cachePathFor(cacheKey);
  if (existsSync(cachedPath)) {
    copyFileSync(cachedPath, outPath);
    return 'reused';
  }

  const png = await generate();
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cachedPath, png);
  writeFileSync(outPath, png);
  return 'generated';
}

async function runWorker() {
  const { tasks, fontPath } = workerData;
  const fontData = readFileSync(fontPath);
  let generated = 0;
  for (const task of tasks) {
    mkdirSync(join(task.outPath, '..'), { recursive: true });
    const png = await generateOgImage({ title: task.title, category: task.category, fontData });
    writeFileSync(task.cachedPath, png);
    writeFileSync(task.outPath, png);
    generated++;
  }
  parentPort.postMessage({ generated });
}

function runWorkerPool(tasks, fontPath) {
  if (tasks.length === 0) return Promise.resolve(0);
  const workerCount = Math.max(1, Math.min(MAX_WORKERS, availableParallelism(), tasks.length));
  const chunks = Array.from({ length: workerCount }, () => []);
  tasks.forEach((task, i) => chunks[i % workerCount].push(task));

  return Promise.all(
    chunks.map(chunk => new Promise((resolvePromise, reject) => {
      const worker = new Worker(new URL(import.meta.url), { workerData: { tasks: chunk, fontPath } });
      worker.on('message', ({ generated }) => resolvePromise(generated));
      worker.on('error', reject);
    }))
  ).then(counts => counts.reduce((a, b) => a + b, 0));
}

async function main() {
  const fontData = readFileSync(FONT_PATH);
  const fontHash = sha256(fontData);
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(CACHE_DIR, { recursive: true });

  // Generate homepage OG image with logo
  const logoSvg = readFileSync(resolve('public/favicon.svg'), 'utf-8');
  const logoDataUrl = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`;
  const homeStatus = await writeCachedOgImage({
    cacheKey: {
      kind: 'home',
      version: TEMPLATE_VERSION,
      title: 'quidproquo',
      subtitle: 'AI、技術、產品、攀岩、衝浪、咖啡',
      logoHash: sha256(logoSvg),
      fontHash,
    },
    outPath: join(OUT_DIR, 'home.png'),
    generate: async () => {
      const { default: satori } = await import('satori');
      const { Resvg } = await import('@resvg/resvg-js');
      const homeSvg = await satori(
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '32px',
              width: '1200px',
              height: '630px',
              background: '#1a2e1a',
              fontFamily: 'Noto Sans TC',
            },
            children: [
              {
                type: 'img',
                props: { src: logoDataUrl, width: 160, height: 160, style: {} },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: '72px', fontWeight: 500, color: '#ffffff', letterSpacing: '-0.02em' },
                  children: 'quidproquo',
                },
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: '28px', color: '#a7c4a0', fontWeight: 500 },
                  children: 'AI、技術、產品、攀岩、衝浪、咖啡',
                },
              },
            ],
          },
        },
        { width: 1200, height: 630, fonts: [{ name: 'Noto Sans TC', data: fontData, weight: 500, style: 'normal' }] }
      );
      const homeResvg = new Resvg(homeSvg, { fitTo: { mode: 'width', value: 1200 } });
      return homeResvg.render().asPng();
    },
  });

  const markdownFiles = collectMarkdownFiles(POSTS_DIR);
  let generated = homeStatus === 'generated' ? 1 : 0;
  let reused = homeStatus === 'reused' ? 1 : 0;
  let skippedDrafts = 0;
  const pending = [];

  for (const filePath of markdownFiles) {
    const content = readFileSync(filePath, 'utf-8');
    const { data } = matter(content);

    if (data.draft) {
      skippedDrafts++;
      continue;
    }

    const slug = slugFromPath(filePath);
    const title = data.title ?? 'quidproquo';
    const category = data.category ?? 'tech';
    const outPath = join(OUT_DIR, `${slug}.png`);
    const cachedPath = cachePathFor({ kind: 'post', version: TEMPLATE_VERSION, slug, title, category, fontHash });

    mkdirSync(join(outPath, '..'), { recursive: true });
    if (existsSync(cachedPath)) {
      copyFileSync(cachedPath, outPath);
      reused++;
    } else {
      pending.push({ title, category, outPath, cachedPath });
    }
  }

  generated += await runWorkerPool(pending, FONT_PATH);

  console.log(`[og-images] Generated ${generated}, reused ${reused}, skipped ${skippedDrafts} drafts in dist/client/og/`);
}
