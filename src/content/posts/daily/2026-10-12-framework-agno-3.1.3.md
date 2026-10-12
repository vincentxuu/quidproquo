---
title: "框架更新｜Agno v3.1.3"
date: 2026-10-12
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: zh-TW
description: "Agno 3.1.3 把 Claude Agent SDK／Codex 這類外部 agent 補齊成跟原生 Agent 幾乎對等的一級公民：可續跑的 session、背景執行、重試、結構化輸出都補上了"
tldr: "Agno v3.1.3 的核心主題是外部 agent（ClaudeAgent / CodexAgent）補齊原生 Agent 的能力：(1) session 的 SDK 對話紀錄現在存進資料庫，換機器也能續跑；(2) 新增背景執行、取消、依 checkpoint 重放步驟；(3) 補上重試、token/cost 指標、壓縮、結構化輸出與圖片附件。無正式 breaking changes，但「同一 session 只能跑一個 turn」的行為從『先接受後失敗』改成直接回 409。"
series:
  name: "AI Framework Changelog"
  order: 38
---

> 🌏 [English version](/posts/daily/2026-10-12-framework-agno-3.1.3-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Agno |
| 版本 | `v3.1.3` |
| 前一版 | `v3.1.2` |
| 發布日 | 2026-10-12 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.3) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42.6k |

## 這個版本為什麼重要

Agno 把 Claude Agent SDK 和 Codex 包成「external agent」已經有一段時間，但長期以來它們只是陽春的 adapter：跑完就跑完，重開一台機器就接不回去，也沒有重試、沒有背景執行、沒有統一的指標。3.1.3 這一版把這塊差距幾乎補滿——session 的 SDK 對話紀錄會鏡射進 `agno_transcripts` 資料表，背景執行、取消、依 checkpoint 重放、重試、token/cost 指標、對話壓縮、結構化輸出、圖片附件全部到位。換句話說，`ClaudeAgent` 和 `CodexAgent` 現在幾乎可以當成跟原生 `Agent` 對等的一級公民來用，而不是「包了殼但功能打折」的外部 agent。對已經把 Claude Code 或 Codex 接進 AgentOS 當 production agent 用的團隊，這代表終於能放心做多副本部署、斷線重試和長程任務管理。

## 重要變更

- **Durable External Agent Sessions（可續跑的外部 agent session）**：`ClaudeAgent` 的 SDK session id 存進 Agno session，搭配 `PostgresDb`／`SqliteDb` 等支援 transcript 的資料庫，每一行對話都鏡射進新的 `agno_transcripts` 表 → 換一台機器接手同一個 session 時，從資料庫還原對話而不是本機檔案，無法還原時才退回用 Agno 歷史重建全新 SDK session
- **Background Runs & Cancellation（背景執行與取消）**：`ClaudeAgent`／`CodexAgent` 支援 `background=True`、可續跑的 queue run id、可重連的事件串流，並能透過 `/agents/{id}/runs/{run_id}/cancel` 中斷 → 跟原生 agent 共用同一套背景任務與事件串流基礎設施，長任務不用整個請求掛著等
- **Step Replay（依 checkpoint 重放）**：`ClaudeAgent.continue_run` 支援跟原生 `Agent.continue_run` 一樣的 `continue_from`／`fork`／`input`，每個工具結果都是一個可列出的 checkpoint → 重放時從指定 checkpoint 分岔出新的 SDK transcript，已完成的 run 永遠不會被就地改寫，續跑永遠是新的 sibling run
- **Retries for External Agents（外部 agent 重試）**：`retries`、`delay_between_retries`、`exponential_backoff` 跟原生 `Agent` 預設一致，重試沿用同一個 run id 續接原 SDK session／Codex thread，但帳務上限和認證、額度、context window 等永久性錯誤不會重試 → 重試期間工具呼叫結果只保留一份、串流端會收到 `type: "retry"` 事件
- **Metrics / Compaction / Stored Events / Structured Output / Media**：外部 agent 的每次 run 都能回報 token/cache/cost 指標、能用資料庫存的壓縮摘要續跑、能把事件存起來給之後重播、能用 Pydantic model 或 JSON Schema 拿結構化輸出、也能直接附圖片或檔案 → 這些過去只有原生 `Agent` 才有的能力，現在外部 agent 一次補齊
- **行為變更（非正式 breaking change）**：同一 session 上第二個 turn 如果在前一個還在跑，現在直接回 `SessionBusyError`（HTTP 409），不像以前先接受請求再讓它失敗 → 呼叫端要檢查 409 並排隊重試，而不是假設請求一定會被接受

## Breaking Changes

本版無正式 breaking changes，但上面「同一 session 只能跑一個 turn」的語意改變值得注意：原本會被接受後失敗的併發請求，現在會直接被拒絕。

## 遷移指南

直接升級即可，不需要改動既有程式碼：

```bash
pip install --upgrade agno==3.1.3
```

要用新的外部 agent 重試與背景執行，寫法跟原生 `Agent` 對齊：

```python
from agno.agent import ClaudeAgent

agent = ClaudeAgent(
    retries=3,
    delay_between_retries=2,
    exponential_backoff=True,
)

# 背景執行＋之後用 run_id 查詢或取消
run = agent.run(input="長任務...", background=True)
```

## 與其他框架的對比觀察

LangGraph、CrewAI 的做法是把 Claude Code／Codex 這類外部編碼 agent 當成「另一種工具」或完全獨立的流程，跟自家原生 agent 走不同的 API 表面。Agno 這一版延續它一貫的策略——不自己重造一套 agent loop，而是把市場上已經成熟的 SDK 包裝成跟原生 agent 共用同一組能力（背景執行、重試、指標、結構化輸出）的 external agent。代價是要維護兩套底層執行模型的相容層，但換來的是開發者不用因為「這個 agent 是 Claude SDK 跑的」而被迫用另一套心智模型。

## 今日收穫

之前以為「包一層 adapter 讓外部 SDK 看起來像自己的 agent」只是介面統一的問題，看完這版才發現真正的工程量在於把背景執行、重試、checkpoint 重放這些原生 agent 原本就有的「可靠性基礎設施」，一項項搬到一個你不完全控制執行迴圈的外部 SDK 上——重試要知道哪些錯誤可以安全重放、重放要知道怎麼在不屬於你的 transcript 格式裡插入分岔點。統一 API 表面只是結果，真正難的是底下這層相容工程。

## 參考資料

- [Agno v3.1.3 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.3)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v3.1.2 — 上一篇框架更新](/posts/daily/2026-10-10-framework-agno-3.1.2)
- [PR #10904：Durable External Agent Sessions](https://github.com/agno-agi/agno/pull/10904)
- [PR #10905：Background Runs & Cancellation for External Agents](https://github.com/agno-agi/agno/pull/10905)
- [PR #10917：Step Replay for ClaudeAgent](https://github.com/agno-agi/agno/pull/10917)
- [PR #10937：Retries for External Agents](https://github.com/agno-agi/agno/pull/10937)
- [PR #10958：One Turn Per Session（SessionBusyError）](https://github.com/agno-agi/agno/pull/10958)
