---
title: "框架更新｜Pydantic AI v2.59.0"
date: 2026-10-22
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI v2.59.0 修補 web_fetch 工具的高風險 DoS 漏洞，同時推出 DaytonaSandbox 與 ElevenLabsRealtimeModel，並把 provider 錯誤統一成跨廠商的錯誤分類"
tldr: "Pydantic AI v2.59.0 三個重點：(1) 修補高風險安全漏洞 GHSA-4whf-38hw-pxxh——`web_fetch` 工具抓到惡意建構的 HTML 時，轉換過程可能拖住同進程裡的其他工作；(2) 新增 `DaytonaSandbox`，讓 Coder／Shell／FileSystem 等 harness 能力整組跑在 Daytona 沙箱裡；(3) 把跨 provider 的模型錯誤統一成 `ModelRateLimitError`／`ModelContextWindowExceededError` 等共用分類，方便寫出不綁死單一廠商的重試邏輯。"
series:
  name: "AI Framework Changelog"
  order: 48
---

> 🌏 [English version](/posts/daily/2026-10-22-framework-pydantic-ai-v2.59.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.59.0 |
| 前一版 | v2.58.0 |
| 發布日 | 2026-10-21 |
| Release Notes | [v2.59.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.59.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20.8k |

## 這個版本為什麼重要

這版最急的是安全修補：`web_fetch` 工具只要抓到一個刻意塞進大量元素的惡意 HTML 頁面，HTML 轉換過程就可能拖住同一個 process 裡的其他工作——對任何讓 agent 自己抓網頁的系統來說，這是一條實打實的 DoS 路徑，升級是必要的。功能面則延續這幾版「harness engineering」的主軸：`DaytonaSandbox` 把 Coder、Shell、FileSystem 這些執行能力整組搬進雲端沙箱，`ElevenLabsRealtimeModel` 補上語音 agent 的另一個後端選擇。另外這版把分散在各 provider 的錯誤訊息收斂成幾個共用類別，寫重試邏輯終於不用為每家 provider 各寫一套判斷。

## 重要變更

- **修補 `web_fetch` 高風險 DoS（GHSA-4whf-38hw-pxxh）**：攻擊者控制的 HTML 若包含大量元素，轉換流程會拖住同進程其他任務 → 任何讓 agent 自主抓取不受信任網頁的系統都該立即升級，`v1.107.9` 分支也同步修了
- **`DaytonaSandbox`**：新增一種 workspace，把 `Coder`、`Shell`、`FileSystem` 等 harness 能力整組跑在 Daytona 沙箱裡 → 多一個不用自己管機器的執行環境選項
- **`ElevenLabsRealtimeModel`**：新增 Eleven Realtime 語音對語音模型的 backend → realtime voice agent 的 provider 選擇又多一個
- **跨 provider 的模型錯誤分類**：新增 `ModelRateLimitError`、`ModelUnavailableError`、`ModelServerError`、`ModelContextWindowExceededError` 與 `ModelHTTPError.for_category` → 重試邏輯可以寫成「遇到 rate limit 就怎麼做」，不用再為每個 provider 各寫一套字串比對
- **`BackgroundTools` 結果加上 `<tool_result>` 標籤**：背景工具的回傳現在會被框成有標籤的 tool output，而不是未加標籤的使用者文字 → 降低工具輸出被誤判成使用者指令的風險
- **`SummarizingCompaction` 逃脫處理**：壓縮摘要裡的逐字稿會被跳脫，避免工具輸出偽造訊息 → 和 `TrajectoryJudge` 的 `<judge_feedback>` 加 `ref` 綁定同一批，都是在堵「工具回傳內容偽裝成系統/使用者訊息」這條路

## Breaking Changes

本版無 breaking changes，但多項是行為調整（見下方相容性備註）：

- `TemporalDurability` 新增 `non_retryable_model_errors`，可指定哪些模型錯誤分類不讓 Temporal 自動重試
- `FunctionToolset.instructions` 與 instruction 函式可選擇 `on_change='append'`，預設行為不變，需要主動選用
- 影響範圍：用到 Temporal durability 或動態 instruction 前綴的團隊需檢視新選項是否要開啟

## 遷移指南

直接升級即可，無需修改程式碼；若目前有自建的 web 抓取 agent，升級後優先驗證 `web_fetch` 工具的安全修補生效。

```bash
pip install --upgrade pydantic-ai==2.59.0
```

## 與其他框架的對比觀察

Pydantic AI 這幾版持續往「agent harness」方向堆功能——沙箱執行、語音 realtime、跨 provider 錯誤分類——跟 Agno 同天發的 `v3.1.8`（沙箱 checkpoint 存儲、routine executor）方向高度重疊，兩個框架都在把「怎麼安全地跑 agent 的程式碼執行環境」當作這個月的重點戰場。

## 今日收穫

之前以為「跨 provider 錯誤統一」只是把例外訊息換個名字，看到 `non_retryable_model_errors` 可以直接接進 Temporal 的重試機制才意識到：統一錯誤分類不只是好讀，而是讓重試策略能寫成一段可重用的設定，不用在每個 provider adapter 裡各寫一套判斷邏輯。

## 參考資料

- [Pydantic AI v2.59.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.59.0)
- [GHSA-4whf-38hw-pxxh：web_fetch HTML 轉換 DoS 安全公告](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-4whf-38hw-pxxh)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
