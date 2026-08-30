---
title: "定價追蹤｜OpenAI Assistants API 正式停用，遷移選模型牽動成本"
date: 2026-08-30
category: daily
tags: [ai-agent, pricing, daily, openai]
lang: zh-TW
description: "OpenAI Assistants API 已於 2026-08-26 正式停用，無降級模式也無官方遷移工具；被迫遷移到 Responses/Conversations API 時選 Sol 還是 Terra，同一個工作量的月成本可以差到 44%"
tldr: "OpenAI Assistants API（/v1/assistants、/v1/threads、/v1/threads/runs）已於 2026-08-26 正式停用，一年前公告、零延長、無自動遷移工具。這本身不是定價變動，但停用逼你重新選模型——原本掛在 Assistants 上的 o3（$2.00/$8.00，每百萬 tokens input/output）沒有直接替代品，官方建議換成 GPT-5.6 Sol（$4.00/$20.00，成本 ↑129%），但實務上 Terra（$2.00/$12.00，↑29%）在多數場景已經夠用，兩者差 44%。"
series:
  name: "AI Pricing Watch"
  order: 7
---

> 🌏 [English version](/en/posts/daily/2026-08-30-pricing-openai-assistants-api-sunset-en)

## 變更摘要

OpenAI 在 2025-08-26 公告一年後的停用時程，2026-08-26 準時執行：Assistants API（`/v1/assistants`、`/v1/threads`、`/v1/threads/runs`）全面停止服務，呼叫這三組端點一律回傳錯誤，沒有降級模式，也沒有延長選項。OpenAI 官方在遷移指南裡明講不會提供 Threads 自動搬到 Conversations API 的工具，開發者得自己把歷史訊息一筆一筆讀出來重建。這篇不是傳統的「舊價降新價」，但完全符合本欄「API sunset / deprecation 公告」的追蹤範圍——而且它間接觸發一次真實的成本變動：被迫遷移的同時，你也被迫重新選模型，而選 OpenAI 官方推薦的模型還是社群驗證過的替代方案，同一個工作量的月費可以差到 44%。

## 前後對照

| 項目 | 舊 | 新 | 變化 | 生效日 |
|---|---|---|---|---|
| Assistants API 端點（`/v1/assistants`、`/v1/threads`、`/v1/threads/runs`） | 可用（beta） | 全部回傳錯誤，無降級模式 | 服務終止 | 2026-08-26 |
| 對話狀態管理 | Threads（OpenAI 伺服器端維護） | Conversations API（歷史訊息需自行搬遷） | 架構變更，無自動遷移工具 | 2026-08-26 |
| 原本常見組合：o3（透過 Assistants） | $2.00/1M input、$8.00/1M output | 官方建議改用 GPT-5.6 Sol | Input ↑100%、Output ↑150% | 2026-08-26 起需遷移完成 |
| 成本優化替代 | — | GPT-5.6 Terra：$2.00/1M input、$12.00/1M output | Input 持平、Output ↑50%（相對 o3） | 同上 |

## 成本試算

**場景**：一個原本用 o3 搭配 Assistants API 跑客服 Agent，每天處理 10,000 則對話（平均每則 1,500 input tokens + 500 output tokens），月用量約 450M input tokens、150M output tokens。

| | o3（舊，透過 Assistants API） | GPT-5.6 Sol（官方推薦替代） | GPT-5.6 Terra（性價比替代） |
|---|---|---|---|
| Input 成本/月 | $900 | $1,800 | $900 |
| Output 成本/月 | $1,200 | $3,000 | $1,800 |
| **合計** | **$2,100/月** | **$4,800/月（↑129%）** | **$2,700/月（↑29%）** |

換 Sol 比原本用 o3 貴 129%，換 Terra 只貴 29%——而 Terra 又比 Sol 便宜 44%（$2,700 vs $4,800）。這個差距完全來自被迫遷移這件事本身，跟「哪個模型比較新、比較強」無關，是純粹的架構決策成本。

## 對開發者/企業的影響

### 誰最受衝擊

還在生產環境用 Assistants API + Threads 維護長對話狀態的團隊受衝擊最大——這是一次沒有寬限期的硬停用，8/26 之後這些呼叫直接變成正式事故，不是「即將棄用」的提醒信。Zapier 已經先一步把用到 Assistants API 的 Conversation With Assistant 等步驟從編輯器移除，使用者得手動重建成新的 Conversation（Responses API）動作，沒有自動遷移。

### 定價／生命週期政策的落差

OpenAI 自己的通知期政策寫得很明白：GA 模型至少 6 個月通知期，preview 模型可能只有 2 週。Assistants API 掛的是 beta 標籤，拿到的是「一年公告、零寬限期、無自動遷移工具」的待遇——比 GA 模型的下架流程更急、比多數 preview 模型的通知期更長，落在政策條文沒有明確覆蓋的中間地帶。這提醒一件事：beta 標籤不代表「隨時可能沒有」，也不代表「會照 GA 規格給你緩衝」，它是廠商自訂的第三種規則，得自己去讀公告，不能套用其他兩類的直覺。

### 行動建議

- 若還在打 Assistants API 三組端點：這是現在進行式的服務中斷，不是預告，先確認 log 有沒有還在呼叫，若有先切到任何暫時可用的路徑止血，再談完整遷移。
- 若在評估遷移後要換哪個模型：先用 Terra 跑一輪 eval，不要預設官方建議的 Sol 就是唯一答案——本篇試算顯示 Terra 在同樣工作量下便宜 44%，除非你的任務明確需要 Sol 的推理能力差距，否則 Terra 通常是更務實的預設值。
- 台灣讀者：不少台灣新創把 Assistants API 包成客服機器人或知識庫問答的後端（因為它省了自己維護對話狀態的功夫），這類產品現在要優先排查——先手動把 Thread ID 對應的歷史訊息讀出來備份，再規劃遷移到 Conversations API，不要等官方工具，官方已經明講不會做。

## 時效提醒

⚠️ **停用日期**：2026-08-26（已生效，非預告）。呼叫 `/v1/assistants`、`/v1/threads`、`/v1/threads/runs` 一律回傳錯誤，無降級模式、無延長選項。遷移指南：[Assistants migration guide](https://developers.openai.com/api/docs/assistants/migration)。

## 今日收穫

過去追蹤定價變動習慣盯著「$/1M tokens」的數字，但這次的真正成本藏在別的地方：一個標成 beta 的 API，公告一年後準時下架、零寬限期、無自動遷移工具，這件事本身就會逼出一次隱性的定價決策——你被迫在「照官方指示換新模型」和「自己驗證更便宜的替代品」之間選一個，而這兩者的價差（本例是 44%）跟任何一方的官方定價表變動都無關。追蹤 API 生命週期公告，某種意義上也是在追蹤下一筆會發生的成本。

## 參考資料

- [Deprecations | OpenAI API](https://developers.openai.com/api/docs/deprecations)
- [Assistants migration guide | OpenAI API](https://developers.openai.com/api/docs/assistants/migration)
- [Pricing | OpenAI API](https://developers.openai.com/api/docs/pricing)
- [OpenAI Assistants API Shuts Down Tuesday: No Automated Migration, Threads at Risk — Tech Times](https://www.techtimes.com/articles/325345/20260824/openai-assistants-api-shuts-down-tuesday-no-automated-migration-threads-risk.htm)
- [OpenAI Assistants API Shutdown: The 2026 Migration Guide — ClonePartner](https://clonepartner.com/blog/openai-assistants-api-shutdown-the-2026-migration-guide)
