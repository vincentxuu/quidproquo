---
title: "Sail Research：用延遲換成本的 Long-Horizon Agent 推論平台"
date: 2026-08-22
category: ai
type: deep-dive
tags: [sail-research, llm-inference, ai-agent, long-horizon-agent, open-models, agent-infrastructure]
lang: zh-TW
tldr: "Sail Research 讓每個推論 request 宣告 completion window，把可等待的背景 Agent 排到較便宜的運算資源；並以 Sailboxes 補上長時間執行環境。"
description: "拆解 Sail Research 的 completion windows、OpenAI／Anthropic 相容 API、Sailboxes、安全限制，以及和 Baseten、Fireworks、Together、Cerebras 的選型取捨。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-sail-agent-inference-en)

[Sail Research](https://www.sailresearch.com/) 是 Neil Movva 與 Samir Menon 創辦的 AI 基礎設施公司，正式產品分成開放模型推論 API、持久 Linux VM「Sailboxes」，以及 Agent telemetry「Voyages」。它不是 Stanford AI Lab，也不是同名論文中的 SAIL；官方文件、創辦人、投資人與 `sailresearch.com`／`sail.industries` 網域都指向同一家公司。

Sail 之所以屬於「Agent 導向推論」，不是因為 API 上貼了 agent 標籤，而是它反轉了常見的服務目標。互動聊天在意 time to first token；跑數小時的研究、code review、eval 或 RL rollout，通常更在意每美元能完成多少 token。Sail 讓 request 宣告可等待多久，由 scheduler 用延遲彈性換取更高 fleet utilization 與更低價格。

公司在 2026 年 6 月宣布[種子輪加 Series A 共募得 8,000 萬美元](https://www.sailresearch.com/blog/sail-raises-80m)，分別由 Sequoia Capital 與 Kleiner Perkins 領投。官方同時稱已為 Parallel、Detail.dev、Jack & Jill、Quadrillion 等客戶處理 trillions of tokens；這是公司揭露的採用敘事，不是獨立稽核。

## 核心架構：讓工作說出自己的耐心

傳統 serverless inference 多半同時追逐低 latency 與高 throughput。Sail 的關鍵抽象是 [completion window](https://docs.sailresearch.com/completion-windows)：同一個模型、同一套 API，request 可以選不同的排程急迫度。

| Window | 排程取向 | 適合 |
|---|---|---|
| `asap` | 優先低延遲 | 人正在等待、下一個 Agent turn 被它阻塞 |
| `balanced` | 給 scheduler 較寬時間 | 背景 Agent、subagent、平行 pipeline |
| `flex` | best-effort | eval、batch、離線 enrichment |

這不是較小模型或較低品質模式，而是把時間當成資源。背景工作願意等，平台就能聚合 request、安排異質硬體、利用 spot capacity，並在不可靠 worker 間 fail over。官方 manifesto 表示團隊會寫 CUDA kernel、修改 SGLang 類 inference engine，並由 global controller 提高整體運算使用率；底層實作並未完全公開，因此應把它視為供應商架構說明，而不是可自行重現的技術報告。

Sail 的第二層是 [Sailboxes](https://sail.industries/sailboxes)：有 root、獨立 disk、Docker 與 local NVMe 的 kernel-isolated Linux VM。推論 request 在排隊時，Sailbox 可以自動 sleep；結果回來再喚醒 Agent。這把「便宜地等模型」和「便宜地保留 Agent 電腦」接在一起，正是 long-horizon workload 與一般聊天 endpoint 的差別。

## API：相容不等於完全等價

最小用法可直接沿用 OpenAI SDK，只換 base URL 與 key：

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sailresearch.com/v1",
    api_key="YOUR_SAIL_API_KEY",
)

response = client.responses.create(
    model="zai-org/GLM-5.2-FP8",
    input="Review this repository and propose three testable fixes.",
    max_output_tokens=2000,
    background=True,
    metadata={"completion_window": "balanced"},
)

print(response.id)  # 之後 polling，或改用 webhook
```

截至本文截稿，[API support matrix](https://docs.sailresearch.com/support)列出 Responses、Chat Completions 與 Batch 為 stable，Anthropic Messages 為 beta。Responses 支援 function tools、structured output、reasoning、background mode 與 foreground SSE；背景 request 會立即回傳 ID，之後 polling 或收 webhook，不能同時 streaming。

「OpenAI-compatible」也不能理解成所有欄位逐位元相同。不同 surface 的 tool calling、thinking block、image、stop reason 與 token accounting 支援度不同；Anthropic client 也有 metadata typing 差異。遷移前要拿現有 production payload 跑 contract test，尤其檢查 tool call round-trip、JSON Schema、取消、重試、usage 與 partial output。

## 安全與資料邊界

API key 只能放後端 secrets manager；長時間 background job 還要保存 request ID、設定 idempotency key，並驗證 webhook 簽章。Agent tool call 必須在你的執行層做 schema validation、權限檢查與 timeout；推論供應商回傳 function arguments，不代表動作已獲授權。

更值得注意的是資料保留。[Sail 服務條款](https://sail.industries/terms)寫明可能儲存 request／response，且目前不能關閉這項儲存；同時承諾不以客戶資料訓練模型，除非明確 opt-in 或為客戶指定的服務所需。條款也把 payment card、PHI、政府識別碼等列為 prohibited content。若你的 Agent 會處理這些資料，不能只因模型是 open-weight 就假設 SaaS endpoint 可用。

Sailboxes 也不是備份服務。條款明講 host failure 後可能只恢復到最近 checkpoint，之後 command 不保證 replay；使用者要自行備份。對長任務，應把不可重建的產物寫到外部 object store，把 workflow state 存進可重播的 event log，而不是只留在 VM disk。

## 跟其他推論平台怎麼選

| 平台 | 主要優化方向 | 優先考慮的情境 |
|---|---|---|
| [Sail](https://docs.sailresearch.com/) | 可等待的 open-model inference，加上持久 Agent VM | token 量極大、非同步、可用延遲換成本的長工作 |
| [Baseten](https://docs.baseten.co/overview) | hosted API、custom model deployment、training、multi-cloud 與 production operations | 要部署私有 checkpoint、自訂 container、環境 promotion 或單租戶 |
| [Fireworks](https://docs.fireworks.ai/getting-started/introduction) | serverless／dedicated inference、廣模型與多模態、fine-tuning | 需要成熟即時 serving、模型廣度與 training 一體化 |
| [Together AI](https://docs.together.ai/intro) | serverless、dedicated inference、fine-tuning、GPU cluster | 從 API 一路延伸到訓練或自管大型 cluster |
| [Cerebras](https://inference-docs.cerebras.ai/) | wafer-scale hardware 上的極低延遲、高 token generation speed | Agent turn 強相依、每個回合速度直接決定總完成時間 |

Sail 並不是「越慢一定越便宜」的通用結論。若 Agent 每一步都等前一步，排程延遲會乘上 turn 數；此時 Cerebras 或其他 low-latency endpoint 可能讓整個任務更便宜，因為 sandbox、worker 與使用者都少等。相反地，能一次 fan out 數千個獨立 request 的 eval 或 deep research，才最能利用 `balanced`／`flex`。

Baseten 的差異是模型與部署控制：可用自訂 Docker、專用 GPU、autoscaling 與環境 promotion。Fireworks 和 Together 的產品面更廣，包含多模態、fine-tuning 或 cluster。Sail 目前較聚焦精選 open models 與 agent economics；如果特定模型、資料區域、zero data retention 或 SLA 是硬條件，先逐項確認，不要只比較 token 單價。

## 效能數字與限制

Sail 在自家 [BrowseComp-Plus 實驗](https://www.sailresearch.com/blog/browsecomp-plus)宣稱 research agent 達到 90.72% accuracy，成本比比較對象低 6–35 倍。這是 vendor benchmark：Sail 同時提供 inference engine 與 agent harness，結果無法隔離「模型、搜尋策略、token budget、排程」各自的貢獻。它能證明大量 token 是值得測的方向，不能證明你的 Agent 會自動得到相同改善。

官方 completion-window 頁面列出的折扣與延遲也多是 target 或相對於「traditional providers」的區間，不是 SLA。服務條款更明確表示一般服務沒有 uptime commitment。正式採用前要用自己的 workload 測三條曲線：每個 window 的完成時間分布、每個成功任務總成本，以及 provider failure 後的重試放大率。

另外，模型清單與 API maturity 還在快速變動。今天能用 Responses API 跑通，不代表 Messages beta 的所有 Anthropic 行為都相同；供應商也保留修改 beta feature 的權利。用 adapter 隔離 provider-specific metadata，並為重要模型保留第二條 routing path。

## 整體來說

Sail 最有意思的不是再做一個 OpenAI-compatible endpoint，而是把「這個 request 可以等」變成一級排程訊號。對長時間背景 Agent，這比追求每次呼叫的最小 TTFT 更符合真正成本結構；Sailboxes 又把等待期間的 compute 浪費一起納入設計。

導入時先挑一個可平行的真實工作，同模型各跑 `asap`、`balanced`、`flex`。記錄完整 wall-clock、成功率、重試與 token 帳單，再跟現有供應商比較「每個成功任務」而不是「每百萬 token」。只有當 Agent 真的有耐心，Sail 的架構優勢才會變成你的成本優勢。

## 參考資料

- [Sail Research 官方網站](https://www.sailresearch.com/)
- [Sail Research Quickstart](https://docs.sailresearch.com/quickstart)
- [Sail API Support Matrix](https://docs.sailresearch.com/support)
- [Sail Completion Windows](https://docs.sailresearch.com/completion-windows)
- [Sailboxes](https://sail.industries/sailboxes)
- [Sail 8,000 萬美元募資公告](https://www.sailresearch.com/blog/sail-raises-80m)
- [Sail BrowseComp-Plus 實驗](https://www.sailresearch.com/blog/browsecomp-plus)
- [Sail Terms of Service](https://sail.industries/terms)
- [Baseten Overview](https://docs.baseten.co/overview)
- [Fireworks AI Introduction](https://docs.fireworks.ai/getting-started/introduction)
- [Together AI Overview](https://docs.together.ai/intro)
- [Cerebras Inference](https://inference-docs.cerebras.ai/)

