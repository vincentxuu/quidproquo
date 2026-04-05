---
title: "clawhip：讓多 Agent 開發不再失控的事件通知路由器"
date: 2026-04-05
category: ai
tags: [agent-cli, clawhip, notification, discord, slack, tmux, rust, multi-agent, ultraworkers]
lang: zh-TW
tldr: "clawhip 是一個 Rust 寫的 daemon，專門把 AI coding agent 的事件（commit、PR、session 狀態）路由到 Discord / Slack，解決多 Agent 並行時「不知道誰在做什麼」的可觀測性問題。"
description: "介紹 clawhip 的事件管線架構、路由規則、tmux 監控機制，以及它在 UltraWorkers 多 Agent 生態系中扮演的通知與可觀測性角色。"
draft: false
---

當你同時跑 3 個 AI coding agent，每個在不同的 tmux session 裡改不同的檔案，你怎麼知道哪個完成了、哪個卡住了、哪個剛開了一個 PR？clawhip 就是為了回答這個問題而存在的。

## 解決什麼問題

多 Agent 並行開發有一個被低估的痛點：**可觀測性**。Agent 自己不會主動告訴你進度，你要不就開一堆終端視窗盯著看，要不就等全部跑完再去檢查。

更麻煩的是，如果讓 Agent 自己去呼叫 Discord API 發通知，會污染它的 context window——模型的注意力被 API 回應佔用，影響正事的品質。

clawhip 的解法是把**通知邏輯抽離 Agent**，做成一個獨立的 daemon：

```
Agent 發出事件 → clawhip daemon 接收 → 路由 + 格式化 → 發送到 Discord / Slack
```

Agent 只需要發一個輕量的 HTTP POST，剩下的事情 clawhip 全包。

## 架構設計

clawhip 是一個 Rust 寫的 daemon，預設監聽 `http://127.0.0.1:25294`，內部採用 typed event pipeline：

```
[CLI / webhook / git / GitHub / tmux]
  → sources
  → mpsc queue
  → dispatcher
  → router → renderer → Discord/Slack sink
```

### 事件家族

| 事件前綴 | 來源 |
|----------|------|
| `github.*` | GitHub webhook（issue、PR、review） |
| `git.*` | 本地 Git 操作（commit、push） |
| `agent.*` | Agent 生命週期（啟動、完成、失敗） |
| `session.*` | OMC / OMX 的 session 事件 |
| `tmux.*` | tmux session 狀態變化 |

### 路由規則

路由設定在 `~/.clawhip/config.toml`，支援 glob pattern 匹配、payload 過濾、動態 token 展開：

```toml
[[routes]]
events = ["github.pr.*"]
channel = "123456789"
format = "compact"
filters = { repo = "my-project" }
mentions = ["@dev-team"]
```

可以針對不同 repo、不同分支、不同 Agent 設定不同的通知頻道和格式——不需要所有事件都轟炸同一個頻道。

### 多 Sink 支援

| Sink | 方式 |
|------|------|
| Discord Bot | REST API（需要 bot token） |
| Discord Webhook | 無需 bot，直接 webhook URL |
| Slack Webhook | Incoming webhook |

## tmux 監控

clawhip 不只被動接收事件，還能**主動監控 tmux session**：

```bash
# 啟動新 session 並監控
clawhip tmux new -s issue-123 --channel <id> --keywords "error,complete" -- 'omx --madmax'

# 監控既有 session
clawhip tmux watch -s my-session --channel <id> --keywords "error,PR created"

# 列出所有監控中的 session
clawhip tmux list
```

它會掃描 tmux pane 的輸出，偵測到關鍵字就發通知。同時有 stale session 偵測——如果某個 session 太久沒有輸出，會發警告提醒你去看。

這對多 Agent 開發特別有用：你不需要開 5 個終端視窗盯著看，clawhip 會在 Discord 告訴你哪個 session 出了什麼事。

## 與 OMC / OMX 的整合

clawhip 和 oh-my-claudecode（OMC）、oh-my-codex（OMX）有原生整合。它定義了一組標準化的 `session.*` 事件契約：

| 事件 | 觸發時機 |
|------|----------|
| `session.started` | Agent session 啟動 |
| `session.finished` | 任務完成 |
| `session.failed` | 執行失敗 |
| `session.pr-created` | 開了新 PR |

OMC / OMX 透過內建的 hook bridge 把事件推給 clawhip：

```bash
# OMX 的 hook 入口
clawhip omx hook <event-payload>

# 或直接打 API
POST /api/omx/hook
```

這意味著如果你已經在用 OMC 或 OMX 做多 Agent 協調，加上 clawhip 就能自動獲得完整的 Discord / Slack 通知，不需要自己寫任何 webhook 邏輯。

## 其他功能

### 批次發送

可設定 burst batching 和 CI batch summary window，避免短時間內大量事件轟炸頻道：

```toml
[dispatch]
burst_window_ms = 2000
ci_summary_window_ms = 30000
```

### Agent 記憶體管理

```bash
clawhip memory init    # 初始化結構化記憶體
clawhip memory status  # 檢查記憶體狀態
```

使用 `MEMORY.md` + `memory/` shard 模式，讓 Agent 的記憶可以跨 session 持久化。

### Cron 排程

搭配系統 cron 可以做定期的開發頻道追蹤：

```bash
# 每 30 分鐘發送專案狀態摘要
*/30 * * * * clawhip send --channel <id> --message "$(git log --oneline -5)"
```

## 安裝

```bash
# 預編譯 binary（推薦，不需要 Rust）
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/Yeachan-Heo/clawhip/releases/latest/download/clawhip-installer.sh | sh

# 或從 crates.io
cargo install clawhip

# 啟動
clawhip          # 啟動 daemon
clawhip status   # 檢查健康狀態
```

支援 systemd 整合，可以設為開機自啟。預編譯 binary 涵蓋 x86_64 / aarch64 的 Linux 和 macOS。

## 專案現況

| 指標 | 數值 |
|------|------|
| GitHub Stars | ~543 |
| Forks | ~101 |
| 語言 | Rust |
| 最新版本 | v0.4.0 |
| 發佈平台 | crates.io |
| 維護者 | Yeachan Heo |

相比 OMC 和 OMX 的萬級 star 數，clawhip 的 543 stars 看起來不多。但這符合它的定位——它是基礎設施工具，不是面向終端使用者的產品。用它的人是已經在跑多 Agent 工作流、需要系統化通知的開發者。

## 在 UltraWorkers 生態系中的位置

```
oh-my-claudecode (OMC)  ─┐
oh-my-codex (OMX)        ├── Agent 協調層
oh-my-openagent (OmO)   ─┘
         │
         │ session 事件
         ▼
      clawhip ──── 通知與可觀測性層
         │
         ▼
    Discord / Slack
```

OMC、OMX、OmO 負責讓 Agent 做事，clawhip 負責讓人知道 Agent 在做什麼。這個分工讓每個工具都能專注在自己的職責上，而不是每個 Agent 框架都要自己重新實作一套通知系統。

## 參考資料

- [clawhip GitHub Repository](https://github.com/Yeachan-Heo/clawhip)
- [clawhip on crates.io](https://crates.io/crates/clawhip)
- [oh-my-codex 工作流增強層介紹](/posts/ai/2026-04-05-oh-my-codex-workflow-layer/)
- [Claw Code 開源 Rust 版 Claude Code 介紹](/posts/ai/2026-04-05-claw-code-rust-claude-code-reimplementation/)
