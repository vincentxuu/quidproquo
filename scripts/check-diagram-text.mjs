#!/usr/bin/env node
// check:diagram-text — ```diagram 區塊的文字版面靜態檢查（純 Node，不需瀏覽器）。
//
//   pnpm check:diagram-text [post.md ...]   # 不給檔案就掃全站（tsx 執行，才載得到 flow-diagram 的 .ts 渲染器）
//   pnpm check:diagram-text --self-test
//
// 為什麼要有：能看出「字與字重疊」的 diagram-preview 要開瀏覽器，雲端排程（日報）沒有瀏覽器就
// --skip-if-no-browser 跳過，只在 daily-log 留一句「未跑」；check:diagram-geometry 只看連線。
// 結果標題和右對齊小字擠在同一列、超出框線的圖一路上線（2026-11-19 日報被讀者截圖抓到，
// 抽查最近 20 篇有 8 篇壞）。這支用字級估算每段字的外框，跟 diagram-preview 判斷同樣三件事：
// 字疊字、字壓框線、線穿過字、字跑出 viewBox。估算是近似值，最後確認仍以 diagram-preview 為準。
//
// 字寬係數是用瀏覽器實測站上字型（Noto Sans TC／PingFang TC）量出來的（em）：
// 中文與全形字 1.0、全形標點 0.84、小寫 0.53、大寫 0.63、數字 0.56、半形標點 0.34、+=<> 0.58、空白 0.25、其他符號 0.75；
// 粗體再乘 1.04。字高沿用 getBoundingClientRect 的行框：基線上 1.16em、下 0.29em。
// 只處理 <svg> 內的 <text>（含多行 <tspan>）；有 transform 的整張略過（站上目前沒有）。flow-diagram 先用站上渲染器產生 SVG 再檢查。

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { diagramsIn, parsePath } from './check-diagram-geometry.mjs';

const FONT = { 'flow-diagram__node-label': [14, 600], 'flow-diagram__edge-label': [12, 400], 'dg-label': [15, 600], 'dg-sub': [12.5, 400], 'dg-small': [11.5, 400], 'dg-tag': [11.5, 700, 0.08], 'dg-heading': [17, 700], 'dg-big': [26, 700], 'dg-edge': [12.5, 400], 'dg-caption': [12.5, 400] };
const DEFAULT_FONT = [16, 400];

const ATTR = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
const attrs = (s) => Object.fromEntries([...s.matchAll(ATTR)].map((m) => [m[1], m[2] ?? m[3]]));
const num = (v, d = 0) => (v === undefined || v === '' || Number.isNaN(Number(v)) ? d : Number(v));
const decode = (s) => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');

