---
title: "定價追蹤｜OpenAI 公告 GPT-4o／GPT-4.1 明年 1 月 14 日 API 下架"
date: 2026-10-16
category: daily
type: digest
tags: [ai-agent, pricing, daily, openai]
lang: zh-TW
description: "OpenAI 於 2026/10/14 公告 GPT-4o、GPT-4o mini、GPT-4.1、GPT-4.1 mini 將於 2027/1/14 自 API 下架，建議替代 gpt-6-luna，token 價最多省 96%，但多了推理延遲與輸出量變數。"
tldr: "OpenAI 10/14 公告 GPT-4o 系列（GPT-4o、GPT-4o mini、GPT-4.1、GPT-4.1 mini，含其 fine-tune 版本）將於 2027-01-14 從 API 下架，建議遷移至 gpt-6-luna。token 價 GPT-4o input 從 $2.50 降到 $0.10（↓96%）、output 從 $10.00 降到 $0.50（↓95%），但 gpt-6-luna 是推理模型，預設 medium effort 會多產生 reasoning token、Chat Completions 要把 effort 設成 none 才能用 function calling，實際省下的錢比表面數字小。"
series:
  name: "AI Pricing Watch"
  order: 23
---

> 🌏 [English version](/posts/daily/2026-10-16-pricing-openai-gpt-4o-gpt-4-1-api-sunset-en)

## 變更摘要

OpenAI 在 2026 年 10 月 14 日對 API 開發者發出通知：GPT-4o、GPT-4o mini、GPT-4.1、GPT-4.1 mini 這五個 snapshot（含所有 fine-tune 版本）將在 2027 年 1 月 14 日從 API 下架，官方指定的唯一替代是 gpt-6-luna。這批模型在 GPT-5 於 2025 年 8 月上線之前，是最多 chatbot 建置工具、自動化平台預設塞進去的模型——換句話說，受影響的不是還在盯著模型清單的團隊，而是 2024 年設好就沒人再碰過的整合。三個月的下架通知期，比 OpenAI 自家「正式發布模型至少 6 個月」的政策短了一半，官方頁面沒說理由。

## 前後對照

| 項目 | 舊 | 新（官方建議替代：gpt-6-luna） | 變化 | 生效日 |
|---|---|---|---|---|
| GPT-4o Input | $2.50/1M tokens | $0.10/1M tokens | ↓96% | 2027-01-14 |
| GPT-4o Output | $10.00/1M tokens | $0.50/1M tokens | ↓95% | 2027-01-14 |
| GPT-4o mini Input | $0.15/1M tokens | $0.10/1M tokens | ↓33% | 2027-01-14 |
| GPT-4o mini Output | $0.60/1M tokens | $0.50/1M tokens | ↓17% | 2027-01-14 |
| GPT-4.1 Input | $2.00/1M tokens | $0.10/1M tokens | ↓95% | 2027-01-14 |
| GPT-4.1 Output | $8.00/1M tokens | $0.50/1M tokens | ↓94% | 2027-01-14 |
| GPT-4.1 mini Input | $0.40/1M tokens | $0.10/1M tokens | ↓75% | 2027-01-14 |
| GPT-4.1 mini Output | $1.60/1M tokens | $0.50/1M tokens | ↓69% | 2027-01-14 |

gpt-6-luna 在超過 272K input tokens 的請求上，input 加收 2 倍、output 加收 1.5 倍——長文件或長對話歷史的用量不要直接套上表中的基礎價。另外 context window 從 GPT-4o 的 128K、GPT-4.1 的 1,047,576 擴大到統一的 1,050,000，單次最大輸出從 16,384–32,768 拉高到 128,000。

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens），原本跑在 GPT-4o 上，遷移到 gpt-6-luna 且把 reasoning effort 設為 none（維持跟舊模型相近的輸出行為）。

| | GPT-4o（舊） | gpt-6-luna（新） | 月省 |
|---|---|---|---|
| Input 成本/月（450M tokens） | $1,125 | $45 | $1,080 |
| Output 成本/月（150M tokens） | $1,500 | $75 | $1,425 |
| **合計** | **$2,625/月** | **$120/月** | **$2,505（↓95.4%）** |

這張表假設 effort 設為 none、輸出 token 數跟舊模型差不多。如果維持 gpt-6-luna 預設的 medium effort，模型會在正式回答前先生成一段 reasoning，這段文字按 output 價計費——同樣的 150M 輸出 token 預算，可能有一部分被 reasoning 占走，實際省下的金額會比 95.4% 少，而且回覆延遲會變高。

## 對開發者/企業的影響

### 誰最受益

