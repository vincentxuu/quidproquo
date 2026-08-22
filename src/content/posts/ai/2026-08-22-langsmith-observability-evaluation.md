---
title: "LangSmith 深入介紹：從 Agent Trace 到離線與線上評估"
date: 2026-08-22
category: ai
type: deep-dive
tags: [langsmith, llm-observability, tracing, evaluation, llmops, ai-agent]
lang: zh-TW
tldr: "LangSmith 把 LLM 應用拆成 project、trace、run 與 thread，再用 dataset、evaluator 與 experiment 把 production 問題送回離線回歸測試；它可觀測任何 LLM 應用，不要求使用 LangChain。"
description: "說明 LangSmith 的 trace 資料模型、Python instrumentation、feedback 與 metadata、離線和線上 evaluation、資料治理、自架架構及適用邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-langsmith-observability-evaluation-en)

[LangSmith](https://docs.langchain.com/langsmith/observability-concepts) 是 LangChain 團隊提供的 LLM 應用觀測與評估平台。它記錄的不只是單次模型 request，而是一次操作中的模型、retrieval、tool call、程式步驟與巢狀關係，因此特別適合除錯 RAG 與 agent workflow。

名字容易讓人誤會：使用 LangChain 或 LangGraph 時可以自動 tracing，但 LangSmith 並不要求應用採用那些框架。Python、TypeScript 或其他服務都能用 SDK、wrapper、OpenTelemetry 或手動 instrumentation 上傳 traces。

這篇沿著「production 問題如何變成可重跑測試」的主脊展開：先把一次操作建成 trace，再補 metadata 與 feedback，從失敗案例建立 dataset，最後用 offline experiment 驗證修正並用 online evaluator 監控。這是 LangSmith 和 proxy-first 的 Helicone、gateway-first 的 LiteLLM／Portkey 最根本的差異。

## Project、trace、run、thread 各自回答不同問題

依[官方觀測概念](https://docs.langchain.com/langsmith/observability-concepts)，project 是一組 traces 的容器；trace 代表一次端到端操作；run 是 trace 裡的一個步驟；thread 則把多次互動串成持續對話。混用這四層，dashboard 就會從除錯工具變成一堆無法比較的 log。

```text
Project: support-agent-production
└── Thread: conversation-8f2a
    ├── Trace: user turn 1
    │   ├── Run: classify intent
    │   ├── Run: retrieve documents
    │   ├── Run: call tool
    │   └── Run: generate answer
    └── Trace: user turn 2
```

Project 建議按環境與應用分，例如 `support-agent-staging`，不要每天建一個新 project。Trace 對應使用者感知的一次操作；run 則對應你想分別量測或評估的步驟。Thread ID 由可信任的後端產生，不能直接塞 email 或存取權杖。

## 先追出邊界，再追每一行程式

LangSmith SDK 提供 `traceable` decorator。從外層 workflow 開始，再替 retrieval、tool 或 model wrapper 加子 run；一開始就把每個 helper 都 trace，通常只會增加噪音與費用。

```python
import os
from langsmith import traceable

os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_PROJECT"] = "support-agent-staging"

@traceable(name="support-agent")
def answer_question(question: str) -> str:
    documents = retrieve(question)
    return generate(question, documents)
```

一條有用的 trace 至少要能回答：輸入是什麼、走了哪些步驟、在哪一步失敗、總延遲與模型用量是多少、最後輸出是什麼。若 instrumentation 只包住最外層，查不到瓶頸；若每個字串處理都成為 run，真正的 tool error 又會被淹沒。

對背景工作與串流，還要確認 trace flush 時機。程序結束太快、serverless instance 被凍結或 exporter queue 滿了，都可能讓應用成功但 trace 不完整。部署後用一個可辨識的測試 request，核對預期 run 數量與父子關係，不要把「SDK 沒報錯」當成 tracing 已正確。

## Metadata、tag 與 feedback 是查詢契約

Trace 若沒有版本和產品脈絡，只能逐筆看。每次部署至少附上 environment、release SHA、prompt version、model alias 與 feature；這些欄位讓你比較「改 prompt 前後」或「只有某版本出錯」，也能在建立 dataset 時精準篩選。

Metadata 同樣不是秘密區。租戶識別可用不可逆代碼，文件內容與個資則先遮罩。若 prompt／response 本身不能離開環境，應關閉內容紀錄、採樣，或評估 self-hosted，而不是先全量送出再寄望日後刪除。

Feedback 是把「這條 trace 好不好」寫回系統。來源可以是使用者按鈕、人工 review、格式 validator 或模型評審。不要把不同意義都塞進 `score`；應分成 correctness、tool_selection、groundedness 等 key，並保留評分方法與 evaluator 版本。

## Offline evaluation：上線前比較版本

[LangSmith Evaluation](https://docs.langchain.com/langsmith/evaluation)的離線流程由 dataset、evaluator 與 experiment 組成。Dataset 放輸入和可選的 reference output；evaluator 可以是程式規則、人工、LLM-as-judge 或 pairwise comparison；experiment 則把某個應用版本跑過整份 dataset，留下可比較結果。

最小 dataset 不必追求大。官方[評估概念](https://docs.langchain.com/langsmith/evaluation-concepts)建議先替每個關鍵元件人工整理少量「什麼叫好」的例子。RAG 可把 retrieval relevance 與 answer correctness 分開；agent 可分別檢查 tool selection、argument schema 與最終答案。如此失敗時才知道要改 retriever、prompt 還是 tool。

```python
from langsmith import Client

client = Client()

def exact_match(run, example):
    expected = example.outputs["answer"].strip()
    actual = run.outputs["answer"].strip()
    return {"key": "exact_match", "score": int(actual == expected)}

client.evaluate(
    answer_question,
    data="support-regression",
    evaluators=[exact_match],
    experiment_prefix="prompt-v12",
)
```

真正能落地的動作是：每修一個 production bug，就把對應 trace 複製成 dataset example，補上預期行為，讓下一版 experiment 必須通過。只建立一份永遠不更新的 benchmark，無法防止真實產品問題回來。

## Online evaluation：監控 production 的品質分布

離線資料有 reference answer，production trace 通常沒有。[Online evaluation](https://docs.langchain.com/langsmith/evaluation)因此適合檢查格式、安全、延遲、tool error、無 reference 的品質啟發式或抽樣 LLM judge。它的用途是找異常與建立回饋迴圈，不是把每個回答即時認證成正確。

線上 evaluator 要設定 filter 與 sampling。程式規則便宜且穩定，適合 schema、禁止字詞與 tool error；LLM judge 有額外延遲、成本與不確定性，應先在人工標記集上校準，再用抽樣或背景執行。Evaluator 本身也要版本化，否則分數變動可能只是 judge prompt 改了。

最完整的閉環是：online evaluator 找到問題 → 人工確認 → 加入 dataset → offline experiment 驗證修正 → 部署 → 繼續線上監控。LangSmith 的價值不在 trace 數量，而在這條鏈是否真的運轉。

## 資料保留、自架與維運邊界

SaaS 導入前要明確決定內容遮罩、採樣、retention、workspace 權限與刪除程序。Trace 可能包含 system prompt、檢索文件、tool argument 與使用者輸入；它常比一般 application log 更敏感。先送一筆假的秘密，測試搜尋、匯出與刪除路徑，再允許 production 流量。

[Self-hosted LangSmith](https://docs.langchain.com/langsmith/self-hosted)是 Enterprise add-on。觀測與評估模式包含 UI、backend、queue、Playground，以及 PostgreSQL、Redis、ClickHouse 與可選的 object storage；官方定位 Docker Compose 為開發／測試，production 建議 Kubernetes 與 Helm。若再啟用 deployment，還會加入 control plane、operator 與 Agent Server data plane。

所以 self-hosted 解決的是資料位置與控制權，不是免維運。團隊要負責資料庫、queue、儲存、升級、備份、容量、SSO 與監控。若只需要把 agent 包成服務，Standalone Agent Server 是另一條路，不能把它和完整自架 LangSmith 觀測平台混為一談。

## 適合與不適合

LangSmith 適合需要看完整 agent／RAG trajectory、把 production traces 轉成 regression dataset、同時做離線比較與線上監控的團隊。它也適合跨框架應用，只是 LangChain／LangGraph 的自動 instrumentation 最省力。

它不適合只想統一模型 endpoint、金鑰與 fallback 的團隊；那是 LiteLLM 或 Portkey 的核心。若只要 request 成本與延遲 dashboard，Helicone 的 proxy 接入通常更直接。若組織還沒有「失敗案例要進 dataset、改版要跑 experiment」的習慣，買了 LangSmith 也可能只得到一個比較漂亮的 log viewer。

LangSmith 的核心取捨是多一套 trace 與 evaluation 資料模型，換得從 production 除錯走回開發驗證的閉環。先追一條代表性 workflow、建立十幾個真實回歸案例、跑一次版本比較；這三步有用，再擴大 instrumentation，會比第一天全站埋點更誠實。

## 參考資料

- [LangSmith Observability Concepts](https://docs.langchain.com/langsmith/observability-concepts)
- [LangSmith Evaluation](https://docs.langchain.com/langsmith/evaluation)
- [LangSmith Evaluation Concepts](https://docs.langchain.com/langsmith/evaluation-concepts)
- [Self-hosted LangSmith](https://docs.langchain.com/langsmith/self-hosted)
- [LangSmith SDK GitHub repository](https://github.com/langchain-ai/langsmith-sdk)
- [Helicone 專文](/posts/ai/2026-08-22-helicone-llm-observability)
- [LiteLLM 專文](/posts/ai/2026-08-22-litellm-gateway)
- [Portkey 專文](/posts/ai/2026-08-22-portkey-ai-gateway)
