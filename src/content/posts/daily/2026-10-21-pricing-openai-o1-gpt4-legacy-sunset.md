---
title: "定價追蹤｜OpenAI 一次關閉 o1、GPT-4、GPT-3.5-turbo 等 12 個舊模型"
date: 2026-10-21
category: daily
type: digest
tags: [ai-agent, pricing, daily, openai]
lang: zh-TW
description: "OpenAI 將於 2026-10-23 關閉 o1、o1-pro、o3-mini、o4-mini、GPT-4、GPT-4 Turbo、GPT-3.5-turbo 等 12 個舊模型的 API 存取，官方建議全部遷移至 GPT-5.6 系列"
tldr: "OpenAI 官方 deprecations 頁面列出 10/23 關閉的舊模型中，o1 遷移到 GPT-5.6 Sol 後 input 從 $15 降到 $4（↓73%）、output 從 $60 降到 $20（↓67%），但 o3-mini／o4-mini 遷移後反而變貴 1.8～3.6 倍。還在呼叫這些 model ID 的程式碼，三天內會直接收到 API 錯誤。"
series:
  name: "AI Pricing Watch"
  order: 26
---

> 🌏 [English version](/posts/daily/2026-10-21-pricing-openai-o1-gpt4-legacy-sunset-en)

## 變更摘要

OpenAI 的 API deprecations 頁面在 4 月就公告、10/23 正式生效：o1、o1-pro、o3-mini、o4-mini 四個推理模型，連同 GPT-4、GPT-4 Turbo、GPT-3.5-turbo 系列和 GPT Image 1 等共 12 個 model ID，將同時從 API 下架。這不是漸進式降速或警告視窗，是硬關閉——還在呼叫這些 model ID 的請求會直接回 API 錯誤。對照官方定價表才會發現,這批遷移的經濟後果完全不對稱:最貴的 o1 換成 GPT-5.6 Sol 大降價,但最便宜的 o3-mini／o4-mini 換成同一個目標模型反而漲價超過 3 倍。

## 前後對照

| 項目 | 舊 | 新（官方建議替代） | 變化 | 生效日 |
|---|---|---|---|---|
| o1 Input | $15.00/1M tokens | $4.00/1M tokens（GPT-5.6 Sol） | ↓73% | 2026-10-23 |
| o1 Output | $60.00/1M tokens | $20.00/1M tokens（GPT-5.6 Sol） | ↓67% | 2026-10-23 |
| o1 Cached Input | $7.50/1M tokens | $0.40/1M tokens（GPT-5.6 Sol） | ↓95% | 2026-10-23 |
| o1-pro Input | $150.00/1M tokens | $4.00/1M tokens（GPT-5.6 Sol, reasoning.mode: pro） | ↓97% | 2026-10-23 |
| o1-pro Output | $600.00/1M tokens | $20.00/1M tokens（GPT-5.6 Sol, reasoning.mode: pro） | ↓97% | 2026-10-23 |
| o3-mini Input | $1.10/1M tokens | $4.00/1M tokens（GPT-5.6 Sol） | ↑264% | 2026-10-23 |
| o3-mini Output | $4.40/1M tokens | $20.00/1M tokens（GPT-5.6 Sol） | ↑355% | 2026-10-23 |
| o4-mini Input | $1.10/1M tokens | $2.00/1M tokens（GPT-5.6 Terra） | ↑82% | 2026-10-23 |
| o4-mini Output | $4.40/1M tokens | $12.00/1M tokens（GPT-5.6 Terra） | ↑173% | 2026-10-23 |
| GPT-4 Turbo Input | $10.00/1M tokens | $4.00/1M tokens（GPT-5.6 Sol） | ↓60% | 2026-10-23 |
| GPT-4 Turbo Output | $30.00/1M tokens | $20.00/1M tokens（GPT-5.6 Sol） | ↓33% | 2026-10-23 |
| GPT-3.5-turbo Input | $0.50/1M tokens | $2.00/1M tokens（GPT-5.6 Terra） | ↑300% | 2026-10-23 |
| GPT-3.5-turbo Output | $1.50/1M tokens | $12.00/1M tokens（GPT-5.6 Terra） | ↑700% | 2026-10-23 |

## 成本試算

**場景**：一個每天跑 10,000 次請求的分類 Agent，原本用 o3-mini 做路由判斷（平均每次 800 input + 300 output tokens）

| | 舊定價（o3-mini） | 新定價（GPT-5.6 Sol） | 月增 |
|---|---|---|---|
| Input 成本/月 | $264 | $960 | $696 |
| Output 成本/月 | $396 | $1,800 | $1,404 |
| **合計** | **$660/月** | **$2,760/月** | **$2,100（↑318%）** |

