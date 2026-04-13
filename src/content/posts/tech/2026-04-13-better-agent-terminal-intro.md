---
title: "Better Agent Terminal：把多個專案的 Terminal 和 Claude Code Agent 收進同一個視窗"
date: 2026-04-13
category: tech
tags: [claude-code, electron, terminal, developer-tools, agent, xterm, tony1223]
lang: zh-TW
tldr: "Better Agent Terminal (BAT) 是一個 Electron 桌面 app，把多個專案的 workspace、terminal、以及 Claude Code Agent 整合到同一個視窗，解決開一堆 iTerm 分頁、Agent 沒有好 GUI 容器的日常痛點。MIT License，macOS / Windows / Linux 都能裝。"
description: "Better Agent Terminal 是 tony1223 開發的跨平台桌面工具，用 Electron + React 把 xterm.js、Git 瀏覽器、snippet 管理器，和 Claude Code Agent 包在同一個 app 裡。本文介紹它的設計思路、核心功能和適用情境。"
draft: false
---

同時開著三四個專案的時候，iTerm / Windows Terminal 的分頁很快就會爆炸：每個專案自己一堆 tab，切來切去還要記哪個 window 是哪個 repo。再加上最近 Claude Code 變成日常工具，Agent 基本上又佔掉一個獨立終端機，桌面會更亂。

