---
title: "定價追蹤｜Claude Opus 4.5 明年 1/22 退役，Opus 5.5 降價 20% 但帳單可能不降反升"
date: 2026-11-28
category: daily
type: digest
tags: [ai-agent, pricing, daily, anthropic]
lang: zh-TW
description: "Anthropic 將於 2027-01-22 退役 Claude Opus 4.5（claude-opus-4-5-20251101），建議遷移至定價降 20%、快取降 60% 的 Claude Opus 5.5，但新 tokenizer 讓部分未快取的工作負載實際帳單不降反升"
tldr: "Claude Opus 4.5 於 2027-01-22 從 Claude API、AWS、Microsoft Foundry 退役，無寬限期；官方替代 Claude Opus 5.5 牌價降 20%（input $5→$4、output $25→$20／1M tokens），快取讀取降 60%（$0.50→$0.20）。但 Opus 5.5 的新 tokenizer 讓同樣文字多產生最多 35% token，沒有快取的工作負載換算後可能不降反升——官方給的 token 膨脹區間剛好跨過這次 20% 降價的損益平衡點。"
series:
  name: "AI Pricing Watch"
  order: 42
---

> :globe: [English version](/posts/daily/2026-11-28-pricing-anthropic-claude-opus-4-5-retirement-en)

## 變更摘要

Anthropic 在 2026-11-23 公告、2027-01-22 正式生效：Claude Opus 4.5（`claude-opus-4-5-20251101`，含別名 `claude-opus-4-5`）將從 Claude API、Claude Platform on AWS、Microsoft Foundry、Claude Models on Google Cloud（Anthropic managed）退役，之後的請求直接失敗。官方建議的替代模型 Claude Opus 5.5 牌價全面降 20%（input/output/cache write/batch 都是），快取讀取更降 60%，乍看是這幾個月來 Anthropic 最乾淨的一次「退役順便降價」。但官方自己的 migration guide 寫明 Opus 5.5 的新 tokenizer 會讓同樣文字多產生 1x 到 1.35x 的 token，而 20% 的牌價降幅換算出的損益平衡點正好是 1.25x——這代表官方公布的 token 膨脹區間，剛好跨過了「真降價」和「假降價」的分界線，使用者要等帳單出來才知道自己落在哪一邊。

## 前後對照

| 項目 | 舊（Opus 4.5） | 新（Opus 5.5） | 變化 | 退役日 |
|---|---|---|---|---|
| Input | $5.00/1M tokens | $4.00/1M tokens | ↓20% | 2027-01-22 |
| Output | $25.00/1M tokens | $20.00/1M tokens | ↓20% | 2027-01-22 |
| 5 分鐘 Cache Write | $6.25/1M tokens | $5.00/1M tokens | ↓20% | 2027-01-22 |
| 1 小時 Cache Write | $10.00/1M tokens | $8.00/1M tokens | ↓20% | 2027-01-22 |
| Cache 讀取（命中） | $0.50/1M tokens | $0.20/1M tokens | ↓60% | 2027-01-22 |
| Batch Input | $2.50/1M tokens | $2.00/1M tokens | ↓20% | 2027-01-22 |
| Batch Output | $12.50/1M tokens | $10.00/1M tokens | ↓20% | 2027-01-22 |

## 成本試算

**場景**：一個每天處理 10,000 則複雜推理任務的 Agent（平均每則 1,500 input tokens + 500 output tokens，不含快取），月用量約 450M input tokens、150M output tokens，目前還在用 `claude-opus-4-5-20251101`。Anthropic 的 migration guide 給的 token 膨脹區間是 1x 到 1.35x，這裡列出三個點位：

| | 舊定價（Opus 4.5） | Opus 5.5，token 不變（1.0x） | Opus 5.5，token +20%（1.2x） | Opus 5.5，token +35%（1.35x，官方上限） |
|---|---|---|---|---|
| Input 成本/月 | $2,250 | $1,800 | $2,160 | $2,430 |
| Output 成本/月 | $3,750 | $3,000 | $3,600 | $4,050 |
| **合計** | **$6,000/月** | **$4,800（↓20%）** | **$5,760（↓4%）** | **$6,480（↑8%）** |

