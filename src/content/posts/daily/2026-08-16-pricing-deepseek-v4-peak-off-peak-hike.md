---
title: "定價追蹤｜DeepSeek V4 全面調漲，尖峰時段最高漲 1,100%"
date: 2026-08-16
category: daily
tags: [ai-agent, pricing, daily, deepseek]
lang: zh-TW
description: "DeepSeek 於 8/16 16:00 UTC 對 V4-Pro / V4-Flash 全面調漲 API 定價並導入尖峰/離峰雙軌計費，尖峰 Output 漲 355%-371%，Cache Hit Input 尖峰時段最高漲 1,114%，終結近一年的低價策略"
tldr: "DeepSeek V4-Pro 尖峰 Output 從 $0.87 漲到 $3.96/1M tokens（↑355%），V4-Flash 從 $0.28 漲到 $1.32（↑371%），2026-08-16 16:00 UTC 生效，同時導入離峰半價機制（01:00-04:00、06:00-10:00 UTC 為尖峰）。漲價後價格仍低於 GPT-5.6／Claude，但低價護城河明顯收窄。"
series:
  name: "AI Pricing Watch"
  order: 1
---

## 變更摘要

DeepSeek 在發布 V4-Pro 正式版的同時，宣布 V4 全系列調漲 API 定價，並首次導入「尖峰／離峰」雙軌計費——這是它自 2025 年低價策略以來最大幅度的一次漲價。以漲幅最誇張的項目來看，V4-Pro 的 Cache Hit Input 尖峰時段從 $0.003625 漲到 $0.044/1M tokens，漲幅達 1,114%，這也是多家外媒下標「漲價超過 1,100%」的依據；但真正影響多數應用成本的 Output 定價，漲幅落在 355%（V4-Pro）到 371%（V4-Flash）之間。漲價後 DeepSeek 仍比 GPT-5.6 和 Claude 便宜，但「用中國模型幾乎零成本」的敘事正式終結。

## 前後對照

| 項目 | 舊價（單一費率） | 新價：離峰 | 新價：尖峰 | 尖峰漲幅 | 生效日 |
|---|---|---|---|---|---|
| V4-Pro Input（Cache Miss） | $0.435/1M | $0.66/1M | $1.32/1M | ↑203% | 2026-08-16 16:00 UTC |
| V4-Pro Output | $0.87/1M | $1.98/1M | $3.96/1M | ↑355% | 2026-08-16 16:00 UTC |
| V4-Pro Input（Cache Hit） | $0.003625/1M | $0.022/1M | $0.044/1M | ↑1,114% | 2026-08-16 16:00 UTC |
| V4-Flash Input（Cache Miss） | $0.14/1M | $0.22/1M | $0.44/1M | ↑214% | 2026-08-16 16:00 UTC |
| V4-Flash Output | $0.28/1M | $0.66/1M | $1.32/1M | ↑371% | 2026-08-16 16:00 UTC |
| V4-Flash Input（Cache Hit） | $0.0028/1M | $0.007/1M | $0.014/1M | ↑400% | 2026-08-16 16:00 UTC |

離峰時段固定為尖峰費率的 50%；尖峰時段為 **01:00–04:00 及 06:00–10:00 UTC**，其餘時間都算離峰。

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens，未使用 cache），改用 DeepSeek V4-Pro。

| | 舊定價 | 新定價（全尖峰） | 新定價（全離峰） |
|---|---|---|---|
| Input 成本/月（450M tokens） | $195.75 | $594.00 | $297.00 |
| Output 成本/月（150M tokens） | $130.50 | $594.00 | $297.00 |
| **合計** | **$326.25** | **$1,188.00（↑264%）** | **$594.00（↑82%）** |

同一個 workload，光靠把流量排到離峰時段，月成本差距就有 $594——這比舊價漲幅本身還大，說明這次改版把「什麼時候呼叫 API」變成了和「呼叫哪個模型」同等重要的成本決策。

## 對開發者/企業的影響

### 誰最受益

