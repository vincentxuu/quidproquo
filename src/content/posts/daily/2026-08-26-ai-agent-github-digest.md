---
title: "AI Agent GitHub Digest — 2026-08-26"
date: 2026-08-26
category: daily
type: digest
tags: [ai-agent, github, open-source, daily, agent-framework, coding-agent, personal-agent]
lang: zh-TW
description: "OpenHuman 想當你的個人記憶大腦、OpenBot 想把 agent 包成先審後動的數位同事，而 Agno v3 和 Haystack v3.1 則在啃『跑起來會壞在哪』的底層細節"
tldr: "tinyhumansai/openhuman 用本地優先的 Memory Tree 壓縮數位生活、指揮多個 agent，早期 beta 已衝上 3.7 萬星；Vercel Labs 的 fx 用 Zig 寫出不到 8 MiB 的原生 coding agent CLI；NVIDIA 開源 labs-OO-Agents，把 agent 的 prompt/tool/workflow 收進單一 Python class；CopilotKit/OpenBot 把 agent 包進容器並加上治理閘門，動作先審後動。Agno v3.0.0 是需要跑資料庫遷移的重大 breaking release，Haystack v3.1.0 新增多 agent 委派工具 AgentTool 和上下文壓縮 CompactionHook。"
series:
  name: "AI Agent GitHub Digest"
  order: 11
---

> 🌏 [English version](/en/posts/daily/2026-08-26-ai-agent-github-digest-en)

## 今日亮點

今天的專案剛好落在兩端——一端是敢做大平台的新面孔，OpenHuman 想當你的個人記憶大腦，OpenBot 想把 agent 包成有自己容器、動作先審後動的數位同事；另一端是老牌框架埋頭啃「跑起來會壞在哪」的細節，Agno v3 把資料庫結構打掉重練，Haystack 加了上下文壓縮和多 agent 委派工具。平台在搶想像空間，框架在補地基。

## Trending Repos

### tinyhumansai/openhuman ⭐ 37.7k

