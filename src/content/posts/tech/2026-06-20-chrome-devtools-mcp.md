---
title: "Chrome DevTools MCP：直連 CDP 的 MCP Server"
date: 2026-06-20
category: tech
type: deep-dive
tags: [chrome, cdp, mcp, browser-automation, debugging, devtools, ai-agent]
lang: zh-TW
tldr: "Chrome 團隊官方維護的 chrome-devtools-mcp，把 DevTools 的能力包成 MCP server：效能 trace 與洞察、Lighthouse 稽核、heap snapshot、擴充功能管理，都是 Playwright MCP 拿不到的。底層是 Puppeteer，所以互動有 auto-wait；代價是只支援 Chrome，而且預設會回傳使用統計給 Google。"
description: "介紹 chrome-devtools-mcp：什麼是 CDP、Chrome 官方 MCP server 能做什麼、怎麼接到已經開著的 Chrome、要注意的隱私與限制，以及什麼時候才真的需要自己包 CDP。"
draft: false
series:
  name: "瀏覽器自動化與 MCP"
  order: 3
---

> 🌏 [English version](/posts/tech/2026-06-20-chrome-devtools-mcp-en)

**這篇的前提在 2025 年之後變了：Chrome DevTools MCP 現在有官方套件。** [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)（npm 上是 `chrome-devtools-mcp`）由 Chrome 團隊維護，把 DevTools 的能力包成 MCP server，讓 AI agent 控制與檢查一個真實的 Chrome。它現在的官方名稱是「Chrome DevTools for agents」。

對比 [@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp) 和已封存的 [@modelcontextprotocol/server-puppeteer](/posts/tech/2026-06-20-puppeteer-mcp)，這條路線的差異化不是「更低階」——它底層一樣是 Puppeteer，互動一樣會自動等結果——而是**它把 DevTools 面板裡那些診斷能力搬進了 tool 介面**：效能 trace、Lighthouse 稽核、heap snapshot、擴充功能管理。

## Chrome DevTools Protocol 是什麼

Chrome DevTools Protocol（CDP）是瀏覽器內建的 WebSocket 遠端控制協議。按 F12 打開的 DevTools 面板——Network 分頁的請求列表、Sources 的中斷點、Performance 的錄製——背後都是透過 CDP 跟瀏覽器引擎溝通的。

啟動 Chrome 時加上 `--remote-debugging-port=9222`，瀏覽器就會在該 port 暴露 CDP 的 WebSocket endpoint，讓外部程式用同樣的通道控制瀏覽器：

```bash
google-chrome --headless --remote-debugging-port=9222
```

連線後打 `http://localhost:9222/json` 可以看到所有 tab 的 WebSocket URL，每個 tab 是獨立的控制通道。協議本身是 JSON-RPC 2.0：呼叫方送一個帶 `method` 和 `params` 的 JSON 請求，瀏覽器回 `result` 或推送 `event`。

