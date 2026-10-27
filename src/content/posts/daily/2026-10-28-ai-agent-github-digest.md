---
title: "AI Agent GitHub Digest — 2026-10-28"
date: 2026-10-28
category: daily
tags: [ai-agent, github, open-source, daily, multi-agent, mcp-server, agent-platform, reverse-engineering]
lang: zh-TW
description: "今天的主線是「一個人同時管多個 agent」——Orca 和 Cindy 都在搶「多裝置、多 agent、手機也能插手」這個位置，而 wigolo 想用本地模型把搜尋 API 的帳單歸零"
tldr: "**stablyai/orca**（⭐ 107,899）讓多個 coding agent 各自在獨立 git worktree 平行跑，手機 app 可以遠端監看；**makecindy/cindy**（⭐ 7,342）把 Claude Code／Codex 包進同一個多裝置介面；**KnockOutEZ/wigolo**（⭐ 5,507）是零 API key、本地跑的搜尋／爬蟲 MCP server；**morluto/rea**（⭐ 396,382）讓 agent 不用原始碼就能逆向拆解一個 app 功能。pydantic-ai v2.62.0 帶了好幾條會動到既有程式的相容性變更。"
series:
  name: "AI Agent GitHub Digest"
  order: 74
---

> 🌏 [English version](/posts/daily/2026-10-28-ai-agent-github-digest-en)

## 今日亮點

今天 trending 榜上同時出現兩個「幫你管一堆 agent」的桌面應用——Orca 和 Cindy 都押注同一個未來：寫程式的人手上不會只有一個 agent，而是五個、十個同時在跑，問題變成「人要怎麼在手機上掃一眼、該插手哪個」。同時 wigolo 想把搜尋這件事從按量計費的雲端 API 搬回本機，而 REA 已經靠「讓 agent 自己去逆向別人 app 的功能」衝到 30 萬星。框架這邊，pydantic-ai 丟出一個條款很長的相容性更新，值得先讀再升級。

## Trending Repos

### stablyai/orca ⭐ 107,899