這個場景故意選 o3-mini，因為它是這批關閉模型裡最容易被低估的一個——官方只給一個遷移建議（GPT-5.6 Sol），沒有同時提供一個「價格相近」的選項。如果你的用量是分類、路由這類輕量任務，繼續照官方建議搬到 Sol 等於把帳單乘以 3 倍以上；更合理的做法通常是改用更便宜的 GPT-5.6 Terra 或 GPT-6 Luna，自己測過品質再決定，而不是照單全收 deprecations 頁面上的「Recommended replacement」。

## 對開發者/企業的影響

### 誰最受益

還在用 o1 或 o1-pro 跑高強度推理任務的團隊受益最大——o1-pro 的 output 從 $600/1M 降到 $20/1M，降幅 97%，這等級的降價在這次批次裡絕無僅有。反過來,用 o3-mini／o4-mini／GPT-3.5-turbo 做大量低成本分類或路由的團隊,官方建議的遷移路徑會讓帳單不減反增。

### 競爭格局影響

批次內各模型遷移後的新落點（input / output，USD/1M tokens）：

| 遷移路徑 | 舊模型 | 新模型 | 新價格 |
|---|---|---|---|
| 推理旗艦 | o1 / o1-pro / o3-mini | GPT-5.6 Sol | $4.00 / $20.00（促銷價，至少到 2026-11-21） |
| 中階 | o4-mini / GPT-3.5-turbo | GPT-5.6 Terra | $2.00 / $12.00 |
| 舊世代旗艦 | GPT-4 / GPT-4 Turbo | GPT-5.6 Sol | $4.00 / $20.00 |
| 圖像生成 | GPT Image 1 | GPT Image 2.5 Sunburst/Flare | $8.00 / $30.00（圖像輸出） |

值得注意的是,GPT-5.6 Sol 目前是促銷價,官方只承諾「至少維持到 11/21」——用它接住 o1/o3-mini/GPT-4 三條完全不同成本結構的舊模型,等於把價格風險全部疊在同一個促銷視窗上,促銷結束後的實際影響還要再算一次。

### 行動建議

- 如果你在用 o1 或 o1-pro：直接遷移到 GPT-5.6 Sol，價格和能力都是淨賺，優先處理。
- 如果你在用 o3-mini 或 o4-mini 做分類/路由這類輕量任務：先用 GPT-6 Luna 或 GPT-5.6 Luna 跑一次 eval，大機率比官方建議的 Sol/Terra 便宜很多，不要照 deprecations 頁面直接搬。
- 如果你還有程式碼在呼叫 `gpt-4-0613`、`gpt-3.5-turbo-0125`、`o1-2024-12-17` 這類具體 model ID（而不是別名）：10/23 之後這些 ID 會直接回錯誤，不是降速或警告，現在就排查。
- 如果你用 `GET /v1/models` 的 `shutdown_date` 欄位做自動化監控：這批模型的欄位已經是 `2026-10-23`，可以用這個欄位提前抓出所有受影響的呼叫。

## 時效提醒（如有促銷/sunset）

⚠️ **停用日期**：2026-10-23。o1、o1-pro、o3-mini、o4-mini、`gpt-4-0613`、`gpt-4-turbo-2024-04-09`、`gpt-4-1106-preview`、`gpt-4.1-nano`、`gpt-4o-2024-05-13`、`gpt-image-1` 及對應微調版本將全部從 API 移除。遷移指南：[OpenAI Deprecations](https://developers.openai.com/api/docs/deprecations)。

## 今日收穫

這批關閉最反直覺的地方不是「舊模型要換」,是官方的「Recommended replacement」欄位把差異巨大的成本結構壓進同一個建議裡——o1 降價 73%、o3-mini 漲價 264%,兩者的官方替代都寫著「gpt-5.6-sol」。deprecations 頁面回答的是「哪個模型還能跑」,不是「換了以後帳單會怎麼變」,這兩件事看起來像同一張表,其實是兩個完全不相關的問題,只看遷移建議不算價格就上線,是這次批次最容易踩的坑。

## 參考資料

- [OpenAI API Deprecations](https://developers.openai.com/api/docs/deprecations)
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)
- [OpenAI API Pricing 2026: GPT-6 Astra, GPT-6.1 Sol Cost Table - Value Add VC](https://valueaddvc.com/blog/openai-api-pricing-2026-gpt-4o-o3-and-gpt-5-cost-breakdown-for-developers)