[GitHub](https://github.com/tinyhumansai/openhuman)　·　Rust + TypeScript　·　GPL-3.0

- **是什麼**：本地優先的個人 AI 「記憶大腦」，每 20 分鐘把信件、文件、訊息壓縮進一棵 Memory Tree，再用它指揮多個 agent 幫你辦事。
- **為什麼值得看**：多數 agent 框架處理的是單次任務，這個專案賭的是長期個人 context——先把你的數位生活壓成可查詢的記憶，才談派工給 agent。早期 beta 已衝上 3.7 萬星，值得觀察穩定性問題會不會拖垮熱度（早前有媒體誤傳它「連續 9 天登上 GitHub Trending 第一名」，經查證後已被更正，本文不重複這個未經證實的說法）。
- **tech stack**：Rust 核心 + TypeScript 前端，用 Signal 協定加密連結多個 agent
- **上手難度**：中——需要跑本機安裝程式並設定 `config.toml`，才能接上 Claude Code / Cursor / Codex

---

### vercel-labs/fx ⭐ 2.4k

[GitHub](https://github.com/vercel-labs/fx)　·　Zig　·　Apache-2.0

- **是什麼**：Vercel Labs 寫的極簡 coding agent CLI，編成不到 8 MiB 的原生二進位檔，號稱 10 微秒冷啟動。
- **為什麼值得看**：跟 Claude Code、Codex CLI 這類 Node/Python 起家的工具不同，fx 賭的是「嵌入性」——單一二進位檔可以塞進 CI sandbox、瀏覽器 WebAssembly，甚至編進別人的程式裡當元件用，而不是獨立跑的終端機工具。
- **tech stack**：Zig 編譯原生二進位，支援 CLI / ACP / WebAssembly 三種嵌入方式
- **上手難度**：低——下載單一二進位檔即可執行，但目前仍標示為 Experimental

---

### nvidia-nemo/labs-oo-agents ⭐ 1.9k

[GitHub](https://github.com/nvidia-nemo/labs-oo-agents)　·　Python　·　Apache-2.0

- **是什麼**：NVIDIA 官方開源的「物件導向」agent 框架，把 prompt、工具、callback、workflow 全部收進一個 Python class。
- **為什麼值得看**：多數框架把 prompt/tool/workflow 拆成分開的抽象層，這個框架反過來，讓 agent 的狀態和能力用一個型別化的 class 表達，寫起來更接近寫一般 Python 物件，而不是拼 YAML/DSL。
- **tech stack**：LiteLLM（相容 Claude / GPT / Ollama / vLLM）+ Jupyter 風格 REPL 執行環境
- **上手難度**：中——需要熟悉 Python async/await 和型別註記的寫法

---

### CopilotKit/OpenBot ⭐ 2.8k

[GitHub](https://github.com/CopilotKit/OpenBot)　·　TypeScript　·　MIT

- **是什麼**：把任意 AG-UI 相容的 agent 包成「有自己容器、瀏覽器、檔案系統的數位同事」，每個動作先過治理閘門審核才會執行。
- **為什麼值得看**：這是少數把「治理」當一等公民的 agent 平台——不是先跑再說，而是把每個動作攔下來稽核。對想把 agent 放進正式流程、又怕失控的團隊，這種「先審後動」的架構比事後補救更實際。
- **tech stack**：Hono + React/Vite 前端、PostgreSQL + pgvector、Docker/Docker Compose 容器隔離、Better Auth
- **上手難度**：中——需要跑 Docker Compose 起多個服務，並接上 AG-UI 相容的 agent 後端

## Notable Releases

### Agno v3.0.0

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.0)

- **重要變更**：Runs 資料改用獨立資料表，把寫入放大從 O(N²) 降到 O(N)；大型工具結果和多媒體改存到 AgentFS/S3，不再塞進訊息本體；新增可跨 session 保留狀態的 CodeMode IPython kernel；背景任務改成可撐過當機的持久佇列。
- **Breaking Changes**：升級前必須先跑 `MigrationManager(db).up()` 做資料庫遷移；`enable_user_memories` 改名為 `update_memory_on_run`；`Workflow` 建構子改成只收關鍵字參數；Culture 功能整個砍掉，改用 Knowledge。
- **對你的影響**：如果你在用 Agno，這不是加減幾個參數就能過的升級——先讀遷移指南，把生產環境的資料庫遷移排進維運排程，確認新表資料完整後再切流量。

---

### Haystack v3.1.0

[Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.1.0)

- **重要變更**：新增實驗性的 CompactionHook，在丟給 LLM 前先壓縮對話（滑動視窗、修剪工具結果兩種策略）；新增 AgentTool，讓一個 Agent 可以被包成 Tool 給另一個 Agent 呼叫，做多 agent 委派；補上 Token Counter 模組，方便估算請求大小。
- **Breaking Changes**：帶自訂 Jinja filter 的序列化 `OutputAdapter` / `ConditionalRouter`，載入時要加 `Pipeline.load(..., unsafe=True)`；`exit_reason` 變成 Agent state 的保留字，自訂同名 key 要改名。
- **對你的影響**：如果你在拼多 agent 委派或想省 token，這版的 AgentTool 和 CompactionHook 值得先在測試環境接看看；有用到自訂 Jinja filter pipeline 的要檢查反序列化流程。

## 今日收穫

之前以為「個人 AI 助理」這條線已經被大廠應用吃光了，但 OpenHuman 這種本地優先、把數位生活壓成記憶樹的做法提醒我：開源社群還在賭一個大廠不太會做的方向——完全跑在自己機器上、資料不出門的長期記憶層。同時 OpenBot 的「先審後動」治理閘門也讓我意識到，agent 平台的下一個戰場可能不是能力多強，而是誰能讓企業放心把動作權交出去。

## 參考資料

- [tinyhumansai/openhuman](https://github.com/tinyhumansai/openhuman)
- [OpenHuman 報導更正說明 — METAL LAB](https://metallab.ai/en/2026/8/tinyhumansai-openhuman-your-personal-ai-super-intelligence-a-brain-that)
- [vercel-labs/fx](https://github.com/vercel-labs/fx)
- [fx Deep Dive — Developers Digest](https://www.developersdigest.tech/blog/fx-vercel-tiny-native-coding-agent-deep-dive)
- [nvidia-nemo/labs-oo-agents](https://github.com/nvidia-nemo/labs-oo-agents)
- [CopilotKit/OpenBot](https://github.com/CopilotKit/OpenBot)
- [Agno v3.0.0 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.0)
- [Haystack v3.1.0 Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.1.0)
