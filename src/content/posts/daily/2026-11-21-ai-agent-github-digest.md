---
title: "AI Agent GitHub Digest — 2026-11-21"
date: 2026-11-21
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, claude-code, crewai]
lang: zh-TW
description: "mattpocock/skills 反超 obra/superpowers 衝上全球第 13 名星數，資安與設計領域的 skill 套件也開始用同一套分發邏輯"
tldr: "mattpocock/skills 衝到 32.9 萬顆星反超 obra/superpowers，全球排名第 13；資安向的 Claude-BugHunter、Google 的 stitch-skills 同日都在漲，說明 skill 套件分發已經擴散出通用開發；CrewAI 1.15.44 加入版本化可分享產出物，Claude Code v2.1.329 補了 hooks 失敗警告與任務面板整合。"
series:
  name: "AI Agent GitHub Digest"
  order: 98
---

> :globe: [English version](/posts/daily/2026-11-21-ai-agent-github-digest-en)

## 今日亮點

昨天的主角 `obra/superpowers`（32.2 萬顆星）今天被同類型的 `mattpocock/skills` 反超，衝到 32.9 萬顆、全球星數排名第 13——兩個都是「skill 套件」而非完整框架，差別只在誰的套件組合更對開發者口味。更值得注意的是同一套「打包成可安裝 skill」的邏輯已經擴散到通用開發以外：資安研究者做的 `Claude-BugHunter` 今天單日衝了 1,349 顆星，Google Labs 也用同樣的套件格式包了設計工具 `stitch-skills`。Skill 套件正在變成比框架本身傳播更快的分發單位。

## Trending Repos

### mattpocock/skills ★328,726 (+約800/日，本週 +5.6k)

