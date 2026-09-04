---
title: "定價追蹤｜Anthropic Cache 讀取砍 75%，Google Gemini 3.8 Flash 促銷價上路"
date: 2026-09-04
category: daily
type: digest
tags: [ai-agent, pricing, daily, anthropic, google]
lang: zh-TW
description: "Anthropic 隨 Claude Fable 5.1 上線把 cache read 價格砍 75%（$1.00→$0.25/1M tokens），Google 同週推出 Gemini 3.8 Flash，促銷價 $0.75/$3.75 只到 2026 年底，之後直接翻倍"
tldr: "Anthropic 9/1 發布 Claude Fable 5.1，基礎 input/output 價格不變（$10/$50，每百萬 tokens），但 cache read 從 $1.00 砍到 $0.25（↓75%），高度依賴重複 context 的 agent workload 最多可省 45%。Google 9/2 發布 Gemini 3.8 Flash，促銷價 $0.75/$3.75 只到 2026-12-31，2027-01-01 起漲回 $1.50/$7.50（雙倍）。兩家同一週都在用 cache／促銷窗口而非基礎牌價競爭。"
series:
  name: "AI Pricing Watch"
  order: 8
---

> 🌏 [English version](/en/posts/daily/2026-09-04-pricing-multi-vendor-pricing-changes-en)

## 變更摘要

9 月第一週，Anthropic 和 Google 前後腳動了定價，但用的都不是「牌價直接降」這招。Anthropic 隨 Claude Fable 5.1 上線把基礎 input/output 價格原封不動留在 $10/$50（每百萬 tokens），真正動刀的是 cache read——從 $1.00 砍到 $0.25，降 75%。Google 則是用新模型 Gemini 3.8 Flash 打促銷戰：$0.75/$3.75 的入門價只到 2026 年底，2027 年 1 月 1 日起直接翻倍到 $1.50/$7.50。兩家打法不同，但指向同一件事：token 基礎牌價已經打到很難再降,廠商轉而在「context 重複利用」和「限時導流」上找空間,這也代表 agent 開發者省錢的槓桿正在從「換便宜模型」移向「怎麼設計 context 結構」。

## 前後對照

| 項目 | 舊 | 新 | 變化 | 生效日 |
|---|---|---|---|---|
| Claude Fable 5.1 Cache Read | $1.00/1M tokens | $0.25/1M tokens | ↓75% | 2026-09-01 |
| Claude Fable 5.1 Input | $10.00/1M tokens | $10.00/1M tokens | 持平 | 2026-09-01 |
| Claude Fable 5.1 Output | $50.00/1M tokens | $50.00/1M tokens | 持平 | 2026-09-01 |
| Gemini 3.8 Flash Input（促銷 → 常態） | $0.75/1M tokens | $1.50/1M tokens | ↑100% | 2027-01-01 |
| Gemini 3.8 Flash Output（促銷 → 常態） | $3.75/1M tokens | $7.50/1M tokens | ↑100% | 2027-01-01 |

## 成本試算

### 場景 A：Anthropic cache 降價，重度 agent workload

**場景**：一個工具呼叫密集的 coding agent，每天執行 10,000 次呼叫，其中系統提示、工具 schema、累積對話歷史（約 20,000 tokens）透過 prompt caching 命中，每次新增的動態輸入約 300 tokens、輸出約 400 tokens。

| | 舊定價 | 新定價 | 月省 |
|---|---|---|---|
| Cache read 成本/月 | $6,000 | $1,500 | $4,500 |
| 非 cache Input 成本/月 | $900 | $900 | $0 |
| Output 成本/月 | $6,000 | $6,000 | $0 |
| **合計** | **$12,900/月** | **$8,400/月** | **$4,500（↓35%）** |

這個比例已經很接近 Anthropic 官方宣稱「高度 agentic 工作最多省 45%」的區間——差距主要來自 cache 命中的 context 佔比,佔比越高、省得越多。

### 場景 B：Google Gemini 3.8 Flash，促銷期 vs 常態價

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens）。

| | 促銷價（現在～2026-12-31） | 常態價（2027-01-01 起） | 月增 |
|---|---|---|---|
| Input 成本/月 | $337.5 | $675 | $337.5 |
| Output 成本/月 | $562.5 | $1,125 | $562.5 |
| **合計** | **$900/月** | **$1,800/月（↑100%）** | **$900** |