把 output 比例壓到最低、且任務夠簡單（分類、擷取、固定格式轉換）的工作負載受益最大——這類任務可以直接把 effort 設成 none，拿到接近表格裡的滿額折扣，又不用承擔推理延遲。反過來，把 GPT-4o 當成「快速、不囉嗦」的客服 bot 在用的團隊,如果照預設把 reasoning 開著遷移，會發現回覆變慢、token 數對不上舊的監控閾值。

### 競爭格局影響

遷移後 gpt-6-luna 在目前的入門/生產模型定價排名中落在哪裡（USD/1M tokens，2026-10-15 快照）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| **GPT-6 Luna（遷移目標）** | **$0.10** | **$0.50** | OpenAI 最便宜的文字模型 |
| Claude Haiku 5.5 | $0.10 | $0.50 | 與 GPT-6 Luna 完全持平 |
| Gemini 3.8 Flash | $0.75 | $3.75 | 促銷價至 2026-12-31，之後 $1.50/$7.50 |
| Claude Sonnet 5.5 | $2.00 | $10.00 | 中階旗艦 |
| GPT-6.1 Sol | $2.00 | $10.00 | 中階旗艦，與 Sonnet 5.5 同價 |
| GPT-6 Astra | $10.00 | $50.00 | OpenAI 最貴旗艦 |

GPT-6 Luna 跟 Claude Haiku 5.5 打成平手，兩家最便宜的生產級模型第一次完全同價——過去 GPT-4o mini／GPT-4.1 mini 跟 Claude Haiku 系列還有差距,這次下架通知等於把 OpenAI 的入門價直接拉到跟 Anthropic 同一條線上。

### 行動建議

- 用 List models endpoint（`GET /v1/models`）查每個正在用的 model ID 的 `shutdown_date` 欄位，不是 null 就排進遷移清單——這比翻 dashboard 用量快。
- 第三方工具（chatbot builder、自動化平台）常把模型選擇藏在下拉選單後面，而且常常是廠商持有金鑰：逐一打開確認目前用的模型，廠商自己隱藏模型名稱的話，用書面方式問清楚他們的遷移時程。
- 只做分類、擷取、固定格式輸出的呼叫：把 reasoning effort 設成 none,留在 Chat Completions,換模型即可,不用改架構。
- 需要工具呼叫且想保留推理能力的呼叫：改走 Responses API、保留預設 effort,這條路工程成本較高但效果通常更好。
- 已經用 fine-tune 版本的團隊要注意：2027-01-06 之後不能再對這些基礎模型建立新的 fine-tuning job，要重新訓練請在這天之前動作，比下架日期本身早 8 天。
- 同一批公告裡還有兩個日期容易被漏掉：2026-10-23 下架的 `gpt-4o-2024-05-13`（GPT-4o 最早期版本）與 `gpt-4.1-nano`，官方建議替代是 gpt-5.6-sol／gpt-5.6-luna（不是 gpt-6-luna），因為那則通知在 GPT-6 系列推出前就發布了。盤點模型用量時一次查完,不要漏掉這兩個 ID。

## 時效提醒

⚠️ **停用日期**：2027-01-14。GPT-4o（`gpt-4o-2024-08-06`、`gpt-4o-2024-11-20`）、GPT-4o mini（`gpt-4o-mini-2024-07-18`）、GPT-4.1（`gpt-4.1-2025-04-14`）、GPT-4.1 mini（`gpt-4.1-mini-2025-04-14`）及其所有 fine-tune 版本將從 API 全面下架，過期請求會直接失敗。遷移指南：[OpenAI Deprecations](https://developers.openai.com/api/docs/deprecations)。

## 今日收穫

這次通知期只給三個月，比 OpenAI 自己寫在同一頁的「正式發布模型至少 6 個月」政策短了一半，而頁面上完全沒解釋為什麼 GPT-4o／GPT-4.1 這批「活躍的正式發布模型」套用了更短的時程。過去追蹤 deprecation 都假設官方公告的通知期就是底線,這次提醒我們：政策文件寫的是「最低保證」,不是「實際執行」,真正該做的是把 `shutdown_date` 欄位查詢做成排程檢查,而不是相信官方會一直給滿六個月。

## 參考資料

- [Deprecations | OpenAI API（官方下架公告原始資料）](https://developers.openai.com/api/docs/deprecations)
- [GPT-4o and GPT-4.1 Leave OpenAI's API on January 14, 2027 | Digital Applied](https://www.digitalapplied.com/blog/gpt-4o-gpt-4-1-api-shutdown-january-2027)
- [AI Token Prices 2026 — AI Model Pricing Compared | AI Pricing Guru（gpt-6-luna／Claude Haiku 5.5／Gemini 3.8 Flash 等同期定價快照）](https://www.aipricing.guru/pricing/)
