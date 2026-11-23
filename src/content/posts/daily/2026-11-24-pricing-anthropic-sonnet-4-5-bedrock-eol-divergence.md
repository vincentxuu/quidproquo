---
title: "定價追蹤｜Claude Sonnet 4.5 退役時程分裂：官方 11/30，Amazon Bedrock 展延到 2027/4/8"
date: 2026-11-24
category: daily
type: digest
tags: [ai-agent, pricing, daily, anthropic]
lang: zh-TW
description: "Anthropic 官方平台（Claude API／Claude Platform on AWS／Microsoft Foundry／Google Cloud 自營）11/30 退役 Claude Sonnet 4.5，但 Amazon Bedrock 的 EOL 展延到 2027/4/8；Google Cloud 的合作夥伴版本反而跟官方同步 11/30 關閉"
tldr: "claude-sonnet-4-5-20250929 在 Claude API、Claude Platform on AWS、Microsoft Foundry、Google Cloud（Anthropic 自營）於 2026-11-30 退役並直接失敗，但 Amazon Bedrock 的官方 model card 寫明 EOL 是 2027-04-08，比官方時程晚了 4 個多月；Google Cloud 的合作夥伴版（Model Garden／MaaS）反而跟官方站同一邊，一樣 11/30 關閉——同一個模型 ID，三種時程。"
series:
  name: "AI Pricing Watch"
  order: 40
---

> :globe: [English version](/posts/daily/2026-11-24-pricing-anthropic-sonnet-4-5-bedrock-eol-divergence-en)

## 變更摘要

我們在[10/23 的報導](/posts/daily/2026-10-23-pricing-anthropic-claude-sonnet-4-5-retirement)就指出：Claude Sonnet 4.5 的 11/30 退役期限只管 Claude API、Claude Platform on AWS、Microsoft Foundry 三個 Anthropic 自家平台，Amazon Bedrock 和 Google Cloud 各自訂時程，當時沒查到具體日期。一個月後，答案出來了——而且兩個「合作夥伴平台」給出完全相反的答案。AWS 官方 Bedrock model card 明確寫著 Claude Sonnet 4.5 的 EOL 是 2027-04-08，比官方時程晚了超過 4 個月；但 Google Cloud 的 Model Garden／MaaS 合作夥伴版本反而跟官方站同一邊，一樣在 11/30 關閉。同一個模型 ID（`claude-sonnet-4-5-20250929`），三個不同主體各訂各的退役日，這正是 Anthropic 官方文件裡那句「partner-operated platforms set their own retirement schedules」的具體案例。

## 前後對照

| 平台 | 退役／EOL 日 | 治理方 | 備註 |
|---|---|---|---|
| Claude API | 2026-11-30 | Anthropic 自營 | 無寬限期，過期請求直接失敗 |
| Claude Platform on AWS | 2026-11-30 | Anthropic 自營（AWS Marketplace 計費） | 同上 |
| Claude Models on Google Cloud（Anthropic 自營） | 2026-11-30 | Anthropic 自營 | 同上 |
| Microsoft Foundry | 2026-11-30 | Anthropic 自營 | 同上 |
| Google Cloud Model Garden／MaaS（合作夥伴版） | 2026-11-30 | Google 自訂時程 | 碰巧跟官方同步，非 Anthropic 規定 |
| **Amazon Bedrock**（`bedrock-runtime`） | **2027-04-08** | **AWS 自訂時程** | 比官方晚 129 天，EOL no sooner than 原訂 2026-09-30 |

官方替代模型維持不變：Claude Sonnet 5.5，input/output 牌價比 Sonnet 4.5 便宜 33%（$2.00/$10.00 vs $3.00/$15.00，USD/1M tokens）——這部分數字跟 10/23 報導一致，沒有新變動。

