---
title: "融資速報｜Flapping Airplanes Series A $1B（成立一年估值衝到 $6B）"
date: 2026-10-23
category: daily
type: digest
tags: [ai-agent, funding, daily, flapping-airplanes, ai-research-lab]
lang: zh-TW
description: "Flapping Airplanes 完成 $1B Series A，Index 與 Lux 共同領投，成立僅一年估值從種子輪的 $1.5B 衝到 $6B，主張用更少資料訓練模型"
tldr: "Flapping Airplanes 完成 $1B Series A，Index 與 Lux 共同領投，估值在 9 個月內從種子輪的 $1.5B 翻了 4 倍衝到 $6B。這筆錢的信號：矽谷正把「資料效率」當成下一個基礎模型軍備競賽維度——賭的不是繼續餵更多網路資料，而是用更少資料訓練出同等能力的模型。"
series:
  name: "AI Agent Funding"
  order: 102
---

> 🌏 [English version](/posts/daily/2026-10-23-funding-flapping-airplanes-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Flapping Airplanes（美國） |
| 輪次 | Series A |
| 金額 | $1B |
| 領投 | Index Ventures、Lux Capital（共同領投） |
| 跟投 | 既有投資人 Sequoia Capital、GV（Google Ventures）、Kleiner Perkins；另有 Valor、Atreides、A*、NVIDIA 參與 |
| 估值 | $6B（9 個月前種子輪估值為 $1.5B，成長約 4 倍） |
| 累計融資 | $1.18B（種子輪 $180M + 本輪 $1B） |
| 成立年份 | 約 2025 年（報導稱「成立一年的 AI 實驗室」） |
| 員工數 | 未揭露 |

## 這家公司做什麼

Flapping Airplanes 是做基礎模型訓練技術的 AI 研究實驗室——目標不是訓練更大的模型，而是用更少資料訓練出同等能力的模型。

核心技術是他們自稱「業界最完整的 megakernel 框架」——能在單一 GPU kernel 裡同時執行完整訓練、推理服務，甚至同時玩電玩遊戲測試，主張能讓「記憶體密集的推理」與「運算密集的訓練」重疊執行，讓 GPU 幾乎不閒置。創辦團隊由 Aidan Smith（前 Thiel Fellow，曾在 Neuralink 工作）與 Spector 兄弟（Asher 為 Stanford 統計學博士、Ben 為 Stanford 計算機科學博士，同時創辦了 MIT 學生創業加速器 Prod）組成，被 Sequoia 合夥人 David Cahn 稱為「年輕人的 AGI 實驗室」。

公司目前仍處於研究階段，尚未公開商業化產品或客戶名單，9 個月前才以 $180M 種子輪（GV、Sequoia、Index 領投）公開亮相，當時估值僅 $1.5B。

## 這筆融資的信號

### 對 Agent 生態的意義

「資料效率」直接關係到訓練與服務 AI Agent 所需的運算成本——如果 Flapping Airplanes 的 megakernel 框架真能讓同等能力的模型用更少資料、更少運算達成，對整個 Agent 生態的意義是：執行 Agent 所需的推理成本可能大幅下降，讓「企業同時部署數千個 Agent」這種情境的經濟可行性提高。但這目前仍是研究階段的主張，沒有公開的 benchmark 數據可驗證。

### 投資人在賭什麼

領投方 Index 與 Lux 的邏輯，很大程度上是賭「創辦團隊」而非賭「已驗證的技術」——Sequoia 合夥人 David Cahn 的說法直接點出這是賭「年輕人的 AGI 實驗室」，投資邏輯更接近押注一群出身矽谷最強學生創業網路（Prod）的團隊，而非評估已有產品的市場驗證。9 個月內估值 4 倍成長（$1.5B → $6B），且在沒有公開產品與客戶的情況下發生，顯示這輪融資的敘事成分遠高於財務成分。

### 值得觀察的數字

- 估值 4 倍成長（9 個月內，$1.5B → $6B）遠高於同期法律 AI 新創 Legora 的 1.57 倍（7 個月內，$5.6B → $8.8B），顯示市場給「研究敘事」的溢價目前高於「已驗證 ARR」
- 本輪 $1B 相較種子輪 $180M，單輪金額成長約 5.6 倍——對比 DeepSeek 本輪（$15B）與 6 月輪（$7B）約 2 倍的成長幅度，顯示研究階段新創的融資倍數可以遠高於已商業化的公司
- 公司成立僅約一年，兩輪募資合計 $1.18B，尚未公開任何產品或客戶，是今日三則融資中唯一完全沒有營收或 ARR 數字可參照的案例

## Watchlist 狀態

Flapping Airplanes 尚未在 watchlist 中。建議加入 section A2（AI 模型/平台公司），追蹤重點：megakernel 框架與資料效率訓練主張，目前仍無公開產品可驗證，待下一輪募資或產品發布時再評估是否需要更積極追蹤。

## 今日收穫

通常「沒有產品、沒有客戶、沒有營收」的新創很難拿到 $1B 輪，但 Flapping Airplanes 證明在基礎模型賽道，「團隊履歷」本身可以是融資的核心資產——當 Sequoia 合夥人把投資理由寫成「賭年輕人的 AGI 實驗室」而非「賭技術已驗證」時，說明資本在基礎模型這一層的估值邏輯，跟應用層 Agent 公司（例如同一週公布融資的 Legora、Pigment）看 ARR、看客戶擴張的邏輯，是完全不同的兩套遊戲規則。

## 參考資料

- [Year-old AI lab Flapping Airplanes raises $1B at a $6B valuation](https://techcrunch.com/2026/10/21/year-old-ai-lab-flapping-airplanes-raises-1b-at-a-6b-valuation/)
- [AI research startup Flapping Airplanes valued at $6 billion in round](https://www.bloomberg.com/news/articles/2026-10-21/ai-research-startup-flapping-airplanes-valued-at-6-billion-in-round)
- [Flapping Airplanes and the promise of research-driven AI](https://techcrunch.com/2026/01/29/flapping-airplanes-and-the-promise-of-research-driven-ai/)
