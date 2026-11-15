---
title: "AI Agent GitHub Digest — 2026-11-09"
date: 2026-11-09
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, context-management, multi-agent, mcp]
lang: zh-TW
description: "anthropics/skills 自己在 README 承認 Agent Skills 標準不綁 Claude，billion-context 想幫 agent 把 token 帳單砍到五分之一，sandbox-mcp 讓 agent 自己開一台用完就丟的 Windows"
tldr: "anthropics/skills 今天在 GitHub trending 單日漲 793 星，repo 自己在 README 說明完整的 Agent Skills 標準規格在 agentskills.io、不綁定 Claude，顯示「技能」正從 Claude 的功能名稱走向跨平台格式。"
series:
  name: "AI Agent GitHub Digest"
  order: 86
---

> 🌏 [English version](/posts/daily/2026-11-09-ai-agent-github-digest-en)

## 今日亮點

今天 anthropics/skills 衝上 GitHub trending、單日漲了 793 星，repo 開頭的 Note 直接寫明：這裡放的是 Anthropic 自己對 Claude 做的 skills 實作，完整的 Agent Skills 標準規格在 agentskills.io——等於官方自己承認「技能」已經不只是 Claude 的功能名稱，而是在走向一個不綁定單一平台的格式。同一天另外三個 repo 補的是完全不同的三塊：billion-context 想用壓縮把 agent 的 context 帳單砍到五分之一；OpenMausBot 讓使用者能用聊天介面同時管理好幾個 agent 分身；sandbox-mcp 則讓 agent 自己開一台全新、用完就丟的 Windows 做測試。

```diagram
title: 今天四個 repo 補的四塊 Agent 基礎設施缺口
desc: 標準化、成本、多代理協作、測試環境——四個互不相關的問題，剛好對應今天上榜的四個 repo
caption: 示意：本文用來說明四個 repo 定位的簡化分類，不是業界標準分層
---
<svg viewBox="0 0 480 300">
  <rect class="dg-box dg-box--accent" x="16" y="16" width="448" height="60" rx="6"/>
  <text class="dg-tag" x="32" y="36" dominant-baseline="central">標準化</text>
  <text class="dg-label" x="104" y="36" dominant-baseline="central">Agent Skills 格式</text>
  <text class="dg-sub" x="104" y="58" dominant-baseline="central">anthropics/skills・規格不綁 Claude</text>

  <rect class="dg-box" x="16" y="88" width="448" height="56" rx="6"/>
  <text class="dg-tag" x="32" y="116" dominant-baseline="central">成本</text>
  <text class="dg-label" x="104" y="116" dominant-baseline="central">Context 壓縮</text>
  <text class="dg-sub" x="104" y="134" dominant-baseline="central">billion-context・宣稱省 5 倍 token</text>

  <rect class="dg-box" x="16" y="152" width="448" height="56" rx="6"/>
  <text class="dg-tag" x="32" y="180" dominant-baseline="central">多代理</text>
  <text class="dg-label" x="104" y="180" dominant-baseline="central">多個 agent 分身</text>
  <text class="dg-sub" x="104" y="198" dominant-baseline="central">OpenMausBot・聊天介面同時管理</text>

  <rect class="dg-box" x="16" y="216" width="448" height="56" rx="6"/>
  <text class="dg-tag" x="32" y="244" dominant-baseline="central">測試環境</text>
  <text class="dg-label" x="104" y="244" dominant-baseline="central">用完即丟的機器</text>
  <text class="dg-sub" x="104" y="262" dominant-baseline="central">sandbox-mcp・乾淨 Windows Sandbox</text>
</svg>
```

## Trending Repos

### anthropics/skills ⭐ 約 18.9 萬（11/9 單日 +793）