[GitHub](https://github.com/stablyai/orca)　·　TypeScript　·　MIT

- **是什麼**：桌面應用，讓你同時開著 Claude Code、Codex、Grok 等多個 coding agent，各自跑在獨立的 git worktree 裡，一個畫面比較結果；手機上的 companion app 可以遠端看進度、收完成通知、補打一句話。
- **為什麼值得看**：「一個 prompt 丟給五個 agent、各自在隔離 worktree 跑、挑贏家合併」原本要自己手刻腳本管 worktree 跟比對 diff，Orca 把這整套變成可以點來點去的 UI，還內建跟 Linear／GitHub 的任務串接。YC 背景加上手機端，瞄準的正是「agent 同時跑太多個，人要怎麼管」這個新興痛點。
- **tech stack**：Electron 桌面框架 + git worktree 隔離 + 內嵌瀏覽器（Design Mode 可以直接點 UI 元件丟進 prompt）+ iOS／Android companion app
- **上手難度**：低——下載桌面版、用既有的 Claude Code／Codex 訂閱登入就能跑，macOS／Windows／Linux 都有打包好的安裝檔

---

### makecindy/cindy ⭐ 7,342

[GitHub](https://github.com/makecindy/cindy)　·　TypeScript　·　Apache-2.0

- **是什麼**：開源的跨裝置 AI agent 用戶端，把 Claude Code、Codex 和自家的輕量 agent「Pi」包進同一個介面，電腦跟手機之間可以接續同一個工作階段，不用把對話整個重貼一次。
- **為什麼值得看**：它不是又一個 agent 框架，而是把你已經在用的 coding agent 變成「多裝置、有記憶、能排程」的殼——你的電腦就是自己的伺服器，不用額外租主機；手機端還有內建遠端桌面，聊天視窗解決不了的事可以直接操作連線的電腦。對已經在用 Claude Code／Codex 但想要手機插手能力的人，等於是現成的升級路徑。
- **tech stack**：Electron 桌面端 + Expo／React Native 手機端 + pnpm monorepo 共用套件（auth、裝置連結、agent 協調各自獨立）
- **上手難度**：低——下載用戶端用既有訂閱登入即可；想完全離線跑本地 agent 可以選「Skip Sign-In」，但雲端同步、記憶、Skill 這類伺服端功能就不會有

---

### KnockOutEZ/wigolo ⭐ 5,507

[GitHub](https://github.com/KnockOutEZ/wigolo)　·　TypeScript　·　AGPL-3.0

- **是什麼**：給 coding agent 用的本地優先 MCP server，一次給搜尋、抓取、爬蟲、結構化擷取、快取、相似頁面比對、自動研究循環十種工具，核心功能全部跑在自己機器上，不用申請任何 API key。
- **為什麼值得看**：拿來對照 Firecrawl、Exa、Tavily 這類按量計費的搜尋 API——wigolo 靠本地瀏覽器引擎加向量／reranker 模型做到「查完全免費、離線也能重查」，README 裡附了跟三家雲端服務同一題的即時四方比較，連失敗的引擎跟低分結果都老實列出來。對預算有限、或要讓 agent 高頻率查資料的場景是個實際能省錢的替代品。
- **tech stack**：Node.js MCP server + 18 個搜尋引擎做 rank fusion + 本地 embedding／reranker 模型（約需 1.5GB 硬碟）
- **上手難度**：低——`npx wigolo init` 一行指令自動裝好瀏覽器引擎跟模型，`--agents=claude-code,cursor` 可以同時把常用的 agent 都接好

---

### morluto/rea ⭐ 396,382

[GitHub](https://github.com/morluto/rea)　·　TypeScript　·　MIT

- **是什麼**：讓 coding agent 透過 MCP 連上 Hopper、Ghidra、IDA 等逆向工程工具，不用看過原始碼就能解釋一個 app 的某個功能是怎麼做出來的，支援的格式從 Electron、.NET、Android APK 到 WASM、GPU code object 共幾十種。
- **為什麼值得看**：多數「程式碼理解」工具是分析你自己手上的 repo，REA 做的是反過來——看到別人 app 裡一個喜歡的功能，讓 agent 自己去拆解、取證、照著重建一份給你用。README 附的案例研究（還原 DX-Ball 的聲音面板計算、追蹤 Notion 的 Electron clipboard bridge）把「拆解→證據→重建」這條流程具體秀出來，上線半年多衝到近 40 萬星，說明「看到功能就想要」是真實存在的痛點。
- **tech stack**：TypeScript CLI／MCP server + Hopper／Ghidra／IDA 橋接 + 數十種檔案格式各自的靜態解析器
- **上手難度**：中——`npx rea-agents setup` 幾分鐘能把 agent 註冊好，但深度的原生逆向分析還是得先裝好 Hopper、Ghidra 或 IDA 其中一個

## Notable Releases

### pydantic-ai v2.62.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.62.0)

- **重要變更**：agent 執行到一半可以動態改 thinking effort（OpenAI 的 `configuration_update`、Anthropic 每則訊息的 `output_config`）；新增 `ModelRequestRejectedError`／`ModelAuthenticationError`／`ModelNotFoundError` 三種模型錯誤分類，讓 agent 判斷要重試還是直接放棄；hosted MCP 工具名稱預設會加上服務前綴（可用 `tool_prefix` 關掉），避免多個 MCP server 工具名互相打架。
- **Breaking Changes**：有——`SummarizingCompaction` 的摘要改存成 `CompactionPart`（不再塞進 system prompt）；`GraphBuilder` 的 broadcast 分支啟動順序改成照 `.to()` 寫的順序（原本是反過來），會動到升級前還排隊中的 durable workflow 的 replay 行為；`monty_sandbox_url` 跟 `cache_ttl` 兩個參數進入 deprecated。
- **對你的影響**：如果你的 pydantic-ai agent 有用 `SummarizingCompaction` 做長對話壓縮，或正在升級跨版本還有 durable workflow 卡在佇列裡，升級前先看一眼這版的 compatibility notes，尤其是 replay 順序那條。

---

### browser-use 0.13.14

[Release Notes](https://github.com/browser-use/browser-use/releases/tag/0.13.14)

- **重要變更**：新增 OpenAI browser tools 整合；修正螢幕縮放（非 100% 縮放）下截圖、裁切、點擊座標對不齊的問題；支援 Browser Use Cloud SDK V4。
- **Breaking Changes**：無。
- **對你的影響**：如果你用 browser-use 在筆電原生解析度（常常帶縮放）上跑自動化，之前點擊常常落在錯誤座標的狀況，這版之後應該會明顯改善。

## 今日收穫

一開始以為「多 agent 協作」會先長在框架層（LangGraph／CrewAI 那種程式碼裡的 orchestration），但今天看 Orca 跟 Cindy 才發現，真正先成熟的其實是消費端介面層——使用者根本不想寫 orchestration 程式碼，只想要一個桌面 app 幫忙開好五個 worktree、手機收通知。框架在解決「agent 之間怎麼溝通」，這些桌面工具在解決「人要怎麼同時管得動一堆 agent」，是兩個完全不同、但一樣迫切的問題。

## 參考資料

- [stablyai/orca](https://github.com/stablyai/orca) — GitHub repo
- [makecindy/cindy](https://github.com/makecindy/cindy) — GitHub repo
- [KnockOutEZ/wigolo](https://github.com/KnockOutEZ/wigolo) — GitHub repo
- [morluto/rea](https://github.com/morluto/rea) — GitHub repo
- [pydantic-ai v2.62.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.62.0)
- [browser-use 0.13.14 Release Notes](https://github.com/browser-use/browser-use/releases/tag/0.13.14)
- [Top 10 AI GitHub Repositories - 2026-10-27](https://youtu.be/XKt3_sgfUr8) — 今日 trending 榜單交叉確認來源之一
- [GitHub Weekly Trending Snapshot on October 27, 2026 | GitStock](https://gitstock.org/trending/weekly/2026-10-27) — 今日 trending 榜單交叉確認來源之二
