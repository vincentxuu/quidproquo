---
title: "AI Agent GitHub Digest — 2026-11-05"
date: 2026-11-05
category: daily
tags: [ai-agent, github, open-source, daily, mcp, computer-use, reverse-engineering]
lang: zh-TW
description: "REA 逆向工程工具三週衝上 43 萬星，同時撞上 Anthropic 對逆向工程請求的限制；agent-desktop 三天內星數翻倍；Scrapling 替老牌爬蟲框架補上 MCP server——三個都走「先做紮實底層，再接 agent 工具層」的路線"
tldr: "morluto/rea(⭐430k)把 Ghidra、Hopper 等逆向工程引擎包成 MCP 工具給 agent 用，三週衝上新高的同時，傳出 Anthropic 開始限制 Claude 做部分逆向工程任務、甚至對逆向 Claude Code 本身的開發者發出移除通知；vercel-labs/agent-desktop(⭐14.6k)靠 OS 原生 accessibility tree 取代截圖讓 agent 操作電腦，三天內星數翻倍；D4Vinci/Scrapling(⭐96k)是做了一年多的爬蟲框架，最近補上原生 MCP server，讓 agent 不用自己想辦法繞反爬就能直接下指令。今天沒有重要框架 release。"
series:
  name: "AI Agent GitHub Digest"
  order: 82
---

> 🌏 [English version](/posts/daily/2026-11-05-ai-agent-github-digest-en)


## 今日亮點

今天上榜的三個 repo 剛好示範同一條路線的三種走法：先把一件事的底層能力做紮實，再接一層 MCP 給 agent 用，而不是從零打造一個「agent 專用」工具。REA 把既有的逆向工程引擎包成 MCP 外掛，三週內星數衝上 43 萬，但同一段時間也撞上 Anthropic 對逆向工程請求的限制，熱度和政策風險一起在漲；agent-desktop 延續上週才報過的成長曲線，三天內星數翻了一倍；Scrapling 則是做了一年多的爬蟲框架，最近才補齊 MCP 這一層。

## Trending Repos

### morluto/rea ⭐ 430k

[GitHub](https://github.com/morluto/rea)　·　TypeScript　·　MIT

- **是什麼**：把 Ghidra、Hopper 等現有逆向工程引擎統一包成一套 MCP 工具集，讓 agent 能直接分析 native binary、JS/Electron 應用、.NET 組件到 Android APK，回答「這個功能是怎麼做的」時附上反組譯證據，不需要原始碼。
- **為什麼值得看**：10 月中才以獨立工具介紹過一次（詳見[工具推薦｜REA](/posts/daily/2026-10-13-tool-rea)），三週內星數一路衝到 43 萬。但同一段時間傳出 Anthropic 開始在 Claude Code／Opus 5.5 封鎖部分逆向工程請求（疑似對應一條「不重建特定既有遊戲」的規則），也對一名嘗試逆向 Claude Code 本身的開發者發出了移除通知。一個讓任何人都能逆向任何軟體的工具，正好撞上商業授權與著作權法的灰色地帶——Cornell Tech 法學教授 James Grimmelmann 形容這會是商業機密與著作權法的一場危機。
- **tech stack**：TypeScript 包裝層 + MCP server，底層呼叫 Ghidra／IDA／Hopper 等既有逆向工程引擎
- **上手難度**：中——`npx` 可裝，但分析結果仍要讀懂反組譯輸出，而且要先確認目標軟體的授權允不允許逆向

---

### vercel-labs/agent-desktop ⭐ 14.6k

[GitHub](https://github.com/vercel-labs/agent-desktop)　·　Rust　·　Apache-2.0

- **是什麼**：給 agent 用的電腦操作 CLI，靠 macOS／Windows／Linux 原生的無障礙（accessibility）API 讀畫面上的元件樹，回傳帶穩定 ref 的 JSON 快照，取代讓模型對著截圖猜座標的做法。
- **為什麼值得看**：11/2 的 digest 介紹過一次（詳見[11/2 GitHub Digest](/posts/daily/2026-11-02-ai-agent-github-digest)），當時 6.5k 星；三天後星數來到 14.6k，漲幅超過一倍。走 accessibility tree 比截圖式操作的優勢在於元件 ref 穩定，動作失敗可以直接重試，不用每次重新辨識座標。
- **tech stack**：Rust 核心 + 各平台原生 accessibility API，提供 CLI 與 C library 兩種呼叫方式
- **上手難度**：低——npm／Homebrew／直接下載三種方式都能裝，裝完就有觀察、操作、鍵鼠、App 管理等分類指令可用

---

### D4Vinci/Scrapling ⭐ 96k

[GitHub](https://github.com/D4Vinci/Scrapling)　·　Python　·　BSD-3-Clause

- **是什麼**：從單次請求到大規模爬蟲都能處理的網頁爬蟲框架，內建對抗 Cloudflare 等反爬機制的隱身瀏覽器、CSS／XPath 解析器，以及不寫程式也能互動操作的 shell。
- **為什麼值得看**：這個專案做了一年多，一路靠解析效能和反爬能力累積到快 10 萬星；最近補上原生 MCP server，讓 agent 不用自己想辦法繞過反爬機制，直接下爬蟲指令就能拿到結構化資料。跟 REA、agent-desktop 一樣，走的是「先把底層能力做紮實，再接一層 MCP 給 agent 用」這條路線。
- **tech stack**：Python，內建 stealth fetcher（繞過 Cloudflare 等防護）、並行爬蟲搭配 session／proxy 輪換、原生 MCP server
- **上手難度**：低——`pip install` 後 CLI 指令或互動 shell 就能直接抓資料，進階的並行 spider 才需要額外設定

## Notable Releases

今天沒有重要框架更新。CrewAI 1.15.35（11/3）只改了 LiteLLM 型號對照文件；LangGraph SDK 0.4.12（11/3）只是拿掉 `PrioritySettings` 裡的 `fairness_weight` 欄位，外加修一個串流重連的小 bug，兩個都不到「重要新功能或 breaking change」的門檻。

## 今日收穫

過去我把「agent 工具好不好用」放在技術能力上評分——能分析多少格式、速度多快。REA 這幾天的爭議提醒我，工具一旦讓逆向工程變得人人都會用，下一個瓶頸往往不是技術，而是著作權與授權這條法律線——Anthropic 這次對逆向工程請求的限制，比任何一次模型能力升級都更快改變了這個工具能拿來做什麼。

## 參考資料

- [morluto/rea — GitHub repo](https://github.com/morluto/rea)
- [Anthropic's Claude AI blocks video game cloning and reverse-engineering — Tom's Hardware](https://www.tomshardware.com/tech-industry/artificial-intelligence/anthropics-ai-model-is-now-blocking-attempts-at-video-game-recreation-and-cloning-users-also-claim-non-malicious-generic-reverse-engineering-tasks-are-blocked)
- [Anthropic sent a takedown notice to a dev trying to reverse-engineer its coding tool — Yahoo Finance](https://finance.yahoo.com/news/anthropic-sent-takedown-notice-dev-215709151.html)
- [vercel-labs/agent-desktop — GitHub repo](https://github.com/vercel-labs/agent-desktop)
- [D4Vinci/Scrapling — GitHub repo](https://github.com/D4Vinci/Scrapling)
- [CrewAI 1.15.35 — Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.35)
- [LangGraph SDK 0.4.12 — Release Notes](https://github.com/langchain-ai/langgraph/releases)
