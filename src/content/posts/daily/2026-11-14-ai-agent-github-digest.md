---
title: "AI Agent GitHub Digest — 2026-11-14"
date: 2026-11-14
category: daily
tags: [ai-agent, github, open-source, daily, mcp, code-execution, mastra]
lang: zh-TW
description: "Claude Code 加了實驗性的 Code Mode，UTCP 社群的 code-mode 函式庫同週竄紅，Vercel 也下場做 agent 框架，外加一個用山頂洞人講話幫你省 token 的工具衝上 12 萬星"
tldr: "Claude Code v2.1.323 加入實驗性 Code Mode（讓 agent 寫程式呼叫工具），UTCP 社群的 code-mode 函式庫這週同時在討論同一件事；Vercel 推出檔案系統優先的 agent 框架 eve；Mastra core 1.83 讓每個 Agent 都能發可恢復串流、內建 MCP endpoint。"
series:
  name: "AI Agent GitHub Digest"
  order: 91
---

> 🌏 [English version](/posts/daily/2026-11-14-ai-agent-github-digest-en)

## 今日亮點

今天最值得連起來看的不是某一個 repo，是同一個想法在三個不相關的地方同時冒出來：Claude Code v2.1.323 加了實驗性的「Code Mode」，讓 agent 寫一段 JavaScript 去呼叫工具，而不是一輪一輪選工具；UTCP 社群半年前就在做的 `code-mode` 函式庫，這週被一篇討論「UTCP vs MCP」的文章重新挖出來，一樣是讓 agent 寫程式一次呼叫多個 MCP／UTCP 工具；Vercel 也下場做了檔案系統優先的 agent 框架 eve。傳統「一次 tool call 一個工具」的模式,看起來正在被「讓 agent 自己寫程式」取代。

```diagram
title: Tool-calling 迴圈 vs 寫程式呼叫工具（Code Mode）
desc: 傳統 tool-calling 要 LLM 每輪選一個工具、來回好幾輪才有答案；Code Mode 讓 LLM 直接寫一段程式，在 sandbox 裡一次呼叫多個工具，結果一次回傳。
caption: 簡化示意：context 視窗大小、計價方式的差異這裡先不畫，只畫呼叫工具的結構差異。
---
<svg viewBox="0 0 640 400">
  <text class="dg-heading" x="20" y="28" dominant-baseline="central">改動前</text>
  <text class="dg-heading" x="340" y="28" dominant-baseline="central">改動後</text>
  <line class="dg-rule" x1="320" y1="16" x2="320" y2="280"/>

  <path class="dg-line" d="M160 100V140" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 188V224" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 100V140" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 188V224" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="76" y="56" width="168" height="44" rx="6"/>
  <text class="dg-label" x="160" y="78" text-anchor="middle" dominant-baseline="central">Agent context</text>

  <rect class="dg-box" x="76" y="140" width="168" height="48" rx="6"/>
  <text class="dg-label" x="160" y="156" text-anchor="middle" dominant-baseline="central">LLM 選一個工具</text>
  <text class="dg-sub" x="160" y="174" text-anchor="middle" dominant-baseline="central">一次只選一個工具</text>

  <rect class="dg-box" x="76" y="224" width="168" height="48" rx="6"/>
  <text class="dg-label" x="160" y="240" text-anchor="middle" dominant-baseline="central">工具執行、回傳結果</text>
  <text class="dg-sub" x="160" y="258" text-anchor="middle" dominant-baseline="central">通常來回好幾輪</text>

  <rect class="dg-box" x="396" y="56" width="168" height="44" rx="6"/>
  <text class="dg-label" x="480" y="78" text-anchor="middle" dominant-baseline="central">Agent context</text>

  <rect class="dg-box dg-box--accent" x="396" y="140" width="168" height="48" rx="6"/>
  <text class="dg-label" x="480" y="156" text-anchor="middle" dominant-baseline="central">LLM 寫一段程式</text>
  <text class="dg-sub" x="480" y="174" text-anchor="middle" dominant-baseline="central">一次呼叫多個工具</text>

  <rect class="dg-box" x="396" y="224" width="168" height="48" rx="6"/>
  <text class="dg-label" x="480" y="240" text-anchor="middle" dominant-baseline="central">Sandbox 執行程式</text>
  <text class="dg-sub" x="480" y="258" text-anchor="middle" dominant-baseline="central">結果一次回傳</text>

  <g class="dg-badge"><circle cx="60" cy="164" r="10"/><text x="60" y="164" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge"><circle cx="60" cy="248" r="10"/><text x="60" y="248" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge dg-badge--accent"><circle cx="380" cy="164" r="10"/><text x="380" y="164" text-anchor="middle" dominant-baseline="central">+</text></g>
  <g class="dg-badge"><circle cx="380" cy="248" r="10"/><text x="380" y="248" text-anchor="middle" dominant-baseline="central">+</text></g>

  <line class="dg-rule" x1="20" y1="300" x2="620" y2="300"/>
  <text class="dg-tag" x="20" y="324" dominant-baseline="central">變更清單</text>
  <g class="dg-badge"><circle cx="32" cy="352" r="10"/><text x="32" y="352" text-anchor="middle" dominant-baseline="central">−</text></g>
  <text class="dg-sub" x="52" y="352" dominant-baseline="central">移除 逐次選一個工具，來回好幾輪才有答案</text>
  <g class="dg-badge dg-badge--accent"><circle cx="352" cy="352" r="10"/><text x="352" y="352" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="372" y="352" dominant-baseline="central">新增 LLM 一次寫好程式，一口氣呼叫多個工具</text>
  <g class="dg-badge"><circle cx="352" cy="376" r="10"/><text x="352" y="376" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="372" y="376" dominant-baseline="central">新增 Sandbox 跑完整段程式，結果一次回傳</text>
</svg>
```