[Better Agent Terminal](https://github.com/tony1223/better-agent-terminal)（以下簡稱 BAT）是 tony1223 做的一個 Electron 桌面 app，想法很直接：**把 workspace、terminal、Claude Code Agent 收進同一個視窗，讓切換專案就像切換瀏覽器分頁一樣自然**。

## 它想解決什麼

一般工程師的日常大概會長這樣：

- VS Code 一個 window、iTerm 一個 window，每個專案至少兩三個 tab（server、test、git）
- 想用 Claude Code 跑 agent，還要再開一個 tab，agent 的對話歷史跟 terminal 混在一起
- 切專案要切 cwd、切 env、切 node 版本
- Agent 的 thinking block、token 用量、權限提示都在純文字介面裡，看起來很吃力

BAT 的設計假設是：**terminal 是工作單位，但「專案 (workspace)」才是你真正關心的東西**。所以它把 workspace 當一等公民，每個 workspace 底下可以有多個 terminal、自己的環境變數、自己的 profile（本地 / 遠端），切 workspace 就等於把整組上下文切過去。

## Workspace 模型

Workspace 是 BAT 最核心的概念。幾個關鍵設計：

- **按資料夾組織**：一個 workspace 對應一個專案資料夾，設定好就不用再每次 `cd`。
- **群組與篩選**：workspace 多了可以分群組，dropdown 篩選，不會一路滾到底。
- **拖放排序**：把最常用的 workspace 拉到最上面。
- **獨立環境變數**：每個 workspace 可以設自己的 env，不會互相污染。
- **Profile 切換**：同一個 workspace 可以有「本地」和「遠端」兩套設定，切 profile 就能跳到 SSH 的機器上跑。
- **可分離視窗**：某個 workspace 可以獨立成一個 window（雙螢幕常用），app 重啟後會自動再附著回來。

這在多專案併行、或是同時要 maintain 本地開發 + production hotfix 的情境下特別實用。

## Terminal 與內建工具

Terminal 部分是標準的 `xterm.js + node-pty`，Unicode / CJK 支援完整。但 BAT 把 terminal 當成 workspace 裡的一個 panel，旁邊還塞了幾個開發常用的小工具：

- **分割面板佈局**：主區 70%、縮圖區 30%，縮圖區可以同時看多個 terminal 的尾端輸出。
- **檔案瀏覽器**：點檔案直接用 highlight.js 預覽，不用為了看一眼程式碼切到編輯器。
- **Git 整合**：commit log、diff、branch 列表，commit 可以一鍵跳到 GitHub 對應的頁面。
- **Snippet 管理器**：SQLite 存，可以分類、收藏常用指令或 prompt，不用每次都去翻 `.zsh_history` 或筆記。

這幾個功能單獨看都不稀奇，但放在「同一個視窗、隨 workspace 切換」的脈絡下，取代了 iTerm + GitHub Desktop + 某個 snippet app 的組合，摩擦明顯變小。

## Claude Code Agent 整合

這是 BAT 跟其他 terminal 工具最不一樣的地方。它把 `@anthropic-ai/claude-agent-sdk` 直接包進 app 裡，不需要另外開 terminal 跑 `claude`。

具體做了這些事：

- **訊息串流顯示**：不是純文字倒出來，而是結構化渲染。
- **Extended thinking 可收折**：Claude 在 think 的時候那一大段推理可以收起來，介面不會被洗版。
- **工具權限可視化**：每個工具呼叫都可以單獨 approve，也可以設定 auto-approve 模式。比純 CLI 的「y/n」清楚很多。
- **Session 持久化**：關掉 app 再開，可以 resume 之前的對話。
- **Statusline**：即時顯示這個 session 用了多少 token、花了多少錢。這個資訊在原生 CLI 要自己算。
- **帳號切換**：`/login`、`/logout`、`/whoami` 指令直接可用，多帳號（個人 / 公司）不用改環境變數。
- **圖片附加**：每則訊息最多 5 張圖，適合丟截圖給 agent 分析。
- **可點擊的檔案路徑**：Agent 輸出的 `src/foo.ts:42` 可以點開，modal 預覽。

如果你之前覺得 Claude Code CLI 夠用，但每次 agent 吐一大段 thinking 都要往上捲很久，或是常常忘記自己在哪個帳號底下，BAT 的 GUI 就是為這些痛點而生的。

## 實驗性的 Remote Access

BAT 還內建了一個實驗性的 WebSocket server：開啟後會產生連線 token（配 QR Code），可以讓另一台 BAT 或手機連進來控制。

官方建議搭配 **Tailscale** 來做跨網路連線——不用開 port forwarding，靠 Tailscale 的 WireGuard 網段做 peer-to-peer，安全性和設定成本都比自己弄公網反向代理好很多。

這個功能目前還是實驗性的，適合「在外面想 debug 家裡那台 build server」之類的情境，正式的 production remote pairing 還是建議走其他更成熟的方案。

## 技術棧

整個 app 走的是很典型的 Electron + React 組合：

- **Electron 28** + **React 18** + **TypeScript**
- Terminal：`xterm.js` + `node-pty`
- Agent：`@anthropic-ai/claude-agent-sdk`
- 儲存：`better-sqlite3`（snippet、session）
- Remote：`ws` + `qrcode`
- 預覽高亮：`highlight.js`
- 打包：`Vite 5` + `electron-builder`

```
┌──────────────────────── BAT Window ────────────────────────┐
│ ┌─ Workspaces ─┐ ┌───────── Active Workspace ─────────────┐ │
│ │ ▸ project-a  │ │ ┌── Terminal (70%) ──┐ ┌ Thumbs (30%) ┐│ │
│ │ ▸ project-b  │ │ │ $ pnpm dev         │ │ term-2 tail  ││ │
│ │ ▾ project-c  │ │ │ ...                │ │ term-3 tail  ││ │
│ │   ├ local    │ │ └────────────────────┘ └──────────────┘│ │
│ │   └ remote   │ │ ┌── Agent Panel (Shift+Tab) ──────────┐│ │
│ └──────────────┘ │ │ Claude Code · tokens · $0.23        ││ │
│                  │ │ [thinking ▸] [tool approve]         ││ │
│                  │ └─────────────────────────────────────┘│ │
│                  └────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

## 安裝

幾種方式都支援：

```bash
# macOS（推薦）
brew tap tonyq-org/tap && brew install --cask better-agent-terminal

# 一鍵安裝腳本（macOS / Linux）
curl -fsSL https://raw.githubusercontent.com/tony1223/better-agent-terminal/main/install.sh | bash
```

Windows 走 NSIS installer、Linux 有 AppImage，Release 頁都抓得到。要自己 build 也行，需要 Node.js 18+。

## 快捷鍵值得記的幾個

| 快捷鍵 | 動作 |
|--------|------|
| `Ctrl+`` | 切換 agent / terminal |
| `Shift+Tab` | 在 terminal 和 agent 模式間切換 |
| `Ctrl+P` | 檔案選擇器 |
| `Ctrl+↑` / `Ctrl+↓` | 上 / 下一個 workspace |

鍵盤為主的操作流程很接近 VS Code，熟了之後幾乎不用碰滑鼠。

## 適合誰

- **同時 maintain 多個專案的工程師**：workspace 模型和分頁爆炸的痛點匹配度很高。
- **重度 Claude Code 使用者**：想要 GUI 裡看 thinking、看 token、管理多帳號。
- **需要本地 + 遠端混合開發的人**：profile 切換 + Tailscale remote 的組合很實用。
- **想要「一個 app 搞定多數終端機工作」的人**：內建 Git、檔案預覽、snippet，減少 context switch。

不太適合：

- **純 CLI 原教旨主義者**：Electron app 不是你的菜。
- **不用 Claude Code 的人**：Agent 整合是 BAT 最大賣點，拿掉這塊它相對於 [Warp](https://www.warp.dev/)、[Wave](https://www.waveterm.dev/) 這類現代 terminal 沒有決定性優勢。
- **對 Electron 的記憶體開銷敏感的人**：這是 Electron app 的老問題，BAT 逃不掉。

## 整體來說

BAT 的核心取捨很清楚：**用 Electron 的成本（記憶體、安裝體積）換取 workspace 抽象 + Claude Code Agent 原生 GUI 整合**。如果你剛好卡在「iTerm 分頁爆炸 + Claude Code CLI 看訊息吃力」這個交集上，它幾乎是目前市面上最對症下藥的工具。

而且是 MIT License、原始碼公開，不喜歡某個行為直接 fork 改。對 Claude Code 深度使用者來說，裝起來試一週很划算。

## 參考資料

- [better-agent-terminal — GitHub Repo](https://github.com/tony1223/better-agent-terminal)
- [Claude Agent SDK — Anthropic Docs](https://docs.claude.com/en/api/agent-sdk/overview)
- [xterm.js](https://xtermjs.org/)
- [node-pty](https://github.com/microsoft/node-pty)
- [Electron](https://www.electronjs.org/)
- [Tailscale](https://tailscale.com/)
