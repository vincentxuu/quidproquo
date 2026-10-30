---
title: "定價追蹤｜Microsoft Foundry 模型退場時程脫鉤原廠：Haiku 4.5 剩兩週、Mistral 晚了近一年"
date: 2026-10-31
category: daily
type: digest
tags: [ai-agent, pricing, daily, microsoft, anthropic, mistral]
lang: zh-TW
description: "Microsoft Foundry 的第三方模型退場時程完全自訂：Claude Haiku 4.5 在 Foundry 只剩兩週就退場、Anthropic 自家平台卻仍列為 Active；Mistral Medium 3 與 Ministral 3B 早已在 Mistral 自家平台下架，Foundry 卻多留了 100 天到近一年才跟上"
tldr: "Microsoft Foundry 的模型退場時程不跟原廠走：Claude Haiku 4.5 在 Foundry 訂在 2026-11-15 退場（剩 2 週，且未列替代模型），但 Anthropic 自家 Claude API／AWS／Google Cloud 都仍列它為 Active；反過來，Mistral Medium 3（原廠已於 2026-08-31 退場）與 Ministral 3B（原廠已於 2025-12-31 退場）在 Foundry 卻要等到 2026-12-09 才跟進，分別晚了 100 天和 343 天。Anthropic 文件明寫 Foundry「遵循 Claude API 的生命週期時程」，但實際日期並不一致。"
series:
  name: "AI Pricing Watch"
  order: 29
---

> 🌏 [English version](/posts/daily/2026-10-31-pricing-azure-foundry-claude-haiku-mistral-retirement-mismatch-en)

## 變更摘要

