---
title: "@modelcontextprotocol/server-puppeteer：官方 Puppeteer MCP Server"
date: 2026-06-20
category: tech
type: deep-dive
tags: [puppeteer, mcp, browser-automation, ai-agent, developer-tools, chrome]
lang: zh-TW
tldr: "server-puppeteer 是 MCP 官方 monorepo 裡的 Puppeteer 封裝，工具集精簡、以截圖 + evaluate 為核心。但它已被官方封存（移到 servers-archived、不再更新），新專案不該再選它——想要 Puppeteer 血統的 MCP，現在該看 Chrome 團隊的 chrome-devtools-mcp。"
description: "@modelcontextprotocol/server-puppeteer 的設計、截圖導向的取捨，以及它被封存之後該遷移到哪裡。"
draft: false
series:
  name: "瀏覽器自動化與 MCP"
  order: 2
---

> 🌏 [English version](/posts/tech/2026-06-20-puppeteer-mcp-en)

> ⚠️ **這個 server 已被官方封存，不要用在新專案。**
> `@modelcontextprotocol/server-puppeteer` 已從 MCP 官方 servers monorepo 移出，搬到 [`servers-archived`](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer)；npm 上最後一個版本停在 `2025.5.12`，之後沒有再發佈。套件還裝得起來，但不再收 bug fix，也不會跟上 MCP spec 的變動。
>
> 要遷移的話有兩個方向：想要 Puppeteer 底層 + 截圖／除錯能力，換 Chrome 團隊官方維護的 [chrome-devtools-mcp](/posts/tech/2026-06-20-chrome-devtools-mcp)（它本身就是建在 Puppeteer 上的）；想要一般網頁自動化，換 [@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp)。
>
> 下面的內容留著，是因為「精簡工具集 + 截圖回饋 + evaluate 逃生門」這組設計取捨仍然值得理解——你在評估其他 browser MCP 時會一再遇到同一組權衡。

[@modelcontextprotocol/server-puppeteer](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer) 是 Anthropic MCP 官方 servers monorepo 裡的 [Puppeteer](https://pptr.dev/) 封裝，提供 7 個工具讓 AI agent 控制 Chrome。工具集刻意保持精簡，截圖作為主要的頁面狀態回傳方式，配合 `puppeteer_evaluate` 執行任意 JS。

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
| 維護狀態 | **已封存，最後版本 2025.5.12** | 持續更新 |
| 頁面狀態回傳 | 截圖（base64）| accessibility tree（預設）|
| Token 消耗 | 高 | 低 |
| Auto-wait | ❌ | ✅ |
| 工具數量 | 7（固定） | 核心一組，其餘用 `--caps` 開 |
| 跨 tab 支援 | 有限 | ✅ `browser_tabs` |
| 瀏覽器支援 | Chromium only | Chromium / Firefox / WebKit |
| 自訂 JS 執行 | ✅ evaluate | ✅ evaluate |
| 維護方 | Anthropic MCP 官方（已封存） | 微軟 / Playwright 官方 |

工具數量少不代表功能弱——`puppeteer_evaluate` 本質上是萬用逃生口。但對需要可靠互動（等待、多 tab、複雜 locator）的 agent，Playwright MCP 的工具集更完整；何況現在多了一項決定性差異：一邊還在更新，一邊沒有了。

## 適合的場景

封存之後，「該不該選它」這題其實已經有答案了：不該。但它原本擅長的那些場景仍然存在，只是換人接手：

| 你原本想用 server-puppeteer 做的事 | 現在該用什麼 |
|---|---|
| 截圖本身就是輸出（渲染品質、UI 外觀驗證） | chrome-devtools-mcp（`take_screenshot`）或 @playwright/mcp |
| 用 `evaluate` 跑複雜 JS 邏輯 | 兩者都有等價工具 |
| 頁面 ARIA 很差，snapshot 沒用 | chrome-devtools-mcp，或 @playwright/mcp 切截圖模式 |
| 效能／記憶體分析 | chrome-devtools-mcp（它有 trace 與 heap snapshot 工具） |
| 跨瀏覽器 | @playwright/mcp |

原本就不適合它的場景也沒變：長 session 的 agent 工作流（截圖 token 一路累積）、跨瀏覽器、需要複雜等待邏輯的操作（沒有 auto-wait）。

## 整體來說

server-puppeteer 是功能直接、上手快的選擇，`evaluate` 提供了一定的靈活性。但在 AI agent 場景，截圖導向的設計讓 token 成本成為長期限制——而它現在連「還有人維護」這個前提都沒有了。

值得留下的是它示範的那條光譜：工具集愈小、agent 要靠 `evaluate` 自己寫 JS 的比例愈高；頁面狀態愈依賴截圖、token 成本愈難壓。你評估任何一個 browser MCP，都可以拿這兩軸去量。至於實際要裝哪一個：一般網頁自動化選 [@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp)，要 Chrome 深度除錯與效能分析選 [chrome-devtools-mcp](/posts/tech/2026-06-20-chrome-devtools-mcp)。

## 參考資料

- [@modelcontextprotocol/server-puppeteer — GitHub（已封存）](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer)
- [MCP servers 官方倉庫的 Archived 清單](https://github.com/modelcontextprotocol/servers#archived)
- [chrome-devtools-mcp — GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Puppeteer 官方文件](https://pptr.dev/)
- [Model Context Protocol — 官方文件](https://modelcontextprotocol.io/)
- [Browser MCP 三選一比較](/posts/tech/2026-06-20-browser-mcp-comparison)
- [@playwright/mcp 介紹](/posts/tech/2026-06-20-playwright-mcp)
- [Chrome DevTools MCP 介紹](/posts/tech/2026-06-20-chrome-devtools-mcp)
