---
title: "Cerebras Inference：把 wafer-scale 速度放進 Agent 迴圈前，先看懂真正的瓶頸"
date: 2026-08-22
type: deep-dive
category: "ai"
tags: [cerebras, inference, wafer-scale-engine, ai-agent, llm, openai-api]
lang: zh-TW
description: "拆解 Cerebras wafer-scale 推論服務、OpenAI-compatible API、模型與 benchmark 邊界，並比較 Agent workload 的推論平台選型。"
tldr: "Cerebras 的價值是把支援模型的生成階段大幅加速；但 Agent 的端到端速度仍取決於 prefill、工具 I/O、模型能力與平台相容性。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cerebras-inference-en)

Cerebras Inference 最吸睛的數字一直是 tokens per second。但如果要替 production Agent 選推論平台，問題不能只問「哪一家吐字最快」，而要問：**我的等待時間究竟花在 prefill、模型逐 token 解碼，還是瀏覽器、搜尋與資料庫？** Cerebras 的 wafer-scale 路線確實改變了解碼的速度上限；它卻不會自動消除 Agent 迴圈以外的延遲。

本文資料查核至 2026 年 8 月。速度數字會標明來源與測量邊界，不把供應商 benchmark 當成跨模型的普遍結論。

## 從 wafer-scale 晶片到 API