[GitHub](https://github.com/mattpocock/skills)　·　Shell　·　MIT

- **是什麼**：工程師 Matt Pocock 把自己每天在用的 Claude Code / Codex skill 直接開源，裝完一句 `/setup-matt-pocock-skills` 就能用。
- **為什麼值得看**：跟強調「方法論」的 `obra/superpowers` 不同，這包更偏「拿來就用的工程習慣」——規格對齊、審慎下刀、decades 工程經驗整理成的小顆粒 skill，可以挑著裝不用全盤接受一套流程。今天星數反超 superpowers，顯示這類套件的勝負看的是單顆 skill 的實用密度，不是整體敘事。
- **Tech Stack**：Shell 腳本 + Markdown skill 定義，相容 Claude Code、Codex、Copilot CLI、Gemini CLI 等多個 agent runtime
- **上手難度**：低——一行安裝指令，或用 `npx skills@latest add` 挑選要裝的 skill

---

### elementalsouls/Claude-BugHunter ★13,855 (+1,349/日)

[GitHub](https://github.com/elementalsouls/Claude-BugHunter)　·　Python　·　MIT

- **是什麼**：把 83 個 bug bounty / 紅隊測試 skill、15 個斜線指令、681 筆已公開揭露報告的攻擊模式打包成 Claude Code plugin，涵蓋 24 類核心漏洞和企業身分／基礎設施攻擊鏈。
- **為什麼值得看**：證明 skill 套件這種分發方式已經不只用在「寫程式」這個場景——把長年累積的漏洞知識變成可安裝的 skill，裝上去 Claude Code 就從聊天機器人變成有方法論、懂 CVE 連鎖的測試研究助手，且明確要求只能用在已授權的合法測試。今天單日漲幅是所有候選裡最快的。
- **Tech Stack**：Claude Code Skills 系統 + Burp Suite MCP 整合，skill 以主題自動觸發、不需要手動點名呼叫
- **上手難度**：中——裝好即用，但要正確設定測試範圍與 HackerOne API 授權才能發揮完整功能

---

### google-labs-code/stitch-skills ★10,954

[GitHub](https://github.com/google-labs-code/stitch-skills)　·　TypeScript　·　Apache-2.0

- **是什麼**：Google Labs 幫自家設計工具 Stitch 做的一套 Agent Skills，照 Agent Skills 開放標準打包，讓 Antigravity、Gemini CLI、Claude Code、Cursor 都能呼叫 Stitch 的 MCP server 做介面設計與產出元件。
- **為什麼值得看**：是目前看到第一個把「skill 套件」這種分發方式正式用在設計工具上的大廠案例——不是獨立開發者的個人實踐，而是 Google 官方把內部設計工作流包成任何 agent 都能裝的 skill plugin，跟今天其他兩個案例合起來看，skill 套件正在變成不分領域的標準打包方式。
- **Tech Stack**：Agent Skills 開放標準 + Stitch MCP server + Codex/Claude plugin marketplace 機制
- **上手難度**：中——需要先有 Stitch 帳號與 MCP server 連線設定，plugin 安裝本身一行指令

---

### firecrawl/firecrawl ★205,054 (+825/日)

[GitHub](https://github.com/firecrawl/firecrawl)　·　TypeScript　·　AGPL-3.0

- **是什麼**：把網頁爬取、搜尋、550+ 個資料來源整理成單一 API 給 agent 用的「知識基礎設施」，可以自架（Firecrawl Local）、連雲端，或單純當 MCP server 接給任何 agent runtime。
- **為什麼值得看**：這個 repo 已經兩年多，不是新專案，但今天單日漲幅仍排進候選前段——反映 agent 要「查資料」這個基本需求的成長曲線還沒平緩，而且 Firecrawl Local 可以直接跑成本機 MCP server，跟今天另外兩個 skill 套件的「裝就能用」邏輯是同一套使用者期待。
- **Tech Stack**：TypeScript 服務 + MCP server 介面 + 多語言 SDK（Python/Node/Go/Rust）
- **上手難度**：低——`firecrawl-local` 一個指令起本機服務，雲端版直接拿 API key 呼叫

## Notable Releases

### CrewAI 1.15.44

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.44)

- **重要變更**：新增把檔案存成「版本化、可分享」產出物的能力；修掉 flow 檔案裡 inline agent/crew 參照解析錯誤、chunk 合併時重複保留分隔符號、`crewai train` 失敗時退出碼不正確等問題；把 Anthropic 檔案區塊的 cache_control 收斂成不會每次都重新標記。
- **Breaking Changes**：無。
- **對你的影響**：如果你在用 CrewAI 的 flow 存檔或知識庫分塊功能，升級後行為會更穩定，不需要改程式碼。

---

### Claude Code v2.1.329

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.329)

- **重要變更**：trust dialog 會標出 hook 是在哪個資料夾宣告的；managed settings 裡的 hook 載入失敗時，Claude Desktop 等非互動環境會在對話中顯示警告；`/tasks` 現在會列出這個 session 的排程任務、`/loop` 喚醒和 fork；Code Mode 可以在開著 OpenTelemetry 事件與指標時一起用。
- **Breaking Changes**：無。
- **對你的影響**：如果你的團隊靠 managed settings 統一發 hook，這版讓 hook 載入失敗不再悄悄失效；用 `/loop` 或排程任務的人可以直接在 `/tasks` 看到全貌，不用另外翻紀錄。

## 今日收穫

之前以為「skill 套件打敗框架」只是通用程式開發圈子裡的現象，今天看到資安（Claude-BugHunter）跟設計工具（stitch-skills，還是 Google 官方做的）都在用一樣的打包邏輯，才意識到這其實是一種新的軟體分發型態——不寫完整應用，只把方法論和知識包成 agent 能裝的 skill，誰的知識密度夠高就贏，跟寫不寫程式碼沒關係。

## 參考資料

- [mattpocock/skills](https://github.com/mattpocock/skills)
- [mattpocock/skills star history](https://www.star-history.com/mattpocock/skills/)
- [obra/superpowers star history](https://www.star-history.com/obra/superpowers/)
- [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter)
- [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills)
- [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl)
- [AI Open Source Trends 2026-11-20（今日星數漲幅數據來源）](https://github.com/duanyytop/agents-radar/issues/4383)
- [CrewAI 1.15.44 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.44)
- [Claude Code v2.1.329 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.329)
