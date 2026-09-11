import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { defineAgent } from '../agent/access'

const ARXIV_CATEGORIES = ['cs.AI', 'cs.CL', 'cs.MA']
const SERIES_EPOCH = new Date('2026-05-25').getTime()
const MAX_PAPERS_PER_DAY = 3
const LOOKBACK_DAYS = 14
const DECAY_BASE = 0.85

const TOPIC_KEYWORDS = [
  'agent', 'tool use', 'tool calling', 'planning', 'reasoning',
  'memory', 'rag', 'retrieval', 'multi-agent', 'safety', 'guardrail',
  'prompt', 'context', 'evaluation', 'benchmark', 'harness',
  'mcp', 'protocol', 'orchestration', 'agentic',
]

const EXCLUDE_KEYWORDS = [
  'image segmentation', 'object detection', 'speech recognition',
  'machine translation', 'syntax parsing', 'pre-training method',
  'hardware', 'chip design', 'robotics locomotion',
]

interface ArxivCandidate {
  arxivId: string
  title: string
  authors: string
  abstract: string
  categories: string[]
  publishedAt: string
  sourceLayer: 'A' | 'B' | 'C'
  sourceCount: number
  relevanceScore: number
  daysSinceFirstSeen: number
  venue: string | null
  citationCount: number | null
  institutions: string | null
  communitySignal: string | null
}

interface ScreeningDecision {
  arxivId: string
  title: string
  decision: 'selected' | 'watch' | 'rejected'
  rejectionCategory?: 'off-topic' | 'evidence-insufficient' | 'stronger-competitor' | 'stale'
  reason: string
  credibility: 'pass' | 'conditional' | 'fail'
  screenedAt: string
}

interface AgentRuntime {
  syscallContext: unknown
  syscall: (ctx: unknown, name: string, input: unknown) => Promise<unknown>
}

export interface ArxivDigestInput {
  date?: string
}

export interface ArxivDigestOutput {
  candidates: number
  selected: number
  published: number
  noPublication: boolean
  commits: Array<{ arxivId: string; sha: string; url: string }>
}

function todayTaipei(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
}

function seriesOrder(dateStr: string): number {
  const ms = new Date(dateStr).getTime() - SERIES_EPOCH
  return Math.max(1, Math.floor(ms / 86400000) + 1)
}

function isRelevant(title: string, abstract: string): boolean {
  const text = `${title} ${abstract}`.toLowerCase()
  if (EXCLUDE_KEYWORDS.some(kw => text.includes(kw))) return false
  return TOPIC_KEYWORDS.some(kw => text.includes(kw))
}

function effectiveScore(candidate: ArxivCandidate): number {
  const decay = Math.pow(DECAY_BASE, candidate.daysSinceFirstSeen)
  const sourceBoost = candidate.sourceCount >= 3 ? 1.5 : candidate.sourceCount >= 2 ? 1.3 : 1.0
  return candidate.relevanceScore * decay * sourceBoost
}

async function fetchArxivNewListings(): Promise<Array<{ id: string; title: string; authors: string; abstract: string; categories: string[] }>> {
  const results: Array<{ id: string; title: string; authors: string; abstract: string; categories: string[] }> = []

  for (const cat of ARXIV_CATEGORIES) {
    const url = `https://export.arxiv.org/api/query?search_query=cat:${cat}&sortBy=submittedDate&sortOrder=descending&max_results=30`
    const res = await fetch(url, { headers: { 'User-Agent': 'quidproquo-digest-agent/1.0' } }).catch(() => null)
    if (!res?.ok) continue

    const xml = await res.text()
    const entries = xml.split('<entry>').slice(1)
    for (const entry of entries) {
      const idMatch = entry.match(/<id>.*?(\d{4}\.\d{4,5})<\/id>/)
      const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/)
      const authorMatches = [...entry.matchAll(/<name>(.*?)<\/name>/g)]
      const abstractMatch = entry.match(/<summary>([\s\S]*?)<\/summary>/)
      const categoryMatches = [...entry.matchAll(/term="([^"]+)"/g)]

      if (!idMatch || !titleMatch) continue
      const arxivId = idMatch[1]
      if (results.some(r => r.id === arxivId)) continue

      results.push({
        id: arxivId,
        title: titleMatch[1].replace(/\s+/g, ' ').trim(),
        authors: authorMatches.slice(0, 3).map(m => m[1]).join(', ') + (authorMatches.length > 3 ? ' et al.' : ''),
        abstract: (abstractMatch?.[1] ?? '').replace(/\s+/g, ' ').trim(),
        categories: categoryMatches.map(m => m[1]),
      })
    }
  }

  return results
}