function charEm(ch) {
  const c = ch.codePointAt(0);
  if (ch === ' ') return 0.25;
  if (/[　-〿！-／：-＠—…]/.test(ch)) return 0.84;
  if (c >= 0x2e80) return 1.0;
  if (/[a-z]/.test(ch)) return 0.53;
  if (/[A-Z]/.test(ch)) return 0.63;
  if (/[0-9]/.test(ch)) return 0.56;
  if (/[.,:;!?'"()\-/|[\]{}`]/.test(ch)) return 0.34;
  if (/[+=<>~*^_]/.test(ch)) return 0.58;
  return 0.75;
}

export function textWidth(str, size, weight = 400, spacing = 0) {
  const chars = [...str];
  const em = chars.reduce((s, ch) => s + charEm(ch), 0) + spacing * chars.length;
  return em * size * (weight >= 600 ? 1.04 : 1);
}

function fontOf(a) {
  const classes = (a.class ?? '').split(/\s+/);
  let [size, weight, spacing = 0] = DEFAULT_FONT;
  for (const c of classes) if (FONT[c]) [size, weight, spacing = 0] = FONT[c];
  if (a['font-size']) size = num(a['font-size'], size);
  if (a['font-weight']) weight = num(a['font-weight'], weight === 400 ? (a['font-weight'] === 'bold' ? 700 : 400) : weight);
  if (classes.includes('dg-mono')) return { size, weight, spacing, mono: true };
  return { size, weight, spacing, mono: false };
}

export function textBoxes(svg) {
  const out = [];
  let group = 0;
  for (const m of svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
    group++;
    const a = attrs(m[1]);
    const str = decode(m[2]).trim();
    if (!str) continue;
    const f = fontOf(a);
    const anchor = a['text-anchor'] ?? 'start';
    const central = /central|middle/.test(a['dominant-baseline'] ?? '');
    // 多行字用 <tspan x dy> 排，每一行各算一個框。
    const spans = [...m[2].matchAll(/<tspan\b([^>]*)>([\s\S]*?)<\/tspan>/g)];
    const lines = spans.length ? spans.map((t) => ({ a: attrs(t[1]), str: decode(t[2]).trim() })) : [{ a: {}, str }];
    let x = num(a.x), y = num(a.y);
    for (const ln of lines) {
      if (ln.a.x !== undefined) x = num(ln.a.x);
      if (ln.a.y !== undefined) y = num(ln.a.y);
      if (ln.a.dy !== undefined) y += /em$/.test(ln.a.dy) ? parseFloat(ln.a.dy) * f.size : num(ln.a.dy);
      if (!ln.str) continue;
      const w = f.mono ? [...ln.str].length * 0.6 * f.size : textWidth(ln.str, f.size, f.weight, f.spacing);
      const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
      const top = central ? y - 0.725 * f.size : y - 1.16 * f.size;
      const bottom = central ? y + 0.725 * f.size : y + 0.29 * f.size;
      out.push({ str: ln.str, left, right: left + w, top, bottom, group });
    }
  }
  return out;
}

const intersects = (a, b, pad = 1) => a.left < b.right - pad && b.left < a.right - pad && a.top < b.bottom - pad && b.top < a.bottom - pad;
const contains = (o, i) => i.left >= o.left - 1 && i.right <= o.right + 1 && i.top >= o.top - 1 && i.bottom <= o.bottom + 1;
const short = (s) => s.slice(0, 24);

export function lintText(svg) {
  if (/\btransform=/.test(svg)) return [];
  const issues = [];
  // 判斷方式跟 diagram-preview 一致（行框相交、留 1px 緩衝），兩邊標準相同，雲端過了本機就不會再紅。
  const texts = textBoxes(svg.replace(/<defs[\s\S]*?<\/defs>/g, '').replace(/<g\b[^>]*class="[^"]*(?:dg-badge|flow-diagram__badge)[^"]*"[\s\S]*?<\/g>/g, ''));
  const vb = (attrs(svg.match(/<svg\b([^>]*)>/)?.[1] ?? '').viewBox ?? '').split(/[\s,]+/).map(Number);
  const frame = vb.length === 4 && vb.every((n) => !Number.isNaN(n)) ? { left: vb[0], top: vb[1], right: vb[0] + vb[2], bottom: vb[1] + vb[3] } : null;
  const flow = /flow-diagram__svg/.test(svg);
  const rects = [...svg.matchAll(/<rect\b([^>]*)\/?>/g)].map((m) => attrs(m[1]))
    .filter((a) => flow || /\b(dg-box|dg-zone)\b/.test(a.class ?? ''))
    .map((a) => ({ left: num(a.x), top: num(a.y), right: num(a.x) + num(a.width), bottom: num(a.y) + num(a.height) }));
  const lines = [];
  for (const m of svg.matchAll(/<(path|line)\b([^>]*)\/?>/g)) {
    const a = attrs(m[2]);
    if (!/\b(dg-line|dg-rule|dg-axis|flow-diagram__line)\b/.test(a.class ?? '')) continue;
    if (m[1] === 'line') lines.push({ x1: num(a.x1), y1: num(a.y1), x2: num(a.x2), y2: num(a.y2) });
    else { const p = parsePath(a.d ?? ''); if (!p.curved) for (const s of p.subs) lines.push(...s.segs); }
  }
  // 菱形等非矩形框：取直線構成的多邊形，像 diagram-preview 一樣在字框上取 7×3 個點，部分在內、部分在外就算壓框線。
  const polys = [];
  for (const m of svg.matchAll(/<(path|polygon)\b([^>]*)\/?>/g)) {
    const a = attrs(m[2]);
    if (!/\b(dg-box|dg-face)\b/.test(a.class ?? '')) continue;
    let pts = [];
    if (m[1] === 'polygon') { const n = (a.points ?? '').split(/[\s,]+/).map(Number); for (let k = 0; k + 1 < n.length; k += 2) pts.push([n[k], n[k + 1]]); }
    else { const p = parsePath(a.d ?? ''); if (p.curved || !p.subs[0]) continue; pts = [p.subs[0].start, ...p.subs[0].segs.map((g) => [g.x2, g.y2])]; }
    if (pts.length >= 3) polys.push(pts);
  }
  const inPoly = (pts, x, y) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
  texts.forEach((t, i) => {
    if (frame && !contains(frame, t)) issues.push({ code: 'TEXT-OUTSIDE-VIEWBOX', msg: short(t.str) });
    for (let j = i + 1; j < texts.length; j++) {
      const u = texts[j];
      // 同一個 <text> 裡的多行由瀏覽器自己排，行框本來就會貼著；跟 diagram-preview 一樣只比不同的 <text>。
      if (t.group !== u.group && intersects(t, u)) issues.push({ code: 'TEXT-OVERLAP', msg: `${short(t.str)} ↔ ${short(u.str)}` });
    }
    let crossed = rects.some((r) => intersects(r, t, 2) && !contains(r, t));
    for (const pts of crossed ? [] : polys) {
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      if (!intersects({ left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) }, t, 2)) continue;
      const grid = [];
      for (let gx = 0; gx <= 6; gx++) for (let gy = 0; gy <= 2; gy++) grid.push(inPoly(pts, t.left + 1 + ((t.right - t.left - 2) * gx) / 6, t.top + 1 + ((t.bottom - t.top - 2) * gy) / 2));
      const inside = grid.filter(Boolean).length;
      if (inside > 0 && inside < grid.length) { crossed = true; break; }
    }
    if (crossed) issues.push({ code: 'TEXT-CROSSES-BOX-EDGE', msg: short(t.str) });
    // 線只看字形實際占的範圍（行框上下各內縮 0.3em），避免把行距空白當成被穿過。
    const size = (t.bottom - t.top) / 1.45;
    const ink = { left: t.left + 1, right: t.right - 1, top: t.top + 0.3 * size, bottom: t.bottom - 0.3 * size };
    for (const s of lines) {
      const horiz = s.y1 === s.y2, vert = s.x1 === s.x2;
      if (horiz && s.y1 > ink.top && s.y1 < ink.bottom && Math.max(s.x1, s.x2) > ink.left && Math.min(s.x1, s.x2) < ink.right) { issues.push({ code: 'LINE-THROUGH-TEXT', msg: short(t.str) }); break; }
      if (vert && s.x1 > ink.left && s.x1 < ink.right && Math.max(s.y1, s.y2) > ink.top && Math.min(s.y1, s.y2) < ink.bottom) { issues.push({ code: 'LINE-THROUGH-TEXT', msg: short(t.str) }); break; }
    }
  });
  return issues;
}

const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];
});