```diagram
title: Claude Sonnet 4.5 的退役時程分裂成兩條線
desc: 五個官方與合作夥伴平台在 11/30 同步退役，只有 Amazon Bedrock 的 EOL 展延到 2027 年 4 月 8 日。
caption: 橫軸為月份，12 月後進入 2027 年。日期依 Anthropic Model deprecations 頁、AWS Bedrock model card、Google Cloud Partner model deprecations 頁，2026-11-23 查證。
---
<svg viewBox="0 0 640 240">
  <text class="dg-small" x="204" y="28" text-anchor="middle" dominant-baseline="central">9</text>
  <text class="dg-small" x="260" y="28" text-anchor="middle" dominant-baseline="central">10</text>
  <text class="dg-small" x="316" y="28" text-anchor="middle" dominant-baseline="central">11</text>
  <text class="dg-small" x="372" y="28" text-anchor="middle" dominant-baseline="central">12</text>
  <text class="dg-small" x="428" y="28" text-anchor="middle" dominant-baseline="central">1</text>
  <text class="dg-small" x="484" y="28" text-anchor="middle" dominant-baseline="central">2</text>
  <text class="dg-small" x="540" y="28" text-anchor="middle" dominant-baseline="central">3</text>
  <text class="dg-small" x="596" y="28" text-anchor="middle" dominant-baseline="central">4</text>
  <line class="dg-rule" x1="176" y1="44" x2="624" y2="44"/>

  <line class="dg-grid" x1="176" y1="44" x2="176" y2="200"/>
  <line class="dg-grid" x1="232" y1="44" x2="232" y2="200"/>
  <line class="dg-grid" x1="288" y1="44" x2="288" y2="200"/>
  <line class="dg-grid" x1="344" y1="44" x2="344" y2="200"/>
  <line class="dg-grid" x1="400" y1="44" x2="400" y2="200"/>
  <line class="dg-grid" x1="456" y1="44" x2="456" y2="200"/>
  <line class="dg-grid" x1="512" y1="44" x2="512" y2="200"/>
  <line class="dg-grid" x1="568" y1="44" x2="568" y2="200"/>
  <line class="dg-grid" x1="624" y1="44" x2="624" y2="200"/>

  <line class="dg-line dg-line--dashed" x1="333" y1="76" x2="333" y2="200"/>

  <text class="dg-sub" x="16" y="89" dominant-baseline="central">官方＋合作版（5 平台）</text>
  <g class="dg-c-muted">
    <rect class="dg-bar" x="232" y="80" width="112" height="18"/>
  </g>
  <path class="dg-point dg-c-ink" d="M344 81 L352 89 L344 97 L336 89 Z"/>
  <text class="dg-small" x="344" y="68" text-anchor="middle" dominant-baseline="central">11/30 退役</text>

  <text class="dg-label dg-text--accent" x="16" y="159" dominant-baseline="central">Amazon Bedrock</text>
  <g class="dg-c-accent">
    <rect class="dg-bar" x="232" y="150" width="351" height="18"/>
  </g>
  <path class="dg-point dg-c-accent" d="M583 151 L591 159 L583 167 L575 159 Z"/>
  <text class="dg-small dg-text--accent" x="583" y="181" text-anchor="middle" dominant-baseline="central">4/8 EOL</text>

  <text class="dg-small" x="232" y="216" text-anchor="middle" dominant-baseline="central">9/30 公告退役</text>
  <text class="dg-small" x="333" y="216" text-anchor="middle" dominant-baseline="central">今天</text>
</svg>
```

## 成本試算

**場景**：一個每天處理 10,000 則客服對話的 Agent（平均每則 1,500 input tokens + 500 output tokens），目前透過 Amazon Bedrock 呼叫 `anthropic.claude-sonnet-4-5-20250929-v1:0`。

因為 Bedrock 的 EOL 展延到 2027-04-08，這個團隊比起用 Claude API 直連的團隊，多出約 129 天的遷移窗口——以 10/23 報導算出的「遷移後每月省 $480（↓13.3%，計入新 tokenizer 多耗 token）」為基準：

| | 立即遷移（Claude API 使用者，11/30 前） | 延後遷移（Bedrock 使用者，可拖到 2027-04-08） | 差異 |
|---|---|---|---|
| 強制遷移前的剩餘天數 | 7 天 | 136 天 | +129 天 |
| 同期間維持舊帳單（Sonnet 4.5 定價） | $3,600/月 × ~0.2 月 ≈ $840 | $3,600/月 × ~4.5 月 ≈ $16,200 | — |
| 若延後遷移，多付的差額（vs 立刻換成 Sonnet 5.5） | 基準 $0 | 約 $2,160（129 天 × 每日省額 $16.8） | Bedrock 使用者多付約 $2,160 才真正遷移 |

這張表的重點不是「Bedrock 比較划算」——用 Bedrock 的團隊如果想省 13.3% 的帳單，一樣可以現在就手動切到 Sonnet 5.5，不用等到 EOL。多出的 129 天只是「不遷移也不會斷線」的緩衝期，不是免費的折扣。

