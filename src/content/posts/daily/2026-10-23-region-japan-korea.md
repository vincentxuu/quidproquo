---
title: "區域焦點｜日韓"
date: 2026-10-23
category: daily
tags: [ai-agent, region, daily, japan-korea]
lang: zh-TW
type: deep-dive
description: "BCG《AI Maturity Matrix 2026》把日本與南韓一起列入「AI Pioneer」頂層，南韓官方把加速「全堆疊主權 AI」的理由直接指向中國即將擴大的出口管制；SoftBank 與三星則用 A2A 協定串接跨廠商電信 Agent"
tldr: "BCG 最新《AI Maturity Matrix 2026》顯示，日本與南韓今年雙雙躋身「AI Pioneer」頂層，與加拿大、中國、新加坡、英美並列，報告明確點出「執行力」而非「野心」才是分水嶺；南韓總統府國家 AI 戰略委員會副主席公開把中國擬議的 40 項技術出口管制，列為加速「全堆疊主權 AI」的理由；SoftBank 與三星電子用 Google 發起、Linux Foundation 接手的 A2A 協定（及電信業擴充版 A2A-T）串接雙方各自的電信 Agent，在體育場賽事壅塞情境中完成跨廠商協作示範；中國同週收緊頂尖模型出口管制，讓 Qwen、DeepSeek 等開放授權模型的國際流通前景出現不確定性。"
series:
  name: "AI Region Focus"
  order: 17
---

## 區域：日韓

本週日韓兩地的共同主線不是哪家公司發布了新模型，而是「國家層級的 AI 執行力」第一次被外部報告正式認證，同時南韓官方把這份執行力的緊迫性，直接掛在中國出口管制這個外部壓力上。

## 本週重要動態

### BCG：日本與南韓躋身「AI Pioneer」頂層——執行力才是分水嶺

