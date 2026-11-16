---
title: "融資速報｜Corma Series A $125M（NEA 領投，出 stealth 三個月成獨角獸）"
date: 2026-11-17
category: daily
type: digest
tags: [ai-agent, funding, daily, corma, agent-security]
lang: zh-TW
description: "訓練自有基礎模型做防禦性資安的 Corma，出 stealth 僅三個月就完成 $125M Series A，估值 $1B，由 NEA 領投"
tldr: "Corma 完成 $125M Series A，由 NEA 領投，Sequoia、Khosla、Coatue 跟投,估值 $1B,累計融資 $185M。這筆錢代表的訊號:在「Black October」一連串資安事件後,VC 對「攻防智慧不對等」這個敘事的信心,足以讓一家三個月前才出 stealth 的公司直接跳成獨角獸。"
series:
  name: "AI Agent Funding"
  order: 140
---

> 🌏 [English version](/posts/daily/2026-11-17-funding-corma-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Corma（以色列特拉維夫／美國舊金山） |
| 輪次 | Series A |
| 金額 | $125M |
| 領投 | NEA |
| 跟投 | Sequoia Capital、Khosla Ventures、Coatue（均為既有投資人） |
| 估值 | $1B（三個月前種子輪後首次揭露估值,無前一輪數字可比對） |
| 累計融資 | $185M（含 2026 年 8 月 $60M 種子輪） |
| 成立年份 | 2025 年（創辦人 Alon Pluda，以色列 8200 部隊退伍） |
| 員工數 | ~25 人（Calcalist 報導） |

## 這家公司做什麼

Corma 是訓練自有基礎模型做「防禦性資安」的公司——主張市面上的模型都是為寫程式和攻擊優化的,從來沒有一個模型是專門為「防守」設計的。

核心產品不是傳統資安工具,而是一支由自家基礎模型驅動的「AI workforce」,接入企業現有的資安工具鏈,自主調查威脅、執行防禦任務、橫跨整個資安任務光譜,完全不需要人工介入。公司的論點是:程式碼模型越強,找漏洞的能力也越強,但防禦工作需要的是完全不同的能力——在巨量日誌、資安事件、網路流量裡挖出微弱訊號,跨系統、跨長時間窗口做關聯分析,並在連續幾千個判斷裡維持一致性,這些是寫程式用的模型從沒被訓練過的。

目前客戶橫跨醫療、金融服務、能源與關鍵基礎設施、零售、電信等產業,出 stealth 三個月以來需求從 Fortune 100、Fortune 500 一路延伸到 Fortune Global 500 企業,逼得公司把伺服器容量擴大 24 倍才跟得上。

## 這筆融資的信號

### 對 Agent 生態的意義

這筆錢緊接在 10 月「Black October」——一連串針對全球最常用軟體的重大漏洞與入侵事件——之後出現,時間點本身就是訊號:攻擊端已經把寫程式模型的進步直接轉化成攻擊能力,防禦端卻遲遲等不到對等的工具,VC 在這個缺口上快速下注。資金會用於擴充運算容量與持續訓練模型,公司的目標直接寫成「朝防禦性資安的 superintelligence 前進」。

### 投資人在賭什麼

NEA 合夥人 Aaron Jacobson 的說法是「Corma 是唯一一家用可規模化方式處理這個問題的公司」,邏輯是攻防已經變成「智慧對智慧」的戰場,單靠人力資安團隊補不上這個缺口。Sequoia、Khosla、Coatue 三個月前就已經押過種子輪,這輪選擇加碼而非讓新資方稀釋持股,是對團隊(整合了 Google DeepMind 的前沿 AI 研究背景與以色列 8200 部隊的實戰資安經驗)和早期需求訊號的高度信心。

### 值得觀察的數字

```diagram
title: Corma 從出 stealth 到 Series A 的估值與融資節奏
desc: 三個月內完成種子輪到 Series A，估值從未揭露直接跳到 $1B。
caption: 數字來自 Corma 官方公告（businesswire，2026-11-16）與 Calcalist 報導（2026-11-16）。
---
<svg viewBox="0 0 640 220">
  <text class="dg-small" x="160" y="24" dominant-baseline="central">累計融資（$M）</text>
  <line class="dg-grid" x1="160" y1="40" x2="160" y2="176"/>

  <g>
    <rect class="dg-bar dg-c-muted" x="160" y="60" width="96" height="36"/>
    <text class="dg-sub" x="264" y="78" dominant-baseline="central">$60M 種子輪（2026-08，估值未揭露）</text>
  </g>
  <g>
    <rect class="dg-bar dg-c-accent" x="160" y="120" width="296" height="36"/>
    <text class="dg-label dg-text--accent" x="464" y="138" dominant-baseline="central">$185M 累計／估值 $1B（2026-11）</text>
  </g>

  <line class="dg-axis" x1="160" y1="40" x2="160" y2="176"/>
</svg>
```

- 伺服器容量擴大 24 倍,是這篇公告裡最具體的「需求壓力」指標,比客戶數或營收數字更難灌水,因為容量擴充本身要花錢、花時間。
- 三個月內從出 stealth 到 $1B 估值,Dealroom 的評語是「這輪規模落在以色列企業軟體 Series A 的第 99 百分位」——換句話說,這不是正常速度的 Series A,是資本市場在搶時間窗口。
- 團隊僅 ~25 人就撐起 $1B 估值,人均估值約 $40M,遠高於多數同階段資安新創——真正的風險在於:這個估值賭的是「團隊規格」(DeepMind + 8200)和敘事,而不是已驗證的營收規模,後續輪次會是更硬的考驗。

## Watchlist 狀態

Corma 尚未在 watchlist 中。建議加入 section B7（Agent 安全 / 治理 / 資安技術），追蹤重點：自訓防禦性資安基礎模型、自主 AI workforce、$125M Series A、NEA 領投、估值 $1B。

## 今日收穫

Corma 三個月內從 stealth 衝到獨角獸,靠的不是已驗證的客戶留存或營收曲線,而是「攻防智慧不對等」這個敘事剛好撞上「Black October」這個真實事件——這提醒我們,資安賽道的估值節奏有時候是被公開事件的時間窗口推著走,而不是按公司自身的成長曲線推進。

## 參考資料

- [Corma Raises $125M Series A at $1B Valuation to Scale Its Frontier Foundation Model for Cyber Defense as Fortune 500 Adoption of Its Models Surges](https://www.financialcontent.com/article/bizwire-2026-11-16-corma-raises-125m-series-a-at-1b-valuation-to-scale-its-frontier-foundation-model-for-cyber-defense-as-fortune-500-adoption-of-its-models-surges)
- [Cyber startup Corma goes from stealth to unicorn in just three months with $125 million Series A - CTech (Calcalist)](https://www.calcalistech.com/ctechnews/article/bjiqapu0me)
- [Defensive AI agents co Corma raises $125m at $1b valuation - Globes](https://en.globes.co.il/en/article-defensive-ai-agents-co-corma-raises-125-million-at-1b-valuation-1001563580)
