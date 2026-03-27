---
title: "Langfuse 完整指南：LLM 應用的可觀測性從零開始"
date: 2026-03-26
category: ai
tags: [langfuse, observability, tracing, llm, prompt-management, evaluation, monitoring]
lang: zh-TW
tldr: "Langfuse 是目前最成熟的開源 LLM Observability 平台。這篇從 Tracing、Prompt 管理、評估、Dataset 四個核心功能切入，帶你搞清楚它在實際專案中怎麼用。"
description: "Langfuse 完整使用指南：從安裝設定到 Tracing、Prompt 版本管理、Evaluation 評估框架、Dataset 回歸測試，涵蓋 TypeScript/Python SDK 整合與實戰範例。"
draft: false
---

你開始上線一個 LLM 應用之後，馬上會遇到一連串問題：用戶反映回答品質變差了，但你不知道是 prompt 改壞了還是 retrieval 出問題；token 費用暴漲，但不知道是哪個功能在燒錢；想改善回答品質，但沒有系統化的方式衡量改善效果。

這些問題的共同根源是：**你看不見 LLM 應用內部發生了什麼事**。

Langfuse 就是解決這件事的工具。

---

## Langfuse 是什麼

Langfuse 是一個**開源的 LLM Observability 平台**，專門為 LLM 應用設計的監控和分析工具。它不是通用的 APM（像 Datadog 或 New Relic），而是針對 LLM 應用的特殊需求：追蹤 prompt 的輸入輸出、計算 token 成本、管理 prompt 版本、評估回答品質。

核心功能四個：

1. **Tracing** — 追蹤每次 LLM 呼叫的完整執行過程
2. **Prompt Management** — 版本化管理 prompt，支援 A/B 測試
3. **Evaluation** — 自動化和人工的品質評估框架
4. **Datasets** — 收集真實查詢做回歸測試

可以用 Langfuse Cloud（免費方案就能用），也可以完全自架（Docker Compose 或 Kubernetes）。

---

## 安裝與設定

### Cloud 版本

