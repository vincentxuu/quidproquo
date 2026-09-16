---
title: "定價追蹤｜OpenAI 10/14 讓 GPT-5.5 從 ChatGPT／Codex 退場，API 不受影響"
date: 2026-09-17
category: daily
type: digest
tags: [ai-agent, pricing, daily, openai]
description: "OpenAI 宣布 GPT-5.5 將於 2026-10-14 從 ChatGPT、ChatGPT Work 與 Codex 全面下架，直接呼叫 OpenAI API 的 gpt-5.5 不受影響；Codex 用戶被導向的替代模型 GPT-5.6 Sol 反而更便宜"
tldr: "OpenAI 於 2026-09-14 公告：GPT-5.5 將於 2026-10-14 從 ChatGPT、ChatGPT Work、Codex 全部方案下架，但直接呼叫 OpenAI API 的 `gpt-5.5` 不受影響——這是產品層淘汰，不是 API 淘汰。官方定價表上 gpt-5.5 短內容 input/output 是 $5.00/$30.00（每百萬 tokens），Codex 官方導向的替代模型 GPT-5.6 Sol 是 $4.00/$20.00，換過去同時省錢（input ↓20%、output ↓33%）。從公告到下架只有一個月緩衝，比 OpenAI 自家文件寫的「GA 模型至少 6 個月通知期」短很多。"
series:
  name: "AI Pricing Watch"
  order: 9
---

> 🌏 [English version](/en/posts/daily/2026-09-17-pricing-openai-gpt-5-5-retirement-en)

## 變更摘要

OpenAI 在 2026-09-14 於官方 changelog 公告、9/15 用 @ChatGPT 官方帳號在 X 上重申：GPT-5.5 將於 2026-10-14 從 ChatGPT、ChatGPT Work、Codex 的所有方案（consumer、Business、Enterprise、Edu）下架。這篇不是傳統的「舊價降新價」，而是本欄第二次追蹤的「產品層淘汰」——跟 8/26 的 Assistants API 停用不一樣的是，這次官方明講「這個下架不適用於 OpenAI API」，直接拿 API key 呼叫 `gpt-5.5` 完全不受影響，只有透過 ChatGPT 帳號登入的 Codex 使用者被強制轉移。更值得記一筆的是：這次被迫換掉的模型，換成官方指定的替代品之後反而更便宜，跟 8 月那次「被迫遷移、成本上漲」的情況正好相反。

## 前後對照

| 項目 | 舊 | 新 | 變化 | 生效日 |
|---|---|---|---|---|
| GPT-5.5（短內容）Input | $5.00/1M tokens | GPT-5.6 Sol：$4.00/1M tokens | ↓20% | 2026-10-14 |
| GPT-5.5（短內容）Output | $30.00/1M tokens | GPT-5.6 Sol：$20.00/1M tokens | ↓33% | 2026-10-14 |
| GPT-5.5（短內容）Cached Input | $0.50/1M tokens | GPT-5.6 Sol：$0.40/1M tokens | ↓20% | 2026-10-14 |
| GPT-5.5（短內容）Batch Input/Output | $2.50/$15.00/1M tokens | GPT-5.6 Sol：$2.00/$10.00/1M tokens | ↓20%／↓33% | 2026-10-14 |
| 存取管道 | ChatGPT／ChatGPT Work／Codex／API 皆可用 | 僅 API 保留 `gpt-5.5`，ChatGPT／Codex 三個介面全部移除 | 產品層淘汰，API 不受影響 | 2026-10-14 |

## 成本試算

**場景**：一個透過 Codex（ChatGPT 帳號登入）跑的 coding agent，過去把模型釘死在 `gpt-5.5`，每天處理相當於 10,000 則對話的呼叫量（平均每則 1,500 input tokens + 500 output tokens），月用量約 450M input tokens、150M output tokens。這裡用官方 API 定價表的 $/token 數字換算，用意是呈現「換模型」本身的 token 經濟學差異，不代表 Codex 訂閱制底下的實際帳單結構。

| | GPT-5.5（舊） | GPT-5.6 Sol（官方指定替代） | 月省 |
|---|---|---|---|
| Input 成本/月 | $2,250 | $1,800 | $450 |
| Output 成本/月 | $4,500 | $3,000 | $1,500 |
| **合計** | **$6,750/月** | **$4,800/月** | **$1,950（↓29%）** |

跟 8 月 Assistants API 停用那次「被迫遷移、換完貴 29–129%」完全相反——這次被迫遷移的方向，剛好是往便宜、更新的模型移動，開發者不需要為了「不甘心被逼著換」而額外花力氣找替代方案。

