#!/usr/bin/env node
// migrate-notion-digests.mjs
// Migrates arxiv digests from Notion to blog posts.
// Designed to be run by a cloud routine with firecrawl MCP access.
//
// Usage: This script generates the manifest and conversion logic.
// The actual fetching must be done by an agent with MCP firecrawl access.
// The agent should:
//   1. Run this script with --manifest to get the URL list
//   2. Fetch each URL with firecrawl_scrape
//   3. Save raw markdown to scripts/migrate-data/raw/{date}.md
//   4. Run this script with --convert to process all raw files
//   5. Run this script with --index to build paper-index.json

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DAILY_DIR = join(ROOT, 'src/content/posts/daily');
const DATA_DIR = join(ROOT, 'src/data');
const RAW_DIR = join(__dirname, 'migrate-data/raw');
const BASE_DATE = new Date('2026-05-25');

const cmd = process.argv[2];

// --- URL manifest ---
const URLS = [
  ['2026-05-25', 'https://stump-digit-b8b.notion.site/2026-05-25-AI-Agent-Arxiv-Digest-36bddaf9032b81ba828be8a490ae58d9'],
  ['2026-05-26', 'https://stump-digit-b8b.notion.site/2026-05-26-AI-Agent-Arxiv-Digest-36cddaf9032b8104836de4123e9a2cdf'],
  ['2026-05-27', 'https://stump-digit-b8b.notion.site/2026-05-27-AI-Agent-Arxiv-Digest-36dddaf9032b81f4bcb6d6788a43cadf'],
  ['2026-05-28', 'https://stump-digit-b8b.notion.site/2026-05-28-AI-Agent-Arxiv-Digest-36eddaf9032b8126ae25ffc9a706d6a5'],
  ['2026-05-29', 'https://stump-digit-b8b.notion.site/2026-05-29-AI-Agent-Arxiv-Digest-36fddaf9032b81f2b5ccd164d2e34996'],
  ['2026-05-30', 'https://stump-digit-b8b.notion.site/2026-05-30-AI-Agent-Arxiv-Digest-370ddaf9032b81d6a6cacf7febb6ad58'],
  ['2026-05-31', 'https://stump-digit-b8b.notion.site/2026-05-31-AI-Agent-Arxiv-Digest-371ddaf9032b81578006c0a29449a10f'],
  ['2026-06-01', 'https://stump-digit-b8b.notion.site/2026-06-01-AI-Agent-Arxiv-Digest-372ddaf9032b814e854bdde9a46ab6c3'],
  ['2026-06-02', 'https://stump-digit-b8b.notion.site/2026-06-02-AI-Agent-Arxiv-Digest-373ddaf9032b811085d7dfc7d0bcf52c'],
  ['2026-06-03', 'https://stump-digit-b8b.notion.site/2026-06-03-AI-Agent-Arxiv-Digest-374ddaf9032b815f8b46d2e2f8bde97f'],
  ['2026-06-04', 'https://stump-digit-b8b.notion.site/2026-06-04-AI-Agent-Arxiv-Digest-375ddaf9032b81589e4fd478667c73ee'],
  ['2026-06-05', 'https://stump-digit-b8b.notion.site/2026-06-05-AI-Agent-Arxiv-Digest-376ddaf9032b8110ba88cf6a535f5a54'],
  ['2026-06-06', 'https://stump-digit-b8b.notion.site/2026-06-06-AI-Agent-Arxiv-Digest-377ddaf9032b8142a4b9d401fbb943d8'],
  ['2026-06-07', 'https://stump-digit-b8b.notion.site/2026-06-07-AI-Agent-Arxiv-Digest-378ddaf9032b8130adf2cf60ec99c6bd'],
  ['2026-06-08', 'https://stump-digit-b8b.notion.site/2026-06-08-AI-Agent-Arxiv-Digest-379ddaf9032b81ae9066c34f57cd41b1'],
  ['2026-06-09', 'https://stump-digit-b8b.notion.site/2026-06-09-AI-Agent-Arxiv-Digest-37addaf9032b8168b12ced001e1d73ee'],
  ['2026-06-10', 'https://stump-digit-b8b.notion.site/2026-06-10-AI-Agent-Arxiv-Digest-37bddaf9032b810a8459c01fb8b063cd'],
  ['2026-06-11', 'https://stump-digit-b8b.notion.site/2026-06-11-AI-Agent-Arxiv-Digest-37cddaf9032b8127a9cbfe053eeabf40'],
  ['2026-06-12', 'https://stump-digit-b8b.notion.site/2026-06-12-AI-Agent-Arxiv-Digest-37dddaf9032b81229304e6a1a082cd36'],
  ['2026-06-13', 'https://stump-digit-b8b.notion.site/2026-06-13-AI-Agent-Arxiv-Digest-37eddaf9032b8108a846e3a54f608445'],
  ['2026-06-14', 'https://stump-digit-b8b.notion.site/2026-06-14-AI-Agent-Arxiv-Digest-37fddaf9032b8112842dce538d4ad7b4'],
  ['2026-06-15', 'https://stump-digit-b8b.notion.site/2026-06-15-AI-Agent-Arxiv-Digest-380ddaf9032b810d85e6f140a7600d31'],
  ['2026-06-16', 'https://stump-digit-b8b.notion.site/2026-06-16-AI-Agent-Arxiv-Digest-381ddaf9032b8183a769ee67969e86ad'],
  ['2026-06-17', 'https://stump-digit-b8b.notion.site/2026-06-17-AI-Agent-Arxiv-Digest-382ddaf9032b8185b4f3f9a1f9d79da8'],
  ['2026-06-18', 'https://stump-digit-b8b.notion.site/2026-06-18-AI-Agent-Arxiv-Digest-383ddaf9032b811a9e7dcbb7f1e0acaf'],
  ['2026-06-19', 'https://stump-digit-b8b.notion.site/2026-06-19-AI-Agent-Arxiv-Digest-384ddaf9032b816e991dcd912d0e9099'],
  ['2026-06-20', 'https://stump-digit-b8b.notion.site/2026-06-20-AI-Agent-Arxiv-Digest-385ddaf9032b814f97b0d4bfc930ac01'],
  ['2026-06-21', 'https://stump-digit-b8b.notion.site/2026-06-21-AI-Agent-Arxiv-Digest-386ddaf9032b81128543d0014a4828c1'],
  ['2026-06-22', 'https://stump-digit-b8b.notion.site/2026-06-22-AI-Agent-Arxiv-Digest-387ddaf9032b81309529e1bb2e90acb1'],
  ['2026-06-23', 'https://stump-digit-b8b.notion.site/2026-06-23-AI-Agent-Arxiv-Digest-388ddaf9032b8190bf84c428549d42eb'],
  ['2026-06-24', 'https://stump-digit-b8b.notion.site/2026-06-24-AI-Agent-Arxiv-Digest-389ddaf9032b81908391ed6172696f30'],
  ['2026-06-25', 'https://stump-digit-b8b.notion.site/2026-06-25-AI-Agent-Arxiv-Digest-38addaf9032b8155af89ce860eb7d6e6'],
  ['2026-06-26', 'https://stump-digit-b8b.notion.site/2026-06-26-AI-Agent-Arxiv-Digest-38bddaf9032b815bb724d22e35ca8934'],
  ['2026-06-27', 'https://stump-digit-b8b.notion.site/2026-06-27-AI-Agent-Arxiv-Digest-38cddaf9032b813ea135f60137506eb0'],
  ['2026-06-28', 'https://stump-digit-b8b.notion.site/2026-06-28-AI-Agent-Arxiv-Digest-38dddaf9032b8142b090deb7ac471603'],
  ['2026-06-29', 'https://stump-digit-b8b.notion.site/2026-06-29-AI-Agent-Arxiv-Digest-38eddaf9032b81098850f4f4fa0a177a'],
  ['2026-06-30', 'https://stump-digit-b8b.notion.site/2026-06-30-AI-Agent-Arxiv-Digest-38fddaf9032b815da8c3dd3a3212884c'],
  ['2026-07-01', 'https://stump-digit-b8b.notion.site/2026-07-01-AI-Agent-Arxiv-Digest-390ddaf9032b81b2a47aeac4c56e0b76'],
  ['2026-07-02', 'https://stump-digit-b8b.notion.site/2026-07-02-AI-Agent-Arxiv-Digest-391ddaf9032b81c7b6dfc2e7b26673e3'],
  ['2026-07-03', 'https://stump-digit-b8b.notion.site/2026-07-03-AI-Agent-Arxiv-Digest-392ddaf9032b81b79bacd3bc3d2295c1'],
  ['2026-07-04', 'https://stump-digit-b8b.notion.site/2026-07-04-AI-Agent-Arxiv-Digest-393ddaf9032b81f5afb7c1e987162d03'],
  ['2026-07-05', 'https://stump-digit-b8b.notion.site/2026-07-05-AI-Agent-Arxiv-Digest-394ddaf9032b813eb9dfd7cd02d63879'],
  ['2026-07-06', 'https://stump-digit-b8b.notion.site/2026-07-06-AI-Agent-Arxiv-Digest-395ddaf9032b81f284cdc2f1cb785f06'],
  ['2026-07-07', 'https://stump-digit-b8b.notion.site/2026-07-07-AI-Agent-Arxiv-Digest-396ddaf9032b818582fbfac812815c7f'],
  ['2026-07-08', 'https://stump-digit-b8b.notion.site/2026-07-08-AI-Agent-Arxiv-Digest-397ddaf9032b818190c7f59b09d2ad10'],
  ['2026-07-09', 'https://stump-digit-b8b.notion.site/2026-07-09-AI-Agent-Arxiv-Digest-398ddaf9032b817bbd3edf192e1dc92d'],
  ['2026-07-10', 'https://stump-digit-b8b.notion.site/2026-07-10-AI-Agent-Arxiv-Digest-399ddaf9032b81b8a2f5f6fbebd687ad'],
  ['2026-07-11', 'https://stump-digit-b8b.notion.site/2026-07-11-AI-Agent-Arxiv-Digest-39addaf9032b81a7a667f140e8b1ce36'],
  ['2026-07-12', 'https://stump-digit-b8b.notion.site/2026-07-12-AI-Agent-Arxiv-Digest-39bddaf9032b81b99dc2d1f336b6eb5c'],
  ['2026-07-13', 'https://stump-digit-b8b.notion.site/2026-07-13-AI-Agent-Arxiv-Digest-39cddaf9032b81eeb05cdca28c2eec3b'],
  ['2026-07-14', 'https://stump-digit-b8b.notion.site/2026-07-14-AI-Agent-Arxiv-Digest-39dddaf9032b8133b16ee6913416e01f'],
  ['2026-07-15', 'https://stump-digit-b8b.notion.site/2026-07-15-AI-Agent-Arxiv-Digest-39eddaf9032b81e6a729c16e4befad23'],
  ['2026-07-16', 'https://stump-digit-b8b.notion.site/2026-07-16-AI-Agent-Arxiv-Digest-39fddaf9032b81eba8dfc773c2b0cfab'],
  ['2026-07-17', 'https://stump-digit-b8b.notion.site/2026-07-17-AI-Agent-Arxiv-Digest-3a0ddaf9032b818e9a4cc5e3c82662c2'],
  ['2026-07-18', 'https://stump-digit-b8b.notion.site/2026-07-18-AI-Agent-Arxiv-Digest-3a1ddaf9032b81bb8ca1fd7b23bd1b63'],
  ['2026-07-19', 'https://stump-digit-b8b.notion.site/2026-07-19-AI-Agent-Arxiv-Digest-3a2ddaf9032b8199b930d887d0c16572'],
  ['2026-07-20', 'https://stump-digit-b8b.notion.site/2026-07-20-AI-Agent-Arxiv-Digest-3a3ddaf9032b819388a1d4dff3e1c681'],
  ['2026-07-21', 'https://stump-digit-b8b.notion.site/2026-07-21-AI-Agent-Arxiv-Digest-3a4ddaf9032b8116b34dd9f1b142162b'],
  ['2026-07-22', 'https://stump-digit-b8b.notion.site/2026-07-22-AI-Agent-Arxiv-Digest-3a5ddaf9032b815b9920cc8e0a5ee18f'],
  ['2026-07-23', 'https://stump-digit-b8b.notion.site/2026-07-23-AI-Agent-Arxiv-Digest-3a6ddaf9032b817a8eb4fcea67245d72'],
  ['2026-07-24', 'https://stump-digit-b8b.notion.site/2026-07-24-AI-Agent-Arxiv-Digest-3a7ddaf9032b81c187f2cddb6098223a'],
  ['2026-07-25', 'https://stump-digit-b8b.notion.site/2026-07-25-AI-Agent-Arxiv-Digest-3a8ddaf9032b815c82cee05b77d1f7ec'],
  ['2026-07-26', 'https://stump-digit-b8b.notion.site/2026-07-26-AI-Agent-Arxiv-Digest-3a9ddaf9032b81a4a4b0e78bfd43df1a'],
  ['2026-07-27', 'https://stump-digit-b8b.notion.site/2026-07-27-AI-Agent-Arxiv-Digest-3aaddaf9032b81f6a2c0dd10615929c2'],
  ['2026-07-28', 'https://stump-digit-b8b.notion.site/2026-07-28-AI-Agent-Arxiv-Digest-3abddaf9032b8101842cc4758fd0b565'],
  ['2026-07-29', 'https://stump-digit-b8b.notion.site/2026-07-29-AI-Agent-Arxiv-Digest-3acddaf9032b81d19a2ad49c0c069fdb'],
  ['2026-07-30', 'https://stump-digit-b8b.notion.site/2026-07-30-AI-Agent-Arxiv-Digest-3adddaf9032b81b4ba7dd5d3ce9b46e4'],
  ['2026-07-31', 'https://stump-digit-b8b.notion.site/2026-07-31-AI-Agent-Arxiv-Digest-3aeddaf9032b8101a15fef6a749794fb'],
  ['2026-08-01', 'https://stump-digit-b8b.notion.site/2026-08-01-AI-Agent-Arxiv-Digest-3afddaf9032b8140bb36e964ceb5634a'],
  ['2026-08-02', 'https://stump-digit-b8b.notion.site/2026-08-02-AI-Agent-Arxiv-Digest-3b0ddaf9032b811c9ee3c4f2766c344d'],
  ['2026-08-03', 'https://stump-digit-b8b.notion.site/2026-08-03-AI-Agent-Arxiv-Digest-3b1ddaf9032b81e89f2fe40bd5eee4e7'],
  ['2026-08-04', 'https://stump-digit-b8b.notion.site/2026-08-04-AI-Agent-Arxiv-Digest-3b2ddaf9032b813b86b5c67fcfbb3ab3'],
];

