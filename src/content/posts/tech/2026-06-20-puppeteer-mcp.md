---
title: "@modelcontextprotocol/server-puppeteer：官方 Puppeteer MCP Server"
date: 2026-06-20
category: tech
type: deep-dive
tags: [puppeteer, mcp, browser-automation, ai-agent, developer-tools, chrome]
lang: zh-TW
tldr: "server-puppeteer 是 MCP 官方 monorepo 裡的 Puppeteer 封裝，工具集精簡（7 個工具），以截圖 + evaluate 為核心，適合需要視覺回饋或自訂 JS 執行的場景，但每次截圖的 token 成本比 Playwright MCP 高出數倍。"
description: "深入介紹 @modelcontextprotocol/server-puppeteer：安裝設定、7 個核心工具、evaluate 的使用場景、截圖模式的取捨，以及與 @playwright/mcp 的比較。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-06-20-puppeteer-mcp-en)

[@modelcontextprotocol/server-puppeteer](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer) 是 Anthropic MCP 官方 servers monorepo 裡的 [Puppeteer](https://pptr.dev/) 封裝，提供 7 個工具讓 AI agent 控制 Chrome。工具集刻意保持精簡，截圖作為主要的頁面狀態回傳方式，配合 `puppeteer_evaluate` 執行任意 JS。

## 安裝與設定

同樣用 `npx` 直接執行：

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

啟動後自動管理一個 Chrome 程序，不需要手動啟動瀏覽器。Console log 會自動擷取並回傳給 agent。

## 7 個核心工具

**`puppeteer_navigate`**
前往指定 URL，會等待頁面 `load` 事件完成。

```
puppeteer_navigate("https://example.com")
```

**`puppeteer_screenshot`**
截圖當前頁面或指定元素，回傳 base64 PNG。可以指定 CSS selector 只截某個元素：

```
puppeteer_screenshot(selector="#main-content")
```

**`puppeteer_click`**
點擊 CSS selector 對應的元素。不像 Playwright 有 auto-wait，需要確認元素已在 DOM 裡才呼叫。

```
puppeteer_click(selector="button[type='submit']")
```

**`puppeteer_fill`**
清空並填入文字到輸入框：

```
puppeteer_fill(selector="#email", value="user@example.com")
```

**`puppeteer_select`**
對 `<select>` 元素選值：

```
puppeteer_select(selector="#country", value="TW")
```

**`puppeteer_hover`**
滑鼠移到元素上方（觸發 hover 狀態、下拉選單展開等）：

```
puppeteer_hover(selector=".dropdown-trigger")
```

**`puppeteer_evaluate`**
在頁面 context 執行 JavaScript，回傳執行結果：

```javascript
// 範例：抓取頁面所有連結
puppeteer_evaluate(script=`
  Array.from(document.querySelectorAll('a'))
    .map(a => ({ text: a.textContent.trim(), href: a.href }))
`)
```

## evaluate 的實際用途

`puppeteer_evaluate` 是 server-puppeteer 相對彈性的地方。7 個工具沒有涵蓋的操作，很多可以用 JS 補上：

- 抓取沒有 ARIA label 的複雜資料結構
- 觸發 custom event（`element.dispatchEvent(new Event('change'))`）
- 讀取 localStorage / sessionStorage
- 操作 Shadow DOM 裡的元素（`shadowRoot.querySelector(...)`)
- 等待非標準的非同步條件（輪詢直到某個 property 變化）

這讓 agent 在工具不夠用時有逃生門，但也意味著 agent 需要能寫 JS 才能充分利用這個工具。

## 截圖導向的取捨

server-puppeteer 最主要的特性是用截圖（`puppeteer_screenshot`）來讓 agent 確認頁面狀態。這個設計有明顯的取捨：

**優點**：
- 視覺確認直覺——agent 能看到和使用者完全相同的畫面
- 對 ARIA 屬性設得不好的頁面，截圖仍能提供足夠資訊
- 截圖本身就是輸出（OG 圖預覽、UI 回歸測試截圖）

**缺點**：
- 每張截圖是數萬 token，長 session 成本累積快
- 需要 vision 能力的模型（不能用純文字模型）
- 截圖包含大量 agent 不需要的視覺資訊（背景、樣式）

對比 [@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp) 的 accessibility tree 模式，同一個頁面的 token 消耗差距通常在 10–50 倍。

## 與 @playwright/mcp 的比較

| | server-puppeteer | @playwright/mcp |
|---|---|---|
| 頁面狀態回傳 | 截圖（base64）| accessibility tree（預設）|
| Token 消耗 | 高 | 低 |
| Auto-wait | ❌ | ✅ |
| 工具數量 | 7 | 20+ |
| 跨 tab 支援 | 有限 | ✅ |
| 瀏覽器支援 | Chromium only | Chromium / Firefox / WebKit |
| 自訂 JS 執行 | ✅ evaluate | ✅ evaluate |
| 維護方 | Anthropic MCP 官方 | 微軟 / Playwright 官方 |

工具數量少不代表功能弱——`puppeteer_evaluate` 本質上是萬用逃生口。但對需要可靠互動（等待、多 tab、複雜 locator）的 agent，Playwright MCP 的工具集更完整。

## 適合的場景

**選 server-puppeteer 的理由**：
- 任務輸出就是截圖（頁面渲染品質、UI 外觀驗證）
- 需要 `evaluate` 執行複雜 JS 邏輯、現有的 Puppeteer 程式碼想搬到 MCP
- 頁面 ARIA 結構很差，accessibility tree 拿不到有用資訊
- session 較短、截圖數量有限（token 成本可接受）

**不適合的場景**：
- 長 session 的 agent 工作流（截圖 token 累積）
- 跨瀏覽器場景
- 需要複雜等待邏輯的操作（auto-wait 缺失）

## 整體來說

server-puppeteer 是功能直接、上手快的選擇，`evaluate` 提供了一定的靈活性。但在 AI agent 場景，截圖導向的設計讓 token 成本成為長期限制。多數情況下，@playwright/mcp 的 accessibility tree 模式是更經濟的起點；server-puppeteer 的優勢在截圖本身就是目標，或是你需要直接用 Puppeteer API 做事。

## 參考資料

- [@modelcontextprotocol/server-puppeteer — GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer)
- [Puppeteer 官方文件](https://pptr.dev/)
- [Model Context Protocol — 官方文件](https://modelcontextprotocol.io/)
- [Browser MCP 三選一比較](/posts/tech/2026-06-20-browser-mcp-comparison)
- [@playwright/mcp 介紹](/posts/tech/2026-06-20-playwright-mcp)
