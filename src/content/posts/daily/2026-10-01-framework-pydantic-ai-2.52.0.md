---
title: "框架更新｜Pydantic AI v2.52.0"
date: 2026-10-01
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: zh-TW
description: "Pydantic AI 2.52 修掉一個 web_fetch 資安漏洞（深層巢狀 HTML 可耗盡 CPU／記憶體），同時把所有 harness 能力（Coder／Shell／FileSystem）收進統一的 Workspace 介面，本機或四種 sandbox 後端共用同一組 API，並推出首個 pydantic-clai2 CLI"
tldr: "Pydantic AI v2.52.0 三個重點：(1) 資安——GHSA-v36g-jcw9-x7cw（moderate），攻擊者控制的深層巢狀 HTML 餵進本機 web_fetch 工具會耗盡 CPU／記憶體，provider 原生的網頁擷取不受影響，2.52.0（v2）與 1.107.7（v1）皆已修補；(2) 新增 Workspace 抽象，Coder／Shell／FileSystem 等 harness 能力改走 ctx.workspace，本機或 SSHWorkspace／BubblewrapSandbox／E2BSandbox／SpritesSandbox 四種 sandbox 後端共用同一組 API，ModalSandboxSession 改名為 ModalSandboxBackend；(3) pydantic-ai-harness 版號從 0.36.0 跳到 0.52.0 並隨每次發布內建，首個 pydantic-clai2（`uvx pydantic-clai2`）CLI 同時推出，內建 github／slack／notion／logfire_mcp 等外掛。"
series:
  name: "AI Framework Changelog"
  order: 29
---

> 🌏 [English version](/en/posts/daily/2026-10-01-framework-pydantic-ai-2.52.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Pydantic AI |
| 版本 | v2.52.0 |
| 前一版 | v2.51.0 |
| 發布日 | 2026-09-29 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.52.0) |
| Security Advisory | [GHSA-v36g-jcw9-x7cw](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-v36g-jcw9-x7cw) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20.3k |

## 這個版本為什麼重要

這版有兩件事疊在一起。第一件是資安：本機 `web_fetch` 工具在解析攻擊者控制的 HTML 時，如果頁面塞滿深層巢狀元素，解析過程會把 CPU 和記憶體吃到耗盡——這是一個典型的演算法複雜度型 DoS，provider 原生的網頁擷取（走 provider 自己的伺服器解析）不受影響，只有 Pydantic AI 自己跑的本機解析器會中。GHSA 等級是 moderate，2.52.0（v2）和 1.107.7（v1）都已修補。第二件事是架構調整：過去 `Coder`／`Shell`／`FileSystem` 這些 harness 能力各自綁定執行環境（本機、或個別寫一套 Modal sandbox 整合），2.52.0 把它們統一收進 `ctx.workspace`，本機執行和四種 sandbox 後端（SSHWorkspace、BubblewrapSandbox、E2BSandbox、Fly.io 的 SpritesSandbox）共用同一組介面，工具程式碼不用再為每種後端各寫一份。`pydantic-ai-harness` 這次也搬進主 repo、隨每次發布同步出版號，並帶出首個 `pydantic-clai2` CLI——這代表 Pydantic AI 不只是一個函式庫，也想往「內建一個可以直接跑起來的 agent CLI」的方向走，跟 Claude Code、Codex CLI 是同一種產品形態。

## 重要變更

- **Workspace 抽象（`ctx.workspace`）**：把檔案與指令操作收進一個統一 API，可以在本機跑，也可以透過同一組呼叫切到 sandbox 後端，並支援 durable execution → 寫一次工具邏輯，換執行環境不用改程式碼
- **四種新 sandbox 後端**：`SSHWorkspace`、`BubblewrapSandbox`、`E2BSandbox`、`SpritesSandbox`（跑在 Fly.io Sprite 上）都實作同一個 Workspace 介面，涵蓋從自架機器到託管沙箱的常見部署形態
- **`ModalSandboxBackend` 取代 `ModalSandboxSession`**：原本 `ModalSandbox` 自帶一套工具，現在改成透過 Modal workspace 讓 `Coder`／`Shell`／`FileSystem` 在 sandbox 裡跑，介面統一到和其他三種 sandbox 後端一致
- **`pydantic-ai-harness` 併入主 repo，隨主版號發布**：版號從獨立維護的 0.36.0 直接跳到跟隨主版號的 0.52.0
- **`pydantic-clai2` 首個發布**：`uvx pydantic-clai2` 即可啟動，內建 github／slack／notion／logfire_mcp／google_workspace／day_ai／ordinal／pylon 等外掛，各自有 `/keys` 或瀏覽器登入設定選單
- **`SubAgents` 不再預設載入 agent 檔案，`inherit_tools` 標記為 deprecated**：子 agent 的工具與設定來源變得更明確，不再隱性繼承
- **`AnthropicModel` 預設 `max_tokens`**：先從 4096 拉到 16384（Claude Sonnet 4.5 以上），後續再改成直接吃模型本身的最大輸出上限，並在背後改用串流處理這類長輸出請求