function calcOrder(dateStr) {
  return Math.round((new Date(dateStr) - BASE_DATE) / (24 * 60 * 60 * 1000)) + 1;
}

// --- Conversion logic (same as convert-notion.mjs v2) ---
function convertNotion(raw, date, order) {
  // Phase 1: Extract metadata BEFORE cleaning
  const readPriorities = {};
  const rpRegex = /## 論文([一二三四五六七八九十\d]+)[｜|]\s*(.+?)[\s\S]*?Read Priority\s*[—–-]\s*(必讀|略讀|跳過|must|skim|skip)/gi;
  let rpMatch;
  while ((rpMatch = rpRegex.exec(raw)) !== null) {
    const pText = rpMatch[3].trim();
    let priority = 'skim';
    if (/必讀|must/i.test(pText)) priority = 'must-read';
    else if (/跳過|skip/i.test(pText)) priority = 'skip';
    readPriorities[rpMatch[1]] = priority;
  }

  const tldrMap = {};
  const paperBlocks = raw.split(/(?=## 論文[一二三四五六七八九十\d]+[｜|])/);
  for (const block of paperBlocks) {
    if (!block.startsWith('## 論文')) continue;
    const numMatch = block.match(/## 論文([一二三四五六七八九十\d]+)/);
    if (!numMatch) continue;
    const tldrMatch = block.match(/TL;DR\s*[—–-]\s*(.+?)(?:\n|$)/);
    if (tldrMatch) tldrMap[numMatch[1]] = tldrMatch[1].trim();
  }

  // Phase 2: Clean
  let md = raw;
  md = md.replace(/\[Skip to content\]\([^)]+\)\s*/g, '');
  md = md.replace(/!\[[^\]]*Page icon\].*\n?/g, '');
  md = md.replace(/^# .*\n+/m, '');
  md = md.replace(/!\[[^\]]*\]\(<Base64-Image-Removed>\)/g, '');
  md = md.replace(/!\[[^\]]*\]\(https:\/\/notion-emojis[^)]*\)/g, '');

  // Phase 3: Convert callouts
  md = md.replace(/^\s*今日總覽\s*$/m, '## 今日總覽');
  md = md.replace(/^###?\s*讀這篇前該知道的詞\s*$/m, '## 讀這篇前該知道的詞');
  md = md.replace(/^\s*TL;DR\s*[—–-]\s*(.+)$/gm, '### TL;DR\n\n$1');
  md = md.replace(/^\s*Read Priority\s*[—–-]\s*(.+)$/gm, '### Read Priority\n\n$1');
  md = md.replace(/^\s*領域背景\s*$/gm, '### 領域背景');
  md = md.replace(/^###?\s*中階導讀\s*$/gm, '### 中階導讀');
  md = md.replace(/^###?\s*深入要點\s*$/gm, '### 深入要點');
  md = md.replace(/^\s*Reviewer 一句話評\s*$/gm, '### Reviewer 一句話評');
  md = md.replace(/^\s*給你的 take-away\s*$/gm, '### 給你的 take-away');
  // Handle callout block syntax (> \[!callout...\])
  md = md.replace(/^>\s*\\\[!callout[^\]]*\\\]\s*$/gm, '');
  md = md.replace(/^>\s*今日總覽\s*$/gm, '## 今日總覽');
  md = md.replace(/^>\s*TL;DR\s*[—–-]\s*(.+)$/gm, '### TL;DR\n\n$1');
  md = md.replace(/^>\s*Read Priority\s*[—–-]\s*(.+)$/gm, '### Read Priority\n\n$1');
  md = md.replace(/^>\s*領域背景\s*$/gm, '### 領域背景');
  md = md.replace(/^>\s*Reviewer 一句話評\s*$/gm, '### Reviewer 一句話評');
  md = md.replace(/^>\s*給你的 take-away\s*$/gm, '### 給你的 take-away');
  // Clean blockquote prefixes from callout content
  md = md.replace(/^> \\- /gm, '- ');
  md = md.replace(/^> /gm, '');

  md = md.replace(/!\[[^\]]*\]\([^)]*\)\s*/g, '');
  md = md.replace(/\n{4,}/g, '\n\n');
  md = md.replace(/[ \t]+$/gm, '');

  // Phase 4: Overview
  const overviewMatch = md.match(/## 今日總覽\s*\n+([\s\S]*?)(?=\n## )/);
  const overview = overviewMatch ? overviewMatch[1].trim() : '';
  const firstSentence = overview.split(/[。！？]/)[0];
  const description = (firstSentence + '。').length > 150 ? firstSentence.slice(0, 147) + '...' : firstSentence + '。';
  const tldr = overview.length > 250 ? overview.slice(0, 247) + '...' : overview;

  // Phase 5: Topics
  const topicKeywords = {
    'agent-memory': ['記憶', 'memory', 'context window', '遺忘', 'episodic', 'long-horizon', '長程'],
    'agent-security': ['安全', 'security', 'attack', '攻擊', 'injection', 'adversar', 'guardrail', '紅隊', 'jailbreak', '約束', 'constraint', '治理', 'governance'],
    'agent-evaluation': ['評測', 'evaluation', 'benchmark', '評估', 'shadow', '能力邊界', 'leaderboard'],
    'agent-reasoning': ['推理', 'reasoning', 'planning', '規劃', 'chain-of-thought', 'self-reflection', '決策'],
    'agent-tool-use': ['工具呼叫', 'tool use', 'tool-use', 'function call', 'API 呼叫'],
    'multi-agent': ['多代理', 'multi-agent', '多智能體', '協作', 'cooperation', '協調者', 'orchestrator', 'MCP', 'A2A'],
    'agent-rag': ['RAG', 'retrieval', '檢索增強', '向量', 'embedding', 'knowledge base'],
    'agent-framework': ['框架', 'framework', 'scaffold', '鷹架', 'LangGraph', 'CrewAI', 'AutoGen'],
    'agent-deployment': ['部署', 'deploy', '推理成本', 'inference cost', '延遲', 'latency', '生產化', 'serving'],
    'agent-coding': ['coding agent', 'SWE-bench', '程式碼生成', 'code generation', 'Cursor', 'Copilot', 'Devin'],
  };
  const contentLower = md.toLowerCase();
  const topicScores = {};
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    let score = 0;
    for (const kw of keywords) {
      const re = new RegExp(kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = contentLower.match(re);
      if (matches) score += matches.length;
    }
    if (score > 0) topicScores[topic] = score;
  }
  const sortedTopics = Object.entries(topicScores).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);
  if (sortedTopics.length === 0) sortedTopics.push('agent-reasoning');

  // Phase 6: Papers
  const papers = [];
  const mdPaperBlocks = md.split(/(?=## 論文[一二三四五六七八九十\d]+[｜|])/);
  for (const section of mdPaperBlocks) {
    if (!section.startsWith('## 論文')) continue;
    const titleLineMatch = section.match(/## 論文([一二三四五六七八九十\d]+)[｜|]\s*(.+)/);
    if (!titleLineMatch) continue;
    const paperNum = titleLineMatch[1];
    const titleZh = titleLineMatch[2].trim();
    const engTitleMatch = section.match(/\*\*(.+?)\*\*/);
    const title = engTitleMatch ? engTitleMatch[1].trim() : titleZh;
    const arxivIdMatch = section.match(/arxiv:\s*(\d{4}\.\d{4,5})/);
    const arxivId = arxivIdMatch ? arxivIdMatch[1] : '';
    const authorLineMatch = section.match(/作者:\s*(.+?)(?:\s*·|\s*$)/m);
    let authors = [], affiliation = '';
    if (authorLineMatch) {
      const authorLine = authorLineMatch[1].trim();
      const affMatch = authorLine.match(/[（(]([^)）]+)[)）]/);
      if (affMatch) affiliation = affMatch[1];
      authors = authorLine.replace(/[（(][^)）]+[)）]/g, '').split(/[,，、]/).map(a => a.replace(/et al\.?/i, '').replace(/\s+/g, ' ').trim()).filter(a => a.length > 0 && !/^\s*$/.test(a)).slice(0, 3);
    }
    const priority = readPriorities[paperNum] || 'skim';
    const keyFinding = (tldrMap[paperNum] || '').slice(0, 200);
    if (arxivId) {
      papers.push({ arxivId, title, titleZh, authors, affiliation, topics: sortedTopics.slice(0, 2), readPriority: priority, keyFinding, digestDate: date, digestSlug: `${date}-ai-agent-arxiv-digest` });
    }
  }

  // Phase 7: Output
  const tags = ['ai-agent', 'arxiv', 'daily', ...sortedTopics];
  const frontmatter = `---
title: "AI Agent Arxiv Digest — ${date}"
date: ${date}
category: daily
tags: [${tags.join(', ')}]
lang: zh-TW
description: "${description.replace(/"/g, '\\"')}"
tldr: "${tldr.replace(/"/g, '\\"').replace(/\n/g, ' ')}"
series:
  name: "AI Agent Arxiv Digest"
  order: ${order}
---`;

  return { markdown: frontmatter + '\n\n' + md.trim() + '\n', papers };
}

