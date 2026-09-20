---
title: "AI Agent GitHub Digest — 2026-09-20"
date: 2026-09-20
category: daily
tags: [ai-agent, github, open-source, daily, agent-harness, mcp-server, agent-memory]
lang: zh-TW
description: "今天的 trending 榜分成兩條線——一邊是把 agent 本身武裝起來（harness、記憶、知識圖譜），一邊是把 agent 的觸角伸進過去搆不到的地方（邊緣裝置、遊戲引擎）"
tldr: "affaan-m/ECC 靠「agent harness 效能優化」8 個月衝上 26 萬+ star，但成長速度快到該保守看待；cactus-compute/needle 用 8-29MB 模型犧牲聊天能力換工具呼叫精準度；Graphify-Labs/graphify 用本地 AST parsing 建知識圖譜取代向量資料庫；tinyhumansai/openhuman 把「認識使用者」當 agent 記憶的核心賣點；IvanMurzak/Godot-MCP 讓 agent 直接操作 Godot 編輯器；Claude Code v2.1.277 加入 AGENTS.md 支援"
series:
  name: "AI Agent GitHub Digest"
  order: 36
---

## 今日亮點

今天的 trending 榜可以分成兩條線：一邊是把 agent 本身武裝起來——affaan-m/ECC 做 harness 效能優化、Graphify-Labs/graphify 把 codebase 轉成知識圖譜、tinyhumansai/openhuman 主打「先認識你再幹活」的記憶層；另一邊是把 agent 的觸角伸進過去搆不到的地方——cactus-compute/needle 把工具呼叫模型塞進 8-29MB 塞進手機和機器人，IvanMurzak/Godot-MCP 讓 agent 直接操作遊戲引擎編輯器。比起單純「多一個框架」，這更像是 agent 生態往「更深」和「更廣」兩個方向同時擴張。

## Trending Repos

### affaan-m/ECC ⭐ 262,767

