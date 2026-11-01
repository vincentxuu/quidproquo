#!/usr/bin/env node
// check:diagram-geometry — ```diagram 區塊的連線幾何靜態檢查（純 Node，不需瀏覽器）。
//
//   node scripts/check-diagram-geometry.mjs [post.md ...]   # 不給檔案就掃全站
//   node scripts/check-diagram-geometry.mjs --self-test
//   node scripts/check-diagram-geometry.mjs --verbose        # 連警告一起列
//
// 為什麼要有：diagram-preview 只看渲染後的「文字」（重疊、被線穿過、壓框線、手機字太小），
// 不看線本身。primitives.md 的連線規則因此沒人把關；英文版把框加寬、箭頭沒跟著改，
// 箭頭尖端縮進框裡被蓋住，截圖腳本全綠（2026-10-24）。
// 規則來源：.agents/skills/diagram/references/primitives.md「連線規則」；
// 做法參考 cholateio/arch-blueprint 的 check.py，但只保留本站畫法適用的部分。
//
// 只檢查「只含 M L H V、圓角 Q（半徑 ≤ 16）、跳線 A（半徑 ≤ 10）」的直角折線。
// 曲線（循環圖弧線、桑基流帶…）自動略過；魚骨圖、Wardley、等軸測這類本來就要斜線的圖，
// 在 <svg> 加 data-geometry="free" 整張略過。

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_NODES = 9;
const MAX_EDGES = 12;
const FAN_GAP = 12;
const NEAR_GAP = 16;
const END_GAP_MAX = 12;
const JOIN_TOL = 8; // 線接到另一條線、生命線、圓點時的容許距離（約一個箭頭大小）

// ---------------------------------------------------------------- parsing ---

