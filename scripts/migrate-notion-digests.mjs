#!/usr/bin/env node
/**
 * Migrate Notion arxiv digests to blog posts using Notion's internal API.
 * No browser needed — uses loadPageChunk API directly.
 *
 * Usage:
 *   node scripts/migrate-notion-digests.mjs           # migrate all
 *   node scripts/migrate-notion-digests.mjs --dry-run  # preview only
 *   node scripts/migrate-notion-digests.mjs --from 2026-07-01
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const NOTION_SITE = 'https://stump-digit-b8b.notion.site';
const POSTS_DIR = 'src/content/posts/daily';
const PAPER_INDEX_PATH = 'src/data/paper-index.json';
const DRY_RUN = process.argv.includes('--dry-run');
const FROM_DATE = process.argv.find((_, i) => process.argv[i - 1] === '--from') || '2026-05-26';

const TOPIC_KEYWORDS = {
  'agent-memory': ['memory', 'memoriz', 'context window', 'context length', 'episodic', 'long-horizon', 'forgetting', 'recall', '記憶', '遺忘', 'context compress'],
  'agent-security': ['security', 'safety', 'attack', 'adversar', 'injection', 'jailbreak', 'guardrail', 'red team', 'vulnerab', '安全', '攻擊', '防禦', 'prompt injection'],
  'agent-evaluation': ['benchmark', 'evaluat', 'leaderboard', 'assess', 'metric', 'shadow eval', '評測', '評估', 'SWE-bench'],
  'agent-reasoning': ['reason', 'planning', 'chain-of-thought', 'decision', 'self-reflect', '推理', '規劃'],
  'agent-tool-use': ['tool use', 'tool call', 'function call', 'API call', '工具呼叫', '工具選擇'],
  'multi-agent': ['multi-agent', 'multi agent', 'orchestrat', 'collaborat', 'protocol', 'MCP', 'A2A', '多代理', '協作', '協定'],
  'agent-rag': ['RAG', 'retrieval', 'augmented generation', 'vector', 'embedding', '檢索', '向量'],
  'agent-framework': ['framework', 'scaffold', 'architect', 'LangGraph', 'CrewAI', 'workflow engine', '框架', '架構', '鷹架'],
  'agent-deployment': ['deploy', 'production', 'cost', 'latency', 'inference', 'scaling', '部署', '成本'],
  'agent-coding': ['coding', 'code gen', 'SWE', 'programm', 'IDE', 'debug', 'Coding Agent'],
};

const PAGES = [
  { date: '2026-05-25', id: '36bddaf9-032b-81ba-828b-e8a490ae58d9' },
  { date: '2026-05-26', id: '36cddaf9-032b-8104-836d-e4123e9a2cdf' },
  { date: '2026-05-27', id: '36dddaf9-032b-81f4-bcb6-d6788a43cadf' },
  { date: '2026-05-28', id: '36eddaf9-032b-8126-ae25-ffc9a706d6a5' },
  { date: '2026-05-29', id: '36fddaf9-032b-81f2-b5cc-d164d2e34996' },
  { date: '2026-05-30', id: '370ddaf9-032b-81d6-a6ca-cf7febb6ad58' },
  { date: '2026-05-31', id: '371ddaf9-032b-8157-8006-c0a29449a10f' },
  { date: '2026-06-01', id: '372ddaf9-032b-814e-854b-dde9a46ab6c3' },
  { date: '2026-06-02', id: '373ddaf9-032b-8110-85d7-dfc7d0bcf52c' },
  { date: '2026-06-03', id: '374ddaf9-032b-815f-8b46-d2e2f8bde97f' },
  { date: '2026-06-04', id: '375ddaf9-032b-8158-9e4f-d478667c73ee' },
  { date: '2026-06-05', id: '376ddaf9-032b-8110-ba88-cf6a535f5a54' },
  { date: '2026-06-06', id: '377ddaf9-032b-8142-a4b9-d401fbb943d8' },
  { date: '2026-06-07', id: '378ddaf9-032b-8130-adf2-cf60ec99c6bd' },
  { date: '2026-06-08', id: '379ddaf9-032b-81ae-9066-c34f57cd41b1' },
  { date: '2026-06-09', id: '37addaf9-032b-8168-b12c-ed001e1d73ee' },
  { date: '2026-06-10', id: '37bddaf9-032b-810a-8459-c01fb8b063cd' },
  { date: '2026-06-11', id: '37cddaf9-032b-8127-a9cb-fe053eeabf40' },
  { date: '2026-06-12', id: '37dddaf9-032b-8122-9304-e6a1a082cd36' },
  { date: '2026-06-13', id: '37eddaf9-032b-8108-a846-e3a54f608445' },
  { date: '2026-06-14', id: '37fddaf9-032b-8112-842d-ce538d4ad7b4' },
  { date: '2026-06-15', id: '380ddaf9-032b-810d-85e6-f140a7600d31' },
  { date: '2026-06-16', id: '381ddaf9-032b-8183-a769-ee67969e86ad' },
  { date: '2026-06-17', id: '382ddaf9-032b-8185-b4f3-f9a1f9d79da8' },
  { date: '2026-06-18', id: '383ddaf9-032b-811a-9e7d-cbb7f1e0acaf' },
  { date: '2026-06-19', id: '384ddaf9-032b-816e-991d-cd912d0e9099' },
  { date: '2026-06-20', id: '385ddaf9-032b-814f-97b0-d4bfc930ac01' },
  { date: '2026-06-21', id: '386ddaf9-032b-8112-8543-d0014a4828c1' },
  { date: '2026-06-22', id: '387ddaf9-032b-8130-9529-e1bb2e90acb1' },
  { date: '2026-06-23', id: '388ddaf9-032b-8190-bf84-c428549d42eb' },
  { date: '2026-06-24', id: '389ddaf9-032b-8190-8391-ed6172696f30' },
  { date: '2026-06-25', id: '38addaf9-032b-8155-af89-ce860eb7d6e6' },
  { date: '2026-06-26', id: '38bddaf9-032b-815b-b724-d22e35ca8934' },
  { date: '2026-06-27', id: '38cddaf9-032b-813e-a135-f60137506eb0' },
  { date: '2026-06-28', id: '38dddaf9-032b-8142-b090-deb7ac471603' },
  { date: '2026-06-29', id: '38eddaf9-032b-8109-8850-f4f4fa0a177a' },
  { date: '2026-06-30', id: '38fddaf9-032b-815d-a8c3-dd3a3212884c' },
  { date: '2026-07-01', id: '390ddaf9-032b-81b2-a47a-eac4c56e0b76' },
  { date: '2026-07-02', id: '391ddaf9-032b-81c7-b6df-c2e7b26673e3' },
  { date: '2026-07-03', id: '392ddaf9-032b-81b7-9bac-d3bc3d2295c1' },
  { date: '2026-07-04', id: '393ddaf9-032b-81f5-afb7-c1e987162d03' },
  { date: '2026-07-05', id: '394ddaf9-032b-813e-b9df-d7cd02d63879' },
  { date: '2026-07-06', id: '395ddaf9-032b-81f2-84cd-c2f1cb785f06' },
  { date: '2026-07-07', id: '396ddaf9-032b-8185-82fb-fac812815c7f' },
  { date: '2026-07-08', id: '397ddaf9-032b-8181-90c7-f59b09d2ad10' },
  { date: '2026-07-09', id: '398ddaf9-032b-817b-bd3e-df192e1dc92d' },
  { date: '2026-07-10', id: '399ddaf9-032b-81b8-a2f5-f6fbebd687ad' },
  { date: '2026-07-11', id: '39addaf9-032b-81a7-a667-f140e8b1ce36' },
  { date: '2026-07-12', id: '39bddaf9-032b-81b9-9dc2-d1f336b6eb5c' },
  { date: '2026-07-13', id: '39cddaf9-032b-81ee-b05c-dca28c2eec3b' },
  { date: '2026-07-14', id: '39dddaf9-032b-8133-b16e-e6913416e01f' },
  { date: '2026-07-15', id: '39eddaf9-032b-81e6-a729-c16e4befad23' },
  { date: '2026-07-16', id: '39fddaf9-032b-81eb-a8df-c773c2b0cfab' },
  { date: '2026-07-17', id: '3a0ddaf9-032b-818e-9a4c-c5e3c82662c2' },
  { date: '2026-07-18', id: '3a1ddaf9-032b-81bb-8ca1-fd7b23bd1b63' },
  { date: '2026-07-19', id: '3a2ddaf9-032b-8199-b930-d887d0c16572' },
  { date: '2026-07-20', id: '3a3ddaf9-032b-8193-88a1-d4dff3e1c681' },
  { date: '2026-07-21', id: '3a4ddaf9-032b-8116-b34d-d9f1b142162b' },
  { date: '2026-07-22', id: '3a5ddaf9-032b-815b-9920-cc8e0a5ee18f' },
  { date: '2026-07-23', id: '3a6ddaf9-032b-817a-8eb4-fcea67245d72' },
  { date: '2026-07-24', id: '3a7ddaf9-032b-81c1-87f2-cddb6098223a' },
  { date: '2026-07-25', id: '3a8ddaf9-032b-815c-82ce-e05b77d1f7ec' },
  { date: '2026-07-26', id: '3a9ddaf9-032b-81a4-a4b0-e78bfd43df1a' },
  { date: '2026-07-27', id: '3aaddaf9-032b-81f6-a2c0-dd10615929c2' },
  { date: '2026-07-28', id: '3abddaf9-032b-8101-842c-c4758fd0b565' },
  { date: '2026-07-29', id: '3acddaf9-032b-81d1-9a2a-d49c0c069fdb' },
  { date: '2026-07-30', id: '3adddaf9-032b-81b4-ba7d-d5d3ce9b46e4' },
  { date: '2026-07-31', id: '3aeddaf9-032b-8101-a15f-ef6a749794fb' },
  { date: '2026-08-01', id: '3afddaf9-032b-8140-bb36-e964ceb5634a' },
  { date: '2026-08-02', id: '3b0ddaf9-032b-811c-9ee3-c4f2766c344d' },
  { date: '2026-08-03', id: '3b1ddaf9-032b-81e8-9f2f-e40bd5eee4e7' },
  { date: '2026-08-04', id: '3b2ddaf9-032b-813b-86b5-c67fcfbb3ab3' },
];

const BASE_DATE = new Date('2026-05-25');

async function fetchPageBlocks(pageId) {
  let allBlocks = {};
  let cursor = { stack: [] };
  let chunkNumber = 0;
  while (true) {
    const resp = await fetch(`${NOTION_SITE}/api/v3/loadPageChunk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId, limit: 200, cursor, chunkNumber, verticalColumns: false }),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const blocks = data.recordMap?.block || {};
    Object.assign(allBlocks, blocks);
    cursor = data.cursor || { stack: [] };
    chunkNumber++;
    if (!cursor.stack || cursor.stack.length === 0 || chunkNumber > 10) break;
    await new Promise(r => setTimeout(r, 100));
  }
  return { recordMap: { block: allBlocks } };
}

function richTextToMd(titleArr) {
  if (!titleArr) return '';
  return titleArr.map(seg => {
    if (typeof seg === 'string') return seg;
    if (!Array.isArray(seg)) return '';
    const text = seg[0] || '';
    const anns = seg[1] || [];
    let result = text;
    for (const ann of anns) {
      if (!Array.isArray(ann)) continue;
      if (ann[0] === 'b') result = `**${result}**`;
      if (ann[0] === 'i') result = `*${result}*`;
      if (ann[0] === 'c') result = `\`${result}\``;
      if (ann[0] === 'a' && ann[1]) result = `[${text}](${ann[1]})`;
    }
    return result;
  }).join('');
}

function plainText(titleArr) {
  if (!titleArr) return '';
  return titleArr.map(seg => (Array.isArray(seg) ? seg[0] : seg) || '').join('');
}

function blocksToMarkdown(data) {
  const blockMap = data.recordMap?.block || {};
  const pageBlock = Object.values(blockMap).find(b => {
    const v = b?.value?.value || b?.value;
    return v?.type === 'page';
  });
  const pageVal = pageBlock?.value?.value || pageBlock?.value;
  const topIds = pageVal?.content || [];

  const lines = [];

  function renderChildren(parentId) {
    const parentData = blockMap[parentId];
    const parentVal = parentData?.value?.value || parentData?.value;
    const childIds = parentVal?.content || [];
    for (const cid of childIds) {
      renderBlock(cid);
    }
  }

  function renderBlock(blockId) {
    const bdata = blockMap[blockId];
    const val = bdata?.value?.value || bdata?.value;
    if (!val) return;
    const { type } = val;
    const md = richTextToMd(val.properties?.title);
    const raw = plainText(val.properties?.title);
    const childIds = val.content || [];

    if (type === 'table') {
      const rowIds = childIds;
      const rows = rowIds.map(rid => blockMap[rid]).filter(Boolean);
      if (rows.length === 0) return;
      const firstRow = rows[0]?.value?.value || rows[0]?.value;
      const propKeys = Object.keys(firstRow?.properties || {});
      if (propKeys.length < 2) return;
      const header = propKeys.map(k => plainText(firstRow.properties[k]));
      lines.push('');
      lines.push('| ' + header.join(' | ') + ' |');
      lines.push('|' + header.map(() => '---|').join(''));
      for (let ri = 1; ri < rows.length; ri++) {
        const rv = rows[ri]?.value?.value || rows[ri]?.value;
        const cells = propKeys.map(k => richTextToMd(rv?.properties?.[k]));
        lines.push('| ' + cells.join(' | ') + ' |');
      }
      lines.push('');
      return;
    }
    if (type === 'table_row' || type === 'page') return;
    if (!md && type !== 'divider') { renderChildren(blockId); return; }

    if (type === 'header') { lines.push(`\n## ${md}\n`); renderChildren(blockId); return; }
    if (type === 'sub_header') { lines.push(`\n### ${md}\n`); renderChildren(blockId); return; }
    if (type === 'sub_sub_header') { lines.push(`\n#### ${md}\n`); renderChildren(blockId); return; }
    if (type === 'bulleted_list') { lines.push(`- ${md}`); renderChildren(blockId); return; }
    if (type === 'numbered_list') { lines.push(`1. ${md}`); renderChildren(blockId); return; }
    if (type === 'divider') { lines.push('\n---\n'); return; }

    if (type === 'callout') {
      if (raw.includes('TL;DR')) {
        const content = md.replace(/^.*TL;DR\s*[—–-]\s*/, '');
        lines.push(`\n### TL;DR\n\n${content}`);
      } else if (raw.includes('Read Priority')) {
        const content = md.replace(/^.*Read Priority\s*[—–-]\s*/, '');
        lines.push(`\n### Read Priority\n\n${content}`);
      } else if (raw.includes('領域背景')) {
        lines.push('\n### 領域背景\n');
      } else if (raw.includes('Reviewer')) {
        const content = md.replace(/^.*Reviewer\s*一句話評\s*[—–]?\s*/, '');
        lines.push(`\n### Reviewer 一句話評\n\n${content}`);
      } else if (/take-away/i.test(raw)) {
        lines.push('\n### 給你的 take-away\n');
      } else if (raw.includes('今日總覽')) {
        lines.push('\n## 今日總覽\n');
      } else if (raw.includes('讀這篇前該知道的詞')) {
        lines.push('\n## 讀這篇前該知道的詞\n');
      } else if (raw.includes('中階導讀')) {
        lines.push('\n### 中階導讀\n');
      } else if (raw.includes('深入要點')) {
        lines.push('\n### 深入要點\n');
      } else {
        lines.push(md);
      }
      renderChildren(blockId);
      return;
    }

    if (md) lines.push(md);
    renderChildren(blockId);
  }

  for (const id of topIds) {
    renderBlock(id);
  }
  return lines.join('\n');
}

