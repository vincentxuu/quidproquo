#!/usr/bin/env node
// 過程外洩檢查：查證、核對的工作紀錄不該寫進正文。
//
// 三層分工（規則正文：.agents/skills/post/references/writing-guide.md「查證過程不寫進正文」）：
//   事實 → 正文直接陳述；會改變讀者做法的限制 → 用到的那一段一兩句；
//   過程（哪天打開、哪頁 404、試了哪些工具、哪些沒查到）→ .work/<slug>/evidence.md。
//
// 用法：
//   node scripts/check-process-leak.mjs <post.md ...>   指定檔案：超過門檻就失敗（pre-commit 用）
//   node scripts/check-process-leak.mjs                 全站：只計數、不失敗（既有文章回填中）
//   node scripts/check-process-leak.mjs --list          全站：列出超標文章
//   node scripts/check-process-leak.mjs --self-test
//
// 查證本身就是文章主題（例如核對一則貼文的說法）時，正文加一行 <!-- process-leak: topic -->。

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const POSTS = 'src/content/posts';

// 正文到這些 H2 為止；之後是出處區，查核日期、連結狀態可以寫在那裡。
const TAIL_H2 = /^## (課程影片來源|參考資料|更新紀錄|延伸閱讀|站內延伸閱讀|References|Sources|Further reading|Course video sources|Video sources|Update log|Changelog|Revision history)[ \t]*$/m;