const ATTR = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
const TAG = /<(\w+)((?:\s+[\w:-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*\/?>/g;
const attrs = (s) => Object.fromEntries([...s.matchAll(ATTR)].map((m) => [m[1], m[2] ?? m[3]]));
const num = (v, d = 0) => (v === undefined || v === '' || Number.isNaN(Number(v)) ? d : Number(v));
const hasClass = (e, name) => (e.a.class ?? '').split(/\s+/).includes(name);

export function tags(svg) {
  return [...svg.matchAll(TAG)].map((m) => ({ tag: m[1], a: attrs(m[2]) }));
}

/**
 * M L H V Q A → axis-aligned polylines, one `sub` per M (a rope drawn as `M..V..M..V..` is several lines).
 * `curved` = anything else; such paths are skipped.
 */
export function parsePath(d) {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  const out = { subs: [], arcs: [], curved: false };
  let i = 0, cmd = null, x = 0, y = 0, sub = null;
  const take = (n) => {
    const v = tokens.slice(i, i + n).map(Number);
    if (v.length < n || v.some(Number.isNaN)) throw new Error('args');
    i += n;
    return v;
  };
  const go = (nx, ny) => { sub?.segs.push({ x1: x, y1: y, x2: nx, y2: ny }); x = nx; y = ny; if (sub) sub.end = [x, y]; };
  try {
    while (i < tokens.length) {
      if (/[A-Za-z]/.test(tokens[i])) { cmd = tokens[i++]; if (cmd === 'Z' || cmd === 'z') continue; }
      if (cmd === 'M') { [x, y] = take(2); sub = { segs: [], start: [x, y], end: [x, y] }; out.subs.push(sub); cmd = 'L'; }
      else if (cmd === 'L') go(...take(2));
      else if (cmd === 'H') go(take(1)[0], y);
      else if (cmd === 'V') go(x, take(1)[0]);
      else if (cmd === 'Q') {
        const [qx, qy, ex, ey] = take(4);
        const corner = (Math.abs(qx - x) < 0.5 && Math.abs(qy - ey) < 0.5) || (Math.abs(qy - y) < 0.5 && Math.abs(qx - ex) < 0.5);
        if (!corner || Math.max(Math.abs(ex - x), Math.abs(ey - y)) > 16) { out.curved = true; break; }
        go(qx, qy); go(ex, ey); // 圓角 = 控制點上的直角頂點
      } else if (cmd === 'A') {
        const [rx, ry, , , , ex, ey] = take(7);
        if (Math.max(rx, ry) > 10 || (Math.abs(ey - y) > 0.5 && Math.abs(ex - x) > 0.5)) { out.curved = true; break; }
        out.arcs.push([(x + ex) / 2, (y + ey) / 2]);
        go(ex, ey);
      } else { out.curved = true; break; }
    }
  } catch { out.curved = true; }
  return out;
}

const axis = (s) => (Math.abs(s.y1 - s.y2) < 0.5 ? 'h' : Math.abs(s.x1 - s.x2) < 0.5 ? 'v' : 'diag');
const length = (s) => Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
const span = (a, b) => [Math.min(a, b), Math.max(a, b)];

function pointInPoly(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** 節點外框：rect 直接用；菱形等 path/polygon 取外接矩形，並保留頂點供穿越判斷。 */
function boxOf(e, id) {
  if (e.tag === 'rect') return { id, x: num(e.a.x), y: num(e.a.y), w: num(e.a.width), h: num(e.a.height) };
  const n = (e.a.d ?? e.a.points ?? '').match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
  const pts = [];
  for (let k = 0; k + 1 < n.length; k += 2) pts.push([n[k], n[k + 1]]);
  if (pts.length < 3) return null;
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return { id, x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys), poly: pts };
}

function segHitsBox(s, b, pad = 0) {
  if (b.poly) {
    if (pad) return false; // 菱形不做近距離檢查
    const steps = Math.max(Math.ceil(length(s) / 2), 2);
    for (let k = 1; k < steps; k++) {
      const t = k / steps;
      if (pointInPoly(s.x1 + (s.x2 - s.x1) * t, s.y1 + (s.y2 - s.y1) * t, b.poly)) return true;
    }
    return false;
  }
  const [x, y, w, h] = [b.x - pad, b.y - pad, b.w + 2 * pad, b.h + 2 * pad];
  if (axis(s) === 'h') { const [lo, hi] = span(s.x1, s.x2); return y < s.y1 && s.y1 < y + h && lo < x + w && hi > x; }
  if (axis(s) === 'v') { const [lo, hi] = span(s.y1, s.y2); return x < s.x1 && s.x1 < x + w && lo < y + h && hi > y; }
  return false;
}

function attachToBox(pt, boxes) {
  let best = null;
  const [px, py] = pt;
  for (const b of boxes) {
    const sides = [];
    if (px >= b.x - 0.01 && px <= b.x + b.w + 0.01) { sides.push(['上', b.y - py, px - b.x]); sides.push(['下', py - (b.y + b.h), px - b.x]); }
    if (py >= b.y - 0.01 && py <= b.y + b.h + 0.01) { sides.push(['左', b.x - px, py - b.y]); sides.push(['右', px - (b.x + b.w), py - b.y]); }
    for (const [side, gap, along] of sides) {
      if (gap >= -0.01 && gap <= END_GAP_MAX + 0.01 && (!best || gap < best.gap)) best = { box: b, side, gap: Math.max(gap, 0), along };
    }
  }
  return best;
}

const onSeg = (pt, s, tol) => {
  const [lx, hx] = span(s.x1, s.x2), [ly, hy] = span(s.y1, s.y2);
  return pt[0] >= lx - tol && pt[0] <= hx + tol && pt[1] >= ly - tol && pt[1] <= hy + tol;
};

// ------------------------------------------------------------------ lint ---

/** @returns {{level:'error'|'warn', code:string, msg:string}[]} */
export function lintSvg(svg) {
  const out = [];
  const add = (level, code, msg) => out.push({ level, code, msg });
  const el = tags(svg);
  const root = el.find((e) => e.tag === 'svg');
  if (root?.a['data-geometry'] === 'free') return out;
  if (el.some((e) => e.a.transform)) return [{ level: 'warn', code: 'SKIP-TRANSFORM', msg: '有 transform，座標不能直接比對，略過連線檢查' }];

  // 圖例（primitives.md：底部一條 dg-rule，下方 dg-tag「圖例」）裡的色塊與線樣本不是圖的內容
  const tagYs = el.filter((e) => e.tag === 'text' && hasClass(e, 'dg-tag')).map((e) => num(e.a.y));
  const legendTop = Math.min(Infinity, ...el
    .filter((e) => e.tag === 'line' && hasClass(e, 'dg-rule') && num(e.a.y1) === num(e.a.y2))
    .map((e) => num(e.a.y1))
    .filter((ry) => tagYs.some((ty) => ty > ry && ty - ry <= 60)));

  const boxes = el
    .filter((e) => ['rect', 'path', 'polygon'].includes(e.tag) && hasClass(e, 'dg-box'))
    .map((e, k) => boxOf(e, `box${k}`))
    .filter((b) => b && !(b.w <= 20 && b.h <= 20) && b.y < legendTop);
  const lineEls = el.filter((e) => (e.tag === 'path' || e.tag === 'line') && hasClass(e, 'dg-line'));

  // 一個 <path> 可能有好幾個 M（例如被節點切斷的繩子），每段各自是一條線
  const edges = lineEls.flatMap((e, k) => {
    const p = e.tag === 'line'
      ? { subs: [{ segs: [{ x1: num(e.a.x1), y1: num(e.a.y1), x2: num(e.a.x2), y2: num(e.a.y2) }], start: [num(e.a.x1), num(e.a.y1)], end: [num(e.a.x2), num(e.a.y2)] }], arcs: [], curved: false }
      : parsePath(e.a.d ?? '');
    return p.subs.map((sub, si) => ({
      k,
      id: p.subs.length > 1 ? `edge${k}.${si}` : `edge${k}`,
      p: { segs: sub.segs, start: sub.start, end: sub.end, arcs: p.arcs, curved: p.curved },
      dashed: Boolean(e.a['stroke-dasharray']) || hasClass(e, 'dg-line--dashed'),
      tipStart: Boolean(e.a['marker-start']) && si === 0, // 只有帶箭頭的那一端要求停在節點邊
      tipEnd: Boolean(e.a['marker-end']) && si === p.subs.length - 1,
    }));
  }).filter((e) => !e.p.segs.every((s) => s.y1 >= legendTop - 0.5 && s.y2 >= legendTop - 0.5));
  const edgeCount = new Set(edges.map((e) => e.k)).size;
  if (!boxes.length || !edgeCount) return out;

  if (boxes.length > MAX_NODES) add('error', 'COUNT-NODES', `節點 ${boxes.length} 個，上限 ${MAX_NODES}`);
  if (edgeCount > MAX_EDGES) add('error', 'COUNT-EDGES', `連線 ${edgeCount} 條，上限 ${MAX_EDGES}`);
  for (const b of boxes) {
    if ([b.x, b.y, b.w, b.h].some((v) => v % 4)) add('warn', 'GRID', `${b.id} (${b.x},${b.y} ${b.w}×${b.h}) 不在 4px 格線上`);
  }
  const checked = edges.filter((e) => !e.p.curved && e.p.segs.length);

  // 端點可以接的東西：另一條線（合流）、循序圖生命線／座標軸、起點圓點
  const guides = el.filter((e) => (e.tag === 'line' || e.tag === 'path') && (hasClass(e, 'dg-rule') || hasClass(e, 'dg-axis')))
    .flatMap((e) => (e.tag === 'line' ? [{ x1: num(e.a.x1), y1: num(e.a.y1), x2: num(e.a.x2), y2: num(e.a.y2) }] : parsePath(e.a.d ?? '').subs.flatMap((s) => s.segs)));
  const dots = el.filter((e) => e.tag === 'circle' || e.tag === 'ellipse').map((e) => ({ cx: num(e.a.cx), cy: num(e.a.cy), r: Math.max(num(e.a.r), num(e.a.rx)) }));
  const joinsElsewhere = (pt, self) =>
    checked.some((o) => o !== self && o.p.segs.some((s) => onSeg(pt, s, JOIN_TOL)))
    || guides.some((s) => onSeg(pt, s, JOIN_TOL))
    || dots.some((d) => Math.hypot(pt[0] - d.cx, pt[1] - d.cy) <= d.r + JOIN_TOL);
  const strictlyInside = (pt) => boxes.find((b) => (b.poly ? pointInPoly(pt[0], pt[1], b.poly) : pt[0] > b.x + 0.5 && pt[0] < b.x + b.w - 0.5 && pt[1] > b.y + 0.5 && pt[1] < b.y + b.h - 0.5));

  for (const edge of checked) {
    const { id, p, dashed } = edge;
    for (const s of p.segs) {
      if (length(s) > 0.5 && axis(s) === 'diag') add('error', 'DIAGONAL', `${id}: (${s.x1},${s.y1})→(${s.x2},${s.y2}) 是斜線；要斜線的圖型在 <svg> 加 data-geometry="free"`);
    }
    const ends = [['起點', p.start, p.segs[0], edge.tipStart], ['終點', p.end, p.segs.at(-1), edge.tipEnd]];
    const used = [];
    for (const [which, pt, seg, tip] of ends) {
      const inner = strictlyInside(pt);
      // 沒有箭頭的線端沿用「先畫線、再畫節點，端點被節點蓋住」的畫法；箭頭尖端被蓋住才是 bug
      if (inner && !tip) { used.push(inner); continue; }
      if (inner) { add('error', 'ENDPOINT-INSIDE', `${id}: ${which} (${pt}) 在 ${inner.id} 裡面，箭頭會被框蓋住（尖端要停在框邊）`); continue; }
      const a = attachToBox(pt, boxes);
      if (a) {
        used.push(a.box);
        const want = a.side === '上' || a.side === '下' ? 'v' : 'h';
        if (axis(seg) !== 'diag' && axis(seg) !== want) add('error', 'PERPENDICULAR', `${id}: ${which}從 ${a.box.id} 的${a.side}邊出入，第一段必須與該邊垂直`);
      } else if (tip && !joinsElsewhere(pt, edge)) {
        add('error', 'ENDPOINT', `${id}: 箭頭${which} (${pt}) 沒有停在任何節點邊緣、另一條線或圓點上`);
      }
    }
    for (const s of p.segs) {
      for (const b of boxes) {
        if (used.includes(b)) continue;
        if (segHitsBox(s, b)) add(dashed ? 'warn' : 'error', dashed ? 'THROUGH-DASHED' : 'THROUGH-NODE', `${id} 穿過 ${b.id} (${b.x},${b.y})`);
        else if (segHitsBox(s, b, NEAR_GAP)) add('warn', 'NEAR-NODE', `${id} 離 ${b.id} 不到 ${NEAR_GAP}px`);
      }
    }
  }

  // 分叉與合流：起點相同（一分多）或終點相同（多合一）的兩條線可以共用那一小段
  const sharesEnd = (a, b) => Math.hypot(a.p.start[0] - b.p.start[0], a.p.start[1] - b.p.start[1]) < 1
    || Math.hypot(a.p.end[0] - b.p.end[0], a.p.end[1] - b.p.end[1]) < 1;

  for (let i = 0; i < checked.length; i++) {
    for (let j = i + 1; j < checked.length; j++) {
      const A = checked[i], B = checked[j];
      const forkOrMerge = sharesEnd(A, B);
      for (const sa of A.p.segs) for (const sb of B.p.segs) {
        const [xa, xb] = [axis(sa), axis(sb)];
        if (xa === 'diag' || xb === 'diag') continue;
        if (xa === xb) {
          if (forkOrMerge) continue;
          const h = xa === 'h';
          if (Math.abs(h ? sa.y1 - sb.y1 : sa.x1 - sb.x1) > 1) continue;
          const [la, ha] = h ? span(sa.x1, sa.x2) : span(sa.y1, sa.y2);
          const [lb, hb] = h ? span(sb.x1, sb.x2) : span(sb.y1, sb.y2);
          if (Math.min(ha, hb) - Math.max(la, lb) > 4) add('error', 'OVERLAP', `${A.id} 與 ${B.id} 共用一段線；平行線至少錯開 ${FAN_GAP}px（一分多／多合一請從同一點出發）`);
        } else {
          const [hs, vs] = xa === 'h' ? [sa, sb] : [sb, sa];
          const [hx1, hx2] = span(hs.x1, hs.x2), [vy1, vy2] = span(vs.y1, vs.y2);
          if (hx1 + 0.5 < vs.x1 && vs.x1 < hx2 - 0.5 && vy1 + 0.5 < hs.y1 && hs.y1 < vy2 - 0.5) {
            const hop = [...A.p.arcs, ...B.p.arcs].some(([cx, cy]) => Math.hypot(cx - vs.x1, cy - hs.y1) <= 10);
            if (!hop) add('error', 'CROSS-NO-HOP', `${A.id} 與 ${B.id} 在 (${vs.x1},${hs.y1}) 交叉但沒有跳線`);
          }
        }
      }
    }
  }

  // 同一邊的接點相距 ≥ 12（分叉／合流的共用點除外）
  const slots = new Map();
  for (const edge of checked) {
    for (const [which, pt] of [['start', edge.p.start], ['end', edge.p.end]]) {
      const a = attachToBox(pt, boxes);
      if (!a) continue;
      const key = `${a.box.id}:${a.side}`;
      (slots.get(key) ?? slots.set(key, []).get(key)).push({ id: edge.id, which, at: a.side === '上' || a.side === '下' ? pt[0] : pt[1] });
    }
  }
  for (const [key, list] of slots) {
    list.sort((m, n) => m.at - n.at);
    for (let k = 1; k < list.length; k++) {
      const [m, n] = [list[k - 1], list[k]];
      if (n.at - m.at < FAN_GAP - 0.01 && n.at !== m.at) add('error', 'FAN-GAP', `${m.id} 與 ${n.id} 在 ${key} 的接點只相距 ${(n.at - m.at).toFixed(0)}px，需 ≥ ${FAN_GAP}px`);
    }
  }
  return out;
}

// ------------------------------------------------------------------- run ---

const FENCE = /^```diagram\n([\s\S]*?)\n```$/gm;

export function diagramsIn(text) {
  return [...text.matchAll(FENCE)].map((m) => {
    const cut = m[1].indexOf('\n---');
    return { title: /^title:\s*(.+)$/m.exec(m[1])?.[1]?.replace(/^"|"$/g, '') ?? '?', svg: cut < 0 ? '' : m[1].slice(cut + 4) };
  });
}

const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];
});

