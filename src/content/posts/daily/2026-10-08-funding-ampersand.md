---
title: "融資速報｜Ampersand Series A $15M，讓 AI Agent 真的「寫得進」企業系統"
date: 2026-10-08
category: daily
type: digest
tags: [ai-agent, funding, daily, ampersand, agent-integration]
lang: zh-TW
description: "企業整合新創 Ampersand 完成 Bessemer Venture Partners 領投的 $15M Series A，主打讓 AI Agent 能安全地對 Salesforce、SAP、NetSuite 等企業系統做讀寫操作，補上 Agent 從 demo 走進生產環境的最後一哩整合層"
tldr: "Ampersand 完成 $15M Series A，由 Bessemer Venture Partners 領投，累計募資達 $19.7M。這輪錢代表的信號：AI Agent 能不能真正落地，不是看模型夠不夠聰明，而是看它能不能安全地在企業既有系統裡「寫得進去」——整合層正在變成獨立的基礎設施賽道。"
series:
  name: "AI Agent Funding"
  order: 74
---

> 🌏 [English version](/en/posts/daily/2026-10-08-funding-ampersand-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Ampersand（美國，舊金山） |
| 輪次 | Series A |
| 金額 | $15M |
| 領投 | Bessemer Venture Partners |
| 跟投 | Matrix、Flex Capital、Yelp、Tenacity Capital、CTO Fund、Mana Ventures 及多位天使投資人 |
| 估值 | 未揭露 |
| 累計融資 | $19.7M（2023 年 $4.7M Seed by Matrix Partners + 本輪 $15M） |
| 成立年份 | 2022 |
| 員工數 | 未精確揭露 |

## 這家公司做什麼

Ampersand 是做「AI Agent 與企業系統整合基礎設施」的公司——讓 AI-native 軟體能安全地讀寫客戶的 CRM、ERP 等正式系統記錄（systems of record）。

核心產品讓開發者用「read、write、subscribe、search、proxy」五種原語，在版本控制的程式碼裡宣告一次整合，之後由 Ampersand 在每個客戶的 runtime 環境裡，自動處理該客戶特有的欄位、物件、權限與流程差異；客戶自己在導入流程裡完成欄位對應，不需要工程師逐個客製接。公司同時發布 beta 版「Andi」——一個協助開發者完成導入工作的 AI 整合 Agent。

目前合作對象以 AI-native SaaS 公司為主，透過與 Salesforce、SAP、NetSuite、Workday 等系統整合，解決 Agent 從 demo 走到生產環境時卡住的「最後一哩」問題——這也是 Bessemer 合夥人 Lauri Moore 加入董事會時特別點出的風險：連上一個系統記錄在 demo 裡看起來很簡單，但要在數百個客戶身上同時維持準確性,才是真正的挑戰。

## 這筆融資的信號

### 對 Agent 生態的意義

Agent 能不能用，愈來愈不是模型推理能力的問題，而是它能不能安全地「寫入」企業既有系統——這輪募資代表整合層正在從「工具鏈裡的一個小模組」獨立成一個基礎設施賽道，和過去 Unified API（如 Merge、Paragon）解決的問題相似，但 Ampersand 把重點放在 Agent 需要的雙向寫入權限，而不只是讀取。

### 投資人在賭什麼

Bessemer 合夥人 Lauri Moore 曾自己做過語音 AI 創業，深知「外部化模型看起來夠用、實際上不夠用」的落差；她這次下注的邏輯是：Agent 讓整合問題變得更急迫，因為 Agent 沒辦法像 Solutions Engineer 那樣臨場吸收客戶的客製化設定。新投資人裡出現 Yelp 這類企業型天使投資人，也顯示買家本身對「Agent 讀寫權限」這個問題有切身痛點。

### 值得觀察的數字

- 從 2023 年 $4.7M Seed（Matrix Partners 領投）到本輪 $15M Series A，募資規模 3.2 倍放大，顯示公司從「幫 SaaS 做使用者端整合」轉向「幫 AI Agent 做企業系統讀寫」後，市場需求明顯升溫
- 新增投資人包含 Yelp 這類非典型 VC 的企業戰略投資人，代表買方自己也在評估要不要用類似架構自建 Agent 整合層
- 公司從「唯一 API」式定位（2023 年敘事）轉向「Agent 整合基礎設施」（2026 年敘事），兩年內敘事轉型但技術架構（五個原語）延續，是觀察 AI 浪潮如何重新包裝既有基礎設施公司的典型案例

## Watchlist 狀態

Ampersand 尚未在 watchlist 中。建議加入 section D11（Workflow 自動化），追蹤重點：Agent 讀寫企業系統記錄的整合層，能否在 Agent 數量快速增加時維持跨客戶的準確性與毛利率。

## 今日收穫

多數 Agent 基礎設施的敘事聚焦在「讓 Agent 更聰明」，但 Ampersand 這輪募資提醒了一個更底層的限制：Agent 再聰明，寫不進企業系統記錄就等於沒有行動能力。「整合」這個聽起來老派、不性感的問題，反而可能是 Agent 落地最後也最難繞過的一道牆。

## 參考資料

- [Ampersand closes generation gap between agents and the enterprise software stack, backed by $15 million from Bessemer Venture Partners](https://www.prnewswire.com/news-releases/ampersand-closes-generation-gap-between-agents-and-the-enterprise-software-stack-backed-by-15-million-from-bessemer-venture-partners-302900006.html)
- [Ampersand Raises $15 Million Series A To Expand Integration Enterprise Infrastructure Connecting AI Agents](https://pulse2.com/ampersand-raises-15-million-series-a-to-expand-integration-enterprise-infrastructure-connecting-ai-agents)
- [Meet the founders of Ampersand: Ayan Barua and Lauren Long](https://www.bvp.com/news/meet-the-founders-of-ampersand-ayan-barua-and-lauren-long)