Boston Consulting Group（BCG）10/20 發布《The AI Maturity Matrix 2026》，評比全球 75 個以上經濟體在 Ambition、Skills、Policy、Investment、Research、Ecosystem 六個維度（ASPIRE 框架）的 AI 準備度。報告指出，自 2024 年首版以來，共有八個經濟體整整晉升一個準備度層級，其中日本與南韓同時晉升到最高層級「AI Pioneers」，與加拿大、中國大陸、新加坡、英國、美國並列。（[BCG 新聞稿](http://www.prnewswire.com/news-releases/execution-not-ambition-now-separates-ai-economies-as-japan-and-south-korea-join-the-pioneers-302913365.html)）

報告對兩國晉升的理由寫得很具體：日本把 AI 友善立法、超大規模雲端業者的投資、與本國龍頭企業的合作綁在一起，同時拿下 Anthropic 在亞太的第一個據點；南韓則押注本土模型開發，在 Stanford HAI《2026 AI Index》的重要 AI 模型數量排名全球前五，並把大規模公共投資導向算力與整個 AI 生態系。BCG 公共部門業務全球負責人 Joerg Hildebrandt 的評語點出了整份報告的核心論點：「今年進步的經濟體證明了，是國家行動把 AI 的野心轉成準備度」——換句話說，光有戰略文件不算數，真正拉開差距的是政府能多快把策略轉成跨部門的協調行動。

### 南韓官方：中國擬議出口管制，讓「全堆疊主權 AI」更急迫

南韓總統府「國家 AI 戰略委員會」副主席河正宇（Ha Jung-woo）10/18 公開表示，中國計畫對包括 AI 在內的 40 項先進技術實施出口禁令或限制，這等於替中美兩國在全球 AI 主導權的競爭加了一把火，也讓南韓更有必要加速「全堆疊主權 AI」（full-stack sovereign AI）戰略——同時強化本土自主能力，也強化與他國的技術合作。（[MLex](https://www.mlex.com/mlex/articles/2539307/china-s-proposed-export-curbs-add-urgency-to-south-korea-s-ai-push-official-says)）

同一週，《紐約時報》報導中國正收緊對頂尖 AI 模型的出口管控，讓原本開放免費授權的中國模型（如 Qwen、DeepSeek 系列）未來能否持續自由流向海外出現不確定性。（[紐約時報](https://www.nytimes.com/2026/10/21/world/asia/china-moves-to-tighten-its-grip-over-exports-of-top-ai-models.html)）把這兩則新聞放在一起看，南韓官方這次把地緣政治風險講得比過去直白：不是「我們也想要主權 AI」，而是「中國的出口政策變化，直接改變了我們自主 vs 依賴的計算」。

### SoftBank × 三星：用 A2A 協定串接跨廠商電信 Agent，解決體育場壅塞情境

SoftBank 10/15 發布與三星電子的聯合研究成果：雙方各自維運獨立的 AI Agent——SoftBank 的 Telco Agent 負責整體網路決策，核心是 SoftBank 自家的電信大型模型（LTM, Large Telecom Model）；三星的 Vendor Agent 則負責該廠設備的最佳化與數位孿生模擬。兩個 Agent 之間用 Google 發起、後交給 Linux Foundation 維護的開放協定 Agent2Agent（A2A），加上電信產業標準組織 TM Forum 正在制定的電信擴充版 A2A-T，交換任務、網路需求（用 TM Forum 的 TMF921 Intent API 表示）與評估結果。（[SoftBank R&D](https://www.softbank.jp/en/corp/technology/research/topics/235/)）

示範情境是體育場大型賽事前的壅塞：SoftBank 的 Telco Agent 先要求把 A 區基地台負載壓在 60% 以下、同時維持至少 50 Mbps 吞吐量；三星的 Vendor Agent 評估後回報「只控制 A 區無法同時滿足兩個條件」，Telco Agent 於是把控制範圍擴大到相鄰的 B 區，Vendor Agent 再做跨基地台最佳化（含波束參數），用數位孿生驗證後回傳可行方案，Telco Agent 核准並連同復原設定一起排程上線。這套示範已在 10/14-15 加州 Mountain View 的 Silicon Valley Future Wireless Summit 2026 公開展示。

這個案例的重點不是「兩個 Agent 合作解決了一個網路問題」，而是三星和 SoftBank 都不需要把各自的優化演算法或模擬環境暴露給對方——只交換任務、條件和結果，這種「保留各自智慧財產權、只開放協作介面」的模式，正是多廠商電信網路導入 Agent 時最現實的需求。

## 深度分析

我認為這週日韓的動態最適合用波特的國家競爭優勢鑽石模型（Porter's Diamond Model）來看，因為 BCG 報告本身就是在用「國家層級的整體競爭力」而不是單一公司的技術突破，去評價日韓這次的晉升。

**要素條件**：南韓押注本土模型開發、擠進 Stanford HAI 全球前五的「重要 AI 模型」產出國，是典型的要素條件優勢——先建立模型研發能力，再談應用。日本走的是不同路徑：靠 Anthropic 設亞太首個據點、拿到超大規模雲端業者投資，把要素條件外部化成「吸引全球領先者進駐」。

**需求條件**：SoftBank 與三星的體育場壅塞示範，本質上是日本電信市場的真實需求（大型賽事期間的網路壅塞是每年都會發生的具體痛點）在推動 Agent 落地——不是為了展示技術而展示，是先有具體場景需求才做示範。

**企業策略與產業結構**：南韓的「全堆疊主權 AI」策略，和日本「綁定國際夥伴＋國家龍頭企業」策略形成有意思的對照——南韓選擇盡量把每一層（晶片、算力、模型、應用）都留在境內可控的範圍，日本則選擇在部分層級（如基礎模型）直接接入國際供應鏈，把資源集中在製造業與機器人這類既有優勢領域的深化應用。

**政府角色**：BCG 報告明確把「政府執行速度」列為今年評比的核心差異化因子，而南韓河正宇的發言，把「中國出口管制」這個外部威脅直接轉成「加速主權 AI」的政策語言——這是鑽石模型裡最少被討論、但這次日韓案例裡最關鍵的一角：政府不只是提供補貼或法規環境，而是主動把地緣政治風險轉譯成國內產業政策的緊迫性敘事。

## 對台灣創業者的啟示

- 如果你在做電信、工業自動化領域的多 Agent 協作：SoftBank × 三星的案例證明「不同廠商的 Agent 不需要共用模型或框架，只要共用通訊協定（A2A/A2A-T）與意圖描述格式（TMF921）」就能協作——台灣團隊若要賣 Agent 給電信或製造業客戶，應該優先確認自己的 Agent 能不能說 A2A 這類開放協定，而不是賭自家框架會變成產業標準
- 如果你的產品依賴中國開放授權模型（Qwen、DeepSeek 等）：中國收緊頂尖模型出口管制的新聞，提醒任何把中國開源模型當成長期免費基礎設施的商業計畫都該有備案——評估模型授權條款未來可能收緊的風險，不要把供應鏈韌性全部賭在單一國家的開放政策不變
- 如果你在規劃日本或南韓市場：BCG 報告點出兩國走的是不同路徑——日本偏好「引進國際夥伴 + 深化製造業應用」，南韓偏好「全堆疊自主」——台灣團隊進這兩個市場的 GTM 策略不能套用同一套打法，對日本可以談「成為你在地生態系的一環」，對南韓則要準備回答「你的技術如何幫助我們降低對外依賴」這類主權敘事下的提問
- 如果你在做政策研究或市場進入評估：南韓官方公開把地緣政治風險（中國出口管制）轉譯成產業政策語言的做法值得參考——台灣自己在半導體供應鏈上也面對類似的地緣政治敘事，觀察南韓怎麼把「風險」包裝成「加速投資的正當性」，對台灣政策溝通也有借鏡價值

## 今日收穫

之前以為「日韓加入 AI Pioneer 層級」這類評比報告大多是公關式的排名遊戲，這週細看 BCG 報告的六維框架後才發現，它其實具體拆解出「日本靠引進、南韓靠自建」兩條完全不同但都有效的路徑——原來「國家層級的 AI 競爭力」不是單一指標的排名賽，而是像企業戰略一樣有「選擇要素條件還是需求條件優先」的路徑分歧。更意外的是南韓官方把中國出口管制直接講成國內政策的加速理由——這讓我意識到，地緣政治風險現在已經不只是分析師事後解讀的背景因素，而是政府自己拿來當政策論述武器的既成事實。

## 參考資料

- [BCG（PR Newswire）— Execution, Not Ambition, Now Separates AI Economies as Japan and South Korea Join the Pioneers](http://www.prnewswire.com/news-releases/execution-not-ambition-now-separates-ai-economies-as-japan-and-south-korea-join-the-pioneers-302913365.html)
- [MLex — China's proposed export curbs add urgency to South Korea's AI push, official says](https://www.mlex.com/mlex/articles/2539307/china-s-proposed-export-curbs-add-urgency-to-south-korea-s-ai-push-official-says)
- [The New York Times — China Tightens Its Grip Over Exports of Top AI Models](https://www.nytimes.com/2026/10/21/world/asia/china-moves-to-tighten-its-grip-over-exports-of-top-ai-models.html)
- [SoftBank R&D — Autonomous Network through AI Agent Collaboration with LTM — Joint Research with Samsung](https://www.softbank.jp/en/corp/technology/research/topics/235/)
