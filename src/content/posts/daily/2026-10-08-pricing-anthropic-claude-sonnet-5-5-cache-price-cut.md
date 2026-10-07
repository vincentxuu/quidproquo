---
title: "定價追蹤｜Claude Sonnet 5.5 快取命中價砍半，從 $0.20 降到 $0.10"
date: 2026-10-08
category: daily
type: digest
tags: [ai-agent, pricing, daily, anthropic]
lang: zh-TW
description: "Anthropic 10/7 將 Claude Sonnet 5.5 的 prompt cache 命中價格從 $0.20 降到 $0.10/1M tokens，降幅 50%，input/output/cache write 不變"
tldr: "Anthropic 2026-10-07 把 Claude Sonnet 5.5 的 cache read（快取命中）價格從 $0.20 砍到 $0.10/1M tokens（輸入價的 5%，原本是 10%），降幅 50%，當天生效。Input $2、output $10、cache write（5 分鐘 $2.50／1 小時 $4）都沒變。這是 Sonnet 5.5 自 9/29 上市以來第一次真正調價——上市時官方強調『同價格換省 token』，這次才是帳單單價真的變小。"
series:
  name: "AI Pricing Watch"
  order: 19
---

> 🌏 [English version](/posts/daily/2026-10-08-pricing-anthropic-claude-sonnet-5-5-cache-price-cut-en)

## 變更摘要

Anthropic 在 2026-10-07 的官方 release notes 宣布，將 Claude Sonnet 5.5 的 prompt cache 命中（cache read）價格從 $0.20 降到 $0.10/1M tokens，折扣比例從「輸入價的 10%」改成「輸入價的 5%」，跟兩週前 Opus 5.5 上市時用的折扣比例看齊。Input、output、cache write 三項單價維持不變。這次調整值得特別記一筆的原因是：Sonnet 5.5 在 9/29 上市時三項單價跟前代 Sonnet 5 一字不差（本站 9/30 已記錄），Anthropic 當時把「成本降 30%」的功勞全部歸給「同任務用更少 token」而非降價；這次是該模型掛牌以來第一次單價真的變小，而且砍的正是 agent／coding 這類重複送入長上下文工作負載裡占比最高的一行。

## 前後對照

| 項目 | 舊 | 新 | 變化 | 生效日 |
|---|---|---|---|---|
| Sonnet 5.5 Input | $2.00/1M tokens | $2.00/1M tokens | 不變 | - |
| Sonnet 5.5 Output | $10.00/1M tokens | $10.00/1M tokens | 不變 | - |
| Sonnet 5.5 Cache Read（快取命中） | $0.20/1M tokens | $0.10/1M tokens | ↓50% | 2026-10-07 |
| Sonnet 5.5 Cache Write（5 分鐘） | $2.50/1M tokens | $2.50/1M tokens | 不變 | 2026-10-07 |
| Sonnet 5.5 Cache Write（1 小時） | $4.00/1M tokens | $4.00/1M tokens | 不變 | 2026-10-07 |

## 成本試算

**場景**：一個 coding agent 每次請求都重新送入 10 萬 tokens 的程式庫上下文（已快取），外加 2,000 tokens 的新鮮輸入（當次對話內容）與 800 tokens 輸出，一天跑 500 次請求。

| | 舊定價 | 新定價 | 月省 |
|---|---|---|---|
| 快取讀取成本/月（100K×500次×30天＝1,500M tokens） | $300.00 | $150.00 | $150.00 |
| 新鮮輸入成本/月（2K×500×30＝30M tokens） | $60.00 | $60.00 | $0 |
| 輸出成本/月（0.8K×500×30＝12M tokens） | $120.00 | $120.00 | $0 |
| **合計** | **$480.00/月** | **$330.00/月** | **$150.00（↓31%）** |

快取讀取原本佔總帳單 62.5%（$300/$480），調降後降到 45%（$150/$330）——這也印證 Anthropic 自己在 Opus 5.5 發布時說的「快取讀取是 agent 與 coding 成本的主要構成」，單壓這一行比壓 input/output 更能撼動帳單結構。

## 對開發者/企業的影響

### 誰最受益

重度依賴 prompt caching 的工作負載受益最明確：coding agent（每輪重送整個程式庫或工具定義）、長對話歷史的客服 bot、RAG 系統裡重複讀取同一批檢索上下文的場景。這些場景的快取命中 tokens 數量級通常是新鮮輸入的 10–50 倍，快取價砍半對總帳單的影響遠大於單純砍 input 或 output 單價。純聊天、單輪問答這類幾乎用不到快取的場景則幾乎無感。

### 競爭格局影響

把目前主要模型的快取折扣比例（快取命中價 ÷ 標準輸入價）攤開比較：

| 模型 | 快取折扣 | 快取命中價 | 標準輸入價 |
|---|---|---|---|
| DeepSeek deepseek-flash（尖峰） | 98% | $0.006 | $0.30 |
| **Claude Sonnet 5.5（新）** | **95%** | **$0.10** | **$2.00** |
| Claude Opus 5.5 | 95% | $0.20 | $4.00 |
| GPT-6.1 Sol | 95% | $0.10 | $2.00 |
| Claude Fable 5.1 | 97.5% | $0.25 | $10.00 |
| Google Gemini 3.8 Flash | 90% | $0.075 | $0.75 |
| Grok 4.7 | 75% | $0.50 | $2.00 |

調降後，Sonnet 5.5 的快取折扣比例從落後 GPT-6.1 Sol（原本 10% vs. 5%），追平到跟 GPT-6.1 Sol 並列業界前段——兩者標準輸入價同樣是 $2，快取命中價現在也同樣是 $0.10，意味著重度用快取的 agent 在這兩個模型之間的成本差距幾乎完全看 input/output 單價（Sonnet 5.5 output $10 vs. Sol $10，打平）跟實際任務 token 效率，不再有快取折扣比例的落差。

### 行動建議

- 如果你的 agent 每輪重送大量固定上下文（系統提示、工具定義、程式庫片段）：直接吃到這次降價，不需要改任何程式碼，Anthropic 是單方面調降牌價
- 如果你在 Sonnet 5.5 跟 GPT-6.1 Sol 之間選型且工作負載高度依賴快取：兩者快取折扣比例打平後，改比較 output 單價相同情況下的任務 token 效率，而不是只看快取這一行
- 如果你的 workload 是短對話、低快取命中率：這次調降對你帳單影響有限，不必為此調整模型選擇
- 重新核算月度預算時，記得區分「快取讀取」跟「新鮮輸入」兩條線分開算，混在一起算整體降幅容易低估這次調整對重度快取場景的實際影響

## 今日收穫

Anthropic 9 月底發表 Sonnet 5.5 時刻意強調「單價沒變，省的是 token 數」，但不到十天就把快取命中價砍半——這說明「同代模型分階段調價」正在變成常態打法：先用「效率提升」敘事上市卡位，觀察市場反應（尤其是 GPT-6.1 Sol 這類快取折扣比例更高的競品），再補一刀真正的單價調整。對追蹤定價的人來說，模型上市公告裡「這次不是降價」這句話，保質期可能只有一到兩週。

## 參考資料

- [Anthropic Release Notes：2026-10-07 Prompt cache read price cut](https://platform.claude.com/docs/en/release-notes/overview)
- [Anthropic：Claude 官方定價頁面（Prompt caching pricing）](https://platform.claude.com/docs/en/about-claude/pricing)
- [本站先前記錄：Claude Sonnet 5.5 上市時單價與 Sonnet 5 完全相同](/posts/daily/2026-09-30-pricing-anthropic-claude-sonnet-5-5-flat-pricing)
