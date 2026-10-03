#!/usr/bin/env node
// 列出文章中每個 GitHub 行號／標題錨點連結實際指到的那一行，供人（或 agent）對照題意。
// 只做機械步驟：抓原始檔、取出被引用的行、行號超出檔案長度或標題找不到時報錯；不判斷題意。
// 用法：node check-github-line-links.mjs <post.md> [more.md ...]
// 快照目錄：LINK_SNAPSHOT_DIR（預設 os.tmpdir()/post-link-snapshot）。同一個檔案只抓一次，
// 多個 agent 請共用這個唯讀快照，不要各自下載，否則行號可能對不上。
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('用法: node check-github-line-links.mjs <post.md> [more.md ...]');
  process.exit(2);
}

const SNAP = process.env.LINK_SNAPSHOT_DIR || join(tmpdir(), 'post-link-snapshot');
mkdirSync(SNAP, { recursive: true });

const LINK = /\]\((https:\/\/github\.com\/([^/\s)]+)\/([^/\s)]+)\/blob\/([^/\s)]+)\/([^)\s?#]+)(?:\?[^)\s#]*)?(?:#([^)\s]*))?)\)/g;
const snapshots = new Map();

function snapshot(owner, repo, ref, path) {
  const key = `${owner}__${repo}__${ref}__${path.replaceAll('/', '_')}`;
  if (snapshots.has(key)) return snapshots.get(key);
  const dest = join(SNAP, key);
  if (!existsSync(dest)) {
    execFileSync(
      'curl',
      ['-fsSL', '--max-time', '40', '-o', dest, `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`],
      { stdio: ['ignore', 'ignore', 'pipe'] },
    );
  }
  const lines = readFileSync(dest, 'utf8').split('\n');
  snapshots.set(key, lines);
  return lines;
}

const slug = (h) =>
  h.trim().toLowerCase().replace(/[^\p{L}\p{N}\- _]/gu, '').replaceAll(' ', '-');

function context(line) {
  if (line.trimStart().startsWith('|')) return line.trim().replace(/^\|\s*/, '').split('|')[0].trim();
  return line.trim();
}

let checked = 0;
let problems = 0;
for (const file of files) {
  const text = readFileSync(file, 'utf8').split('\n');
  text.forEach((line, i) => {
    for (const m of line.matchAll(LINK)) {
      const [, , owner, repo, ref, path, anchor] = m;
      if (!anchor) continue;
      checked += 1;
      const where = `${file}:${i + 1}`;
      const ctx = context(line).slice(0, 90);
      const target = `${owner}/${repo}/${path}#${anchor}`;
      let lines;
      try {
        lines = snapshot(owner, repo, ref, path);
      } catch (e) {
        problems += 1;
        console.log(`FETCH-FAIL ${where}  ${target}`);
        continue;
      }
      const range = /^L(\d+)(?:-L(\d+))?$/.exec(anchor);
      if (range) {
        const n = Number(range[1]);
        if (n > lines.length) {
          problems += 1;
          console.log(`OUT-OF-RANGE ${where}  ${target}  (file has ${lines.length} lines)`);
        } else {
          console.log(`${where}\n  引用處: ${ctx}\n  ${target}\n  被引用的行: ${lines[n - 1].trim().slice(0, 160)}`);
        }
        continue;
      }
      const heading = lines.find((l) => /^#{1,6}\s/.test(l) && slug(l.replace(/^#+\s*/, '')) === anchor);
      if (!heading) {
        problems += 1;
        console.log(`ANCHOR-NOT-FOUND ${where}  ${target}`);
      } else {
        console.log(`${where}\n  引用處: ${ctx}\n  ${target}\n  對應標題: ${heading.trim().slice(0, 160)}`);
      }
    }
  });
}
console.log(`\nchecked ${checked} anchored link(s), ${problems} problem(s). 題意是否相同需人工對照上面兩行。`);
process.exit(problems > 0 ? 1 : 0);
