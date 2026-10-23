---
title: "框架更新｜CrewAI 1.15.29"
date: 2026-10-24
category: daily
type: digest
tags: [ai-agent, framework, daily, crewai]
lang: zh-TW
description: "CrewAI 1.15.29 把核心執行引擎 AgentExecutor 升級為穩定 API，並加入 Azure DocumentDB 向量整合與多項 eval 強化功能"
tldr: "CrewAI 1.15.29 三個重點：(1) `AgentExecutor` 正式脫離 experimental 標籤，成為穩定 API；(2) 新增 Azure DocumentDB 向量搜尋整合，以及 crewAI eval 的匯出評測、單指令跑整個 crew 拿 verdict 等強化；(3) CLI 補齊平台應用搜尋、登入時選組織等維運功能。本版無 breaking changes，直接升級即可。"
series:
  name: "AI Framework Changelog"
  order: 51
---

> 🌏 [English version](/posts/daily/2026-10-24-framework-crewai-1.15.29-en)


## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | CrewAI |
| 版本 | v1.15.29 |
| 前一版 | v1.15.28 |
| 發布日 | 2026-10-23 |
| Release Notes | [GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.29) |
| GitHub | [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) |
| Stars | 59,888 |

## 這個版本為什麼重要

[前一篇（1.15.22）](/posts/daily/2026-09-18-framework-crewai-1.15.22)講的是 `llm_overlay` 這種面向使用者的新功能；1.15.29 中間跳過的 1.15.23–1.15.28 大多是 bug fix，這次則是把一個更底層的訊號亮出來：`AgentExecutor` 正式脫離 experimental 標籤，成為穩定 API。這是 crewAI 任務執行迴圈的核心，過去掛著實驗性標籤意味著介面隨時可能大改；現在轉正，代表生產環境依賴它不用再擔心下個版本被重新設計。同一版也補了 Azure DocumentDB 向量搜尋整合，讓用 Azure 生態的團隊不用外接第三方向量資料庫做記憶或 RAG；另外 `crewai eval` 新增匯出評測結果、單指令直接跑整個 crew 拿 verdict 的能力，把評測流程從「自己寫腳本串起來」變成內建指令。

## 重要變更

- **`AgentExecutor` 晉升穩定 API**：crewAI 的核心任務執行迴圈不再帶實驗性標籤 → 生產環境可以放心依賴它的介面，不用擔心未來版本相容性大改
- **LiteLLM-compatible kwargs 支援**：模型呼叫參數可以直接用 LiteLLM 相容格式傳遞 → 減少為不同模型供應商額外包一層參數轉換的工作
- **Azure DocumentDB 向量搜尋整合**：新增原生向量儲存後端 → 用 Azure 生態的團隊不用再外接第三方向量資料庫做記憶或 RAG
- **`crewai eval` 三項強化**：保留評測的完整資料在專案中、單一指令直接跑整個 crew 取得 verdict、評測結果可匯出成檔案 → 評測流程從「自己寫腳本串」變成內建指令
- **CLI 補齊平台整合維運功能**：新增平台應用搜尋、action picker 搜尋、登入時選擇組織 → 管理多個 CrewAI Platform 整合時少掉大量手動翻找設定的步驟
- **離線 job 路由與 guardrail 評測 runner**：不連線 CrewAI Platform 也能跑 guardrail 評測 → 本機開發或 CI 環境可以直接驗證 guardrail 邏輯
- **`call:` tool 直接執行整合應用的動作** → 不用先包一層 wrapper tool 才能呼叫平台整合
- **新增 read-only notebook 文字 loader 與標準函式庫 jsonl loader** → 多了兩種免外部依賴的資料載入方式

## Breaking Changes

本版本無 breaking changes。

## 遷移指南

直接升級即可，無需修改程式碼：

```bash
pip install --upgrade crewai==1.15.29
```

## 與其他框架的對比觀察

crewAI 把 `AgentExecutor` 從 experimental 轉正，代表它的角色導向多代理執行迴圈已經進入可依賴的穩定期；相較於 LangGraph 持續在 graph 層級打磨 node／edge API 的細節，crewAI 這次的訊號是「核心引擎已經夠成熟，接下來的重點轉向維運面（eval、平台整合、向量後端）」。對已經在生產環境用 crewAI 的團隊來說，這是另一個可以放心升級、不用擔心底層執行邏輯被重寫的訊號。

## 今日收穫

之前以為一個框架的「新功能」都該出現在面向使用者的 API 層；看到這次升級的重點其實是拿掉底層執行引擎的 experimental 標籤才意識到，框架穩定性的訊號有時藏在不起眼的 changelog 條目裡，而不是顯眼的新功能公告——「這個東西終於敢說自己穩定了」本身就是值得記一筆的資訊。

## 參考資料

- [CrewAI 1.15.29 — GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.29)
- [crewAIInc/crewAI — GitHub](https://github.com/crewAIInc/crewAI)
- [CrewAI 1.15.22 — 上一篇框架更新](/posts/daily/2026-09-18-framework-crewai-1.15.22)
- [Full Changelog: 1.15.28...1.15.29](https://github.com/crewAIInc/crewAI/compare/1.15.28...1.15.29)
