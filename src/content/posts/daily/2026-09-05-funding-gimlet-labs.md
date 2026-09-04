---
title: "融資速報｜Gimlet Labs Series B $300M"
date: 2026-09-05
category: daily
type: digest
tags: [ai-agent, funding, daily, gimlet-labs, inference-infrastructure]
lang: zh-TW
description: "AI 推理基礎設施新創 Gimlet Labs 完成 $300M Series B，Andreessen Horowitz 領投，打造橫跨多種晶片架構的 Agentic AI 推理雲"
tldr: "Gimlet Labs 完成 $300M Series B，由 Andreessen Horowitz 領投，估值 $3B，距離半年前 Series A 的 $400M 估值成長 7.5 倍。這筆錢代表 VC 開始押注「多晶片協調層」而不是單一晶片架構，才是 Agentic AI 推理效能的下一個瓶頸解法。"
series:
  name: "AI Agent Funding"
  order: 24
---

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Gimlet Labs（美國，舊金山） |
| 輪次 | Series B |
| 金額 | $300M |
| 領投 | Andreessen Horowitz |
| 跟投 | Sapphire Ventures、Arm、M12（Microsoft）、Menlo Ventures、Factory、Samsung Ventures、Tiger Global Management 等共 17 家機構 |
| 估值 | $3B（Series A 時為 $400M，6 個月內成長 7.5 倍） |
| 累計融資 | $392M |
| 成立年份 | 2023 |
| 員工數 | 未公開最新人數（2025 年 10 月出關時約數十人規模） |

## 這家公司做什麼

Gimlet Labs 是做「多晶片推理雲」的公司——它不押注單一晶片架構，而是把一個 AI 推理工作拆成多個階段，動態分配到 GPU、CPU、以及各家專用加速晶片上，讓每個階段都跑在最適合的硬體上。

核心產品是它自稱「業界第一個 multi-silicon inference cloud」的平台，同時支援 NVIDIA、AMD、Intel、Arm、Cerebras、d-Matrix 等晶片架構，客戶可以用它的代管雲、也可以把整套软體部署進自己的機房。公司主張這種異質硬體協調能帶來 3 到 10 倍的推理速度提升，在相同功耗與成本下擠出更多算力——這正好對上 Agentic AI 工作負載對低延遲、高互動性的胃口。

公司 2025 年 10 月才正式出關（stealth exit），當時就已有八位數營收，客戶橫跨 AI 原生公司與財星 500 大企業。今年 3 月宣布客戶數三倍成長，並拿下一家前三大前沿實驗室和一家前三大雲端服務商當客戶；到 9 月這輪，公司說已經拿到「數十億美元的合約營收」，正在把管理中的異質運算規模擴大到數百 MW 等級。

## 這筆融資的信號

### 對 Agent 生態的意義

Agentic AI 工作負載把「推理」推上了軟體世界最大宗工作量的位置，但資料中心的硬體規劃長期是為訓練或單一晶片型態設計的，這筆錢要解決的正是這個落差。Gimlet 說這輪資金會用來擴大多晶片雲的營運規模、同時繼續擴編團隊；創辦人 Zain Asgar 也提到公司已經開始跨入資料中心本身的設計——因為不同晶片對散熱、供電、機櫃配置的需求都不一樣，軟體層的異質調度最終逼出了實體基礎設施的問題。換句話說，Gimlet 想卡住的不是「哪個晶片最強」，而是「協調多種晶片的那層軟體」會不會變成下一層基礎設施本身。

### 投資人在賭什麼

領投的 a16z 合夥人 Raghu Raghuram（同時是 Gimlet 董事）直接把賭注講白了：「答案不是蓋更多基礎設施，而是更好的架構。」這筆投資緊接在 a16z 8 月底把 Growth Fund 擴大到 $8.5B、並剛推出鎖定晶片／記憶體／資料中心／機器人的 $1.1B Machine Age Fund 之後——Gimlet 正好卡進 a16z 押注「AI 底層實體基礎設施」這條主線，跟 OpenAI、Databricks、xAI、Anduril、SpaceX 這些既有被投公司放在同一個籃子裡。跟同樣做推理基礎設施的 Groq（$350M 輪、估值 $3.5B）、Cerebras（先是 $1B 輪估值 $23B，後來 Nasdaq 掛牌市值衝上 $56B）相比，Gimlet 選的路線不是自己做一顆更強的晶片，而是賭「多晶片協調軟體」本身就能長成獨立的基礎設施層。

### 值得觀察的數字

- 估值從 Series A 的 $400M 漲到 Series B 的 $3B，6 個月內 7.5 倍，漲幅速度比同期做企業級 Agent 平台的 Wonderful（6 個月 2.5 倍）更陡
- 累計募資 $392M 分成種子輪 $12M、Series A $80M、Series B $300M 三輪完成，距離 2025 年 10 月正式出關不到一年
- 客戶名單已包含「前三大前沿實驗室」與「前三大雲端服務商」等級的企業，這種客戶密度在同階段的基礎設施新創中並不常見

## Watchlist 狀態

Gimlet Labs 尚未在 watchlist 中。建議加入 section A3（推理基礎設施），追蹤重點：多晶片 Agentic AI 推理雲，$300M Series B，估值 $3B，Andreessen Horowitz 領投。

## 今日收穫

過去半年推理基礎設施的融資故事幾乎都圍繞著「誰的晶片更快」（Groq、Cerebras），但 Gimlet Labs 的估值漲幅說明市場也在同時押注另一條路線——不做晶片，而是做讓所有晶片能互相搭配的協調層；如果 Agentic AI 的工作負載真的越來越異質，這層「翻譯層」的價值可能不輸給任何一顆單一晶片。

## 參考資料

- [Now Valued at $3 Billion, Gimlet Labs Raises $300 Million in Series B Led by Andreessen Horowitz for Industry's First Multi-Silicon Inference Cloud for Agentic AI](https://finance.yahoo.com/technology/ai/articles/now-valued-3-billion-gimlet-160000722.html)
- [Andreessen-backed Gimlet Labs hits $3B valuation with $300M round as AI goes multi-chip](https://techfundingnews.com/andreessen-backed-gimlet-labs-hits-3b-valuation-with-300m-round-as-ai-goes-multi-chip)
- [Gimlet Labs Raises $300M in Series B Round; Valuation at $3B](https://www.marketwatch.com/story/gimlet-labs-raises-300m-in-series-b-round-valuation-at-3b-b64c1b60?mod=markets)
