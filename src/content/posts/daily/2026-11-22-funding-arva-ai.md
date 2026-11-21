---
title: "融資速報｜Arva AI Series A $20M"
date: 2026-11-22
category: daily
type: digest
tags: [ai-agent, funding, daily, arva-ai, fintech-ai]
lang: zh-TW
description: "銀行合規/放貸決策 AI agent 新創 Arva AI 完成 $20M Series A，Arthur Ventures 領投，讓銀行把金融犯罪合規、准入、放貸等端到端決策交給可稽核的 agent 執行"
tldr: "Arva AI 完成 $20M Series A，由 Arthur Ventures 領投，Y Combinator 與 Gradient Ventures 續投。這筆錢代表銀行開始讓 agent 真正做出合規與放貸等關鍵決策，不只是提供建議。"
series:
  name: "AI Agent Funding"
  order: 150
---

> :globe: [English version](/posts/daily/2026-11-22-funding-arva-ai-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Arva AI（美國，紐約） |
| 輪次 | Series A |
| 金額 | $20M |
| 領投 | Arthur Ventures |
| 跟投 | Y Combinator、Gradient Ventures（續投） |
| 估值 | 未揭露 |
| 累計融資 | $23M（2025 年 1 月 Gradient 領投的 $3M 種子輪 + 本輪 $20M） |
| 成立年份 | 2024 |
| 員工數 | ~20 人（Revelio Labs，2026 年 6 月） |

## 這家公司做什麼

Arva AI 是做銀行端到端決策類 AI agent 的公司——銀行設定政策，Arva 的 agent 依照政策處理金融犯罪合規審查、客戶准入、支付操作與放貸這些原本要人工一件一件過的案子，直接做出決策，而不只是給建議。

核心技術分兩層：2026 年 9 月成立的 Arva Research 模型實驗室，專門為決策中最需要準確度的步驟訓練自家模型，第一個產品 Arva Intel 是做個人與企業網路調查的研究模型，公司自測準確度比主流通用模型高 13%；另一層是 AgentCore，一套持續學習的基礎設施，讓 agent 隨時間依每家銀行自己的政策與作業方式調整判斷邏輯。CEO Rhim Shah 之前在 Revolut Business 負責金融犯罪產品線，共同創辦人為 Oli Wales。

```diagram
title: Arva AI 的銀行決策學習迴圈
desc: 銀行設定政策，Arva 的 agent 依政策調查個案並產出可稽核決策，銀行覆核後回饋結果會寫回 AgentCore，AgentCore 累積案例後讓下一輪判斷更貼合這家銀行的政策。
caption: 簡化示意：實際流程還包含人工抽核與異常案例升級；政策本身不隨迴圈改變，變的是 agent 套用政策的準確度。資料來自 Arva AI 官方公告（2026-11-20）。
step: 銀行設定政策與規則
step: Arva agent 依政策調查個案，使用 Arva Intel 等專屬模型
step: 產出可稽核的決策，案例結果寫回 AgentCore
step: 銀行覆核決策結果並回饋
step: AgentCore 套用累積案例的學習結果，下一輪判斷更貼合政策
---
<svg viewBox="0 0 440 392">
  <path class="dg-line" d="M280 56.3A152 152 0 0 1 368.8 165.1" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M369.4 224A152 152 0 0 1 282.7 334.4" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M160 335.7A152 152 0 0 1 71.2 226.9" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M70.6 168A152 152 0 0 1 157.3 57.6" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--dashed" d="M312 196H276" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--dashed" d="M220 224V316" marker-end="url(#arrow)" data-step="3"/>

  <g data-step="1 5">
    <rect class="dg-box" x="160" y="16" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="35" text-anchor="middle" dominant-baseline="central">銀行政策</text>
    <text class="dg-sub" x="220" y="55" text-anchor="middle" dominant-baseline="central">合規／准入／放貸規則</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="312" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="372" y="187" text-anchor="middle" dominant-baseline="central">Arva agent</text>
    <text class="dg-sub" x="372" y="207" text-anchor="middle" dominant-baseline="central">Arva Intel 調查個案</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="160" y="320" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="339" text-anchor="middle" dominant-baseline="central">可稽核決策</text>
    <text class="dg-sub" x="220" y="359" text-anchor="middle" dominant-baseline="central">決策＋理由</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="8" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="68" y="187" text-anchor="middle" dominant-baseline="central">銀行覆核</text>
    <text class="dg-sub" x="68" y="207" text-anchor="middle" dominant-baseline="central">回饋結果</text>
  </g>

  <rect class="dg-box dg-box--store" x="168" y="168" width="104" height="56" rx="6"/>
  <text class="dg-label" x="220" y="187" text-anchor="middle" dominant-baseline="central">AgentCore</text>
  <text class="dg-sub" x="220" y="207" text-anchor="middle" dominant-baseline="central">每圈累積更多案例</text>

  <text class="dg-edge" x="292" y="182" text-anchor="middle" dominant-baseline="central" data-step="2">寫入</text>
  <text class="dg-edge" x="230" y="270" text-anchor="start" dominant-baseline="central" data-step="3">套用</text>
</svg>
```

公司過去一年已在美國前十大銀行之一、一家標普 500 支付機構，以及全球金融科技公司 Wise 等客戶端大規模部署，目前瞄準美國最大的 40 到 50 家銀行作為目標客群。

## 這筆融資的信號

### 對 Agent 生態的意義

Arva 代表的轉折不是「AI 幫銀行員工做得更快」，而是「銀行把簽字權交給 agent」——官方公告寫得很直接：客戶今年開始把真正關鍵的決策交給 Arva 的 agent 處理，人只負責設政策和事後覆核結果。這筆錢的用途也呼應這個方向：優先投入 Arva Research 做更多專用模型、擴大 AgentCore，然後把 agent 的決策範圍擴展到爭議處理、支付操作與放貸這些還沒覆蓋的類型。

### 投資人在賭什麼

Arthur Ventures 管理合夥人 Patrick Meenan 的邏輯很直白：銀行要把最重要的決策交給 AI，前提是結果可信、可以跟監管機關解釋清楚——這正是 Arva 用「模型實驗室＋持續學習」取代單一通用模型的理由。Y Combinator 與 Gradient Ventures 是從 2025 年 1 月那輪 $3M 種子輪就投的老股東，當時 Arva 做的還是企業身分驗證，跟現在的銀行決策 agent 是完全不同的產品方向——兩家續投，代表他們賭的是這個團隊轉型執行的速度，不是單一產品本身。

### 值得觀察的數字

- 從種子輪到 A 輪僅 22 個月累計 $23M，金額不算大，但客戶已經包含美國前十大銀行與標普 500 等級的支付機構——金融業這類監管密集的客戶，採用速度通常比募資速度慢，Arva 目前呈現的是反過來的狀態。
- 員工數從 2024 年 0 人成長到 2026 年 6 月約 20 人，工程團隊占 56.5%，顯示現階段資源仍集中在把模型做準，而非擴大銷售團隊。
- Arva Intel 的「比主流模型準確 13%」是公司自測數據，沒有第三方驗證，這點在報導時需要特別註明。

## Watchlist 狀態

Arva AI 尚未在 watchlist 中。建議加入 section D6（金融業垂直 agent），與 Hebbia、Gradient Labs 並列追蹤，追蹤重點放在 Arva Research 自建模型的準確度主張能否經第三方驗證，以及從合規審查擴展到放貸、爭議處理的進度。

## 今日收穫

多數「企業 AI agent」的敘事還停在「幫員工做草稿、人來核准」，但 Arva 的客戶已經在讓 agent 直接做出合規與放貸這類不可逆的決策——真正的分水嶺不是 agent 能不能接觸敏感資料，而是出錯的代價能不能被完整追溯到「哪個政策、哪個模型版本、哪一步判斷」，這也是為什麼 Arva 要自建模型實驗室，而不是直接疊一層 prompt 在通用模型上。

## 參考資料

- [Arva AI Raises $20M Series A to Build AI for Critical Banking Operations - Arva AI](https://arva.ai/blog/arva-ai-raises-20m-series-a)
- [Arva AI Raises $20 Million To Build AI Agents for Bank Compliance Teams - VentureBurn](https://ventureburn.com/arva-ai-raises-20-million-build-bank-ai-agents-trust/)
