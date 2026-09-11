import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { defineAgent } from '../agent/access'

const SEARCH_QUERIES = [
  'AI startup funding Series raises million 2026',
  'AI agent startup Series round valuation 2026',
  'site:businesswire.com OR site:prnewswire.com AI funding 2026',
]

const MIN_SEED_AMOUNT_M = 10
const MAX_POSTS_PER_DAY = 3

interface FundingEvent {
  company: string
  companySlug: string
  round: string
  amountM: number
  leadInvestor: string
  coInvestors: string[]
  valuationM: number | null
  country: string
  description: string
  sources: Array<{ title: string; url: string }>
  confirmed: boolean
}

interface AgentRuntime {
  syscallContext: unknown
  syscall: (ctx: unknown, name: string, input: unknown) => Promise<unknown>
}

function todayTaipei(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
}

function isQualifyingRound(round: string, amountM: number, onWatchlist: boolean): boolean {
  const upper = round.toUpperCase()
  if (/SERIES [A-Z]|IPO/i.test(upper)) return true
  if (onWatchlist) return true
  if (/SEED/i.test(upper) && amountM >= MIN_SEED_AMOUNT_M) return true
  return false
}

function buildFrontmatter(event: FundingEvent, today: string, seriesOrder: number): string {
  const amountStr = event.amountM >= 1000
    ? `$${(event.amountM / 1000).toFixed(1)}B`
    : `$${event.amountM}M`
  return `---
title: "融資速報｜${event.company} ${event.round} ${amountStr}"
date: ${today}
category: daily
tags: [ai-agent, funding, daily, ${event.companySlug}]
lang: zh-TW
description: "${event.description}"
tldr: "${event.company}完成${event.round}，由${event.leadInvestor}領投。"
series:
  name: "AI Agent Funding"
  order: ${seriesOrder}
---`
}

function buildPrompt(event: FundingEvent): string {
  const sourcesText = event.sources.map((s, i) => `[${i + 1}] ${s.title}: ${s.url}`).join('\n')
  return `你是 quidproquo.cc 的技術作者。請根據以下融資資訊撰寫一篇融資速報。

公司：${event.company}（${event.country}）
輪次：${event.round}
金額：$${event.amountM}M
領投：${event.leadInvestor}
跟投：${event.coInvestors.join(', ') || '未公布'}
估值：${event.valuationM ? `$${event.valuationM}M` : '未公布'}
確認狀態：${event.confirmed ? '已交叉驗證（2+ 來源）' : '⚠️ 單一來源，未確認'}

來源：
${sourcesText}

請嚴格按以下結構撰寫（zh-TW）：
1. ## 融資資訊（表格：公司/輪次/金額/領投/跟投/估值/累計融資/成立年份/員工數）
2. ## 這家公司做什麼（2-3 段：一句話定義 → 核心產品 → 市場地位）
3. ## 這筆融資的信號
   - ### 對 Agent 生態的意義
   - ### 投資人在賭什麼
   - ### 值得觀察的數字
4. ## Watchlist 狀態（建議加入哪個 section）
5. ## 今日收穫（認知差）
6. ## 參考資料（附連結）

注意：
- 用繁體中文（台灣用語），不要用「技術棧」「數據」等中國用語
- 金額寫 $50M 不寫「約五千萬美元」
- 估值要有前一輪對比（如有）`
}

function parseSearchResults(raw: unknown): Array<{ title: string; url: string; snippet: string }> {
  if (!raw || typeof raw !== 'object') return []
  const results = (raw as { results?: unknown[] }).results
  if (!Array.isArray(results)) return []
  return results
    .filter((r): r is Record<string, unknown> => r != null && typeof r === 'object')
    .map(r => ({
      title: String(r.title ?? ''),
      url: String(r.url ?? r.source_url ?? ''),
      snippet: String(r.snippet ?? r.evidence_excerpt ?? ''),
    }))
    .filter(r => r.url)
}

function extractFundingFromSnippets(
  results: Array<{ title: string; url: string; snippet: string }>
): FundingEvent[] {
  const events: FundingEvent[] = []
  const seen = new Set<string>()

  for (const r of results) {
    const text = `${r.title} ${r.snippet}`.toLowerCase()
    const fundingMatch = text.match(/\$(\d+(?:\.\d+)?)\s*(?:m|million|b|billion)/i)
    const roundMatch = text.match(/series\s+[a-z]|seed|ipo|pre-seed/i)
    if (!fundingMatch || !roundMatch) continue

    const rawAmount = parseFloat(fundingMatch[1])
    const unit = fundingMatch[0].toLowerCase()
    const amountM = unit.includes('b') || unit.includes('billion') ? rawAmount * 1000 : rawAmount
    const round = roundMatch[0].trim()

    const companyMatch = r.title.match(/^([A-Z][A-Za-z0-9.]+(?:\s+[A-Z][A-Za-z0-9.]*){0,2})/)
    const company = companyMatch ? companyMatch[1].trim() : r.title.split(/[–—:|-]/).at(0)?.trim() ?? 'Unknown'
    const companySlug = company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    if (seen.has(companySlug)) continue
    seen.add(companySlug)

    events.push({
      company,
      companySlug,
      round,
      amountM,
      leadInvestor: 'TBD',
      coInvestors: [],
      valuationM: null,
      country: 'Unknown',
      description: r.snippet.slice(0, 120),
      sources: [{ title: r.title, url: r.url }],
      confirmed: false,
    })
  }

  return events
}