最快的開始方式。到 [cloud.langfuse.com](https://cloud.langfuse.com) 註冊帳號，建立專案後會拿到兩把 key：

```bash
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_BASEURL=https://cloud.langfuse.com
```

### 自架版本

用 Docker Compose 起一個完整環境：

```bash
# 克隆官方 repo
git clone https://github.com/langfuse/langfuse.git
cd langfuse

# 啟動（包含 PostgreSQL 和 Langfuse server）
docker compose up -d
```

自架的完整架構包含：Web container（UI/API）、Worker container（非同步事件處理）、PostgreSQL、ClickHouse（OLAP，用於 trace 和 score 的分析查詢）、Redis（快取/佇列）、S3/Blob Store。

自架的好處是資料完全在自己手上，適合有合規需求的團隊（GDPR、資料落地）。代價是要維護這些基礎設施。Docker Compose 適合測試，正式環境建議用 Kubernetes。

### SDK 安裝

```bash
# TypeScript / Node.js（v4 基於 OpenTelemetry）
npm install langfuse @langfuse/openai          # 核心 + OpenAI wrapper
npm install @langfuse/langchain                # LangChain 整合（選用）
npm install @langfuse/vercel                   # Vercel AI SDK 整合（選用）

# Python
pip install langfuse
```

> **注意**：TypeScript SDK v4 重新架構在 OpenTelemetry 之上，如果你是從 v3 升級，API 有些變化。下面的範例以 v3 風格為主（目前大多數專案仍在使用），但也會標注 v4 的寫法。

---

## Tracing：看見每次呼叫發生了什麼

Tracing 是 Langfuse 最核心的功能。每次用戶發送一個請求，你的 LLM 應用背後可能做了很多事：查資料庫、呼叫 embedding API、做 retrieval、呼叫 LLM 生成回答。Tracing 把這些步驟全部記錄下來，讓你事後可以逐步檢視。

### 基本概念

Langfuse 的 trace 由三種元素組成：

- **Trace**：一次完整的請求（例如用戶的一個問題）
- **Span**：trace 內的一個步驟（例如「向量搜尋」或「重排序」）
- **Generation**：一次 LLM 呼叫（自動記錄 input/output/token usage/latency）

它們的關係是樹狀結構：一個 Trace 底下有多個 Span，Span 底下可以有子 Span 或 Generation。

### TypeScript SDK 範例

```typescript
import Langfuse from "langfuse";

const langfuse = new Langfuse({
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  baseUrl: process.env.LANGFUSE_BASEURL,
});

async function handleUserQuery(query: string, userId: string) {
  // 建立一個 trace，代表一次完整的用戶請求
  const trace = langfuse.trace({
    name: "rag-query",
    input: { query },
    userId,
    metadata: { environment: "production" },
  });

  // 記錄 retrieval 步驟
  const retrievalSpan = trace.span({
    name: "vector-search",
    input: { query, topK: 10 },
  });

  const documents = await vectorSearch(query, 10);

  retrievalSpan.end({
    output: { documentCount: documents.length },
    metadata: { index: "main-knowledge-base" },
  });

  // 記錄 reranking 步驟
  const rerankSpan = trace.span({
    name: "rerank",
    input: { documentCount: documents.length },
  });

  const reranked = await rerank(query, documents);

  rerankSpan.end({
    output: { topScore: reranked[0]?.score },
  });

  // 記錄 LLM 生成（用 generation 而不是 span）
  const generation = trace.generation({
    name: "answer-generation",
    model: "gpt-4o",
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: buildPrompt(query, reranked) },
    ],
  });

  const answer = await callLLM(query, reranked);

  generation.end({
    output: answer,
    usage: {
      input: answer.promptTokens,
      output: answer.completionTokens,
    },
  });

  // 更新 trace 的最終輸出
  trace.update({
    output: { answer: answer.text },
  });

  // 確保資料送出
  await langfuse.flushAsync();

  return answer.text;
}
```

在 Langfuse Dashboard 裡，你可以點開任何一個 trace，看到完整的呼叫樹：每個步驟花了多久、LLM 收到什麼 prompt、回了什麼、用了多少 token。

### 用 OpenAI SDK wrapper 更簡單

如果你的應用主要就是呼叫 OpenAI API，Langfuse 提供了一個 wrapper，幾乎不用改程式碼：

```typescript
import OpenAI from "openai";
import { observeOpenAI } from "@langfuse/openai";

const openai = observeOpenAI(new OpenAI(), {
  generationName: "chat-completion",
  sessionId: "session-123",
  userId: "user-abc",
  tags: ["production"],
});

// 像平常一樣呼叫，trace 自動產生
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "什麼是 RAG？" }],
});
```

這是整合成本最低的方式。所有 `chat.completions.create` 呼叫都會自動被記錄成 generation，包含完整的 input/output 和 token usage。

### Python Decorator 方式

Python SDK 提供了 `@observe` decorator，特別優雅：

```python
from langfuse.decorators import observe, langfuse_context

@observe()
def rag_pipeline(query: str):
    documents = retrieve(query)
    answer = generate(query, documents)
    return answer

@observe()
def retrieve(query: str):
    # 這個函數會自動變成 trace 裡的一個 span
    results = vector_db.search(query, top_k=10)
    return results

@observe(as_type="generation")
def generate(query: str, documents: list):
    # 這個函數會記錄成 generation
    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[...],
    )
    # 手動更新 token usage
    langfuse_context.update_current_observation(
        usage={
            "input": response.usage.prompt_tokens,
            "output": response.usage.completion_tokens,
        }
    )
    return response.choices[0].message.content
```

加上 `@observe()` decorator，函數的呼叫關係會自動還原成 trace 的樹狀結構，不需要手動管理 span 的父子關係。

---

## Prompt Management：版本化你的 prompt

很多團隊管理 prompt 的方式是寫在程式碼裡，改 prompt 就改程式碼、重新部署。這樣的問題是：

- 改 prompt 要走完整的 CI/CD 流程
- 不知道哪個版本的 prompt 效果最好
- 無法快速 rollback 到之前的版本

Langfuse 的 Prompt Management 把 prompt 從程式碼中抽離出來，在 Dashboard 上管理。

### 建立和使用 prompt

在 Langfuse Dashboard 上建立一個 prompt，例如叫做 `rag-system-prompt`：

```
你是一個技術助手。根據以下參考文件回答用戶問題。
如果參考文件中沒有相關資訊，請明確告知用戶你無法回答。

參考文件：
{{context}}

用戶問題：
{{query}}
```

程式碼裡這樣取用：

```typescript
// 從 Langfuse 取得最新的 prompt
const prompt = await langfuse.getPrompt("rag-system-prompt");

// 填入變數
const compiled = prompt.compile({
  context: documents.map((d) => d.content).join("\n\n"),
  query: userQuery,
});

// 呼叫 LLM
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: compiled }],
});
```

### 版本管理與標籤

每次在 Dashboard 上修改 prompt，Langfuse 會自動建立新版本。你可以：

- 用 **標籤**（label）標記版本：`production`、`staging`、`latest`
- 程式碼裡指定要用哪個標籤的版本：

```typescript
// 取得 production 標籤的版本
const prompt = await langfuse.getPrompt("rag-system-prompt", undefined, {
  label: "production",
});
```

這樣的好處是，你可以在 Dashboard 上修改 prompt、測試、確認效果好了，再把 `production` 標籤移到新版本——不需要重新部署程式碼。

### Prompt 的 A/B 測試

結合 Evaluation 功能，可以做 prompt 的 A/B 測試：

1. 建立兩個版本的 prompt
2. 程式碼裡隨機選用不同版本
3. 用 Evaluation 比較兩個版本的回答品質

```typescript
// 隨機取用不同版本
const version = Math.random() > 0.5 ? 1 : 2;
const prompt = await langfuse.getPrompt("rag-system-prompt", version);

// 在 trace 裡記錄用了哪個版本
trace.update({
  metadata: { promptVersion: version },
});
```

在 Dashboard 上可以按 prompt version 篩選 trace，比較不同版本的表現。

---

## Evaluation：衡量回答品質

知道 LLM 回了什麼是第一步，知道它回答得**好不好**才是關鍵。Langfuse 提供三種評估方式：

### 1. 手動評分（Human Annotation）

最直接的方式。在 Dashboard 上瀏覽 trace，對每個回答打分：

- 設定評分維度：例如 `correctness`（0-1）、`helpfulness`（0-5）、`hallucination`（boolean）
- 團隊成員可以分工標記
- 標記結果會和 trace 關聯，事後可以分析趨勢

適合早期階段或高風險場景（例如醫療、法律），需要人工確認品質。

### 2. 用戶回饋

把用戶的回饋（按讚/倒讚、評分）回傳給 Langfuse：

```typescript
// 用戶按了「有幫助」
langfuse.score({
  traceId: currentTraceId,
  name: "user-feedback",
  value: 1,
  comment: "用戶按了讚",
});
```

這是最有價值的訊號——畢竟用戶覺得好不好才是真正重要的。

### 3. LLM-as-Judge 自動評估

用另一個 LLM 來評估回答品質，適合大規模自動化評估：

```typescript
// 在 Langfuse Dashboard 設定 Evaluator
// 或用 SDK 手動送分數

async function evaluateWithLLM(
  query: string,
  answer: string,
  context: string,
  traceId: string
) {
  const evalResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `你是一個評估助手。根據以下標準評估回答品質：
1. 正確性（0-1）：回答是否與參考文件一致
2. 完整性（0-1）：是否回答了問題的所有面向
3. 幻覺（0 或 1）：是否包含參考文件中沒有的資訊

回傳 JSON 格式：{"correctness": 0.9, "completeness": 0.8, "hallucination": 0}`,
      },
      {
        role: "user",
        content: `問題：${query}\n參考文件：${context}\n回答：${answer}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const scores = JSON.parse(evalResponse.choices[0].message.content);

  // 把分數送回 Langfuse
  for (const [name, value] of Object.entries(scores)) {
    langfuse.score({
      traceId,
      name,
      value: value as number,
    });
  }
}
```

Langfuse 也有內建的 Evaluator 功能，可以在 Dashboard 上設定評估模板，針對新的 trace 自動執行評估，不需要在應用程式碼裡寫評估邏輯。

---

## Datasets：回歸測試你的 pipeline

每次改 prompt、換模型、調整 retrieval 參數，你需要知道「改完之後有沒有變好」。Langfuse Datasets 讓你建立一組標準測試集，每次修改後重跑，比較結果。

### 建立 Dataset

可以從 Dashboard 手動建立，也可以從現有的 trace 裡挑選：

```typescript
// 從程式碼建立 dataset
const dataset = await langfuse.createDataset({
  name: "rag-golden-set",
  description: "50 個經過人工驗證的 QA pair",
});

