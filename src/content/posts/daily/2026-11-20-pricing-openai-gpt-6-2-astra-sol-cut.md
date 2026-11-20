---
title: "定價追蹤｜GPT-6.2 Astra 降價 20%，旗艦價正好卡在 Claude Fable 5.2 同一個數字"
date: 2026-11-20
category: daily
type: digest
tags: [ai-agent, pricing, daily, openai, anthropic]
lang: zh-TW
description: "OpenAI 發布 GPT-6.2 Astra／Sol，Astra 的 input／output 牌價降 20%、快取 input 降 60%，降價後的 $8/$40 正好跟八天前發布的 Claude Fable 5.2／Mythos 5.2 同價"
tldr: "GPT-6.2 Astra（2026-11-17 發布）input 從 $10 降到 $8（↓20%）、output 從 $50 降到 $40（↓20%）、快取 input 從 $1.00 降到 $0.40（↓60%），GPT-6.2 Sol 維持 $2/$10 沒變。降價後的 Astra 跟 11/9 發布的 Claude Fable 5.2／Mythos 5.2 完全同價（$8/$40），兩大廠旗艦模型的牌價第一次撞在同一個數字上。"
series:
  name: "AI Pricing Watch"
  order: 38
---

> :globe: [English version](/posts/daily/2026-11-20-pricing-openai-gpt-6-2-astra-sol-cut-en)

## 變更摘要

OpenAI 在 11/17 發布 GPT-6.2 Astra 和 GPT-6.2 Sol，Sol 的牌價原地不動（延用 GPT-6.1 Sol 的 $2/$10），但旗艦款 Astra 全面降價：input／output 各降 20%，快取 input 降幅更大，砍了 60%。這不是促銷,官方定價頁直接把舊的 GPT-6 Astra（$10/$50）換成新的 GPT-6.2 Astra（$8/$40），沒有倒數日期。真正值得記的是這個數字落在哪裡——$8/$40 剛好是 Anthropic 八天前（11/9）發布 Claude Fable 5.2 和 Mythos 5.2 時定下的價格。兩間公司的旗艦模型,牌價第一次完全重疊,而且是在 Anthropic 準備 IPO 的同一週發生。

## 前後對照

| 項目 | 舊（GPT-6 Astra，09/03 發布價） | 新（GPT-6.2 Astra） | 變化 | 生效日 |
|---|---|---|---|---|
| Input | $10.00/1M tokens | $8.00/1M tokens | ↓20% | 2026-11-17 |
| Output | $50.00/1M tokens | $40.00/1M tokens | ↓20% | 2026-11-17 |
| Cached Input | $1.00/1M tokens | $0.40/1M tokens | ↓60% | 2026-11-17 |
| Batch Input | $5.00/1M tokens | $4.00/1M tokens | ↓20% | 2026-11-17 |
| Batch Output | $25.00/1M tokens | $20.00/1M tokens | ↓20% | 2026-11-17 |
| GPT-6.2 Sol Input（對照） | $2.00/1M tokens（= GPT-6.1 Sol） | $2.00/1M tokens | 持平 | 2026-11-17 |

```diagram
title: GPT-6.2 Astra 降價對比（新價占舊價比例）
desc: GPT-6.2 Astra 的 Input、Output 都降到舊價（GPT-6 Astra）的 80%，快取 Input 降到 40%；同一天發布的 GPT-6.2 Sol，Input 維持在舊價的 100%，完全沒調整。
caption: 換算：新價 ÷ 舊價 × 100。Astra Input 8÷10×100=80、Output 40÷50×100=80、快取 Input 0.4÷1.0×100=40；Sol Input 2÷2×100=100（不變）。基線 y=300 對應 0，頂 y=60 對應 100，k=2.4 單位/px。資料來源：OpenAI 官方定價頁（2026-11-17 生效）。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">新價佔舊價比例（%，100＝不變）</text>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <line class="dg-grid" x1="72" y1="60" x2="612" y2="60"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">100</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">50</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="110" y="108" width="64" height="192"/>
    <rect class="dg-bar dg-bar--soft" x="230" y="108" width="64" height="192"/>
    <rect class="dg-bar dg-bar--soft" x="470" y="60" width="64" height="240"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="350" y="204" width="64" height="96"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="142" y="98" text-anchor="middle" dominant-baseline="central">80</text>
  <text class="dg-sub" x="262" y="98" text-anchor="middle" dominant-baseline="central">80</text>
  <text class="dg-label dg-text--accent" x="382" y="194" text-anchor="middle" dominant-baseline="central">40</text>
  <text class="dg-sub" x="502" y="50" text-anchor="middle" dominant-baseline="central">100</text>

  <text class="dg-sub" x="142" y="320" text-anchor="middle" dominant-baseline="central">Astra Input</text>
  <text class="dg-sub" x="262" y="320" text-anchor="middle" dominant-baseline="central">Astra Output</text>
  <text class="dg-label dg-text--accent" x="382" y="320" text-anchor="middle" dominant-baseline="central">Astra 快取</text>
  <text class="dg-sub" x="502" y="320" text-anchor="middle" dominant-baseline="central">Sol Input</text>
</svg>
```

