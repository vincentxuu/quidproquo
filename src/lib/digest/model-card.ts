import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { defineAgent } from '../agent/access'

interface AgentRuntime {
  syscallContext: unknown
  syscall: (ctx: unknown, name: string, input: unknown) => Promise<unknown>
}

interface HfModel {
  id: string
  likes: number
  trendingScore?: number
  downloads: number
  tags: string[]
  createdAt: string
  pipeline_tag?: string
}

interface DetectedModel {
  name: string
  vendor: string
  vendorSlug: string
  familySlug: string
  source: 'huggingface' | 'search'
  hfId?: string
  hfUrl?: string
  announcementUrl?: string
  likes?: number
  downloads?: number
  createdAt?: string
  pipelineTag?: string
  snippet: string
}

const HF_API = 'https://huggingface.co/api/models'

const HF_QUERIES: Array<{ filter: string; limit: number; label: string }> = [
  { filter: 'text-generation', limit: 30, label: 'text-gen' },
  { filter: 'image-text-to-text', limit: 15, label: 'multimodal' },
  { filter: 'text-to-image', limit: 10, label: 'image-gen' },
  { filter: 'text-to-video', limit: 10, label: 'video-gen' },
]

const SEARCH_QUERIES = [
  '"new AI model" OR "model release" OR "model announcement" Claude OR GPT OR Gemini OR Llama',
  '"AI model launch" OR "foundation model" Mistral OR Cohere OR DeepSeek OR Qwen OR GLM',
]

const QUANT_PATTERNS = /gguf|mlx|fp8|awq|gptq|exl2|bnb/i
const QUANT_UPLOADERS = /unsloth|bartowski|thebloke|turboderp|mradermacher/i
const DERIVATIVE_PATTERNS = /uncensored|abliterated|censored/i

function todayTaipei(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
}

function sevenDaysAgoIso(): string {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d.toISOString()
}

function isNewBaseModel(model: HfModel, cutoff: string): boolean {
  if (model.createdAt < cutoff) return false
  if (model.tags.some(t => t.startsWith('base_model:'))) return false
  if (model.likes < 50) return false
  return true
}

function isQuantRepack(model: HfModel): boolean {
  const id = model.id.toLowerCase()
  if (QUANT_PATTERNS.test(id) && !isOfficialOrg(model.id)) return true
  const org = model.id.split('/')[0].toLowerCase()
  if (QUANT_UPLOADERS.test(org)) return true
  return false
}

function isOfficialOrg(modelId: string): boolean {
  const org = modelId.split('/')[0].toLowerCase()
  const officials = [
    'meta-llama', 'mistralai', 'qwen', 'deepseek-ai', 'google', 'microsoft',
    'stabilityai', 'openai', 'anthropic', 'cohere', 'nvidia', 'bigcode',
    'huggingface', 'tiiuae', '01-ai', 'zhipuai', 'minimax', 'thudm',
  ]
  return officials.includes(org)
}

function isDerivative(model: HfModel): boolean {
  return DERIVATIVE_PATTERNS.test(model.id)
}

function dedupeToBaseModels(models: HfModel[]): HfModel[] {
  const baseMap = new Map<string, HfModel>()
  for (const m of models) {
    const baseTag = m.tags.find(t => t.startsWith('base_model:'))
    const baseKey = baseTag ? baseTag.replace('base_model:', '') : m.id
    const existing = baseMap.get(baseKey)
    if (!existing || (m.trendingScore ?? 0) > (existing.trendingScore ?? 0)) {
      baseMap.set(baseKey, m)
    }
  }
  return [...baseMap.values()]
}

function extractVendorInfo(modelId: string): { vendor: string; vendorSlug: string; familySlug: string } {
  const org = modelId.split('/')[0]
  const modelName = modelId.split('/').pop() ?? modelId
  const vendorMap: Record<string, string> = {
    'meta-llama': 'Meta', 'mistralai': 'Mistral', 'qwen': 'Alibaba (Qwen)',
    'deepseek-ai': 'DeepSeek', 'google': 'Google', 'microsoft': 'Microsoft',
    'stabilityai': 'Stability AI', 'openai': 'OpenAI', 'cohere': 'Cohere',
    'nvidia': 'NVIDIA', 'tiiuae': 'TII (Falcon)', '01-ai': '01.AI (Yi)',
    'zhipuai': 'Zhipu (GLM)', 'minimax': 'MiniMax', 'thudm': 'Tsinghua (ChatGLM)',
  }
  const vendor = vendorMap[org.toLowerCase()] ?? org
  const vendorSlug = org.toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const family = modelName.replace(/-\d.*$/, '').toLowerCase().replace(/[^a-z0-9-]/g, '-')
  return { vendor, vendorSlug, familySlug: `model-family-${family}` }
}