促銷期間跑起來很便宜,但這個試算也是提醒:任何打算跑進 2027 年的專案,預算要照常態價抓,不能拿促銷價當長期基準。

## 對開發者/企業的影響

### 誰最受益

Anthropic 的 cache 降價對「context 重、內容變化小」的 agent 受益最大——長 system prompt、固定工具定義、累積對話歷史這類會重複命中 cache 的場景。Cognition 已經把 Devin 的 Opus 5 流量切到 Fable 5.1（從 code review 開始）,官方點名正是 cache read 定價讓一個原本用在較便宜層級的工作量,現在換成 Fable 5.1 也划算。Google 這邊,受益最大的是預算有限、想先卡促銷價把 1M context window 的長 horizon coding agent 導入生產的團隊——只要能在年底前把用量堆起來,省下來的是實打實的錢。

### 競爭格局影響

主要模型目前的價格排名（input / output，USD/1M tokens，依 output 由低到高排序）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| Gemini 3.8 Flash（促銷價） | $0.75 | $3.75 | 促銷至 2026-12-31 |
| Claude Haiku 4.5 | $1.00 | $5.00 | 最便宜的 Claude |
| GPT-5.6 Terra | $2.00 | $12.00 | OpenAI 中階 |
| Claude Sonnet 5 | $3.00 | $15.00 | 促銷已於 8/31 到期 |
| Claude Opus 5 | $5.00 | $25.00 | 最強推理層級 |
| Claude Fable 5.1 | $10.00 | $50.00 | Cache read 降至 $0.25 |

Fable 5.1 的基礎牌價仍是所有主流模型裡最貴的一檔,cache 降價不是要跟 Haiku 或 Gemini Flash 搶價格帶,而是把「已經決定要用最頂級模型」的客戶的實際帳單壓低,是留客策略而不是拉新策略。Gemini 3.8 Flash 反過來,是直接卡在 Flash 級距的低價區間搶新客戶,促銷期一過再往上調,是典型的導流打法。

### 行動建議

- 若在用 Claude Code 或其他重度 agentic coding 場景,且 system prompt／工具定義穩定不常變動:升級到 Fable 5.1,cache 降價是直接、無條件的省錢,不需要額外設定。
- 若在評估要不要導入 Gemini 3.8 Flash:現在動作可以卡住促銷價到年底,但一定要把 2027-01-01 之後雙倍的常態價算進年度預算,不要只看眼前的 $0.75/$3.75 做長期選型決策。
- 若要把兩者放一起比:Fable 5.1 是給「已經要跑最強推理」的任務省成本,Gemini 3.8 Flash 是給「想用便宜價格跑長 context agent」的任務搶進場——兩者鎖定的預算層級不同,不是直接替代關係,選型該看任務需要的能力等級,不是純比 $/token。

## 時效提醒

⏰ **Gemini 3.8 Flash 促銷到期日**：2026-12-31。2027-01-01 起 input／output 各漲一倍，回到 $1.50/$7.50（每百萬 tokens）。

## 今日收穫

過去追蹤定價變動習慣盯著「基礎牌價降了多少」,但這次兩家不約而同繞過基礎牌價動刀:Anthropic 只砍 cache read,Google 用促銷窗口而不是永久降價。這代表 token 基礎成本已經被壓到很難再往下擠,廠商開始在「context 有沒有被重複利用」和「限時導流」上找空間——對開發者來說,這意味著省錢的槓桿正在從「選哪個模型」移向「怎麼設計 context 結構讓它吃到 cache 折扣」,架構決策本身變成了成本決策的一部分。

## 參考資料

- [Introducing Claude Fable 5.1 and Claude Mythos 5.1 — Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-1)
- [AI Weekly: Cheap Tokens, Tight Safeguards, and a Two Million GPU Order — Alex Merced](https://amdatalakehouse.substack.com/p/ai-weekly-cheap-tokens-tight-safeguards)
- [Gemini 3.8 Flash: GA Pricing, 1M Context, Benchmarks and Flash Cyber Access — AiCybr](https://aicybr.com/blog/gemini-3-8-flash-cyber-pricing-benchmarks)
- [Agent Platform Pricing — Google Cloud](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing)
