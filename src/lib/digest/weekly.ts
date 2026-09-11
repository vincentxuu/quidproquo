import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { defineAgent } from '../agent/access'

interface AgentRuntime {
  syscallContext: unknown
  syscall: (ctx: unknown, name: string, input: unknown) => Promise<unknown>
}

function todayTaipei(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
}

function weekStartDate(friday: string): string {
  const d = new Date(`${friday}T00:00:00+08:00`)
  d.setDate(d.getDate() - (d.getDay() + 6) % 7)
  return d.toISOString().slice(0, 10)
}

function weekDates(start: string, end: string): string[] {
  const dates: string[] = []
  const d = new Date(`${start}T00:00:00+08:00`)
  const endDate = new Date(`${end}T00:00:00+08:00`)
  while (d <= endDate) {
    dates.push(d.toISOString().slice(0, 10))
    d.setDate(d.getDate() + 1)
  }
  return dates
}

async function getMaxSeriesOrder(db: D1Database): Promise<number> {
  const row = await db.prepare(`
    SELECT MAX(CAST(json_extract(series_json, '$.order') AS INTEGER)) AS max_order
    FROM posts
    WHERE json_extract(series_json, '$.name') = 'AI Agent Weekly'
  `).first<{ max_order: number | null }>().catch(() => null)
  return row?.max_order ?? 0
}

export interface WeeklyDigestInput {
  date?: string
}

export interface WeeklyDigestOutput {
  date: string
  published: boolean
  weekRange: string
  dailyReports: number
  signalDays: number
}

export const weeklyDigestAgent = defineAgent<WeeklyDigestInput, WeeklyDigestOutput>({
  id: 'daily-digest-weekly',
  version: 1,
  displayName: 'Weekly Review',
  description: 'Weekly AI Agent review: synthesize the week into a cognitive-diff review with watchlist suggestions.',
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
    const weekStart = weekStartDate(today)
    const dates = weekDates(weekStart, today)

    const signalRows = await e.DB.prepare(
      `SELECT date, signals_json FROM daily_signals WHERE date >= ? AND date <= ? ORDER BY date`
    ).bind(weekStart, today).all<{ date: string; signals_json: string }>().catch(() => ({ results: [] }))

    const weekSignals = (signalRows.results ?? []).map(row => {
      const parsed = JSON.parse(row.signals_json) as { signals: Array<{ title: string; category: string; sourceUrl: string }> }
      return { date: row.date, signals: parsed.signals }
    })

    const dailyPostList: string[] = []
    const contentsResult = await syscall(syscallContext, 'knowledge.github.read', {
      sub: 'repo.contents',
      owner: 'vincentxuu',
      repo: 'quidproquo',
      path: 'src/content/posts/daily',
    }).catch(() => ({ items: [] })) as { items: Array<{ name: string }> }

    for (const item of contentsResult.items) {
      if (dates.some(d => item.name.startsWith(d)) && item.name.endsWith('.md') && !item.name.endsWith('-en.md')) {
        dailyPostList.push(item.name)
      }
    }

    const signalSummary = weekSignals.map(day =>
      `### ${day.date}\n${day.signals.slice(0, 10).map(s => `- [${s.category}] ${s.title}`).join('\n')}`
    ).join('\n\n')

    const prompt = `你是 quidproquo.cc 的週回顧編輯。請根據以下資料撰寫本週 AI Agent 週回顧。

週期：${weekStart} ~ ${today}
信號天數：${weekSignals.length}
每日文章數：${dailyPostList.length}

## 本週信號摘要
${signalSummary || '本週無信號資料。'}

## 本週文章清單
${dailyPostList.map(n => `- ${n}`).join('\n') || '本週無文章。'}

請撰寫認知差式週回顧（不是摘要），結構：
1. ## 本週一句話（最重要的認知變化）
2. ## 趨勢觀察（3-5 個跨天累積的趨勢）
3. ## 本週最大意外（跟你預期不同的事）
4. ## Watchlist 更新建議（建議新增/移除/升降級的追蹤對象）
5. ## 新創雷達（本週出現值得關注的新公司/產品）
6. ## 下週展望（已知即將發生的事件）
7. ## 參考連結

用繁體中文（台灣用語）。`

    const llmResult = await syscall(syscallContext, 'model.invoke', {
      config: { defaultProvider: 'groq', defaultModel: 'llama-3.3-70b-versatile' },
      stage: 'digest-weekly',
      messages: [
        { role: 'system', content: 'You are a weekly AI review editor for quidproquo.cc.' },
        { role: 'user', content: prompt },
      ],
      maxTokens: 3000,
    }) as { response: { content: string } }

    const body = String(llmResult.response.content ?? '')
    const seriesOrder = (await getMaxSeriesOrder(e.DB)) + 1

    const frontmatter = `---
title: "AI Agent 週回顧｜${weekStart} ~ ${today}"
date: ${today}
category: daily
tags: [ai-agent, weekly, review]
lang: zh-TW
description: "本週 AI Agent 生態系認知差式回顧"
tldr: "涵蓋 ${weekSignals.length} 天信號、${dailyPostList.length} 篇文章的週度彙整。"
series:
  name: "AI Agent Weekly"
  order: ${seriesOrder}
---`

    const zhPath = `src/content/posts/daily/${today}-weekly-review.md`
    const zhContent = `${frontmatter}\n\n${body}\n`

    await syscall(syscallContext, 'knowledge.github.write', {
      sub: 'repo.tree.commit',
      owner: 'vincentxuu',
      repo: 'quidproquo',
      message: `post(daily): 週回顧 ${today}`,
      files: [{ path: zhPath, content: zhContent }],
    })

    return {
      date: today,
      published: true,
      weekRange: `${weekStart} ~ ${today}`,
      dailyReports: dailyPostList.length,
      signalDays: weekSignals.length,
    }
  },
})
