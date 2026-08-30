---
title: "融資速報｜Keenable Seed $26M"
date: 2026-08-28
category: daily
tags: [ai-agent, funding, daily, keenable, search-api]
lang: zh-TW
description: "前 Yandex 搜尋部門主管創立 Keenable，出關即拿下 $26M Seed，要做「給 AI Agent 用」的搜尋基礎設施"
tldr: "Keenable 出關隱身模式，宣布完成 $26M Seed，由 Accel 領投，Conviction Partners 跟投。公司賭的不是「比 Google 更好的搜尋」，而是 AI Agent 的查詢模式本來就跟人類不一樣，需要一套從頭為機器查詢設計的索引與檢索基礎設施。"
series:
  name: "AI Agent Funding"
  order: 14
---

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Keenable（Keenable.ai Inc.，美國舊金山） |
| 輪次 | Seed |
| 金額 | $26M |
| 領投 | Accel（合夥人 Zhenya Loginov 主導） |
| 跟投 | Conviction Partners，以及來自 Amazon、ClickHouse、Databricks、Google、Snowflake、SpaceX/xAI 等公司高管的天使投資人 |
| 估值 | 未揭露 |
| 累計融資 | $26M（首輪，出關隱身模式） |
| 成立年份 | 未揭露（2026 年 8 月出關） |
| 員工數 | 15 人（美國、歐洲團隊），計畫年底前翻倍 |

## 這家公司做什麼

Keenable 是一套「專門給 AI Agent 用」的網頁搜尋基礎設施——它的論點是,現有搜尋工具是為人類偶爾搜一下設計的,但 AI Agent 的查詢方式頻率高、模式機械化、規模動輒上億次,兩者需要的底層架構完全不同。

創辦人 Andrey Styskin 曾任 Yandex 搜尋/AI/雲端事業群總裁,帶過 7000 多人的組織,在俄羅斯市場兩度打贏 Google(桌面版與行動版);共同創辦人 Matthias Petri 則來自 Amazon AGI,曾與 Styskin 一起打造 Alexa 的網頁檢索基礎設施。兩人自建了一個超過 1000 億份文件的獨立網頁索引,提供低延遲搜尋 API、頁面內容擷取,以及 MCP 介面,號稱已在多家(未具名)AI 實驗室與推理服務商的訓練與線上推論流程中投入使用。公司正在開發的下一步產品「Web Query Language」,目標是讓 AI 系統能同時從多個網頁來源組合出一個答案,即使沒有任何單一頁面包含完整資訊。

## 這筆融資的訊號

### 對 Agent 生態的意義

這輪募資的時機點,剛好卡在傳統搜尋 API 供給面收緊的節骨眼上——Microsoft 已在 2025 年 8 月終止 Bing Search API,改成計費更貴、也不是直接替代品的 Azure「Grounding with Bing Search」；Google 也在收緊 Custom Search API,轉向更綁定、更挑對象的合作模式。這代表 AI 公司在網頁規模搜尋這一層的選擇正在變少,而 Keenable、Exa、Brave、Tavily 這類獨立索引商正好補上這個缺口。如果「Agent 查詢模式跟人類不同,需要專屬索引」這個論點成立,現有搜尋 API 賽道(watchlist C1)的競爭邏輯會從「誰的搜尋結果更準」轉向「誰的機器查詢成本結構更划算」。

### 投資人在賭什麼

Accel 合夥人 Zhenya Loginov 的邏輯很直接:巨頭正在收緊網頁規模搜尋 API 的供給,AI 公司手上的選項本來就不多。但這個賽道已經有 Exa、Brave、Perplexity、Tavily 等多家已募資新創在跑,Keenable 能在種子輪就拿下 Accel 領投,靠的主要是創辦人背景——Styskin 在 Yandex 建過 2000 億份文件的索引,而且是實戰打贏過 Google 的少數案例之一。這是一筆典型的「賭人不賭產品」的種子輪:公司自己承認索引建置成本「痛苦地貴」,商業模式能不能撐住還有待驗證。

### 值得觀察的數字

- 種子輪階段就已建成超過 1000 億份文件的獨立索引,規模對一家剛出關的新創而言並不常見,顯示團隊在募資前就已投入相當資源自建基礎設施,而非先拿到錢再開始建;
- 據二手報導,Keenable 在大量查詢情境下的定價約為每千次查詢 $1,若屬實則比 Brave、Exa 便宜 5-7 倍——但這個數字來自轉述而非官方公開費率卡,需要保留;
- 15 人工程團隊維運一個聲稱已進入多家 AI 實驗室生產環境的索引服務,人力規模與野心(「成為 AI Agent 版的 Google」)之間的落差,是這輪錢主要要補的執行風險。

## Watchlist 狀態

Keenable 尚未在 watchlist 中。建議加入 section C1（搜尋 API / Answer Engine），與 Exa、Tavily、Brave Search、Perplexity 並列追蹤，追蹤重點：為 AI Agent 查詢模式設計的獨立網頁索引、Seed $26M（Accel 領投）、正在開發的 Web Query Language。

## 今日收穫

我原本以為「給 AI 用的搜尋基礎設施」這個賽道已經被 Exa、Brave、Tavily、Perplexity 這幾家瓜分得差不多,種子輪很難再切出新的空間。Keenable 的定位提醒我,這幾家其實還是在「幫 Agent 找到人類會滿意的搜尋結果」這個框架裡競爭,而 Keenable 的賭注是換一個座標系——不是把搜尋做得更準,而是承認機器的查詢頻率、意圖粒度跟人類完全不同,需要一套從成本結構就重新設計的索引,這是既有搜尋引擎「retrofit」不出來的路線,才是它敢在擁擠賽道裡再切一刀的底氣。

## 參考資料

- [Accel-backed Keenable is indexing the web for AI agents](https://techcrunch.com/2026/08/25/accel-backed-keenable-is-indexing-the-web-for-ai-agents/) — TechCrunch
- [Our Seed Investment in Keenable: Search Infrastructure for better AI Agents](https://www.accel.com/news/our-seed-investment-in-keenable-search-infrastructure-for-better-ai-agents) — Accel（官方公告）
- [Agentic web search infrastructure startup Keenable raises $26M](https://siliconangle.com/2026/08/25/agentic-web-search-infrastructure-startup-keenable-raises-26m/) — SiliconANGLE
