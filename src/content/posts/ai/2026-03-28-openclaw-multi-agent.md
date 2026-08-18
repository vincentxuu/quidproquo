---
title: "OpenClaw 多 Agent：一個 agent 是一整個人格邊界，而 agent 現在可以要求生出 agent"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, multi-agent, bindings, workspace, agent-isolation, persona]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 9
tldr: "一個 agent 是完整的人格範圍——workspace、auth profile、模型登錄、session 儲存全部獨立。但隔離不是絕對的：次要 agent 的 OAuth 憑證過期時，OpenClaw 會回頭讀主 agent 的同名 profile，而 workspace 只是預設工作目錄，不是硬性沙箱。"
description: "OpenClaw 多 agent 路由：agent 的邊界包含什麼、bindings 怎麼把頻道帳號對應到 agent、agentDir 不可共用的原因、OAuth 跨 agent 讀取行為、skills 的取代語意，以及 agent 建立 agent 的來源追蹤。"
draft: false
---

OpenClaw 可以在**同一個 Gateway 程序**裡跑多個彼此隔離的 agent，各自有 workspace、狀態目錄與 SQLite session 歷史，還能接多個頻道帳號（例如兩個 WhatsApp 號碼）。入站訊息透過 **binding** 路由到正確的 agent。

先把兩個詞釘住：**agent** 是完整的 per-persona 範圍；**binding** 是把一個頻道帳號（某個 Slack workspace、某支 WhatsApp 號碼）對應到其中一個 agent。

## 一個 agent 包含什麼

- **Workspace**：檔案、`AGENTS.md` / `SOUL.md` / `USER.md`、本機筆記、人格規則
- **狀態目錄（`agentDir`）**：auth profile、模型登錄、per-agent 設定
- **Session 儲存**：聊天歷史與路由狀態，位於 `~/.openclaw/agents/<agentId>/agent/openclaw-agent.sqlite`

路徑對照表：

| 什麼 | 預設 | 覆寫 |
|---|---|---|
| 設定 | `~/.openclaw/openclaw.json` | `OPENCLAW_CONFIG_PATH` |
| 狀態目錄 | `~/.openclaw` | `OPENCLAW_STATE_DIR` |
| 預設 agent 的 workspace | `<state>/workspace` | `agents.entries.*.workspace` → `agents.defaults.workspace` → `OPENCLAW_WORKSPACE_DIR` |
| 其他 agent 的 workspace | `<state>/workspace-<id>` | `agents.entries.*.workspace` |
| Agent 目錄 | `~/.openclaw/agents/<id>/agent` | `agents.entries.*.agentDir` |
| Session 與逐字稿 | `~/.openclaw/agents/<id>/agent/openclaw-agent.sqlite` | — |

**什麼都不設的話就是單一 agent**：`agentId` 預設 `main`，session key 是 `agent:main:<mainKey>`。

## 隔離沒有你以為的那麼絕對

這是這篇最該注意的兩條。

**一、workspace 是預設工作目錄，不是硬性沙箱。** 相對路徑會在 workspace 裡解析，但**絕對路徑可以碰到主機上的其他位置**，除非你啟用沙箱。所以「每個 agent 有自己的 workspace」不等於「agent 之間讀不到彼此的檔案」。

**二、OAuth 憑證會跨 agent 讀取。** 當次要 agent 的本機 OAuth 憑證過期、或它的更新失敗時，**OpenClaw 會回頭讀取預設／主 agent 同一個 profile id 的憑證**，並採用兩者中較新的那個 token——但不會把 refresh token 複製進次要 agent 的儲存區。

想要完全獨立的 OAuth 帳號，就**從那個 agent 自己登入**。要手動複製憑證的話，只能複製可攜的靜態 `api_key` 或 `token` profile——**OAuth 的更新素材預設不可攜**（`copyToAgents` 可以明確讓某個 profile 選擇加入）。

還有一條絕對不能違反的：**永遠不要在 agent 之間重用 `agentDir`**，那會造成 auth 與 session 狀態碰撞。

## 建立與綁定

```bash
openclaw agents add work
```

旗標：`--workspace`、`--model`、`--agent-dir`、`--bind <channel[:accountId]>`（可重複）、`--non-interactive`（需要 `--workspace`）。

然後加上 `bindings` 來路由入站訊息（精靈會問你要不要順便做），再驗證：

```bash
openclaw agents list --bindings
```

典型流程是：每個 agent 一組頻道帳號（Discord 一個 bot、Telegram 一個 BotFather bot、WhatsApp 一支號碼），在 `agents.entries` 加 agent、在 `channels.<channel>.accounts` 加帳號，用 `bindings` 把兩邊接起來，重啟後跑 `openclaw channels status --probe` 確認。

## Agent 可以要求建立 agent（但要人核准）

