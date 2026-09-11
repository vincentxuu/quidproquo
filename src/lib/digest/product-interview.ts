import { defineAgent } from '../agent/access'

interface TopicConfig {
  name: string
  tag: string
  frameworks: string[]
  queries: [string, string]
}

const TOPICS: TopicConfig[] = [
  {
    name: 'Product Sense',
    tag: 'product-sense',
    frameworks: ['CIRCLES', '用戶問題框架'],
    queries: [
      'product sense interview question user insight problem decomposition 2026',
      'PM interview product design case study feature prioritization',
    ],
  },
  {
    name: 'Metrics & Analytics',
    tag: 'metrics',
    frameworks: ['AARRR', '指標樹'],
    queries: [
      'product metrics interview north star funnel analysis experiment design 2026',
      'PM case study data-driven decision A/B test SQL interview',
    ],
  },
  {
    name: 'Strategy & Execution',
    tag: 'strategy',
    frameworks: ["Porter's Five Forces", 'TAM-SAM-SOM'],
    queries: [
      'product strategy interview market positioning competitive moat roadmap 2026',
      'PM execution interview stakeholder management cross-functional leadership',
    ],
  },
  {
    name: 'AI Product Design',
    tag: 'ai-product',
    frameworks: ['Human-AI Task Allocation', 'Trust Calibration'],
    queries: [
      'AI product design interview human-in-the-loop trust UX 2026',
      'AI-native product manager LLM product design case study interview',
    ],
  },
  {
    name: 'Growth & Experimentation',
    tag: 'growth',
    frameworks: ['Hook Model', 'Growth Flywheel'],
    queries: [
      'growth PM interview growth loop retention virality A/B testing 2026',
      'product-led growth interview experiment design activation funnel',
    ],
  },
  {
    name: 'Technical PM',
    tag: 'technical-pm',
    frameworks: ['RFC 流程', 'Architecture Decision Record'],
    queries: [
      'technical product manager interview API design system architecture 2026',
      'technical PM interview engineering collaboration trade-off analysis',
    ],
  },
  {
    name: 'Behavioral & Weekly Review',
    tag: 'behavioral',
    frameworks: ['STAR', 'Situation-Behavior-Impact'],
    queries: [
      'PM behavioral interview leadership influence conflict resolution STAR 2026',
      'product manager behavioral question tell me about a time failed',
    ],
  },
]

const SERIES_EPOCH = new Date('2026-08-20T00:00:00+08:00')

interface AgentRuntime {
  syscallContext: unknown
  syscall: (ctx: unknown, name: string, input: unknown) => Promise<unknown>
}

interface SearchResult {
  title: string
  url: string
  snippet: string
}

function todayTaipei(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
}

function dayOfWeekTaipei(): number {
  const dow = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Taipei', weekday: 'short' })
  const map: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }
  return map[dow] ?? 1
}

function seriesOrder(today: string): number {
  const d = new Date(`${today}T00:00:00+08:00`)
  return Math.max(1, Math.floor((d.getTime() - SERIES_EPOCH.getTime()) / 86_400_000) + 1)
}

function resolveTopic(dow: number): TopicConfig {
  return TOPICS[(dow - 1) % TOPICS.length]
}

function buildFrontmatter(today: string, topic: TopicConfig, order: number): string {
  return `---
title: "Product Builder 面試日練 — ${today}：${topic.name}"
date: ${today}
category: daily
tags: [product-builder-interview, daily, ${topic.tag}]
lang: zh-TW
description: "今日主題：${topic.name}，練習框架：${topic.frameworks.join('、')}"
tldr: "今日聚焦 ${topic.name}，核心框架：${topic.frameworks.join(' / ')}。附練習題、案例與延伸閱讀。"
series:
  name: "Product Builder 面試日練"
  order: ${order}
---`
}