function run(files, { verbose = false } = {}) {
  let blocks = 0, errors = 0, warns = 0;
  for (const f of files) {
    for (const d of diagramsIn(readFileSync(f, 'utf8'))) {
      blocks++;
      for (const r of lintSvg(d.svg)) {
        if (r.level === 'error') errors++; else warns++;
        if (r.level === 'error' || verbose) console.log(`${r.level === 'error' ? '✗' : '·'} ${relative(process.cwd(), f)} [${d.title}] ${r.code}: ${r.msg}`);
      }
    }
  }
  console.log(`check:diagram-geometry: ${files.length} 篇、${blocks} 張圖，${errors} 個錯誤${verbose ? `、${warns} 個警告` : ''}`);
  return errors === 0;
}

// ------------------------------------------------------------- self-test ---

const wrap = (body) => `<svg viewBox="0 0 400 300">${body}</svg>`;
const box = (x, y, w = 100, h = 48) => `<rect class="dg-box" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>`;
const line = (d, extra = '') => `<path class="dg-line" d="${d}" marker-end="url(#arrow)"${extra}/>`;
const codes = (svg) => lintSvg(svg).filter((r) => r.level === 'error').map((r) => r.code);

function selfTest() {
  const cases = [
    ['乾淨的上下兩框通過', wrap(line('M100 48V96') + box(50, 0) + box(50, 100)), []],
    ['圓角轉折通過', wrap(line('M100 48V60Q100 68 108 68H196') + box(50, 0) + box(200, 40)), []],
    ['箭頭尖端縮進框裡', wrap(line('M100 48V112') + box(50, 0) + box(50, 100)), ['ENDPOINT-INSIDE']],
    ['線穿過不相干的框', wrap(line('M100 48V250') + box(50, 0) + box(50, 100) + box(50, 200)), ['THROUGH-NODE']],
    ['虛線穿框只算警告', wrap(line('M100 48V250', ' stroke-dasharray="4 4"') + box(50, 0) + box(50, 100) + box(50, 200)), []],
    ['斜線', wrap(line('M100 48L200 100') + box(50, 0) + box(200, 100)), ['DIAGONAL']],
    ['data-geometry="free" 略過', wrap(line('M100 48L200 100') + box(50, 0) + box(200, 100)).replace('<svg ', '<svg data-geometry="free" '), []],
    ['一分二（同起點）通過', wrap(line('M100 24H150Q158 24 158 32V60V72') + line('M100 24H300') + box(0, 0) + box(120, 72, 80, 40) + box(300, 0, 60)), []],
    ['兩條平行線共用一段', wrap(line('M100 24H250') + line('M120 24H300') + box(0, 0) + box(300, 0, 60)), ['OVERLAP']],
    ['交叉沒跳線', wrap(line('M40 100H360') + line('M200 40V160') + box(0, 80, 40, 40) + box(360, 80, 40, 40) + box(180, 0, 40, 40) + box(180, 160, 40, 40)), ['CROSS-NO-HOP']],
    ['交叉有跳線通過', wrap(line('M40 100H192A8 8 0 0 1 208 100H360') + line('M200 40V160') + box(0, 80, 40, 40) + box(360, 80, 40, 40) + box(180, 0, 40, 40) + box(180, 160, 40, 40)), []],
    ['曲線路徑略過', wrap(`<path class="dg-line" d="M50 50C100 0 200 0 250 50"/>` + box(0, 40) + box(250, 40)), []],
    ['無箭頭的線端進框通過（先畫線、框蓋住端點）', wrap('<path class="dg-line" d="M100 48V120"/>' + box(50, 0) + box(50, 100)), []],
    ['無箭頭的自由端通過（例如「回覆遺失」）', wrap('<path class="dg-line dg-line--dashed" d="M100 24H250"/>' + box(0, 0)), []],
    ['多個 M 的繩子拆成多段', wrap('<path class="dg-line" d="M100 20V50M100 150V190"/>' + box(50, 52, 100, 96) + box(50, 0, 100, 18)), []],
    ['圖例裡的線樣本不算連線', wrap(line('M100 48V96') + box(50, 0) + box(50, 100) + '<line class="dg-rule" x1="0" y1="250" x2="400" y2="250"/><text class="dg-tag" x="10" y="270">圖例</text>' + line('M100 280H130')), []],
    ['箭頭停在半空中', wrap(line('M100 48V80') + box(50, 0) + box(50, 100)), ['ENDPOINT']],
    ['節點超過上限', wrap(Array.from({ length: 10 }, (_, k) => box(k * 4, k * 20, 3, 3).replace('width="3" height="3"', 'width="30" height="12"')).join('') + line('M5 12V40')), ['COUNT-NODES']],
    ['線接到另一條線（合流）通過', wrap(line('M100 48V120') + line('M300 48V90H100') + box(50, 0) + box(250, 0) + box(50, 124)), []],
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
  const targets = files.length ? files : walk(resolve('src/content/posts'));
  process.exit(run(targets, { verbose: args.includes('--verbose') }) ? 0 : 1);
}
