---
title: "框架更新｜Agno v3.1.4"
date: 2026-10-17
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: zh-TW
description: "Agno 3.1.4 讓 ClaudeAgent／CodexAgent 能跑在隔離容器裡，session 狀態可以在容器、主機甚至副本掛掉後靠 checkpoint 還原；同一 session 的背景 run 也改成預設排隊、一次只跑一個"
tldr: "Agno v3.1.4 核心是 Sandboxed Harness Agents：ClaudeAgent／CodexAgent 可以跑進隔離的、每個 session 一份的容器（DockerSandbox 或 AWS Bedrock AgentCore），session 狀態用 checkpoint 還原，容器掛了不會逼你重開對話；warm sandbox 讓下一輪對話更快接上。另外新增 Queue Per Session，同一 session 的背景 run 預設改成依序排隊、一次只跑一個（過去是靠先接受後失敗擋）。無正式 breaking changes，但 sandbox 匯入路徑搬動、`sandbox=\"read-only\"` 改名 `sandbox_mode`、舊的 sandbox 綁定表要手動搬移，升級後都要檢查。"
series:
  name: "AI Framework Changelog"
  order: 46
---

> 🌏 [English version](/posts/daily/2026-10-17-framework-agno-3.1.4-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Agno |
| 版本 | `v3.1.4` |
| 前一版 | `v3.1.3` |
| 發布日 | 2026-10-16 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.4) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42.8k |

## 這個版本為什麼重要

上一版把 `ClaudeAgent`／`CodexAgent` 補成跟原生 Agent 對等的一級公民（背景執行、重試、checkpoint 重放），這一版補的是執行環境本身：這些外部 agent 現在可以真正跑進隔離容器,而不是直接碰主機。對把 Claude Code 或 Codex 接進 production 當 coding agent 用的團隊,這代表終於有官方給的隔離方案,不用自己拼 Docker 設定還要處理 session 斷線後的還原問題。

## 重要變更

- **Sandboxed Harness Agents**：`ClaudeAgent`／`CodexAgent` 接受 `sandbox=` 參數,跑在隔離的、每個 session 一份的容器裡;容器、主機或副本掛掉都不影響 session 狀態,靠 checkpoint 在對話輪次之間還原,原生對話狀態真的救不回來時這一輪會直接失敗,而不是悄悄開一個新對話 → 新增 `require_native_resume`／`strict_persistence` 選項,以及 `agno[claude]`／`agno[codex]` extras
- **DockerSandbox**：容器用 UID 1000 跑、檔案系統唯讀、丟掉多餘 capability、設資源上限,預設不連網（可選 `isolated`）,也不掛主機或 Docker socket;支援暫停／恢復與 checkpoint 轉移
- **AWS Bedrock AgentCore Sandbox**：在 AgentCore Runtime 上實作同一套 sandbox 契約,搭配 `AgentCoreCheckpointTransfer`（不支援暫停)
- **Warm Sandbox Turns**：coordinator 在一輪對話結束後保留容器 `warm_computer_seconds`（預設 300 秒），讓下一輪接得更快——頁面給的數字是 Claude 熱啟動 4.6 秒（Docker）／3.3 秒（AgentCore），冷啟動是 8.2 秒
- **Queue Per Session**：同一 session 上的背景 run 現在預設依序排隊、一次只跑一個，不同 session 仍可平行 → accepting replica 在 commit 後會喚醒自己的 queue worker，提交即開跑,不用等下一輪輪詢
- **ChartTools**：新增工具包,`create_chart` 工具驗證圖表格式（bar／line／area／pie 及堆疊／橫向變體）並回傳可渲染的圖表區塊

## Breaking Changes

本版沒有標成正式 breaking changes，但有幾項會影響既有部署的行為變更：

- Sandbox provider 的匯入路徑搬到 `agno.sandbox.docker` 與 `agno.sandbox.agentcore`
  - 影響範圍：直接 import 舊路徑的專案
- `CodexAgent` 的 `sandbox="read-only"` 改名為 `sandbox_mode`（舊寫法仍可用，但會丟 `DeprecationWarning`）
  - 影響範圍：設定過 `sandbox="read-only"` 的 CodexAgent
- Queue Per Session 預設開啟，同一 session 上的背景 run 從「可以並發」變成「依序一次一個」
  - 影響範圍：依賴同一 session 並發背景 run 的服務
- 舊版本建立的 sandbox 綁定表需要手動搬移；AgentOS 啟動時會驗證並提示要做的事
  - 影響範圍：從舊版升級、已經有 sandbox 綁定資料的部署

## 遷移指南

### 從 v3.1.3 升級到 v3.1.4

```bash
pip install --upgrade agno==3.1.4
```

```python
# 匯入路徑更新
# 舊：from agno.sandbox import DockerSandbox
# 新：
from agno.sandbox.docker import DockerSandbox

# sandbox_mode 取代 sandbox="read-only"
# 舊：
agent = CodexAgent(sandbox="read-only")
# 新：
agent = CodexAgent(sandbox_mode="read-only")
```

升級後啟動 AgentOS，依它的提示處理舊 sandbox 綁定表的搬移；若原本靠同一 session 多個背景 run 並發執行，需要重新設計成依序排隊也能接受的流程。

## 與其他框架的對比觀察

今天 Mastra 1.78.0 用 agent scope 擋「誰能碰哪個 run」，Pydantic AI v2.57.0 用 `ApprovalReviewer` 擋「工具呼叫要不要讓人看」，Agno 這版用容器隔離擋的是第三層——「agent 執行時能碰到什麼」。三個框架同一週把這三道防線分頭補上，與其說是巧合，更像是整個生態在同一時間點意識到：外部 coding agent（Claude Code、Codex）一旦被當成 production 的一部分,光有能力跑任務不夠,權限、審批、隔離三者缺一不可。

## 今日收穫

之前以為把 Claude Code 這類外部 coding agent 丟進容器只是「多包一層」的工程細節，看完 warm sandbox 的設計才意識到真正的難點是權衡——完全隔離換來安全，但容器冷啟動的延遲會直接拖慢每一輪對話；Agno 選擇用「保留一段時間」而不是「每次都重建」來緩解這個取捨，而不是在隔離和速度之間二選一。

## 參考資料

- [Agno v3.1.4 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.4)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [框架更新｜Agno v3.1.3](/posts/daily/2026-10-12-framework-agno-3.1.3)
- [PR #11028：Sandbox Support](https://github.com/agno-agi/agno/pull/11028)
- [PR #9587：Queue Per Session](https://github.com/agno-agi/agno/pull/9587)