function buildPrompt(topic: TopicConfig, searchContext: string, isSunday: boolean): string {
  const sundayExtra = isSunday
    ? `

另外，因為今天是星期日，請在文章最後加一個「## 本週回顧」區段：
- 用表格列出週一到週日的主題和練習題摘要（你可以自擬每天的題目摘要）
- 每行有「日 | 主題 | 練習題 | 自評」欄位
- 最後加「### 下週預告」，列出下週重點預習方向`
    : ''

  return `你是 quidproquo.cc 的 Product Builder 面試準備教練。請根據以下主題和搜尋素材，撰寫一篇面試日練文章。

今日主題：${topic.name}
核心框架：${topic.frameworks.join('、')}

搜尋到的最新素材：
${searchContext || '（無搜尋結果，請用你的知識撰寫）'}

請嚴格按以下結構撰寫（zh-TW，800-1500 字）：

1. ## 今日主題（2-3 句說明主題和面試重要性）
2. ## 核心框架速記（1-2 個框架，用步驟或表格呈現）
3. ## 今日練習題
   - ### 題目（真實面試風格，標註來源）
   - ### 拆解思路（3-5 步驟）
   - ### 範例回答（用 blockquote，200-300 字，面試口語風格）
   - ### 自我核對清單（表格，5-6 個核對項目）
4. ## 今日案例（真實產品案例，3-5 句 + 面試連結）
5. ## 延伸閱讀（2-3 篇，附連結和一句話說明）
6. ## 參考資料（附連結）
${sundayExtra}

注意：用繁體中文（台灣用語），不要用「技術棧」「數據」等中國用語。練習題要是面試風格，不是教科書習題。`
}

async function runWebSearch(
  syscall: AgentRuntime['syscall'],
  ctx: unknown,
  query: string,
): Promise<SearchResult[]> {
  const result = await syscall(ctx, 'search.external', {
    query,
    limit: 10,
    timeoutMs: 8000,
    providers: ['tavily', 'exa', 'jina'],
  }).catch(() => ({ results: [] })) as { results: SearchResult[] }
  return result.results ?? []
}

export interface ProductInterviewDigestInput {
  date?: string
  dow?: number
}

export interface ProductInterviewDigestOutput {
  topic: string
  published: boolean
  sha: string
  url: string
}

export const productInterviewDigestAgent = defineAgent<ProductInterviewDigestInput, ProductInterviewDigestOutput>({
  id: 'daily-digest-product-interview',
  version: 1,
  displayName: 'Product Interview Daily',
  description: 'Daily Product Builder interview prep with topic rotation.',
  syscalls: ['model.invoke', 'knowledge.github.write', 'search.external'],
  memoryScopes: ['agent'],
  secrets: [],
  outboundDomains: ['api.github.com', '*.tavily.com', '*.exa.ai', '*.jina.ai'],
  toolCallLimit: 20,
  timeoutSeconds: 300,
  irreversibleActionsRequireApproval: false,

  async run(input, runtime) {
    const { syscallContext, syscall } = runtime as AgentRuntime
    const today = input.date ?? todayTaipei()
    const dow = input.dow ?? dayOfWeekTaipei()
    const topic = resolveTopic(dow)
    const order = seriesOrder(today)
    const isSunday = dow === 7

    const allResults: SearchResult[] = []
    for (const query of topic.queries) {
      const results = await runWebSearch(syscall, syscallContext, query)
      allResults.push(...results)
    }

    const seen = new Set<string>()
    const deduped = allResults.filter(r => {
      if (seen.has(r.url)) return false
      seen.add(r.url)
      return true
    })

    const searchContext = deduped
      .slice(0, 8)
      .map((r, i) => `[${i + 1}] ${r.title}\n${r.url}\n${r.snippet}`)
      .join('\n\n')

    const frontmatter = buildFrontmatter(today, topic, order)
    const prompt = buildPrompt(topic, searchContext, isSunday)

    const llmResult = await syscall(syscallContext, 'model.invoke', {
      config: { defaultProvider: 'groq', defaultModel: 'llama-3.3-70b-versatile' },
      stage: 'digest-product-interview',
      messages: [
        { role: 'system', content: 'You are a Product Builder interview coach for quidproquo.cc.' },
        { role: 'user', content: prompt },
      ],
      maxTokens: 3000,
    }) as { response: { content: string } }

    const body = String(llmResult.response.content ?? '')
    const filePath = `src/content/posts/daily/${today}-product-builder-interview-daily.md`
    const fileContent = `${frontmatter}\n\n${body}\n`

    const commitResult = await syscall(syscallContext, 'knowledge.github.write', {
      sub: 'repo.tree.commit',
      owner: 'vincentxuu',
      repo: 'quidproquo',
      message: `post(daily): product builder interview daily ${today}`,
      files: [{ path: filePath, content: fileContent }],
    }) as { url: string; sha: string }

    return { topic: topic.name, published: true, sha: commitResult.sha, url: commitResult.url }
  },
})
