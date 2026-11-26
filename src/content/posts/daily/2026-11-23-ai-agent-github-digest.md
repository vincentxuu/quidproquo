---
title: "AI Agent GitHub Digest — 2026-11-23"
date: 2026-11-23
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, mcp, firecrawl]
lang: zh-TW
description: "CLI-Anything、last30days-skill 這類 skill 套件單日漲幅比兩三天前明顯放緩，但資料基礎設施 firecrawl/firecrawl 反而漲得更快——熱度正從「打包方式」轉向「agent 查得到什麼資料」"
tldr: "HKUDS/CLI-Anything、mvanhorn/last30days-skill 單日星數成長比兩三天前慢了三到四成；google-labs-code/stitch-skills 持續穩定成長；firecrawl/firecrawl 漲幅反而比前幾天更高。今日沒有符合門檻的重要框架更新。"
series:
  name: "AI Agent GitHub Digest"
  order: 100
---

> :globe: [English version](/posts/daily/2026-11-23-ai-agent-github-digest-en)

## 今日亮點

把今天候選名單跟兩三天前的同一批重新對一次，看到一個分岔：靠「skill 套件打包方式」吃熱度的幾個專案（CLI-Anything、last30days-skill）單日漲幅都比前幾天掉了三到四成，不是掉出榜單，是漲勢在收斂；但單純做「agent 查資料用的基礎設施」的 firecrawl，今天的單日漲幅反而比前幾天更高。打包方式本身的新鮮感在退，但「agent 到底能查到什麼」這個更底層的問題熱度沒退。

```diagram
title: 三個 repo 的單日新增星數，從幾天前到今天
desc: CLI-Anything 和 last30days-skill 單日漲幅都在縮小，firecrawl 反而在放大。
caption: 資料來源：GitHub Trending 當日擷取（CLI-Anything、last30days-skill 為 11/20 → 11/23；firecrawl 為 11/21 → 11/23）。換算：x = 200 + 單日星數 × 0.4。
---
<svg viewBox="0 0 640 330">
  <line class="dg-axis" x1="475" y1="90" x2="560" y2="90"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="560" cy="90" r="6"/>
  <circle class="dg-point dg-c-accent" cx="475" cy="90" r="6"/>
  <text class="dg-sub" x="463" y="90" text-anchor="end" dominant-baseline="central">687</text>
  <text class="dg-sub" x="572" y="90" dominant-baseline="central">899</text>
  <text class="dg-label" x="190" y="90" text-anchor="end" dominant-baseline="central">CLI-Anything</text>

  <line class="dg-axis" x1="469" y1="170" x2="581" y2="170"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="581" cy="170" r="6"/>
  <circle class="dg-point dg-c-accent" cx="469" cy="170" r="6"/>
  <text class="dg-sub" x="457" y="170" text-anchor="end" dominant-baseline="central">673</text>
  <text class="dg-sub" x="593" y="170" dominant-baseline="central">952</text>
  <text class="dg-label" x="190" y="170" text-anchor="end" dominant-baseline="central">last30days-skill</text>

  <line class="dg-axis" x1="530" y1="250" x2="564" y2="250"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="530" cy="250" r="6"/>
  <circle class="dg-point dg-c-accent" cx="564" cy="250" r="6"/>
  <text class="dg-sub" x="518" y="250" text-anchor="end" dominant-baseline="central">825</text>
  <text class="dg-sub" x="576" y="250" dominant-baseline="central">910</text>
  <text class="dg-label" x="190" y="250" text-anchor="end" dominant-baseline="central">firecrawl</text>

  <line class="dg-rule" x1="20" y1="296" x2="620" y2="296"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="40" cy="314" r="6"/>
  <text class="dg-small" x="54" y="314" dominant-baseline="central">幾天前</text>
  <circle class="dg-point dg-c-accent" cx="160" cy="314" r="6"/>
  <text class="dg-small" x="174" y="314" dominant-baseline="central">今天</text>
</svg>
```

## Trending Repos

### HKUDS/CLI-Anything ★62,637 (+687/日)