Microsoft Foundry（原 Azure AI Foundry）的[模型退場時程表](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirement-schedule)這幾天透露出一件原廠文件沒講清楚的事：Foundry 上第三方模型的退場日，跟模型原廠自己的時程根本不是同一套。Claude Haiku 4.5 在 Foundry 上訂了 2026-11-15 退場、只剩兩週，而且退場表裡的「替代模型」欄位是空的；但同一天查 [Anthropic 自家的 model deprecations 頁](https://platform.claude.com/docs/en/about-claude/model-deprecations)，Haiku 4.5 仍列為 Active，連退場公告都還沒發。反過來，Mistral Medium 3（`mistral-medium-2505`）和 Ministral 3B（`ministral-3b-2410`）在 [Mistral 自家的退場表](https://docs.mistral.ai/models)裡早就下架——分別是 2026-08-31 和 2025-12-31——Foundry 卻一路讓它們掛著「GA」直到 2026-12-09 才要跟進，足足晚了 100 天和 343 天。更矛盾的是，Anthropic 自己的文件寫著「Foundry 遵循 Claude API 的生命週期時程」，但 Haiku 4.5 這筆的實際日期證明兩邊並不同步。同一個「Microsoft Foundry 自訂時程、不等於原廠時程」的根因，一邊讓你被迫提前兩週換代，一邊讓你多用（也多暴露在無上游維護風險中）將近一年，方向完全相反。

## 前後對照

| 模型 | 原廠（Anthropic／Mistral）狀態 | Microsoft Foundry 狀態 | 落差 | Foundry 生效日 |
|---|---|---|---|---|
| Claude Haiku 4.5 | Active，Anthropic 尚未公告退場（最早可能日 2026-10-15 已過，仍未發通知） | 已排定退場，替代模型欄位空白 | Foundry 比原廠早訂下退場日 | 2026-11-15 |
| Mistral Medium 3（`mistral-medium-2505`） | 已退場（Deprecated 2026-05-22 → Retired 2026-08-31） | 仍列 GA，標示替代為 Mistral Medium 3.5 | Foundry 晚 100 天才跟進 | 2026-12-09 |
| Ministral 3B（`ministral-3b-2410`） | 已退場（Deprecated 2025-12-02 → Retired 2025-12-31） | 仍列 GA | Foundry 晚 343 天（近一年）才跟進 | 2026-12-09 |

## 成本試算

**場景**：一個用 Claude Haiku 4.5 跑分類／路由的 Agent，部署在 Microsoft Foundry 上，每天處理 10,000 則客服對話（平均每則 1,500 input tokens + 500 output tokens，月用量約 450M input、150M output）。11/15 退場後 Foundry 沒列替代模型，但 Anthropic 自家現行的 Haiku 代次是 10/7 上市的 Claude Haiku 5.5，Foundry 上同樣有部署 ID，是最直接的接手對象。

| | Claude Haiku 4.5（舊，Foundry） | Claude Haiku 5.5（新，同樣可在 Foundry 部署） | 月省 |
|---|---|---|---|
| Input 成本/月 | $450 | $45 | $405 |
| Output 成本/月 | $750 | $75 | $675 |
| **合計** | **$1,200/月** | **$120/月（↓90%）** | **$1,080** |

Haiku 5.5 這個價是「prompt 在 10 萬 token 以內」的區間（本場景每則對話 2,000 tokens，遠低於門檮），超過 10 萬 token 的請求會跳到另一組較高價格。這次被迫換代反而降價 90%，純粹是因為 Anthropic 自己這一代 Haiku 砍了價，跟 Microsoft Foundry 的退場時程本身沒有關係。

## 對開發者/企業的影響

### 誰最受影響

透過 Microsoft Foundry（而非 Anthropic 或 Mistral 直接的 API）部署這幾個模型的團隊，尤其是只看 Foundry 控制台的「GA」標籤就假設模型還在原廠持續維護的人——GA 在 Foundry 自己的生命週期詞彙裡只代表「正式可用」，不代表原廠那邊也還在更新。

### 兩個方向都會踩雷

這不是單一方向的「廠商又要你趕快遷移」。Claude Haiku 4.5 的情況是 Foundry 比原廠更急：Anthropic 連退場公告都沒發，Foundry 卻已經排定兩週後的硬退場日，而且沒標替代模型，逼你自己去 Anthropic 的現行模型線裡找答案。Mistral 的兩個模型則是反過來：原廠已經停止維護超過三個月到快一年，Foundry 卻還讓它們掛著「正式可用」繼續收費、繼續跑——這段期間拿不到任何上游的安全性修補或行為改進，而 Foundry 的計費與可用性顯示上完全看不出這件事。

### 行動建議

- 用 Claude Haiku 4.5 透過 Foundry：11/15 前驗證 Claude Haiku 5.5 的輸出品質再換代，不要等 Foundry 自己標出替代模型（它不會標）。Haiku 5.5 用 Claude 4.7 之後的新斷詞器，同樣文字產生的 token 數會比舊版多約 30%，但本篇試算顯示即使算進這個差異，換代後的帳單仍是現在的十分之一。
- 用 Mistral Medium 3 或 Ministral 3B 透過 Foundry：不要被「GA」字樣誤導，先假設自己正在用一個原廠已經停止維護數月到快一年的模型，提前排遷移到 Mistral Medium 3.5（Mistral 官方標示的替代），不要等到 12/9 的最後期限才動手。
- 任何把同一個模型同時掛在 Anthropic API、Bedrock、Google Cloud、Microsoft Foundry 的團隊：不能只讀一份生命週期文件就假設全平台同步生效，Anthropic 自己的文件也寫錯了這件事——每個平台都要分別查自己的 retirement schedule 頁面，兩份日期對不上時,以你實際呼叫的那個平台的頁面為準。

## 時效提醒

⚠️ **Claude Haiku 4.5 在 Microsoft Foundry 停用日期**：2026-11-15（約 2 週後）。Foundry 官方退場表未列替代模型；Anthropic 自家平台（Claude API、Bedrock、Google Cloud）仍列 Haiku 4.5 為 Active，尚未公告退場。遷移建議：[Claude Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/overview)。

⚠️ **Mistral Medium 3／Ministral 3B 在 Microsoft Foundry 停用日期**：2026-12-09。兩個模型已分別在 Mistral 自家平台停用 100 天與 343 天，Foundry 期間缺乏上游維護。遷移建議：Mistral Medium 3.5。

## 今日收穫

過去追蹤 sunset 公告，預設方向是「原廠先公告，雲端平台跟著走、通常會晚一點收尾」。這次發現同一張 Foundry 退場表裡，兩種模型踩在完全相反的方向——Claude Haiku 4.5 比 Anthropic 自己還急著關，Mistral 的兩個模型卻拖了快一年才跟上——說明「跟著原廠走」只是 Microsoft 自己文件裡的說法，不是能拿來排程的事實。追蹤模型生命週期，現在得把「原廠的時程表」和「每個雲端平台自己的時程表」當成兩份獨立文件來核對，缺一份都可能錯過真正的硬期限。

## 參考資料

- [Model retirement schedule | Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirement-schedule)
- [Model deprecations | Anthropic](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Models Overview | Mistral Docs](https://docs.mistral.ai/models)
- [Pricing | Anthropic](https://platform.claude.com/docs/en/about-claude/pricing)
- [AI API changes in October 2026: what to act on, and when | INFRO](https://infro.io/blog/ai-api-changes-october-2026)