CDP 把功能分成數十個 Domain（`Page`、`Network`、`DOM`、`Runtime`、`Debugger`、`Profiler`、`HeapProfiler`、`Emulation`⋯⋯），是 Puppeteer、Playwright（Chromium 部分）、Lighthouse 共同的底座。完整清單見官方的 [protocol viewer](https://chromedevtools.github.io/devtools-protocol/tot/)。

## 安裝

不需要自己寫 server，直接用 npx：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

需要 Node.js LTS 與現行 stable 版以上的 Chrome。若只是要做基本瀏覽操作、不想讓一大包 tool schema 吃掉 context，可以加 `--slim` 只載入精簡工具集；要無頭跑加 `--headless`。Claude Code 也可以直接裝成 plugin（`/plugin marketplace add ChromeDevTools/chrome-devtools-mcp`），會一起帶進對應的 skills。

工具清單變動頻繁，這裡不逐項列——以官方的 [tool reference](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md) 為準。分組大致是：輸入自動化、頁面／分頁導覽、裝置模擬、效能、網路、除錯、記憶體、擴充功能、PWA。

## 它真正拿得到、別人拿不到的東西

這才是選它的理由。以下幾組能力在 @playwright/mcp 沒有對應工具：

**效能 trace 與洞察**：`performance_start_trace` / `performance_stop_trace` 錄一段 Chrome trace，再用 `performance_analyze_insight` 取出可行動的洞察——這是直接復用 DevTools Performance 面板背後的分析引擎，不是把原始 trace 丟給模型自己讀。要注意：效能工具**預設會把 trace 的網址送給 Google 的 CrUX API** 取真實使用者資料當對照，不想送就加 `--no-performance-crux`。

**Lighthouse 稽核**：`lighthouse_audit` 直接在 agent 迴圈裡跑一次 Lighthouse。

**記憶體分析**：一整組 heap snapshot 工具（拍快照、比對兩份快照、查 retainer 與 retaining path、找重複字串、查特定 class 的物件）。這是找記憶體洩漏時最實際的一組工具，要用 `--memoryDebugging` 打開。

**擴充功能與 PWA**：安裝／移除／重載擴充功能、觸發擴充功能的 action；安裝與啟動 PWA。開發 Chrome extension 時，這條路線幾乎沒有替代品。

**Console 訊息帶 source map**：回傳的 stack trace 是還原過的，不是壓縮後的行號。

## 接到你已經開著的 Chrome

「讓 agent 操作我現在這個已登入的瀏覽器」是這個 server 常見的用法，有三種接法：

- `--browser-url http://127.0.0.1:9222`：接到一個已經開著 remote debugging 的 Chrome。
- `--ws-endpoint ws://127.0.0.1:9222/devtools/browser/<id>`：直接指定 WebSocket endpoint，需要自訂 header 時搭配 `--ws-headers`。
- `--auto-connect`：Chrome 144 以上，自動接到本機對應 channel 的 user data directory；前提是你已經在該 Chrome 的 `chrome://inspect/#remote-debugging` 開好遠端除錯。

不指定的話，server 會自己啟動一個 Chrome，用它自己的 profile 目錄（`$HOME/.cache/chrome-devtools-mcp/chrome-profile`）。要每次都乾淨的暫時 profile 加 `--isolated`。

如果你會讓多個 agent／subagent 共用同一個 server instance，加 `--experimentalPageIdRouting`：它會在頁面層級的工具上暴露 `pageId`，各 agent 才能把 tool call 路由到自己那個分頁，不會互相搶。

## 要先知道的取捨

**只支援 Google Chrome 與 Chrome for Testing**。官方明說其他 Chromium 系瀏覽器可能可以動，但不保證。跨瀏覽器需求請走 @playwright/mcp。

**它會把瀏覽器內容整個攤開給 MCP client**。官方 disclaimer 寫得很直白：這個 server 允許 client 檢查、除錯、修改瀏覽器或 DevTools 裡的任何資料。接到你日常那個已登入的 Chrome 時，這句話的份量要自己掂。

**使用統計預設開啟**。Google 預設會收工具呼叫成功率、延遲、環境資訊。要關掉加 `--no-usage-statistics`，或設 `CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS`（`CI` 環境變數存在時自動關閉）。另外 server 會定期去 npm 檢查更新，用 `CHROME_DEVTOOLS_MCP_NO_UPDATE_CHECKS` 可以關掉。

**部分能力是實驗性的**：座標式點擊（`click_at`）要 `--experimentalVision` 且需要能從截圖產生準確座標的模型；對 DevTools target 本身做自動化要 `--experimentalDevtools`。

## 那還需要自己包 CDP 嗎？

大部分情況不用了。官方 server 已經涵蓋了原本「只能自己包」的那些 Domain（Profiler、HeapProfiler、Network 細節）。

剩下真的要自己動手的情境只有一種：**你需要的 CDP method 官方 server 沒有暴露**。這時用 [`chrome-remote-interface`](https://github.com/cyrus-and/chrome-remote-interface) 之類的函式庫，把你要的那幾個 method 包成 MCP tool 就好——重點是「補一兩個缺的工具」，不是重造一整個 server：

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import CDP from "chrome-remote-interface";

const server = new McpServer({ name: "cdp-extra", version: "0.1.0" });
const client = await CDP({ port: 9222 });

server.tool("security_state", {}, async () => {
  await client.Security.enable();
  const state = await new Promise((r) => client.Security.securityStateChanged(r));
  return { content: [{ type: "text", text: JSON.stringify(state) }] };
});
```

自建的代價是你要自己處理連線生命週期、時序等待、錯誤回報——官方 server 因為建在 Puppeteer 上，這些都已經替你做掉了。

## 適合與不適合的場景

**適合 chrome-devtools-mcp：**
- 效能分析（trace、insight、Lighthouse）與記憶體洩漏排查
- 讓 agent 操作你已經登入的那個 Chrome
- 開發 Chrome extension 或 PWA
- 需要帶 source map 的 console / 網路請求細節來除錯前端

**不適合：**
- 跨瀏覽器測試——只支援 Chrome，Firefox / WebKit 請用 @playwright/mcp
- 對隱私敏感的環境——預設回傳使用統計、且把瀏覽器內容整個暴露給 client
- 只是要 agent 點點網頁——可以用，但 `--slim` 之外沒有比 @playwright/mcp 更省 context 的理由

## 整體來說

「Chrome DevTools MCP 沒有官方套件、得自己從 CDP 包起」這個判斷已經過期了。現在它是 Chrome 團隊維護的成品，而且定位很清楚：**它賣的不是更低階的控制，是 DevTools 的診斷能力**。

所以三條路線的分工，比起兩年前更乾淨了：一般網頁自動化與跨瀏覽器走 @playwright/mcp；要診斷 Chrome 裡到底發生什麼事——慢在哪、記憶體漏在哪、擴充功能有沒有壞——走 chrome-devtools-mcp。

## 參考資料

- [chrome-devtools-mcp — GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [chrome-devtools-mcp 工具清單](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md)
- [Chrome DevTools Protocol — 官方文件](https://chromedevtools.github.io/devtools-protocol/)
- [CDP Protocol Viewer（可互動瀏覽 Domain）](https://chromedevtools.github.io/devtools-protocol/tot/)
- [chrome-remote-interface — GitHub](https://github.com/cyrus-and/chrome-remote-interface)
- [Model Context Protocol SDK — GitHub](https://github.com/modelcontextprotocol/typescript-sdk)
- [Browser MCP 三選一比較](/posts/tech/2026-06-20-browser-mcp-comparison)
- [@playwright/mcp 介紹](/posts/tech/2026-06-20-playwright-mcp)
- [@modelcontextprotocol/server-puppeteer 介紹](/posts/tech/2026-06-20-puppeteer-mcp)