async function fetchHuggingFaceDailyPapers(): Promise<Array<{ arxivId: string; title: string }>> {
  const res = await fetch('https://huggingface.co/api/daily_papers', {
    headers: { 'User-Agent': 'quidproquo-digest-agent/1.0' },
  }).catch(() => null)
  if (!res?.ok) return []

  const papers = await res.json() as Array<{ paper: { id: string; title: string } }>
  return papers
    .filter(p => p.paper?.id)
    .map(p => ({ arxivId: p.paper.id, title: p.paper.title }))
}

async function fetchSemanticScholarInfo(arxivId: string): Promise<{
  venue: string | null
  citationCount: number | null
  authors: Array<{ name: string; affiliations?: string[] }>
} | null> {
  const res = await fetch(
    `https://api.semanticscholar.org/graph/v1/paper/ARXIV:${arxivId}?fields=venue,citationCount,authors.name,authors.affiliations`,
    { headers: { 'User-Agent': 'quidproquo-digest-agent/1.0' } }
  ).catch(() => null)
  if (!res || res.status === 404 || res.status === 429) return null
  if (!res.ok) return null
  return await res.json() as { venue: string | null; citationCount: number | null; authors: Array<{ name: string; affiliations?: string[] }> }
}

async function getSeenArxivIds(db: D1Database): Promise<Set<string>> {
  const rows = await db.prepare(
    `SELECT arxiv_id FROM arxiv_screening WHERE decision = 'selected' ORDER BY screened_at DESC LIMIT 500`
  ).all<{ arxiv_id: string }>().catch(() => ({ results: [] as { arxiv_id: string }[] }))
  return new Set((rows.results ?? []).map(r => r.arxiv_id))
}

async function getLookbackCandidates(db: D1Database, cutoffIso: string): Promise<Array<{ arxivId: string; decision: string; rejectionCategory: string | null; daysSince: number }>> {
  const rows = await db.prepare(
    `SELECT arxiv_id, decision, rejection_category, screened_at
     FROM arxiv_screening
     WHERE screened_at > ? AND decision IN ('watch', 'rejected')
     ORDER BY screened_at DESC LIMIT 100`
  ).bind(cutoffIso).all<{
    arxiv_id: string
    decision: string
    rejection_category: string | null
    screened_at: string
  }>().catch(() => ({ results: [] as { arxiv_id: string; decision: string; rejection_category: string | null; screened_at: string }[] }))

  return (rows.results ?? [])
    .filter(r => {
      if (r.decision === 'watch') return true
      if (r.decision === 'rejected' && r.rejection_category === 'stronger-competitor') return true
      return false
    })
    .map(r => ({
      arxivId: r.arxiv_id,
      decision: r.decision,
      rejectionCategory: r.rejection_category,
      daysSince: Math.floor((Date.now() - new Date(r.screened_at).getTime()) / 86400000),
    }))
}

async function saveScreeningRecord(db: D1Database, today: string, decisions: ScreeningDecision[]): Promise<void> {
  for (const d of decisions) {
    await db.prepare(
      `INSERT INTO arxiv_screening (arxiv_id, title, decision, rejection_category, reason, credibility, screened_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(arxiv_id) DO UPDATE SET decision=excluded.decision, rejection_category=excluded.rejection_category, reason=excluded.reason, credibility=excluded.credibility, screened_at=excluded.screened_at`
    ).bind(d.arxivId, d.title, d.decision, d.rejectionCategory ?? null, d.reason, d.credibility, d.screenedAt).run().catch(() => {})
  }
}

