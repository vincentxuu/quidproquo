---
title: "融資速報｜Humyn Labs Series A $47M"
date: 2026-11-23
category: daily
type: digest
tags: [ai-agent, funding, daily, humyn-labs, physical-ai]
lang: zh-TW
description: "物理 AI 資料新創 Humyn Labs 完成 $47M Series A，由 Accel 領投股權、Lighthouse Canton 領投venture debt，把工廠倉庫農場的真人工作轉成機器人訓練資料，六個月內自報年化營收破 $50M"
tldr: "Humyn Labs 完成 $47M Series A（$26M 股權 + $21M 創投債），由 Accel 與 Lighthouse Canton 分別領投。這筆錢代表物理 AI 賽道的瓶頸正從模型轉向「誰能最快蒐集到高品質的真實世界動作資料」。"
series:
  name: "AI Agent Funding"
  order: 152
---

> :globe: [English version](/posts/daily/2026-11-23-funding-humyn-labs-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Humyn Labs（印度 Bengaluru 關聯；於舊金山、倫敦、首爾設點） |
| 輪次 | Series A |
| 金額 | $47M（$26M 股權 + $21M 創投債） |
| 領投 | Accel（股權部分）、Lighthouse Canton（創投債部分） |
| 跟投 | Prosus Ventures, BeeGlobal, Finserv Intelligence（透過 Bajaj Finance）, Bajaj Alts AI Opportunities Fund, Dallas Venture Capital, Trifecta Capital, Jump Trading，天使投資人 Anita Pramoda（前 Epic CFO） |
| 估值 | 未揭露 |
| 累計融資 | 未揭露先前輪次（本輪 $47M 為目前已公開的唯一一輪） |
| 成立年份 | 2026（文章稱「今年成立」） |
| 員工數 | 未揭露 |

## 這家公司做什麼

Humyn Labs 是一家做「機器人訓練資料」的物理 AI 公司——把人類在工廠、倉庫、農場、居家環境裡做的真實工作，轉換成機器人可以學習的結構化資料。

核心產品是兩段式流程：專用捕捉裝置依客戶實驗室需求，錄下特定工作的視覺、聲音、動作、觸覺訊號；資料引擎再把這些錄製內容轉成帶有可驗證來源（provenance）標註的訓練資料集，賣給前沿 AI 實驗室、機器人公司與 world model 開發者。

公司自報在營運不到六個月內做到年化營收超過 $50M（未經審計）；據 TechCrunch 核實，4 月到 10 月間已有 12 個付費客戶、營收 $10M。目前在 20 多個國家、以 36 種語言營運資料蒐集據點，集中在拉丁美洲、東亞、南亞與東南亞。

```flow-diagram
{
  "title": "Humyn Labs 把真實工作轉成機器人訓練資料的管線",
  "lang": "zh-TW",
  "width": 560,
  "height": 520,
  "nodes": [
    {"id": "site", "label": "工廠／倉庫／農場／居家", "x": 280, "y": 50, "w": 320, "shape": "actor"},
    {"id": "capture", "label": "捕捉裝置錄製\n視覺／聲音／動作／觸覺", "x": 280, "y": 190, "w": 340},
    {"id": "engine", "label": "資料引擎標註可驗證來源", "x": 280, "y": 330, "w": 280, "shape": "chip"},
    {"id": "customer", "label": "前沿 AI 實驗室／機器人公司／\nWorld Model 開發者", "x": 280, "y": 470, "w": 380, "tone": "accent"}
  ],
  "edges": [
    {"from": "site", "to": "capture", "step": 1},
    {"from": "capture", "to": "engine", "step": 2},
    {"from": "engine", "to": "customer", "step": 3}
  ],
  "steps": [
    "捕捉裝置依客戶實驗室需求進駐工廠、倉庫、農場、居家環境，錄下真人工作者的視覺、聲音、動作、觸覺訊號",
    "錄製內容送進資料引擎，轉成帶有可驗證來源標註（provenance）的結構化訓練資料集",
    "標註完成的資料集賣給前沿 AI 實驗室、機器人公司與 world model 開發者"
  ]
}
```

## 這筆融資的信號

### 對 Agent 生態的意義

這筆錢主要用於在巴西、南韓、印度建立「部署就緒」基礎設施，擴充捕捉硬體與資料工程引擎，並在舊金山、倫敦、首爾設立據點。這顯示物理 AI 賽道的瓶頸正從「模型能力」轉移到「誰能用最低成本、最快速度蒐集到高品質的真實世界動作資料」。

### 投資人在賭什麼

領投的 Accel 合夥人 Pratik Agarwal 把這筆投資定位成「賣鏟子」邏輯——不賭哪家機器人公司或哪種模型架構會贏，而是賭「每家做物理 AI 的公司都需要資料」這個需求本身；前 Epic CFO Anita Pramoda 以天使身份加入，顯示企業軟體老將也看好物理 AI 的資料層會成為下一個基礎設施利基。

### 值得觀察的數字

自報「不到六個月做到 $50M 年化營收」，但對照 TechCrunch 核實的 4–10 月 $10M 營收與 12 個付費客戶，兩組數字之間的落差提示「年化」推算可能偏樂觀；創辦人 Manish Agarwal 喊出的目標，是在他估計的 $10B 資料基礎設施市場裡做到 $1B 年營收的公司，目前離目標還有兩個量級的差距。

## Watchlist 狀態

Humyn Labs 尚未在 watchlist 中。連同同一天報導的 Genesis AI，以及 9 月已報導的 General Intuition，現在已累積三家聚焦「物理 AI／機器人大腦與資料」的新創密集融資，建議評估在 watchlist 新增一個獨立分類（暫定「物理 AI / 機器人」），而不是繼續逐篇個案建議。

## 今日收穫

Humyn Labs 講的故事本質上是「機器人界的 Scale AI」——當每家機器人公司都想做出下一個 Genesis AI 或 Figure，卻不想自己建立全球資料蒐集網路時，就會有人專門把「資料蒐集管道」做成基礎設施來賣，而不用自己下場做機器人。

## 參考資料

- [Humyn Labs Raises USD 47M in Series A to Scale Physical AI Research and Deployment](https://prnewswire.com/news-releases/humyn-labs-raises-usd-47m-in-series-a-to-scale-physical-ai-research-and-deployment-302944293.html)
- [Humyn Labs Raises $47M to Scale Global Robot Training](https://nexuswild.com/news/humyn-labs-47m-series-a-real-world-robot-data)
