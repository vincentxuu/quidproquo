---
title: "AI Agent GitHub Digest — 2026-08-31"
date: 2026-08-31
category: daily
type: digest
tags: [ai-agent, github, open-source, daily, agent-skills, mcp, agent-coding]
lang: zh-TW
description: "agno v3.0.2 讓 Agent／Team／Workflow 直接發布成具名 MCP tool，GitHub 熱門榜同時擠出兩份完全不同受眾的 Agent Skills 套件庫，還有一支用更狠 benchmark 調校反超原作的 coding agent fork"
tldr: "can1357/oh-my-pi 從知名 coding agent「Pi」fork 出來，靠死磕工具呼叫格式讓 Grok Code Fast 1 的任務成功率從 6.7% 衝到 68.3%；K-Dense-AI/scientific-agent-skills 把 163 個科研技能開放給任何相容 Agent Skills 標準的 agent；addyosmani/agent-skills 把資深工程師的六階段開發流程包成技能包，一週衝上 9 萬星；THU-MAIC/OpenMAIC v1.0.0 加入對話式 Pro workbench，把 multi-agent 落到課程內容產製這個具體垂直場景。框架端 agno v3.0.2 是本次唯一達標的重要更新：直接把 Agent/Team/Workflow 發布成具名 MCP tool，同時有多筆 breaking changes。"
series:
  name: "AI Agent GitHub Digest"
  order: 16
---

## 今日亮點

今天串起來的主線是「MCP 正在變成 agent 互相曝露能力的標準層」——agno v3.0.2 直接讓 `Agent`、`Team`、`Workflow` 一鍵發布成具名 MCP tool；GitHub 熱門榜同時擠出兩份完全不同受眾的 Agent Skills 套件庫，一個把資深工程師的標準作業流程打包給 coding agent，另一個把兩百多個科研資料庫打包給科學家用的 agent；而 oh-my-pi 這支個人 fork 用更狠的 benchmark 調校反超原版 Pi，提醒我們 coding agent 的工具呼叫格式這塊地基還遠沒有收斂。

## Trending Repos

### can1357/oh-my-pi ⭐ 28,455

