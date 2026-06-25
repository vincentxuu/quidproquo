---
title: "Warp：從現代終端機到 Agentic Development Environment"
date: 2026-05-03
category: tech
tags: [warp, terminal, ai, agent, developer-tools, open-source]
lang: zh-TW
tldr: "Warp 從一個用 Rust 打造的現代終端機，演化成整合 AI Agent 的開發環境（ADE），2026 年 4 月開源，目前擁有 70 萬開發者用戶。"
description: "Warp 不只是終端機——它是一套以 AI Agent 為核心的開發環境。本文介紹 Warp 的核心設計、主要功能、與傳統終端機的差異，以及它如何從工具變成平台。"
draft: false
---

🌏 [English version](/posts/tech/2026-05-03-warp-agentic-development-environment-en)

如果你最近幾年有在 Twitter / X 上看到開發者曬終端機截圖，十之八九是 Warp。但 Warp 不只是個漂亮的終端機——2025 年底它發布了 Warp 2.0，正式轉型為 **Agentic Development Environment（ADE）**，把 AI Agent 直接嵌進開發工作流裡。2026 年 4 月，Warp 更宣布以 AGPL 授權開源，由 OpenAI 擔任創始贊助商。

## 為什麼不用 iTerm2 / tmux 就好

傳統終端機的設計停在 1970 年代：文字流進流出，每一行都是平等的字元串。這套模型對人腦的認知負擔其實相當高——你要自己記住「哪一段輸出對應哪個命令」、手動捲動找錯誤、無法直接複製單一命令的結果。

Warp 的核心重新設計了這個假設。它把命令執行的輸入與輸出包成一個叫 **Block** 的單位，每個 Block 是獨立可操作的物件：可以單獨複製、分享、搜尋、或傳給 AI。這個看似小的改變，讓終端機從「文字流」變成「結構化工作歷史」。

Warp 用 **Rust** 撰寫，以 GPU 渲染介面，所以捲動和渲染速度遠快於大多數 Electron 應用程式，也比 iTerm2 的 CPU 渲染更流暢。

## 核心功能

### Blocks（結構化輸出）

每次你執行命令，輸入和輸出會被包成一個 Block。你可以：

- 點選任意 Block，直接複製整段輸出
- 把 Block 分享成連結（Warp Drive 功能）
- 右鍵把 Block 送給 AI Agent 分析

### AI Agent（Warp Agents）

Warp 內建 AI Agent，不只是補全命令而已。Agent 可以：

- 根據自然語言描述生成並執行多步驟 shell 命令
- 在執行前解釋每個步驟在做什麼
- 讀取錯誤輸出，自動提出修正方案
- 支援多個模型：Claude（Opus/Sonnet）、GPT-5、Gemini、Qwen、Kimi 等，可自由切換

在 SWE-bench Verified 基準測試上，Warp Agent 拿到 **75.8%**，是目前公開數字中最高的終端機整合方案之一。

### Warp Drive（團隊協作）

Warp Drive 是 Warp 的雲端協作層：

- **Workflows**：把常用的命令序列存成可分享的工作流，類似 Runbook 但住在終端機裡
- **Notebooks**：在終端機裡寫文件，混搭 markdown 和可執行命令
- **Session 分享**：把當前 session 的歷史分享給隊友，帶完整的命令輸出脈絡

### 編輯器體驗

Warp 的命令輸入欄支援：

- 語法高亮（按語言）
- 多行編輯（不需要 `\` 換行 hack）
- Vim / Emacs 鍵位
- 自動補全（整合 shell history + AI 建議）

### 跨平台

Warp 支援 macOS、Linux（.deb / .rpm / AppImage）、Windows 10/11，都是原生應用程式，不是 Electron 包裝。

## Warp 2.0：ADE 的轉型

2025 年底的 Warp 2.0 是一次定位轉移。Warp 不再只是「更好的終端機」，而是想成為開發者與 AI Agent 協作的主要介面。

具體改變：

- **Warp Code**：從 prompt 到 production 的完整編碼流程，在終端機內完成
- **Cloud Agents**：背景執行任務，不需要佔用你的 terminal session
- **Oz**：Warp 自己的 cloud agent 編排平台，管理多個 agent 平行執行任務

這個轉型的背景是：AI Agent 寫程式已經夠好了，瓶頸變成「要怎麼管理 agent、驗證結果、整合進現有工作流」。Warp 的賭注是終端機是最自然的 agent 控制介面。

## 2026 年 4 月：開源

Warp 宣布以 **AGPL** 授權開源客戶端，原始碼在 [github.com/warpdotdev/warp](https://github.com/warpdotdev/warp)。

主要動機是加速開發：讓社群幫忙用 agent 貢獻功能，同時讓 Oz 平台做實際的 coding 工作，人類專注在 spec 撰寫與行為驗證。OpenAI 是創始贊助商，內建的 agent workflow 由 GPT 模型驅動。

這個「open + agent-driven development」模型本身就是 Warp 對未來軟體開發方式的一個公開押注。

## 適合誰用

**適合**：
- 希望 AI 能直接整合進 shell 工作流，而不是另開 chat 視窗複製貼上
- 工程師團隊想要分享 runbook / 命令歷史
- 重度使用 terminal 的後端、DevOps、Platform 工程師

**不一定適合**：
- 對 telemetry / 雲端同步有疑慮的使用者（雖然現在已開源，可自行審計）
- 只需要 lightweight terminal，對 AI 功能無需求（iTerm2 + tmux 更輕）
- 深度客製化 terminal 美化的使用者（如 Alacritty + starship 生態系）

## 整體來說

Warp 的核心取捨是：用更多預設值和整合換取更好的 out-of-box 體驗。傳統終端機哲學是「小工具組合」，Warp 是「有主見的整合平台」。如果你接受這個交換，它能顯著降低 AI-assisted 開發的摩擦；如果你習慣自己組裝工具鏈，可能會覺得太重。

開源後的 Warp 是值得關注的選項，特別是對想要 AI Agent 跟 terminal 深度整合的開發者——這個賽道目前還沒有明確的勝者。

---

## 參考資料

- [Warp 官網](https://www.warp.dev/)
- [Warp is now open-source（官方部落格）](https://www.warp.dev/blog/warp-is-now-open-source)
- [Warp GitHub（AGPL）](https://github.com/warpdotdev/warp)
- [Introducing Oz: the orchestration platform for cloud agents](https://www.warp.dev/blog/introducing-oz)
- [Warp scores 75.8% on SWE-bench Verified](https://www.warp.dev/blog/warp-scores-75-8-on-swe-bench-verified)
- [Transforming the Command Line at Warp Speed — Sequoia Capital](https://www.sequoiacap.com/article/transforming-the-command-line-at-warp-speed/)
