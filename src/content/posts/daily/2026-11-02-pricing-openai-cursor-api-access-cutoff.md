---
title: "定價追蹤｜OpenAI 因 SpaceX 收購切斷 Cursor 模型存取，11/12 生效"
date: 2026-11-02
category: daily
type: digest
tags: [ai-agent, pricing, daily, openai, cursor]
lang: zh-TW
description: "OpenAI 因 Cursor 遭 SpaceX 收購觸發合約的變更控制權條款，宣布終止供應模型給 Cursor，提議停用日訂在 2026-11-12；算完 token 價格才發現，GPT-6.1 Sol 和 Claude Sonnet 5.5 的標準定價完全相同，技術上的切換成本是零"
tldr: "OpenAI 在 8/28 宣布終止向 Cursor 供應模型的合約，理由是 Cursor 遭 SpaceX 收購觸發了合約裡的變更控制權條款，提議停用日為 2026-11-12（距今約 10 天）；屆時 Cursor 裡的 OpenAI 模型需改用自備 API Key（BYOK）才能繼續用，且 OpenAI 未來模型（如 GPT-6.1 Astra）不會再提供給 Cursor。OpenAI 引用 Musk 旗下公司過去違反服務條款的紀錄作為理由；Cursor CEO 回應稱 OpenAI 模型僅占其流量 5%，雙方仍在協調。"
series:
  name: "AI Pricing Watch"
  order: 30
---

> 🌏 [English version](/posts/daily/2026-11-02-pricing-openai-cursor-api-access-cutoff-en)

## 變更摘要

