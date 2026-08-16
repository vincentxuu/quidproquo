---
title: "定價追蹤｜DeepSeek 引入尖峰計價，V4-Pro 尖峰時段價格暴漲逾10倍"
date: 2026-08-16
category: daily
tags: [ai-agent, pricing, daily, deepseek]
lang: zh-TW
description: "DeepSeek 從今天 16:00 UTC 起為 V4-Pro／V4-Flash 導入尖峰／離峰雙軌計價，尖峰時段 V4-Pro cache-hit input 價格暴漲超過1,100%，正式結束「不計成本搶市佔」的定價策略"
tldr: "DeepSeek 今日（2026-08-16）16:00 UTC 起從單一定價轉為尖峰／離峰雙軌計價。V4-Pro 尖峰時段 cache-hit input 從 $0.003625 漲到 $0.044/1M tokens（↑1,114%），output 從 $0.87 漲到 $3.96（↑355%）；離峰時段漲幅較溫和（output ↑128%）。V4-Flash 同步調整，尖峰 output 漲幅 371%。這是目前主要模型供應商中首個明確導入時段差別定價的案例。"
series:
  name: "AI Pricing Watch"
  order: 1
---

## 變更摘要

DeepSeek 官方定價頁面確認，從今天（2026-08-16）16:00 UTC 起，V4-Pro 與 V4-Flash 從沿用已久的單一定價改為「尖峰／離峰」雙軌計價——離峰價是尖峰價的一半。表面上看是一次漲價（Caixin Global 報導「部分費率漲幅高達1,100%」），但更值得注意的是定價機制本身的轉變：這是目前主要模型供應商中第一個明確導入時段差別計價的案例，標誌著 DeepSeek 從「以低價搶市佔」轉向「用尖峰時段反映真實算力稀缺成本」。

## 前後對照

尖峰時段定義為 01:00–04:00 及 06:00–10:00 UTC（對應北京時間 09:00–12:00、14:00–18:00），其餘 17 小時為離峰時段。

| 項目 | 舊（單一價） | 新・離峰 | 新・尖峰 | 離峰漲幅 | 尖峰漲幅 | 生效日 |
|---|---|---|---|---|---|---|
| V4-Pro Cache-hit Input | $0.003625/1M | $0.022/1M | $0.044/1M | ↑507% | ↑1,114% | 2026-08-16 16:00 UTC |
| V4-Pro Cache-miss Input | $0.435/1M | $0.66/1M | $1.32/1M | ↑52% | ↑203% | 2026-08-16 16:00 UTC |
| V4-Pro Output | $0.87/1M | $1.98/1M | $3.96/1M | ↑128% | ↑355% | 2026-08-16 16:00 UTC |
| V4-Flash Cache-hit Input | $0.0028/1M | $0.007/1M | $0.014/1M | ↑150% | ↑400% | 2026-08-16 16:00 UTC |
| V4-Flash Cache-miss Input | $0.14/1M | $0.22/1M | $0.44/1M | ↑57% | ↑214% | 2026-08-16 16:00 UTC |
| V4-Flash Output | $0.28/1M | $0.66/1M | $1.32/1M | ↑136% | ↑371% | 2026-08-16 16:00 UTC |

Cache-hit input 的相對漲幅最驚人（V4-Pro 尖峰 ↑1,114%），但絕對金額仍很小（$0.003625 → $0.044）；真正決定帳單大小的是 cache-miss input 與 output 這兩項，漲幅分別落在 52%–371% 之間。

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens，對話內容多變、cache-miss 為主），使用 V4-Pro。

- 每日 input：10,000 × 1,500 = 15,000,000 tokens → 每月 450M tokens
- 每日 output：10,000 × 500 = 5,000,000 tokens → 每月 150M tokens

| | 舊定價（單一價） | 新定價・離峰 | 新定價・尖峰 |
|---|---|---|---|
| Input 成本/月 | $195.75 | $297.00 | $594.00 |
| Output 成本/月 | $130.50 | $297.00 | $594.00 |
| **合計** | **$326.25** | **$594.00（↑82%）** | **$1,188.00（↑264%）** |

如果 Agent 24 小時不間斷運行（尖峰時段佔全天 7/24 ≈ 29%），混合月費大約落在 $686–$780 之間，比舊定價貴 110%–139%——遠低於「1,100%」這個 headline 數字給人的第一印象，但仍是實質性的成本上升。

## 對開發者/企業的影響

### 誰受衝擊最大