一般 GPU 推論叢集會把模型切到多張晶片，權重、KV cache 與中間結果經互連搬動。Cerebras 的核心設計是 Wafer-Scale Engine（WSE）：不把晶圓切成許多小 die，而是在晶圓級處理器上配置大量運算核心、片上記憶體與互連。對自回歸生成來說，少一層跨卡通訊與記憶體搬運，就有機會把每個 token 的解碼時間壓低。這是 Cerebras 在[推論服務發布說明](https://www.cerebras.ai/blog/introducing-cerebras-inference-ai-at-instant-speed)中描述的硬體基礎，而不是單純替 GPU API 換品牌。

對開發者而言，硬體細節被包成兩種產品面：共享的 public models，以及需要洽談的 dedicated endpoints。公開目錄適合直接試用，但模型會上下架；專屬端點才提供更廣的模型目錄與容量安排。[官方模型選擇頁](https://inference-docs.cerebras.ai/models/choose-a-model)把兩者分開列出，[deprecation policy](https://inference-docs.cerebras.ai/support/deprecation)也顯示公開模型曾有多次退場。production 不能只把一個 model ID 寫死後就忘記它。

## 最小 OpenAI-compatible 用法

Cerebras 提供自家 SDK，也提供「大致相容」OpenAI 的端點。現有應用可先換 `base_url`，但不要把相容理解成所有參數、回應欄位與工具能力都一模一樣：[相容性文件](https://inference-docs.cerebras.ai/resources/openai)明列標準、支援但非標準，以及不支援的參數。

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["CEREBRAS_API_KEY"],
    base_url="https://api.cerebras.ai/v1",
)

response = client.chat.completions.create(
    model="gpt-oss-120b",
    messages=[
        {"role": "system", "content": "Return a concise incident diagnosis."},
        {"role": "user", "content": "The checkout API p95 doubled after deploy."},
    ],
    temperature=0.2,
    stream=True,
)

for chunk in response:
    print(chunk.choices[0].delta.content or "", end="")
```

程式碼只是連線起點。上線前應呼叫 [`GET /public/v1/models`](https://inference-docs.cerebras.ai/api-reference/models/public-models)，讀取當下的 context window、最大輸出、tool calling、structured output、vision 與價格欄位，再跑自己的契約測試。文件範例中的 GPT OSS 120B 支援 streaming、reasoning、tools 與 structured output，但不支援 vision 或 parallel tool calls；能力是**逐模型**屬性，不是 Cerebras 帳號的永久屬性。

## 速度數字要拆成三段

推論延遲至少要分成：prompt prefill、time to first token（TTFT），以及之後的 decode tokens/s。Agent 使用者感受到的則是完整回合：模型思考、工具呼叫、工具等待、再推論，可能重複多次。

Cerebras 在 Kimi K2.6 Enterprise 發布文中表示，Artificial Analysis 測得其輸出速度為 **981 tokens/s**，並稱是下一個 GPU 雲端供應商的 6.7 倍、受測供應商中位數的 23 倍；同一篇也以 **10,000 input tokens + 500 output tokens** 比較完整回應時間，報告 Cerebras 為 5.6 秒、Kimi 官方 API 為 163.7 秒。這些是[Cerebras 引述第三方測量的特定模型與特定輸入／輸出長度結果](https://www.cerebras.ai/blog/cerebras-kimi-k2-Enterprise)，不是「所有 Cerebras 模型永遠快 23 倍」。模型版本、量化、批次、負載、區域與輸出長度一變，排名也可能變。

因此，選型時至少同時量：

- 固定模型與固定品質門檻下的 TTFT、p50/p95 decode speed、完整回應時間與錯誤率。
- 真實 prompt 長度分布，而不是只測一個短 prompt；長 context 往往讓 prefill 更重要。
- 含工具 I/O 的完整 Agent 任務成功時間。若一次瀏覽器操作要 8 秒，把模型生成從 2 秒降到 0.5 秒，整體不會快四倍。
- 每個成功任務的成本，而非每百萬 token 單價；更快但多走兩輪工具的模型可能反而更貴。

## 哪些 Agent 真的吃得到 wafer-scale 速度

最適合的是模型生成佔 critical path 的工作：coding agent 反覆產生 patch、長 reasoning 軌跡、語音 Agent 需要迅速開始回話，或高併發互動產品希望縮短每輪等待。Streaming 能讓高速解碼直接反映在體感上；專屬容量則有助於把吞吐與尾延遲變成較可預測的 SLO。

不適合只看 benchmark 決定的工作包括：主要時間耗在搜尋／瀏覽器的 research agent、必須使用 Cerebras 目錄以外的私有微調模型、多模態輸入是核心、或嚴格依賴 OpenAI 特有參數與 parallel tool calls 的既有流程。模型品質也不能由速度代理；快模型若工具選錯率較高，重試會吃掉所有優勢。

## 模型生命週期與可靠性

Cerebras 的 [rate-limit 文件](https://inference-docs.cerebras.ai/support/rate-limits)說明限制按組織層級彙總；專案 key 並不天然形成獨立容量池。壓測應涵蓋多個 Agent 同時尖峰、429 backoff、stream 中斷與重送，並準備可重入的 tool execution，避免 timeout 後重複付款或重複寫資料。

平台的 [change log](https://inference-docs.cerebras.ai/support/change-log)在 2026 年仍持續新增專屬模型與調整 API 行為。實務上應把模型 capability snapshot 放進 CI：每日或部署時讀模型端點、驗證必要的 context、JSON schema 和 tool calling，再做小流量 canary。fallback 也要經過同一組 eval，不能臨時換成名稱相似但行為不同的模型。

## 資料與安全邊界

Cerebras Cloud 的[隱私政策](https://cloud.cerebras.ai/privacy)表示，為訓練、推論或 chatbot 提交的輸入與輸出不會被保留；網站與服務日誌則依必要期間保存。這是有利的預設，但不是把秘密直接塞進 prompt 的理由。

API key 只放伺服器端或 secret manager，按環境與服務分 key、設用量限制並輪替。對 PII、原始碼或受監管資料，仍要確認合約中的資料地區、子處理者、事件通報、稽核證據，以及 dedicated／私有部署選項。觀測系統也要遮罩 prompt、tool arguments 和模型回應；最常洩漏資料的未必是推論供應商，而是自己保存完整 trace 的平台。

## 與其他推論平台怎麼選

| 平台 | 主要取向 | 較合理的選擇情境 | 先確認的限制 |
| --- | --- | --- | --- |
| Cerebras | WSE 支撐的高速公開／專屬推論 | 支援模型下，decode latency 是核心瓶頸 | 模型目錄、功能矩陣與生命週期 |
| Baseten | Model API 加上 Truss 自訂部署 | 要部署自有模型、微調或自訂 serving code | 需要自行承擔更多部署與效能工程；見[官方概覽](https://docs.baseten.co/reference/inference-api/overview) |
| Sail | 為長時間 Agent 工作負載包裝的開放模型推論 | 想以 OpenAI-compatible 介面試驗 Agent 專用供應商 | 公開能力與營運證據要逐案驗證；見[產品頁](https://sail.industries/) |
| Fireworks | Serverless、on-demand、dedicated 與 LoRA 生態 | 模型選擇、客製化與部署型態彈性優先 | 不應假設每個模型都有相同延遲；見[serverless 文件](https://docs.fireworks.ai/serverless/overview) |
| Together | Serverless 與 reserved-hardware dedicated endpoints | 要廣模型目錄、自訂模型或固定硬體容量 | 端點型態的價格與啟動／擴縮行為不同；見[dedicated 文件](https://docs.together.ai/docs/dedicated-endpoints/overview) |

這不是單一排行榜。先用 eval 固定任務品質，再以真實流量量 TTFT、decode、p95 完整回合、失敗率和每成功任務成本。若 Cerebras 支援你的模型，而 profile 顯示大量時間確實耗在生成，它的架構差異很可能有實際價值；若瓶頸是工具、資料治理或自訂模型部署，另一種平台取向會更重要。

## 結論

Cerebras Inference 的關鍵不是「又一個 OpenAI-compatible endpoint」，而是把 wafer-scale 架構轉成可由一般 SDK 使用的低解碼延遲。它特別適合每次等待都被模型生成主導的互動式 Agent。

但 production 決策仍要守住三條線：只比較相同模型與品質門檻下的數字；把 public 與 dedicated 的模型／容量邊界分清楚；用完整 Agent trace 驗證端到端收益。最快的 token 不必然造就最快完成的任務，只有瓶頸對上時才會。

## 參考資料

- [Cerebras Inference：選擇模型](https://inference-docs.cerebras.ai/models/choose-a-model)
- [Cerebras OpenAI 相容性](https://inference-docs.cerebras.ai/resources/openai)
- [Cerebras Public Models API](https://inference-docs.cerebras.ai/api-reference/models/public-models)
- [Cerebras Rate Limits](https://inference-docs.cerebras.ai/support/rate-limits)
- [Cerebras Deprecation Policy](https://inference-docs.cerebras.ai/support/deprecation)
- [Cerebras Inference Change Log](https://inference-docs.cerebras.ai/support/change-log)
- [Cerebras：Kimi K2.6 Enterprise](https://www.cerebras.ai/blog/cerebras-kimi-k2-Enterprise)
- [Cerebras：Introducing Cerebras Inference](https://www.cerebras.ai/blog/introducing-cerebras-inference-ai-at-instant-speed)
- [Cerebras Cloud Privacy Policy](https://cloud.cerebras.ai/privacy)