短期內沒有人「受益」於漲價本身，但**可以把非即時任務排程到離峰時段的團隊**受影響最小——批次摘要、資料清洗、離線評測這類不需要即時回應的工作，改到離峰跑幾乎可以把漲幅砍半。相對地，面向終端使用者的即時客服、聊天機器人這類無法排程的尖峰時段流量，會直接吃下 355% 以上的漲幅。

### 競爭格局影響

漲價後的主要模型 Output 定價排名（USD/1M tokens）：

| 模型 | Output | 備註 |
|---|---|---|
| GPT-5.6 Luna | $1.20 | OpenAI 7/30 才降 80% |
| **DeepSeek V4-Flash（離峰）** | **$1.98** | 換算後仍是離峰最便宜的 frontier 級選項之一 |
| **DeepSeek V4-Pro（離峰）** | **$1.98** | — |
| **DeepSeek V4-Flash（尖峰）** | **$1.32** | 注意：尖峰 Flash Output 比離峰 Pro 便宜，排程比選模型更關鍵 |
| Claude Haiku 4.5 | $4.00 | 最便宜的高能力模型（西方陣營） |
| **DeepSeek V4-Pro（尖峰）** | **$3.96** | 漲價後首次逼近 Claude Haiku 4.5 |
| GPT-5.6 Terra | $12.00 | — |
| Claude Sonnet 5 | $10.00（促銷至 8/31）／$15.00（9/1 起） | — |

即使漲價後，DeepSeek 尖峰價格仍落在 Claude Haiku 4.5 附近，離峰價格仍明顯低於所有西方主流模型——這次調整縮小的是價差，不是翻轉排名。

### 行動建議

- 如果你的 workload 可以容忍延遲（批次處理、summarization、離線 RAG index 建置）：把排程改到 01:00–04:00 / 06:00–10:00 UTC 以外的離峰窗口，等於直接拿到 50% 折扣。
- 如果你在跑即時客服或使用者對話類 Agent：重新用尖峰價格跑一次成本試算，355%-371% 的漲幅可能讓 DeepSeek 和 Claude Haiku 4.5 的價差不再明顯，值得重新比較品質與延遲再決定是否切換。
- 如果你的系統高度依賴 prompt caching：注意 Cache Hit Input 漲幅最誇張（尖峰最高 1,114%），過去把 cache hit 當「幾乎免費」的假設要重新檢查，不能只看 Output 漲幅估算總成本。

## 今日收穫

外媒標題「漲價超過 1,100%」講的其實是 V4-Pro 尖峰時段 Cache Hit Input 這個最小、最少被計算進總成本的項目，而多數應用實際感受到的漲幅（Output，355%-371%）沒有標題數字誇張。定價新聞的漲跌幅百分比永遠要先確認「漲的是哪一項」，headline 數字經常挑的是絕對值最小、百分比最好看的那一格。

## 參考資料

- [DeepSeek-V4-Pro GA Release](https://api-docs.deepseek.com/news/news260813/)
- [Models & Pricing | DeepSeek API Docs](https://api-docs.deepseek.com/quick_start/pricing)
- [DeepSeek raises some V4 prices by more than 10x as AI demand strains capacity - InfoWorld](https://www.infoworld.com/article/4209439/deepseek-raises-some-v4-prices-by-more-than-10x-as-ai-demand-strains-capacity.html)
- [DeepSeek Increases Prices for AI Services by Multiple Times - Bloomberg（via Yahoo Finance）](https://finance.yahoo.com/technology/ai/articles/deepseek-increases-prices-ai-services-125256361.html)
- [DeepSeek Launches V4-Pro and Raises API Prices by as Much as 1,100% - Caixin Global](https://www.caixinglobal.com/2026-08-14/deepseek-launches-v4-pro-and-raises-api-prices-by-as-much-as-1100-102473919.html)
- [DeepSeek's AI Models Are About To Cost Four Times More - Engadget](https://www.engadget.com/2236912/deepseek-ai-models-get-four-times-pricier/)
