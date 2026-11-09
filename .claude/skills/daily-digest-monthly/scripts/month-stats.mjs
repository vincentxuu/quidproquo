#!/usr/bin/env node
// 月報統計：把 signals 去重後算分子分母，避免同一事件跨日重複灌水。
// 用法：node .agents/skills/daily-digest-monthly/scripts/month-stats.mjs 2026-10 [2026-09]
import { readdirSync, readFileSync } from 'node:fs';

const DIR = 'src/data/daily-signals';
const STOP = new Set('a an the of to for in on at by with and or as is its it from new launches launch releases release announces announced says said report over after into up ai agent agents model models'.split(' '));

function tokens(title = '') {
  const t = title.toLowerCase();
  const latin = t.match(/[a-z0-9][a-z0-9.+-]*/g) ?? [];
  const cjk = [...(t.match(/[一-鿿]{2,}/g) ?? [])].flatMap((s) => [...s].slice(0, -1).map((_, i) => s.slice(i, i + 2)));
  return new Set([...latin.filter((w) => !STOP.has(w)), ...cjk]);
}
const jaccard = (a, b) => {
  let n = 0;
  for (const x of a) if (b.has(x)) n++;
  return n / (a.size + b.size - n || 1);
};
const normUrl = (u = '') => u.replace(/^https?:\/\/(www\.)?/, '').replace(/[?#].*$/, '').replace(/\/$/, '');

function load(month) {
  const files = readdirSync(DIR).filter((f) => f.startsWith(`${month}-`) && f.endsWith('.json')).sort();
  const signals = files.flatMap((f) => {
    const d = JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8'));
    return (Array.isArray(d) ? d : d.signals ?? []).map((s) => ({ ...s, _day: f.slice(0, 10) }));
  });
  return { files, signals };
}

// 單一連結分群：同網址，或同類別且共享公司、標題相似度夠高，視為同一事件。門檻偏保守，寧可少併。
function cluster(signals) {
  const groups = [];
  for (const s of signals) {
    const tk = tokens(s.title);
    const url = normUrl(s.sourceUrl);
    const comps = new Set(s.companies ?? []);
    const hit = groups.find((g) => g.urls.has(url) || (g.category === s.category
      && [...comps].some((c) => g.comps.has(c)) && jaccard(tk, g.tk) >= 0.34));
    if (hit) {
      hit.urls.add(url); hit.days.add(s._day); hit.items.push(s);
      for (const c of comps) hit.comps.add(c);
    } else {
      groups.push({ category: s.category, tk, urls: new Set([url]), comps: new Set(comps), days: new Set([s._day]), items: [s] });
    }
  }
  return groups;
}

function stats(month) {
  const { files, signals } = load(month);
  const groups = cluster(signals);
  const byCat = {};
  for (const g of groups) byCat[g.category] = (byCat[g.category] ?? 0) + 1;
  const byComp = {};
  for (const g of groups) for (const c of g.comps) byComp[c] = (byComp[c] ?? 0) + 1;
  return {
    month,
    daysWithSignals: files.length,
    rawSignals: signals.length,
    uniqueUrls: new Set(signals.map((s) => normUrl(s.sourceUrl))).size,
    events: groups.length,
    multiDayEvents: groups.filter((g) => g.days.size > 1).length,
    byCategory: Object.fromEntries(Object.entries(byCat).sort((a, b) => b[1] - a[1])),
    topCompanies: Object.entries(byComp).sort((a, b) => b[1] - a[1]).slice(0, 12),
    repeatSamples: groups.filter((g) => g.days.size > 2).sort((a, b) => b.days.size - a.days.size).slice(0, 6)
      .map((g) => ({ days: [...g.days].map((d) => d.slice(5)), title: g.items[0].title })),
  };
}

const months = process.argv.slice(2);
if (!months.length) { console.error('用法：month-stats.mjs YYYY-MM [YYYY-MM...]'); process.exit(2); }
console.log(JSON.stringify(months.map(stats), null, 1));
