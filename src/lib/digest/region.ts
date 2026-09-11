import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { defineAgent } from '../agent/access'

interface AgentRuntime {
  syscallContext: unknown
  syscall: (ctx: unknown, name: string, input: unknown) => Promise<unknown>
}

const CANONICAL_REGIONS = [
  'north-america', 'china', 'taiwan', 'japan-korea', 'southeast-asia',
  'india-south-asia', 'europe', 'middle-east', 'africa', 'latin-america', 'oceania',
] as const

type CanonicalRegion = (typeof CANONICAL_REGIONS)[number]

const _COUNTRY_TO_REGION: Record<string, CanonicalRegion> = {
  US: 'north-america', CA: 'north-america',
  CN: 'china', HK: 'china',
  TW: 'taiwan',
  JP: 'japan-korea', KR: 'japan-korea',
  SG: 'southeast-asia', ID: 'southeast-asia', TH: 'southeast-asia', VN: 'southeast-asia', MY: 'southeast-asia', PH: 'southeast-asia',
  IN: 'india-south-asia', PK: 'india-south-asia', BD: 'india-south-asia',
  GB: 'europe', DE: 'europe', FR: 'europe', NL: 'europe', SE: 'europe', FI: 'europe', CH: 'europe', IT: 'europe', ES: 'europe', PL: 'europe',
  IL: 'middle-east', AE: 'middle-east', SA: 'middle-east',
  NG: 'africa', KE: 'africa', ZA: 'africa', EG: 'africa',
  BR: 'latin-america', MX: 'latin-america', AR: 'latin-america', CL: 'latin-america', CO: 'latin-america',
  AU: 'oceania', NZ: 'oceania',
}

const REGION_SEARCH_QUERIES: Record<CanonicalRegion, string> = {
  'north-america': 'AI startup policy United States Canada',
  china: 'AI 中国 政策 投资 模型',
  taiwan: 'AI 台灣 新創 政策',
  'japan-korea': 'AI Japan Korea startup policy investment',
  'southeast-asia': 'AI Southeast Asia Singapore Indonesia Thailand startup',
  'india-south-asia': 'AI India startup investment policy',
  europe: 'AI Europe EU regulation startup investment',
  'middle-east': 'AI Middle East Israel UAE Saudi Arabia startup',
  africa: 'AI Africa Nigeria Kenya South Africa startup',
  'latin-america': 'AI Latin America Brazil Mexico startup',
  oceania: 'AI Australia New Zealand startup policy',
}

const REGION_LABELS: Record<CanonicalRegion, string> = {
  'north-america': '北美',
  china: '中國',
  taiwan: '台灣',
  'japan-korea': '日韓',
  'southeast-asia': '東南亞',
  'india-south-asia': '印度／南亞',
  europe: '歐洲',
  'middle-east': '中東',
  africa: '非洲',
  'latin-america': '拉丁美洲',
  oceania: '大洋洲',
}

function todayTaipei(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
}

function weekStartDate(friday: string): string {
  const d = new Date(`${friday}T00:00:00+08:00`)
  d.setDate(d.getDate() - (d.getDay() + 6) % 7)
  return d.toISOString().slice(0, 10)
}

async function getMaxSeriesOrder(db: D1Database): Promise<number> {
  const row = await db.prepare(`
    SELECT MAX(CAST(json_extract(series_json, '$.order') AS INTEGER)) AS max_order
    FROM posts
    WHERE json_extract(series_json, '$.name') = 'AI Region Focus'
  `).first<{ max_order: number | null }>().catch(() => null)
  return row?.max_order ?? 0
}

async function getLastRegionCoverage(db: D1Database): Promise<Map<CanonicalRegion, string>> {
  const rows = await db.prepare(`
    SELECT slug, created_at FROM posts
    WHERE slug LIKE '%region-%' AND lang = 'zh-TW'
    ORDER BY created_at DESC
  `).all<{ slug: string; created_at: string }>().catch(() => ({ results: [] }))

  const coverage = new Map<CanonicalRegion, string>()
  for (const row of rows.results ?? []) {
    const regionSlug = row.slug.replace(/^\d{4}-\d{2}-\d{2}-region-/, '')
    const normalized = regionSlug === 'israel' ? 'middle-east' : regionSlug
    if (CANONICAL_REGIONS.includes(normalized as CanonicalRegion) && !coverage.has(normalized as CanonicalRegion)) {
      coverage.set(normalized as CanonicalRegion, row.created_at)
    }
  }
  return coverage
}

function selectRegionByGap(coverage: Map<CanonicalRegion, string>): CanonicalRegion {
  let oldest: CanonicalRegion = CANONICAL_REGIONS[0]
  let oldestDate = '9999-12-31'
  for (const region of CANONICAL_REGIONS) {
    const lastCovered = coverage.get(region) ?? '2000-01-01'
    if (lastCovered < oldestDate) {
      oldestDate = lastCovered
      oldest = region
    }
  }
  return oldest
}

export interface RegionDigestInput {
  date?: string
  region?: CanonicalRegion
}

export interface RegionDigestOutput {
  date: string
  region: CanonicalRegion
  published: boolean
  skipped?: boolean
  reason?: string
}

