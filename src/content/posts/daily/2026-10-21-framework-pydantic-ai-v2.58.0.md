---
title: "框架更新｜Pydantic AI v2.58.0"
date: 2026-10-21
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI v2.58.0 新增 DelegationTasks.steer 讓委派任務可中途轉向，補上整輪 agent run 的 timeout／deadline，同時修補兩個 MCP／UI adapter 安全漏洞"
tldr: "Pydantic AI v2.58.0 三個重點：(1) 新增 `DelegationTasks.steer`，讓正在跑的委派任務可以即時轉向而不用整個重跑；(2) 加入整輪 agent run 的 `timeout=`／`RunContext.deadline`，以及單次 model request 的 `request_timeout`／`max_retries`；(3) 修補兩個中風險安全漏洞——provider-native MCP 設定可能把 server URL／token 洩漏進 OpenTelemetry trace，以及特定前端設定下工具可能被用戶端指定參數直接執行而不經模型請求。另新增 `openai-chatgpt` provider 與 `ElevenLabsAgentsRealtimeModel`。"
series:
  name: "AI Framework Changelog"
  order: 47
---

> 🌏 [English version](/posts/daily/2026-10-21-framework-pydantic-ai-v2.58.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.58.0 |
| 前一版 | v2.57.0 |
| 發布日 | 2026-10-19 |
| Release Notes | [v2.58.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.58.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20.8k |

## 這個版本為什麼重要

上一版補的是「工具呼叫要不要讓人看」的審批層，這一版處理的是更底層的兩個問題：委派任務跑到一半能不能改方向、整輪 agent run 要怎麼設一個不會被哪個 provider 拖死的逾時。`DelegationTasks.steer` 讓正在執行的子任務可以被即時轉向，不必整個取消重開；`timeout=` 與 `RunContext.deadline` 則把逾時控制從「每次 model request」拉到「整輪 run」。同時這版也修補了兩個中風險安全漏洞，跟 MCP 設定與前端 adapter 有關,用到這兩個功能的團隊要盡快升級。

## 重要變更

- **委派任務可中途轉向（`DelegationTasks.steer`）**：正在執行的 delegated task 可以被即時「轉向」→ 不用等整個 sub-run 跑完或強制取消重開，長流程 agent 中途修正方向的成本大幅下降
- **整輪 Agent Run 的逾時與期限（`timeout=` / `RunContext.deadline`）**：`agent.run()` 現在可以設一個包住整輪（含所有 model request 與工具呼叫）的 timeout，工具內部可讀 `RunContext.deadline` 知道還剩多少時間 → 之前只能在單次 model request 層設逾時，長流程容易卡死；現在可以在最外層就掐斷
- **單次 Model Request 逾時與重試（`ModelSettings` 新欄位）**：新增 `request_timeout`（涵蓋整個 stream 消費）與 `max_retries`（由 provider SDK 執行重試次數）→ 可以針對不同 provider 微調，避免某個慢 provider 拖垮整輪 run
- **用自己的 ChatGPT 訂閱登入（`openai-chatgpt` provider）**：應用程式使用者可以直接用自己的 ChatGPT 帳號登入、吃自己的訂閱額度，不用額外申請 API key → 降低終端使用者導入門檻，計費也轉嫁回使用者自己的訂閱
- **ElevenLabsAgentsRealtimeModel**：新增在 ElevenLabs Agents 平台上跑即時語音 session 的 model backend → realtime voice agent 多一個現成選擇，不用自己接 WebSocket
- **Step Store 去重（Sqlite／Postgres／Mongo）**：之前每次 snapshot 都會把整段歷史重複存一次，現在改成每則訊息只存一次 → 長對話的儲存空間與寫入量明顯下降
- **設定不支援時主動警告（`UnsupportedSettingWarning`）**：某個 model 不支援 `timeout`、`max_retries`、`stop_sequences` 等設定時會跳警告，而不是悄悄忽略 → 比較容易抓到「設定沒生效」的誤會

## Breaking Changes

Release notes 把兩項列在「⚠️ Compatibility Notes」，另外兩個安全修補也等同強制行為變更：

- DBOS workflow 搭配 `Planning` 與 `event_stream_handler`：既有在跑的 workflow 升級後可能無法正確恢復
  - 影響範圍：用 DBOS 跑長流程 Agent 且搭配 `event_stream_handler` 的專案，建議讓現有 in-flight workflow 先跑完，或部署新的 DBOS 應用版本再切換
- `RealtimeTurnCompleteEvent` 的語意對齊到 `wait_for_reply()` 等待的交換邊界
  - 影響範圍：依賴 realtime turn 完成時機做 UI 邏輯的專案，行為可能改變；建議改用各 part 的 `PartEndEvent` 判斷何時該結束 caption
- 安全修補 GHSA-xv4x-g8mx-ch56（Medium）：provider-native MCP 設定可能把 server URL、authorization token、自訂 header 洩漏進 OpenTelemetry request trace，即使設了 `include_content=False`；URL-based MCP capability 也可能把憑證洩漏進 URL 衍生的識別碼
  - 影響範圍：用 provider-native MCP 或 URL-based MCP capability 的專案，應升級並限制歷史 trace 存取權限、旋轉已外洩的憑證；用 Temporal tracing 搭配 MCP 的專案要留意：URL-based MCP activity 名稱維持不變以保留 in-flight workflow,待其跑完再換上明確的 `id=`
- 安全修補 GHSA-5pfm-2g3g-gh85（Medium）：非空 `message_history` 搭配 `manage_system_prompt='server'`（預設值）時，Vercel AI 與 AG-UI adapter 可能讓工具被用戶端指定的參數執行、不經模型請求（需要人核准的工具不受影響）
  - 影響範圍：用 Vercel AI 或 AG-UI adapter 且維持預設 `manage_system_prompt` 設定的專案；v1 不受影響

## 遷移指南

### 從 v2.57.0 升級到 v2.58.0

```bash
pip install --upgrade "pydantic-ai==2.58.0"
```

升級後檢查：用 DBOS 跑長流程且搭配 `event_stream_handler` 的專案，先讓現有 workflow 跑完再切版本；用 provider-native MCP 的專案盤點過去的 trace 是否存過 URL／token，必要時旋轉憑證；用 Vercel AI／AG-UI adapter 且維持 `manage_system_prompt='server'` 預設值的專案直接升級即對應修掉該漏洞,不需要額外改程式碼。

```python
# 想用整輪 run 的逾時
result = await agent.run(user_prompt, timeout=30)

# 想在委派任務跑到一半時轉向
task = agent.delegate(...)
task.steer("改成用繁體中文回答")
```

## 與其他框架的對比觀察

這週 Mastra 用 agent scope 做權限、Agno 用 sandbox 做隔離、Pydantic AI 上一版用 `ApprovalReviewer` 做審批，這一版補的是「執行中途還能不能介入」——`DelegationTasks.steer` 讓委派任務不必整個重跑就能轉向,這一點目前多數 graph-based 框架（如 LangGraph）還是得靠重新進入某個節點來模擬,Pydantic AI 把它做成一個明確的 API。

## 今日收穫

之前以為 agent 的逾時問題只要在每次 model request 設一個 timeout 就夠了,看到這版同時補上 `timeout=` 和 `RunContext.deadline` 才意識到,真正會拖死整輪 run 的往往不是單次請求太慢,而是工具呼叫、重試、多輪委派疊加起來的總時間——逾時要包住的是整輪流程,不是其中一個環節。

## 參考資料

- [Pydantic AI v2.58.0 release notes — GitHub](https://github.com/pydantic/pydantic-ai/releases/tag/v2.58.0)
- [pydantic/pydantic-ai — GitHub](https://github.com/pydantic/pydantic-ai)
- [GHSA-xv4x-g8mx-ch56 — MCP request telemetry advisory](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-xv4x-g8mx-ch56)
- [GHSA-5pfm-2g3g-gh85 — UI adapter history advisory](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5pfm-2g3g-gh85)
- [框架更新｜Pydantic AI v2.57.0](/posts/daily/2026-10-17-framework-pydantic-ai-v2.57.0)