[GitHub](https://github.com/can1357/oh-my-pi)　·　TypeScript + Rust　·　MIT

- **是什麼**：從 Mario Zechner 的開源終端機 coding agent「Pi」fork 出來的加強版，接上 60+ 個模型供應商、31 個內建工具、14 種 LSP 操作與 28 種 DAP（除錯協定）操作，核心用 Rust 重寫，約 8 萬行。
- **為什麼值得看**：原作 Pi 本身就是知名的輕量 coding agent，omp 選擇不重造輪子，而是死磕大家常略過的細節——工具呼叫格式。官方公布的 benchmark 顯示同一顆模型換上 omp 的 edit／read／grep 格式後，Grok Code Fast 1 的任務成功率從 6.7% 衝到 68.3%，Grok 4 Fast 的輸出 token 少了 61%。同一顆模型光是換掉工具介面就有數量級的差異，這對正在自建 agent harness 的團隊是很直接的提醒。
- **Tech Stack**：TypeScript CLI/TUI + Rust 核心（LSP/DAP 引擎）+ Bun runtime，支援 curl 腳本、Homebrew、Nix、Bun 全平台安裝
- **上手難度**：低——`curl -fsSL https://omp.sh/install | sh` 或 `brew install can1357/tap/omp` 即可；PR 目前對所有人開放（原本需要維護者先 vouch）

---

### K-Dense-AI/scientific-agent-skills ⭐ 38,894

[GitHub](https://github.com/K-Dense-AI/scientific-agent-skills)　·　Python　·　MIT

- **是什麼**：把 163 個「拿去就能用」的科研技能（癌症基因體學、藥物-標的結合、分子動力學、時間序列預測等）和 100+ 個科學資料庫，打包成任何支援開放 Agent Skills 標準的 agent 都能安裝的技能庫，前身是 Claude 專屬的「Claude Scientific Skills」。
- **為什麼值得看**：從「Claude 專屬」改名成「相容任何 agent」這個動作本身就是訊號——skill 生態正從「綁死單一 agent 平台」走向「開放標準各家都能吃」。官方號稱已被 19 萬名科學家使用，並搭配一個開源、可在本機執行的「AI co-scientist」（K-Dense BYOK）示範完整研究流程，對想幫實驗室或研究團隊接 agent 的人是現成起點，不用從零盤點資料庫 API。
- **Tech Stack**：Markdown/YAML 技能定義 + Python 工具腳本，相容 Cursor／Claude Code／Codex／Google Antigravity
- **上手難度**：低——依 Agent Skills 標準安裝，個別技能可單獨挑選

---

### addyosmani/agent-skills ⭐ 90,900

[GitHub](https://github.com/addyosmani/agent-skills)　·　JavaScript　·　MIT

- **是什麼**：Google Chrome 團隊工程師 Addy Osmani 整理的「資深工程師工作流程」技能包，把 Define→Plan→Build→Verify→Review→Ship 六個階段的最佳實踐（spec-driven 開發、TDD、五軸 code review 等）包成 25 個可自動觸發的 skill 與 9 個 slash command。
- **為什麼值得看**：市面上多數 agent skill 庫在教「怎麼用某個工具」，這份直接把「資深工程師怎麼做決策」流程化——例如 `/build auto` 會先生出計畫，approve 一次後自動照著每個任務跑測試與 commit，但保留失敗或高風險步驟時暫停等人判斷，而不是無腦全自動。加上作者在前端／效能圈的份量，一週內衝上 9 萬星，代表「流程型」skill 而非單純「知識型」skill 正在被更多團隊採用。
- **Tech Stack**：Markdown skill 定義 + slash command 綁定，透過開源 `skills` CLI 一行安裝進 70+ 種 agent
- **上手難度**：低——`npx skills add addyosmani/agent-skills` 裝全部，或用 `--skill` 挑單一技能

---

### THU-MAIC/OpenMAIC ⭐ 23,594

[GitHub](https://github.com/THU-MAIC/OpenMAIC)　·　TypeScript　·　MIT

- **是什麼**：清華大學團隊打造的「一鍵生出沉浸式多 agent 課程」工具，8 月 27 日剛發布 v1.0.0，新增「Pro workbench」讓使用者用對話方式跟 agent 一起規劃課綱、逐頁生成並修改教材。
- **為什麼值得看**：這是少數把 multi-agent 落到「教育內容生產」這個具體垂直場景、還做出完整產品閉環的開源專案——上傳文件／音訊／影片當素材、agent 規劃課程結構、20 個內建技能處理投影片／測驗／互動元件，還能匯出離線教室包。對照多數 multi-agent 框架還停在「幾個 agent 怎麼互相喊話」的示範層級，OpenMAIC 展示了 multi-agent 編排接到真實內容產製 pipeline 的樣子。
- **Tech Stack**：TypeScript + `@openmaic/*` SDK 家族（DSL/renderer/importer），可替換模型、媒體、搜尋供應商與儲存後端
- **上手難度**：中——一鍵生成模式簡單，但要用到 Pro workbench 的 agent 規劃與伺服器端持久化需要額外設定儲存後端（官方提供一鍵 Postgres 方案）

## Notable Releases

### agno v3.0.2

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.2)

- **重要變更**：`MCPConfig.tools` 現在能直接吃 `Agent`／`Team`／`Workflow` 實例、遠端 proxy 與 `Toolkit`，把它們各自發布成具名 MCP tool（例如整個 agent 叫 `chief`，而不是要外部呼叫 `run_agent(agent_id="chief")`）；`run()` 的 `metadata` 解析順序改成 component → session → call-site；新增 Synthorai 模型供應商、WaveSpeed 圖片/影片生成、Serply 搜尋、AtomicMail 收發信等整合工具。
- **Breaking Changes**：`MCPConfig`/`MCPServerConfig` 現在對未知參數直接丟錯，而非默默忽略；`BaseRemote.acancel_run` 新增必填的 `auth_token` 參數，第三方 `BaseRemote` 子類要跟著補；`AgentOS(mcp=...)`、`MCPConfig`、`default_tools` 是新的命名，舊名稱（`mcp_server=`、`MCPServerConfig`、`enable_builtin_tools`）暫時保留為別名，預計 3.1 版移除。
- **對你的影響**：如果你已經在用 agno 把 agent 包成服務對外接，這次可以直接把整個 Agent/Team 發布成 MCP tool，不用再自己包一層 `run_agent` wrapper；但升級前要檢查有沒有自訂 `BaseRemote` 子類或依賴 `MCPServerConfig` 舊名的程式碼，逐條對照 changelog 確認不會在啟動時直接丟錯。

## 今日收穫

之前以為「Agent Skills 生態」的重點在技能數量多寡，但把 K-Dense 從「Claude 專屬」改名成「相容任何 agent」、以及 agno 直接讓 Agent 本身變成一個 MCP tool 這兩件事放在一起看，更像是同一個趨勢的兩個切面——不管是技能還是 agent 本身，大家都在往「封裝成一個標準介面、讓任何宿主都能呼叫」收斂，而不是各自建自己的外掛系統。

## 參考資料

- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [oh-my-pi README](https://raw.githubusercontent.com/can1357/oh-my-pi/main/README.md)
- [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills)
- [scientific-agent-skills README](https://raw.githubusercontent.com/K-Dense-AI/scientific-agent-skills/main/README.md)
- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
- [agent-skills README](https://raw.githubusercontent.com/addyosmani/agent-skills/main/README.md)
- [THU-MAIC/OpenMAIC](https://github.com/THU-MAIC/OpenMAIC)
- [OpenMAIC README](https://raw.githubusercontent.com/THU-MAIC/OpenMAIC/main/README.md)
- [agno v3.0.2 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.0.2)
- [GitHub Trending — Daily](https://github.com/trending?since=daily)
