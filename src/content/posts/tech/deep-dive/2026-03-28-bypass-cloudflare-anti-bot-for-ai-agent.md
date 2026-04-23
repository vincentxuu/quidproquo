---
title: "AI Agent 繞過 Cloudflare 反爬蟲完整指南：從踩坑到自建 MCP Server"
date: 2026-03-28
type: guide
category: tech
tags: [cloudflare, anti-bot, playwright, nodriver, stealth, mcp, ai-agent, web-scraping]
lang: zh-TW
tldr: "標準 Playwright 無法通過 Cloudflare 驗證。playwright-extra + stealth 和 nodriver 都能繞過，最終包成 MCP server 讓 AI agent 自動使用。"
description: "實測三種方案繞過 Cloudflare 反爬蟲：原生 Playwright（失敗）、playwright-extra + stealth（通過）、nodriver（1 秒通過）。並將 stealth 方案包成 MCP server，讓 Claude Code 等 AI agent 在遇到 Cloudflare 時自動切換使用。"
draft: false
---

AI agent 需要上網查資料，但越來越多網站用 Cloudflare 反爬蟲。標準的 Playwright 會直接被擋下來，這篇記錄從發現問題到建出 MCP server 的完整過程。

## 問題：Playwright 過不了 Cloudflare

用 Playwright MCP server（`@executeautomation/playwright-mcp-server`）打開任何有 Cloudflare 保護的網站，會卡在 "Verify you are human" 的 Turnstile 挑戰頁面，永遠過不去。

原因是 Cloudflare 偵測到了自動化瀏覽器的特徵：

- `navigator.webdriver = true`（Playwright 預設行為）
- Chrome DevTools Protocol (CDP) 的連線痕跡
- 瀏覽器指紋不一致（缺少某些 API、Plugin 列表異常等）

## 三種方案比較

| 方案 | 語言 | 原理 | 繞過率 | 適合場景 |
|------|------|------|--------|----------|
| **playwright-extra + stealth** | Node.js | 注入腳本覆蓋 `webdriver` 等屬性，偽造瀏覽器指紋 | 高 | 整合到現有 Playwright 工作流 |
| **nodriver** | Python | 不使用 CDP，直接操控 Chrome，從底層避開偵測 | 最高 | 長期穩定爬取 |
| **camoufox** | Python | 基於 Firefox 的反偵測瀏覽器 | 高 | 需要 Firefox 引擎的場景 |

### playwright-extra + stealth

在 Playwright 上面加一層 stealth plugin，原理是在頁面載入前注入 JavaScript，把自動化痕跡抹掉：

```js
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

chromium.use(StealthPlugin());

const browser = await chromium.launch({ headless: false });
const page = await (await browser.newContext()).newPage();
await page.goto("https://nowsecure.nl");
// Cloudflare 自動通過
```

優點是跟原生 Playwright API 完全相容，現有程式碼只要改兩行 import 就能用。缺點是對最嚴格的 Cloudflare 設定可能不夠。

### nodriver

nodriver 是 undetected-chromedriver 作者寫的下一代方案。它不走 CDP，而是用另一種方式控制 Chrome，所以 Cloudflare 的 CDP 偵測完全無效。

```python
import nodriver as uc

async def main():
    browser = await uc.start()
    page = await browser.get("https://nowsecure.nl")
    # 1 秒內通過 Cloudflare
```

實測 nowsecure.nl（專門測試反偵測的網站），nodriver 1 秒就通過，playwright-extra 需要數秒。

> 注意：nodriver 目前不支援 Python 3.14，需要用 3.13 或更低版本。

## 實測結果

用 `https://nowsecure.nl`（Cloudflare Turnstile 測試站）測試：

| 方案 | 結果 | 通過時間 |
|------|------|----------|
| 原生 Playwright (MCP) | 失敗 | - |
| playwright-extra + stealth | 通過 | ~數秒 |
| nodriver | 通過 | 1 秒 |

## 讓 AI Agent 自動使用：包成 MCP Server

能繞過 Cloudflare 之後，下一個問題是：怎麼讓 AI agent 知道可以用、什麼時候該用？

答案是包成 MCP (Model Context Protocol) server。這樣 Claude Code 啟動時會自動載入這個 tool，agent 在需要時直接呼叫。

### 架構

