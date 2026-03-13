// scripts/generate-og-images.mjs
// Postbuild script: generates OG images for all posts using Satori + Resvg
// Run after: astro build

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, basename, extname } from 'node:path';
import matter from 'gray-matter';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const POSTS_DIR = resolve('src/content/posts');
const OUT_DIR = resolve('dist/client/og');
const FONT_PATH = resolve('public/fonts/NotoSansTC-Medium.otf');

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

async function generateOgImage({ title, category, slug, fontData }) {
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

async function main() {
  const fontData = readFileSync(FONT_PATH);
  mkdirSync(OUT_DIR, { recursive: true });

  // Generate homepage OG image
  const homePng = await generateOgImage({ title: 'quidproquo', category: 'tech', slug: 'home', fontData });
  writeFileSync(join(OUT_DIR, 'home.png'), homePng);

  const markdownFiles = collectMarkdownFiles(POSTS_DIR);
  let count = 0;

  for (const filePath of markdownFiles) {
    const content = readFileSync(filePath, 'utf-8');
    const { data } = matter(content);

    if (data.draft) continue;

    const slug = slugFromPath(filePath);
    const title = data.title ?? 'quidproquo';
    const category = data.category ?? 'tech';

    const png = await generateOgImage({ title, category, slug, fontData });
    const outPath = join(OUT_DIR, `${slug}.png`);
    mkdirSync(join(OUT_DIR, slug.split('/').slice(0, -1).join('/')), { recursive: true });
    writeFileSync(outPath, png);
    count++;
  }

  console.log(`[og-images] Generated ${count} OG images in dist/client/og/`);
}

main().catch(err => {
  console.error('[og-images] Error:', err);
  process.exit(1);
});