[GitHub](https://github.com/affaan-m/ECC)　·　JavaScript　·　MIT

- **是什麼**：給 Claude Code、Codex、Cursor 這類 coding agent 用的效能優化外掛系統，把 skills、instincts（行為傾向）、memory、security 這些子系統打包成一層可插拔的 harness。
- **為什麼值得看**：2026 年 1 月才建倉，8 個月衝到 26 萬+ star、3.9 萬 fork，是這波「幫通用 agent 加外掛」類別裡成長最快的專案之一。但這個速度快到需要提醒：repo 掛著「GitHub Trending Repository of the Day」徽章，README 同步做了 12 種語言版本，這種規模的成長通常伴隨刻意衝話題度的操作，star 數字本身建議保守看待；功能設計本身（skills／instincts／memory 分層）倒是命中了「通用 agent 缺 harness」的真實痛點。
- **tech stack**：JavaScript + Claude Code / Codex / Opencode / Cursor 整合層
- **上手難度**：低——依官方 README 走 GitHub App 安裝流程即可接上現有 coding agent。

---

### cactus-compute/needle ⭐ 11,533

[GitHub](https://github.com/cactus-compute/needle)　·　Python　·　Apache-2.0

- **是什麼**：給手機、穿戴裝置、機器人、車用和微控制器跑的自動化基礎模型，整個模型是一個 8-29MB 的 2-bit 量化二進位檔，做工具呼叫、結構化擷取和文字 embedding。
- **為什麼值得看**：思路跟主流「大模型瘦身」相反——不是先有通用聊天模型再壓縮，而是先決定「這模型只做工具呼叫、擷取、embedding 三件事」，用犧牲對話能力換來裝置端的呼叫精準度。官方基準說工具呼叫用 exact-match accuracy 打贏 10 倍大的模型。
- **tech stack**：Laddered Simple Attention Network（Monarch Hadamard MLP 取代 FFN + GQA attention + engram n-gram 記憶）
- **上手難度**：低——`pip install cactus-needle` 就能跑，瀏覽器也有互動 demo。

---

### Graphify-Labs/graphify ⭐ 119,589

[GitHub](https://github.com/Graphify-Labs/graphify)　·　Python　·　Apache-2.0

- **是什麼**：把整個 codebase——含文件、SQL schema、config、PDF——轉成可查詢的知識圖譜，以 `/graphify` skill 形式提供給 Claude Code、Cursor、Codex、Gemini CLI。
- **為什麼值得看**：走的是「本地 deterministic AST parsing、不用向量資料庫」路線，跟一般 RAG 工具的差異在於每條邊都能追出處，不是靠 embedding 相似度用機率猜出來的關聯。團隊是 YC S26，GitHub Trendshift 也把它列進趨勢榜。
- **tech stack**：Python + tree-sitter AST parsing + Leiden 社群偵測演算法
- **上手難度**：低——PyPI 安裝加一個 skill 指令，v1 平台早鳥版尚在測試階段。

---

### tinyhumansai/openhuman ⭐ 39,887

[GitHub](https://github.com/tinyhumansai/openhuman)　·　Rust　·　GPL-3.0

- **是什麼**：開源 agent harness，主打 local-first 記憶——強調先花時間讓 agent 認識你的工作習慣，而不是每次對話都從零開始。
- **為什麼值得看**：定位對照 Karpathy 提出的 LLM Knowledgebase 概念，跟同類「session 間記憶」工具（例如 claude-mem）的差異在於把「認識使用者」當成產品核心而不是附加功能。授權選了 GPL-3.0，比多數同類專案用的 MIT/Apache 更嚴格，值得商用前確認合規。
- **tech stack**：Rust + Tauri 桌面應用
- **上手難度**：中——是桌面 app，要在地端安裝執行，不是純 CLI 或 MCP server。

---

### IvanMurzak/Godot-MCP ⭐ 247

[GitHub](https://github.com/IvanMurzak/Godot-MCP)　·　C#　·　Apache-2.0

- **是什麼**：幫 Godot 遊戲引擎接上 MCP，讓 Claude、Cursor、Copilot 這類 agent 直接操作 Godot Editor——建節點、編場景、管資源與腳本、截圖除錯。
- **為什麼值得看**：跟同作者的 Unity-MCP 共用同一套 MCP／反射底層（透過 NuGet 的 `ReflectorNet` 套件，不是各自重寫），42 個內建工具橫跨 12 個功能家族。「用 agent 寫遊戲」目前完整方案不多，這是少見把編輯器操作面覆蓋得比較全的一個。
- **tech stack**：C# editor addon + ReflectorNet 反射框架 + 自架或雲端（ai-game.dev）MCP server
- **上手難度**：中——要在 Godot Editor 裝 addon，還要設定 MCP 連線（自架或連雲端後端）。

## Notable Releases

### Claude Code v2.1.277 / v2.1.278

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.278)

- **重要變更**：v2.1.277 加入 AGENTS.md 支援——專案沒有 CLAUDE.md 時，Claude Code 改讀 AGENTS.md（可在 `/config` 的「Project instructions」切換，Bedrock／Vertex／Foundry 尚未支援）；v2.1.278 把 Claude API／Enterprise 使用者以及 Bedrock、Vertex、Foundry、gateway 場景的 auto mode 預設改成伺服器端分類器，不再額外收 classifier 費用（`CLAUDE_CODE_AUTO_MODE_SERVER=0` 可在 Bedrock／Vertex／Foundry／gateway 選擇退出），計費 fallback 時會警告。
- **Breaking Changes**：無（純功能新增與大量 bug fix，含多個崩潰修復與 `claude -p` / Agent SDK 掛起修復）
- **對你的影響**：如果你的專案原本用 CLAUDE.md，這次升級不影響現況；如果是用 AGENTS.md 慣例的團隊，現在不用再額外轉檔。用 Bedrock/Vertex/Foundry 或自架 gateway 且在意 auto mode 計費的話，值得看一下 `CLAUDE_CODE_AUTO_MODE_SERVER` 這個開關。

## 今日收穫

一直以為「agent 生態擴張」主要看新框架冒出來的速度，但今天這批案例（needle 的邊緣裝置、Godot-MCP 的遊戲引擎）提醒我，更值得看的可能是「agent 觸角伸到了哪些過去搆不到的場景」——框架數量趨於飽和後，真正的差異化開始出現在垂直場景的深度整合，而不是又一套通用編排層。

## 參考資料

- [affaan-m/ECC](https://github.com/affaan-m/ECC)
- [AI Open Source Trends 2026-09-19（agents-radar，含 ECC／needle／graphify 當日數據）](https://github.com/duanyytop/agents-radar/issues/3361)
- [cactus-compute/needle](https://github.com/cactus-compute/needle)
- [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify)
- [tinyhumansai/openhuman](https://github.com/tinyhumansai/openhuman)
- [IvanMurzak/Godot-MCP](https://github.com/IvanMurzak/Godot-MCP)
- [Claude Code v2.1.278 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.278)
- [Claude Code v2.1.277 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.277)