OpenAI 在 8 月 28 日發布[官方聲明](https://openai.com/index/our-decision-on-cursor-following-its-acquisition-by-spacex/)，宣布終止向 AI 程式碼編輯器 Cursor 供應模型的合約，理由是 Cursor 遭 SpaceX 收購觸發了雙方合約裡的「變更控制權」條款，提議停用日訂在 2026-11-12——距今只剩約 10 天。這不是傳統的漲價或促銷，而是「供應鏈信任」問題：OpenAI 直接引用 Musk 旗下公司過去違反服務條款的紀錄作為理由，且聲明未來模型（如 GPT-6.1 Astra）不會再授權給 Cursor 使用，把「誰擁有客戶」也納入了模型供應決策。但算完 token 價格會發現這次衝擊被放大了——Cursor 使用者之後只要自備 OpenAI API Key（BYOK）就能照常用 GPT 模型，而且 GPT-6.1 Sol 和 Claude Sonnet 5.5 的標準定價剛好完全相同，真正的切換成本不是錢，是維運負擔和對供應商的信任。

## 前後對照

| 項目 | 現在 | 2026-11-12 後 | 變化 | 生效日 |
|---|---|---|---|---|
| Cursor 內建 OpenAI 模型存取 | 直接整合，走 Cursor 自家訂閱額度 | 停用，需自備 OpenAI API Key（BYOK） | 存取方式改變 | 2026-11-12 |
| OpenAI 未來模型（如 GPT-6.1 Astra）在 Cursor 的可用性 | 未開放 | 合約終止後不再提供 | 永久排除 | 2026-11-12 起 |
| GPT-6.1 Sol 單價（BYOK 後，走 OpenAI 自家 API） | Input $2.00／Output $10.00（每 1M tokens） | 不變 | 持平 | — |

## 成本試算

**場景**：一個在 Cursor 裡跑 coding agent 的團隊，每天 10,000 次程式碼請求（平均每次 2,000 input tokens 的程式碼上下文 + 800 output tokens 的建議/修改），試算繼續用 GPT-6.1 Sol（BYOK）、改用同價位的 Claude Sonnet 5.5，或改用促銷價的 Gemini 3.8 Flash 三種路徑的月成本。

| | GPT-6.1 Sol（BYOK，不變） | Claude Sonnet 5.5（切換） | Gemini 3.8 Flash（促銷價，切換） |
|---|---|---|---|
| Input 成本/月 | $1,200 | $1,200 | $450 |
| Output 成本/月 | $2,400 | $2,400 | $900 |
| **合計** | **$3,600** | **$3,600（持平）** | **$1,350（↓62.5%）** |

## 對開發者/企業的影響

### 誰最受益

Cursor 本身可能是這次事件裡敘事上最受益的一方——強迫走向「多模型中立、不被單一供應商綁架」的立場更站得住腳，而 SpaceX 體系內的 xAI Grok 也可能借勢在 Cursor 內取得更多預設曝光。對開發者來說，早就習慣在 Claude、Gemini、GPT 之間切換的團隊衝擊最小；受影響最大的是只靠 Cursor 內建額度跑 GPT、沒走 BYOK 的個人開發者或小團隊，11/12 後要自己去 OpenAI 平台辦 API Key 並自付額度。

### 競爭格局影響

牽涉這次事件的主要模型定價（input / output，USD/1M tokens）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| GPT-6 Luna / Claude Haiku 5.5（起） | $0.10 | $0.50 | 最便宜的高能力分層 |
| Gemini 3.8 Flash（促銷價，至 2026-12-31） | $0.75 | $3.75 | 2027-01-01 起漲回 $1.50/$7.50 |
| **GPT-6.1 Sol** | **$2.00** | **$10.00** | 這次事件的主角 |
| **Claude Sonnet 5.5** | **$2.00** | **$10.00** | 與 GPT-6.1 Sol 標準定價完全相同 |
| Claude Opus 5.5 | $4.00 | $20.00 | — |
| GPT-6 Astra | $10.00 | $50.00 | OpenAI 旗艦 |

### 行動建議

- 若你在 Cursor 裡主要用 GPT-6.1 Sol：11/12 前先到 OpenAI 平台申請自己的 API Key，在 Cursor 設定裡切到 BYOK，token 單價不變，差別只是帳單改由你自己的 OpenAI 帳戶出。
- 若想順便重新評估模型選擇：這次被迫遷移是個檢視時機——Claude Sonnet 5.5 同價可以直接換、不會多花錢；如果任務偏簡單的程式碼補全而非複雜 agentic 工作，Gemini 3.8 Flash 促銷價能再省 62.5%，但要注意它 2027-01-01 起價格就會翻倍。
- 若你的團隊也用 ChatGPT Work／Codex：OpenAI 另外公告，12 月起 Plus／Pro／Business 方案會把 ChatGPT 和 Codex 的用量額度合併計算（跟這次 Cursor 事件無關，但同月生效），建議一起排進 11-12 月的用量規劃。

## 時效提醒

⚠️ **停用日期**：2026-11-12（OpenAI 提議的停用日，約 10 天後；OpenAI 聲明這是合約允許的最長通知期，實際日期仍可能因雙方協商變動）。之後 Cursor 不再提供 OpenAI 模型的直接整合，請在此之前設定好 BYOK，或評估改用其他模型。

## 今日收穫

這次事件表面上是地緣政治式的供應鏈斷裂，但把 token 價格攤開來看才發現：GPT-6.1 Sol 和 Claude Sonnet 5.5 的標準定價完全相同（$2/$10），這不是巧合——當旗艦模型的性價比打到同一個價格點，「換不換模型」的決策權重已經從「哪家便宜」轉移到「維運、BYOK 管理成本」和「信不信任供應商」。OpenAI 用「不信任 SpaceX／xAI 會遵守使用條款」當作切斷存取的理由，某種程度上也證明模型層的競爭已經多了一個新變數：供應商之間的政治與信任風險，不只是比 token 單價的時代了。

## 參考資料

- [Our decision on Cursor following its acquisition by SpaceX | OpenAI](https://openai.com/index/our-decision-on-cursor-following-its-acquisition-by-spacex/)
- [OpenAI to end model access to Cursor after acquisition by SpaceX | CNBC](https://www.cnbc.com/2026/08/29/openai-cursor-spacex-model-access.html)
- [OpenAI is leaving Cursor in November — here are your 3 options | Tom's Guide](https://www.tomsguide.com/ai/openai-is-leaving-cursor-in-november-here-are-your-3-options)
- [Pricing | Anthropic](https://platform.claude.com/docs/en/about-claude/pricing)
- [Gemini Developer API pricing | Google](https://ai.google.dev/gemini-api/docs/pricing)
- [模型卡｜GPT-6.1 Sol](/posts/daily/2026-09-30-model-openai-gpt-6-1-sol)