```diagram
title: Opus 5.5 遷移成本 vs. tokenizer 膨脹倍數
desc: Opus 5.5 的月費隨 token 膨脹倍數上升，在 1.25x 處追平退役前 Opus 4.5 的月費，超過後反而比舊定價更貴。
caption: 試算基準：每日 10,000 次呼叫、1,500 input + 500 output tokens，月用量 450M input／150M output tokens（未計快取）。Opus 5.5 月費 = 4,800 × token 膨脹倍數；Opus 4.5 月費 $6,000 固定、不受新 tokenizer 影響，兩線在膨脹倍數 1.25x 處打平。
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">USD／月</text>
  <line class="dg-grid" x1="72" y1="163" x2="508" y2="163"/>
  <line class="dg-grid" x1="72" y1="231" x2="508" y2="231"/>
  <line class="dg-grid" x1="380" y1="58" x2="380" y2="300"/>
  <text class="dg-small" x="64" y="163" text-anchor="end" dominant-baseline="central">4,000</text>
  <text class="dg-small" x="64" y="231" text-anchor="end" dominant-baseline="central">2,000</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>
  <text class="dg-tag" x="380" y="48" text-anchor="middle" dominant-baseline="central">1.25x 打平</text>
  <line class="dg-axis" x1="72" y1="300" x2="508" y2="300"/>

  <g class="dg-c-muted">
    <polyline class="dg-plot-line dg-plot-line--thin" points="80,94 500,94"/>
    <text class="dg-sub dg-text--series" x="512" y="104" dominant-baseline="central">Opus 4.5</text>
    <text class="dg-sub dg-text--series" x="512" y="124" dominant-baseline="central">$6,000</text>
  </g>
  <g class="dg-c-accent">
    <polyline class="dg-plot-line" points="80,135 140,127 200,119 260,111 320,103 380,94 440,86 500,78"/>
    <circle class="dg-point" cx="80" cy="135" r="4"/>
    <circle class="dg-point" cx="140" cy="127" r="4"/>
    <circle class="dg-point" cx="200" cy="119" r="4"/>
    <circle class="dg-point" cx="260" cy="111" r="4"/>
    <circle class="dg-point" cx="320" cy="103" r="4"/>
    <circle class="dg-point" cx="380" cy="94" r="4"/>
    <circle class="dg-point dg-point--hollow" cx="380" cy="94" r="7"/>
    <circle class="dg-point" cx="440" cy="86" r="4"/>
    <circle class="dg-point" cx="500" cy="78" r="4"/>
    <text class="dg-label dg-text--series" x="512" y="60" dominant-baseline="central">Opus 5.5</text>
    <text class="dg-sub dg-text--series" x="512" y="80" dominant-baseline="central">$6,480</text>
  </g>

  <text class="dg-small" x="80" y="320" text-anchor="middle" dominant-baseline="central">1.00x</text>
  <text class="dg-small" x="200" y="320" text-anchor="middle" dominant-baseline="central">1.10x</text>
  <text class="dg-small" x="320" y="320" text-anchor="middle" dominant-baseline="central">1.20x</text>
  <text class="dg-small" x="440" y="320" text-anchor="middle" dominant-baseline="central">1.30x</text>
  <text class="dg-small" x="500" y="320" text-anchor="middle" dominant-baseline="central">1.35x</text>
</svg>
```

損益平衡點算出來剛好是 token 膨脹 1.25x：低於這個倍數真的省錢，超過就反而比退役前更貴。官方給的上限 1.35x 已經站在虧錢的那一側，而這個試算完全沒算進快取——重度使用快取的工作負載，因為快取讀取降了 60%，實際表現會比這張表樂觀得多。

## 對開發者/企業的影響

### 誰最受益

重複送出長 system prompt、工具定義或長文件做 context 的工作負載受益最明顯：快取讀取價砍 60%，是這次所有降幅裡最大的一筆，而且快取部分不受新 tokenizer 的「token 膨脹」影響（官方算的膨脹倍數只套用在未快取的 input／output token 上）。相反地，單輪、無快取、長輸出的推理任務風險最高——這類負載最貼近上面試算的情境，一旦 token 膨脹超過 1.25x，帳單會比退役前更貴。

### 競爭格局影響