// --- Commands ---
if (cmd === '--manifest') {
  const pending = URLS.filter(([date]) => {
    const outPath = join(DAILY_DIR, `${date}-ai-agent-arxiv-digest.md`);
    return !existsSync(outPath);
  });
  console.log(JSON.stringify(pending.map(([date, url]) => ({ date, url, order: calcOrder(date) })), null, 2));
  console.log(`\n${pending.length} pages pending (${URLS.length - pending.length} already migrated)`);

} else if (cmd === '--convert') {
  mkdirSync(RAW_DIR, { recursive: true });
  const rawFiles = readdirSync(RAW_DIR).filter(f => f.endsWith('.md')).sort();
  let converted = 0, failed = 0;
  const allPapers = [];

  for (const file of rawFiles) {
    const date = file.replace('.md', '');
    const outPath = join(DAILY_DIR, `${date}-ai-agent-arxiv-digest.md`);
    if (existsSync(outPath)) { console.log(`SKIP: ${date} (already exists)`); continue; }

    try {
      const raw = readFileSync(join(RAW_DIR, file), 'utf8');
      const order = calcOrder(date);
      const { markdown, papers } = convertNotion(raw, date, order);
      writeFileSync(outPath, markdown);
      allPapers.push(...papers);
      const priorities = papers.map(p => p.readPriority).join('/');
      console.log(`OK: ${date} | ${papers.length} papers [${priorities}]`);
      converted++;
    } catch (e) {
      console.error(`FAIL: ${date} - ${e.message}`);
      failed++;
    }
  }
  console.log(`\nConverted: ${converted}, Failed: ${failed}, Papers: ${allPapers.length}`);

  // Append to paper-index
  if (allPapers.length > 0) {
    const indexPath = join(DATA_DIR, 'paper-index.json');
    const existing = JSON.parse(readFileSync(indexPath, 'utf8'));
    const existingIds = new Set(existing.papers.map(p => p.arxivId));
    const newPapers = allPapers.filter(p => !existingIds.has(p.arxivId));
    existing.papers.push(...newPapers);
    existing.papers.sort((a, b) => a.digestDate.localeCompare(b.digestDate));
    writeFileSync(indexPath, JSON.stringify(existing, null, 2));
    console.log(`Paper index: ${newPapers.length} new papers added (total: ${existing.papers.length})`);
  }

} else if (cmd === '--index') {
  // Rebuild paper index from all existing blog posts
  const files = readdirSync(DAILY_DIR).filter(f => f.includes('arxiv-digest') && f.endsWith('.md')).sort();
  const allPapers = [];
  for (const file of files) {
    const content = readFileSync(join(DAILY_DIR, file), 'utf8');
    const date = file.slice(0, 10);
    const order = calcOrder(date);
    // Re-parse papers from converted markdown (simplified extraction)
    const { papers } = convertNotion(content, date, order);
    allPapers.push(...papers);
  }
  const indexPath = join(DATA_DIR, 'paper-index.json');
  writeFileSync(indexPath, JSON.stringify({ version: '2026-08-16', papers: allPapers }, null, 2));
  console.log(`Rebuilt paper index: ${allPapers.length} papers from ${files.length} digests`);

} else {
  console.log(`Usage:
  node migrate-notion-digests.mjs --manifest   # List pending URLs to fetch
  node migrate-notion-digests.mjs --convert    # Convert raw/*.md to blog posts
  node migrate-notion-digests.mjs --index      # Rebuild paper-index.json from blog posts

Workflow:
  1. Run --manifest to see which pages need fetching
  2. Fetch each URL with firecrawl, save markdown to scripts/migrate-data/raw/{date}.md
  3. Run --convert to process all raw files into blog posts + paper index
  4. Run --index to rebuild paper index from all existing posts`);
}
