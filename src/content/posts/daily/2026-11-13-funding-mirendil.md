---
title: "融資速報｜Mirendil Series A $1B（估值未揭露，Kleiner Perkins、Clearlake Capital 領投）"
date: 2026-11-13
category: daily
type: digest
tags: [ai-agent, funding, daily, mirendil, ai-research-lab]
lang: zh-TW
description: "前 Anthropic 研究員創辦的 Mirendil 完成 $1B Series A，用 AI agent 自動化前沿 AI 研發，成立不到一年累計募資已達 $1.2B"
tldr: "Mirendil 完成 $1B Series A，由 Kleiner Perkins 與 Clearlake Capital 領投，累計融資 $1.2B，但成立不到一年、至今沒有正式產品路線圖。這筆錢代表的訊號：VC 願意為「頂尖人才 + agent 自動化研究」的敘事買單，不必等產品或營收驗證。"
series:
  name: "AI Agent Funding"
  order: 130
---

> 🌏 [English version](/posts/daily/2026-11-13-funding-mirendil-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Mirendil（美國，舊金山） |
| 輪次 | Series A |
| 金額 | $1B |
| 領投 | Kleiner Perkins、Clearlake Capital |
| 跟投 | Battery Ventures、Doerr Capital、Gil & Co、Google、M13、Pear VC、S32 等 |
| 估值 | 未正式揭露（Bloomberg 9 月報導雙方洽談中的目標為 $5B，與最終結案數字可能不同） |
| 累計融資 | $1.2B（$200M 種子輪 + $1B Series A） |
| 成立年份 | 2026 年初 |
| 員工數 | 種子輪時約 20 人（多數來自 Anthropic、xAI、Google DeepMind、OpenAI） |

## 這家公司做什麼

Mirendil 做的是用 AI agent 自動化「AI 研發」這件事本身——目標是讓一個研究者配合一批 agent，就能做到過去需要整個團隊才能完成的前沿 AI 研究工作。

公司過去三週公開的第一批成果，走的是同一條路線：先用不到 $10M 算力、3.5 個月從零訓練出一個有競爭力的程式模型 Mirendil-Base，再把它 post-train 成 Fern，支援高達 1000 萬 token 的 context，足夠讓 agent 連續工作好幾天。目前私測中的 Lor，則是讓數百個 agent 同時寫程式、跑實驗，一次跑好幾天；Mirendil 自己每天的研發工作就跑在 Lor 上。

創辦人 Behnam Neyshabur 與 Harsh Mehta 2019 年在 Google 相識，2024 年底一起加入 Anthropic，2025 年 12 月離職創業，理由很直接：前沿 AI 研發的能力不該只侍候在少數幾家大型 lab 手上。公司目前仍處於產品上市前階段，三個月前估值就已經有 VC 搶著談到 $5B。

## 這筆融資的信號

### 對 Agent 生態的意義

這輪錢代表的訊號是 agent 不只被拿來做產品，也被用來自動化 AI 研發流程本身——Mirendil 的賣點不是又一個聊天機器人或 coding assistant，而是「用 agent 取代研究團隊的人力規模」，把原本需要整個實驗室才能做的頂尖 AI 研究，壓縮到幾個人加 agent 就能跑。

```diagram
title: Mirendil 從種子輪到 Series A 的估值爬升
desc: 2026 年 6 月種子輪確認 $1B 估值後，3 個月內傳出洽談 $5B 的目標，11 月 Series A 正式落地但未揭露最終估值。
caption: 簡化示意：三個時間點的估值資訊來自不同來源（官方公告、Bloomberg 報導、官方公告未揭露），精確度不同。
step: 2026 年 6 月：種子輪 $200M
step: 2026 年 9 月：傳出洽談中
step: 2026 年 11 月：Series A $1B
---
<svg viewBox="0 0 520 160">
  <rect class="dg-box" x="8" y="52" width="150" height="64" rx="6" data-step="1"/>
  <text class="dg-label" x="83" y="76" text-anchor="middle" dominant-baseline="central" data-step="1">種子輪 $200M</text>
  <text class="dg-sub" x="83" y="96" text-anchor="middle" dominant-baseline="central" data-step="1">估值 $1B</text>

  <path class="dg-line" d="M158 84H190" marker-end="url(#arrow)" data-step="2"/>

  <rect class="dg-box dg-box--accent" x="190" y="52" width="150" height="64" rx="6" data-step="2"/>
  <text class="dg-label" x="265" y="76" text-anchor="middle" dominant-baseline="central" data-step="2">洽談目標 $5B</text>
  <text class="dg-sub" x="265" y="96" text-anchor="middle" dominant-baseline="central" data-step="2">Bloomberg 報導未確認</text>

  <path class="dg-line" d="M340 84H372" marker-end="url(#arrow)" data-step="3"/>

  <rect class="dg-box" x="372" y="52" width="140" height="64" rx="6" data-step="3"/>
  <text class="dg-label" x="442" y="76" text-anchor="middle" dominant-baseline="central" data-step="3">Series A $1B</text>
  <text class="dg-sub" x="442" y="96" text-anchor="middle" dominant-baseline="central" data-step="3">估值未揭露</text>
</svg>
```

### 投資人在賭什麼

Kleiner Perkins 與 Clearlake Capital 在種子輪（2026 年 6 月，$200M@$1B）就已經領投，這次 Series A 繼續加碼，顯示他們押注的不是單次交易的回報，而是「前沿 AI 研發民主化」這個主題會持續吸引資本——離職創業不到一年，估值傳聞已翻了至少 5 倍，顯示頂級 VC 願意為頂尖人才背景和早期訊號買單，不必等產品或營收驗證。

### 值得觀察的數字

- 種子輪到 Series A 只隔不到 5 個月（2026 年 6 月 → 11 月），募資速度遠超一般 AI 公司的週期
- 累計融資 $1.2B，但公司至今未公開任何正式產品路線圖或營收數字，說明目前完全是「信任團隊背景」的估值模式
- 9 月 Bloomberg 報導的洽談目標估值是 $5B，如果最終結案數字接近，代表 5 個月內估值漲了 5 倍

## Watchlist 狀態

Mirendil 尚未在 watchlist 中。建議加入 section A2（AI 模型/平台公司），理由：Mirendil 用 agent 自動化前沿 AI 研發，是把「用 AI 做 AI 研究」這個主題商業化的代表案例，值得追蹤它的模型（Mirendil-Base、Fern）與 agent 平台（Lor）之後是否會開放給外部客戶。

## 今日收穫

一個不到一年、沒有正式產品、沒有營收的公司能募到 $1B，代表我們正處在「人才與敘事比產品還值錢」的估值階段——但吊詭的是，這次投資人賭的正是 agent 本身能讓這種「小團隊、大野心」的敘事成真：過去需要驗證產品市場契合度才能募到的錢，現在只要證明「agent 真的能取代一個研究團隊」的早期訊號就夠了。

## 參考資料

- [Mirendil Raises $1B to Democratize Frontier AI R&D](https://www.prnewswire.com/news-releases/mirendil-raises-1b-to-democratize-frontier-ai-rd-302937248.html)
- [Mirendil raises $1B to put frontier AI research within reach of small teams](https://runtimewire.com/article/mirendil-raises-1b-series-a-frontier-ai-rd)
- [Mirendil Raises $1 Billion Series A for Agent-Led AI Research Tools](https://www.securities.io/mirendil-raises-1-billion-series-a-for-agent-led-ai-research-tools/)
- [Report: Ex-Anthropic duo's Mirendil in talks for $5B valuation just 3 months after $1B seed](https://techfundingnews.com/report-ex-anthropic-duos-mirendil-in-talks-for-5b-valuation-just-3-months-after-1b-seed/)
- [Ex-Anthropic Staffers' Self-Improving AI Startup in Talks to Raise at $5 Billion Value](https://www.bloomberg.com/news/articles/2026-09-22/ex-anthropic-staffers-ai-startup-in-talks-to-raise-at-5-billion-value)
