---
title: "AI Agent GitHub Digest — 2026-11-22"
date: 2026-11-22
category: daily
tags: [ai-agent, github, open-source, daily, claude-code, agent-memory, mcp]
lang: zh-TW
description: "Claude Code v2.1.330 補上企業帳號登入與內建畫圖 mod；同一天 agentmemory 用一套 memory server 同時接 12 種 agent runtime，把「記憶」做成跨工具共用層"
tldr: "Claude Code v2.1.330 加入 Enterprise Admin Console 帳號登入與內建圖表 mod「easel」；agentmemory（3萬星）用 54 個 MCP 工具同時服務 Claude Code、Codex、Copilot CLI 等十幾種 agent；obra/superpowers 漲勢放緩但仍穩坐 32 萬星；Replit 也下場做自架個人 agent「amuse」。"
series:
  name: "AI Agent GitHub Digest"
  order: 99
---

> :globe: [English version](/posts/daily/2026-11-22-ai-agent-github-digest-en)

## 今日亮點

昨天的主題是「skill 套件打包一切」，今天往基礎設施的下一層延伸：Claude Code 升級到 v2.1.330，補上企業帳號登入和內建畫圖 mod；同一天，agent 記憶層冒出一個明確走「共用層」路線的選手——`agentmemory` 不綁定單一 agent，用同一個 memory server 同時接 Claude Code、Codex CLI、Copilot CLI 等十幾種 runtime。跟昨天 skill 套件的邏輯放在一起看，「方法論」和「記憶」都在往「所有 agent 共用一層、而非各自為政」的方向收斂。

## Trending Repos

### rohitg00/agentmemory ★30,517

