---
title: "台股研究 Agent 實戰系列（篇 1）：為什麼台股需要自己的研究 Agent"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, langgraph, ai-agent, taiwan-stock, backtest, llm]
lang: zh-TW
tldr: "美股 LLM agent 已經捲到近十萬星，台股在 GitHub 上卻連一個破 10 星的都沒有；我把三個 side project 收斂成一個「每個結論都要先過回測」的台股研究 agent，這篇講為什麼。"
description: "為什麼我要做一個台股專用的 LLM 研究 agent：從 TradingAgents 的缺口、三個 side project 的匯流，到「回測問責」這個核心命題。"
draft: false
glossary:
  - term: "point-in-time"
    definition: "只用訊號當下拿得到的資料做決策與驗證，禁用未來資料（PIT）。"
  - term: "回測問責"
    definition: "LLM 的每個結論必須先通過同一組訊號的歷史回測，期望值為負時禁止給出樂觀結論。"
  - term: "golden eval"
    definition: "用固定歷史切點標注正確答案、用來衡量 agent 輸出品質的基準測試集。"
---

> **台股研究 Agent 實戰系列（篇 1 / 9）**：本篇為系列開端 ｜ [下一篇：LangGraph 並行架構——五個分析師同時開工](/posts/tech/2026-08-23-stock-agent-2-langgraph-parallel-architecture) ｜ 完整目錄就在本篇下方