function buildPrompt(candidates: ArxivCandidate[], today: string): string {
  const paperSections = candidates.map((c, i) => `
### 論文 ${i + 1}
- arxiv ID: ${c.arxivId}
- 標題: ${c.title}
- 作者: ${c.authors}
- 機構: ${c.institutions ?? '未知'}
- Venue: ${c.venue ?? 'arXiv preprint（未經同行審查）'}
- 引用: ${c.citationCount != null ? `${c.citationCount} citations` : '尚無引用資料'}
- 社群: ${c.communitySignal ?? '無社群信號'}
- 摘要: ${c.abstract.slice(0, 800)}
`).join('\n')

  return `你是 quidproquo.cc 的技術作者。請根據以下 ${candidates.length} 篇論文撰寫 AI Agent Arxiv Digest。

日期：${today}

${paperSections}

請嚴格按以下結構撰寫（zh-TW，繁體中文台灣用語）：

1. ## 今日總覽（3-5 行，串起共同主題，回答「合起來告訴我們什麼」）
2. ## 讀這篇前該知道的詞（表格，4-6 個術語）
3. 每篇論文：
   - ## 論文 N｜{中文翻譯標題}
   - **{英文原標題}**
   - {作者}（{機構}）· arxiv: {id}
   - 連結: [arxiv](url) · [alphaxiv](url)
   - ### TL;DR（一句話，含具體數字）
   - ### 編輯判斷（14 欄表格：Venue/引用速度/機構/社群反應/可信度/證據成熟度/可復現性/為什麼選這篇/方向新意/今日重要性/實務連結/編輯信心/閱讀建議/主要限制）
   - ### 領域背景（2-3 句）
   - ### 中階導讀（問題/方法/為什麼重要）
   - ### 深入要點（至少 1 個具體數字）
   - ### Reviewer 一句話評
   - ### 給你的 take-away（2 個具體使用情境）
4. ## 今日收穫（認知差：之前以為 X → 現在知道 Y）
5. ## 參考資料（每個事實主張附連結）

注意：用繁體中文（台灣用語），不要用「技術棧」「數據」等中國用語。未複現結果標 ⚠️。`
}