這是 3 月之後新增、也最值得注意的一段：**一個已設定的 agent 可以透過它的 `openclaw` 工具，要求 OpenClaw 建立另一個 agent。**

它沒有被做成靜默自我複製——系統 agent 會**把這個具型別的操作記錄下來、把提出請求的 agent id 顯示給操作者，而且只有在操作者核准之後才建立**。

OpenClaw 因此記錄每個 agent 的**來源（provenance）**：

- `operator` — 來自 CLI、onboarding 或 Gateway 請求
- `agent` — 系統 agent 代為請求（並保留提出請求的 agent id）
- `claw` — 由某個 Claw 安裝加入

查看目前的建立階層：

```bash
openclaw agents list --tree
```

已刪除的建立者仍保留為歷史來源；如果建立者已不在設定名單裡，它的子代會出現在樹根。

這個設計值得單獨想一下：**允許 agent 生 agent，但把「誰要求的」變成永久記錄，並且插入一道人類閘門**。這比單純禁止或單純允許都更務實。

## Skills 是取代，不是合併

多 agent 環境裡最容易踩的設定語意：

Skills 會從**每個 agent 的 workspace 加上共用根目錄**（例如 `~/.openclaw/skills`）載入，再依該 agent 的有效 skill allowlist 過濾。

- `agents.defaults.skills` 是共用基線
- `agents.entries.*.skills` 是**per-agent 的取代**——**明確的條目會取代預設值，不會合併**

如果你以為它是合併的，某個 agent 的 skill 清單就會比你預期的少一大截。

## Plugin 的儲存不會自動跟著拆

另一個容易誤會的：**加了第二個 agent，並不會自動把每個全域 plugin 的儲存都拆開**。plugin 自己的設定決定它怎麼存。

官方舉的例子是 Memory Wiki——預設用一個全域 vault，要讓客服 agent 與行銷 agent 的編譯知識分開，得明確設定：

```json5
{
  plugins: {
    entries: {
      "memory-wiki": {
        enabled: true,
        config: { vault: { scope: "agent", path: "~/.openclaw/wiki" } },
      },
    },
  },
}
```

設定的路徑是**父目錄**，OpenClaw 會接上正規化過的 agent id，產生 `~/.openclaw/wiki/support`、`~/.openclaw/wiki/marketing`。而且多 agent 環境下，**agent 範圍的 CLI 與 Gateway 操作會要求你明確指定是哪個 agent**。

## 跨 session 回想的安全版本

順帶一提一個相關工具：`sessions_history` 是**比較安全的跨 session 回想路徑**，因為它回傳的是**有界、經過遮蔽的視圖，不是原始逐字稿傾印**。

它會剝掉 thinking block 的簽章、工具結果的 payload 細節、鷹架標記、tool-call 的 XML 標籤（`<tool_call>`、`<function_call>` 及其複數／降級形式）與 MiniMax 的 tool-call XML，然後依位元組大小截斷與設上限。

## 整體來說

多 agent 的正確心智模型是：**它拆的是人格與狀態，不是作業系統層級的隔離。**

Workspace、auth、session、模型登錄都是分開的，這足以讓幾個人共用一個 Gateway 而各自保有自己的對話與人格。但絕對路徑仍然通向同一台主機、OAuth 憑證仍然會跨 agent 讀取、plugin 儲存預設仍然共用——**要真正的隔離，得往上找沙箱，或往外拆成不同的 Gateway。**

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。新增：**agent 可以透過 `openclaw` 工具要求建立另一個 agent**，以及隨之而來的來源追蹤（`operator`／`agent`／`claw`）、`openclaw agents list --tree` 與操作者核准閘門；**次要 agent 的 OAuth 憑證過期時會讀取主 agent 的同名 profile** 並採用較新的 token（refresh 素材預設不可攜，`copyToAgents` 可選擇加入）；**workspace 只是預設 cwd 而非硬性沙箱**，絕對路徑仍可觸及主機其他位置；skills 的 per-agent 條目是**取代而非合併**；plugin 儲存不會因為多 agent 自動拆開（以 Memory Wiki 的 `vault.scope: "agent"` 為例）；`sessions_history` 回傳遮蔽過的有界視圖；以及 session 儲存已改為每個 agent 的 `openclaw-agent.sqlite`。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Multi-agent routing](https://docs.openclaw.ai/concepts/multi-agent) — agent 邊界、路徑、來源追蹤與 per-agent vault
- [Agent bindings](https://docs.openclaw.ai/concepts/agent-bindings) — binding 的設定與範例
- [Skills: per-agent vs shared](https://docs.openclaw.ai/tools/skills) — skills 的取代語意與 allowlist
- [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing) — workspace 之外的真正隔離
- [Session management](https://docs.openclaw.ai/concepts/session) — session 路由與範圍
