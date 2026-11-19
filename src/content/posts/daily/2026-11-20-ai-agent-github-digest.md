---
title: "AI Agent GitHub Digest — 2026-11-20"
date: 2026-11-20
category: daily
tags: [ai-agent, github, open-source, daily, agent-skills, mastra, claude-code]
lang: zh-TW
description: "Agent Skills 開放標準單日衝出 32 萬顆星的 obra/superpowers，Cursor 也把外掛規格做成官方一級功能"
tldr: "obra/superpowers 單日 +2,029 顆星衝向 32 萬總數，Cursor 官方外掛規格 cursor/plugins 單日 +383；Mastra 推出 Storage Version 2 大幅壓縮 workflow 儲存量，Claude Code v2.1.328 把 Auto mode 擴展到企業雲端閘道。"
series:
  name: "AI Agent GitHub Digest"
  order: 97
---

> 🌏 [English version](/posts/daily/2026-11-20-ai-agent-github-digest-en)

## 今日亮點

今天 GitHub trending 榜被「Agent Skills 標準正式進入主流」這條線整條佔據——`obra/superpowers` 單日多了 2,029 顆星、累積衝到 32 萬顆，是史上漲最快的 agent 專案之一；Cursor 官方也把外掛規格 `cursor/plugins` 做成一級功能，跟 Agent Skills 開放標準相容；HKUDS 則把同一個概念延伸到「讓任何軟體都能被 agent 用指令操作」。工具鏈這邊，Mastra 跟 Claude Code 也都在同一週交出扎實的更新。

## Trending Repos

### obra/superpowers ⭐ 321,913 (+2,029)

