import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { defineAgent } from '../agent/access'

interface AgentRuntime {
  syscallContext: unknown
  syscall: (ctx: unknown, name: string, input: unknown) => Promise<unknown>
}

interface SignalsFile {
  date: string
  signalCount: number
  signals: Array<{
    title: string
    sourceUrl: string
    category: string
    summary: string
    companies: string[]
  }>
}

interface StageOnePost {
  path: string
  title: string
  tldr: string
  category: string
}

function todayTaipei(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
}

const SECTION_MAP: Record<string, string> = {
  'model-release': '模型與基礎設施',
  'benchmark-shift': '模型與基礎設施',
  'framework-release': '技術進展',
  'vendor-update': '廠商動態',
  'pricing-change': '定價與 API 生命週期',
  'funding': '商業案例／融資／併購',
  'acquisition': '商業案例／融資／併購',
  'security-incident': '資安事件與防禦技術',
  'regulation': '法規與治理',
  'tool-launch': '工具與生態',
  'open-source': '工具與生態',
  'enterprise-deployment': '商業案例／融資／併購',
  'region-news': '全球區域動態',
  'community-signal': '社群觀察',
}

function groupSignalsBySection(signals: SignalsFile['signals']): Map<string, SignalsFile['signals']> {
  const groups = new Map<string, SignalsFile['signals']>()
  for (const s of signals) {
    const section = SECTION_MAP[s.category] ?? '其他'
    const list = groups.get(section) ?? []
    list.push(s)
    groups.set(section, list)
  }
  return groups
}

function buildStageOneSummary(posts: StageOnePost[]): string {
  if (posts.length === 0) return ''
  return posts.map(p => `- **${p.title}**：${p.tldr}`).join('\n')
}

async function getMaxSeriesOrder(db: D1Database): Promise<number> {
  const row = await db.prepare(`
    SELECT MAX(CAST(json_extract(series_json, '$.order') AS INTEGER)) AS max_order
    FROM posts
    WHERE json_extract(series_json, '$.name') = 'AI Agent Daily'
  `).first<{ max_order: number | null }>().catch(() => null)
  return row?.max_order ?? 0
}

export interface ReportDigestInput {
  date?: string
}

export interface ReportDigestOutput {
  date: string
  published: boolean
  signalCount: number
  stageOnePosts: number
}

export const reportDigestAgent = defineAgent<ReportDigestInput, ReportDigestOutput>({
  id: 'daily-digest-report',
  version: 1,
  displayName: 'Daily Report',
  description: 'Stage 3: assemble daily AI report from Stage 1 posts and Stage 2 signals.',
  syscalls: ['model.invoke', 'knowledge.github.read', 'knowledge.github.write'],
  memoryScopes: ['agent'],
  secrets: [],
  outboundDomains: ['api.github.com'],
  toolCallLimit: 20,
  timeoutSeconds: 300,
  irreversibleActionsRequireApproval: false,

  async run(input, runtime) {
    const { syscallContext, syscall } = runtime as AgentRuntime
    const e = env as unknown as Env
    const today = input.date ?? todayTaipei()

    const signalsRow = await e.DB.prepare(
      'SELECT signals_json FROM daily_signals WHERE date = ? LIMIT 1'
    ).bind(today).first<{ signals_json: string }>().catch(() => null)

    let signals: SignalsFile | null = null
    if (signalsRow?.signals_json) {
      signals = JSON.parse(signalsRow.signals_json) as SignalsFile
    }

    const stageOnePrefixes = [
      'arxiv-digest', 'github-digest', 'model-', 'security-', 'benchmark-',
      'framework-', 'funding-', 'pricing-', 'tool-',
    ]
    const stageOnePosts: StageOnePost[] = []

    for (const prefix of stageOnePrefixes) {
      const contentsResult = await syscall(syscallContext, 'knowledge.github.read', {
        sub: 'repo.contents',
        owner: 'vincentxuu',
        repo: 'quidproquo',
        path: `src/content/posts/daily`,
      }).catch(() => ({ items: [] })) as { items: Array<{ name: string; path: string }> }

      for (const item of contentsResult.items) {
        if (item.name.startsWith(`${today}-${prefix}`) && item.name.endsWith('.md') && !item.name.endsWith('-en.md')) {
          stageOnePosts.push({
            path: item.path,
            title: item.name.replace(/\.md$/, '').replace(`${today}-`, ''),
            tldr: '',
            category: prefix.replace(/-$/, ''),
          })
        }
      }
    }

    const sections = signals ? groupSignalsBySection(signals.signals) : new Map<string, SignalsFile['signals']>()
    const stageOneSummary = buildStageOneSummary(stageOnePosts)
    const signalsSummary = signals
      ? [...sections.entries()].map(([section, items]) =>
          `### ${section}\n${items.map(s => `- ${s.title}（${s.sourceUrl}）`).join('\n')}`
        ).join('\n\n')
      : '今日無中繼信號檔。'

    const prompt = `你是 quidproquo.cc 的每日 AI 日報編輯。請根據以下資料組裝今日的 AI Agent 日報。

日期：${today}
信號數量：${signals?.signalCount ?? 0}
Stage 1 文章數：${stageOnePosts.length}

## Stage 1 文章摘要
${stageOneSummary || '今日無 Stage 1 文章。'}

## Stage 2 信號（依段落分組）
${signalsSummary}

請撰寫完整的 AI Agent 日報，結構：
1. ## 今日重點摘要（3-5 個 bullet）
2. 依段落展開（只寫有內容的段落）
3. ## 觀察與洞察（用交易成本/互補資產/網路效應/五力/轉換成本至少一個框架）
4. ## 今日收穫（認知差）
5. ## 參考連結

用繁體中文（台灣用語）。每個事實附來源連結。`

    const llmResult = await syscall(syscallContext, 'model.invoke', {
      config: { defaultProvider: 'groq', defaultModel: 'llama-3.3-70b-versatile' },
      stage: 'digest-report',
      messages: [
        { role: 'system', content: 'You are a daily AI report editor for quidproquo.cc.' },
        { role: 'user', content: prompt },
      ],
      maxTokens: 3000,
    }) as { response: { content: string } }

    const body = String(llmResult.response.content ?? '')
    const seriesOrder = (await getMaxSeriesOrder(e.DB)) + 1

    const frontmatter = `---
title: "AI Agent 日報｜${today}"
date: ${today}
category: daily
tags: [ai-agent, daily, report]
lang: zh-TW
description: "AI Agent 生態系每日重點整理"
tldr: "涵蓋 ${signals?.signalCount ?? 0} 則信號、${stageOnePosts.length} 篇專題文章的每日彙整。"
series:
  name: "AI Agent Daily"
  order: ${seriesOrder}
---`

    const zhPath = `src/content/posts/daily/${today}-ai-agent-daily.md`
    const zhContent = `${frontmatter}\n\n${body}\n`

    await syscall(syscallContext, 'knowledge.github.write', {
      sub: 'repo.tree.commit',
      owner: 'vincentxuu',
      repo: 'quidproquo',
      message: `post(daily): AI 日報 ${today}`,
      files: [{ path: zhPath, content: zhContent }],
    })

    return {
      date: today,
      published: true,
      signalCount: signals?.signalCount ?? 0,
      stageOnePosts: stageOnePosts.length,
    }
  },
})