// 新增 dataset item
await langfuse.createDatasetItem({
  datasetName: "rag-golden-set",
  input: { query: "什麼是 vector database？" },
  expectedOutput: {
    answer: "Vector database 是一種專門儲存和檢索高維向量的資料庫...",
  },
  metadata: { difficulty: "easy", category: "concepts" },
});
```

更常見的做法是在 Dashboard 上，把表現好的 trace 直接加入 dataset——用真實的用戶問題作為測試集比自己編的更貼近實際。

### 跑回歸測試

```typescript
const dataset = await langfuse.getDataset("rag-golden-set");

for (const item of dataset.items) {
  // 對每個測試案例跑你的 pipeline
  const trace = langfuse.trace({
    name: "regression-test",
  });

  const result = await ragPipeline(item.input.query);

  trace.update({ output: { answer: result } });

  // 把這次 run 連結到 dataset item
  await item.link(trace, "experiment-v2-new-prompt");

  // 自動評估
  langfuse.score({
    traceId: trace.id,
    name: "exact-match",
    value: result === item.expectedOutput.answer ? 1 : 0,
  });
}

await langfuse.flushAsync();
```

在 Dashboard 上，你可以按 experiment name 比較不同版本的結果：哪些案例變好了、哪些變差了、整體分數趨勢如何。

---

## Sessions：追蹤多輪對話

如果你的應用有多輪對話，可以用 session 把相關的 trace 串在一起：

```typescript
const sessionId = `session-${Date.now()}`;

