---
title: "AI Agent GitHub Digest — 2026-10-15"
date: 2026-10-15
category: daily
tags: [ai-agent, github, open-source, daily]
lang: zh-TW
description: "今天 trending 上最值得看的不是又一個 agent 框架，而是替 agent 做稽核、算帳與收尾的工具——agent 生態開始補「做完之後」那一段"
tldr: "iFixAi（27,424★，今日 +2,109）用 60 項檢查稽核 agent 是否照業務規則做事；HyperFrames（63,713★，+1,089）讓 agent 寫 HTML 輸出可重現的 MP4；Apify MCP Server（11,251★）v0.18 拿掉舊 SSE transport、支援 x402 付費；Soup（9,034★）宣稱 8B 模型能在 4 GB 筆電 GPU 上微調，v0.76.0 起沒生效的設定會直接擋下。Release：Pydantic AI v2.56.0、Mastra 1.77.0、Claude Code v2.1.299。"
series:
  name: "AI Agent GitHub Digest"
  order: 61
---

> 🌏 [English version](/posts/daily/2026-10-15-ai-agent-github-digest-en)

## 今日亮點

今天 trending 前段除了連續霸榜的 REA 與 context-mode，冒上來的是「做完之後」的工具：iFixAi 稽核 agent 有沒有照業務規則做事、HyperFrames 把 agent 寫的 HTML 變成可重現的影片、Apify MCP Server 讓 agent 自己付費呼叫爬蟲。框架那邊，Pydantic AI 與 Mastra 同一天都在補沙箱與 durable 執行。

## Trending Repos

