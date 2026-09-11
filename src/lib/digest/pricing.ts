import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { defineAgent } from '../agent/access'
import { findStoredGitHubRepository } from '../github/app'

interface PricingCheckTarget {
  vendor: string
  slug: string
  url: string
  days: number[]
}

const PRICING_TARGETS: PricingCheckTarget[] = [
  { vendor: 'Anthropic', slug: 'anthropic', url: 'https://docs.anthropic.com/en/docs/about-claude/models', days: [1, 4] },
  { vendor: 'OpenAI', slug: 'openai', url: 'https://openai.com/api/pricing/', days: [1, 4] },
  { vendor: 'Google', slug: 'google', url: 'https://ai.google.dev/pricing', days: [2, 5] },
  { vendor: 'Mistral', slug: 'mistral', url: 'https://mistral.ai/products/la-plateforme#pricing', days: [2, 5] },
  { vendor: 'Cohere', slug: 'cohere', url: 'https://cohere.com/pricing', days: [3, 6] },
  { vendor: 'AWS Bedrock', slug: 'aws-bedrock', url: 'https://aws.amazon.com/bedrock/pricing/', days: [3, 6] },
  { vendor: 'Together AI', slug: 'together', url: 'https://www.together.ai/pricing', days: [0] },
]

const SEARCH_QUERIES = [
  'AI API pricing change model cost update 2026',
  'AI API sunset deprecation end-of-life 2026',
  'AI model pricing promotion discount free tier 2026',
]

interface AgentRuntime {
  syscallContext: unknown
  syscall: (ctx: unknown, name: string, input: unknown) => Promise<unknown>
}

interface SearchResult {
  title: string
  url: string
  snippet: string
}

interface PricingSignal {
  vendor: string
  headline: string
  url: string
  snippet: string
  source: 'search' | 'pricing-page'
}

function todayTaipei(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
}

function dayOfWeekTaipei(): number {
  const taipeiDate = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Taipei', weekday: 'short' })
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(taipeiDate)
}

function isPricingRelated(text: string): boolean {
  const lower = text.toLowerCase()
  return /\b(pric|cost|rate|tier|free|discount|sunset|deprecat|end.of.life|per.million|per.1m|\$\d)/i.test(lower)
}

function dedupeByUrl(signals: PricingSignal[]): PricingSignal[] {
  const seen = new Set<string>()
  return signals.filter(s => {
    if (seen.has(s.url)) return false
    seen.add(s.url)
    return true
  })
}

function buildSlug(signals: PricingSignal[]): string {
  const vendors = [...new Set(signals.map(s => s.vendor.toLowerCase().replace(/[^a-z0-9]/g, '-')))]
  if (vendors.length === 1) return `${vendors[0]}-pricing-update`
  return 'multi-vendor-pricing-changes'
}

function buildFrontmatter(signals: PricingSignal[], today: string, seriesOrder: number): string {
  const vendorTags = [...new Set(signals.map(s => s.vendor.toLowerCase().replace(/[^a-z0-9]/g, '-')))]
  const headline = signals.length === 1
    ? signals[0].headline
    : `${signals.length} 家 AI 廠商定價變動`
  return `---
title: "定價追蹤｜${headline}"
date: ${today}
category: daily
tags: [ai-agent, pricing, daily, ${vendorTags.join(', ')}]
lang: zh-TW
description: "${headline}"
tldr: ""
series:
  name: "AI Pricing Watch"
  order: ${seriesOrder}
---`
}

function buildPrompt(signals: PricingSignal[], today: string): string {
  const signalList = signals.map((s, i) =>
    `[${i + 1}] ${s.vendor}: ${s.headline}\n   URL: ${s.url}\n   ${s.snippet.slice(0, 300)}`
  ).join('\n\n')

  return `你是 quidproquo.cc 的技術作者。以下是今天偵測到的 AI API 定價變動訊號，請撰寫一篇定價追蹤文章。

日期：${today}

偵測到的訊號：
${signalList}

請嚴格按以下結構撰寫（zh-TW）：
1. ## 變更摘要（2-3 句概述，回答「這次變動代表什麼趨勢」）
2. ## 前後對照（表格：項目 / 舊 / 新 / 變化 / 生效日）
3. ## 成本試算（場景：每天 10,000 則對話的 Agent，算月成本差）
4. ## 對開發者/企業的影響
   ### 誰最受益
   ### 競爭格局影響（附價格排名表）
   ### 行動建議
5. ## 時效提醒（促銷到期日或 sunset 日期，如有）
6. ## 今日收穫（認知差：之前以為 X → 現在知道 Y）
7. ## 參考資料（附連結）

注意：
- 定價精確到小數——$4.00/1M tokens 不是「約 4 美元」
- 用繁體中文（台灣用語），不要用「技術棧」「數據」等中國用語
- 至少引用 2 個來源`
}

export interface PricingDigestInput {
  date?: string
}

export interface PricingDigestOutput {
  signalsFound: number
  published: boolean
  skipped: string[]
  commit: { sha: string; url: string } | null
}