// 第一輪
const trace1 = langfuse.trace({
  name: "chat-turn",
  sessionId,
  input: { message: "什麼是 RAG？" },
});

// 第二輪（同一個 sessionId）
const trace2 = langfuse.trace({
  name: "chat-turn",
  sessionId,
  input: { message: "它和 fine-tuning 有什麼差別？" },
});
```

在 Dashboard 上可以按 session 瀏覽，看到完整的多輪對話歷史和每一輪的 trace 細節。

---

## 成本追蹤

Langfuse 會根據 generation 記錄的 model 和 token usage 自動計算費用。Dashboard 上可以看到：

- **按時間**的費用趨勢
- **按模型**的費用分布（GPT-4o vs Claude vs 其他）
- **按用戶**的費用（找出高用量用戶）
- **按功能**的費用（哪個 trace name 最燒錢）

不需要額外設定，只要 generation 裡有記錄 model 和 token usage，費用就會自動算出來。Langfuse 內建主流模型（OpenAI、Anthropic、Gemini 等）的定價資料，如果你用的是自架模型或 fine-tuned 模型，也可以在 Dashboard 上自訂定價。

支援的 token 類型包括：`input_tokens`、`output_tokens`、`cached_tokens`、`reasoning_tokens`、`image_tokens` 等，能精確追蹤不同類型的消耗。

---

## 框架整合

Langfuse 不只有低階 SDK，也和主流框架有現成的整合：

### LangChain

```typescript
import { CallbackHandler } from "@langfuse/langchain";

