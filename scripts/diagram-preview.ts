/**
 * Preview and lint the ```diagram / ```flow-diagram fences in a post without the dev server.
 *
 *   pnpm exec tsx scripts/diagram-preview.ts <post.md | snippet.md> [--out <dir>] [--skip-if-no-browser]
 *
 * Renders every fence with the site's real CSS, screenshots light, dark and 375px phone widths,
 * and fails (exit 1) on geometry a reader would notice: overlapping text, text outside the
 * viewBox, text cut by a box edge, unreadably small text on a phone, or page-level side scroll.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { parseDiagram, renderDiagram } from '../src/plugins/remarkDiagram';
import { parseFlowDiagram, renderFlowDiagram } from '../src/plugins/remarkFlowDiagram';

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith('--'));
if (!file) {
  console.error('usage: pnpm exec tsx scripts/diagram-preview.ts <post.md> [--out <dir>]');
  process.exit(2);
}
const outIndex = args.indexOf('--out');
const out = resolve(outIndex >= 0 ? args[outIndex + 1] : join(tmpdir(), 'diagram-preview', basename(file, '.md')));
mkdirSync(out, { recursive: true });

const source = readFileSync(file, 'utf8');
const lang = /^lang:\s*en\s*$/m.test(source.split(/^---$/m)[1] ?? '') ? 'en' : 'zh-TW';
const fences = [...source.matchAll(/^```(diagram|flow-diagram)\n([\s\S]*?)\n```$/gm)];
if (!fences.length) {
  console.error(`no diagram fences in ${file}`);
  process.exit(2);
}
let diagramIndex = 0;
let flowIndex = 0;
const figures = fences.map(([, kind, body]) => (kind === 'diagram' ? renderDiagram(parseDiagram(body, lang), diagramIndex++) : renderFlowDiagram(parseFlowDiagram(body), flowIndex++)));

const css = ['src/styles/tokens.css', 'src/styles/flowDiagram.css', 'src/styles/diagram.css'].map((path) => readFileSync(path, 'utf8')).join('\n');
const page = (theme: string) => `<!doctype html><html lang="${lang}" data-theme="${theme}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}
body{margin:0;background:var(--bg-page);color:var(--text-primary);font-family:"Noto Sans TC","PingFang TC",system-ui,sans-serif}
.content{max-width:760px;margin:0 auto;padding:16px}</style><body><div class="content">${figures.join('\n')}</div></body></html>`;
for (const theme of ['light', 'dark']) writeFileSync(join(out, `${theme}.html`), page(theme));

type Problem = { figure: number; kind: string; detail: string };
const LINT = `function (phone) {
      const issues = [];
      const intersects = (a, b, pad = 1) => a.left < b.right - pad && b.left < a.right - pad && a.top < b.bottom - pad && b.top < a.bottom - pad;
      const contains = (outer, inner) => inner.left >= outer.left - 1 && inner.right <= outer.right + 1 && inner.top >= outer.top - 1 && inner.bottom <= outer.bottom + 1;
      document.querySelectorAll('figure').forEach((figure, index) => {
        const svg = figure.querySelector('svg');
        if (!svg) return;
        const label = (el) => (el.textContent ?? '').trim().slice(0, 24);
        const texts = [...svg.querySelectorAll('text')].filter((t) => !t.closest('defs, .dg-badge, .flow-diagram__badge') && (t.textContent ?? '').trim());
        const boxes = texts.map((t) => t.getBoundingClientRect());
        const frame = svg.getBoundingClientRect();
        for (let a = 0; a < texts.length; a++) {
          if (!contains(frame, boxes[a])) issues.push({ figure: index, kind: 'outside-viewbox', detail: label(texts[a]) });
          for (let b = a + 1; b < texts.length; b++) {
            if (intersects(boxes[a], boxes[b])) issues.push({ figure: index, kind: 'text-overlap', detail: \`\${label(texts[a])} ↔ \${label(texts[b])}\` });
          }
          for (const rect of svg.querySelectorAll('rect.dg-box, rect.dg-zone, .flow-diagram__node rect')) {
            const r = rect.getBoundingClientRect();
            if (intersects(r, boxes[a], 2) && !contains(r, boxes[a])) issues.push({ figure: index, kind: 'text-crosses-box-edge', detail: label(texts[a]) });
          }
        }
        // Diamonds and other non-rect shapes: a label is cut when part of it falls inside the fill and part outside.
        const inverse = svg.getScreenCTM().inverse();
        for (const shape of svg.querySelectorAll('path.dg-box, polygon.dg-box, path.dg-face, polygon.dg-face')) {
          const sb = shape.getBoundingClientRect();
          texts.forEach((t, i) => {
            const b = boxes[i];
            if (!intersects(sb, b, 2)) return;
            const grid = [];
            for (let gx = 0; gx <= 6; gx++) for (let gy = 0; gy <= 2; gy++) grid.push([b.left + 1 + (b.width - 2) * gx / 6, b.top + 1 + (b.height - 2) * gy / 2]);
            const inside = grid.map(([x, y]) => shape.isPointInFill(new DOMPoint(x, y).matrixTransform(inverse))).filter(Boolean).length;
            if (inside > 0 && inside < grid.length) issues.push({ figure: index, kind: 'text-crosses-box-edge', detail: label(t) });
          });
        }
        // Sample every connector and flag text it runs through (labels need a visible gap from their line).
        const ctm = svg.getScreenCTM();
        for (const path of svg.querySelectorAll('path.dg-line, line.dg-line, line.dg-rule, path.dg-rule, line.dg-axis, path.dg-axis, path.flow-diagram__line')) {
          const length = path.getTotalLength();
          const hit = new Set();
          for (let d = 0; d <= length; d += 2) {
            const local = path.getPointAtLength(d);
            const p = new DOMPoint(local.x, local.y).matrixTransform(ctm);
            texts.forEach((t, i) => {
              const b = boxes[i];
              if (p.x > b.left + 1 && p.x < b.right - 1 && p.y > b.top + 1 && p.y < b.bottom - 1) hit.add(i);
            });
          }
          for (const i of hit) issues.push({ figure: index, kind: 'line-through-text', detail: label(texts[i]) });
        }
        if (phone) {
          const scale = frame.width / svg.viewBox.baseVal.width;
          const smallest = Math.min(...texts.map((t) => parseFloat(getComputedStyle(t).fontSize) * scale));
          if (smallest < 8.5) issues.push({ figure: index, kind: 'tiny-text-on-phone', detail: \`\${smallest.toFixed(1)}px\` });
        }
      });
      if (phone && document.documentElement.scrollWidth > window.innerWidth) issues.push({ figure: -1, kind: 'page-side-scroll', detail: \`\${document.documentElement.scrollWidth}px\` });
      return issues;
}`;
let browser;
try {
  browser = await chromium.launch();
} catch (error) {
  // pre-commit in a container without Playwright's browser: say so instead of blocking every commit.
  if (args.includes('--skip-if-no-browser')) {
    console.warn(`⚠ diagram-preview skipped for ${file}: no browser (${String(error).split('\n')[0]})`);
    process.exit(0);
  }
  throw error;
}
const problems: Problem[] = [];
for (const [name, viewport] of [['desktop', { width: 900, height: 1000 }], ['phone', { width: 375, height: 800 }]] as const) {
  for (const theme of ['light', 'dark']) {
    if (name === 'phone' && theme === 'dark') continue;
    const tab = await browser.newPage({ viewport, deviceScaleFactor: 2 });
    await tab.goto(`file://${join(out, `${theme}.html`)}`);
    await tab.evaluate(() => document.fonts.ready);
    const figuresOnPage = tab.locator('figure');
    for (let i = 0; i < (await figuresOnPage.count()); i++) await figuresOnPage.nth(i).screenshot({ path: join(out, `${i}-${theme}-${name}.png`) });
    if (theme !== 'light') { await tab.close(); continue; }
    // Passed as a string: tsx would otherwise inject helpers that do not exist in the page.
    const found: Problem[] = await tab.evaluate(`(${LINT})(${name === 'phone'})`);
    problems.push(...found.map((p) => ({ ...p, detail: `${p.detail} (${name})` })));
    await tab.close();
  }
}
await browser.close();

console.log(`${figures.length} diagram(s) → ${out}`);
if (problems.length) {
  for (const p of problems) console.log(`  ✗ figure ${p.figure} ${p.kind}: ${p.detail}`);
  process.exit(1);
}
console.log('  ✓ no overlapping, clipped or tiny text');
