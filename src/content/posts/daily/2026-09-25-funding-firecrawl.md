---
title: "融資速報｜Firecrawl Series B $75M，要付錢跟人類買知識餵給 AI Agent"
date: 2026-09-25
category: daily
type: digest
tags: [ai-agent, funding, daily, firecrawl, search-api]
lang: zh-TW
description: "網頁資料抓取新創 Firecrawl 完成 $75M Series B，Smash Capital 領投，同步推出付費知識平台 Alexandria，賭的是 AI Agent 找資料的瓶頸會從「抓不到網頁」變成「找不到對的知識來源」"
tldr: "Firecrawl 完成 $75M Series B，由 Smash Capital 領投，距離一年前的 $20.7M Series A 剛好一年，累計融資逾 $95M。這輪錢最大的信號不是金額,而是同步推出的 Alexandria——一個要付費跟研究者、開發者、公部門買知識再轉賣給 AI Agent 的知識平台,代表這家公司正試著從「網頁抓取工具」升級成「AI Agent 的知識供應鏈」。"
series:
  name: "AI Agent Funding"
  order: 48
---

> 🌏 [English version](/en/posts/daily/2026-09-25-funding-firecrawl-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Firecrawl（美國，舊金山） |
| 輪次 | Series B |
| 金額 | $75M |
| 領投 | Smash Capital |
| 跟投 | Altos Ventures、Nexus Venture Partners、Y Combinator、Freestyle、Offline Ventures |
| 估值 | 未揭露 |
| 累計融資 | 約 $95.7M（Series A $20.7M ＋ 本輪 $75M） |
| 成立年份 | 2024 年 |
| 員工數 | 未揭露 |

## 這家公司做什麼

Firecrawl 是做網頁資料基礎設施的公司——給它一個 URL，它處理從抓取、渲染到解析、清理的整套流程，把任何網頁變成 AI 能直接讀的乾淨資料。三位創辦人 Caleb Peffer、Eric Ciarla、Nicolas Silberstein Camara 先前做的是 Mendable（一個給技術文件用的 AI 問答產品），做的過程中發現「把網路上的資料乾淨可靠地抓出來」才是整條 AI 應用鏈裡最難的一段，於是把這塊獨立出來變成 Firecrawl。

這次募資同步發布的 Alexandria，是把官方資料供應商、客製連接器、Firecrawl 自己的索引跟即時網頁整合成同一個介面，讓 AI Agent 用同一種方式找到來源、看懂來源提供什麼、再把資料抓回來。目前已建好三個索引：Research Index（數千萬篇科學論文摘要）、Developer Index（橫跨 7000 萬個程式碼庫的文件、README、issue 與已合併的 PR）、Government Index（法規、條例、法院紀錄、SEC 申報文件）。公司已經跟 Wikimedia Enterprise 等資料供應商簽約付費取得直接存取權，這輪募資有一部分資金會用來把這套「付錢買資料、再轉賣給 AI Agent」的模式擴大到更多內容創作者與機構，並開放自助上架系統。

目前 Firecrawl 服務超過 150 萬名開發者與 15 萬家企業，客戶包括 Shopify、Apple、Lovable、Canva；巴西市場尤其成長迅猛，2026 年第一季在當地成長 141%，五個月內付費客戶數已翻倍超過 2025 全年總和，年化成長率約 290%。

## 這筆融資的信號

### 對 Agent 生態的意義

Alexandria 想解決的問題,是 AI Agent 做研究時常遇到的窘境：光靠搜尋和抓取,永遠會漏掉一些「藏在特定資料供應商、特定索引裡」的關鍵資訊,而模型再強,也沒辦法對它從未找到的資訊做出正確推理。Firecrawl 把這一層獨立出來變成基礎設施,等於是把「AI Agent 該去哪裡找資料」這個問題,從每個團隊各自摸索,變成一個可以直接呼叫的共用服務——這輪錢會用在擴大索引覆蓋範圍與付費資料供應商的規模。

### 投資人在賭什麼

這輪 Series B 距離 Series A 只隔了一年，且金額是上一輪的近 4 倍，Dealroom 形容這個規模「落在美國企業軟體 Series B 史上前 5%」。投資人賭的邏輯很直接：當模型能力越來越強，真正的瓶頸會轉移到「AI Agent 能不能找到、能不能讀懂正確的資料來源」，而 Firecrawl 已經有 150 萬開發者的既有使用基礎，等於是用現成的分發管道去賣一個新的資料層產品，比從零開始做知識平台風險小得多。

### 值得觀察的數字

- 內部測試顯示,使用 Alexandria 的 AI Agent 在 845 個任務、盲測 AI 裁判評分下,答案品質比只用內建網頁工具高出 21%——這是目前少數量化 Agent「資料層」而非「模型層」價值的公開數字
- 巴西市場單季成長 141%,付費客戶數五個月內就超過 2025 全年總和,顯示成長動能明顯來自美國以外市場，跟多數同類新創主打北美企業客戶的路線不同
- 距上一輪 Series A（$20.7M）僅一年，本輪金額（$75M）是前一輪的近 3.6 倍——融資節奏與規模同步加速，而非單純金額創新高

## Watchlist 狀態

Firecrawl 已在 watchlist section C1（搜尋 API / Answer Engine），原追蹤重點為「網頁抓取、結構化搜尋 API」。建議更新追蹤重點為：Alexandria 付費知識平台（Research／Developer／Government 三索引）能否從單純的網頁抓取工具，轉型成 AI Agent 的知識供應鏈基礎設施。

## 今日收穫

過去把 Firecrawl 歸類成「網頁抓取工具」，但 Alexandria 讓我重新理解這輪錢的意義：它想做的不是把抓取做得更快更準，而是把「幫某個資訊擁有者把知識變現、再轉賣給 AI Agent」變成一門生意——這代表隨著越來越多 Agent 需要可靠的資料來源，資料供應鏈本身正在從「免費爬取的副產品」變成一個有獨立商業模式、值得單獨募資的基礎設施層。

## 參考資料

- [Introducing Alexandria and our $75M Series B](https://www.firecrawl.dev/blog/introducing-alexandria-series-b)
- [Firecrawl raises $75M Series B to build a knowledge library for AI agents](https://dealroom.co/news/155341-firecrawl-raises-75m-series-b-to-build-a-knowledge-library-for-ai-agents/)
- [Firecrawl Raises $75M Series B, Launches Alexandria AI Agent Data Platform](https://phemex.com/news/article/firecrawl-raises-75m-series-b-launches-alexandria-data-platform-for-ai-agents-97562)
