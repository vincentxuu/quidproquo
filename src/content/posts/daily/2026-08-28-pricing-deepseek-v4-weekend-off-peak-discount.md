---
title: "定價追蹤｜DeepSeek 週末全時段降到離峰價，上週漲價的另一半故事"
date: 2026-08-28
category: daily
tags: [ai-agent, pricing, daily, deepseek]
lang: zh-TW
description: "DeepSeek 於 8/23 起取消週末的尖峰時段計費，週六日全天改按離峰價收費——上週才把 V4 尖峰價調漲 355% 以上，這週用「週末半價」補了一手，等於把定價新聞拆成兩篇才讀得完整"
tldr: "DeepSeek 自 2026-08-23 00:00（北京時間）起，週六、週日全天不再區分尖峰/離峰，一律以離峰價計費——原本週末仍套用平日的尖峰/離峰時段表，尖峰時段 V4-Pro Output 要價 $3.96/1M tokens，現在週末全天都是 $1.98/1M。平日計費規則不變。距 8/16 那次尖峰漲價（Output 漲 355%-371%）僅一週。"
series:
  name: "AI Pricing Watch"
  order: 6
---

> 🌏 [English version](/en/posts/daily/2026-08-28-pricing-deepseek-v4-weekend-off-peak-discount-en)

## 變更摘要

我們上週才記錄過 DeepSeek 對 V4 全系列調漲尖峰時段定價（Output 漲 355%-371%），這週 DeepSeek 又出手調整——但這次是往回退半步。8/23 起，週六、週日全天都不再區分尖峰/離峰時段，一律以離峰價計費。在此之前，週末其實跟平日用同一張時段表，尖峰窗口（北京時間 9:00-12:00、14:00-18:00）在週末照樣收尖峰價。這個調整沒有更動任何一格牌價，純粹是把「尖峰時段」的定義從「平日+週末」縮成「只有平日」，結果是週末原本的尖峰時段直接砍半。官方說法是為了讓開發者能更彈性地在週末排程工作負載，同時協助公司在網路層級平衡運算容量——換句話說，這更像是產能調度工具，而不是價格戰動作。

## 前後對照

| 項目（週末尖峰時窗內） | 舊價 | 新價 | 變化 | 生效日 |
|---|---|---|---|---|
| V4-Pro Output | $3.96/1M tokens | $1.98/1M tokens | ↓50% | 2026-08-23 00:00（北京時間） |
| V4-Pro Input（Cache Miss） | $1.32/1M tokens | $0.66/1M tokens | ↓50% | 2026-08-23 00:00（北京時間） |
| V4-Pro Input（Cache Hit） | $0.044/1M tokens | $0.022/1M tokens | ↓50% | 2026-08-23 00:00（北京時間） |
| V4-Flash Output | $1.32/1M tokens | $0.66/1M tokens | ↓50% | 2026-08-23 00:00（北京時間） |
| V4-Flash Input（Cache Miss） | $0.44/1M tokens | $0.22/1M tokens | ↓50% | 2026-08-23 00:00（北京時間） |
| V4-Flash Input（Cache Hit） | $0.014/1M tokens | $0.007/1M tokens | ↓50% | 2026-08-23 00:00（北京時間） |

平日計費規則完全不變：尖峰時段（北京時間 9:00-12:00、14:00-18:00）仍是離峰價的兩倍。新規則的分界不是「時間」而是「日期」——只要落在週六或週日（以北京時間為準），整天都按離峰價收費；生效日之前產生的費用仍依舊制結算。

## 成本試算

**場景**：一個團隊固定在每個週六跑一次大型批次摘要任務（V4-Pro，500M input tokens／cache miss + 200M output tokens），任務橫跨全天、必然會蓋到過去定義的尖峰時窗。

| | 舊制（週末仍套尖峰價） | 新制（週末全天離峰價） | 單次省下 |
|---|---|---|---|
| Input 成本／次 | $660.00 | $330.00 | $330.00 |
| Output 成本／次 | $792.00 | $396.00 | $396.00 |
| **合計／次** | **$1,452.00** | **$726.00（↓50%）** | **$726.00** |
| **合計／月（4 個週六）** | **$5,808.00** | **$2,904.00** | **$2,904.00** |

這個試算刻意假設整個批次任務都落在舊制的尖峰時窗內（最壞情況），藉此呈現新規則的最大效益；如果任務本來就排在舊制離峰時段，這次調整對你完全無感。換句話說，受益程度完全取決於你的排程習慣，而不是你用哪個模型。

