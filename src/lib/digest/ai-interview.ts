import { defineAgent } from '../agent/access'

interface AgentRuntime {
  syscallContext: unknown
  syscall: (ctx: unknown, name: string, input: unknown) => Promise<unknown>
}

interface TopicConfig {
  label: string
  tag: string
  queries: [string, string]
}

const TOPIC_ROTATION: Record<number, TopicConfig> = {
  1: {
    label: 'ML Fundamentals',
    tag: 'machine-learning',
    queries: [
      '"machine learning interview" loss function regularization optimization 2026',
      '"ML interview questions" fundamentals bias variance evaluation metrics',
    ],
  },
  2: {
    label: 'Deep Learning & NLP',
    tag: 'deep-learning',
    queries: [
      '"deep learning interview" transformer attention CNN RNN 2026',
      '"NLP interview" tokenization fine-tuning embeddings questions',
    ],
  },
  3: {
    label: 'ML System Design',
    tag: 'system-design',
    queries: [
      '"ML system design interview" feature store serving pipeline 2026',
      '"machine learning system design" monitoring A/B testing architecture',
    ],
  },
  4: {
    label: 'LLM & Agent Engineering',
    tag: 'llm-engineering',
    queries: [
      '"LLM interview" RAG agent architecture context engineering 2026',
      '"AI engineer interview" RLHF guardrails evaluation LLM',
    ],
  },
  5: {
    label: 'Coding',
    tag: 'coding',
    queries: [
      '"ML coding interview" python numpy batch inference implementation 2026',
      '"machine learning coding" data processing algorithm interview',
    ],
  },
  6: {
    label: 'Paper Reading',
    tag: 'paper-reading',
    queries: [
      'site:arxiv.org "cs.AI" OR "cs.CL" agent interview-relevant 2026',
      '"AI paper discussion" interview reading comprehension',
    ],
  },
  7: {
    label: 'Behavioral & Weekly Review',
    tag: 'behavioral',
    queries: [
      '"AI engineer behavioral interview" STAR leadership impact 2026',
      '"machine learning interview" behavioral questions career',
    ],
  },
}

function todayTaipei(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
}

function dayOfWeekTaipei(): number {
  const d = new Date()
  const taipeiDay = new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }))
  return taipeiDay.getDay() === 0 ? 7 : taipeiDay.getDay()
}

function seriesOrderFromDate(today: string): number {
  const epoch = new Date('2026-08-20').getTime()
  const current = new Date(today).getTime()
  return Math.max(1, Math.floor((current - epoch) / 86400000) + 1)
}

function buildFrontmatter(today: string, topic: TopicConfig, order: number): string {
  return `---
title: "AI Engineer 面試日練 — ${today}：${topic.label}"
date: ${today}
category: daily
tags: [ai-engineer-interview, daily, ${topic.tag}]
lang: zh-TW
description: "AI Engineer 面試準備：${topic.label}"
tldr: "今日主題：${topic.label}。包含核心概念速記、練習題拆解、範例回答。"
series:
  name: "AI Engineer 面試日練"
  order: ${order}
---`
}

function buildPrompt(topic: TopicConfig, today: string, searchResults: string, isSunday: boolean): string {
  if (isSunday) {
    return `你是 quidproquo.cc 的 AI 面試教練。今天是星期日，請產出「Behavioral & Weekly Review」格式的文章。

日期：${today}
主題：${topic.label}

搜尋到的參考資料：
${searchResults}

請嚴格按以下結構撰寫（zh-TW）：
1. ## 本週行為面試練習
   - 用 STAR 框架（情境/任務/行動/結果）寫一個 AI Engineer 常見的情境故事
   - ### 怎麼講這個故事（dos 和 don'ts）
2. ## 本週回顧
   - 用表格列出 Mon-Sun 的主題和練了什麼（自評欄位留空讓讀者填）
3. ## 下週預告（提示下週可以加強的弱點）
4. ## 參考資料（附連結）

注意：用繁體中文（台灣用語），不要用「技術棧」「數據」等中國用語。全文 800-1500 字。`
  }

  return `你是 quidproquo.cc 的 AI 面試教練。請根據今日主題和搜尋到的最新資源，撰寫一篇面試準備文章。

日期：${today}
主題：${topic.label}

搜尋到的參考資料：
${searchResults}

請嚴格按以下結構撰寫（zh-TW）：
1. ## 今日主題（2-3 句，為什麼這個主題在面試中重要）
2. ## 核心概念速記（3-5 個概念，每個 2-3 句，用面試口語表述）
3. ## 今日練習題
   - ### 題目（一道真實面試風格的問題，標注來源/難度/環節）
   - ### 拆解思路（4 步：釐清問題→建立框架→深入核心→收尾）
   - ### 範例回答（用 blockquote，200-300 字，面試時能直接說出口的語氣）
   - ### 自我核對清單（表格，5-6 個核對項目）
4. ## 延伸閱讀（2-3 個有連結的資源）
5. ## 參考資料（附連結）

注意：用繁體中文（台灣用語），不要用「技術棧」「數據」等中國用語。全文 800-1500 字。
練習題優先選有公司來源的真實題目。`
}