export const regionDigestAgent = defineAgent<RegionDigestInput, RegionDigestOutput>({
  id: 'daily-digest-region',
  version: 1,
  displayName: 'Region Focus',
  description: 'Weekly regional AI ecosystem deep-dive, picked by coverage-gap priority.',
  syscalls: ['model.invoke', 'knowledge.github.write'],
  memoryScopes: ['agent'],
  secrets: [],
  outboundDomains: ['*.tavily.com', '*.exa.ai'],
  toolCallLimit: 20,
  timeoutSeconds: 300,
  irreversibleActionsRequireApproval: false,

  async run(input, runtime) {
    const { syscallContext, syscall } = runtime as AgentRuntime
    const e = env as unknown as Env
    const today = input.date ?? todayTaipei()

    const dayOfWeek = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Taipei', weekday: 'long' })
    if (dayOfWeek !== 'Friday') {
      return { date: today, region: (input.region ?? 'north-america') as CanonicalRegion, published: false, skipped: true, reason: `not Friday (${dayOfWeek})` }
    }

    const weekStart = weekStartDate(today)

    const coverage = await getLastRegionCoverage(e.DB)
    const targetRegion = input.region ?? selectRegionByGap(coverage)
    const regionLabel = REGION_LABELS[targetRegion]

    const signalRows = await e.DB.prepare(
      `SELECT signals_json FROM daily_signals WHERE date >= ? AND date <= ? ORDER BY date`
    ).bind(weekStart, today).all<{ signals_json: string }>().catch(() => ({ results: [] }))

    const regionSignals: Array<{ title: string; sourceUrl: string }> = []
    for (const row of signalRows.results ?? []) {
      const parsed = JSON.parse(row.signals_json) as { signals: Array<{ title: string; sourceUrl: string; companies: string[] }> }
      regionSignals.push(...parsed.signals.filter(s => {
        const text = `${s.title} ${s.companies.join(' ')}`.toLowerCase()
        return text.includes(regionLabel.toLowerCase()) || text.includes(targetRegion)
      }))
    }

    const searchQuery = REGION_SEARCH_QUERIES[targetRegion]
    const searchResult = await syscall(syscallContext, 'search.external', {
      query: `${searchQuery} 2026`,
      limit: 10,
      timeoutMs: 8000,
      providers: ['tavily', 'exa'],
    }).catch(() => ({ results: [] })) as { results: Array<{ title?: string; url?: string; snippet?: string }> }

    const searchSummary = (searchResult.results ?? [])
      .filter(r => r.title)
      .slice(0, 8)
      .map(r => `- ${r.title}（${r.url ?? ''}）\n  ${(r.snippet ?? '').slice(0, 200)}`)
      .join('\n')

    const signalSummary = regionSignals.slice(0, 10)
      .map(s => `- ${s.title}（${s.sourceUrl}）`)
      .join('\n')

    const prompt = `你是 quidproquo.cc 的區域 AI 生態分析師。請撰寫「${regionLabel}」的 AI 生態深度觀察。

日期：${today}
週期：${weekStart} ~ ${today}
目標區域：${regionLabel}（${targetRegion}）

## 本週區域相關信號
${signalSummary || '本週無相關信號。'}

## 搜尋補充資料
${searchSummary || '搜尋無結果。'}

請撰寫深度區域觀察，結構：
1. ## 區域快照（政策環境、投資熱度、人才流動的 1-2 句總覽）
2. ## 本週重點事件（3-5 個，每個附來源連結）
3. ## 政策與法規動態
4. ## 新創與投資
5. ## 對台灣創業者的啟示（必須有，1-2 段）
6. ## 今日收穫（認知差）
7. ## 參考連結

用繁體中文（台灣用語）。`

    const llmResult = await syscall(syscallContext, 'model.invoke', {
      config: { defaultProvider: 'groq', defaultModel: 'llama-3.3-70b-versatile' },
      stage: 'digest-region',
      messages: [
        { role: 'system', content: 'You are a regional AI ecosystem analyst for quidproquo.cc.' },
        { role: 'user', content: prompt },
      ],
      maxTokens: 3000,
    }) as { response: { content: string } }

    const body = String(llmResult.response.content ?? '')
    const seriesOrder = (await getMaxSeriesOrder(e.DB)) + 1
    const regionSlug = targetRegion

    const frontmatter = `---
title: "區域觀察｜${regionLabel} AI 生態"
date: ${today}
category: daily
tags: [ai-agent, region, ${regionSlug}, weekly]
lang: zh-TW
description: "${regionLabel}地區 AI 生態系深度觀察"
tldr: "本週${regionLabel} AI 生態重點整理，含政策、投資與新創動態。"
series:
  name: "AI Region Focus"
  order: ${seriesOrder}
---`

    const zhPath = `src/content/posts/daily/${today}-region-${regionSlug}.md`
    const zhContent = `${frontmatter}\n\n${body}\n`

    await syscall(syscallContext, 'knowledge.github.write', {
      sub: 'repo.tree.commit',
      owner: 'vincentxuu',
      repo: 'quidproquo',
      message: `post(daily): region focus ${regionLabel} ${today}`,
      files: [{ path: zhPath, content: zhContent }],
    })

    return { date: today, region: targetRegion, published: true }
  },
})