function assignTopics(content) {
  const lower = content.toLowerCase();
  return Object.entries(TOPIC_KEYWORDS)
    .map(([topic, kws]) => [topic, kws.filter(kw => lower.includes(kw.toLowerCase())).length])
    .filter(([, s]) => s >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([t]) => t);
}

function extractPapers(content, date) {
  const papers = [];
  const re = /## 論文[一二三四五]｜(.+)/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const titleZh = m[1].trim();
    const chunk = content.slice(m.index, m.index + 3000);
    const aid = chunk.match(/\*\*arxiv\*\*:\s*(\d{4}\.\d{4,5})/);
    const aidFallback = chunk.match(/arxiv:\s*(\d{4}\.\d{4,5})/);
    const arxivId = (aid || aidFallback)?.[1];
    const auth = chunk.match(/\*\*作者\*\*:\s*(.+?)(?:\s*·|\n)/);
    const authFallback = chunk.match(/作者:\s*(.+?)(?:\s*·|\n)/);
    const tldr = chunk.match(/### TL;DR\s*\n+(.+)/);
    const rp = chunk.match(/### Read Priority\s*\n+(.+)/);
    if (arxivId) {
      papers.push({
        arxivId,
        title: titleZh,
        titleZh,
        authors: ((auth || authFallback)?.[1] || '').split(/[,，]/).map(a => a.trim()).filter(Boolean).slice(0, 3),
        affiliation: '',
        topics: assignTopics(chunk),
        readPriority: rp?.[1]?.includes('必讀') ? 'must-read' : rp?.[1]?.includes('略讀') ? 'skim' : 'skip',
        keyFinding: (tldr?.[1] || '').slice(0, 200),
        digestDate: date,
        digestSlug: `daily/${date}-ai-agent-arxiv-digest`,
      });
    }
  }
  return papers;
}

async function processPage(page) {
  const outPath = join(POSTS_DIR, `${page.date}-ai-agent-arxiv-digest.md`);
  if (existsSync(outPath)) return { status: 'skip', papers: [] };

  const data = await fetchPageBlocks(page.id);
  const content = blocksToMarkdown(data);
  if (content.length < 100) return { status: 'empty', papers: [] };

  const topics = assignTopics(content);
  const order = Math.round((new Date(page.date) - BASE_DATE) / 86400000) + 1;
  const overview = (content.match(/## 今日總覽\s*\n+([\s\S]*?)(?=\n## |\n---)/)?.[1] || '').trim();
  const desc = (overview.split(/[。！？\n]/)[0] || '').slice(0, 150);

  const fm = `---
title: "AI Agent Arxiv Digest — ${page.date}"
date: ${page.date}
category: daily
tags: [ai-agent, arxiv, daily${topics.length ? ', ' + topics.join(', ') : ''}]
lang: zh-TW
description: "${desc.replace(/"/g, '\\"')}"
tldr: "${overview.slice(0, 300).replace(/"/g, '\\"')}"
series:
  name: "AI Agent Arxiv Digest"
  order: ${order}
---`;

  if (!DRY_RUN) writeFileSync(outPath, `${fm}\n${content}\n`);
  const papers = extractPapers(content, page.date);
  console.log(`  ${DRY_RUN ? '[dry]' : '✓'} ${page.date} (${content.length} chars, ${topics.join(',')}, ${papers.length} papers)`);
  return { status: 'ok', papers };
}

async function main() {
  mkdirSync(POSTS_DIR, { recursive: true });
  const pages = PAGES.filter(p => p.date >= FROM_DATE);
  console.log(`Migrating ${pages.length} pages from ${FROM_DATE}${DRY_RUN ? ' [DRY RUN]' : ''}...\n`);

  const allPapers = [];
  let ok = 0, skip = 0, fail = 0;
  for (const page of pages) {
    try {
      const r = await processPage(page);
      if (r.status === 'ok') { ok++; allPapers.push(...r.papers); }
      else if (r.status === 'skip') { skip++; console.log(`  - ${page.date} (exists)`); }
      else { fail++; console.log(`  ! ${page.date} (empty)`); }
    } catch (err) {
      fail++;
      console.log(`  ✗ ${page.date}: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  if (!DRY_RUN && allPapers.length) {
    const idx = JSON.parse(readFileSync(PAPER_INDEX_PATH, 'utf8'));
    const seen = new Set(idx.papers.map(p => p.arxivId));
    const fresh = allPapers.filter(p => !seen.has(p.arxivId));
    idx.papers.push(...fresh);
    idx.papers.sort((a, b) => a.digestDate.localeCompare(b.digestDate));
    writeFileSync(PAPER_INDEX_PATH, JSON.stringify(idx, null, 2));
    console.log(`\nPaper index: +${fresh.length} (total ${idx.papers.length})`);
  }
  console.log(`\nDone: ${ok} written, ${skip} skipped, ${fail} failed, ${allPapers.length} papers`);
}

main().catch(e => { console.error(e); process.exit(1); });