export const pricingDigestAgent = defineAgent<PricingDigestInput, PricingDigestOutput>({
  id: 'daily-digest-pricing',
  version: 1,
  displayName: 'Pricing Digest',
  description: 'Track AI API pricing changes, promotions, and sunset announcements.',
  syscalls: ['model.invoke', 'knowledge.github.write', 'search.external'],
  memoryScopes: ['agent'],
  secrets: [],
  outboundDomains: ['api.github.com', '*.anthropic.com', '*.openai.com', '*.google.dev', '*.mistral.ai', '*.cohere.com', '*.aws.amazon.com', '*.together.ai', 'explainx.ai'],
  toolCallLimit: 40,
  timeoutSeconds: 300,
  irreversibleActionsRequireApproval: false,

  async run(input, runtime) {
    const { syscallContext, syscall } = runtime as AgentRuntime
    const e = env as unknown as Env
    const today = input.date ?? todayTaipei()
    const dow = dayOfWeekTaipei()
    const skipped: string[] = []
    const signals: PricingSignal[] = []

    for (const query of SEARCH_QUERIES) {
      const searchResult = await syscall(syscallContext, 'search.external', {
        query,
        limit: 10,
        timeoutMs: 8000,
        providers: ['tavily', 'exa'],
      }).catch(() => ({ results: [] })) as { results: SearchResult[] }

      for (const r of (searchResult.results ?? [])) {
        if (isPricingRelated(`${r.title} ${r.snippet}`)) {
          const vendor = identifyVendor(r.title + ' ' + r.snippet)
          signals.push({
            vendor: vendor ?? 'Unknown',
            headline: r.title,
            url: r.url,
            snippet: r.snippet,
            source: 'search',
          })
        }
      }
    }

    const todayTargets = PRICING_TARGETS.filter(t => t.days.includes(dow))
    for (const target of todayTargets) {
      try {
        const res = await fetch(target.url, {
          headers: { 'User-Agent': 'quidproquo-digest-agent' },
          signal: AbortSignal.timeout(5000),
        })
        if (res.ok) {
          const text = await res.text()
          const excerpt = text.slice(0, 2000)
          if (isPricingRelated(excerpt)) {
            signals.push({
              vendor: target.vendor,
              headline: `${target.vendor} pricing page checked`,
              url: target.url,
              snippet: excerpt.slice(0, 300),
              source: 'pricing-page',
            })
          }
        }
      } catch {
        skipped.push(`${target.vendor}: fetch failed`)
      }
    }

    const unique = dedupeByUrl(signals)
    const searchSignals = unique.filter(s => s.source === 'search')

    if (searchSignals.length === 0) {
      return { signalsFound: 0, published: false, skipped, commit: null }
    }

    const stored = await findStoredGitHubRepository(e.DB, 'vincentxuu/quidproquo')
    if (!stored) throw new Error('quidproquo repo not found in GitHub installations')

    const existingOrder = await getMaxSeriesOrder(e.DB)
    const frontmatter = buildFrontmatter(searchSignals, today, existingOrder + 1)
    const prompt = buildPrompt(searchSignals, today)

    const llmResult = await syscall(syscallContext, 'model.invoke', {
      config: { defaultProvider: 'groq', defaultModel: 'llama-3.3-70b-versatile' },
      stage: 'digest-pricing',
      messages: [
        { role: 'system', content: 'You are a technical writer for quidproquo.cc.' },
        { role: 'user', content: prompt },
      ],
      maxTokens: 2500,
    }) as { response: { content: string } }

    const body = String(llmResult.response.content ?? '')
    const slug = buildSlug(searchSignals)
    const zhPath = `src/content/posts/daily/${today}-pricing-${slug}.md`
    const zhContent = `${frontmatter}\n\n${body}\n`

    const commitResult = await syscall(syscallContext, 'knowledge.github.write', {
      sub: 'repo.tree.commit',
      owner: 'vincentxuu',
      repo: 'quidproquo',
      message: `post(daily): pricing tracking ${today}`,
      files: [{ path: zhPath, content: zhContent }],
    }) as { url: string; sha: string }

    return {
      signalsFound: searchSignals.length,
      published: true,
      skipped,
      commit: { sha: commitResult.sha, url: commitResult.url },
    }
  },
})

function identifyVendor(text: string): string | null {
  const lower = text.toLowerCase()
  const vendors: Array<[string, RegExp]> = [
    ['Anthropic', /anthropic|claude/],
    ['OpenAI', /openai|gpt|chatgpt/],
    ['Google', /google|gemini|vertex/],
    ['Mistral', /mistral/],
    ['Cohere', /cohere/],
    ['AWS Bedrock', /bedrock|aws.*ai/],
    ['Together AI', /together\s*ai/],
    ['xAI', /\bxai\b|grok/],
    ['Meta', /\bmeta\b|llama/],
  ]
  for (const [name, pattern] of vendors) {
    if (pattern.test(lower)) return name
  }
  return null
}

async function getMaxSeriesOrder(db: D1Database): Promise<number> {
  const row = await db.prepare(`
    SELECT MAX(CAST(json_extract(series_json, '$.order') AS INTEGER)) AS max_order
    FROM posts
    WHERE json_extract(series_json, '$.name') = 'AI Pricing Watch'
  `).first<{ max_order: number | null }>().catch(() => null)
  return row?.max_order ?? 0
}