const SENTENCE_PATTERNS = [
  // zh-TW
  /本(文|篇|系列)依據[：:*]/g,
  /(在|於) ?20\d\d-\d\d-\d\d ?(打開|開啟|查|核|讀|重查|確認|測|對照|比對|逐)/g,
  /打開核對|逐(頁|條|支|篇)核對|即時(對照|查核)|全部.{0,6}核對/g,
  /本(系列|文|篇)(沒有|未|並未)(確認|核對|驗證|打開|查證|逐支|逐篇)/g,
  /(無法|未能|沒能)(查證|確認|核實)|查不到|沒有查到|仍待核對|待人工確認/g,
  /(回傳|打開是|顯示) ?404|404 ?(錯誤|頁面)/g,
  /查核日期|查證日期/g,
  // en
  /\bThis (post|article|series) (is based on|draws on)[:*]/gi,
  /\b(checked|opened|verified|accessed|retrieved|re-checked) (it )?on 20\d\d-\d\d-\d\d/gi,
  /\b(we|I|this (post|series)) (did not|could not|couldn't|didn't|have not|haven't) (verify|confirm|check|open)/gi,
  /\breturn(s|ed)? (a )?404\b|\bis a 404\b/gi,
  /\b(still )?unverified\b|\bcould not be verified\b/gi,
];

// 整節都在講查證過程的 H2。只列實際出現過的形狀：以 verification 為技術主題的標題（Speculative decoding、
// face verification）不能誤擋。
const PROCESS_H2 = /^## (.*(仍待核對|數字與查證|查證方(式|法)|逐頁核對|可以確認與不能確認|可以確認什麼，不能確認什麼|說法的查證)|(附錄：)?(查證|查核|核對)[ \t]*$|.*(Still to verify|how they were checked|could and could(n't| not) verify|verification method|what this (post|article) verifies|\(Verified 20\d\d)).*$/gim;

// 課程總覽額外一層：講「怎麼查這門課」的 H2 不得超過 1 個。
const AUDIT_H2 = /^## .*(硬事實|存取分級|公開程度|拿得到什麼|版本基準|為什麼以|為什麼不讀|沒寫清楚|不能照抄|學期對照|兩學期|利益揭露|課站在哪|Hard facts|Access tier|Access level|What you can get|Version baseline|Why .* baseline|Why not)/gim;

// 歸因但書堆疊：查證回饋常被修成「這是我的判斷，不是來源的說法」，修一輪疊一層，正文變成在讀歸因。
// 作者主張要嘛刪、要嘛改成來源原意、要嘛直接寫成主張；標示句全篇幾處就夠。規則：writing-guide「但書與歸因不堆疊」。
const HEDGE_PATTERNS = [
  /我的(判斷|推測|推論|解讀|概括|直覺)/g,
  /(這|以上|以下|接下來)(只)?是我(的|自己的)?(判斷|推測|推論|解讀|概括|看法)/g,
  /不是(來源|頁面|原文|官方|規則頁|[A-Za-z][\w .-]{0,20})(的)?(說法|內容|結論)/g,
  /(頁面|來源|原文)(沒有|並沒有|沒)(寫|說|解釋|給)(明|出)?/g,
  /\bmy (own )?(judgment|judgement|inference|guess|reading|interpretation|speculation)\b/gi,
  /\bnot (the source's|the page's|[A-Z][\w .-]{0,20}'s) (claim|wording|conclusion)\b/gi,
  /\bthe (page|source) (does not|doesn't) (say|explain|define|state)\b/gi,
];

const TIME_SENSITIVE = /票價|價格|匯率|時刻表|班次|\b(fares?|prices?|exchange rates?|timetables?|schedules?)\b/i;

const SENTENCE_LIMIT = 2; // 正文超過這個數就失敗
const AUDIT_H2_LIMIT = 1;
const HEDGE_LIMIT = 3; // 正文超過這個數就失敗

function bodyOf(text) {
  const fm = text.match(/^---\n([\s\S]*?)\n---\n?/);
  const frontmatter = fm ? fm[1] : '';
  let body = fm ? text.slice(fm[0].length) : text;
  body = body.replace(/```[\s\S]*?```/g, '');
  const tail = body.search(TAIL_H2);
  if (tail >= 0) body = body.slice(0, tail);
  return { frontmatter, body };
}

// A quoted target expression in a speaking lesson is teaching material, not an
// author hedging a claim. Keep ordinary prose and all other checks unchanged.
function isSpeakingExample(frontmatter, body, match) {
  const tagList = /^tags:\s*\[([^\]\n]*)\]\s*$/m.exec(frontmatter);
  const tags = tagList?.[1].split(',').map(tag => tag.trim().replace(/^(['"])(.*)\1$/, '$2')) ?? [];
  if (!/^category:\s*learning\s*$/m.test(frontmatter) || !tags.includes('english-speaking')) return false;
  if (!/^my guess$/i.test(match[0])) return false;
  const lineStart = body.lastIndexOf('\n', match.index - 1) + 1;
  const nextLine = body.indexOf('\n', match.index);
  const line = body.slice(lineStart, nextLine < 0 ? body.length : nextLine);
  const offset = match.index - lineStart;
  if (/^\s*\|/.test(line) || /^\s*>\s*(?:[A-Z]|You|Staff|Interviewer):\s/.test(line)) return true;
  const headings = [...body.slice(0, match.index).matchAll(/^## (.+)$/gm)];
  const inExercise = /換內容|回想|練習|再說|say.*again|practi[cs]e|recall/i.test(headings.at(-1)?.[1] ?? '');
  return [...line.matchAll(/\*{1,2}[^*\n]+\*{1,2}/g)].some(span => {
    if (offset < span.index || offset + match[0].length > span.index + span[0].length) return false;
    // Emphasis alone is not enough: an author's italicized guess still counts.
    const labelled = /\b(?:example|phrase|pattern|practi[cs]e|say|try)\b|例句|說法|句型|練|表達|參考/i.test(line.slice(0, span.index));
    const exerciseItem = inExercise && /^\s*-\s*$/.test(line.slice(0, span.index));
    return labelled || exerciseItem;
  });
}

export function analyze(text) {
  if (/<!--\s*process-leak:\s*topic\s*-->/.test(text)) return { exempt: true, sentences: [], processH2: [], auditH2: [], hedges: [] };
  const { frontmatter, body } = bodyOf(text);
  const hedges = HEDGE_PATTERNS.flatMap((re) => [...body.matchAll(re)].filter(m => !isSpeakingExample(frontmatter, body, m)).map((m) => m[0]));
  const sentences = [];
  for (const re of SENTENCE_PATTERNS) {
    for (const m of body.matchAll(re)) {
      // 時效性資料（票價、匯率、時刻表）的查詢日期是讀者要的限制，不算過程。
      const around = body.slice(Math.max(0, m.index - 60), m.index + m[0].length + 20);
      if (TIME_SENSITIVE.test(around)) continue;
      sentences.push(m[0]);
    }
  }
  const processH2 = [...body.matchAll(PROCESS_H2)].map((m) => m[0]);
  const isOverview = /\n {2}order: 0\b/.test(`\n${frontmatter}`) && /ai-course|course/.test(frontmatter);
  const auditH2 = isOverview ? [...body.matchAll(AUDIT_H2)].map((m) => m[0]) : [];
  return { exempt: false, sentences, processH2, auditH2, hedges };
}

export function problems(r) {
  if (r.exempt) return [];
  const out = [];
  if (r.sentences.length > SENTENCE_LIMIT) out.push(`正文有 ${r.sentences.length} 處查證過程句型（上限 ${SENTENCE_LIMIT}）：${[...new Set(r.sentences)].slice(0, 6).join('、')}`);
  if (r.processH2.length > 0) out.push(`整節在講查證過程：${r.processH2.join('、')}`);
  if (r.hedges.length > HEDGE_LIMIT) out.push(`正文有 ${r.hedges.length} 處歸因但書（上限 ${HEDGE_LIMIT}）：${[...new Set(r.hedges)].slice(0, 6).join('、')}`);
  if (r.auditH2.length > AUDIT_H2_LIMIT) out.push(`課程總覽有 ${r.auditH2.length} 個查課型 H2（上限 ${AUDIT_H2_LIMIT}）：${r.auditH2.join('、')}`);
  return out;
}

function allPosts() {
  const files = [];
  for (const d of readdirSync(POSTS)) {
    const dir = join(POSTS, d);
    if (!statSync(dir).isDirectory()) continue;
    for (const f of readdirSync(dir)) if (f.endsWith('.md')) files.push(join(dir, f));
  }
  return files;
}

const HINT = '修法：事實直接寫；會改變讀者做法的限制併進用到的段落；過程（日期、404、沒查到）移到 .work/<slug>/evidence.md。查證本身是主題時加 <!-- process-leak: topic -->。規則見 writing-guide「查證過程不寫進正文」。\n歸因但書：作者主張刪掉、改成來源原意，或直接寫成主張；不要逐句標「這是我的判斷」。規則見 writing-guide「但書與歸因不堆疊」。';

function selfTest() {
  const assert = (c, m) => { if (!c) { console.error(`✗ ${m}`); process.exitCode = 1; } else console.log(`✓ ${m}`); };
  const fm = '---\ntitle: x\n---\n';
  assert(problems(analyze(`${fm}正文講 VC 維度。\n\n## 參考資料\n\n查核日期：2026-10-10，打開是 404，本文依據：x，無法查證。`)).length === 0, '出處區的查核紀錄不算');
  assert(problems(analyze(`${fm}**本文依據**：a。在 2026-09-30 打開核對。回傳 404。本系列沒有確認。`)).length === 1, '正文四處過程句型會擋');
  assert(problems(analyze(`${fm}## 仍待核對\n\n- a`)).length === 1, '查證型 H2 會擋');
  assert(problems(analyze(`${fm}<!-- process-leak: topic -->\n## 對原貼文說法的查證\n本文依據：a。回傳 404。無法查證。查不到。`)).length === 0, 'topic 標記豁免');
  const ov = '---\ntags: [ai-course]\nseries:\n  name: x\n  order: 0\n---\n';
  assert(problems(analyze(`${ov}## 這門課的硬事實\n## 存取分級：A2\n## 主線`)).length === 1, '總覽兩個查課型 H2 會擋');
  assert(problems(analyze(`${ov}## 存取分級：A2\n## 主線`)).length === 0, '總覽一個查課型 H2 可以');
  assert(problems(analyze(`${fm}Fares were checked on 2026-10-07 and will change. 票價都是 2026-10-07 查詢。`)).length === 0, '票價的查詢日期不算過程');
  assert(problems(analyze(`${fm}我的判斷是 A。這是我的推論，不是 Red Hat 的說法。頁面沒有寫。我的推測是 B。`)).length === 1, '四處歸因但書會擋');
  assert(problems(analyze(`${fm}我的判斷是 A。頁面沒有解釋定價理由。`)).length === 0, '兩處歸因但書可以');
  assert(problems(analyze(`${fm}My judgment is A. This is my inference, not Red Hat's claim. The page does not say why. My guess is B.`)).length === 1, '英文歸因但書會擋');
  const speaking = '---\ncategory: learning\ntags: [english-speaking, speaking]\n---\n';
  const lesson = '| 中文 | My guess is that it is a cache issue. |\n> B: My guess is that it is a cache issue.\nThe phrase *My guess is that…* is useful.\nTry **My guess is that it is temporary.**';
  assert(problems(analyze(speaking + lesson)).length === 0, '口說教材的表格、角色台詞與標記例句不是作者但書');
  assert(problems(analyze(speaking + 'My guess is A. My guess is B. My guess is C. My guess is D.')).length === 1, '口說文章的作者敘述仍受但書門檻限制');
  assert(problems(analyze(speaking + 'Status: *My guess is A*. Status: *My guess is B*. Status: *My guess is C*. Status: *My guess is D*.')).length === 1, '作者但書不因斜體而略過');
  for (const prefix of ['In this essay, ', 'In this country, ']) {
    assert(problems(analyze(speaking + Array.from({ length: 4 }, () => `${prefix}*My guess is A*.`).join(' '))).length === 1, `${prefix}不能誤當 say/try 教學標記`);
  }
  for (const nearTag of ['not-english-speaking', 'english-speaking-extra']) {
    assert(problems(analyze(speaking.replace('english-speaking, speaking', nearTag) + Array.from({ length: 4 }, () => '| My guess is A. |').join('\n'))).length === 1, `${nearTag}不是口說教材精確 tag`);
  }

  assert(problems(analyze(fm + lesson)).length === 1, '非口說文章不套用教材例句辨識');
  assert(problems(analyze(speaking + '## 仍待核對\n\n- a')).length === 1, '口說文章仍擋查證待辦章節');

  assert(problems(analyze(`${fm}We checked it on 2026-09-30. The page returns 404. We could not verify it. Still unverified.`)).length === 1, '英文句型會擋');
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) {
  selfTest();
} else {
  const files = args.filter((a) => !a.startsWith('--'));
  if (files.length > 0) {
    let bad = 0;
    for (const f of files) {
      const p = problems(analyze(readFileSync(f, 'utf8')));
      if (p.length) { bad += 1; console.log(`🔴 ${f}\n   ${p.join('\n   ')}`); }
    }
    if (bad) { console.log(HINT); process.exitCode = 1; }
  } else {
    const rows = allPosts().map((f) => ({ f, p: problems(analyze(readFileSync(f, 'utf8'))) })).filter((r) => r.p.length);
    if (args.includes('--list')) for (const r of rows) console.log(`${r.f}\n   ${r.p.join('\n   ')}`);
    console.log(`process-leak：全站 ${rows.length} 篇超標（全站模式只計數；被修改的文章在 pre-commit 會被擋）`);
  }
}