[GitHub](https://github.com/anthropics/skills)　·　Python　·　多數子目錄 Apache-2.0

- **是什麼**：Anthropic 官方維護的 Agent Skills 公開 repo——一批示範用的 skill 資料夾（Creative、Development、Enterprise、文件類），加上獨立的 Agent Skills 規格（`spec/`）跟 skill template，每個 skill 用一份 `SKILL.md` 說明指令和 metadata。
- **為什麼值得看**：repo 開頭的 Note 寫得很明白——這裡只是 Anthropic 自己對 Claude 的 skills 實作，完整的 Agent Skills 標準規格要看 agentskills.io，等於官方自己承認「技能」正在往不綁定單一平台的格式發展。repo 裡還直接開源了 Claude 產文件功能背後實際在用的 docx、pdf、pptx、xlsx 四個 skill 原始碼，給開發者當複雜 skill 的參考範例。今天單日 +793 星，是這幾天 trending 榜上少見「本來就有十幾萬星的大 repo 還在加速」的案例。
- **tech stack**：skill 資料夾 + `SKILL.md` metadata + 獨立 `spec/`（Agent Skills 規格）+ `template/`
- **上手難度**：低——在 Claude Code 跑 `/plugin marketplace add anthropics/skills` 就能挑 skill 裝

---

### ranxianglei/billion-context ⭐ 約 5,027（11/9 單日 +460）

[GitHub](https://github.com/ranxianglei/billion-context)　·　TypeScript　·　MIT

- **是什麼**：一個 context 壓縮外掛，目標是讓「100K context window」也能撐住「數十億 token 等級、長達整個月」的單一對話，宣稱可以把 token 用量壓到五分之一。
- **為什麼值得看**：它沒有自己做一個新的 agent CLI，而是同時相容十幾種現有工具——README 列出的支援清單包括 Claude Code、Codex、OpenCode、pi、Gemini CLI、Kimi、Qwen Code、GitHub Copilot CLI、TRAE、CodeBuddy。如果壓縮品質真的夠，對「長時間跑 coding agent」的帳單是直接有感的改善，而且不用換掉現在在用的工具。
- **tech stack**：npm 套件，以 plugin 形式掛進各家 agent CLI 的 context 管線
- **上手難度**：低——`npm install -g billion-context --prefix=~/.local`

---

### milind-soni/OpenMausBot ⭐ 約 1.8 萬（11/9 單日 +1,437）

[GitHub](https://github.com/milind-soni/OpenMausBot)　·　TypeScript　·　Apache-2.0

- **是什麼**：開源的「Grok Bot」替代品——聊天介面的側邊欄裡每個聯絡人都是一個真的在跑的 agent（底層是 Claude 或 Codex），各自有自己的個性、模型、雲端電腦跟已連接的 app，使用者像聊天一樣跟它們互動、看它們工作、批准要執行的事。
- **為什麼值得看**：市面上已經有 Grok Bot、Meta Muse、OpenAI dots、Manus Cue 這類多代理聊天介面，但都是封閉平台；OpenMausBot 是開源、bring-your-own-agent、local-first 的版本，直接用使用者已經有的 Claude 或 Codex 存取權限跑，不綁死特定供應商的模型。上線短短一天衝了 1,437 星，顯示「同時帶著好幾個 agent 分身跑」這個介面需求是真實存在的。
- **tech stack**：TypeScript + React + Electron，底層接 Claude／Codex agent
- **上手難度**：中——需要自己有 Claude 或 Codex 的存取權限，且每個 bot 都各自開一台雲端電腦

---

### shanselman/sandbox-mcp ⭐ 322（上線 3 天）

[GitHub](https://github.com/shanselman/sandbox-mcp)　·　JavaScript　·　MIT

- **是什麼**：把 Windows Sandbox（Windows 內建的一次性虛擬機）包成 CLI 跟 MCP server，讓 agent 自己開一台全新、斷網的 Windows 11，部署 app、操作 UI、抓 crash、留證據，用完整台機器直接丟掉。
- **為什麼值得看**：作者是知名開發者 Scott Hanselman；跟容器模擬 Windows 不同，這是真的一台乾淨 Windows 機器，量到的 GUI 測試樣本大概 40–50 秒跑完整趟（開機到銷毀）。CLI 本身可以獨立用，MCP 只是選配的 agent 介面，兩邊共用同一套 engine。文件裡的示範案例直接抓到「開發機裝了 VC++ redistributable、乾淨客戶機沒裝」這種只有在真的乾淨環境才會重現的 bug。
- **tech stack**：Node.js CLI（`sbx`）+ 選配 MCP adapter + Windows Sandbox + UIA（UI Automation）
- **上手難度**：中——限 Windows 11（要支援 Sandbox 功能），第一次要跑系統檢查跟下載驗證

## Notable Releases

今天檢查的框架都沒有過 48 小時門檻的重要更新：LangGraph 只多了 `sdk==0.4.14`、`cli==0.4.42` 兩個 patch；pydantic-ai 的安全性 release v2.66.0 是 11/4 發的，已經過了 48 小時窗口；CrewAI 1.15.37 [昨天的 digest 已經報過](/posts/daily/2026-11-08-ai-agent-github-digest)，這裡不重複。今日無重要框架更新。

## 今日收穫

原本以為「Agent Skills」只是 Claude 這個產品裡的一個功能名字，但看到 anthropics/skills 自己在 README 承認「完整標準在 agentskills.io，不綁定 Claude」才意識到——這其實是在走 MCP 走過的那條路：先是某家公司自己的協定，後來變成整個生態系都要對齊的標準。

## 參考資料

- [anthropics/skills — GitHub repo](https://github.com/anthropics/skills)
- [Agent Skills 標準規格 — agentskills.io](https://agentskills.io/)
- [ranxianglei/billion-context — GitHub repo](https://github.com/ranxianglei/billion-context)
- [milind-soni/OpenMausBot — GitHub repo](https://github.com/milind-soni/OpenMausBot)
- [OpenMausBot 官方網站](https://www.openmausbot.com/)
- [shanselman/sandbox-mcp — GitHub repo](https://github.com/shanselman/sandbox-mcp)
- [sandbox-mcp 官方網站](https://shanselman.github.io/sandbox-mcp/)
- [CrewAI 1.15.37 — Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.37)