## 對開發者/企業的影響

### 誰最受益

原本「有彈性但沒空排程細節」的團隊受益最大——過去要拿到離峰價，得同時滿足「排在週末」和「避開週末的尖峰時窗」兩個條件；現在只要排在週末就好，排程邏輯少一層判斷。對批次摘要、資料清洗、離線評測、模型微調前處理這類本來就打算延後執行的任務來說，這等於是免費多拿到一段可用的折扣時間。相對地，需要即時回應、無法延後到週末的線上服務（客服、聊天機器人）完全吃不到這次調整的好處，成本結構跟上週的漲價後維持不變。

### 競爭格局影響

主要模型 Output 定價排名，加入 DeepSeek 週末新價（USD/1M tokens）：

| 模型 | Output | 備註 |
|---|---|---|
| GPT-5.6 Luna | $1.20 | OpenAI 7/30 降價後價格 |
| **DeepSeek V4-Flash（週末／平日離峰）** | **$0.66** | 週末新規則生效後，平日離峰與週末統一為同一價 |
| **DeepSeek V4-Pro（週末／平日離峰）** | **$1.98** | 同上 |
| DeepSeek V4-Flash（平日尖峰） | $1.32 | 平日規則不變 |
| Claude Haiku 4.5 | $4.00 | 最便宜的高能力模型（西方陣營） |
| DeepSeek V4-Pro（平日尖峰） | $3.96 | 平日規則不變 |
| GPT-5.6 Terra | $12.00 | — |
| Claude Sonnet 5 | $10.00（$2/$10 已於 8/11 定為永久價） | — |

這次調整沒有改變任何一格牌價，因此不影響「最低價」這一行的排名——真正變化的是「能用最低價的時間窗口」從一週 119 小時（平日離峰時段）擴大到約 167 小時（加上整個週末），佔比從約 71% 提升到約 99%。對重度依賴 DeepSeek 批次處理的團隊來說，實質上等於把離峰折扣的覆蓋率拉到接近全時段。

### 行動建議

- 如果你有可以延後執行的批次工作（摘要、清洗、離線評測、資料索引重建）：優先排到週末，不用再費心避開過去的尖峰時窗，排程邏輯可以直接簡化成「is_weekend」判斷。
- 如果你原本已經把非即時任務排在平日離峰時段：這次調整對你的帳單沒有直接影響，但值得評估把部分工作挪到週末，騰出平日離峰額度給更急迫的任務。
- 如果你在跑即時服務：這次調整跟你無關，仍需依照上週的漲價結果（尖峰 Output 漲 355% 以上）重新檢視是否要切換模型或改用快取策略。

## 今日收穫

上週的 DeepSeek 漲價新聞標題都在講「最高漲 1,100%」，這週的降價新聞標題則反過來喊「週末砍半」——兩則新聞單獨看都像是獨立事件，但放在一起讀才是完整故事：DeepSeek 先用尖峰/離峰雙軌制把定價複雜度提高一個維度，一週後又用「週末全天離峰」把其中一部分複雜度收回去。這種「先漲價立規則、再用例外條款局部退讓」的節奏，比單純看漲跌百分比更能說明一件事——定價變動的真正意圖，往往要等到廠商公布「例外規則」時才看得清楚：這次的例外剛好對齊「開發者的員工不上班的日子」，呼應了多篇報導提到的推測——尖峰時段可能對應到 DeepSeek 自己拿去訓練模型的運算資源。

## 參考資料

- [DeepSeek Ends Weekend Peak Pricing for API Users From Today — Bloomberg](https://www.bloomberg.com/news/articles/2026-08-23/deepseek-ends-weekend-peak-pricing-for-api-users-from-today)
- [DeepSeek applies off-peak API pricing on weekends, slashing bills by half — The Standard](https://www.thestandard.com.hk/innovation/article/340702/DeepSeek-applies-off-peak-API-pricing-on-weekends-slashing-bills-by-half)
- [DeepSeek API to Apply Off-Peak Pricing All Weekend as Big-Model Price Hikes Signal Strong Compute Demand — BigGo Finance](https://finance.biggo.com/news/106a7229-706b-4f21-b435-9f56e3915b64)
- [DeepSeek API Billing Adjustment: Weekend Rates to Use Off-Peak Pricing All Day — Odaily](https://www.odaily.news/en/newsflash/511930)
- [定價追蹤｜DeepSeek V4 全面調漲，尖峰時段最高漲 1,100%](/posts/daily/2026-08-16-pricing-deepseek-v4-peak-off-peak-hike)
