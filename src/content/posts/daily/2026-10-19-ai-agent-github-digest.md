---
title: "AI Agent GitHub Digest — 2026-10-19"
date: 2026-10-19
category: daily
tags: [ai-agent, github, open-source, daily, multi-agent, agent-orchestration, agent-skills]
lang: zh-TW
description: "Orca 和 AgentTeams 從兩個方向解同一個問題——怎麼讓人類看得到、管得了一群 agent；anatomy 則示範 agent skill 開始往精緻視覺輸出發展"
tldr: "**stablyai/orca**（96,374★）是 YC 背書的桌面「agent 艦隊」orchestrator，讓 Claude Code／Codex／Grok 等多個 coding agent 各自跑在獨立 git worktree，桌面＋手機隨行監看；**agentscope-ai/AgentTeams**（5,772★）是阿里 AgentScope 團隊做的多 Agent OS，用既有的 Matrix 聊天協定當協作底層，讓 agent 之間與人類的溝通預設可見可審計；**wheresryan22/anatomy**（15,866★）是一個 Claude Code 相容的 agent skill，把技術概念畫成會動的等角透視機械插圖，創 repo 10 天衝上 1.5 萬星。今日無重要框架 release（langgraph、claude-code 在 48 小時內都只有不帶重大變更的 patch）。"
series:
  name: "AI Agent GitHub Digest"
  order: 65
---

> 🌏 [English version](/posts/daily/2026-10-19-ai-agent-github-digest-en)

## 今日亮點

今天沒有搶眼的框架大改版，但三個上榜的 repo 剛好從三個角度在解同一件事——怎麼讓「一群 agent」這件事對人類可見、可管：Orca 用桌面＋手機的 UI 層解，AgentTeams 用既有的 Matrix 聊天協定當協作底層解，殊途同歸，都把「管一群 agent」本身當成產品，而不只是「編排演算法要多聰明」。

## Trending Repos

### stablyai/orca ⭐ 96,374

[GitHub](https://github.com/stablyai/orca)　·　TypeScript（Electron）　·　MIT

- **是什麼**：桌面版 AI agent orchestrator，讓你同時啟動 Claude Code、Codex、OpenCode、Grok 等多個 CLI coding agent，各自跑在獨立的 git worktree 裡，桌面和手機都能監看進度、下指令。
- **為什麼值得看**：YC 背書，用的是你自己現有的 Claude／Codex 等訂閱，不用另外接模型 API；跟多數「單一 agent」工具不同的地方在於它把「同一個 prompt 平行跑五個 agent、比較結果再合併」當成第一等公民功能，另外還有 Design Mode（點 UI 元素就把 HTML／CSS／截圖餵進 agent prompt）、GitHub／Linear 整合、SSH 遠端 worktree，整個把「管理一群 agent」做成完整產品。
- **Tech stack**：Electron 桌面應用 + git worktree 隔離 + SSH 遠端執行 + iOS／Android 隨行 app
- **上手難度**：低——直接下載桌面安裝檔或 `brew install --cask stablyai/orca/orca`，背後接的是你自己原有的 Claude Code／Codex 訂閱。

---

### agentscope-ai/AgentTeams ⭐ 5,772

[GitHub](https://github.com/agentscope-ai/AgentTeams)　·　Go（控制平面）＋ Node.js／Python（Worker runtime）　·　Apache-2.0

- **是什麼**：阿里 AgentScope 團隊做的開源「協作式多 Agent OS」，採 Manager-Workers 架構，所有 agent 之間、agent 與人類之間的溝通都走 Matrix 聊天室（前端用 Element Web），而不是藏在框架內部看不到的呼叫鏈裡。
- **為什麼值得看**：選擇用既有的聯邦式聊天協定 Matrix 當協作底層，而不是自己另起一個 dashboard，讓 agent 協作預設就是「可見、可審計、可介入」；更實際的是安全模型——Worker 只拿消費者 token，真正的 API key、GitHub PAT 全部留在 Higress AI Gateway，Worker 被攻破也碰不到真憑證。
- **Tech stack**：Kubernetes-native controller（Go）+ Matrix（Tuwunel）IM 伺服器 + MinIO 共享檔案系統 + Higress AI Gateway
- **上手難度**：中——本機一行 `curl | bash` 跑 Docker 版即可試用，正式或多人環境則要透過 Helm 裝上 Kubernetes。

---

### wheresryan22/anatomy ⭐ 15,866

[GitHub](https://github.com/wheresryan22/anatomy)　·　JavaScript（Node 內建模組）　·　MIT

- **是什麼**：一個 Claude Code 相容的 agent skill（也能跑在 Antigravity／OpenCode／Codex／MiniMax Code），把一個技術概念畫成一個「真的會動」的等角透視機械插圖——例如把「cache key 讓沒變動的工作直接跳過」畫成一把只有每根插銷都對齊才會轉動的插芯鎖。
- **為什麼值得看**：從建立到衝上 1.5 萬星只花了約 10 天，顯示 agent skill 生態不再只產出文字或程式碼，開始往「產出精緻視覺內容」這個方向發展；而且刻意做成跨 agent 相容，不綁死在單一平台上。
- **Tech stack**：純 Node.js 內建模組（zero dependencies）+ SVG／WebGL + 選配 React／Next.js 元件
- **上手難度**：低——`npx skills add wheresryan22/anatomy -g` 一行裝好，不需要任何 API key。

## Notable Releases

今日無重要框架更新。langgraph（1.2.16）、claude-code 在過去 48 小時內各有一個 patch release，但都只是臭蟲修正，沒有 breaking changes 或重大新功能，不列入本篇。

## 今日收穫

之前以為「多 agent 協作」最大的挑戰是編排演算法本身要多聰明，但 Orca 和 AgentTeams 從完全不同的切入點同時指向另一個更基本的問題——怎麼讓人類「看得到」且「管得了」一群 agent。Orca 選擇在 UI 層解（桌面＋手機介面），AgentTeams 選擇在協定層解（借用現成的 Matrix 聊天協定），兩邊都沒有把力氣花在發明新的協作演算法上，反而說明這件事本身可能比演算法設計更迫切。

## 參考資料

- [stablyai/orca](https://github.com/stablyai/orca)
- [Stably AI (Orca) — Y Combinator](https://www.ycombinator.com/companies/stably-ai-orca)
- [agentscope-ai/AgentTeams](https://github.com/agentscope-ai/AgentTeams)
- [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy)
- [8 Trending GitHub Repos for AI Developers — Tech Ninja](https://techninjaah.substack.com/p/8-trending-github-repos-for-ai-developers)