## Trending Repos

### vercel/eve ⭐ 5,884

[GitHub](https://github.com/vercel/eve)　·　TypeScript　·　Apache-2.0

- **是什麼**：Vercel 推出的開源 agent 框架，主張「檔案系統優先」——把 agent 的 instructions、tools、workflow 都放進一般檔案和固定目錄，不是藏進資料庫或框架自訂的執行期物件裡。
- **為什麼值得看**：多數框架把 agent 狀態包進記憶體或自訂物件，eve 反過來把一切攤開成檔案（instructions 甚至直接寫成 markdown），讓專案可以像一般程式碼一樣被版本控制、code review，甚至被另一個 agent 直接讀懂。對已經習慣在檔案系統裡工作的 coding agent（Claude Code、Cursor 這類）來說，這種設計比把邏輯包進框架抽象層更貼近它們原本的工作方式。
- **tech stack**：TypeScript + 固定目錄慣例（`agent/agent.ts` 等）+ sandbox 執行 + workflow 引擎
- **上手難度**：中——文件齊全（eve.dev），但要接受它「約定優於配置」的目錄結構，換框架的沉沒成本不低

---

### universal-tool-calling-protocol/code-mode ⭐ 1,667

[GitHub](https://github.com/universal-tool-calling-protocol/code-mode)　·　TypeScript　·　MPL-2.0

- **是什麼**：UTCP（Universal Tool Calling Protocol）社群做的函式庫，讓 agent 不用一次只呼叫一個工具，而是直接寫一段程式，在程式裡一次呼叫多個 MCP 或 UTCP 工具再拿回結果。
- **為什麼值得看**：這個想法這週剛好跟 Claude Code v2.1.323 新增的實驗性「Code Mode」被放在一起討論——核心邏輯一樣：把一堆工具的 schema 塞進 context 很貴，不如讓 agent 寫程式呼叫，省下大量 token 跟來回次數。`code-mode` 證明這不是單一廠商的實驗性功能，而是已經有獨立社群在做，且相容現有 MCP 生態，不用重寫已有的 MCP server。
- **tech stack**：TypeScript + MCP／UTCP 雙協定相容層 + agent 執行環境整合
- **上手難度**：中——概念不難，但要先搞懂 MCP 跟 UTCP 兩種工具描述格式的差異，才抓得到它解決的問題是什麼

---

### nkarasiak/qgis-mcp ⭐ 436

[GitHub](https://github.com/nkarasiak/qgis-mcp)　·　Python　·　GPL-2.0

- **是什麼**：讓任何支援 MCP 的 agent（Claude Code、Claude Desktop、Cursor、Gemini CLI 等）直接操作桌面版 GIS 軟體 QGIS——管理圖層、編輯要素、跑地理處理演算法、產圖，全部用自然語言下指令。
- **為什麼值得看**：跟常見的「聊天機器人回答 GIS 問題」不同，這個 MCP server 是直接把 agent 接進 QGIS 的事件迴圈，透過 TCP socket 跟外掛溝通；破壞性操作預設會要求二次確認，長跑的工具也會回報進度。對 GIS 分析師來說，這代表可以用自然語言跑完整套流程，不必切回去手動點選單。
- **tech stack**：Python MCP server（FastMCP）+ QGIS Python 外掛（QTimer 非阻塞 TCP socket）+ PyQGIS API
- **上手難度**：中——要先裝 QGIS 3.28+ 的外掛，再接 MCP client，支援的 client 清單很長但設定不只一步

---

### JuliusBrussee/caveman ⭐ 119,655

[GitHub](https://github.com/JuliusBrussee/caveman)　·　Go　·　Apache-2.0

- **是什麼**：一個刻意寫成「山頂洞人講話」的 skill ＋ proxy，把送進 coding agent 的提示詞跟工具結果先簡化成極簡句型再送進模型，號稱能砍掉 65% 的 token 用量。
- **為什麼值得看**：比起技術本身，更值得注意的是它的傳播方式——拿「少講話省 token」這個真實痛點包裝成迷因，靠著夠好笑又真的解決問題，在幾個月內衝到近 12 萬顆星，證明 token 成本已經痛到使用者願意為一個玩笑包裝的工具按讚轉發。拿掉迷因外皮，它其實是個提示詞壓縮 proxy，要解的問題跟其他 context 壓縮方案是同一個。
- **tech stack**：Go 寫的本機 proxy + 提示詞／工具結果簡化規則 + 跨平台桌面安裝包
- **上手難度**：低——裝好 proxy、接上現有 coding agent 設定即可，不用改 agent 本身的程式碼

## Notable Releases

### Mastra @mastra/core 1.83.0

[Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.83.0)

- **重要變更**：以前只有「durable agent」能發可恢復的執行串流，現在所有 `Agent` 都能發，支援 replay cache、跨實例 `agent.observe(runId)` 跟 `abortRunStream`；`@mastra/server` 內建 MCP endpoint `/api/mcp`，只要設定 `server.auth` 就預設開啟，不用再自己手刻 `MCPServer`，還加了 OAuth discovery；Workflow Storage V2（只寫入單一 step 的變更，不整個 run 重寫）正式支援 Postgres 跟 libSQL。
- **Breaking Changes**：`Agent` 的 `durable` 選項現在只控制「能不能恢復串流」，不再等於「checkpoint-backed 的持久化執行」——原本靠 `durable: true` 做持久化執行的用法，要改成 `createDurableAgent({ agent })`，一般 agent 開了 resumable streams 之後斷線行為也不一樣了。
- **對你的影響**：如果你把 `durable: true` 當成「掉線也能接回去跑完」的持久化方案在用，升級後行為不等價，務必改成 `createDurableAgent`；單純想要「前端斷線重連不中斷串流」的話，現在不用特別設 durable 就能用。

## 今日收穫

之前以為 Claude Code 這次加的「Code Mode」是 Anthropic 自己的實驗性功能，查下去才發現 UTCP 社群半年前就在做一樣的事，還做出一個同時相容 MCP 跟 UTCP 的函式庫——這代表「讓 agent 寫程式取代一輪輪 tool call」不是單一廠商的噱頭，是整個生態在往同一個方向收斂，只是各家進度不一樣快。

## 參考資料

- [vercel/eve — GitHub repo](https://github.com/vercel/eve)
- [universal-tool-calling-protocol/code-mode — GitHub repo](https://github.com/universal-tool-calling-protocol/code-mode)
- [What Is UTCP, And Why Do I Care? — Matthew Kruczek](https://matthewkruczek.substack.com/p/what-is-utcp-and-why-do-i-care)
- [nkarasiak/qgis-mcp — GitHub repo](https://github.com/nkarasiak/qgis-mcp)
- [JuliusBrussee/caveman — GitHub repo](https://github.com/JuliusBrussee/caveman)
- [Claude Code v2.1.323 — Release Notes（Code Mode）](https://github.com/anthropics/claude-code/releases/tag/v2.1.323)
- [Mastra @mastra/core@1.83.0 — Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.83.0)