async function fetchHfTrending(filter: string, limit: number): Promise<HfModel[]> {
  const url = `${HF_API}?sort=likes7d&direction=-1&limit=${limit}&filter=${filter}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'quidproquo-digest-agent' },
  })
  if (!res.ok) return []
  return await res.json() as HfModel[]
}

function buildFrontmatter(model: DetectedModel, today: string, seriesOrder: number): string {
  return `---
title: "模型卡｜${model.name}"
date: ${today}
category: daily
tags: [ai-agent, model-release, daily, ${model.vendorSlug}, ${model.familySlug}]
lang: zh-TW
description: "${model.snippet.slice(0, 120)}"
tldr: ""
series:
  name: "AI Model Tracker"
  order: ${seriesOrder}
---`
}

function buildPrompt(model: DetectedModel, today: string): string {
  return `你是 quidproquo.cc 的技術作者。請根據以下資訊撰寫一篇 AI 模型卡文章。

模型名稱：${model.name}
廠商：${model.vendor}
來源：${model.source === 'huggingface' ? `HuggingFace (${model.hfId})` : '搜尋發現'}
${model.hfUrl ? `HuggingFace：${model.hfUrl}` : ''}
${model.announcementUrl ? `公告：${model.announcementUrl}` : ''}
${model.likes ? `Likes：${model.likes}` : ''}
${model.downloads ? `Downloads：${model.downloads}` : ''}
${model.pipelineTag ? `Pipeline：${model.pipelineTag}` : ''}
日期：${today}

摘要：${model.snippet}

請嚴格按以下結構撰寫（zh-TW）：
1. ## 模型資訊（表格：Model ID、廠商、參數量、Context Window、定價、開源、發布日、官方公告、HuggingFace、家族）
2. ## 能力亮點（2-4 個 bullet，含具體數字）
3. ## Benchmark 表現（表格：Benchmark、分數、前代模型、競品最強，至少 3 個。⚠️ 標注自測結果）
4. ## 與前代/競品比較（2-3 段分析）
5. ## 對 Agent 開發的意義（2-3 段，用「如果你在做 X：」句式）
6. ## 今日收穫（認知差：之前以為 X → 現在知道 Y）
7. ## 參考資料（附連結）

注意：
- 用繁體中文（台灣用語），不要用「技術棧」「數據」等中國用語
- 定價精確到小數，不寫「約」
- 未知的資訊寫「未公開」，不要編造`
}

export interface ModelCardDigestInput {
  date?: string
}

export interface ModelCardDigestOutput {
  detected: number
  published: number
  skipped: string[]
  commits: Array<{ model: string; sha: string; url: string }>
}

export const modelCardDigestAgent = defineAgent<ModelCardDigestInput, ModelCardDigestOutput>({
  id: 'daily-digest-model-card',
  version: 1,
  displayName: 'Model Card Digest',
  description: 'Detect new AI model releases and publish model card posts.',
  syscalls: ['model.invoke', 'knowledge.github.write'],
  memoryScopes: ['agent'],
  secrets: [],
  outboundDomains: ['huggingface.co', 'api.github.com'],
  toolCallLimit: 30,
  timeoutSeconds: 300,
  irreversibleActionsRequireApproval: false,

  async run(input, runtime) {
    const { syscallContext, syscall } = runtime as AgentRuntime
    const e = env as unknown as Env
    const today = input.date ?? todayTaipei()
    const cutoff = sevenDaysAgoIso()

    const allHfModels: HfModel[] = []
    for (const q of HF_QUERIES) {
      const models = await fetchHfTrending(q.filter, q.limit).catch(() => [] as HfModel[])
      allHfModels.push(...models)
    }

    const filtered = allHfModels
      .filter(m => !isQuantRepack(m))
      .filter(m => !isDerivative(m))
    const deduped = dedupeToBaseModels(filtered)

    const newBases = deduped.filter(m => isNewBaseModel(m, cutoff))
    const trendingHits = deduped
      .filter(m => (m.trendingScore ?? 0) > 0 && m.downloads > 100000)
      .sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0))
      .slice(0, 3)
      .filter(m => !newBases.some(nb => nb.id === m.id))

    const searchDetected: DetectedModel[] = []
    for (const query of SEARCH_QUERIES) {
      try {
        const results = await syscall(syscallContext, 'search.external', {
          query,
          limit: 5,
          timeoutMs: 8000,
          providers: ['tavily', 'exa'],
        }) as { results: Array<{ claim: string; evidence_excerpt: string; source_url: string }> }
        for (const r of results.results ?? []) {
          const titleMatch = r.claim.match(/\b([A-Z][A-Za-z0-9.]+(?:\s+\d+(?:\.\d+)*)?)/)
          if (!titleMatch) continue
          searchDetected.push({
            name: titleMatch[1],
            vendor: 'Unknown',
            vendorSlug: 'unknown',
            familySlug: 'model-family-unknown',
            source: 'search',
            announcementUrl: r.source_url,
            snippet: r.evidence_excerpt.slice(0, 200),
          })
        }
      } catch {
        // search failed, continue
      }
    }

    const candidates: DetectedModel[] = []
    for (const m of [...newBases, ...trendingHits]) {
      const info = extractVendorInfo(m.id)
      candidates.push({
        name: m.id.split('/').pop() ?? m.id,
        vendor: info.vendor,
        vendorSlug: info.vendorSlug,
        familySlug: info.familySlug,
        source: 'huggingface',
        hfId: m.id,
        hfUrl: `https://huggingface.co/${m.id}`,
        likes: m.likes,
        downloads: m.downloads,
        createdAt: m.createdAt,
        pipelineTag: m.pipeline_tag,
        snippet: `${m.id} — ${m.pipeline_tag ?? 'unknown'}, ${m.likes} likes, ${m.downloads} downloads`,
      })
    }

    const seenNames = new Set(candidates.map(c => c.name.toLowerCase()))
    for (const s of searchDetected) {
      if (!seenNames.has(s.name.toLowerCase())) {
        candidates.push(s)
        seenNames.add(s.name.toLowerCase())
      }
    }

    const skipped: string[] = []
    if (allHfModels.length > 0 && newBases.length === 0 && trendingHits.length === 0) {
      skipped.push(`HF: ${allHfModels.length} models scanned, none qualify as new base or trending`)
    }
    if (searchDetected.length === 0) {
      skipped.push('Search: no new model announcements found')
    }

    if (candidates.length === 0) {
      return { detected: 0, published: 0, skipped, commits: [] }
    }

    const maxPublish = Math.min(candidates.length, 3)
    const toPublish = candidates.slice(0, maxPublish)
    const existingOrder = await getMaxSeriesOrder(e.DB)
    const commits: ModelCardDigestOutput['commits'] = []

    for (const [i, model] of toPublish.entries()) {
      const seriesOrder = existingOrder + i + 1
      const frontmatter = buildFrontmatter(model, today, seriesOrder)
      const prompt = buildPrompt(model, today)

      const llmResult = await syscall(syscallContext, 'model.invoke', {
        config: { defaultProvider: 'groq', defaultModel: 'llama-3.3-70b-versatile' },
        stage: 'digest-model-card',
        messages: [
          { role: 'system', content: 'You are a technical writer for quidproquo.cc.' },
          { role: 'user', content: prompt },
        ],
        maxTokens: 3000,
      }) as { response: { content: string } }

      const body = String(llmResult.response.content ?? '')
      const modelSlug = `${model.vendorSlug}-${model.name}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
      const zhPath = `src/content/posts/daily/${today}-model-${modelSlug}.md`
      const zhContent = `${frontmatter}\n\n${body}\n`

      const commitResult = await syscall(syscallContext, 'knowledge.github.write', {
        sub: 'repo.tree.commit',
        owner: 'vincentxuu',
        repo: 'quidproquo',
        message: `post(daily): model card ${model.name}`,
        files: [{ path: zhPath, content: zhContent }],
      }) as { url: string; sha: string }

      commits.push({ model: model.name, sha: commitResult.sha, url: commitResult.url })
    }

    return { detected: candidates.length, published: commits.length, skipped, commits }
  },
})

async function getMaxSeriesOrder(db: D1Database): Promise<number> {
  const row = await db.prepare(`
    SELECT MAX(CAST(json_extract(series_json, '$.order') AS INTEGER)) AS max_order
    FROM posts
    WHERE json_extract(series_json, '$.name') = 'AI Model Tracker'
  `).first<{ max_order: number | null }>().catch(() => null)
  return row?.max_order ?? 0
}