[GitHub](https://github.com/HKUDS/CLI-Anything)　·　Python　·　Apache-2.0

- **是什麼**：把任何有原始碼的軟體自動包裝成一個 agent 能直接呼叫的 CLI，官方還做了索引站 CLI-Hub（`pip install cli-anything-hub` 後 `cli-hub install <name>`）收錄社群生成的結果。
- **為什麼值得看**：三天前（11/20）單日還漲 899 顆星，今天掉到 687，降了約 24%；同時官方掛上了「GitHub Trending Repository of the Day」徽章和一篇 arXiv 技術報告（2606.03854），代表熱度正從「剛爆紅」轉成「被正式收錄、有論文背書」的階段——漲幅變小但專案本身的正式程度在往上補。
- **Tech Stack**：Python + Click + 原始碼分析／codegen pipeline + CLI-Hub 線上索引站
- **上手難度**：中——需要先讓它掃過目標軟體的原始碼才能生成對應 CLI，沒有原始碼的商業軟體則走官方 SDK 包裝

---

### mvanhorn/last30days-skill ★72,581 (+673/日)

[GitHub](https://github.com/mvanhorn/last30days-skill)　·　Python　·　MIT

- **是什麼**：一個研究用的 agent skill，輸入任何主題，同時查 Reddit、X、YouTube、Hacker News、Polymarket 等來源，依真人互動數據（upvote、下注金額、觀看數）排序後綜合成一份附引用的簡報。
- **為什麼值得看**：三天前單日漲 952 顆星，今天 673，也掉了約 29%，但 README 提到專案已經推進到「v4 pipeline」，說明作者沒有停在「上線衝一波」就結束，還在持續把查詢範圍（X、YouTube、TikTok、arXiv、Techmeme）往外擴，漲幅變慢但功能覆蓋還在加。
- **Tech Stack**：Python 3.12+ + yt-dlp + 多平台 API／瀏覽器 cookie 橋接 + SQLite（可選持久化儲存供趨勢監控）
- **上手難度**：低——Claude Code 用 `/plugin marketplace add mvanhorn/last30days-skill` 一行裝完，其他 50+ 個 agent host 可用 `npx skills add mvanhorn/last30days-skill -g` 安裝

---

### google-labs-code/stitch-skills ★11,834 (+516/日)

[GitHub](https://github.com/google-labs-code/stitch-skills)　·　TypeScript　·　Apache-2.0

- **是什麼**：Google Labs 幫自家設計工具 Stitch 做的一套 Agent Skills，照 Agent Skills 開放標準打包，讓 Antigravity、Gemini CLI、Claude Code、Cursor 都能呼叫 Stitch 的 MCP server 做介面設計與產出元件。
- **為什麼值得看**：兩天前（11/21）總星數 10,954、沒有明確單日漲幅，今天已經來到 11,834，等於這兩天平均每天漲了約 440 顆星，比當時的觀察（「第一個把 skill 套件用在設計工具上的大廠案例」）更進一步證實：不是曝光一次就沒了後勁，Google 官方 repo 本身仍在穩定吸新 star，不靠一次性話題撐。
- **Tech Stack**：Agent Skills 開放標準 + Stitch MCP server + Codex/Claude plugin marketplace 機制
- **上手難度**：中——需要先有 Stitch 帳號與 MCP server 連線設定，plugin 安裝本身一行指令

---

### firecrawl/firecrawl ★206,831 (+910/日)

[GitHub](https://github.com/firecrawl/firecrawl)　·　TypeScript　·　AGPL-3.0

- **是什麼**：把網頁爬取、搜尋、550+ 個資料來源整理成單一 API 給 agent 用的「知識基礎設施」，可以自架（Firecrawl Local）、連雲端，或單純當 MCP server 接給任何 agent runtime。
- **為什麼值得看**：兩天前單日漲 825 顆星，今天漲到 910，不降反升——這支兩年多的老 repo 沒有新聞話題也沒有重大改版，純粹是「agent 要查得到資料」這個底層需求本身在變大。巧的是，寫這篇文章查證四個框架最新 release 時，也是透過它的 Alexandria GitHub provider 一次拿齊發布時間和內容，算是當天就親身驗證了它標的「知識基礎設施」這句話。
- **Tech Stack**：TypeScript 服務 + MCP server 介面 + 多語言 SDK（Python/Node/Go/Rust）
- **上手難度**：低——`firecrawl-local` 一個指令起本機服務，雲端版直接拿 API key 呼叫

## Notable Releases

今日無重要框架更新。檢查的 13 個框架（LangGraph、CrewAI、MCP 規格、Mastra、Pydantic AI、Agno、Claude Code、Composio、smolagents、LlamaIndex、DSPy、Haystack、browser-use）過去 48 小時內只有 Composio CLI（0.6.2 → 0.6.3）和 browser-use（1.0.7 → 1.0.8）發了 patch 版本，內容都是 CLI 操作細節修正與小 bug fix，沒有 breaking changes 或值得特別提的新功能；Claude Code 最新仍是 11/20 發的 v2.1.330，已在前一篇文章報過，今天沒有新版本。

## 今日收穫

之前看這系列的「skill 套件」熱度，預設漲幅變小代表話題在退燒；但把同一批專案疊在一起看才發現，退燒的只是「打包方式」這層——CLI-Anything、last30days-skill 漲幅都掉了快三成，firecrawl 這種純資料基礎設施反而漲得更快。換個包裝方式新鮮感會過去，但「agent 能不能查到東西」這個問題不會，兩者退熱速度本來就不該一樣。

## 參考資料

- [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything)
- [HKUDS/CLI-Anything 技術報告（arXiv 2606.03854）](https://arxiv.org/abs/2606.03854)
- [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill)
- [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills)
- [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl)
- [GitHub Trending（2026-11-23）](https://github.com/trending?since=daily)
- [LangGraph 1.2.24 Release Notes](https://github.com/langchain-ai/langgraph/releases/tag/1.2.24)
- [Claude Code v2.1.330 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.330)
- [browser-use 1.0.8 Release Notes](https://github.com/browser-use/browser-use/releases/tag/1.0.8)
