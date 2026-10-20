---
title: "AI Agent GitHub Digest — 2026-10-20"
date: 2026-10-20
category: daily
tags: [ai-agent, github, open-source, daily, agent-harness, agent-memory, mcp-server]
lang: zh-TW
description: "OpenHuman 把 agent harness 做到一台 $10 VPS 跑 500 隻；agent-memory 把長期記憶還原成一疊可以直接讀的 Markdown；連 CapCut 替代品都內建 MCP 讓 agent 自己剪片"
tldr: "**tinyhumansai/openhuman**（42,159★）是用 Rust 寫的輕量 agent harness，公開的 SWE-bench 測試裡比 Hermes 等六套工具快一倍以上、token 省 2.6 倍、記憶體和 CPU 省 8 倍，靠 token 壓縮、專挑工具用的小模型 Jev、單一行程內的 plugin bus 做到；**tigerless-labs/agent-memory**（4,385★）把 agent 的長期記憶做成一疊 Markdown 檔＋可重建的本機索引，刪掉索引不會丟知識，Claude Code 和 Codex CLI 能共用同一個記憶庫；**jub0t/Concat**（9,417★）是本地優先、零浮水印的開源 CapCut 替代品，內建 MCP server，讓 Claude 之類的 agent 直接下指令剪片。Release：Agno v3.1.6 讓 eval Case 能帶 session_id／圖片等參數跑完整輪次，OS Manager 改成直接查文件而不轉交 Platform Manager。"
series:
  name: "AI Agent GitHub Digest"
  order: 66
---

> 🌏 [English version](/posts/daily/2026-10-20-ai-agent-github-digest-en)

## 今日亮點

今天三個上榜的 repo 都不是在重新發明 agent 本身，而是在補 agent 生態圈還缺的那一圈基礎設施——OpenHuman 補的是跑得動（效能／成本），agent-memory 補的是記得住（長期記憶），Concat 則示範了另一條路：乾脆把 MCP 塞進一般消費軟體，讓剪片軟體本身變成 agent 能操作的工具。

## Trending Repos

### tinyhumansai/openhuman ⭐ 42,159

[GitHub](https://github.com/tinyhumansai/openhuman)　·　Rust　·　GPL-3.0

- **是什麼**：用 Rust 寫成、單一行程的 agent harness，桌面 App、終端機、headless server 三種形式共用同一個核心，也能當 Rust library 嵌進自己的程式。
- **為什麼值得看**：多數 harness 的做法是每個 agent 開一個重程序、每次呼叫都重送整包 prompt；OpenHuman 把成本最高的幾件事重做一遍——用遞迴語言模型（RLM）壓縮大型工具輸出、用一個小模型 Jev 從 1,215 個工具裡挑對的（命中率 86.8%，關鍵字搜尋只有 70.5%）、所有功能插在同一條 Rust bus 上隨需載入，單個功能卡住不影響其他功能。作者公開在 `openhuman-benchmarks` 的 SWE-bench 測試裡，跟 Hermes 等六套工具比，OpenHuman 完成時間少一半以上、token 用量少 2.6 倍、記憶體和 CPU 少 8 倍。
- **tech stack**：Rust 核心 + Tauri 桌面殼 + MCP
- **上手難度**：低——桌面版下載裝好即用，開發者也可以直接 `cargo add` 當函式庫用。

---

### tigerless-labs/agent-memory ⭐ 4,385

[GitHub](https://github.com/tigerless-labs/agent-memory)　·　Python　·　MIT

- **是什麼**：給 AI agent 用的長期記憶 runtime，每一則記憶存成一個 Markdown 檔，旁邊的 SQLite 索引只是隨時可以刪掉重建的快取。
- **為什麼值得看**：市面上的記憶工具多半走向量資料庫，agent 拿到的是看不懂也搬不走的一團 embedding；agent-memory 反過來把檔案系統本身當真相來源，檢索只回傳路徑和一行摘要，agent 自己決定要往下讀多深（outline／abstract／full），不會把整段文字硬塞進 context。寫入不靠 agent 自己記得要存，而是在對話邊界自動觸發，另外有一個獨立的「睡眠時」整理流程做封存和遺忘，刪除一律要人確認。不需要任何 API key，Claude Code、Codex CLI 可以共用同一個記憶庫。
- **tech stack**：Python + SQLite FTS5 + Markdown frontmatter
- **上手難度**：低——pip 安裝即可，不用架向量資料庫或申請 API key。

---

### jub0t/Concat ⭐ 9,417

[GitHub](https://github.com/jub0t/Concat)　·　Rust　·　AGPL-3.0

- **是什麼**：免費開源、本地優先的 CapCut／剪映替代品，涵蓋自動字幕、文字轉語音、去背、關鍵影格動畫、多軌剪輯到 4K 輸出，不用帳號、不上傳、沒有浮水印。
- **為什麼值得看**：跟一般剪輯軟體的差別在最後一條——`concat --mcp` 直接起一個 MCP server，加上 JSON-RPC API，讓 Claude 之類的 agent 可以直接下指令剪片，而不是人類手動拖時間軸。字幕、語音、去背用的 AI 模型第一次使用時下載，之後離線可用，素材全程留在本機硬碟。
- **tech stack**：Rust 引擎 + GPU compositor + FFmpeg + 內建 MCP server
- **上手難度**：中——桌面 App 裝好就能剪片，但要接給 agent 用的 MCP 得照文件設定一次；Windows build 目前還沒簽章，第一次執行會被 SmartScreen 擋一次。

## Notable Releases

### Agno v3.1.6

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.6)

- **重要變更**：eval 的 `Case` 現在能帶 `session_id`／`user_id`／`session_state`／`dependencies`／`metadata`／`knowledge_filters`，`input` 也能吃一個 `Message`，讓一個 eval case 可以附圖片或檔案一起測；共用同一個 `session_id` 的多個 case 會依序接續成同一段對話。另外 OS Manager 查框架問題時改成直接查 Agno 文件，不再轉交給 Platform Manager；`ParallelTools` 修了複製 agent／team 時會把 SDK client 弄丟、丟出 `RLock` 複製錯誤的 bug。
- **Breaking Changes**：無。
- **對你的影響**：如果你在用 Agno 的 eval suite 測多模態輸入或連續對話，升級後可以直接在 `Case` 層級測，不用自己兜一個假 session；用 `ParallelTools` 搭 AgentOS 的人可以順手升級修掉那個複製錯誤。

## 今日收穫

之前以為 agent 生態圈在比「誰的框架更聰明」，但今天這三個 repo 讓我更確定，現在真正被認真打磨的反而是「周邊」——harness 怎麼省錢省記憶體、記憶怎麼長期保存又不失控，甚至連剪片軟體都在學著把自己變成 agent 能操作的工具。agent 本身的能力曲線已經夠用了，缺的是讓它長期、便宜、可控地跑下去的那層基礎設施。

## 參考資料

- [tinyhumansai/openhuman — GitHub](https://github.com/tinyhumansai/openhuman)
- [openhuman-benchmarks — swe-x86-1 測試結果](https://github.com/tinyhumansai/openhuman-benchmarks/blob/main/results/swe-x86-1/summary.md)
- [tigerless-labs/agent-memory — GitHub](https://github.com/tigerless-labs/agent-memory)
- [jub0t/Concat — GitHub](https://github.com/jub0t/Concat)
- [jub0t/Concat — Code Signing Policy](https://github.com/jub0t/Concat/blob/main/CODE_SIGNING.md)
- [Agno v3.1.6 Release Notes — GitHub](https://github.com/agno-agi/agno/releases/tag/v3.1.6)
