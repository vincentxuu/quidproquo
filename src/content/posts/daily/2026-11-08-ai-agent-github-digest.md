---
title: "AI Agent GitHub Digest — 2026-11-08"
date: 2026-11-08
category: daily
tags: [ai-agent, github, open-source, daily, multi-agent, mcp, web-scraping, project-management]
lang: zh-TW
description: "paperclip 補上『管理一堆正在跑的 agent』那一層，Scrapling 把 MCP server 包進老牌爬蟲框架一天衝兩千星，hermes-agent 把 agent 裝進手機的 Termux"
tldr: "paperclipai/paperclip（約 11.2 萬星）是開源的 agent 專案管理 app，橫跨 Claude Code、Codex 等多個 harness；D4Vinci/Scrapling（約 9.9 萬星）把 MCP server 直接包進老牌爬蟲框架，11/6 單日漲了 1,655 星；NousResearch/hermes-agent（約 26 萬星）把 CLI agent 做成連 Android Termux 都有官方支援的跨平台工具。CrewAI 1.15.37 新增讓 agent 直接讀 spreadsheet 和獨立專案 scaffold 的功能。"
series:
  name: "AI Agent GitHub Digest"
  order: 85
---

> 🌏 [English version](/posts/daily/2026-11-08-ai-agent-github-digest-en)

## 今日亮點

今天榜上的三個 repo 剛好補在 agent 技術堆疊的三層，而且都是第一次上這個 digest：paperclip 把「管理一堆正在跑的 agent」做成獨立 app；Scrapling 把老牌爬蟲框架的 MCP server 直接包進套件，讓任何 agent 一行指令就能呼叫；hermes-agent 則把 agent 本體做成連 Android／Termux 都有官方支援的跨平台 CLI。三個加起來的訊號是——agent「能不能跑」已經不是重點，「跑起來之後怎麼管、怎麼接工具、裝在哪裡」才是現在在卷的地方。

```diagram
title: Agent 技術堆疊四層：從管理到工具執行
desc: paperclip 補上最上面的管理層，hermes-agent 是中間的 agent 本體，MCP 是工具協定層，Scrapling 補最底層的具體工具執行
caption: 示意：這是本文用來說明三個 repo 定位的簡化分層，不是業界標準分層
---
<svg viewBox="0 0 480 312">
  <path class="dg-axis" d="M16 40 V272" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="16" y="28" text-anchor="middle" dominant-baseline="central">全局</text>
  <text class="dg-tag" x="16" y="288" text-anchor="middle" dominant-baseline="central">單次</text>

  <rect class="dg-box dg-box--accent" x="36" y="24" width="428" height="72" rx="6"/>
  <text class="dg-tag" x="52" y="51" dominant-baseline="central">L4</text>
  <text class="dg-label" x="84" y="51" dominant-baseline="central">管理層</text>
  <text class="dg-sub" x="84" y="71" dominant-baseline="central">一個 app 統一管理正在跑的 agent</text>
  <text class="dg-sub" x="448" y="51" text-anchor="end" dominant-baseline="central">paperclip</text>

  <rect class="dg-box" x="36" y="104" width="428" height="56" rx="6"/>
  <text class="dg-tag" x="52" y="132" dominant-baseline="central">L3</text>
  <text class="dg-label" x="84" y="132" dominant-baseline="central">Agent 本體</text>
  <text class="dg-sub" x="448" y="132" text-anchor="end" dominant-baseline="central">hermes-agent・連手機都能跑</text>

  <rect class="dg-box" x="36" y="168" width="428" height="56" rx="6"/>
  <text class="dg-tag" x="52" y="196" dominant-baseline="central">L2</text>
  <text class="dg-label" x="84" y="196" dominant-baseline="central">工具協定</text>
  <text class="dg-sub" x="448" y="196" text-anchor="end" dominant-baseline="central">MCP・一次接就各家都能用</text>

  <rect class="dg-box" x="36" y="232" width="428" height="56" rx="6"/>
  <text class="dg-tag" x="52" y="260" dominant-baseline="central">L1</text>
  <text class="dg-label" x="84" y="260" dominant-baseline="central">具體工具</text>
  <text class="dg-sub" x="448" y="260" text-anchor="end" dominant-baseline="central">Scrapling・繞過 Cloudflare 驗證</text>
</svg>
```

## Trending Repos

### paperclipai/paperclip ⭐ 約 11.2 萬

