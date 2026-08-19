---
title: "RAG 可觀測性工具全景：2026 年的選擇"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, observability, langfuse, phoenix, langsmith, tracing, monitoring]
lang: zh-TW
tldr: "自己寫 trace 夠用，但開源工具讓你少做很多事。Langfuse、Phoenix、LangSmith 各有定位，選哪個取決於你對自架、開源、整合複雜度的取捨。"
description: "2026 年 RAG 可觀測性工具的比較：Langfuse、Phoenix（Arize）、LangSmith、Helicone，各自的強項、弱點，以及如何選擇。"
draft: false
series:
  name: "RAG 技法大全"
  order: 40
---

RAG 系統的可觀測性需求很明確：trace 每次查詢的執行過程、記錄 LLM 的輸入輸出、評估回答品質、找出問題集中在哪個步驟。

可以自己實作（上一篇講了 pipeline trace 的設計），也可以用現有工具。工具的好處是開箱即用的 UI、內建的評估功能、團隊協作支援；代價是多了一個外部依賴。

> **這篇不列功能對照表。** 這個領域每季都在變：本文初稿寫的時候，Phoenix 的賣點是 embedding 的 UMAP 視覺化，那個功能後來被整個移除了；Langfuse 的 JS SDK 從自訂 client 換成了 OpenTelemetry 基底，舊寫法直接不能用；Helicone 主推的整合路徑也換了一條。任何寫死在文章裡的功能矩陣和價格級距，讀者看到的時候大概都已經過期。所以下面只講**選擇的維度**和**各家的取捨與踩雷點**，功能清單和定價一律以官方頁面為準。

## 先決定「按什麼維度選」

在比工具之前，先回答四個問題，答案會直接砍掉一半選項：

1. **資料能不能離開你的基礎設施？** 有法遵或客戶合約限制的話，能自架這件事就是硬條件，直接篩掉純 SaaS。
2. **你打算被綁多深？** 用平台自家 SDK 埋點，換平台要重埋；用 OpenTelemetry 的 GenAI semantic conventions 埋點，換平台理論上只要換 exporter。現在主流平台都收 OTLP，所以這個選擇的成本比兩年前低很多。
3. **你要看的是「LLM 呼叫」還是「整條 RAG pipeline」？** 只想知道花了多少錢、用了多少 token，proxy 層的工具一行就搞定；想知道「為什麼這次搜尋只回三筆」，就必須在自己的程式碼裡埋 retrieval span，沒有捷徑。
4. **評估要跑在哪裡？** 有些團隊要的是線上抽樣 + LLM-as-Judge 打分回寫 trace，有些只需要離線跑 dataset 比較兩個版本。這兩件事各家的成熟度差很多。

下面每個工具，就按這四個維度來看。

## Langfuse

