---
title: "模型卡｜Meta Muse Wonder"
date: 2026-10-12
category: daily
type: digest
tags: [ai-agent, model-release, daily, meta, model-family-muse-spark]
lang: zh-TW
description: "Meta Superintelligence Labs 發佈首款前沿模型 Muse Wonder／Wonder Full——1M context、定價對齊 Claude Opus 5.5 的 $4/$20，主打 Active Memory／Active Focus 兩項長程個人與專業 agent 能力"
tldr: "Muse Wonder（API 可呼叫）與 Muse Wonder Full（僅限 Muse Code 訂閱）：2026-10-12 發佈，1,048,576 tokens context，定價 $4.00/1M input（快取 $0.20）／$20.00/1M output，與 Claude Opus 5.5 完全同價；官方自測 Terminal-Bench 4.0-AA 85.6（Wonder）/85.5（Full）均超過 Opus 5.5 的 81.5，SWE-Marathon 78.8/79.0 同樣領先 Opus 5.5 的 74.2；但獨立評測機構 Artificial Analysis 的 Intelligence Index 把 Wonder 列在 52 分（219 模型中第 9）、Wonder Full 56 分（699 模型中第 4），低於 Meta 自己公佈的 56/59.0，也低於 Opus 5.5 的 58 分。這是 Meta 自 2025 年 8 月重組 AI 團隊後首款前沿級模型，兩個 checkpoint 能力分工不對稱：Wonder 在 AutomationBench／GDP.pdf 領先 Full，Full 則在 JobBench／Vals Finance／MemoryBench 大幅領先 Wonder。"
series:
  name: "AI Model Tracker"
  order: 46
glossary:
  - term: "Muse"
    def: "Meta 的模型與 agent 產品家族統稱，涵蓋輕量的 Muse Spark、開放權重的 Muse Glimmer，以及本篇介紹的前沿模型 Muse Wonder"
  - term: "Active Memory"
    def: "Meta 為 Muse Wonder 設計的能力名稱：模型在多輪對話與長期使用中記住並檢索與使用者相關的重要資訊"
---