const langfuseHandler = new CallbackHandler({
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  baseUrl: process.env.LANGFUSE_BASEURL,
});

// 把 handler 傳給 LangChain，所有呼叫自動被 trace
const result = await chain.invoke(
  { query: "什麼是 RAG？" },
  { callbacks: [langfuseHandler] }
);
```

### Vercel AI SDK

透過 OpenTelemetry exporter 整合，在 `generateText`、`streamText` 等函數中啟用 telemetry：

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// 啟用 telemetry，Langfuse 透過 OTEL exporter 接收
const { text } = await generateText({
  model: openai("gpt-4o"),
  prompt: "什麼是 RAG？",
  experimental_telemetry: {
    isEnabled: true,
    functionId: "rag-answer",
    metadata: {
      sessionId: "session-123",
      userId: "user-abc",
      tags: ["production"],
    },
  },
});
```

搭配 `@langfuse/vercel` 的 `LangfuseExporter` 設定 OpenTelemetry，就能自動把所有 Vercel AI SDK 呼叫送到 Langfuse。支援所有 AI SDK provider（OpenAI、Anthropic、Google、Mistral 等）。

### LlamaIndex

```python
from llama_index.core import Settings
from llama_index.core.callbacks import CallbackManager
from langfuse.llama_index import LlamaIndexCallbackHandler

langfuse_handler = LlamaIndexCallbackHandler()
Settings.callback_manager = CallbackManager([langfuse_handler])

# 之後所有 LlamaIndex 操作自動 trace
```

---

## 實際使用的工作流程

把上面的功能串起來，一個典型的 Langfuse 使用流程是這樣的：

**開發階段**：
1. 在程式碼裡加上 tracing，把每次 LLM 呼叫記錄下來
2. 在 Dashboard 上檢查 trace，找到品質不好的回答
3. 分析原因（prompt 不好？retrieval 沒找到對的文件？）
4. 修改 prompt（在 Prompt Management 裡改，不用重新部署）
5. 把品質好的 trace 加入 Dataset 作為測試集

**上線後**：
1. 收集用戶回饋（讚/倒讚），送到 Langfuse
2. 設定 LLM-as-Judge 自動評估新的 trace
3. 在 Dashboard 上監控品質趨勢和成本
4. 發現問題時，用 trace 快速定位根因
5. 改完後用 Dataset 跑回歸測試，確認改善效果

**迭代優化**：
1. 想換模型？用 Dataset 跑兩個模型的結果，比較分數
2. 想改 prompt？在 Prompt Management 建新版本，A/B 測試
3. 想調整 retrieval？比較不同參數下的 trace 表現

---

## 該用 Langfuse 嗎？

**適合用的情況**：
- 你的 LLM 應用已經上線或即將上線
- 團隊有多人協作，需要共享的可觀測性工具
- 有合規需求，資料需要留在自己的基礎設施（自架）
- 需要系統化的品質評估，而不是靠感覺

**不需要用的情況**：
- 個人 side project，console.log 就夠了
- 只是呼叫一次 LLM API，沒有複雜的 pipeline
- 部署環境有限制，不能跑外部 SDK 的 flush 機制（例如 Cloudflare Workers 的某些場景）

**和其他工具的差異**：
- 比 LangSmith 更開放——開源可自架，不綁定 LangChain
- 比 Phoenix 的 TypeScript 支援更好
- 比 Helicone 的 trace 深度更深——不只看到 LLM 呼叫，還能看到整個 pipeline

如果你正在認真做一個 LLM 應用，Langfuse 值得花一個下午設定起來。看得見問題，才能修好問題。

---

## 參考資料

- [Langfuse 官方文件](https://langfuse.com/docs)
- [Langfuse GitHub](https://github.com/langfuse/langfuse)
- [Langfuse Cloud](https://cloud.langfuse.com)
- [Langfuse Cookbook（整合範例集）](https://langfuse.com/guides/cookbook)
- [Langfuse TypeScript SDK](https://www.npmjs.com/package/langfuse)
- [Langfuse Python SDK](https://pypi.org/project/langfuse/)
