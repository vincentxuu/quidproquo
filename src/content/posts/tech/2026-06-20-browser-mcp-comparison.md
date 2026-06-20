---
title: "Browser MCP 三選一：CDP、Playwright MCP、Puppeteer MCP 比較"
date: 2026-06-20
category: tech
type: deep-dive
tags: [mcp, browser-automation, playwright, puppeteer, cdp, ai-agent, developer-tools]
lang: zh-TW
tldr: "@playwright/mcp 用 accessibility tree 取代截圖，token 消耗最低，是 AI agent 做網頁自動化的首選；Puppeteer MCP 截圖導向適合需要視覺回饋的場景；直連 CDP 適合底層工具開發與高層工具未暴露的功能。"
description: "比較三種主流 Browser MCP 方案：直連 Chrome DevTools Protocol、@playwright/mcp、@modelcontextprotocol/server-puppeteer，從抽象層級、token 消耗、瀏覽器支援與適用場景逐一對比。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-06-20-browser-mcp-comparison-en)

AI agent 要控制瀏覽器，現在有三個主流的 MCP server 路線：直連 [Chrome DevTools Protocol（CDP）](/posts/tech/2026-06-20-chrome-cdp)、微軟官方的 [@playwright/mcp](https://github.com/microsoft/playwright-mcp)、以及 MCP 官方倉庫的 [@modelcontextprotocol/server-puppeteer](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer)。三者抽象層級不同，對 AI agent 的友善程度差很多。

## 三者定位

**直連 CDP via MCP**：把 Chrome DevTools Protocol 包成 MCP server，agent 直接呼叫 `Network.enable`、`Page.captureScreenshot` 等 Domain Method。控制粒度最細，但 API surface 大、需要熟悉 CDP 的 Domain 設計。

**@playwright/mcp**：[Playwright](https://playwright.dev/) 官方的 MCP 封裝，由微軟維護。關鍵優勢是預設用 **accessibility tree snapshot** 而非截圖來回傳頁面狀態——agent 拿到的是 ARIA 樹的文字結構，不是圖片，大幅降低 token 消耗。

**@modelcontextprotocol/server-puppeteer**：MCP 官方 servers monorepo 裡的 Puppeteer 封裝。工具集較精簡，以**截圖回饋**為主，配合 `puppeteer_evaluate` 執行自訂 JS。

## 比較表

| | CDP MCP | @playwright/mcp | server-puppeteer |
|---|---|---|---|
| 抽象層級 | 最低（raw protocol） | 高（locator + auto-wait） | 中（CSS selector + evaluate）|
| 瀏覽器支援 | Chromium only | Chromium / Firefox / WebKit | Chromium only |
| 頁面狀態回傳 | 自訂（需要自己實作） | accessibility tree（預設）或截圖 | 截圖（base64）|
| Token 消耗 | 視實作而定 | 最低（accessibility tree 不含圖片）| 最高（每次截圖）|
| Auto-wait | ❌ | ✅ 內建 | ❌ |
| 跨 tab 管理 | ✅ Target Domain | ✅ | ❌ 有限支援 |
| 存取未封裝功能 | ✅ 全部 40+ Domain | ❌ | ❌ |
| Attach 現有 Chrome | ✅ | ✅ `--cdp-endpoint` | 有限 |
| 維護方 | 社群 / 自建 | 微軟（官方） | Anthropic MCP 官方 |

## CDP MCP：最細粒度，最高門檻

這裡需要先釐清三個容易混淆的概念：

- **Chrome DevTools**：瀏覽器內建的開發者工具面板，也就是按 F12 打開的那個 UI，有 Network、Sources、Console 等分頁。
- **Chrome DevTools Protocol（CDP）**：DevTools 面板「背後」用來跟瀏覽器引擎溝通的 WebSocket 協議。DevTools 面板本身就是透過 CDP 擷取網路流量、檢查 DOM、設定中斷點的。
- **CDP MCP / Chrome DevTools MCP**：把 CDP 協議包成 MCP server，讓 AI agent 用同樣的通道控制瀏覽器。操控的是瀏覽器引擎，不是 DevTools 面板的 UI。

所以「CDP MCP」和「Chrome DevTools MCP」指的是同一條路線（透過 CDP 協議控制瀏覽器），只是名稱來自不同角度：前者用縮寫，後者用全名裡的「DevTools」部分。它們不是控制 DevTools 面板本身，而是借用 DevTools 使用的同一套協議。

CDP MCP 沒有單一「官方」套件，通常是把 `chrome-remote-interface` 或類似函式庫包成 MCP server。優勢是能存取 Playwright 和 Puppeteer 未暴露的 Domain：`Profiler`（CPU profiling）、`HeapProfiler`（記憶體分析）、`Security`（憑證管理）、`Fetch`（請求攔截的低層版本）。

適合自己在寫 DevTools 工具、效能分析 pipeline 或需要側接既有 Chrome instance 的場景。不適合讓 AI agent 直接操作一般網頁——光是知道要打哪個 Domain Method 就需要大量提示詞工程。

## @playwright/mcp：AI agent 的預設選擇

Playwright MCP 最重要的設計決策是 `browser_snapshot`：以 ARIA accessibility tree 取代截圖回傳頁面狀態。一張普通網頁的截圖約 50–200KB，換算成 token 動輒數千；accessibility tree 同一頁面通常在 1–5KB，而且不需要 vision 能力的模型就能處理。

Playwright 本身的 auto-wait 邏輯（等元素 interactable 才操作）讓 agent 的重試邏輯大幅簡化，不需要在 prompt 裡寫「先等 DOM 更新」這類指令。

跨瀏覽器支援（Chromium / Firefox / WebKit）讓它也適合需要測試多瀏覽器行為的 QA agent。

## @modelcontextprotocol/server-puppeteer：截圖導向，彈性執行 JS

Puppeteer MCP 的工具集精簡（navigate、screenshot、click、fill、select、hover、evaluate），上手快。`puppeteer_evaluate` 允許 agent 直接在頁面 context 執行任意 JS，這在需要提取複雜資料結構或觸發特定事件的場景很有用。

截圖回傳讓 agent 有視覺確認能力，但代價是每次互動都消耗較多 token。適合需要視覺驗證的場景（「確認按鈕有沒有變成藍色」），或者截圖結果本身就是任務輸出（OG 圖截圖、頁面渲染檢查）。

## 怎麼選

**一般網頁自動化 / AI agent 操作網頁** → @playwright/mcp。Auto-wait 和 accessibility tree 讓 agent 成功率最高、token 最省。

**需要視覺確認或截圖本身是輸出** → server-puppeteer。

**寫底層工具、效能分析、需要 attach 現有 Chrome、存取 Playwright/Puppeteer 沒有暴露的 Domain** → CDP MCP。

**跨瀏覽器測試（Firefox / WebKit）** → @playwright/mcp（另外兩個不支援）。

## 整體來說

三者的核心差異不是功能強弱，而是抽象層級的取捨。對大多數 AI agent 場景，@playwright/mcp 的 accessibility tree 模式是目前最符合「token 便宜、可靠性高」雙重要求的選擇。Puppeteer MCP 適合截圖導向的任務。CDP MCP 是工具開發者的選項，不是 agent 應用的預設路線。

## 參考資料

- [@playwright/mcp — GitHub](https://github.com/microsoft/playwright-mcp)
- [@modelcontextprotocol/server-puppeteer — GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer)
- [Chrome DevTools Protocol 介紹](/posts/tech/2026-06-20-chrome-cdp)
- [Playwright 官方文件](https://playwright.dev/)
- [Model Context Protocol — 官方文件](https://modelcontextprotocol.io/)
