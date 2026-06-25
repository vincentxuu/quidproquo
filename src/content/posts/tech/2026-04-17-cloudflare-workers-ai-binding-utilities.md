---
title: "Cloudflare Workers AI binding 全貌：不只是 run()"
date: 2026-04-17
type: guide
category: tech
tags: [cloudflare-workers-ai, cloudflare, rag, ai-gateway, tomarkdown]
lang: zh-TW
tldr: "env.AI 這個 binding 不是只有 run()。它還掛了 toMarkdown（文件轉 Markdown）、autorag（託管 RAG）、gateway（外部 provider 代理）、models（metadata 查詢）。認識這四組方法，才能在 Workers 上把 Cloudflare 當完整的 AI 平台用。"
description: "從 markdown.new 這個服務切入，拆解 Cloudflare Workers AI binding 上四組被忽略的內建方法：run、toMarkdown、autorag、gateway。附程式碼範例、決策表、限制。"
draft: false
---

🌏 [English version](/posts/tech/2026-04-17-cloudflare-workers-ai-binding-utilities-en)

最近看到 [markdown.new](https://markdown.new) — 丟任何檔案進去（PDF、DOCX、XLSX、圖片、網頁），吐出 LLM 友善的 Markdown，免費、不用註冊。拆開一看，核心其實就是一行 `env.AI.toMarkdown()`。

這讓我意識到：Cloudflare Workers AI 的 `env.AI` binding 被多數教學窄化成「就是呼叫 `run()` 跑模型」，但實際上它上面掛了好幾組 managed utility — 很多時候你根本不用自己寫 RAG、不用自己解 PDF、不用自己接 OpenAI API。

這篇把 `env.AI` 上被忽略的工具一次梳理。

## binding 的心智模型

前情提要：[Cloudflare Workers 透過 Bindings 接服務](/posts/tech/2026-03-27-cloudflare-workers-edge-compute) — `D1Database`、`KVNamespace`、`R2Bucket`、`Ai` 等等。`Ai` 這個 binding 宣告後，`env.AI` 就出現在 Worker 裡。

大部分教學到這裡就跳去 `env.AI.run("@cf/meta/llama-3")` 做 LLM 推論。但 binding 物件本身其實長這樣：

```
env.AI
├── run(model, input, options?)       ← 直接叫模型做推論
├── toMarkdown(files, options?)       ← 文件轉 Markdown pipeline
├── autorag(name)                     ← 託管 RAG（現已更名 AI Search）
├── gateway(name)                     ← AI Gateway：統一代理外部 provider
└── models()                          ← 列出目錄裡所有可用模型
```

把它想成：`run()` 是低階原語，其他三個是 Cloudflare 已經幫你組好的 pipeline。

## 1. `run()` — 模型推論入口

這個大家最熟：

```typescript
// 文字生成
await env.AI.run("@cf/google/gemma-3-12b-it", {
  messages: [
    { role: "system", content: "你是繁中助手" },
    { role: "user", content: "解釋 V8 Isolate" },
  ],
  stream: true,
});

// Embedding（for RAG）
await env.AI.run("@cf/baai/bge-m3", { text: ["要嵌入的段落"] });

// 語音轉文字
await env.AI.run("@cf/openai/whisper", { audio: [...bytes] });

// 圖片生成
await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
  prompt: "a calico cat on a skateboard",
});
```

`run()` 是「給我一個模型 ID、我丟 input、你吐 output」。選模型、寫 prompt、組 pipeline 都是你的事。

關於繁中模型怎麼挑，另一篇寫過：[Gemma 3 on Cloudflare Workers AI](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai)。

## 2. `toMarkdown()` — 文件轉檔 pipeline

**markdown.new 的核心就是它**。宣告只要在 wrangler 裡加 AI binding：

```jsonc
// wrangler.jsonc
{
  "ai": { "binding": "AI" }
}
```

一行呼叫：

```typescript
const docs = await env.AI.toMarkdown([
  { name: "report.pdf",   blob: pdfBlob },
  { name: "slide.pptx",   blob: pptxBlob },
  { name: "photo.jpg",    blob: imageBlob },
  { name: "sheet.xlsx",   blob: excelBlob },
]);

// docs[i] = {
//   name: "report.pdf",
//   mimeType: "application/pdf",
//   format: "markdown",
//   tokens: 1523,
//   data: "# Report Title\n\n..."
// }
```

### 內部怎麼處理

Cloudflare 依 MIME 自動分派：

| 格式 | 處理方式 |
|---|---|
| PDF | 文字抽取 + 結構保留（標題、列表、表格） |
| DOCX / PPTX / XLSX / ODT | Office 解析器 → MD 表格 + 段落 |
| HTML / 網頁 | DOM 清洗，去掉 `script` / `style` / 廣告 |
| 圖片（PNG / JPG / WebP） | 視覺模型做 caption + OCR |
| CSV / JSON / XML | 轉 MD 表格或 code block |

你不用自己裝 pdf.js、mammoth、tesseract。多數格式**免費**，圖片描述因為走視覺模型會計費。

### 可選的 conversionOptions

```typescript
await env.AI.toMarkdown(files, {
  image: { language: "zh-TW" },        // 圖片描述用繁中
  html:  { selector: "article" },      // 只抽取 article 區塊
  pdf:   { excludeMetadata: true },    // 不要 PDF metadata
});
```

### 限制

- 單檔 **10 MB**
- URL fetch timeout **30 秒**
- 想知道支援哪些副檔名：`await env.AI.toMarkdown().supported()`

### 為什麼「省 80% Token」

把 HTML 的 script、style、navigation、廣告、追蹤碼全部拿掉，只留語義結構。同一個網頁餵 LLM，raw HTML vs. 乾淨 Markdown 的 token 數差距輕易 5 倍以上。做 RAG 爬蟲或 agent 餵料，這省下來的是**真錢**。

## 3. `autorag()` — 託管 RAG（AI Search）

RAG 自己蓋過的人知道痛：chunking、embedding、寫入 vector DB、query rewrite、retrieve、rerank、組 prompt、串串流 ⋯⋯ 每一步都有坑。[RAG patterns 完整指南](/posts/ai/2026-03-14-rag-patterns-complete-guide) 裡把這些寫過一輪。

AutoRAG（現在叫 **AI Search**）是 Cloudflare 把這整條 pipeline 託管起來：你把文件丟 R2，它自動 chunk、embed、存進 Vectorize，查詢一行。

```typescript
// 建立 AutoRAG instance 之後
const rag = env.AI.autorag("my-rag");

// 「檢索 + 生成」一條龍
const response = await rag.aiSearch({
  query: "什麼是 V8 Isolate？",
});
// response.response 是生成答案，response.data 是引用的 chunks

// 只要檢索結果（自己組 prompt）
const hits = await rag.search({
  query: "V8 Isolate",
  max_num_results: 5,
});
```

適用場景：**文件不常變、不想自己維護 pipeline、可接受 Cloudflare 的預設 chunking 策略**。如果你需要客製 chunk 大小、hybrid search、query rewriting 這些精細控制，還是自己組（參考 [NobodyClimb RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)）。

近期更新：AI Search 已經可以透過綁 AI Gateway 用 OpenAI / Anthropic 的模型生成，不限於 Cloudflare 目錄內模型。

## 4. `gateway()` — AI Gateway 代理

你可能同時用 OpenAI、Anthropic、Google Gemini。每家 SDK、計費、log、rate limit 都不一樣。AI Gateway 是 Cloudflare 把它們**統一代理**的中間層：

- 統一 log（每次呼叫、cost、latency、prompt、response）
- 統一 cache（同樣 prompt 不重複付錢）
- 統一 rate limit、retry、fallback
- 可以在 dashboard 切換 provider，不用改程式

從 Worker 裡用：

```typescript
const gw = env.AI.gateway("my-gateway");

// 撈某次呼叫的完整 log
const log = await gw.getLog("log-id-xxx");

// 取 gateway 的 endpoint URL（用來餵給 OpenAI SDK 的 baseURL）
const url = await gw.getUrl("openai");

// Universal endpoint：同一個 request 可指定 provider + fallback
await gw.run([
  { provider: "openai",    endpoint: "chat/completions", ... },
  { provider: "anthropic", endpoint: "messages",         ... }, // 第一個掛掉的 fallback
]);
```

這裡有個心智模型：
- **`env.AI.run()`** = 跑 Cloudflare 自家目錄模型
- **`env.AI.gateway().run()`** = 透過 Cloudflare 代理呼叫**外部**模型

可以同時用：產品主線走 Workers AI（便宜、同機房），對品質要求極高的少數步驟（例如 `llm-as-judge`）才打 OpenAI、走 Gateway 拿到 log 與 cache。

## 5. `models()` — metadata 查詢

少人用但偶爾有用：

```typescript
const list = await env.AI.models();
// 列出目錄裡所有模型、task、pricing 等 metadata
```

適合做「自動挑模型」的場景：例如跑程式碼時動態選當下最新的 llama 版本。

## 決策表：該用哪一個

| 需求 | 用哪個 |
|---|---|
| 丟 prompt、拿 completion | `run()` |
| 產 embedding | `run()` with embedding model |
| PDF / DOCX / 網頁 → Markdown | `toMarkdown()` |
| 有一批 R2 文件，要做問答 | `autorag()` / AI Search |
| 要用 OpenAI / Anthropic，想要統一 log / cache | `gateway()` |
| 想混用自家 + 外部模型 | `run()` + `gateway()` 並用 |
| 程式動態挑模型 | `models()` |

## 這個部落格的例子

我在這個 [quidproquo 部落格](/posts/product/2026-03-12-quidproquo-blog-from-scratch) 的 `wrangler.jsonc` 已經宣告了 `AI` + `VECTORIZE_INDEX` + `R2_IMAGES` 三個 binding。目前只用 `run()` 做 embedding 和文章語義搜尋，其他三組方法都還沒動。

幾個自然的延伸：

1. **外部文件爬蟲** — `src/lib/crawl/` 下已有爬蟲設定，把抓到的 HTML 過一次 `toMarkdown()` 再 chunk，可以大幅降低後續 embedding 的 token 成本
2. **AI Search** — 把 `src/content/posts/` 同步到 R2，接 `autorag()` 做問答 bot，不用自己重刻 [chatbot pipeline](/posts/ai/2026-03-13-chatbot-development-guide)
3. **Gateway** — 如果要做 `llm-as-judge` 評估答案品質，走 Claude 或 GPT-4 會比 Workers AI 目錄內的模型準，透過 Gateway 統一走

## 限制與取捨

**共通限制：**

- Workers 的 [CPU time / wall time 限制](/posts/tech/2026-03-27-cloudflare-workers-edge-compute) 仍適用
- 模型版本不透明 — Cloudflare 管理 checkpoint，你不能 pin 版本
- 沒有 fine-tuning — 領域適應只能靠 prompt + RAG

**`toMarkdown` 特有：**

- 10 MB 檔案上限
- 圖片描述會計費（走視覺模型）
- PDF OCR 對掃描件效果普通，印刷版 PDF OK

**`autorag` 特有：**

- Chunking 策略固定，想客製就不要用這個
- 跟自組 pipeline 比，多一層黑盒

**`gateway` 特有：**

- 外部 provider 的 API key 仍要自備，Gateway 只是代理
- Cache 預設關閉，要自己開

## 小結

`env.AI` 不是 `run()` 的別名。它是**一個 AI 平台的入口**：

- 要跑模型 → `run()`
- 要清資料 → `toMarkdown()`
- 要做問答 → `autorag()`
- 要接外部 → `gateway()`

下次寫 AI 功能前先問：這件事有沒有 managed 版本？很多時候答案是有，而且就掛在 `env.AI.` 下。

## 參考資料

- [Cloudflare Workers AI 官方文件](https://developers.cloudflare.com/workers-ai/)
- [Workers AI Bindings 參考](https://developers.cloudflare.com/workers-ai/configuration/bindings/)
- [Markdown Conversion（toMarkdown）](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/)
- [toMarkdown Workers Binding Usage](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/usage/binding/)
- [AI Search（原 AutoRAG）Workers Binding](https://developers.cloudflare.com/ai-search/usage/workers-binding/)
- [AI Gateway Worker Binding Methods](https://developers.cloudflare.com/ai-gateway/integrations/worker-binding-methods/)
- [Cloudflare Workers：V8 Isolate 基礎](/posts/tech/2026-03-27-cloudflare-workers-edge-compute)
- [Gemma 3 on Cloudflare Workers AI：繁中模型選型](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai)
- [RAG Patterns 完整指南](/posts/ai/2026-03-14-rag-patterns-complete-guide)
- [markdown.new](https://markdown.new) — 本文靈感來源