## 對開發者/企業的影響

### 誰最受益

受影響最大的是把 `gpt-5.5` 這個模型 ID 寫死在 Codex custom agent、scheduled tasks、workspace 預設值裡的團隊——官方 changelog 明講要逐一檢查這幾個地方。相對地，任何用自己的 API key 直接打 `/v1/chat/completions` 或 `/v1/responses` 呼叫 `gpt-5.5` 的應用完全不受影響，可以繼續用到官方之後另外公告 API 層的淘汰時程為止。

### 產品淘汰 vs API 淘汰的政策落差

OpenAI 官方 API 文件寫得很明確：GA 模型的淘汰至少要提前 6 個月通知。但這次 GPT-5.5 從 ChatGPT／Codex 下架，公告日（2026-09-14）到生效日（2026-10-14）只隔一個月——這個落差不是政策沒被遵守，而是「6 個月通知期」這條規則本來就只寫給 API 端的模型淘汰，沒有覆蓋 ChatGPT／Codex 這種消費端產品介面的模型下架。8 月的 Assistants API 案例是「beta 標籤逃過 GA 規格的緩衝期」，這次是「產品介面的模型下架根本不在 API 淘汰政策的管轄範圍內」——同一家公司、同一份文件，管得到的地方和管不到的地方擺在一起看，才看得出保障邊界在哪裡。GPT-5.5 本身是 2026-04-23 上線，掐頭去尾在 ChatGPT／Codex 只活了不到 6 個月。

### 行動建議

- 若你在 Codex 裡用 ChatGPT 帳號登入且釘死 `gpt-5.5`：現在就去檢查 workspace 預設值、custom agent、scheduled tasks、腳本裡的模型設定，10/14 前手動切到 `gpt-5.6-sol`（官方指定路徑），部分報導提到 GPT-6 Astra 也可以作為進階選項，但官方 changelog 只明講 Sol 這一條遷移路徑。
- 若你是純 API key 使用者：這次公告不用理，`gpt-5.5` 繼續可用，但既然換成 GPT-5.6 Sol 同時更便宜、更新，值得找個空檔重新跑一輪 eval，看要不要主動升級而不是被動等下一次淘汰通知。
- 若你在幫團隊寫「模型下架監控」的內部流程：這次案例提醒一件事——別只盯著 `developers.openai.com/api/docs/deprecations` 這個 API 淘汰清單，ChatGPT／Codex 的產品層下架走的是完全不同的公告管道（changelog + 官方社群帳號），兩邊要分開追蹤。

## 時效提醒

⚠️ **停用日期**：2026-10-14。GPT-5.5 將從 ChatGPT、ChatGPT Work、Codex（consumer／Business／Enterprise／Edu 全部方案）下架，直接呼叫 OpenAI API 的 `gpt-5.5` 不受影響。Codex（ChatGPT 帳號登入）遷移指南：[GPT-5.5 retirement | ChatGPT Learn](https://learn.chatgpt.com/codex/models#gpt-55-retirement)。

## 今日收穫

過去追蹤「模型淘汰」習慣把它當成單一事件處理，這次才意識到同一家公司內部其實跑著兩套完全不同的淘汰治理：API 端有寫進文件的 6 個月最低通知期，ChatGPT／Codex 產品端沒有對應承諾，說退場就退場、緩衝期看官方心情。而且這次退場方向剛好是「換了更便宜」，跟直覺裡「被迫遷移＝多花錢」的預設相反——追蹤定價變動不能只看「漲了還是跌了」，還得先分清楚「這次被強制移動的是哪一層」，答案往往決定成本方向會不會跟你的直覺一樣。

## 參考資料

- [ChatGPT & Codex changelog（2026-09-14 GPT-5.5 retirement 條目）| ChatGPT Learn](https://learn.chatgpt.com/docs/changelog)
- [What's new | ChatGPT Learn](https://learn.chatgpt.com/docs/whats-new)
- [Pricing | OpenAI API](https://developers.openai.com/api/docs/pricing)
- [Deprecations | OpenAI API](https://developers.openai.com/api/docs/deprecations)
- [OpenAI retiring GPT-5.5 on October 14: you may need to update your workflow — Gizmochina](https://www.gizmochina.com/2026/09/16/openai-retiring-gpt-5-5-on-october-14-you-may-need-to-update-your-workflow/)
- [@ChatGPT on X（2026-09-15 官方公告貼文）](https://x.com/ChatGPT/status/2099954190600876533)