function mergeAndDedup(allEvents: FundingEvent[]): FundingEvent[] {
  const bySlug = new Map<string, FundingEvent>()
  for (const event of allEvents) {
    const existing = bySlug.get(event.companySlug)
    if (existing) {
      const newUrls = event.sources.filter(s => !existing.sources.some(es => es.url === s.url))
      existing.sources.push(...newUrls)
      if (existing.sources.length >= 2) existing.confirmed = true
      if (event.amountM > existing.amountM) existing.amountM = event.amountM
      if (event.leadInvestor !== 'TBD') existing.leadInvestor = event.leadInvestor
    } else {
      bySlug.set(event.companySlug, { ...event })
    }
  }
  return [...bySlug.values()]
}

export interface FundingDigestInput {
  date?: string
}

export interface FundingDigestOutput {
  detected: number
  published: number
  skipped: string[]
  commits: Array<{ company: string; sha: string; url: string }>
}

export const fundingDigestAgent = defineAgent<FundingDigestInput, FundingDigestOutput>({
  id: 'daily-digest-funding',
  version: 1,
  displayName: 'Funding Digest',
  description: 'Detect AI/Agent Series A+ funding rounds and publish alert posts.',
  syscalls: ['model.invoke', 'knowledge.github.write', 'search.external'],
  memoryScopes: ['agent'],
  secrets: [],
  outboundDomains: ['api.github.com', '*.tavily.com', '*.exa.ai'],
  toolCallLimit: 20,
  timeoutSeconds: 300,
  irreversibleActionsRequireApproval: false,

  async run(input, runtime) {
    const { syscallContext, syscall } = runtime as AgentRuntime
    const e = env as unknown as Env
    const today = input.date ?? todayTaipei()
    const skipped: string[] = []

    const allRawResults: Array<{ title: string; url: string; snippet: string }> = []
    for (const query of SEARCH_QUERIES) {
      const raw = await syscall(syscallContext, 'search.external', {
        query,
        limit: 10,
        timeoutMs: 8000,
        providers: ['tavily', 'exa'],
      }).catch(() => ({ results: [] }))
      allRawResults.push(...parseSearchResults(raw))
    }

    const extracted = extractFundingFromSnippets(allRawResults)
    const merged = mergeAndDedup(extracted)
    const qualifying = merged.filter(event => {
      if (!isQualifyingRound(event.round, event.amountM, false)) {
        skipped.push(`${event.company}: ${event.round} $${event.amountM}M below threshold`)
        return false
      }
      return true
    }).slice(0, MAX_POSTS_PER_DAY)

    if (qualifying.length === 0) {
      return { detected: merged.length, published: 0, skipped, commits: [] }
    }

    const existingOrder = await getMaxSeriesOrder(e.DB)
    const commits: FundingDigestOutput['commits'] = []

    for (const [i, event] of qualifying.entries()) {
      const seriesOrder = existingOrder + i + 1
      const frontmatter = buildFrontmatter(event, today, seriesOrder)
      const prompt = buildPrompt(event)

      const llmResult = await syscall(syscallContext, 'model.invoke', {
        config: { defaultProvider: 'groq', defaultModel: 'llama-3.3-70b-versatile' },
        stage: 'digest-funding',
        messages: [
          { role: 'system', content: 'You are a technical writer for quidproquo.cc covering AI funding.' },
          { role: 'user', content: prompt },
        ],
        maxTokens: 2500,
      }) as { response: { content: string } }

      const body = String(llmResult.response.content ?? '')
      const zhPath = `src/content/posts/daily/${today}-funding-${event.companySlug}.md`
      const zhContent = `${frontmatter}\n\n${body}\n`

      const commitResult = await syscall(syscallContext, 'knowledge.github.write', {
        sub: 'repo.tree.commit',
        owner: 'vincentxuu',
        repo: 'quidproquo',
        message: `post(daily): funding alert ${event.company} ${event.round}`,
        files: [{ path: zhPath, content: zhContent }],
      }) as { url: string; sha: string }

      commits.push({ company: event.company, sha: commitResult.sha, url: commitResult.url })
    }

    return { detected: merged.length, published: commits.length, skipped, commits }
  },
})

async function getMaxSeriesOrder(db: D1Database): Promise<number> {
  const row = await db.prepare(`
    SELECT MAX(CAST(json_extract(series_json, '$.order') AS INTEGER)) AS max_order
    FROM posts
    WHERE json_extract(series_json, '$.name') = 'AI Agent Funding'
  `).first<{ max_order: number | null }>().catch(() => null)
  return row?.max_order ?? 0
}