**定位**：LLM 應用的開源 Observability 平台，最受歡迎的自架選項。2026 年 1 月被 [ClickHouse 收購](https://clickhouse.com/blog/clickhouse-acquires-langfuse-open-source-llm-observability)，官方聲明維持開源與自架路線。

**核心功能**：Trace 視圖、session、評估框架（human annotation + LLM-as-Judge）、dataset 管理、prompt 版本管理。細節看[官方文件](https://langfuse.com/docs)，這裡只講會影響選型的部分。

**SDK 整合**：

> **JS/TS SDK 已經整個換掉了。** 舊的 `new Langfuse({...})` 再 `langfuse.trace()` / `trace.span()` 那套是 v2/v3 的 API。現在的 JS/TS SDK 是 v5，建在 OpenTelemetry 上：埋點用 `@langfuse/tracing` 的 `startObservation` / `startActiveObservation`，送資料用 `@langfuse/otel` 的 `LangfuseSpanProcessor` 掛進 OTel SDK。本文原稿的寫法在現行版本上不會動。

```typescript
// 1. 初始化（整個 process 一次）
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";

const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();
```

```typescript
// 2. 在 RAG pipeline 裡埋點
import {
  startActiveObservation,
  startObservation,
  updateActiveTrace,
} from "@langfuse/tracing";

await startActiveObservation("rag-query", async (root) => {
  root.update({ input: { query } });
  updateActiveTrace({ name: "rag-query", userId });

  const retrieval = startObservation(
    "hybrid-search",
    { input: { filter, topK } },
    { asType: "retriever" },
  );
  const results = await hybridSearch(query, filter, topK);
  retrieval.update({
    output: results,
    metadata: { cragTriggered: false },
  });
  retrieval.end();

  const generation = startObservation(
    "llm-generation",
    { input: messages },
    { asType: "generation" },
  );
  const answer = await generate(messages);
  generation.update({ output: answer });
  generation.end();

  root.update({ output: { answer, sources } });
});
```

`asType: "retriever"` 是重點：搜尋步驟被標成 retriever 之後，UI 會用適合看「查詢 → 命中文件」的版面呈現，而不是當成一段普通的 span。零結果和排序異常在這個視圖裡一眼就看得到。

**取捨**：
- 自架是一等公民，但**依賴不只 PostgreSQL**：現在一套自架至少要 web container、worker container、PostgreSQL、Redis/Valkey、ClickHouse，加上 S3 或相容的 blob storage。這比很多人以為的「跑個 docker compose」重不少，評估自架成本時要先看[官方的 infra 需求](https://langfuse.com/self-hosting/configuration/scaling)。
- License 是「核心 MIT、`ee/` 目錄另計」的混合模式，不是全部 MIT。要自架又在意授權範圍的話，這點要先看清楚。
- SDK 版本和 server 版本有相容性矩陣（JS/TS SDK v5 需要一定版本以上的 server），自架的人升級前要對一下。
- Prompt 版本管理是同類工具裡最完整的，這點沒變。

**適合**：需要資料留在自己基礎設施、重視 prompt 版本管理、而且願意扛一套多元件部署的團隊。

---

## Phoenix（Arize AI）

**定位**：Arize 的開放版 AI Observability，強調 tracing、評估和 dataset/experiment。

> **本文原稿最推薦它的理由已經不成立了。** 原稿把「embedding 的 UMAP 視覺化」寫成 Phoenix 的獨門賣點；那整塊功能（model inferences、dimensions、embeddings、pointcloud UI 和對應的 API）已經[在 2026 年初被移除](https://github.com/Arize-ai/phoenix/pull/11589)，UI 上不再有 `/model`、`/dimensions`、`/embeddings` 路由。如果你是為了 embedding cluster 分析而來，Phoenix 現在給不了；那個能力被收進 Arize 的商業產品線。

> **它也不是 Apache 2.0。** `arize-phoenix` 的授權是 **Elastic License 2.0**，屬於 source-available 而非 OSI 認定的開源。可以自架、可以看原始碼，但不能拿去做成競品託管服務。原稿寫「完全開源（Apache 2.0）」是錯的。

**現在的核心價值**：
- OpenTelemetry 原生：用 OpenInference 慣例埋點，跟 LlamaIndex、LangChain 這類框架的自動 instrumentation 最順
- 內建 RAG 評估（hallucination、QA correctness、relevance）跟 experiment 框架，適合把「改一個參數，跑一次 dataset 比分數」變成例行動作
- 可以完全跑在本機，開發階段不用先開帳號

**取捨**：
- Python 生態為主，TypeScript 這邊功能較少
- Prompt 管理較弱
- 授權限制如上

**適合**：Python 技術棧、想用 OTel/OpenInference 慣例埋點、評估與 experiment 是主要需求的場景。

---

## LangSmith

**定位**：LangChain 官方的 Observability 平台，與 LangChain / LangGraph 深度整合。

> **文件搬家了，環境變數也改名了。** LangSmith 文件現在在 `docs.langchain.com/langsmith`（舊的 `docs.smith.langchain.com` 會轉址）。開 tracing 的環境變數是 `LANGSMITH_TRACING` / `LANGSMITH_API_KEY`；舊的 `LANGCHAIN_TRACING_V2` / `LANGCHAIN_API_KEY` 目前還相容，但新文件一律用前者。

**整合方式**：

```bash
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY="<your-langsmith-api-key>"
```

用 LangChain / LangGraph 的話，設完就有 trace，不需要改程式碼。不用 LangChain 也可以，靠 `@traceable` 裝飾器和 provider wrapper 手動埋：

```python
from langsmith import traceable
from langsmith.wrappers import wrap_openai
import openai

client = wrap_openai(openai.Client())

@traceable(run_type="retriever", name="hybrid-search")
def retrieve(query: str):
    return hybrid_search(query)

@traceable
def rag_pipeline(query: str):
    context = retrieve(query)
    return client.chat.completions.create(...)
```

（原稿那段 `new RetrievalQAChain({...})` 的範例已經拿掉：那是舊版 LangChain JS 的類別，現在的建議寫法是 LCEL / `createRetrievalChain`，照抄舊寫法會找不到這個 export。）

**取捨**：
- 用 LangChain 技術棧時設定成本最低，Playground 和 annotation queue 對 prompt 迭代與人工標記很方便
- 閉源、資料在 LangChain 的伺服器（有自架方案但屬於企業合約範圍）
- 定價分級會變，這裡不列數字——要評估成本請直接看[官方定價頁](https://www.langchain.com/pricing)，並注意計費單位通常是 trace/span 數而不是使用者數，量大的 RAG pipeline 一次查詢可能就產生十幾個 span

**適合**：LangChain 技術棧、需要完整評估框架與人工標記流程的團隊。

---

## Helicone

**定位**：LLM API 層的 observability，最輕量的選擇。

> **整合路徑換了。** 原稿寫的是把 `baseURL` 指向 `https://oai.helicone.ai/v1` 再帶 `Helicone-Auth` header——那條路現在被官方文件歸類在「Legacy Integrations」。現行推薦是 AI Gateway：

```typescript
import { OpenAI } from "openai";

const client = new OpenAI({
  baseURL: "https://ai-gateway.helicone.ai",
  apiKey: process.env.HELICONE_API_KEY,
});

const response = await client.chat.completions.create({
  model: "gpt-4o-mini", // 換一個 model 字串就換供應商
  messages: [{ role: "user", content: "…" }],
});
```

**取捨**：
- 整合成本最低（改一行 baseURL），成本分析是同類工具中最詳細的
- 但它看不到 RAG 這一層：它只知道你打了幾次 LLM，不知道前面的搜尋回了幾筆、reranker 砍掉了什麼。**用它就等於放棄 pipeline trace**
- 走 gateway 等於把 LLM 流量的路徑交出去，多一個可用性依賴；這是它跟純 SDK 型工具最大的架構差異

**適合**：只需要監控 LLM 成本和基礎使用量、不需要深入 RAG trace 的場景。

---

## 其他也在名單上的

不展開，但評估時值得一起看：**Braintrust**（評估與 dataset 導向）、**W&B Weave**（跟既有 W&B 實驗追蹤整合）、**[OpenLLMetry](https://github.com/traceloop/openllmetry)**（一組 OpenTelemetry instrumentation，本身不是後端，可以把資料送去任何吃 OTLP 的地方）。

如果你還沒決定，先用 OpenTelemetry 的 [GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions-genai) 埋點是最不會後悔的做法——上面提到的平台幾乎都能收 OTLP，換後端的成本會落在設定而不是重寫程式碼。

## 如何選

**資料不能離開自家機房** → Langfuse。自架是一等公民，功能也最完整；代價是那套多元件部署要有人維護。

**Python 技術棧、重點在評估與 experiment** → Phoenix。OTel 原生、跟 LlamaIndex/LangChain 的自動 instrumentation 最順；注意授權是 Elastic 2.0，而且 embedding 視覺化已經沒有了。

**用 LangChain / LangGraph** → LangSmith。設定成本最低，annotation queue 對人工標記很順；閉源且按 trace 計費，量大要先算過。

**只需要成本監控，不想改程式碼** → Helicone。改一行 baseURL 就有成本報表，代價是完全看不到 RAG 那一層。

**還沒決定** → 先用 OpenTelemetry GenAI semantic conventions 埋點，後端晚點再挑。

**自己寫 trace** → 適合有特殊需求或想完整控制 trace 資料結構的場景。成本是要自己維護 UI 和查詢介面，但完全客製化。

NobodyClimb 的系統選擇了自訂 trace，主要原因是部署在 Cloudflare Workers（不能輕易跑外部 SDK 的 flush 機制），且 trace 資料需要和業務資料（攀岩路線、使用者資料）緊密整合。但如果是重新開始且沒有平台限制，Langfuse 會是第一個試的選項。

---

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [Langfuse Documentation](https://langfuse.com/docs)
- [Langfuse GitHub Repository](https://github.com/langfuse/langfuse)
- [Langfuse 自架的基礎設施需求](https://langfuse.com/self-hosting/configuration/scaling)
- [ClickHouse 宣布收購 Langfuse（2026-01）](https://clickhouse.com/blog/clickhouse-acquires-langfuse-open-source-llm-observability)
- [Phoenix (Arize AI) Documentation](https://arize.com/docs/phoenix)
- [Phoenix GitHub Repository](https://github.com/Arize-ai/phoenix)
- [Phoenix 移除 inferences / embeddings / pointcloud UI 的 PR](https://github.com/Arize-ai/phoenix/pull/11589)
- [LangSmith Documentation](https://docs.langchain.com/langsmith/observability)
- [LangSmith Tracing Quickstart](https://docs.langchain.com/langsmith/observability-quickstart)
- [Helicone Quickstart（AI Gateway）](https://docs.helicone.ai/getting-started/quick-start)
- [OpenLLMetry - OpenTelemetry for LLMs (GitHub)](https://github.com/traceloop/openllmetry)
- [OpenTelemetry GenAI Semantic Conventions](https://github.com/open-telemetry/semantic-conventions-genai)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