// flow-diagram 是 JSON，由站上的渲染器排版；用同一個渲染器產生 SVG 再檢查。要用 tsx 執行才載得到 .ts 渲染器。
let flowRenderer = null;
async function flowDiagramsIn(text) {
  const fences = [...text.matchAll(/^```flow-diagram\n([\s\S]*?)\n```$/gm)];
  if (!fences.length) return [];
  flowRenderer ??= await import('../src/plugins/remarkFlowDiagram.ts');
  return fences.map((m, i) => {
    const html = flowRenderer.renderFlowDiagram(flowRenderer.parseFlowDiagram(m[1]), i);
    return { title: /<figcaption[^>]*>([^<]*)/.exec(html)?.[1] ?? '?', svg: /<svg[\s\S]*<\/svg>/.exec(html)?.[0] ?? '' };
  });
}

async function run(files) {
  let blocks = 0, errors = 0;
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    for (const d of [...diagramsIn(text), ...(await flowDiagramsIn(text))]) {
      blocks++;
      for (const r of lintText(d.svg)) {
        errors++;
        console.log(`✗ ${relative(process.cwd(), f)} [${d.title}] ${r.code}: ${r.msg}`);
      }
    }
  }
  console.log(`check:diagram-text: ${files.length} 篇、${blocks} 張圖，${errors} 個錯誤${errors ? '（修法：小字移到標題下一行、縮短文字或加寬框；pnpm exec tsx scripts/diagram-preview.ts <post> 看實際渲染）' : ''}`);
  return errors === 0;
}