這是一個我自己在寫、還在演進中的開源專案 [stock-research-agent](https://github.com/vincentxuu/stock-research-agent)：一個用 LangGraph 編排的台股多分析師研究系統，核心規矩只有一條——LLM 的每個結論，都要先通過「同一組訊號的歷史回測」才能進報告。這篇是系列第一篇，講為什麼是台股、為什麼是我、以及這條規矩從哪來。讀完你會拿到：一份截至 2026-08-22 的 GitHub 對照調查結論、三個 side project 怎麼收斂成一個 agent、以及目前誠實到有點難看的 baseline 數字。

## 美股的坑已經擠滿人，台股是空的

先看數字（2026-08-22 GitHub API 快照，完整對照分析在 repo 的 `docs/similar-projects.md`）：

- **TradingAgents**（TauricResearch）：99,207 星，LangGraph 多分析師 + Bull/Bear 辯論，是這個領域的事實標準。
- **ai-hedge-fund**（virattt）：62,986 星，persona agent + mandate 設定檔。
- **Vibe-Trading**（HKUDS）：31,432 星，回測驗證做得最重的工具箱。
- 中國市場的在地化 fork 已被驗證有市場：TradingAgents-CN 31,305 星、TradingAgents-astock 3,051 星——astock 甚至為 A 股加了政策分析師、游資追蹤師、解禁監控師三個特化角色，因為那對應 A 股的定價結構。

然後我搜「台股 + agent / LLM」：**全 GitHub 沒有任何一個超過 10 星的台股 LLM agent 專案**。最高的是 CasualTrader（9 星，即時模擬交易平台），再來是 2 星、0 星的幾個嘗試。台灣開發者 jason8745 的 llm-stock-team-analyzer 和 llm-agent-trader 把分析跟回測拆在兩個 repo——沒有人把「multi-agent 研究 → 回測驗證」做成同一條閉環。

這個空位不是偶然。台股的深度在通用框架給不了的地方：三大法人買賣超、融資融券、處置股／注意股制度、10% 漲跌幅與現股當沖規則、月營收公告節奏。Yahoo Finance 的 `.TW` suffix 只能給你 K 線，給不了籌碼。A 股 fork 證明了「把通用框架深度適配到一個本地市場」本身就是高價值貢獻——台股只是還沒人做。

## 三個 side project 的匯流

這個專案不是從零開始，是把我手上三個爛尾的 side project 收斂成 agent 的工具層：

```text
swing-screener（台股多因子技術評分）──▶ tools/indicators.py
threads-scraper（Threads 輿情抓取）──▶ tools/sentiment.py
pool / Signal Lottery（自寫回測引擎）──▶ tools/backtest.py
```

每個 tool 單獨存在時都只是玩具：screener 會打分但不會解释為什麼是今天、scraper 會抓輿情但不知道跟股價的關係、回測引擎會跑但沒有觀點可以驗。LLM agent 是把這些工具串成「研究」這件事的膠水——supervisor 平行派遣技術面、輿情、籌碼、事件分析師，每個分析師背後就是這些已經寫好的程式化快照，不為了「多 agent」而多呼叫 LLM。

## 核心命題：沒被歷史驗證過的結論，是意見不是研究

量化面試有一道經典題：「為什麼回測很美、實盤賠錢？」標準答案大概都背得出來——前視偏差、忽略成本、重疊持倉灌水。但 LLM agent 讓這個問題多了一層：LLM 會非常有說服力地生成一個從沒被任何資料驗證過的結論，而且語氣比真研究員還篤定。

所以這個專案的核心命題是：

> **LLM 的每個結論必須先通過同一組訊號的歷史回測；歷史沒驗證過的結論是意見，不是研究。**

具體落地是：技術訊號在 synthesis 之前先被 point-in-time 重放（causal 因子、次日開盤進場、內建台股成本模型：手續費 1.425‰×2 + 賣出證交稅 3‰），**期望值為負時，synthesis 被禁止給出樂觀結論**——不是軟性建議寫在 prompt 裡，是結構上的禁止。對 TradingAgents 的差異點也就在這：它的 README 白紙黑字說「treat the framework as a research scaffold」，repo 裡沒有回測模組，閉環只有下次跑同一檔時抓已實現報酬寫一段反思。它辯論完就輸出；我辯論完還要過回測這一關。

## 目前的誠實狀態

不裝。進度 M0–M4 完成，M5（研究計畫＋人工審查迴圈）與 M7（research-to-paper 執行邊界）進行中。幾個 repo 文件裡如實記載的數字：

- **單次研究實測**（2330、2 年資料）：同款因子訊號回測 12 筆、勝率 67%、單筆期望值 3.14%（含成本）；當日僅觸發 1/3 訊號，結論是 `watch`（信心 0.47）。筆數很少，不能直接外推。
- **Golden eval baseline**（10 個台股歷史切點）：**5/10，一半而已**。這是改進前的誠實基準，不是調參後的績效宣稱；10/10 的靜態 labels 跟 Yahoo 行情重算一致，至少標注本身沒問題。
- **Walk-forward baseline**（2330、5 年）：15 folds、OOS 只有 8 筆、勝率 50%、單筆期望值 **-0.44%**（含成本）。交易數低於 10，run card 會自己標「統計不具代表性」。

資料面的免責也先講：行情取自 Yahoo 事後重拉，**不是 point-in-time vintage snapshot**；整個專案僅供研究與教學，不構成投資建議。這些是對「目前可觀察的原始碼與文件」的記錄，不是任何績效承諾。

## 整體來說

學到的事很簡單：選利基比堆功能重要，而在 LLM agent 這個領域，「可驗證」比「會講話」稀缺。美股框架的作者們把編排、辯論、記憶都做到極致了，但「LLM 說的」跟「市場資料驗的」接在同一條 pipeline 這件事，加上台股在地的籌碼與制度資料，剛好是一個沒人佔、我又剛好有三個現成工具的位置。接下來八篇，一篇一個子系統，把這條閉環拆開講。

## 系列目錄

1. **本篇**：[為什麼台股需要自己的研究 Agent](/posts/tech/2026-08-23-stock-agent-1-why-taiwan)
2. [LangGraph 並行架構：五個分析師同時開工](/posts/tech/2026-08-23-stock-agent-2-langgraph-parallel-architecture)
3. [LLM 分層與降級鏈：API、本地 CLI、詞典三層 fallback](/posts/tech/2026-08-23-stock-agent-3-tiered-llm-fallback)
4. [回測問責：為什麼回測會說謊](/posts/tech/2026-08-23-stock-agent-4-backtest-accountability)
5. [評估方法學：walk-forward、run card 與 50% 的誠實 baseline](/posts/tech/2026-08-23-stock-agent-5-walkforward-eval)
6. [讓 LLM 報告的每個數字都可稽核](/posts/tech/2026-08-23-stock-agent-6-auditable-number-citations)
7. [Copilot loop：計畫合約、可驗證來源與人類審查](/posts/tech/2026-08-23-stock-agent-7-research-plan-review-loop)
8. [研究到模擬單的邊界：content-addressed 執行合約](/posts/tech/2026-08-23-stock-agent-8-execution-contracts)
9. [部署邊界：Docker 到 Cloudflare Containers 的公開 API](/posts/tech/2026-08-23-stock-agent-9-cloudflare-deployment)

---

## 參考資料

- [vincentxuu/stock-research-agent（GitHub repo）](https://github.com/vincentxuu/stock-research-agent)
- [docs/similar-projects.md：同類開源專案對照分析（2026-08-22 快照）](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/similar-projects.md)
- [TauricResearch/TradingAgents（99k 星對照）](https://github.com/TauricResearch/TradingAgents)
- [stock-research-agent 架構文件 docs/architecture.md](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/architecture.md)