目前主要模型的定價排名（input／output，USD/1M tokens，標準短 context 價）：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| Claude Haiku 5.5（≤100K） | $0.10 | $0.50 | 最便宜的 Anthropic 現役模型 |
| Claude Sonnet 5.5 | $2.00 | $10.00 | — |
| GPT-6.2 Sol | $2.00 | $10.00 | 跟 Sonnet 5.5 同價 |
| Gemini 4 Carbon／Argon（12/1 前促銷價） | $2.00 | $10.00 | 12/1 起雙漲至 $4/$20（見 [11/15 報導](/posts/daily/2026-11-15-pricing-multi-vendor-pricing-changes)） |
| **Claude Opus 5.5（官方建議替代）** | **$4.00** | **$20.00** | 12/1 起跟 Gemini 4 Carbon／Argon 同價 |
| Claude Opus 4.5（退役中） | $5.00 | $25.00 | 2027-01-22 起 API 呼叫全部失敗 |
| GPT-6.2 Astra | $8.00 | $40.00 | 目前最貴的主要模型 |

Opus 5.5 退役後接手的 $4/$20 價位，12/1 起會跟 Google 漲價後的 Gemini 4 Carbon／Argon 完全重疊——這代表 Anthropic 這次調價等於提前卡好了 Google 漲價後要讓出的那個價格帶，兩家的旗艦模型在 12 月同時收斂到同一個數字。

### 行動建議

- 如果你還在呼叫 `claude-opus-4-5-20251101` 或別名 `claude-opus-4-5`：2027-01-22 前完成遷移，之後請求沒有寬限期直接失敗，時間比 Sonnet 4.5 這波（2026-11-30）寬裕約兩個月。
- 先用 Anthropic 的 token counting endpoint 量自己實際的 prompt，確認你的工作負載落在 1.25x 損益平衡點的哪一側，不要直接套「降 20%」的牌價估計。
- 換模型不是只改 model ID：assistant prefill 在 Opus 5.5 會回 400 error，手動設定 `thinking` 的 `budget_tokens` 也會回 400 error（改用 adaptive thinking + `output_config.format` 的 effort 參數），`temperature`／`top_p`／`top_k` 建議直接省略不送。
- 快取密集的工作負載（長 system prompt、固定工具定義、重複文件 context）優先遷移——這類負載幾乎保證省錢，因為 60% 的快取降幅不受新 tokenizer 影響。
- Amazon Bedrock、Google Cloud（Google managed）使用者：這次 2027-01-22 的期限只管 Claude API、Claude Platform on AWS、Microsoft Foundry、Google Cloud（Anthropic managed）四個 Anthropic 自家平台，Bedrock 和 Google-managed Vertex AI 的 Opus 4.5 退役日目前都還沒公布，不要假設跟著同步。

## 時效提醒（如有促銷/sunset）

:warning: **停用日期**：2027-01-22。`claude-opus-4-5-20251101`（含別名 `claude-opus-4-5`）在 Claude API、Claude Platform on AWS、Microsoft Foundry、Claude Models on Google Cloud（Anthropic managed）上停止回應請求，無寬限期。Amazon Bedrock 與 Google Cloud（Google managed）各自訂時程，目前尚未公布，需另查對應 model table。遷移指南：[Claude Opus 5.5 Migration Guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide)。

## 今日收穫

這是本系列第三次看到「牌價降幅被新 tokenizer 吃掉一部分」的模式（前兩次是 [Sonnet 5.5 上市時的單價不變](/posts/daily/2026-09-30-pricing-anthropic-claude-sonnet-5-5-flat-pricing)、[Sonnet 4.5 退役時降 33%](/posts/daily/2026-10-23-pricing-anthropic-claude-sonnet-4-5-retirement)），但這次第一次能把它算成一條精確的分界線：20% 的降價幅度換算出損益平衡點正好是 token 膨脹 1.25x，而官方自己公布的膨脹區間（1x–1.35x）剛好跨過這條線的兩邊。換句話說，Anthropic 這次公告本身就同時成立「降價」和「變相漲價」兩種說法，哪個成立取決於一個使用者自己量不出來、官方也沒給單一數字的變數——這種「答案是區間、而區間剛好包含損益平衡點」的公告方式，可能會變成往後模型換代定價公告的常態寫法。

## 參考資料

- [Claude Platform Docs：Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Claude Platform Docs：Model pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [Data Studios：Claude Opus 4.5 retires January 22, 2027 — Opus 5.5 API prices and migration](https://www.datastudios.org/post/claude-opus-4-5-retires-january-22-2027-opus-5-5-migration-api-costs)
