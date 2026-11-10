---
title: "融資速報｜fal Series E&F $1.3B（估值翻倍到 $16B，生成媒體推理需求爆量）"
date: 2026-11-05
category: daily
type: digest
tags: [ai-agent, funding, daily, fal, inference-infra]
lang: zh-TW
description: "生成媒體推理基礎設施公司 fal 完成合計 $1.3B 的 Series E 與 F，估值半年內從 $8B 翻倍到 $16B，由 Bessemer 領投"
tldr: "fal 完成合計 $1.3B 的 Series E&F,由 Bessemer Venture Partners 領投,估值半年內從 $8B 翻倍到 $16B。這筆錢的信號:生成式媒體（圖/影片/音訊）的推理需求成長速度,已經快到讓基礎設施公司必須用融資換算力,而不是靠毛利慢慢滾。"
series:
  name: "AI Agent Funding"
  order: 125
---

> 🌏 [English version](/posts/daily/2026-11-05-funding-fal-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | fal（美國，舊金山） |
| 輪次 | Series E & F（同時公告） |
| 金額 | $1.3B |
| 領投 | Bessemer Venture Partners |
| 跟投 | Nvidia、Sound Ventures、T. Rowe Price |
| 估值 | $16B（前一輪 2026 年 4 月為 $8B，半年翻倍） |
| 累計融資 | 超過 $1.7B（含本輪） |
| 成立年份 | 2021 |
| 員工數 | ~80 人（2026 年 9 月第三方估計,近期因大規模擴張可能已增加） |

## 這家公司做什麼

fal 是一家幫開發者托管並運算圖片、影片、音訊生成模型的推理基礎設施公司——開發者不用自己租 GPU、搬模型,直接呼叫 API 就能跑超過 1,000 種生成模型。

核心產品是兩塊:一是私有管理運算環境,讓客戶把自己的模型部署到 fal 的基礎設施上跑;二是開源模型的現成 API,涵蓋圖片、影片、音訊、3D 生成,fal 是最早托管 Black Forest Labs 的 Flux 模型的平台之一（Flux 後來成為 X 的 Grok 影像生成引擎）。公司由 Burkay Gur（前 Coinbase 機器學習負責人）與 Gorkem Yurtseven（前 Amazon 工程師）在 2021 年共同創立,2020 年兩人在 Palm Springs 租房討論創業方向時,刻意避開當時人人都在做的 LLM,押注圖片/影片生成模型的推理優化。目前客戶包括 Adobe、Canva、Perplexity、Shopify 等,每天處理超過 1 億次推理呼叫,正常運行時間 99.99%,ARR 已超過 $800M。

## 這筆融資的信號

### 對 Agent 生態的意義

fal 不是一家做「Agent」的公司,但它是支撐生成式媒體這一整塊 AI 能力的底層管道——越來越多 agent 產品把「生成一張圖、一段影片」當成其中一步工具呼叫,背後排隊等的就是 fal 這類推理基礎設施的吞吐量。$1.3B 這輪的用途主要是擴充運算容量:CEO Burkay Gur 直言今年夏天公司一度因為需求暴增而不得不限流客戶,融資規模反映的是「追著需求跑」而不是「提前備好餘裕」的被動局面。

### 投資人在賭什麼

Bessemer 從早期就參與 fal 的融資(2025 年 Series D 階段已是跟投方),這次升級成領投,屬於「加碼確信」;Nvidia 的參與更像是戰略卡位——fal 是 Nvidia GPU 的大型下游買家,投資能讓 Nvidia 更貼近終端推理需求的實際波動。對比同賽道的 Baseten、Fireworks AI、Modal,這些推理服務商都在快速融資、拉高估值,但毛利普遍偏薄,因為運算成本（租或買 GPU）吃掉大部分收入——fal 這輪的賭法是先把規模做大到能跟 Nvidia 直接談價,再靠規模效應把毛利往上拉。

### 值得觀察的數字

- 估值半年內從 $8B 翻倍到 $16B(2026 年 4 月 → 11 月),翻倍速度高於多數同階段 AI infra 公司
- ARR 超過 $800M,相較於 2025 年同期約 $10M 的 ARR,一年多成長超過 80 倍,是本輪融資敘事裡最關鍵的成長證據
- 每天超過 1 億次推理呼叫、99.99% 正常運行時間,這兩個數字是 fal 用來跟 Baseten、Fireworks AI 等競爭者做可靠性區隔的主要依據

## Watchlist 狀態

fal 尚未在 watchlist 中。建議加入 section A3（推理基礎設施），但需註記:現有 A3 名單(Together AI、Fireworks、Baseten、RunPod 等)多數聚焦文字 LLM 的推理成本與延遲,fal 是少見專攻生成式媒體(圖片/影片/音訊)推理的玩家,賽道重疊度不高,追蹤重點建議標註為「生成媒體推理」以便與其他 A3 公司區分。

## 今日收穫

fal 刻意避開 LLM、押注生成式媒體推理的決定,在 2020 年看起來像是選了一個比較小的賽道,但 ARR 一年成長 80 倍說明:當每個 agent 產品都想加一個「生成圖片/影片」的工具呼叫,媒體生成推理的需求曲線其實跟文字 LLM 一樣陡——只是外界的注意力大多還停留在文字模型身上。

## 參考資料

- [AI inference startup Fal doubles its valuation to $16B as demand surges](https://techcrunch.com/2026/11/03/ai-inference-startup-fal-doubles-its-valuation-to-16b-as-demand-surges)
- [AI Inference Startup Fal Raises Capital at $16 Billion Valuation](https://www.bloomberg.com/news/articles/2026-11-03/ai-inference-startup-fal-raises-capital-at-16-billion-valuation)
- [fal: Generative Media AI Infrastructure Races to US$800m ARR](https://aimagazine.com/news/fal-generative-media-ai-infrastructure-races-to-us-800m-arr)
