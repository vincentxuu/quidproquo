---
title: "工具推薦｜agent-manager — 把一堆 terminal tab 裡的 coding agent 收進一個 tmux TUI"
date: 2026-08-26
category: daily
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "agent-manager 用一個 Go 寫的 tmux TUI 統一管理 Claude Code、Codex、OpenCode 等多個 coding agent session，一鍵回覆、一鍵開 worktree、一鍵看整檔 diff 並把行內註解送回 agent"
tldr: "agent-manager 是一個包在 tmux 上的終端機 UI，同時追蹤多個 AI coding agent session 的狀態。安裝：brew install yoanwai/tap/agent-manager。解決了同時開好幾個 agent 時要在 terminal tab 間找哪個卡住、哪個做完的問題。"
series:
  name: "AI Tool of the Day"
  order: 11
---

> 🌏 [English version](/en/posts/daily/2026-08-26-tool-agent-manager-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | agent-manager |
| 類型 | CLI / 終端機 UI（多 coding agent session 管理器，內建 tmux） |
| GitHub | [YoanWai/agent-manager](https://github.com/YoanWai/agent-manager) |
| Stars | 345 |
| 語言 | Go（Bubble Tea TUI，架構在 tmux 之上） |
| 授權 | Apache-2.0 |
| 安裝 | `brew install yoanwai/tap/agent-manager` |

## 解決什麼問題

你是否同時開了三、四個 terminal tab，每個都跑著一個 Claude Code 或 Codex session，然後每隔幾分鐘就要一個一個切過去看「這個做完了嗎」「那個是不是卡在問我問題」？tab 一多，狀態就全靠記憶,而 agent 生成的 diff 也只能在自己那個 pane 裡逐行看,想留評論還得手動複製貼上再重講一次。

agent-manager 把每個 agent session 包成一個 tmux session（放在獨立的 `agentmgr` tmux server 上,不會跟你自己開的 tmux 混在一起）,然後在單一畫面上用一棵可摺疊的專案樹列出所有 session 的即時狀態。`space` 鍵可以在不 attach 的情況下直接把一句話送進選中的 session；同一顆鍵按在群組列上,就是「用這句話生一個新 agent」,而且輸入框按下 enter 之後不會關閉,可以連續分派好幾個任務給不同 agent。真正的殺手級功能是 `ctrl+r` 的 review mode：整檔 diff、語法高亮、改動行標色,在上面按 `c` 留行內註解,按 `C` 就把所有註解打包成一則訊息送回該 agent 的 pane,agent 立刻開始處理,畫面同時即時更新。它同時註冊了自己的 MCP server 到每個啟動的 session 裡,讓 agent 本身也能呼叫 `create_session`、`send_session` 去開子任務、傳訊息給另一個 agent。

適合場景：習慣用 tmux、同時跑兩個以上 coding agent CLI（Claude Code、Codex、OpenCode、Gemini CLI 等）處理平行任務,想要一個統一的「誰做完了、誰卡住了」視圖,而且會頻繁做 diff review 的開發者。目前僅支援 macOS / Linux,Windows 需要 WSL2。

## 快速上手

### 安裝

```bash
# Homebrew（macOS / Linux，會順便裝好 tmux）
brew install yoanwai/tap/agent-manager

# 或用安裝腳本（下載對應平台的 release 並驗證 checksum）
curl -fsSL https://raw.githubusercontent.com/YoanWai/agent-manager/main/install.sh | sh
```

依賴：tmux 3.1+、git。Homebrew 安裝會自動補齊；安裝腳本會偵測系統的套件管理器（apt/dnf/pacman/zypper/apk）並提示安裝指令。

### 基本用法

```bash
# 啟動管理介面
agent-manager
```

| 按鍵 | 動作 |
|---|---|
| `n` | 開新 session（選 agent 工具、目錄、群組，可帶起始 prompt） |
| `space` | 快速 prompt：回覆選中的 session，或在群組上生一個新 agent |
| `ctrl+r` | 進入該 session 的整檔 diff review；`c` 留行內註解，`C` 把註解送回 agent |
| `x` / `v` | 砍掉 session 釋放資源 / 用同一份對話復活 |
| `alt+w` | 在快速 prompt 中順便把這個 agent 開進一個新的 git worktree |
| `?` | 完整鍵位表，可搜尋 |

### 進階用法

每個 session 啟動時都會拿到 agent-manager 自帶的 MCP tools，agent 自己就能操作整個工作區：

```
create_session   # 用一個任務名稱開另一個 agent，需要時自動開 worktree
send_session     # 排一則訊息給另一個 agent，等它閒下來就送達
create_terminal  # 在自己或某個群組底下開一個使用者看得到的 shell
review           # 宣告要 review 的 repo / merge base / diff 範圍
```

例如某個 agent 判斷有個子任務該交給另一個 agent 處理，可以直接呼叫 `create_session` 起一個新 session 並帶入任務描述，不需要人手動去按 `n`。

## 與現有工具的比較

同類「多 agent CLI 協調工具」目前最常被拿來比較的三個是 agent-manager、Pane、Golutra；agent-manager 是其中架構最輕、直接長在 tmux 上的一個。

| | agent-manager | Pane | Golutra | 純 tmux |
|---|---|---|---|---|
| 架構 | Go TUI + tmux | Electron 桌面 App | Tauri（Rust + Vue3）桌面 App | tmux 原生 |
| Session 隔離 | tmux session | Git worktree（自動建立） | Terminal pane | 手動 |
| 整檔 diff + 行內註解回傳 agent | ✅ | ✅（GUI） | 需靠整合 | ❌ |
| Agent 透過 MCP 操作管理器本身 | ✅（spawn/message/review） | 有自己的 CLI（runpane） | 轉發 agent 自己的 | ❌ |
| 跨平台 | macOS / Linux（Windows 需 WSL2） | macOS / Windows / Linux | macOS / Windows / Linux | 依系統 tmux |
| 遠端存取 | tmux detach/attach | 自架 daemon + 手機瀏覽器 | 規劃中 | tmux detach/attach |
| GitHub Stars（2026-08） | 345 | 339 | 3,800 | — |

## 注意事項

- **官方自己列出還沒做的功能**：cost tracking（agent 花了多少 token/錢）和滑鼠導覽目前都還沒有，如果這兩項是你的硬需求，官方文件直接建議去看 compare 頁上的其他工具。
- **Windows 只能靠 WSL2**：agent-manager 建立在 tmux 之上，原生 Windows 不支援，要用得先進 WSL2 環境。
- **還在活躍變動中**：GitHub 上有 24 個 open issue，`n`/`enter`/`←`/`→` 這組鍵位官方標註「in beta」，可以在 Settings 裡關掉，換版本時留意鍵位是否有調整。
- **agent 自主權變大**：MCP tools 讓 agent 能自己 spawn 新 session、送訊息給別的 agent，等於把「開新任務」的權限也下放給了 agent 本身，多 agent 協作時要留意這點會不會超出你原本預期的範圍。

## 今日收穫

過去談「AI coding agent 的多開」大多想到的是 agent 框架或 SDK（LangGraph、CrewAI 這類），但實務上真正卡住效率的其實是更底層的一層——「怎麼同時盯著好幾個已經在跑的 agent CLI，知道誰卡住、誰做完，並且把 review 意見送回去」。agent-manager 這類工具代表的是一個獨立於框架層之外、專門解決「工作區管理」的新分類，而不是又一個 agent 開發框架。

## 參考資料

- [YoanWai/agent-manager GitHub repo](https://github.com/YoanWai/agent-manager)：README、鍵位表、MCP tools 說明、授權（Apache-2.0）、stars/forks 數字均出自官方 repo。
- [agent-manager.dev 官方文件](https://agent-manager.dev/docs/install/)：安裝方式、依賴（tmux 3.1+、git）、功能說明。
- [agent-manager.dev 官方比較頁](https://agent-manager.dev/compare/)：與 herdr、Agent of Empires、agent-deck、Vibe Kanban、claude-squad、純 tmux 的功能對照表。
- [Multi-Agent CLI Orchestration Tools Compared: Agent-Manager, Pane, and Golutra in 2026 — Developers Digest](https://www.developersdigest.tech/blog/multi-agent-cli-orchestration-tools-compared-2026)：三個多 agent CLI 協調工具的架構、stars、授權對照（2026-07-30 發布）。