// ------------------------------------------------------------- self-test ---

const wrap = (body) => `<svg viewBox="0 0 640 300">${body}</svg>`;
const codes = (svg) => lintText(svg).map((r) => r.code);

function selfTest() {
  const box = (y) => `<rect class="dg-box" x="40" y="${y}" width="560" height="56" rx="6"/>`;
  const cases = [
    // 2026-11-19 日報實際壞掉的寫法：標題和右對齊小字同一列。
    ['標題與右對齊小字同列重疊', wrap(box(24) + '<text class="dg-label" x="92" y="52" dominant-baseline="central">攻擊端——利用治理真空</text><text class="dg-sub" x="604" y="52" text-anchor="end" dominant-baseline="central">GTIG：自主攻擊代理已出現；FBI：開源滲透框架已用於真實入侵</text>'), ['TEXT-OVERLAP', 'TEXT-CROSSES-BOX-EDGE']],
    ['修好的寫法：小字移到下一行', wrap(box(24) + '<text class="dg-label" x="92" y="40" dominant-baseline="central">攻擊端——利用治理真空</text><text class="dg-sub" x="92" y="64" dominant-baseline="central">GTIG：自主攻擊代理已出現；FBI：開源滲透框架已用於真實入侵</text>'), []],
    ['英文長句超出框線', wrap(box(24) + '<text class="dg-sub" x="92" y="52" dominant-baseline="central">GTIG: autonomous attack agents active; FBI: pentest frameworks used in real breaches and more text</text>'), ['TEXT-CROSSES-BOX-EDGE']],
    ['跑出 viewBox', wrap('<text class="dg-label" x="600" y="20">This label is far too long for the edge</text>'), ['TEXT-OUTSIDE-VIEWBOX']],
    ['線穿過字', wrap('<text class="dg-label" x="100" y="100" dominant-baseline="central">Label</text><line class="dg-rule" x1="40" y1="100" x2="600" y2="100"/>'), ['LINE-THROUGH-TEXT']],
    ['線從字下方經過通過', wrap('<text class="dg-label" x="100" y="100" dominant-baseline="central">Label</text><line class="dg-rule" x1="40" y1="116" x2="600" y2="116"/>'), []],
    ['上下兩行間距 20px 通過', wrap('<text class="dg-sub" x="40" y="260" dominant-baseline="central">共同落差：追責機制還沒接上</text><text class="dg-sub" x="40" y="280" dominant-baseline="central">市場補位的速度還跟不上</text>'), []],
  ];
  let bad = 0;
  for (const [name, svg, want] of cases) {
    const got = codes(svg);
    const ok = want.every((c) => got.includes(c)) && (want.length || !got.length);
    if (!ok) { bad++; console.log(`✗ ${name}: 期望含 [${want}]，實際 [${got}]`); }
  }
  console.log(bad ? `self-test 失敗 ${bad} 項` : `self-test 通過（${cases.length} 項）`);
  return bad === 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) process.exit(selfTest() ? 0 : 1);
  const files = args.filter((a) => !a.startsWith('--'));
  process.exit((await run(files.length ? files : walk(resolve('src/content/posts')))) ? 0 : 1);
}
