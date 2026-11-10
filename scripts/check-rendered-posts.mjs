#!/usr/bin/env node
// build 後檢查：原稿有內文，輸出的頁面卻幾乎空白，就讓 build 失敗。
//
// 為什麼有這支：Markdown 外掛拋錯時，Astro 只記 log，頁面仍回 200，只剩標題和摘要。
// check-route-video-fences 只擋已知的一種錯法；這支不管原因，直接看結果。
//
// 用法：node scripts/check-rendered-posts.mjs [--self-test]
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const POSTS = 'src/content/posts';
const DIST = 'dist/client/posts';
const MIN_SOURCE = 1000; // 原稿太短的不判斷
const MIN_RATIO = 0.2;

const textOf = (s) => s.replace(/\s+/g, '');

export function sourceChars(md) {
  const body = md.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/```[\s\S]*?```/g, '');
  return textOf(body).length;
}

export function renderedChars(html) {
  const article = html.match(/<article[\s\S]*<\/article>/i)?.[0] ?? '';
  return textOf(article.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, '')).length;
}

export const isBlank = (source, rendered) => source >= MIN_SOURCE && rendered < source * MIN_RATIO;

function selfTest() {
  const ok = isBlank(5000, 400) && !isBlank(5000, 4000) && !isBlank(500, 10)
    && renderedChars('<article><p>a b</p><script>x</script></article>') === 2
    && sourceChars('---\nt: 1\n---\nab\n```x\nzzz\n```\n') === 2;
  if (!ok) { console.error('self-test failed'); process.exit(1); }
  console.log('rendered-posts self-test ok');
}

if (process.argv[2] === '--self-test') {
  selfTest();
} else {
  const blank = [];
  let checked = 0;
  for (const cat of readdirSync(POSTS)) {
    const dir = join(POSTS, cat);
    if (!statSync(dir).isDirectory()) continue;
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
      const md = readFileSync(join(dir, f), 'utf8');
      if (/^draft:\s*true\b/m.test(md.split('\n---\n')[0])) continue;
      const page = join(DIST, cat, f.replace(/\.md$/, ''), 'index.html');
      if (!existsSync(page)) continue;
      checked++;
      const source = sourceChars(md);
      const rendered = renderedChars(readFileSync(page, 'utf8'));
      if (isBlank(source, rendered)) blank.push(`${cat}/${f}（原稿 ${source} 字元，頁面 ${rendered}）`);
    }
  }
  if (checked === 0) { console.error('rendered-posts：dist 裡找不到任何文章頁，檢查沒有實際執行'); process.exit(1); }
  if (blank.length) {
    console.error(`rendered-posts：${blank.length} 篇內文幾乎空白，通常是 Markdown 外掛拋錯（看 build log 的 glob-loader）`);
    for (const b of blank.slice(0, 50)) console.error(`  - ${b}`);
    process.exit(1);
  }
  console.log(`rendered-posts：檢查 ${checked} 篇，0 篇空白`);
}