> 🌏 [English version](/posts/daily/2026-10-12-model-meta-muse-wonder-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `muse-wonder-1.0`（API 可呼叫）／`muse-wonder-full-1.0`（僅限 Muse Code 訂閱，不開放 API） |
| 廠商 | Meta（Meta Superintelligence Labs） |
| 參數量 | 未公開 |
| Context Window | 1,048,576 tokens |
| Input 定價 (USD/1M tokens) | $4.00（快取 input $0.20） |
| Output 定價 (USD/1M tokens) | $20.00（Wonder Full 不透過 API 販售，無公開單價，僅含在 Muse Code 月費 $50／$200 方案內） |
| 開源 | 否 |
| 發布日 | 2026-10-12 |
| 官方公告 | [Meta AI Research Blog：Muse Wonder](https://research.meta.ai/blog/muse-wonder) |
| 官方 Model Card | [Muse Wonder Model Card（PDF）](https://research.meta.ai/static/muse-wonder-model-card) |
| 家族 | Muse（前代輕量線 Muse Spark 1.x → 本代首款前沿模型 Wonder／Wonder Full） |

## 能力亮點

- 首次推出「**Active Memory**＋**Active Focus**」組合：前者讓模型跨對話記住並檢索使用者相關資訊，後者描述模型在長任務中持續排除障礙、調整做法、必要時主動詢問澄清的行為，兩者都是官方強調「無法只看 benchmark 分數判斷」的能力
- 定價與 Context Window（$4/$20、1M tokens）完全對齊 Claude Opus 5.5，是 Meta 重組 AI 團隊以來首款以「旗艦同價」姿態發佈的模型，不是走低價路線
- 官方自測 Terminal-Bench 4.0-AA：Wonder 85.6、Wonder Full 85.5，雙雙超過 Claude Fable 5.1（79.0）、GPT-6 Astra（81.4）與 Claude Opus 5.5（81.5）
- 官方自測 SWE-Marathon（超長程軟體工程任務）：Wonder 78.8、Wonder Full 79.0，領先 Opus 5.5 的 74.2 與 GPT-6 Astra 的 74.1 達 4–5 個百分點

## Benchmark 表現

| Benchmark | Muse Wonder | Muse Wonder Full | Claude Opus 5.5 | 競品最強（除 Opus 5.5） |
|---|---|---|---|---|
| Terminal-Bench 4.0-AA | 85.6 | 85.5 | 81.5 | GPT-6 Astra 81.4 |
| DeepSWE 1.1 | 52.0 | 57.1 | 59.6 | GPT-6 Astra 59.1 |
| SWE-Marathon | 78.8 | 79.0 | 74.2 | GPT-6 Astra 74.1 |
| AA Intelligence Index（Meta 自測） | 56 | 59.0 | 58 | Claude Fable 5.1 54 |
| AA Intelligence Index（Artificial Analysis 獨立評測） | 52（219 模型中第 9） | 56（699 模型中第 4） | 58（第 1） | — |

⚠️ 前四列為 Meta 官方 model card 自測（部分 benchmark 由 Artificial Analysis／Datacurve／Abundant AI 等第三方工具執行，但仍是廠商委託或廠商自報分數，尚未經獨立複測）。最後一列是 Artificial Analysis 自己公開榜單上的獨立數字，與 Meta 自報的 56／59.0 有落差——同一個 Index，廠商自報分數比獨立評測高 3 分左右，這個落差本身就值得留意。

## 與前代/競品比較

這是 Meta 自 2025 年 8 月由 Scale AI 創辦人 Alexandr Wang 重組 AI 團隊後，第一款以「前沿模型」規格發佈的產品。在此之前 Meta 只推出過輕量的 Muse Spark 與 Muse Agent，刻意避開和 OpenAI、Anthropic 同等級的正面對決；Muse Wonder 是第一次正面跟牌。

跟 Opus 5.5 比，Wonder 在 Terminal-Bench 與 SWE-Marathon 兩項官方自測都領先，但 DeepSWE 1.1 落後（52.0／57.1 對 59.6），且獨立評測機構 Artificial Analysis 的 Intelligence Index 把 Wonder 排在 Opus 5.5 之後（52 對 58）。換句話說，Meta 自己挑選公佈的 benchmark 組合（Terminal-Bench、SWE-Marathon）剛好是 Wonder 領先的項目，而綜合性的獨立指標仍然是 Opus 5.5 領先——這是解讀廠商自報 benchmark 時常見的選擇性呈現，不代表 Wonder 全面輸或贏。

定價策略最值得注意：Meta 沒有打價格戰，$4/$20 完全比照 Opus 5.5，比 DeepSeek V4 Pro 等開源陣營的 API 貴上數倍。這代表 Meta 現階段的定位是「用技術實力跟一線閉源模型同價競爭」，而非靠低價搶市占。

Wonder 與 Wonder Full 兩個 checkpoint 的能力分工也不對稱：Wonder（API 可呼叫）在 AutomationBench-AA、GDP.pdf 領先 Full；Wonder Full（僅限 Muse Code 訂閱）則在 JobBench（75.3 對 30.8）、Vals Finance Agent V2（59.1 對 10.0）、MemoryBench（39.4 對 34.3）大幅領先 Wonder。這不是同一顆模型「開大推理」的差異，而是兩套不同訓練側重的模型——開發者能透過 API 拿到的，不是分數比較高的那顆。

## 對 Agent 開發的意義

Active Memory／Active Focus 是這次最值得關注的架構訊號：Meta 明確把「長期記住使用者狀態」和「長任務中持續排除障礙」當成獨立於傳統 benchmark 之外的核心賣點，而不是用更大 context window 或更強推理分數去間接證明。

- 如果你在做需要跨 session 記住使用者偏好與歷史的個人助理 agent：Muse Wonder 系列是目前少數把「記憶」當成一等公民能力來訓練與評測（MemoryBench）的前沿模型，值得納入選型評估；但 Wonder Full 在 MemoryBench 的分數明顯高於 API 版 Wonder，意味著若你只能透過 API 呼叫，拿到的記憶能力並非 Meta 自己測出來最強的那個版本
- 如果你在做 agentic coding／長程軟體工程任務：SWE-Marathon 的 78.8 分領先 Opus 5.5 與 GPT-6 Astra，加上 1M context，適合評估取代現有 coding agent 的後端模型
- 不適合：成本敏感的高吞吐量批次任務——這顆模型沒有「關閉推理」的模式，reasoning token 一律計入 output 計費，且定價本身就對齊最貴的 Opus 5.5 等級，不像 DeepSeek 系列有明顯的成本優勢；另外若你的應用依賴「分數較高的那顆」，要先確認自己能不能拿到 Wonder Full（目前只綁在 Muse Code 月費訂閱，沒有 API 路徑）

## 今日收穫

一般预期同系列的「輕量版」和「完整版」只是同一顆模型調大推理預算的差異，但 Muse Wonder 和 Wonder Full 打破了這個假設——兩者在不同 benchmark 上互有勝負（API 版在 AutomationBench／GDP.pdf 領先，訂閱版在 JobBench／Vals Finance／MemoryBench 大幅領先），代表 Meta 是分別針對不同任務輪廓訓練出兩個模型，而不是同一顆模型的兩個推理檔位。這也提醒在讀廠商自報 benchmark 時，要注意「廠商選哪些項目公佈」本身就是一種訊號——此次 Meta 公佈的項目剛好多是 Wonder 系列領先的項目，獨立機構的綜合指標反而相對保守。

## 參考資料

- [Meta AI Research Blog：Introducing Muse Wonder](https://research.meta.ai/blog/muse-wonder)
- [Muse Wonder Model Card（官方 PDF）](https://research.meta.ai/static/muse-wonder-model-card)
- [TechCrunch：Meta releases its first frontier model, Muse Wonder](https://techcrunch.com/2026/10/12/meta-releases-its-first-frontier-model-muse-wonder/)
- [OrcaRouter：Muse Wonder Is Live——完整 benchmark 表格與獨立評測對照](https://www.orcarouter.ai/blog/meta-muse-wonder)
- [Muse Spark 系列家族介紹（本站）](/posts/tech/2026-09-19-ai-model-family-muse-spark)
