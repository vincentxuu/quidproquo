---
title: "框架更新｜Pydantic AI v2.61.0"
date: 2026-10-25
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI v2.61.0 把結構化引用（citations）做成可跨 provider replay 的資料格式，並公開 durable 執行引擎的擴充介面，讓第三方能接進去寫自己的 durable backend"
tldr: "Pydantic AI v2.61.0 三個重點：(1) 新增結構化 citations——`TextPart` 可帶引用來源，跨 Bedrock／OpenRouter／xAI 正規化格式，並能在多輪對話中把引用回放給原本產生它的 provider；(2) 公開 durable 執行引擎的擴充介面（operation types、`ParameterTransports`、`DurableRunContext`、run identity hooks），第三方可以接自己的 durable backend 進去；(3) 多項相容性警示：`thinking=False` 現在會送模型能接受的最低 thinking 量，`CohereModel` 工具回傳檔案時不再靜默丟棄而是直接報錯。"
series:
  name: "AI Framework Changelog"
  order: 53
---

> 🌏 [English version](/posts/daily/2026-10-25-framework-pydantic-ai-v2.61.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.61.0 |
| 前一版 | v2.60.0 |
| 發布日 | 2026-10-23 |
| Release Notes | [v2.61.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.61.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20.8k |

## 這個版本為什麼重要

這版把「引用來源」從裝飾性的輸出文字，變成可以在系統內部流動的結構化資料：`TextPart` 現在能帶 citations，而且這些 citations 會先被正規化成跨 provider 一致的格式，再原封不動回放給產生它們的那個 provider——對任何需要在多輪對話裡保留「這段話引用了哪個來源」的 RAG／搜尋型 agent 來說，這解決的是格式相容問題，不是 UI 呈現問題。另一個重點是把 durable 執行引擎的內部介面公開出來：operation types、`ParameterTransports`、`DurableRunContext` 和 run identity hooks 現在都是公開 API，等於官方承認「有人要自己接 durable backend」這個需求，不再把它鎖在框架內部。

## 重要變更

- **結構化 citations**：`TextPart` 新增 citations 支援，並正規化 Bedrock、OpenRouter、xAI 回傳的引用格式，多輪對話時會把 citations 回放給原本產生它的 provider，Vercel AI adapter 也會保留 citations → 建 RAG／搜尋 agent 時，引用來源不再需要自己手刻格式轉換
- **Durable 引擎擴充介面公開**：operation types、`ParameterTransports`、`DurableRunContext`、run identity hooks 全部轉為公開 API → 第三方可以接自己的 durable execution backend，不必依賴官方目前支援的那幾個
- **新模型名稱**：新增 `kimi-k3.1-pro` 與 `kimi-k3.1-pro-highspeed`
- **Azure Realtime 補強**：`RealtimeClientSecret.webrtc_url` 在 Azure OpenAI 上會帶 `webrtcfilter=on`；新增 `RealtimeModelProfile.supports_audio_output`，讓 Gemini 的機器人語音串流這類純文字 realtime 模型預設改回文字輸出，不會誤判成要輸出語音
- **MCP 認證可用 async 函式**：hosted MCP capabilities 的 `auth` 現在接受 async function

## Breaking Changes

本版無 API 層的 breaking changes，但有多項行為調整（相容性警示）：

- `thinking=False` 時，框架會送出該模型能接受的最低 thinking 量，而不是完全關閉——用在「模型本身不能關 thinking」的狀況
- 範圍更廣的 provider-specific thinking 設定會覆蓋 `thinking` 參數時，現在會發出警告
- `CohereModel` 的工具回傳內容若包含檔案，過去會靜默丟棄，現在改成直接拋出 `NotImplementedError`
- `GoogleRealtimeModel` 的 `google_multi_speaker` 進入 deprecated（目前沒有 Gemini Live 模型支援它）
- 影響範圍：用 `CohereModel` 且工具會回傳檔案的專案升級後要補上例外處理；依賴 provider-specific thinking 設定覆蓋全域 `thinking` 的專案，行為不變但會看到新的警告訊息

## 遷移指南

```bash
pip install --upgrade pydantic-ai==2.61.0
```

直接升級即可，無需大幅改動程式碼；若你的工具曾經回傳檔案給 `CohereModel` 且過去沒處理過它被丟棄的情況，升級後要加上對應的錯誤處理。

## 與其他框架的對比觀察

這週框架圈不約而同在補「可觀測、可延伸」這塊：pydantic-ai 把 durable 引擎的內部介面公開給第三方接；crewAI 在 1.15.29（2026-10-23）把 `AgentExecutor` 推出 experimental 狀態、加上 trace 匯出與 offline 評估 runner。兩家做的事不同，但方向一致——框架不再只負責「跑起來」，還要讓使用者能看懂、能接管執行過程中發生的事。

## 今日收穫

之前以為 citations（引用來源）只是加在輸出文字裡的附加資訊，看到 pydantic-ai 把它做成「正規化格式、還能回放給原本產生它的 provider」的結構化資料才意識到：多輪對話裡引用來源真正難的不是顯示，而是要讓下一輪對話送回 provider 時，provider 還認得這是它自己產生的引用——這是格式相容問題，不是 UI 問題。

## 參考資料

- [Pydantic AI v2.61.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.61.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.60.0...v2.61.0](https://github.com/pydantic/pydantic-ai/compare/v2.60.0...v2.61.0)
