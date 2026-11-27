---
title: "AI Agent GitHub Digest — 2026-11-28"
date: 2026-11-28
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, mcp, security]
lang: zh-TW
description: "Claude-BugHunter 把 681 筆漏洞報告拆成技能包單日奪冠,官方 MCP reference server 同時修了 8 個安全洞"
tldr: "Claude-BugHunter 把 681 筆 HackerOne 公開報告拆成 85 個技能,單日 +1,597 顆星居全站第一;obra/superpowers 的跨工具開發方法論同日 +854。官方 modelcontextprotocol/servers v2.6.0 一次修掉 8 個安全漏洞,Pydantic AI v2.76.0 也同時收緊了 realtime 工具更新與對話歷史壓縮的行為。"
series:
  name: "AI Agent GitHub Digest"
  order: 105
---

> :globe: [English version](/posts/daily/2026-11-28-ai-agent-github-digest-en)

## 今日亮點

今天分成兩條線在走:一條是 Agent Skills 生態持續狂長——Claude-BugHunter 把 681 筆 HackerOne 公開漏洞報告拆解成技能包,單日衝上全站第一;另一條是「補洞」——官方 MCP reference server 一次修掉 8 個安全漏洞,Pydantic AI 也在這次更新收緊了好幾個容易被忽略的行為。兩條線合起來看,agent 生態正從「能用」往「能放心用」收斂。

## Trending Repos

### obra/superpowers ★ 327,792 (+854)

