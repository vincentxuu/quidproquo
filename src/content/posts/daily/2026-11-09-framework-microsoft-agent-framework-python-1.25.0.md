---
title: "框架更新｜Microsoft Agent Framework python-1.25.0"
date: 2026-11-09
category: daily
type: digest
tags: [ai-agent, framework, daily, microsoft-agent-framework]
lang: zh-TW
description: "Microsoft Agent Framework python-1.25.0 一次標記七個 BREAKING 變更，重心全放在把 workflow、MCP session、沙箱錯誤訊息這些容易跨使用者洩漏狀態的邊界收緊"
tldr: "Microsoft Agent Framework python-1.25.0 七個 BREAKING 變更全部圍繞「邊界隔離」：workflow 執行器與 session 綁死單一授權範圍、MCP session 改成每次呼叫都重開、沙箱錯誤訊息預設隱藏細節、拿掉 Python 3.10 支援。這是繼 9 月 1.19.0（也是四個 BREAKING、同樣聚焦 session 作用域）之後，MAF 第二次用整版篇幅收緊跨呼叫狀態隔離，而不是加新功能。"
series:
  name: "AI Framework Changelog"
  order: 64
---

> 🌏 [English version](/posts/daily/2026-11-09-framework-microsoft-agent-framework-python-1.25.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Microsoft Agent Framework |
| 版本 | python-1.25.0 |
| 前一版 | python-1.24.0 |
| 發布日 | 2026-11-07 |
| Release Notes | [GitHub Release](https://github.com/microsoft/agent-framework/releases/tag/python-1.25.0) |
| GitHub | [microsoft/agent-framework](https://github.com/microsoft/agent-framework) |
| Stars | 14.6k |

## 這個版本為什麼重要

這版的七個 BREAKING 變更全部指向同一件事：**誰的資料會不會被另一個呼叫方看到**。workflow 的 executor 和 session 現在被綁死在單一授權範圍內，跨範圍重用會直接被拒絕；MCP session 不再快取，每次呼叫都重開一個乾淨的連線；沙箱裡的錯誤訊息預設只回傳通用的 `RuntimeError`，不洩漏原始例外的細節。這些都不是「加新功能」，而是把「多個使用者共用同一個 agent 或 workflow 實例」這種常見的生產環境部署模式，從「預設可能洩漏狀態」改成「預設隔離、要共用請明確選擇」。對已經在多租戶場景（例如一個 workflow 實例服務多個客戶請求）用 MAF 的團隊來說，這版升級前必須先確認自己的部署方式；對還在評估的團隊來說，這是 MAF 繼 9 月 1.19.0 之後第二次用整版篇幅處理「跨呼叫狀態隔離」，顯示這類邊界問題不是一次修完就結束，而是框架持續在補的系統性課題。

## 重要變更

- **Callable MCP discovery 核准政策**：`agent-framework-core`、`agent-framework-foundry-hosting` 新增可呼叫的 MCP discovery 核准政策，支援 Foundry Toolbox 的核准 metadata（含工具名稱過濾、唯讀過濾、呼叫端明確覆寫、對保留工具的政策重新整理）→ 企業部署可以用程式邏輯動態決定哪些 MCP 工具能被發現，不用把核准清單寫死在設定檔
- **Redis 整合支援 Python 3.15**：`agent-framework-core`、`agent-framework-redis` 的 Redis 整合與其標準安裝依賴開放在 Python 3.15 上使用，RedisVL 支援範圍放寬到含 0.31 → 用 Redis 做 chat history 或向量儲存的團隊不用再卡在舊版 Python
- **擴大 FastAPI／Azure AI Projects 依賴範圍**：同時要求 Pydantic Monty 1.0 以上並更新 runtime bridge → 跟進上游套件版本，減少依賴衝突

## Breaking Changes

- Python 版本下限提高：
  - 舊行為：`Requires-Python` 允許 3.10
  - 新行為：拿掉 3.10 安裝資格與相容分支，要求 3.11 以上（Foundry Local 支援 3.11–3.14）
  - 影響範圍：所有套件（`agent-framework-core` 及幾乎全部 provider／整合套件），還在用 Python 3.10 的部署必須先升級環境才能裝這版
- MCP 工具／prompt discovery 加上數量與逾時上限：
  - 舊行為：discovery 沒有內建的分頁數或項目數上限，逾時行為由呼叫端決定
  - 新行為：每個 catalog 綁死 100 頁、1,000 項上限，框架自建的請求預設逾時 30 秒；refresh 失敗時保留完整的舊 catalog snapshot
  - 影響範圍：接超過 1,000 個工具／prompt 的大型 MCP catalog，或依賴框架自建 client 執行長時間請求的部署
- workflow 的 executor／session 綁死單一授權範圍，拒絕跨範圍重用：
  - 舊行為：共用的 workflow builder 可能讓同一個 executor／session 實例服務不同呼叫方
  - 新行為：跨範圍重用回報 `WORKFLOW_SCOPE_CONFLICT`；`WorkflowAgent.as_tool()` 在 AG-UI 端點直接被拒絕並回報 `WORKFLOW_AGENT_TOOL_UNSUPPORTED`
  - 影響範圍：多租戶場景下共用同一個 workflow 實例服務不同使用者的部署，必須改用 `AgentFrameworkWorkflow(workflow_factory=...)` 讓每次呼叫都建立新實例，或明確設定 `single_user=True`（僅限所有呼叫方確實是同一個 principal 時）
- workflow 的 OpenTelemetry span 改用 GenAI 語意慣例：
  - 舊行為：span 名稱固定用 `workflow.run`，屬性叫 `workflow.name`
  - 新行為：span 操作名稱改成 `gen_ai.operation.name == "invoke_workflow"`，具名 span 格式為 `invoke_workflow {workflow_name}`，屬性改叫 `gen_ai.workflow.name`
  - 影響範圍：對 trace 做 span 名稱或屬性過濾的監控／告警規則需要同步改規則
- 跨 workflow 的 MCP session 不再快取：
  - 舊行為：`agent-framework-declarative` 的 `DefaultMCPToolHandler` 會快取已初始化的 session 供多個 workflow 重用（包含 `tools/list`）
  - 新行為：每次 handler 呼叫都建立並關閉一個全新的 protocol session；舊的 `cache_max_size` 參數仍接受但已棄用（no-op，會發 `DeprecationWarning`）
  - 影響範圍：用 `async with DefaultMCPToolHandler(...)` 寫法、或依賴 session 在多次呼叫間延續狀態的部署；這是一個安全修復，防止跨 workflow 的狀態洩漏
- Foundry Local SDK 升級到 2.3.1：
  - 舊行為：使用舊版 Foundry Local SDK，`do_sample`、`early_stopping` 等參數可用
  - 新行為：要求 `foundry-local-sdk>=2.3.1,<3`，支援 SDK 註冊的本機模型並在首次推論前先備妥模型；移除 `do_sample`、`early_stopping`
  - 影響範圍：用 Foundry Local 跑本機模型的部署，需確認平台支援（Apple Silicon macOS、Linux x86_64/aarch64、Windows x64/ARM64）
- 沙箱錯誤訊息預設隱藏細節：
  - 舊行為：`agent-framework-hyperlight`、`agent-framework-monty` 的 CodeAct 執行環境發生例外時，可能把原始例外型別與訊息回傳給生成的程式碼
  - 新行為：預設改成通用的 `RuntimeError` 診斷訊息，並依政策隔離 Hyperlight 沙箱快取
  - 影響範圍：依賴原始例外細節做除錯的用法，需要在信任的通道上明確設定 `include_detailed_errors=True` 才能還原舊行為

## 遷移指南

### 從 python-1.24.0 升級到 python-1.25.0

```bash
pip install --upgrade agent-framework agent-framework-core
```

```python
# 若多個呼叫方共用同一個 workflow 實例（多租戶場景）
# 舊寫法：直接重用同一個 builder 建出來的 workflow
workflow = builder.build()
# 不同使用者的請求都打進同一個 workflow 實例

# 新寫法：改用 factory，每次呼叫建立新的 workflow／executor／session
agent_workflow = AgentFrameworkWorkflow(
    workflow_factory=lambda: builder.build()
)
# 若所有呼叫方確實是同一個 principal，才明確設定：
agent_workflow = AgentFrameworkWorkflow(
    workflow_factory=lambda: builder.build(),
    single_user=True,
)

# 若用 async with 包住 DefaultMCPToolHandler
# 舊寫法
async with DefaultMCPToolHandler(...) as handler:
    tools = await handler.list_tools()

# 新寫法：直接建構，不用 context manager；移除 cache_max_size（或設 None）
handler = DefaultMCPToolHandler(...)
tools = await handler.list_tools()
```

升級後建議優先檢查三類場景：（1）任何 workflow 實例被多個呼叫方共用的部署，確認是否需要改成 factory 模式或明確設 `single_user=True`；（2）用 `async with DefaultMCPToolHandler` 寫法的程式碼，或依賴 session 跨呼叫延續狀態的用法；（3）還在 Python 3.10 上跑的環境，先升級到 3.11 以上才能安裝這版。監控規則若對 `workflow.run` span 名稱或 `workflow.name` 屬性做過濾，需同步改成 `gen_ai.operation.name` 與 `gen_ai.workflow.name`。

## 與其他框架的對比觀察

這週同時有兩個主流 agent 框架發了以安全邊界為主的版本：MAF 這版處理的是「跨呼叫、跨 workflow」的狀態隔離，Pydantic AI 11 月 4 日的 v2.66.0 則是直接修了四個資安通報（`web_fetch_tool` 的 JSON 重縮排 DoS、密鑰遮罩規則的 ReDoS、Tencent Cloud metadata 位址漏掉在雲端中繼資料封鎖清單裡、embedding span 洩漏憑證），兩者時間點相差不到一週。差別在於觸發方式：Pydantic AI 的問題是「外部輸入可以觸發」的漏洞（CVE 等級的資安通報），MAF 這次標記的七個 BREAKING 多半是「架構層級的預設行為」收緊（workflow 作用域、MCP session 快取），不是單一漏洞修補，而是把一整類「共用實例可能跨使用者洩漏狀態」的設計模式改成預設關閉。兩家框架在同一週各自以不同路徑處理「邊界」問題，說明 agent 框架進入生產環境後，session／scope 隔離正在變成繼「功能夠不夠多」之後的下一個共同考題。

## 今日收穫

之前看 MAF 9 月的 1.19.0（四個 BREAKING，聚焦 HTTP cookie、MCP session、Redis key 作用域）以為那是一次性的安全加固，這次看到 1.25.0 又是七個 BREAKING、同樣聚焦作用域隔離，才意識到：「跨呼叫狀態隔離」不是一個框架補一次就結束的問題，而是隨著更多功能加進來（這次新增了 workflow executor 綁定、沙箱錯誤訊息）就會冒出新的洩漏點，需要持續盤點。這也解釋了為什麼 MAF 的 BREAKING 變更密度看起來比功能新增還高——不是它功能加得少，而是它選擇把每個新發現的邊界問題都公開標記成 BREAKING，而不是悄悄修掉。

## 參考資料

- [Microsoft Agent Framework python-1.25.0 Release Notes](https://github.com/microsoft/agent-framework/releases/tag/python-1.25.0)
- [Microsoft Agent Framework GitHub](https://github.com/microsoft/agent-framework)
- [PR #10035：Bind live workflow agent executors to one authorization scope](https://github.com/microsoft/agent-framework/pull/10035)
- [PR #8662：Prevent cross-workflow MCP state sharing](https://github.com/microsoft/agent-framework/pull/8662)
- [框架更新｜Microsoft Agent Framework python-1.19.0（2026-09-20）](/posts/daily/2026-09-20-framework-microsoft-agent-framework-1.19.0)
- [框架更新｜Pydantic AI v2.66.0（2026-11-05）](/posts/daily/2026-11-05-framework-pydantic-ai-v2.66.0)