[GitHub](https://github.com/paperclipai/paperclip)　·　TypeScript　·　MIT

- **是什麼**：開源的「agent 專案管理」app，管理一堆已經在公司裡跑的 agent——任務指派、進度、花費、審核流程，原生接 Claude Code、Codex、Gemini CLI、Cursor、Pi、OpenCode、OpenClaw。
- **為什麼值得看**：今天其他兩個 repo 都在補 agent 的能力（工具、裝置），paperclip 補的是完全不同的一層——agent 真的被當同事用之後，誰來管這堆 agent。它自己定義了一套 ACPX（Agent Communication Protocol Extended）協定，同時也支援標準 MCP 接外部服務（Slack、GitHub review bot、Notion、Railway…），2026 年 3 月上線到現在八個月衝過 11 萬星，顯示「管理 agent」正在變成跟「寫 agent」一樣大的需求。
- **tech stack**：Node.js + React + 內嵌 PostgreSQL（`npx` 裝完自動建資料庫，不用另外設定）+ MCP／ACPX 雙協定
- **上手難度**：低——`npx paperclipai@latest onboard --yes` 本機就能啟動 UI 和 API，自架免費，雲端託管還在 roadmap 上

---

### D4Vinci/Scrapling ⭐ 約 9.9 萬（11/6 單日 +1,655）

[GitHub](https://github.com/D4Vinci/Scrapling)　·　Python　·　BSD-3-Clause

- **是什麼**：2024 年 10 月上架的 Python 爬蟲框架，這次更新把「給 agent 用」做成一等公民——新增內建 MCP server 和 Agent Skill，讓 Claude Code 等 agent 直接呼叫，不用自己寫 wrapper。
- **為什麼值得看**：三種 fetcher 分層覆蓋從簡單到硬核的爬取場景——偽裝 TLS 指紋還能講 HTTP/3 的 stealth HTTP、真的開 Playwright Chromium、還有專門宣稱能過 Cloudflare Turnstile／Interstitial 的 StealthyFetcher。這次是靠「把 MCP server 直接包進套件」衝上熱榜，11/6 單日漲了 1,655 顆星，代表 agent 生態缺的不是爬蟲技術本身，是「讓 agent 可以直接呼叫」這一層。
- **tech stack**：Python + Playwright + 客製 TLS/HTTP3 指紋層 + 內建 MCP server（`scrapling[ai]` extra）
- **上手難度**：低——`pip install "scrapling[ai]"` 後跑 `scrapling install` 裝瀏覽器依賴，再用 `uvx scrapling mcp` 或掛官方 ghcr.io 容器開 MCP server

---

### NousResearch/hermes-agent ⭐ 約 26.1 萬

[GitHub](https://github.com/NousResearch/hermes-agent)　·　Python　·　MIT

- **是什麼**：跨平台的 CLI agent「Hermes」，一次安裝涵蓋模型選擇、gateway（Telegram／Discord 等通訊軟體入口）、subagent 平行執行、設定精靈，支援 Linux、macOS、Windows，連 Android／Termux 都做了官方簽章的 APT 倉庫。
- **為什麼值得看**：大多數 coding agent CLI 只顧好電腦這端，hermes-agent 連手機都做成官方支援（穩定頻道＋搶鮮版 canary channel），等於把「隨身帶著跑的 agent」變成官方功能而不是社群硬兜；內建 `computer-use-linux` 這個 MCP server，把 Linux 桌面操作（AT-SPI、Wayland／X11 輸入、視窗定位）直接變成 agent 的工具，不用額外接別的專案。
- **tech stack**：Python CLI + Node.js（gateway）+ 官方 `computer-use-linux` MCP server + Termux APT 簽章倉庫
- **上手難度**：低——裝完跑 `hermes setup --portal`，一次 OAuth 就能用 web search／image／TTS／browser 四個 Tool Gateway 工具

## Notable Releases

### CrewAI 1.15.37

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.37)

- **重要變更**：新增讓 agent 直接讀 spreadsheet 的功能（`crewai-files`），以及可以 scaffold／load 獨立 agent 專案的指令。
- **Breaking Changes**：無
- **對你的影響**：本來要自己寫程式碼讀 Excel／CSV 餵給 agent，現在 `crewai-files` 內建這個功能可以省掉這段；想快速起一個不綁在既有 crew 裡的獨立 agent 專案，也多了官方 scaffold 指令。

LangGraph SDK 今天只多了 `strict_resume` 跟 `StreamMode` 擴充兩個小功能，Composio CLI 的更新也還在 beta 頻道，都還沒到重要更新的門檻；Claude Code v2.1.319 [昨天的 digest 已經報過](/posts/daily/2026-11-07-ai-agent-github-digest)，這裡不重複。

## 今日收穫

原本覺得「agent 生態」講的都是模型或框架誰更聰明，但今天三個 repo 沒有一個在比模型——它們補的分別是管理層、工具協定層、裝置層，都是「agent 已經被當真的在用」之後才會長出來的基礎設施。這跟 11/3 claude-mem 擴大 harness 相容清單是同一個訊號，只是今天換了三個完全不同的切入點。

## 參考資料

- [paperclipai/paperclip — GitHub repo](https://github.com/paperclipai/paperclip)
- [GitHub Trending November 2026：paperclip 110K 星報導 — CoddyKit](https://www.coddykit.com/pages/blog-detail?id=5130017&slug=github-trending-november-2026-from-a-110k-star-agent-management-platform-to-a-38)
- [D4Vinci/Scrapling — GitHub repo](https://github.com/D4Vinci/Scrapling)
- [Agent Tools Today (6 Nov 2026)：Scrapling 單日漲幅 — munderdiffl.in](https://munderdiffl.in/blog/agent-tools-today-2026-11-06/)
- [NousResearch/hermes-agent — GitHub repo](https://github.com/NousResearch/hermes-agent)
- [Hermes Agent 官方文件（Termux／Tool Gateway）](https://hermes-agent.nousresearch.com/docs)
- [CrewAI 1.15.37 — Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.37)