[GitHub](https://github.com/obra/superpowers)　·　Shell　·　MIT

- **是什麼**:一套給 coding agent 用的「軟體開發方法論」技能包——spec 訪談、拆解任務、強制紅綠 TDD、subagent 互相審查,一條流程從頭接到尾,同時相容 Claude Code、Codex、Cursor、Gemini CLI、Antigravity 等十幾種 agent 介面。
- **為什麼值得看**:市面上多數 skill 都是單點技巧(寫測試、查文件),superpowers 是少見把整個「怎麼帶一個 agent 做完一個專案」的流程方法論化、還刻意做成跨工具相容的案例;單日 +854 顆星說明這類「流程級」skill 的需求比想像中更大。
- **Tech Stack**:Shell + Markdown skill 定義,透過各家 agent 的 plugin/marketplace 機制安裝。
- **上手難度**:低——照 README 列的介面(Claude Code / Codex / Cursor…)挑一種裝上即可,不用改程式碼。

---

### elementalsouls/Claude-BugHunter ★ 25,147 (+1,597)

[GitHub](https://github.com/elementalsouls/Claude-BugHunter)　·　Python　·　開源(含贊助條款)

- **是什麼**:把 681 筆 HackerOne 公開漏洞報告拆解成 85 個技能、16 個 slash command 的 Claude Code 外掛,涵蓋 24 類核心漏洞和企業身分/基礎設施(M365、Okta、vCenter、SharePoint)攻擊鏈。
- **為什麼值得看**:不是「教 AI 用某個掃描工具」,而是把真實 bug bounty 報告的手法、繞過表、CVE 鏈整理成會依描述自動觸發的技能,還內建 Burp MCP 整合和交付前檢查關卡——等於把一個資深 red team operator 的工作習慣打包成外掛,今天單日 +1,597 顆星是全站第一。
- **Tech Stack**:Claude Code Skills + Plugin 系統,選配 HackerOne MCP(讀自己帳號的私有 program/report)。
- **上手難度**:低——`/plugin install claude-bughunter@elementalsouls` 一行裝完,HackerOne 帳號選填。

---

### google-labs-code/stitch-skills ★ 13,406 (+309)

[GitHub](https://github.com/google-labs-code/stitch-skills)　·　TypeScript　·　開源

- **是什麼**:Google Labs 官方出品,給 Stitch(Google 的 AI UI 設計工具)MCP server 配套的 Agent Skills library,依「Agent Skills 開放標準」寫,同時相容 Codex、Antigravity、Gemini CLI、Claude Code、Cursor、OpenCode。
- **為什麼值得看**:大廠親自把「怎麼正確呼叫自己的 MCP server」寫成可攜式技能,而不是丟一份 API 文件讓每個 agent 自己摸索——跟 Anthropic 這幾天才開放「MCP server 可以附帶 skill」的方向一致,顯示工具供應端開始把使用說明做成 agent 原生格式。
- **Tech Stack**:TypeScript,Agent Skills 開放標準 + Stitch MCP server,各家 agent 有各自的 plugin/marketplace 安裝路徑。
- **上手難度**:中——先完成 Stitch MCP 的連線設定,再依自己用的 agent(Codex 用 CLI 裝 marketplace、Claude Code/Cursor 用 `npx plugins add`、OpenCode 要手動複製技能資料夾)挑對應安裝方式。

---

### HKUDS/CLI-Anything ★ 66,612 (+746)

[GitHub](https://github.com/HKUDS/CLI-Anything)　·　Python　·　開源

- **是什麼**:香港大學數據科學研究團隊(HKUDS)的專案,目標是把任何軟體都包成一層 CLI,讓 agent(Pi、OpenClaw、nanobot、Cursor、Claude Code 等)能直接操作,還做了 CLI-Hub 讓社群貢獻、安裝別人包好的 CLI。
- **為什麼值得看**:多數 agent 工具解的是「讓 agent 用某個特定軟體」,CLI-Anything 想解的是更底層的「讓任何軟體都變成 agent 能操作的介面」這個共通問題——社群已經貢獻了 Obsidian、Joplin、Rekordbox、Calibre、ArcGIS Pro 等幾十個 CLI,日增 746 顆星顯示這個「萬能介面層」的方向頗受認同。
- **Tech Stack**:Python,`cli-anything-hub` 套件 + 社群貢獻的各軟體 CLI 包裝層。
- **上手難度**:中——先 `pip install cli-anything-hub`,再用 `cli-hub install <name>` 針對想操控的軟體逐一安裝,要自己找有沒有現成的 CLI 包裝。

---

### zhouxiaoka/autoclip ★ 17,266 (+774)

[GitHub](https://github.com/zhouxiaoka/autoclip)　·　本機桌面應用　·　MIT

- **是什麼**:開源版 OpusClip——丟一個連結、影片檔或直播重播,本機就能自動找出精華片段、加字幕封面,輸出適配抖音/小紅書/TikTok/Reels/YouTube Shorts 的短影片,內建 MCP server 讓 agent 也能呼叫。
- **為什麼值得看**:「本機跑、零訂閱」是它跟 OpusClip 類 SaaS 最大的差別——可以接 Ollama/LM Studio + Whisper/SenseVoice 全離線運作,v1.6 還加了 OBS/Twitch/YouTube/Kick 直播重播來源;內建 MCP server 代表這類消費級工具也開始預設「要讓 agent 呼叫」。
- **Tech Stack**:本機桌面應用 + 內建 MCP server,可選 Ollama/LM Studio(LLM)與 Whisper/SenseVoice(語音辨識)全離線運作。
- **上手難度**:低——下載桌面版即可搭雲端 API key 使用;要全離線跑則需另外裝好 Ollama/LM Studio。

## Notable Releases

### Pydantic AI v2.76.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.76.0)

- **重要變更**:Realtime session 新增 `UpdateTools`,讓支援的模型能在對話中途「揭露」新工具(透過 `RealtimeModelProfile.supports_tool_updates`);對 `gemini-2.5-pro`／`gemini-2.5-flash` 的請求開始丟出 `DeprecatedModelWarning`;`SummarizingCompaction`／`RelevanceCompaction` 的行為改變,之後每次執行都會重新摘要整段歷史,不再延用上次的摘要結果。
- **Breaking Changes**:有——窮舉 `RealtimeInput` 的 `assert_never` 型別檢查會因新增 `UpdateTools` 而失敗;把 warning 轉成 error 的專案會因 Gemini 2.5 的 deprecation warning 而中斷。
- **對你的影響**:有用 exhaustive match 處理 `RealtimeInput` 的要補上新分支;CI 裡設了 `filterwarnings = error` 的人升級前要先排除這個 warning;用 `message_history` 延續對話並搭配摘要壓縮的應用,重跑時的 token 成本可能上升,要改接 `result.all_messages()` 自行保存已壓縮的歷史才能避免。

---

### modelcontextprotocol/servers v2.6.0

[Release Notes](https://github.com/modelcontextprotocol/servers/releases/tag/v2.6.0)

- **重要變更**:一次修掉 8 個安全漏洞,集中在 `mcp-server-git`(Git LFS 可被指使任意執行程式、`--repository` root 可被指到別的倉庫、`git_remote` 會洩漏憑證、`repo_path` 可被用來讀環境變數、`objects/info/alternates` 可讀到別的倉庫物件)、`@modelcontextprotocol/server-memory` 的 `saveGraph` 權限問題、`mcp-server-fetch` 的修補,以及 Windows 上 `server-filesystem` 的修補。
- **Breaking Changes**:無功能性 breaking change,但多處行為被收緊(例如 Git LFS 下載預設關閉、`repo_path` 不再展開環境變數),依賴這些舊行為的人要留意。
- **對你的影響**:有跑這幾個官方 MCP reference server 的人應立即升級:`mcp-server-git` → 2026.11.27、`@modelcontextprotocol/server-memory` → 2.2.2、`mcp-server-fetch` → 2026.11.27,Windows 上的 `@modelcontextprotocol/server-filesystem` → 2.4.1。

## 今日收穫

之前以為 skill 只是把常用 prompt 範本包起來,但 Claude-BugHunter 把 681 筆公開漏洞報告拆成 85 個會依描述自動觸發的技能、還疊了「思考→打→踩點→交付」四層流程,才發現 skill 正在變成把一整套領域方法論變成可執行流程的新單位,而不只是省打字;google-labs-code/stitch-skills 進一步說明,連大廠自己的 MCP server 現在都傾向用技能、而不是 API 文件,來告訴 agent 該怎麼用。

## 參考資料

- [obra/superpowers](https://github.com/obra/superpowers)
- [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter)
- [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills)
- [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything)
- [zhouxiaoka/autoclip](https://github.com/zhouxiaoka/autoclip)
- [GitHub Trending Intelligence Archive — 2026-11-27](https://raw.githubusercontent.com/jastfan/github-trending/main/archives/2026-11/2026-11-27.md)
- [Pydantic AI v2.76.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.76.0)
- [modelcontextprotocol/servers v2.6.0 Release Notes](https://github.com/modelcontextprotocol/servers/releases/tag/v2.6.0)