export const arxivDigestAgent = defineAgent<ArxivDigestInput, ArxivDigestOutput>({
  id: 'daily-digest-arxiv',
  version: 1,
  displayName: 'Arxiv Digest',
  description: 'Three-layer arXiv screening for AI Agent papers, up to 3 deep-read posts per day.',
  syscalls: ['model.invoke', 'knowledge.github.write'],
  memoryScopes: ['agent'],
  secrets: [],
  outboundDomains: ['export.arxiv.org', 'api.semanticscholar.org', 'huggingface.co', 'api.github.com'],
  toolCallLimit: 50,
  timeoutSeconds: 600,
  irreversibleActionsRequireApproval: false,

  async run(input, runtime) {
    const { syscallContext, syscall } = runtime as AgentRuntime
    const e = env as unknown as Env
    const db = e.DB
    const today = input.date ?? todayTaipei()
    const order = seriesOrder(today)

    const seenIds = await getSeenArxivIds(db)
    const candidateMap = new Map<string, ArxivCandidate>()

    const arxivListings = await fetchArxivNewListings()
    for (const paper of arxivListings) {
      if (seenIds.has(paper.id)) continue
      if (!isRelevant(paper.title, paper.abstract)) continue
      candidateMap.set(paper.id, {
        arxivId: paper.id,
        title: paper.title,
        authors: paper.authors,
        abstract: paper.abstract,
        categories: paper.categories,
        publishedAt: today,
        sourceLayer: 'A',
        sourceCount: 1,
        relevanceScore: 0.7,
        daysSinceFirstSeen: 0,
        venue: null,
        citationCount: null,
        institutions: null,
        communitySignal: null,
      })
    }

    const hfPapers = await fetchHuggingFaceDailyPapers()
    for (const hf of hfPapers) {
      if (seenIds.has(hf.arxivId)) continue
      const existing = candidateMap.get(hf.arxivId)
      if (existing) {
        existing.sourceCount++
        existing.communitySignal = 'HuggingFace Daily Papers'
      }
    }

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - LOOKBACK_DAYS)
    const lookback = await getLookbackCandidates(db, cutoff.toISOString())
    for (const lb of lookback) {
      if (seenIds.has(lb.arxivId)) continue
      const existing = candidateMap.get(lb.arxivId)
      if (existing) {
        existing.sourceCount++
        existing.daysSinceFirstSeen = Math.max(existing.daysSinceFirstSeen, lb.daysSince)
      }
    }

    const candidates = [...candidateMap.values()]
      .sort((a, b) => effectiveScore(b) - effectiveScore(a))
      .slice(0, 20)

    for (const c of candidates.slice(0, 10)) {
      const s2 = await fetchSemanticScholarInfo(c.arxivId)
      if (s2) {
        c.venue = s2.venue || null
        c.citationCount = s2.citationCount
        const affiliations = s2.authors
          ?.flatMap(a => a.affiliations ?? [])
          .filter(Boolean)
          .slice(0, 3)
        c.institutions = affiliations?.length ? affiliations.join(', ') : null
      }
    }

    const selected = candidates.slice(0, MAX_PAPERS_PER_DAY)
    const decisions: ScreeningDecision[] = candidates.map(c => {
      const isSelected = selected.includes(c)
      return {
        arxivId: c.arxivId,
        title: c.title,
        decision: isSelected ? 'selected' : 'watch',
        reason: isSelected
          ? `Selected: effective score ${effectiveScore(c).toFixed(3)}, sources ${c.sourceCount}`
          : `Watch: effective score ${effectiveScore(c).toFixed(3)}, below selection threshold`,
        credibility: isSelected ? 'conditional' : 'conditional',
        screenedAt: new Date().toISOString(),
      } satisfies ScreeningDecision
    })

    await saveScreeningRecord(db, today, decisions)

    if (selected.length === 0) {
      return { candidates: candidates.length, selected: 0, published: 0, noPublication: true, commits: [] }
    }

    const prompt = buildPrompt(selected, today)
    const llmResult = await syscall(syscallContext, 'model.invoke', {
      config: { defaultProvider: 'groq', defaultModel: 'llama-3.3-70b-versatile' },
      stage: 'digest-arxiv',
      messages: [
        { role: 'system', content: 'You are a technical writer for quidproquo.cc, specializing in AI Agent research.' },
        { role: 'user', content: prompt },
      ],
      maxTokens: 4000,
    }) as { response: { content: string } }

    const body = String(llmResult.response.content ?? '')
    const description = `AI Agent 論文精選 ${today}：${selected.map(s => s.title.slice(0, 30)).join('、')}`
    const tldr = selected.map(s => `${s.title.slice(0, 50)}（${s.arxivId}）`).join('；')

    const frontmatter = `---
title: "AI Agent Arxiv Digest — ${today}"
date: ${today}
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "${description.replace(/"/g, '\\"')}"
tldr: "${tldr.replace(/"/g, '\\"')}"
series:
  name: "AI Agent Arxiv Digest"
  order: ${order}
---`

    const zhPath = `src/content/posts/daily/${today}-ai-agent-arxiv-digest.md`
    const zhContent = `${frontmatter}\n\n${body}\n`

    const commitResult = await syscall(syscallContext, 'knowledge.github.write', {
      sub: 'repo.tree.commit',
      owner: 'vincentxuu',
      repo: 'quidproquo',
      message: `post(daily): arxiv digest ${today}`,
      files: [{ path: zhPath, content: zhContent }],
    }) as { url: string; sha: string }

    return {
      candidates: candidates.length,
      selected: selected.length,
      published: 1,
      noPublication: false,
      commits: selected.map(s => ({ arxivId: s.arxivId, sha: commitResult.sha, url: commitResult.url })),
    }
  },
})