## 成本試算

**場景**：一個每天跑 500 次高複雜度分析任務的法律文件審查 Agent（平均每次 5,000 input tokens + 2,000 output tokens，30 天計）

| | 舊定價（GPT-6 Astra） | 新定價（GPT-6.2 Astra） | 月省 |
|---|---|---|---|
| Input 成本/月 | $750 | $600 | $150 |
| Output 成本/月 | $1,500 | $1,200 | $300 |
| **合計** | **$2,250/月** | **$1,800/月** | **$450（↓20%）** |

這個試算完全沒算到快取——如果任務裡有大段重複的系統提示詞或長文件（RAG 常見情境），快取 input 降 60% 會讓實際省下的比例高於 20%，表格裡的 $450 是沒用快取情境下的保守數字。

## 對開發者/企業的影響

### 誰最受益

本來就在用 GPT-6 Astra 做長篇寫作、複雜推理或高難度程式碼任務的團隊，升級到 GPT-6.2 Astra 不用改 prompt、不用重新測試架構，直接省 20%。大量依賴快取（固定系統提示詞、長文件反覆問答）的團隊受益更大，因為快取 input 的降幅是標準 input 的三倍。

### 競爭格局影響

降價後的主要旗艦模型價格排名（input / output，USD/1M tokens）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| GPT-6.2 Sol | $2.00 | $10.00 | 與 GPT-6.1 Sol 同價，這波降價沒調整它 |
| Claude Sonnet 5.5 | $2.00 | $10.00 | — |
| Claude Opus 5.5 | $4.00 | $20.00 | — |
| **GPT-6.2 Astra（新）** | **$8.00** | **$40.00** | ↓20%，降價後與 Claude Fable 5.2／Mythos 5.2 完全同價 |
| Claude Fable 5.2／Mythos 5.2 | $8.00 | $40.00 | 2026-11-09 發布時定的價，Anthropic IPO 前八天 |
| GPT-6 Astra（舊） | $10.00 | $50.00 | 2026-09-03 發布價，11/17 起不再是現行牌價 |

OpenAI 這次降價,把 Astra 的牌價直接搬到 Anthropic 旗艦模型的格子裡。對開發者來說,這代表挑 Astra 還是 Fable 5.2／Mythos 5.2,已經不是價格問題——兩邊一樣貴,差別只剩快取規則（Anthropic 的 cache write 是 5 分鐘 $10、1 小時 $16;OpenAI 是 30 分鐘 $10、12 小時 $20,對話模式不同,划算的一邊也不同）和實際任務的品質表現。

### 行動建議

- 如果你在用 GPT-6 Astra：直接升級到 GPT-6.2 Astra，同等能力省 20%，沒有遷移成本；如果你的用量裡快取 input 佔比高，實際省下的比例會更高
- 如果你在 Claude Fable 5.2／Mythos 5.2 和 GPT-6.2 Astra 之間選型：價格已經完全打平（$8/$40），不要再用「哪邊便宜」當決策依據——去跑自己任務的 eval，比較生成品質、延遲，再看快取寫入的時間窗哪邊符合你的對話模式
- 如果你只需要中端用量：GPT-6.2 Sol 這次維持 $2/$10 沒變，這波降價沒有惠及到你，不用因為「Astra 降價」就衝動升級到比 Sol 貴四倍的旗艦層

## 今日收穫

OpenAI 這次沒有打「比對手便宜」的牌,反而是把自己的旗艦價直接降到跟 Anthropic 旗艦一模一樣。追蹤這半年的旗艦定價會發現一個模式：GPT-6 Astra 發布時比 Claude 旗艦貴,這次 GPT-6.2 Astra 降價後,兩邊牌價完全重疊在 $8/$40。當兩大廠的頂規模型價格撞在同一個數字,價格本身就不再是選型的資訊量——真正該比的,是免費資訊之外、要自己動手測的那些細節：快取規則、延遲、長文本行為。這提醒我每次看到「降價」新聞,除了算百分比,還要順手查一下這個新數字撞到了誰的牌價。

## 參考資料

- [OpenAI：API Pricing（官方定價頁，GPT-6.2 Astra／Sol 現行費率）](https://developers.openai.com/api/docs/pricing)
- [OpenAI GPT-6.2 Astra cuts API prices 20%, adds Sol model（betanews，降價幅度與發布日）](https://betanews.com/article/gpt-6-2-astra-api-pricing)
- [OpenAI Launches GPT-6.2 Astra and Sol with 20% Price Cut（Gate News）](https://gate.com/news/detail/openai-launches-gpt-62-astra-and-sol-with-20-price-cut-25725610)
- [GPT-6.2 Astra vs Claude Fable 5.2: $8 Price Parity（shattered.io，兩家旗艦模型同價對照）](https://shattered.io/gpt-6-2-astra-sol-anthropic-real-winner-8-dollar-price-parity)