[GitHub](https://github.com/obra/superpowers)　·　Shell　·　MIT

- **是什麼**：給 coding agent 用的一套完整「軟體開發方法論」技能包——不是單一技巧，是從需求訪談、寫計畫、拆任務、TDD 實作到 code review、收尾合併的整套工作流程，同時支援 Claude Code、Codex、Cursor、Antigravity、Gemini CLI、Devin CLI、Factory Droid 等十幾種 agent 工具。
- **為什麼值得看**：核心機制是技能「自動觸發」——不用手動呼叫，agent 看到你在規劃功能就自己載入 brainstorming 技能，看到要寫程式就接棒 writing-plans、subagent-driven-development、test-driven-development。Agent Skills 開放標準上線約一個月，這個專案的星數成長曲線顯示它已經從「單點技巧包」擴張成跨工具的標準方法論載體。
- **Tech Stack**：Agent Skills 開放標準（SKILL.md 格式）+ 多 harness 相容層（Claude Code marketplace、Antigravity、Codex、Cursor、Gemini CLI 等各自的外掛安裝指令）
- **上手難度**：低——在 Claude Code 用 `/plugin install superpowers@claude-plugins-official` 一行裝完，其他 agent 各自有對應的安裝指令

---

### cursor/plugins ⭐ 17,489 (+383)

[GitHub](https://github.com/cursor/plugins)　·　TypeScript　·　MIT（各外掛各自授權）

- **是什麼**：Cursor 官方的「外掛規格 + 官方外掛」repo，定義外掛市集 manifest（`.cursor-plugin/marketplace.json`）該怎麼寫，同時收錄 Cursor 團隊自己發的示範外掛。
- **為什麼值得看**：繼 Claude Code 的 plugin marketplace 之後，又一家主流 coding IDE 把「外掛／技能市集」做成官方一級功能，而且規格跟 Agent Skills 開放標準相容，意味著部分外掛未來有機會跨 Cursor、Claude Code 共用，不用為每個 agent host 各寫一份。單日 +383 顆星反映開發者在觀望這條「IDE 原生外掛生態」會不會比各自為政的技能包更穩定、更好維護。
- **Tech Stack**：TypeScript + `.cursor-plugin/marketplace.json` 外掛清單規格
- **上手難度**：低——在 Cursor Agent chat 用 `/add-plugin <name>` 或直接在外掛市集搜尋安裝

---

### HKUDS/CLI-Anything ⭐ 60,393 (+899)

[GitHub](https://github.com/HKUDS/CLI-Anything)　·　Python　·　Apache-2.0

- **是什麼**：把任何有原始碼的軟體（不限語言、不限架構）自動包裝成一個 agent 能直接呼叫的 CLI，官方還做了一個索引站 CLI-Hub（clianything.cc）收錄生成結果。
- **為什麼值得看**：HKUDS 這個團隊先前做過 LightRAG、GraphRAG 等知名開源專案，這次處理的是 agent 生態一個很現實的痛點——大量企業軟體（甚至像 ArcGIS Pro 這類商業桌面 GIS 軟體）既沒有公開 API 也沒有 MCP server，agent 碰不到。CLI-Anything 從原始碼分析生成包裝 CLI，讓 agent 用打指令的方式操作原本要滑鼠點的軟體，不必等廠商自己做整合。
- **Tech Stack**：Python + 原始碼分析／codegen pipeline + CLI-Hub 線上索引站
- **上手難度**：中——需要先讓它掃過目標軟體的原始碼才能生成對應 CLI；沒有原始碼的商業軟體（如 ArcGIS Pro）則是走官方 SDK 包裝，不是純粹的程式碼生成

---

### mvanhorn/last30days-skill ⭐ 70,670 (+952)

[GitHub](https://github.com/mvanhorn/last30days-skill)　·　Python　·　MIT

- **是什麼**：一個研究用的 agent skill，輸入任何主題，它會同時查 Reddit、X、YouTube、Hacker News、Polymarket 等十幾個來源，依真人互動數據排序後綜合成一份附引用的簡報。
- **為什麼值得看**：多數「研究」類技能只是包一層 web search，這個的差異在於明確用「真人投入的訊號」取代 SEO 排序——Reddit 的 upvote 數、Polymarket 的真實下注金額、YouTube 的完整逐字稿都進入排序依據，還額外抓一家公司的招募頁跟專利申請當作「還沒公布的訊號」。上線後連續多天穩坐 GitHub trending 榜首。
- **Tech Stack**：Python 3.12+ + yt-dlp + 多平台 API／瀏覽器 cookie 橋接 + SQLite（可選持久化儲存供趨勢監控）
- **上手難度**：低——Claude Code 用 `/plugin marketplace add mvanhorn/last30days-skill` 一行裝完，其他 50+ 個 agent host 可用 `npx skills add mvanhorn/last30days-skill -g` 安裝

## Notable Releases

### Mastra @mastra/core@1.84.0

[Release Notes](https://github.com/mastra-ai/mastra/releases/tag/@mastra/core@1.84.0)

- **重要變更**：新增實驗性 `storageVersion: 2`——agent（`createDurableAgent`／`createEventedAgent`）跟 evented workflow 的存檔改成「header + 每步驟一列」的差量寫法，官方範例顯示單次 run 的儲存量從 98 MB 壓到 11 MB、75 MB 壓到 3.1 MB；新增 workflow 當機自動復原迴圈，並在 Redis/Valkey Streams、Google Cloud Pub/Sub 這類 broker 情境下改用訊息重派機制，不再整批重跑；Knowledge 新增 `movePage()`、`reembed()` 兩個維運 API；另外推出 `@mastra/platform` 提供託管版 Memory／Knowledge client，以及把 Studio 觀測畫面直接嵌進聊天用戶端的 MCP Apps 功能。
- **Breaking Changes**：無——`storageVersion: 2` 是 opt-in 的實驗性功能，不影響既有部署的預設行為。
- **對你的影響**：如果你的 Mastra workflow 跑很長、存檔很肥，可以評估切到 `storageVersion: 2` 省下大量儲存成本；如果你是用 Redis/Valkey 或 GCP Pub/Sub 當 broker，升級後的當機復原行為會變，不會再無差別整批重跑所有 run。

---

### Claude Code v2.1.328

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.328)

- **重要變更**：把 Auto mode 擴展到 Amazon Bedrock、Google Cloud 的 Agent Platform、Microsoft Foundry、Claude apps gateway 這四個第三方／企業管道上的 Opus 4.6 與 Sonnet 4.6——沒特別設定 permission mode 的互動式 session 現在預設就會開 Auto mode；`mcp_tool` hook 補上 `"onFailure": "block"`，跟 command／HTTP hook 待遇一致，hook 呼叫失敗時會擋下動作而不是放行；另修了一串 Code Mode（背景腳本執行）在 auto／bypass-permissions 模式下的邊角案例。
- **Breaking Changes**：無明顯破壞性變更，以行為擴展與 bug fix 為主。
- **對你的影響**：如果你在企業閘道（Bedrock／Foundry／Agent Platform）跑 Claude Code 且沒特別設 permission mode，升級後互動 session 會預設跑進 Auto mode，想維持舊行為要自己設 `disableAutoMode`。

## 今日收穫

原本以為 agent skill 就是包一層 prompt 的小玩具，但今天看到 `superpowers` 單日衝出 2,029 顆星、累積破 32 萬，Cursor 也把外掛規格做成官方一級功能，才意識到 skill 已經從「單點技巧」變成「跨 agent host 共用的方法論載體」——重點不再是某個 skill 本身有多聰明，而是它能不能同時套進 Claude Code、Cursor、Codex、Gemini CLI 這些不同工具，這才是現在決定一個 skill 能不能爆紅的關鍵。

## 參考資料

- [obra/superpowers - GitHub](https://github.com/obra/superpowers)
- [obra/superpowers Gains 1,905 Stars in 24 Hours on GitHub Trending - Blockchain.News](https://blockchain.news/news/obra-superpowers-github-trending)
- [GitHub Trending（daily）](https://github.com/trending?since=daily)
- [cursor/plugins - GitHub](https://github.com/cursor/plugins)
- [HKUDS/CLI-Anything - GitHub](https://github.com/HKUDS/CLI-Anything)
- [mvanhorn/last30days-skill - GitHub](https://github.com/mvanhorn/last30days-skill)
- [Mastra @mastra/core@1.84.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/@mastra/core@1.84.0)
- [Claude Code v2.1.328 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.328)
