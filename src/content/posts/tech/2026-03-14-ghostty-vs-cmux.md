---
title: "Ghostty 與 cmux：現代終端機的選擇指南"
date: 2026-03-14
category: tech
tags: [ghostty, cmux, terminal, macos, ai-agent]
lang: zh-TW
tldr: "Ghostty 是快速、原生的通用終端機；cmux 是基於 Ghostty、專為 AI coding agents 設計的終端機。不是競品，是不同層級的工具。"
description: "介紹 Ghostty 終端機模擬器與 cmux 的核心特色，並比較兩者適合的使用情境。"
draft: false
---

如果你最近在找 iTerm2 的替代品，Ghostty 幾乎是標準答案。但如果你同時跑多個 AI coding agents，cmux 更值得看一眼。這篇整理兩者的設計邏輯、功能差異，以及怎麼選。

## Ghostty

Ghostty 由 HashiCorp 創辦人 Mitchell Hashimoto 開發，2024 年底正式公開後迅速在開發者社群引起關注。它的定位很明確：同時做到快速、功能完整、原生 UI，而不是三選二。

**設計哲學**

多數終端機在速度、功能、原生體驗之間有所取捨。Ghostty 的做法是把核心抽出來做成 `libghostty`（一個 C-compatible 函式庫），macOS 用 Swift/AppKit 包一層，Linux 用 GTK，渲染層走 Metal（macOS）或 OpenGL（Linux）。這讓它既能做到 GPU 加速，又保有真正的原生 UI，而不是像 Electron 系終端機那樣用 Web 技術模擬原生感。

**核心功能**

- **GPU 加速渲染**：macOS 上唯一同時支援 Metal 和連字（ligatures）的終端機，iTerm2 開啟 ligatures 後會退回 CPU 渲染
- **零設定啟動**：預設值就夠用，連 Nerd Fonts 都內建支援，裝完即用
- **原生 Tab 與分割視窗**：不是自己畫的 UI，是系統原生元件
- **macOS 深度整合**：Quick Look、Force Touch、Secure Input API、下拉式終端機（Quake mode）
- **豐富主題**：內建數百個主題，支援系統深色/淺色自動切換
- **libghostty**：開放為嵌入式函式庫，讓其他終端機工具可以站在這個核心上蓋功能

**限制**

macOS 沒有系統層級的「預設終端機」設定，Ghostty 目前也沒有內建「設為預設」的選項（[open feature request](https://github.com/ghostty-org/ghostty/discussions/7762)）。如果要讓 `.command`、`.tool` 等腳本預設用 Ghostty 開啟，需要手動在 Finder 設定檔案關聯。

```bash
brew install --cask ghostty
```

## cmux

cmux 由 [manaflow-ai](https://github.com/manaflow-ai/cmux) 開發，定位是「給 AI coding agents 用的終端機」。它底層直接用 libghostty，同樣 Swift + AppKit，所以渲染效能和 Ghostty 一致，但在上層加了一整套 agent workflow 功能。

**設計哲學**

cmux 的自我定位是 primitive，不是 solution。它提供終端機、瀏覽器、通知、workspace、分割視窗、CLI 控制介面這些基本單元，但不強迫你用特定的工作流。用什麼 agent、怎麼組合，由你決定。

**核心功能**

- **垂直側邊欄 Tab**：每個 workspace 即時顯示 git branch、PR 狀態、監聽中的 port、最新通知，一眼判斷哪個 agent 在忙什麼
- **智慧通知系統**：支援 OSC 9/99/777 terminal sequence；agent 等待輸入時，對應的 pane 會亮藍圈、tab 高亮，`Cmd+Shift+U` 跳到最新未讀
- **內嵌可腳本化瀏覽器**：Agent 可直接截圖 DOM、取元素 ref、點擊、填表單、執行 JS，瀏覽器 pane 可以貼著終端機 pane 開，讓 Claude Code 直接操作你的 dev server
- **Socket 控制 API**：`cmux` CLI 送 JSON 訊息到 Unix socket，main app 監聽並更新 UI；所有操作都可程式化：建 workspace、切 tab、送鍵盤事件、開 URL
- **AI agent 整合**：原生支援 Claude Code、Codex、OpenCode、Gemini CLI、Aider、Kiro

```bash
brew tap manaflow-ai/cmux && brew install --cask cmux
```

## 整體架構

```
┌─────────────────────────────────────┐
│              cmux                   │
│  ┌──────────┐  ┌───────────────┐    │
│  │ 側邊欄   │  │  Terminal     │    │
│  │ Tab list │  │  (libghostty) │    │
│  │ + 通知   │  ├───────────────┤    │
│  └──────────┘  │  Browser      │    │
│                │  (scriptable) │    │
│                └───────────────┘    │
│         Socket API / CLI            │
└─────────────────────────────────────┘

         ↑ 站在這個核心上

┌─────────────────────────────────────┐
│           libghostty                │
│     (GPU 渲染 / terminal core)      │
└─────────────────────────────────────┘
```

## 整體來說

| | Ghostty | cmux |
|--|---------|------|
| **平台** | macOS + Linux | macOS only |
| **定位** | 通用終端機 | AI agent 工作站 |
| **底層** | 自研 libghostty | 基於 libghostty |
| **通知系統** | 無 | 有（OSC + CLI hook）|
| **內嵌瀏覽器** | 無 | 有（可腳本化）|
| **可程式化 API** | 有限 | 完整 CLI + Socket |
| **成熟度** | 穩定（v1.2） | 快速演進中 |
| **授權** | MIT | AGPL-3.0 |

兩者不是競品，cmux 本身就是站在 Ghostty 肩膀上的產品。

**選 Ghostty**：你要的是一個快速、無設定成本、跨平台的日常終端機，iTerm2 用膩了想換。

**選 cmux**：你同時跑多個 AI agents（Claude Code、Codex 等），需要知道哪個 agent 在等你、需要讓 agent 直接操作瀏覽器、需要腳本化控制整個工作環境。

---

## 來源

- [Ghostty 官網](https://ghostty.org/)
- [Ghostty - About](https://ghostty.org/docs/about)
- [Ghostty - Features](https://ghostty.org/docs/features)
- [GitHub - ghostty-org/ghostty](https://github.com/ghostty-org/ghostty)
- [How to make Ghostty the default terminal? (GitHub Discussion)](https://github.com/ghostty-org/ghostty/discussions/7364)
- [Add Option to Set Ghostty as Default Terminal on macOS (GitHub Discussion)](https://github.com/ghostty-org/ghostty/discussions/7762)
- [GitHub - manaflow-ai/cmux](https://github.com/manaflow-ai/cmux)
- [cmux 官網](https://www.cmux.dev/)
- [cmux: Native macOS Terminal for AI Coding Agents - Better Stack](https://betterstack.com/community/guides/ai/cmux-terminal/)
