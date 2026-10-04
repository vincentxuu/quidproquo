---
title: "融資速報｜GMI Cloud 拿下 $668M，Nvidia 加碼的 GPU 雲要兩岸同時跑"
date: 2026-10-05
category: daily
type: digest
tags: [ai-agent, funding, daily, gmi-cloud, ai-infra]
lang: zh-TW
description: "AI 原生雲端服務商 GMI Cloud 完成 $223M Series B 股權加 $445M 信貸額度、合計 $668M 新資金，由新創投資公司 ARCHIV 領投、Nvidia 跟投，用來同時擴充美國與台灣、東南亞的 GPU 產能"
tldr: "GMI Cloud 完成 $223M Series B（搭配 $445M 信貸額度，合計 $668M），由 ARCHIV 領投、Nvidia 跟投。這輪錢代表的趨勢是：當 Agent 與推理負載量同時衝高，GPU 雲端供應商的競爭力正從「誰的晶片多」轉向「誰能同時在美國與亞太兩側準時交貨」。"
series:
  name: "AI Agent Funding"
  order: 67
---

> 🌏 [English version](/en/posts/daily/2026-10-05-funding-gmi-cloud-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | GMI Cloud（美國加州 Mountain View） |
| 輪次 | Series B（另搭配獨立信貸額度） |
| 金額 | $223M 股權（Series B）＋ $445M 信貸額度，合計 $668M |
| 領投 | ARCHIV（新創立、專注 AI 與機器人的投資公司） |
| 跟投 | NVIDIA、DSC Investment、趨勢科技（Trend Micro）、KB Investment、Kyobo Life、KT Corporation 等亞太投資人；信貸額度由台灣中國信託商業銀行（CTBC）主辦 |
| 估值 | 未揭露 |
| 累計融資 | 未揭露總額（本輪單筆已達 $668M） |
| 成立年份 | 2021 |
| 員工數 | 未揭露 |

## 這家公司做什麼

GMI Cloud 是做「AI 原生雲端」的公司——提供高效能 GPU 基礎設施與推理（inference）服務，讓需要大量運算的 AI 團隊可以直接租用算力，而不用自己建置資料中心。

核心產品是一套橫跨美國與亞太的雲端平台，提供包括 Nvidia H100、H200 到新一代 Vera Rubin GPU 的隨需存取，同時把裸機叢集管理、推理最佳化等服務疊在基礎算力之上。公司定位自己是少數「同時服務美國與亞太兩端需求」的 GPU 雲：美國 AI 公司與超大規模業者需要在美國與亞太都有產能，亞太企業則要求資料與運算留在當地以符合法規，而大多數同業只蓋了其中一側。GMI Cloud 靠的是在台灣（全球多數 AI 伺服器的製造地）的深厚供應鏈關係，取得比同業更可預期的交貨排程；公司已在台灣啟動「Taiwan AI Factory」，並在日本推動主權 AI 計畫。

目前合約年化營收（contracted ARR）已突破 $600M，比 2025 年底成長超過 9 倍；生產環境中實際落地的 ARR 也成長超過 4.5 倍。推理平台每週處理約 4 兆個 token。客戶包含 Fireworks、Higgsfield、Nous Research、OpenRouter、Reflection、Cartesia、趨勢科技與 Utopai Studios。

## 這筆融資的信號

### 對 Agent 生態的意義

這輪錢最值得注意的不是金額,而是用途分配——同時擴產能、擴推理服務、擴招募,代表公司判斷未來的瓶頸不是單一環節,而是整條「算力→推理→交付」鏈路都要同步加厚。隨著 Agent 應用把原本一次性的聊天請求換成多輪、長時間執行的任務,推理負載的形態本身也在改變,GPU 雲端供應商要應付的不再只是尖峰流量,而是持續在線的背景運算。

### 投資人在賭什麼

領投的 ARCHIV 是一家新成立、專注 AI 與機器人領域的投資公司，而 Nvidia 本身也親自參與這輪投資——晶片供應商直接入股下游的雲端轉售／服務商，是一種確保自家最新晶片（GB200、GB300 NVL72）有穩定出貨去處的策略性卡位，而不只是財務投資。亞太多家策略型投資人（KT、Kyobo、趨勢科技等）的參與，也顯示這輪錢同時在幫 GMI Cloud 的客戶與供應鏈關係背書。

### 值得觀察的數字

- 合約 ARR 年成長超過 9 倍、實際落地 ARR 成長超過 4.5 倍，兩者之間的落差本身就是一個該追蹤的訊號——合約轉換成實際用量的速度是否跟得上銷售速度
- $223M 股權對 $445M 信貸的比例顯示公司有意識地用債務而非股權稀釋來融資硬體擴張，這是 GPU 雲端這類資本密集生意逐漸成熟後常見的財務策略
- 每週處理約 4 兆 token 的推理量，是少數把「用量規模」而非「募資金額」當作主要對外溝通指標的 AI 基礎設施新創

## Watchlist 狀態

GMI Cloud 尚未在 watchlist 中。建議加入 section A3（推理基礎設施），與 CoreWeave、Lambda Labs、Nebius、RunPod 並列追蹤，追蹤重點：「美國＋亞太雙邊營運」的定位能否轉換成對 CoreWeave 等以美國為主的同業的實際價格或交期優勢。

## 今日收穫

GPU 雲端這個賽道過去的敘事幾乎都繞著「誰先拿到最新晶片」打，但 GMI Cloud 這輪融資把差異化講成了供應鏈地理位置——在台灣有深厚供應鏈關係，就能在美國與亞太都做到「交貨日期是一個承諾，不是一個猜測」。當算力本身越來越難單靠資本取得優勢時，交期的確定性反而變成了一個可以被投資人估值的護城河。

## 參考資料

- [GMI Cloud Raises Over $660 Million to Accelerate Global AI Infrastructure Expansion](https://www.prnewswire.com/apac/news-releases/gmi-cloud-raises-over-660-million-to-accelerate-global-ai-infrastructure-expansion-302894628.html)
- [On-demand GPU infrastructure startup GMI Cloud raises $263M to fuel global expansion](https://siliconangle.com/2026/09/30/on-demand-gpu-infrastructure-startup-gmi-cloud-raises-263m-to-fuel-global-expansion)
- [GMI Cloud Raises $668 Million To Expand Global AI Infrastructure](https://pulse2.com/gmi-cloud-raises-668-million-to-expand-global-ai-infrastructure)