## 對開發者/企業的影響

### 誰最受益

把 Claude Sonnet 4.5 寫進生產環境、而且走 Amazon Bedrock 的團隊，相當於白拿一段緩衝期——可以把遷移排進下一次正常的版本迭代，不需要為了 11/30 趕工測試 Sonnet 5.5 在 prefill、`thinking.budget_tokens`、強制 tool use 上的行為差異（10/23 報導列過這幾項會直接回 400 error）。反過來，走 Claude API、Claude Platform on AWS、Microsoft Foundry 或 Google Cloud 合作夥伴版的團隊完全沒有這個緩衝，11/30 一過就斷線。

### 競爭格局影響

Bedrock 使用者如果選擇用滿緩衝期，中間會跟 GPT-6 Sol、新上市的 Claude Sonnet 4.6（同價 $3/$15、同 tokenizer，可當過渡但非官方長期替代）同場競爭：

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| Claude Haiku 4.5 | $1.00 | $5.00 | — |
| GPT-6 Sol | $2.00 | $10.00 | — |
| **Claude Sonnet 5.5（官方建議替代）** | **$2.00** | **$10.00** | 跟 GPT-6 Sol 同價位 |
| Claude Sonnet 4.6 | $3.00 | $15.00 | 過渡選項，退役日「不早於 2027-02-17」 |
| Claude Sonnet 4.5（Bedrock 緩衝期內） | $3.00 | $15.00 | 2027-04-08 前仍可呼叫，僅限 Bedrock |
| Claude Opus 5.5 | $4.00 | $20.00 | — |

### 行動建議

- 如果你用 Claude API／Claude Platform on AWS／Microsoft Foundry／Google Cloud 自營版：11/30 前必須遷移完成，沒有任何緩衝，照 10/23 報導的檢查清單逐項改完 prefill／`thinking`／取樣參數相關程式碼。
- 如果你用 Amazon Bedrock：不代表你可以忽略這件事到 2027 年——帳單省幅是現在就能拿到的 13.3%，拖到 EOL 前才遷移等於白白多付四個月差額，唯一合理的拖延理由是「有別的技術債要先處理、剛好用這段時間排隊」。
- 如果你同時用多個平台（例如 Claude API 測試環境 + Bedrock 生產環境）：不要假設兩邊退役日同步，先查各自平台現在的 model card／model table，這次的落差正好證明「看到官方 11/30 公告」不代表所有部署管道都適用同一個日期。
- 查詢自己實際的 EOL 日期時，直接查對應平台的官方頁面（Anthropic 的 Model deprecations 頁、AWS Bedrock 的 model card、Google Cloud 的 Partner model deprecations 頁），不要套用其他平台的日期做假設。

## 時效提醒（如有促銷/sunset）

:warning: **停用日期（依平台不同）**：
- **2026-11-30**：Claude API、Claude Platform on AWS、Microsoft Foundry、Google Cloud（Anthropic 自營）、Google Cloud Model Garden／MaaS（合作夥伴版）——`claude-sonnet-4-5-20250929` 全數停止回應，無寬限期。
- **2027-04-08**：Amazon Bedrock（`bedrock-runtime`，模型 ID `anthropic.claude-sonnet-4-5-20250929-v1:0`）——AWS 自訂 EOL，超過此日期請求會回傳 `ResourceNotFoundException: This model version has reached the end of its life.`

遷移指南：[Claude Sonnet 5.5 Migration Guide](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide)。

## 今日收穫

之前看到「模型退役，Bedrock／Vertex 各自訂時程」這句話，容易當成官方的免責聲明讀過去，沒意識到它背後藏著具體的、可能差到四個多月的日期分歧。這次查證才發現，同一句免責聲明下面，Google Cloud 的合作夥伴版選擇跟官方同步、Amazon Bedrock 卻選擇自己展延——「partner-operated」不代表「延後」，也不代表「同步」，兩家合作夥伴可以做出完全相反的決定。這提醒我們：多雲部署的團隊查官方退役公告時，不能只查模型供應商的頁面，每個雲端平台自己的 model card／lifecycle 頁面才是最終權威。

## 參考資料

- [Claude Platform Docs：Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [AWS：Claude Sonnet 4.5 model card（Amazon Bedrock）](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-sonnet-4-5.html)
- [Google Cloud：Partner model deprecations（Claude Sonnet 4.5 on Google Cloud）](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/deprecations/partner-models)