## Breaking Changes

- `ModalSandboxSession` 改名為 `ModalSandboxBackend`：
  - 舊：直接 import／建構 `ModalSandboxSession`
  - 新：改用 `ModalSandboxBackend`，行為對齊其他三種 Workspace 後端
  - 影響範圍：用 `ModalSandbox` 整合跑 Coder／Shell／FileSystem 工具的專案
- 影響範圍外的行為變化（非 API 簽名破壞，但會改變預設行為）：`SubAgents` 不再預設載入 agent 檔案（原本依賴這個預設值的子 agent 設定要改成明確傳入）；`AnthropicModel` 的 `max_tokens` 預設值連續兩次調整，會改變長回覆的截斷點與串流行為

## 遷移指南

### 從 2.51.0 升級到 2.52.0

```bash
pip install --upgrade pydantic-ai==2.52.0
```

```python
# 舊寫法（2.51.0 及之前，Modal sandbox）
from pydantic_ai.sandbox.modal import ModalSandboxSession
sandbox = ModalSandboxSession(app_name="my-agent")

# 新寫法（2.52.0，統一 Workspace 介面）
from pydantic_ai.sandbox.modal import ModalSandboxBackend
workspace = ModalSandboxBackend(app_name="my-agent")
agent = Agent(model, workspace=workspace)  # Coder/Shell/FileSystem 透過 ctx.workspace 存取
```

沒有用到 Modal sandbox 的專案沒有程式碼層的 breaking change，但如果依賴 `SubAgents` 預設繼承 agent 檔案或工具，升級後要明確設定，不然子 agent 會少掉原本隱性帶進來的設定；`web_fetch` 工具本身不用改程式碼，升級即修補資安漏洞。

## 與其他框架的對比觀察

把執行環境收進統一介面，是這幾個月框架圈的共同動作——LangGraph 用原生 checkpoint 統一記憶體後端，這次 Pydantic AI 用 Workspace 統一沙箱後端，兩者都是把「原本要自己接的基礎設施」收進框架本身。但 Pydantic AI 這次多走了一步：`pydantic-clai2` 直接推出一個掛滿外掛（github／slack／notion／logfire_mcp）的 CLI，這不是函式庫附帶的範例工具，是往 Claude Code、Codex CLI 那種「框架自己就是一個可以日常使用的 agent 產品」的方向靠。對已經把 Pydantic AI 當底層函式庫、自己包一層 CLI 的團隊，這代表官方可能會逐漸把功能往 `pydantic-clai2` 集中，值得評估要不要直接採用官方 CLI 而不是繼續維護自己那層。

## 今日收穫

之前看 sandbox 整合，預設是每種後端（Modal、E2B、SSH）各自暴露一套專屬 API，工具程式碼要跟著寫條件分支。這版把它們全部收進 `ctx.workspace` 一個介面才意識到：sandbox 後端的差異應該停在「怎麼啟動」這一層，不該滲透進「工具怎麼呼叫檔案系統和殼層」這一層——前者是部署決策，後者才是 agent 邏輯，兩者混在一起會讓同一套工具程式碼綁死在特定執行環境上。

## 參考資料

- [Pydantic AI v2.52.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.52.0)
- [Security Advisory GHSA-v36g-jcw9-x7cw](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-v36g-jcw9-x7cw)
- [Pydantic AI GitHub](https://github.com/pydantic/pydantic-ai)
- [Pydantic AI v2.46.0 — 上一篇框架更新](/posts/daily/2026-09-21-framework-pydantic-ai-2.46.0)
- [PR #6492：新增 Workspace 抽象（`ctx.workspace`）](https://github.com/pydantic/pydantic-ai/pull/6492)
- [PR #8867：ModalSandboxBackend 取代 ModalSandboxSession](https://github.com/pydantic/pydantic-ai/pull/8867)
- [PR #8869：新增 SpritesSandbox（Fly.io）](https://github.com/pydantic/pydantic-ai/pull/8869)
- [PR #8868：新增 E2BSandbox](https://github.com/pydantic/pydantic-ai/pull/8868)
- [PR #8956：新增 SSHWorkspace 與 BubblewrapSandbox](https://github.com/pydantic/pydantic-ai/pull/8956)
- [PR #9023：SubAgents 不再預設載入 agent 檔案](https://github.com/pydantic/pydantic-ai/pull/9023)
- [PR #8984：修補 web_fetch 深層巢狀 HTML DoS](https://github.com/pydantic/pydantic-ai/pull/8984)
- [Full Changelog: v2.51.0...v2.52.0](https://github.com/pydantic/pydantic-ai/compare/v2.51.0...v2.52.0)