export interface AiInterviewDigestInput {
  date?: string
  dowOverride?: number
}

export interface AiInterviewDigestOutput {
  published: boolean
  topic: string
  sha?: string
  url?: string
  skipped?: string
}

export const aiInterviewDigestAgent = defineAgent<AiInterviewDigestInput, AiInterviewDigestOutput>({
  id: 'daily-digest-ai-interview',
  version: 1,
  displayName: 'AI Interview Daily',
  description: 'Daily AI Engineer interview prep article with 7-topic weekly rotation.',
  syscalls: ['model.invoke', 'knowledge.github.write', 'search.external'],
  memoryScopes: ['agent'],
  secrets: [],
  outboundDomains: ['api.github.com'],
  toolCallLimit: 20,
  timeoutSeconds: 300,
  irreversibleActionsRequireApproval: false,

  async run(input, runtime) {
    const { syscallContext, syscall } = runtime as AgentRuntime
    const today = input.date ?? todayTaipei()
    const dow = input.dowOverride ?? dayOfWeekTaipei()
    const topic = TOPIC_ROTATION[dow] ?? TOPIC_ROTATION[1]
    const order = seriesOrderFromDate(today)
    const isSunday = dow === 7

    const searchResults = await runSearchQueries(syscall, syscallContext, topic.queries)
    const frontmatter = buildFrontmatter(today, topic, order)
    const prompt = buildPrompt(topic, today, searchResults, isSunday)

    const llmResult = await syscall(syscallContext, 'model.invoke', {
      config: { defaultProvider: 'groq', defaultModel: 'llama-3.3-70b-versatile' },
      stage: 'digest-ai-interview',
      messages: [
        { role: 'system', content: 'You are an AI interview coach writing for quidproquo.cc.' },
        { role: 'user', content: prompt },
      ],
      maxTokens: 2500,
    }) as { response: { content: string } }

    const body = String(llmResult.response.content ?? '')
    const filePath = `src/content/posts/daily/${today}-ai-interview-daily.md`
    const fileContent = `${frontmatter}\n\n${body}\n`

    const commitResult = await syscall(syscallContext, 'knowledge.github.write', {
      sub: 'repo.tree.commit',
      owner: 'vincentxuu',
      repo: 'quidproquo',
      message: `post(daily): AI engineer interview daily ${today} — ${topic.label}`,
      files: [{ path: filePath, content: fileContent }],
    }) as { url: string; sha: string }

    return {
      published: true,
      topic: topic.label,
      sha: commitResult.sha,
      url: commitResult.url,
    }
  },
})

async function runSearchQueries(
  syscall: AgentRuntime['syscall'],
  ctx: unknown,
  queries: [string, string],
): Promise<string> {
  const results: string[] = []

  for (const query of queries) {
    try {
      const searchResult = await syscall(ctx, 'search.external', {
        query,
        limit: 8,
        timeoutMs: 8000,
        providers: ['tavily', 'exa'],
      }) as { results: Array<{ title: string; url: string; snippet: string }> }

      for (const r of searchResult.results ?? []) {
        results.push(`- [${r.title}](${r.url}): ${r.snippet?.slice(0, 200) ?? ''}`)
      }
    } catch {
      results.push(`(search failed for: ${query.slice(0, 60)})`)
    }
  }

  return results.length > 0 ? results.join('\n') : '(no search results available)'
}