### ifixai-ai/iFixAi ⭐ 27,424 (+2,109)
[GitHub](https://github.com/ifixai-ai/iFixAi)　·　Python　·　Apache-2.0

- **是什麼**：一套 agent 稽核工具，檢查的不是延遲或 token 用量，而是 agent 有沒有照業務 KPI 和組織規則做事，號稱 120 秒內出結果。
- **為什麼值得看**：多數 eval 與紅隊工具只量技術指標，iFixAi 把「業務政策」當成檢查對象，Policy Lab 會找出「每一步都被允許、組合起來卻有害」的最短動作序列。可以選自己評、單一外部評審或多評審合議，預設 10 項檢查、`--full-run` 跑全部 60 項。
- **Tech stack**：Python CLI，支援各家模型 provider，也能以 Claude Code、Codex、Cursor 等的 plugin／skill 形式執行
- **上手難度**：低——`pip install "ifixai[openai]"`、`ifixai setup`、`ifixai run` 三步

---

### heygen-com/hyperframes ⭐ 63,713 (+1,089)
[GitHub](https://github.com/heygen-com/hyperframes)　·　TypeScript　·　Apache-2.0

- **是什麼**：把 HTML、CSS、媒體與可 seek 的動畫渲染成可重現 MP4 的開源框架，主打給 coding agent 用。
- **為什麼值得看**：影片生成通常是黑盒模型，HyperFrames 走另一條路：agent 寫 HTML，框架負責逐格渲染，所以同樣輸入一定得到同樣輸出，可以 lint、預覽、改一行重來。附 21 個 skill，涵蓋規劃、動畫、媒體、渲染整條流程。
- **Tech stack**：TypeScript／Node.js CLI，搭配 Claude Code plugin 或 `npx skills add`
- **上手難度**：低——Claude Code 裝 plugin 後直接用 `/hyperframes` 下指令

---

### apify/apify-mcp-server ⭐ 11,251 (+233)
[GitHub](https://github.com/apify/apify-mcp-server)　·　TypeScript　·　MIT

- **是什麼**：讓 agent 把 Apify Store 裡任何一個 Actor（爬蟲或自動化）當成 MCP 工具呼叫的 server，官方也提供託管版 mcp.apify.com。
- **為什麼值得看**：一個 server 就接上社群媒體、搜尋引擎、地圖、電商等數千種爬蟲。值得注意的是付費方式：可以買 token，也能用 x402 每次請求付費，agent 自己付錢跑工具。v0.18 系列已移除舊的 SSE endpoint，還在用 `/sse` 的 client 要改連 Streamable HTTP。
- **Tech stack**：TypeScript、MCP Streamable HTTP、Apify API
- **上手難度**：低——連託管版只需要 Apify token

---

### MakazhanAlpamys/Soup ⭐ 9,034 (+247)
[GitHub](https://github.com/MakazhanAlpamys/Soup)　·　Python　·　Apache-2.0

- **是什麼**：一份 YAML、一個指令就能微調與 post-train LLM 的 CLI。
- **為什麼值得看**：作者宣稱用 layer streaming（凍結的 base 不放 VRAM，一次只送一層進 GPU），可以在 4 GB 筆電 GPU 上微調 Llama-3.1-8B，並附上可在 Colab T4 自行驗證的 notebook；這仍是 beta 功能。v0.76.0 起，設定檔裡「會被驗證但實際沒生效」的選項會直接擋下載入，舊設定可能跑不起來，升級前先跑 `soup doctor`。
- **Tech stack**：Python、QLoRA、NF4 量化
- **上手難度**：中——要有 GPU 與訓練資料，但不用自己處理分散式設定

## Notable Releases

### Pydantic AI v2.56.0
[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.56.0)

- **重要變更**：`SmolSandbox` 在本機 microVM 跑 harness 能力；`PGTaskDurability` 以 Postgres 做 durable execution；`Skills` 可分層載入
- **Breaking Changes**：無正式標示；相容性注意為 `BrowserUse` 預設改用 host model、遙測改 opt-in
- **對你的影響**：用 BrowserUse 的專案升級後確認模型與成本，詳見今日[框架更新](/posts/daily/2026-10-15-framework-pydantic-ai-v2.56.0)

---

### Mastra @mastra/core@1.77.0
[Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.77.0)

- **重要變更**：Factory sandbox provider 契約（Docker／E2B／Platform）；run fencing 擴到十幾種儲存；MCP client 與 server trace 雙向連結
- **Breaking Changes**：`@mastra/server` workflow 路由不再能啟動內部 workflow，durable agent 要改走 agent 路由
- **對你的影響**：直接打 workflow 路由的服務要先改，詳見今日[框架更新](/posts/daily/2026-10-15-framework-mastra-1.77.0)

---

### Claude Code v2.1.299
[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.299)

- **重要變更**：閒置約 54 分鐘、超過 200K token 的對話會在 prompt cache 過期前先壓縮；`claude plugin eval` 可排除特定內建工具
- **Breaking Changes**：無
- **對你的影響**：修掉沙箱內指令能寫入 `--plugin-dir`、之後被非沙箱載入的問題，用 plugin 目錄開發的人建議盡快升級

## 今日收穫

之前以為 agent eval 工具的競爭點是測得多準，看到 iFixAi 把「業務政策」當檢查對象、還會找出被允許動作的有害組合，才發現另一個空缺：技術指標全綠的 agent，照樣可能用一串合法步驟做出違反公司規則的事。

## 參考資料

- [ifixai-ai/iFixAi — GitHub](https://github.com/ifixai-ai/iFixAi)
- [heygen-com/hyperframes — GitHub](https://github.com/heygen-com/hyperframes)
- [apify/apify-mcp-server — GitHub](https://github.com/apify/apify-mcp-server)
- [MakazhanAlpamys/Soup — GitHub](https://github.com/MakazhanAlpamys/Soup)
- [GitHub Trending（daily）](https://github.com/trending?since=daily)
- [Pydantic AI v2.56.0 — GitHub Releases](https://github.com/pydantic/pydantic-ai/releases/tag/v2.56.0)
- [Mastra @mastra/core@1.77.0 — GitHub Releases](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.77.0)
- [Claude Code v2.1.299 — GitHub Releases](https://github.com/anthropics/claude-code/releases/tag/v2.1.299)
