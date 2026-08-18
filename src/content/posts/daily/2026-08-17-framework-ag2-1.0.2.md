---
title: "框架更新｜AG2 v1.0.2"
date: 2026-08-17
category: daily
tags: [ai-agent, framework, daily, ag2]
lang: zh-TW
description: "AG2 v1.0.2 讓 Agent 能雙向暴露成 ACP 服務、A2A agent card 改為簽章驗證，並補上 gRPC TLS 傳輸層，是一次補強跨 Agent 互通安全性的版本"
tldr: "AG2 v1.0.2 三個重點：(1) AG2 Agent 可雙向暴露為 ACP agent，支援 HTTP/WebSocket 讓遠端 client 直接驅動；(2) A2A agent card 從明文改為簽章與驗證，並加上 gRPC TLS 傳輸層；(3) LiveAgent 新增 ElevenLabs 語音供應商，社群擴充套件（Tenki sandbox、TealTiger governance middleware）首次上架。無 breaking changes。"
series:
  name: "AI Framework Changelog"
  order: 2
---

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | AG2（前身 AutoGen 社群 fork） |
| 版本 | v1.0.2 |
| 前一版 | v1.0.1 |
| 發布日 | 2026-08-16 |
| Release Notes | [GitHub Release](https://github.com/ag2ai/ag2/releases/tag/v1.0.2) |
| GitHub | [ag2ai/ag2](https://github.com/ag2ai/ag2) |
| Stars | 4.9k |

## 這個版本為什麼重要

AG2 這次的主軸不是新功能堆疊，而是把「多個 Agent 系統互相呼叫」這件事從「能跑」補強到「能安全跑」。上一版（v1.0.1）才剛因應 MCP v2.0 的 breaking changes 把 mcp 依賴鎖在 `<2`，這一版接著把 A2A（Agent-to-Agent）通訊的兩個安全缺口補上：agent card 從明文改成簽章與驗證，傳輸層加上 gRPC TLS。同時 AG2 agent 現在可以雙向暴露成 ACP（Agent Client Protocol）服務，讓外部 client（例如 IDE 或其他 Agent 框架）直接透過 HTTP/WebSocket 驅動它，而不只是 AG2 去呼叫別人。對照 watchlist 裡標註 AG2 的追蹤重點「A2A 支援」，這正是那條主線的下一步。

## 重要變更

- **雙向 ACP 支援**：AG2 agent 可暴露為 ACP agent，讓遠端 client 透過 HTTP 或 WebSocket 驅動；ACP 協定升級到 0.12，並新增 Kilo Code 支援與 model 選擇 → 以前 AG2 主要是「主動」呼叫外部工具/agent，現在也能被動被其他系統當作服務呼叫
- **A2A agent card 簽章與驗證**：對外提供的 agent card 會被簽章，接收到的 agent card 會被驗證來源 → 防止惡意或偽造的 agent card 被信任
- **A2A gRPC TLS 傳輸**：agent-to-agent 通訊新增 gRPC 的 TLS 傳輸層 → 跨網路呼叫其他 Agent 時可以加密而不必自己包一層 proxy
- **A2A 使用者自訂擴充**：開放使用者自行定義 A2A extension → 可以在標準協定之外掛自訂欄位/行為
- **LiveAgent 新增 ElevenLabs 語音供應商**：即時語音互動多一個供應商選項
- **社群擴充套件首次上架**：Tenki（隔離執行 sandbox）、TealTiger（決定性治理 middleware）
- **開發工具**：Agent 組成關係開放為唯讀 public property，middleware 新增 `describe()` 可內省，工具型別統一收斂到 `ag2.tools.types`

## Breaking Changes

本版本無 breaking changes。

## 遷移指南

直接升級即可，無需修改程式碼：

```bash
pip install --upgrade ag2==1.0.2
```

若要開始使用新功能，額外設定範例：

```python
# 把既有 AG2 agent 暴露成 ACP 服務，讓遠端 client 驅動
from ag2.acp import ACPServer

server = ACPServer(agent=my_agent, transport="websocket")
server.serve()
```

## 與其他框架的對比觀察

A2A 互通安全性是目前多框架都在補的一塊——LangGraph、CrewAI 目前主要靠外部 gateway 處理跨框架 Agent 通訊的驗證，AG2 這次直接把簽章驗證做進框架層。搭配同版加入的雙向 ACP 支援，AG2 現在同時是「A2A 的參與者」也是「ACP 的被驅動方」，在協定互通這條線上比多數同類框架走得更前面。

## 今日收穫

之前看 A2A（Agent-to-Agent）相關更新，容易只注意到「能不能通」，這次才注意到「agent card 從明文到簽章驗證」才是能不能安全上生產環境的關鍵——agent card 本質上是身分憑證，沒有簽章驗證就等於任何人都能偽造一個 agent 冒充身分接入你的多 Agent 系統。

## 參考資料

- [AG2 v1.0.2 — GitHub Release](https://github.com/ag2ai/ag2/releases/tag/v1.0.2)
- [ag2ai/ag2 — GitHub](https://github.com/ag2ai/ag2)