```
Claude Code / AI Agent
  → 呼叫 stealth_fetch tool
    → MCP Server (Node.js, stdio)
      → playwright-extra + stealth
        → 繞過 Cloudflare
          → 回傳頁面內容
```

選 playwright-extra 而非 nodriver 包 MCP，是因為 MCP SDK 是 Node.js 原生生態，單一 process 就能搞定，不用同時管 Python + Node。

### MCP Server 核心程式碼

```js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

chromium.use(StealthPlugin());

const server = new McpServer({
  name: "stealth-fetch",
  version: "1.0.0",
});

server.tool(
  "stealth_fetch",
  "Fetch a web page bypassing Cloudflare anti-bot protection.",
  {
    url: z.string().describe("URL to fetch"),
    extract: z.enum(["html", "text", "screenshot", "all"]).default("text"),
    wait_for: z.string().optional().describe("CSS selector to wait for"),
    timeout: z.number().default(30),
  },
  async ({ url, extract, wait_for, timeout }) => {
    const browser = await getBrowser();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    // 等待 Cloudflare challenge 通過
    for (let i = 0; i < timeout; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const title = await page.title();
      if (!title.toLowerCase().includes("just a moment")) break;
    }

    // 抓取內容
    const text = await page.evaluate(() => document.body.innerText);
    await context.close();
    return { content: [{ type: "text", text }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

### 註冊到 Claude Code

在 `~/.claude.json` 的 `mcpServers` 加上：

```json
{
  "stealth-fetch": {
    "type": "stdio",
    "command": "node",
    "args": ["/path/to/mcp-server/index.mjs"]
  }
}
```

### 讓 Agent 知道什麼時候該用

光註冊 MCP 不夠，agent 看到 tool 但不一定知道什麼時候該用。在 `CLAUDE.md` 加上使用指引：

```markdown
## Stealth Fetch

當需要抓取網頁內容且遇到 Cloudflare 反爬蟲阻擋時，
使用 stealth_fetch MCP tool（而非 web-fetch 或 playwright）。

參數：
- url：目標網址
- extract：text（預設）、html、screenshot、all
- wait_for：等待特定 CSS selector 出現後才抓取
- timeout：最長等待秒數（預設 30）
```

這樣 agent 在遇到 Cloudflare 時就會自動切換到 `stealth_fetch`。

## 額外方案：HTTP API

如果不只是 Claude Code 要用，也可以包成通用的 HTTP API，任何 agent 或服務都能呼叫：

```bash
# 啟動
python server.py

# 呼叫
curl "http://127.0.0.1:3000/fetch?url=https://target.com&extract=text"
```

回傳：

```json
{
  "url": "https://target.com/",
  "html": "...",
  "text": "頁面純文字內容",
  "screenshot": "base64 PNG"
}
```

用 FastAPI + nodriver 實作，適合需要最高繞過率的場景。之後要 24/7 運行，丟進 Docker 部署到 VPS 就好。

## 整體來說

Cloudflare 反爬蟲的核心是偵測瀏覽器自動化特徵。解法不是「破解」驗證，而是讓瀏覽器看起來不像自動化。

對 AI agent 來說，最實用的組合是：

- **日常使用**：MCP server（playwright-extra + stealth），自動載入、零配置
- **遇到硬站**：nodriver HTTP API 當備案，繞過率最高
- **讓 agent 自動選擇**：寫在 CLAUDE.md，遇到 Cloudflare 時自動切換工具

這不是一勞永逸的方案。Cloudflare 會持續更新偵測規則，stealth plugin 和 nodriver 也會持續更新。長期來看，維持工具版本更新比選哪個方案更重要。

---

## 參考資料

- [playwright-extra](https://github.com/nicedayfor/playwright-extra) — Playwright 的 plugin 框架
- [puppeteer-extra-plugin-stealth](https://github.com/nicedayfor/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth) — 隱藏自動化痕跡的 stealth plugin
- [nodriver](https://github.com/nicedayfor/nodriver) — undetected-chromedriver 作者的下一代方案
- [nowsecure.nl](https://nowsecure.nl) — Cloudflare Turnstile 偵測測試站
- [Model Context Protocol](https://modelcontextprotocol.io/) — MCP 官方文件
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) — Cloudflare 的 CAPTCHA 替代方案