高 cache-hit 比例的工作負載（長期複用 system prompt、RAG 共享文件、多輪對話的歷史 context）相對漲幅最大——尖峰時段 cache-hit input 漲超10倍。這類應用過去正是靠 DeepSeek 極低的 cache 命中價格建立成本優勢，現在這個優勢正在快速縮小。24/7 不間斷運行、無法排程避開尖峰時段的 Agent，也會直接承受尖峰價格的衝擊。

### 競爭格局影響

調整後 DeepSeek 仍是價格最低的第一梯隊模型之一，但已經從「斷層式最低價」變成「與其他廉價模型同一量級」：

| 模型 | Input（cache-miss，USD/1M） | Output（USD/1M） | 備註 |
|---|---|---|---|
| Mistral Small 4 | $0.15 | $0.60 | 未變動 |
| GPT-5.6 Luna | $0.20 | $1.20 | 7/30 已降價 |
| DeepSeek V4-Flash（新・離峰） | $0.22 | $0.66 | 仍便宜於 Luna |
| MiniMax M3 | $0.30 | $1.20 | 未變動 |
| DeepSeek V4-Flash（新・尖峰） | $0.44 | $1.32 | Output 已貴於 Luna |
| GLM-5.2 | $1.40 | $4.40 | 未變動 |
| DeepSeek V4-Pro（新・離峰） | $0.66 | $1.98 | 仍大幅便宜於 Sonnet/Terra |
| Claude Sonnet 5（促銷價，至 8/31） | $2.00 | $10.00 | — |
| GPT-5.6 Terra | $2.00 | $12.00 | 7/30 已降價 |
| DeepSeek V4-Pro（新・尖峰） | $1.32 | $3.96 | 仍便宜於 Sonnet/Terra |

V4-Flash 尖峰時段的 output 價格（$1.32）首次超過 GPT-5.6 Luna（$1.20）——這是 DeepSeek 低價模型第一次在任何時段被 OpenAI 的對應產品線反超。V4-Pro 無論尖峰或離峰，output 仍明顯便宜於 Claude Sonnet 5 與 GPT-5.6 Terra，價格護城河還在，只是變窄了。

### 行動建議

- 如果你能把批次任務排程到離峰時段（避開 UTC 01:00–04:00 與 06:00–10:00，也就是北京時間 09:00–12:00 與 14:00–18:00）：離峰價漲幅明顯較溫和（V4-Pro output 只漲 128%），值得把 cron/batch job 移到這兩個時段之外
- 如果你的 Agent 是 24/7 常駐服務、無法排程：用混合尖離峰比例（約 29% 尖峰）重新試算月費，V4-Pro 客服場景大約上漲 110%–139%，先確認這個漲幅是否還在預算內
- 如果你原本靠 V4-Flash 的極低價做大量簡單分類/抽取任務：尖峰時段它已經不再是價格最低選項，值得跟 GPT-5.6 Luna、Mistral Small 4 重新比價
- 如果你的工作負載高度依賴 prompt cache（長 system prompt、共享 RAG context）：cache-hit 漲幅最大，評估看看是否該把重複內容改放進離峰批次處理，或改用 cache 漲幅較小的供應商

## 時效提醒

⏰ **新定價生效時間**：2026-08-16 16:00 UTC（台北時間 2026-08-17 00:00）。這是官方定價頁面上標注的生效時間點，今天之內送出的請求仍按舊定價計費，之後的請求一律按新的尖峰/離峰雙軌價格計費。

## 今日收穫

多數報導把這次調整簡化成「DeepSeek 漲價1,100%」的驚悚標題，但真正的結構性變化其實是計價機制本身——DeepSeek 是目前主要模型供應商裡第一個明確導入「尖峰/離峰」時段差別定價的案例。這暗示一件事：靠單一超低價打價格戰搶市佔的階段可能正在過去，下一步比的是「誰能把算力稀缺成本更精細地轉嫁給使用者」，而不是單純比誰的掛牌價更低。如果這個模式被其他中國廠商跟進，開發者未來評估「最便宜模型」時，可能不能只看掛牌價，還得把使用時段這個變數也算進去。

## 參考資料

- [Models & Pricing — DeepSeek API Docs](https://api-docs.deepseek.com/quick_start/pricing/)
- [DeepSeek Launches V4-Pro and Raises API Prices by as Much as 1,100% — Caixin Global](https://www.caixinglobal.com/2026-08-14/deepseek-launches-v4-pro-and-raises-api-prices-by-as-much-as-1100-102473919.html)
- [DeepSeek Releases Official V4-Flash Model as China's AI Race Intensifies — Caixin Global](https://www.caixinglobal.com/2026-08-01/deepseek-releases-official-v4-flash-model-as-chinas-ai-race-intensifies-102470292.html)