[GitHub](https://github.com/rohitg00/agentmemory)　·　TypeScript　·　Apache-2.0

- **是什麼**：一個獨立跑在本機的 memory server，用 hooks + MCP 幫 coding agent 記住之前的 session、決策和修過的 bug，之後可以在不同 agent 之間互相讀取。
- **為什麼值得看**：市面上多數 agent memory 工具是綁單一 runtime（例如只接 Claude Code），這個反過來做成中立層——54 個 MCP 工具、12 組自動 hooks，一次接 Claude Code、Codex CLI、GitHub Copilot CLI、Cursor、Gemini CLI 等對象，換 agent 不用重新累積記憶。keyless 模式下用 BM25 做關鍵字搜尋就能跑，不一定要接嵌入模型。
- **Tech Stack**：Node.js 服務 + MCP server（54 tools）+ 本地可選嵌入模型 `Xenova/all-MiniLM-L6-v2`（語義搜尋用）+ 知識圖譜混合檢索，宣稱 0 個外部資料庫依賴
- **上手難度**：低——`npx -y @agentmemory/agentmemory@latest` 一行指令起服務，keyless 模式不需要任何 API key

---

### obra/superpowers ★323,562

[GitHub](https://github.com/obra/superpowers)　·　Shell　·　MIT

- **是什麼**：把一整套軟體開發方法論（先問需求、拆 spec、紅綠 TDD、YAGNI）包成可安裝的 Claude Code / Codex / Cursor 等多 harness skill，裝上去後 agent 動手前會先逼你把規格講清楚。
- **為什麼值得看**：昨天被同類型的 `mattpocock/skills` 反超（32.9 萬 vs 32.4 萬星），但今天兩邊的單日漲幅都明顯放緩到數百顆星的量級，不再是上千顆的衝刺——這代表「skill 套件」這個分發型態本身可能已經過了最陡的擴散期，開始進入比拼長期留存而不是比誰裝機量衝得快的階段。
- **Tech Stack**：Shell 腳本 + Markdown skill 定義，相容 Claude Code、Antigravity、Codex CLI/App、Cursor、Gemini CLI 等 15 種以上 agent harness
- **上手難度**：中——skill 本身裝起來快，但要配合它規定的「先寫 spec、再排計畫、才動手」工作流才會有效果，不是裝了就自動變快

---

### elementalsouls/Claude-BugHunter ★15,662 (+約1,800/日)

[GitHub](https://github.com/elementalsouls/Claude-BugHunter)　·　Python　·　MIT

- **是什麼**：把 83 個 bug bounty / 紅隊測試 skill、15 個斜線指令、681 筆已公開揭露報告的攻擊模式打包成 Claude Code skill 套件，涵蓋 24 類核心漏洞和企業身分、基礎設施攻擊鏈。
- **為什麼值得看**：連續第二天出現在漲幅前段，今天單日又多了近 1,800 顆星，顯示「把長年漏洞知識包成可安裝 skill」這個產品形態的需求還在持續擴大，不是一次性的話題效應。值得提醒讀者的是這個專案由 ApiSmart、ThreatWatch360 兩家安全公司贊助，使用前仍該自行核對攻擊鏈資訊的時效性。
- **Tech Stack**：Claude Code Skills 系統 + Burp Suite MCP 整合，skill 依描述內容自動觸發、不需要手動點名呼叫
- **上手難度**：中——裝好即用，但要正確設定測試範圍與授權才能用在真實目標上

---

### replit/amuse ★123（上線 2 天）

[GitHub](https://github.com/replit/amuse)　·　TypeScript　·　Apache-2.0

- **是什麼**：Replit 官方帳號發的自架個人 AI agent——有即時瀏覽器代操、提醒與背景監控、把目標拆成步驟計畫、記憶用純文字檔存放，所有「送出、提交、付款」動作都要先經過你核准。
- **為什麼值得看**：星數還小（上線兩天 123 顆），但值得放進來的理由是來源——這是 Replit 官方帳號而非個人專案，說明做 IDE/雲端開發平台的公司也在往「你自己電腦上的個人助理」這個方向擴張產品線，跟 OpenAI、Google 的消費端 agent 產品形成直接對照。只需要一組 OpenAI key、不綁 Replit 自家帳號或服務。
- **Tech Stack**：Node.js 22.9+ / pnpm + PostgreSQL + 內嵌 Chromium（即時瀏覽器）+ OpenAI（`gpt-6.2-sol` 主模型、`gpt-6-luna` 跑快速步驟、`gpt-image-2` 生圖）
- **上手難度**：中——`docker compose up` 一行起服務，但要自備 OpenAI API key 並自己設定每日用量上限

## Notable Releases

### Claude Code v2.1.330

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.330)

- **重要變更**：登入時可以直接套用 Anthropic Enterprise Admin Console 管理的組織設定（自動接組織指定的 cloud provider 或 gateway）；新增內建 mod「easel」，被要求畫圖或看到 MCP 指標結果時會自動畫圖表（Pro/Max，Mac/Linux 上 Team、Enterprise 視方案而定），可在 `/config` 關掉；`/tasks` 整合、self-hosted runner 補了多項 metrics 與「plugin 倉庫不在這個 session 範圍內」的提示。
- **Breaking Changes**：無。
- **對你的影響**：企業帳號登入免再手動套組織設定；如果不想要自動畫圖，記得去 `/config` 關掉 easel；用 self-hosted runner 的團隊可以直接從新 metrics 看 runner 從派工到接手的延遲。

## 今日收穫

之前看 agent memory 類工具時預設「一定是某個框架自己配的功能」，今天才注意到已經有人把它拆成獨立於任何框架、同時服務十幾種 agent runtime 的中立服務——跟 skill 套件的邏輯一樣：贏的不是框架本身，而是誰能把某個能力（方法論、記憶）做成所有工具都能接的共用層。

## 參考資料

- [rohitg00/agentmemory](https://github.com/rohitg00/agentmemory)
- [obra/superpowers](https://github.com/obra/superpowers)
- [obra/superpowers v7.0.2 release notes](https://github.com/obra/superpowers/releases/tag/v7.0.2)
- [mattpocock/skills（對照用星數來源）](https://github.com/mattpocock/skills)
- [elementalsouls/Claude-BugHunter](https://github.com/elementalsouls/Claude-BugHunter)
- [replit/amuse](https://github.com/replit/amuse)
- [Claude Code v2.1.330 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.330)
