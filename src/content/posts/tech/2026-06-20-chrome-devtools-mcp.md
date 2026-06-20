---
title: "Chrome DevTools MCP：直連 CDP 的 MCP Server"
date: 2026-06-20
category: tech
type: deep-dive
tags: [chrome, cdp, mcp, browser-automation, debugging, devtools, ai-agent]
lang: zh-TW
tldr: "Chrome DevTools MCP 是把 Chrome DevTools Protocol（CDP）包成 MCP server 的做法，讓 AI agent 可以直接呼叫 40+ CDP Domain，存取 Playwright 和 Puppeteer MCP 未暴露的 Profiler、HeapProfiler、Security 等底層功能，代價是需要自行實作 MCP tool 定義與 auto-wait 邏輯。"
description: "介紹 Chrome DevTools MCP：什麼是 CDP、為什麼要把它包成 MCP server、能做什麼、怎麼用 chrome-remote-interface 建立自訂 MCP server，以及與 Playwright MCP / Puppeteer MCP 的定位差異。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-06-20-chrome-devtools-mcp-en)

Chrome DevTools MCP 不是一個現成套件的名稱，而是一種做法：把 [Chrome DevTools Protocol（CDP）](https://chromedevtools.github.io/devtools-protocol/)包成 MCP server，讓 AI agent 透過 MCP 協議直接呼叫瀏覽器的底層 API。對比 [@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp) 和 [@modelcontextprotocol/server-puppeteer](/posts/tech/2026-06-20-puppeteer-mcp)，這個路線沒有高層封裝，但能存取另外兩者觸及不到的功能。

## Chrome DevTools Protocol 是什麼

Chrome DevTools Protocol（CDP）是瀏覽器內建的 WebSocket 遠端控制協議。按 F12 打開的 DevTools 面板——Network 分頁的請求列表、Sources 的中斷點、Performance 的錄製——背後都是透過 CDP 跟瀏覽器引擎溝通的。

啟動 Chrome 時加上 `--remote-debugging-port=9222`，瀏覽器就會在該 port 暴露 CDP 的 WebSocket endpoint，讓外部程式用同樣的通道控制瀏覽器：

```bash
google-chrome --headless --remote-debugging-port=9222
```

連線後打 `http://localhost:9222/json` 可以看到所有 tab 的 WebSocket URL，每個 tab 是獨立的控制通道。

協議本身是 JSON-RPC 2.0：呼叫方送一個帶 `method` 和 `params` 的 JSON 請求，瀏覽器回 `result` 或推送 `event`。

## 為什麼包成 MCP Server

CDP 原生是 WebSocket 協議，AI agent 沒辦法直接呼叫——它需要的是 MCP tool。把 CDP 包成 MCP server 之後，agent 就能像呼叫其他 MCP tool 一樣呼叫 CDP 的功能，例如：

```
tool: cdp_network_enable
tool: cdp_page_navigate  → { url: "https://example.com" }
tool: cdp_dom_get_document
tool: cdp_runtime_evaluate → { expression: "document.title" }
```

每個 MCP tool 對應一個（或多個）CDP method，MCP server 負責管理 WebSocket 連線、序列化參數、回傳結果。

## CDP 有哪些 Domain

CDP 把功能分成 40+ 個 Domain，常用的包括：

| Domain | 用途 |
|---|---|
| `Page` | 導覽、截圖、lifecycle events |
| `Network` | 攔截請求、取得 response body、模擬限速 |
| `DOM` | 查詢 / 修改 DOM 節點 |
| `Runtime` | 在頁面執行 JS、取得 JS 物件 |
| `Debugger` | 設中斷點、單步執行 |
| `Target` | 管理多個 tab / iframe |
| `Profiler` | CPU profiling（Playwright MCP 沒有暴露） |
| `HeapProfiler` | 記憶體 heap snapshot（Playwright MCP 沒有暴露） |
| `Security` | 憑證管理、mixed content（Playwright MCP 沒有暴露）|
| `Fetch` | 低層請求攔截，比 Network 更細粒度 |
| `Emulation` | 裝置模擬、geolocation、timezone |
| `Performance` | 取得 runtime metrics（JS heap、layout count）|

**Playwright MCP 和 Puppeteer MCP 只暴露它們封裝過的功能**；Chrome DevTools MCP 能存取全部 Domain。

## 用 chrome-remote-interface 建立 MCP Server

目前沒有官方的 Chrome DevTools MCP 套件，通常用 [`chrome-remote-interface`](https://github.com/cyrus-and/chrome-remote-interface)（Node.js）包成自訂 MCP server。以下是最精簡的骨架：

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import CDP from "chrome-remote-interface";

const server = new McpServer({ name: "chrome-devtools", version: "0.1.0" });
let cdpClient: CDP.Client | null = null;

async function getClient() {
  if (!cdpClient) {
    cdpClient = await CDP({ port: 9222 });
    await cdpClient.Page.enable();
    await cdpClient.Network.enable();
    await cdpClient.Runtime.enable();
  }
  return cdpClient;
}

server.tool("page_navigate", { url: { type: "string" } }, async ({ url }) => {
  const client = await getClient();
  await client.Page.navigate({ url });
  await client.Page.loadEventFired();
  return { content: [{ type: "text", text: `Navigated to ${url}` }] };
});

server.tool("runtime_evaluate", { expression: { type: "string" } }, async ({ expression }) => {
  const client = await getClient();
  const { result } = await client.Runtime.evaluate({ expression, returnByValue: true });
  return { content: [{ type: "text", text: JSON.stringify(result.value) }] };
});

server.tool("network_get_response", { requestId: { type: "string" } }, async ({ requestId }) => {
  const client = await getClient();
  const { body } = await client.Network.getResponseBody({ requestId });
  return { content: [{ type: "text", text: body }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

設定到 MCP client：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "node",
      "args": ["./chrome-devtools-mcp.js"]
    }
  }
}
```

注意 Chrome 要先用 `--remote-debugging-port=9222` 啟動，MCP server 才能連線。

## Profiler：Playwright MCP 拿不到的功能

`Profiler` Domain 是 Chrome DevTools MCP 相對於高層工具最明顯的優勢之一：

```typescript
server.tool("profiler_start", {}, async () => {
  const client = await getClient();
  await client.Profiler.enable();
  await client.Profiler.start();
  return { content: [{ type: "text", text: "Profiling started" }] };
});

server.tool("profiler_stop", {}, async () => {
  const client = await getClient();
  const { profile } = await client.Profiler.stop();
  return { content: [{ type: "text", text: JSON.stringify(profile) }] };
});
```

同樣的模式可以套用到 `HeapProfiler`（記憶體分析）、`Security`（處理不安全憑證）、`Fetch`（在 request 送出前修改 headers）。

## 適合與不適合的場景

**適合 Chrome DevTools MCP：**
- 效能分析工具（CPU / 記憶體 profiling）
- 需要 attach 到使用者已開的 Chrome instance
- 存取 Playwright / Puppeteer 未暴露的 Domain
- 自訂 DevTools 工具或 Chrome Extension 後端
- 側錄真實瀏覽器流量（Network Domain raw event）

**不適合 Chrome DevTools MCP：**
- 一般 AI agent 操作網頁——需要自己實作所有 MCP tool 與 auto-wait 邏輯，@playwright/mcp 已經做好了
- 跨瀏覽器場景——CDP 是 Chromium 專屬
- 快速原型——從零建立 MCP server 比直接用 @playwright/mcp 慢很多

## 整體來說

Chrome DevTools MCP 是三條路線裡門檻最高、控制粒度最細的選擇。沒有官方套件代表需要自己動手建 MCP server，沒有 auto-wait 代表 agent 要自己處理時序；但換來的是完整的 40+ Domain 存取權限，以及能 attach 到現有 Chrome 的彈性。

對 AI agent 做一般網頁自動化，@playwright/mcp 是更合理的起點。Chrome DevTools MCP 的價值在於它能做到另外兩者做不到的事。

## 參考資料

- [Chrome DevTools Protocol — 官方文件](https://chromedevtools.github.io/devtools-protocol/)
- [chrome-remote-interface — GitHub](https://github.com/cyrus-and/chrome-remote-interface)
- [Model Context Protocol SDK — GitHub](https://github.com/modelcontextprotocol/typescript-sdk)
- [CDP Protocol Viewer（可互動瀏覽 Domain）](https://chromedevtools.github.io/devtools-protocol/tot/)
- [Browser MCP 三選一比較](/posts/tech/2026-06-20-browser-mcp-comparison)
- [@playwright/mcp 介紹](/posts/tech/2026-06-20-playwright-mcp)
- [@modelcontextprotocol/server-puppeteer 介紹](/posts/tech/2026-06-20-puppeteer-mcp)
