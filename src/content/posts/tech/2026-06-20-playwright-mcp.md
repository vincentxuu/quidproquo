---
title: "@playwright/mcp：微軟官方的瀏覽器自動化 MCP Server"
date: 2026-06-20
updated: 2026-08-19
category: tech
type: deep-dive
tags: [playwright, mcp, browser-automation, ai-agent, e2e-testing, developer-tools]
lang: zh-TW
tldr: "@playwright/mcp 預設用 accessibility tree（browser_snapshot）取代截圖，大幅省下 token，加上 Playwright 原生 auto-wait，是 AI agent 做網頁自動化的合理起點。要注意它預設是 headed、預設帶持久 profile，而且進階工具群組要用 --caps 開。"
description: "深入介紹 @playwright/mcp：安裝設定、工具分組與 --caps 開關、accessibility tree 模式的 token 優勢、profile 與 session 管理，以及什麼時候該改用截圖模式或改走 Playwright CLI。"
draft: false
series:
  name: "瀏覽器自動化與 MCP"
  order: 1
---

> 🌏 [English version](/posts/tech/2026-06-20-playwright-mcp-en)

[@playwright/mcp](https://github.com/microsoft/playwright-mcp) 是微軟官方維護的 Playwright MCP server，讓 AI agent 能透過 [Model Context Protocol](https://modelcontextprotocol.io/) 控制瀏覽器。它最大的設計特點是：**預設不用截圖**，改用 ARIA accessibility tree 來回傳頁面狀態，大幅降低 token 消耗。

## 安裝與設定

用 `npx` 直接啟動，不需要全域安裝：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

**預設是 headed（看得到瀏覽器視窗）**，不是 headless——早期版本相反，舊文章教的 `--headed` 現在已經沒有這個參數了。要無頭跑請加 `--headless`：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--headless"]
    }
  }
}
```

換瀏覽器用 `--browser`（`chrome` / `firefox` / `webkit` / `msedge`）。接到已經在跑的瀏覽器有兩條路：`--cdp-endpoint` 指向一個可除錯的 endpoint（例如 `http://localhost:9222`），或裝官方的 Playwright 瀏覽器擴充後用 `--extension` 接管你現有的分頁。完整參數表在 [README 的 Configuration 段](https://github.com/microsoft/playwright-mcp#configuration)。

> **先想清楚要不要用 MCP。** 上游 README 現在開頭就先勸退：對 coding agent，微軟建議改用 [Playwright CLI + Skills](https://github.com/microsoft/playwright-cli)，因為 CLI 不必把龐大的 tool schema 和 accessibility tree 灌進 context。MCP 的定位收斂成「需要持續瀏覽器狀態、要對頁面結構反覆推理」的長時間 agentic loop。

## 工具分組與 `--caps`

工具清單這一年改動很大，逐項背下來沒有意義（會過期），這裡只講結構——**確切名稱與參數請看官方的 [Tools 段落](https://github.com/microsoft/playwright-mcp#tools)**。

預設載入的是 **Core automation**（導覽、點擊、輸入、表單、快照、截圖、等待、console/network、evaluate）加上 **Tab management**。其餘工具群組是 **opt-in**，要用 `--caps` 逐項打開：

| `--caps` 值 | 打開什麼 |
|---|---|
| `config` | 讀取執行中的 server 設定 |
| `network` | 攔截／改寫請求（route）、模擬網路狀態 |
| `storage` | cookie、localStorage、sessionStorage、storage state 存取 |
| `devtools` | 底層 CDP 通道 |
| `vision` | 座標式滑鼠操作（給 computer-use 類模型） |
| `pdf` | 頁面輸出成 PDF |
| `testing` | 斷言類工具、產生 locator |

> 這張表要留一個但書：**上游 README 自己前後不一致**。參數表那一行寫 `--caps` 的 possible values 只有 `vision, pdf, devtools` 三個，但下面的工具章節實際列出七個 `opt-in via --caps=` 群組（上表就是那七個）。七個那版比較可能反映現況（每個群組都有自己的章節），但要用到 `config` / `network` / `storage` / `testing` 之前，建議先實測一下你裝的版本認不認。

幾個容易踩的改名（舊文章常見的錯誤呼叫）：

- 截圖是 `browser_take_screenshot`，不是 `browser_screenshot`。
- 分頁管理收斂成單一 `browser_tabs`，沒有 `browser_tab_list` / `browser_tab_new` / `browser_tab_select` / `browser_tab_close` 這四個工具。
- 上一頁是 `browser_navigate_back`；**沒有** forward，也沒有獨立的 reload 工具。
- 輸出 PDF 的 `browser_pdf_save` 要先開 `--caps=pdf`，不是預設就有。

## Accessibility Tree Mode vs Screenshot Mode

`browser_snapshot` 是 @playwright/mcp 最重要的差異點。它回傳的是 ARIA 樹的文字結構，類似這樣：

```
- heading "Product List" [level=1]
- list
  - listitem
    - link "MacBook Pro 16-inch" [href="/products/macbook-pro"]
    - text "$2,499"
    - button "Add to Cart"
  - listitem
    - link "iPad Pro" [href="/products/ipad-pro"]
    - text "$1,099"
    - button "Add to Cart"
```

視覺 token 不是按 base64 位元組算的：Anthropic 的[官方說明](https://platform.claude.com/docs/en/build-with-claude/vision)是每 28×28 像素一個 patch，一張 1920×1080 截圖在 standard tier 是 **1,560 個 visual token**（先縮到 1456×819），high-res tier 2,691。同一個頁面的 accessibility tree 通常在 2–10KB，換算後與截圖同一個量級，但**不需要 vision 能力的模型就能解析**——真正的差別在這裡，而不在某個固定倍率。

什麼時候要切換到截圖模式（`browser_take_screenshot`）：
- 頁面以圖片為主（圖庫、地圖、Canvas 渲染）
- 需要確認視覺樣式（顏色、排版是否符合預期）
- Accessibility tree 資訊不足以判斷頁面狀態

## Auto-wait 的實際意義

Playwright 的多數互動操作內建 auto-wait，但**不是全部**：[actionability 表](https://playwright.dev/docs/actionability)裡 `press()`、`pressSequentially()`、`dispatchEvent()`、`setInputFiles()`、`focus()` 完全不做檢查。有做的部分，`click` 等的是 visible + stable + receives events + enabled，`fill` 等的是 visible + enabled + **editable**（沒有 focused 這一項）。

這對 AI agent 的意義是：不需要在 prompt 裡加「先等頁面載入」「等按鈕出現再點」，也不需要在 tool call 之間插 sleep。Playwright 在背後處理這些時序問題，agent 可以直接發出「點擊 Submit」而不管頁面當前狀態。

## 多 tab 管理

多 tab 的開／關／切換／列表都走同一個 `browser_tabs`，用參數區分動作。每個 tab 有獨立的 page context，`browser_snapshot` 和 `browser_take_screenshot` 都針對當前 active tab。跨 tab 的資料傳遞需要透過 `browser_evaluate` 或 agent 自己記下來。

## 限制

**底層 CDP 要另外開**：`--caps=devtools` 之後才有 CDP 通道；不開的話 Playwright 沒封裝的東西（heap snapshot、CPU profile 等）拿不到。真的要做效能／記憶體分析，[Chrome DevTools MCP](/posts/tech/2026-06-20-chrome-devtools-mcp) 是更直接的工具。

**跨瀏覽器不是免費的**：Firefox / WebKit 要用 `--browser` 指定，且 CDP 相關能力只在 Chromium 系有效。

**Accessibility tree 覆蓋率**：頁面如果 ARIA 屬性設得很差，`browser_snapshot` 拿到的資訊可能不完整。這種時候切截圖模式，或是直接 `browser_evaluate` 自己抓 DOM。

**預設帶持久 profile，這是雙面刃**：現在**預設**就是持久 profile（依 MCP client 的 workspace root 分開存放），登入狀態會留到下次。好處是不用每次重登；壞處是同一個 workspace 的多個 client 會搶同一份 profile 而衝突——要並行跑就得加 `--isolated` 或各自指定 `--user-data-dir`。`--isolated` 模式下瀏覽器關掉狀態就消失，要預載登入態得用 `--storage-state` 餵一份 storage state 檔。

## 整體來說

@playwright/mcp 是目前對 AI agent 最友善的 browser MCP 選擇。Accessibility tree 模式省 token、不依賴 vision 模型；auto-wait 讓 agent 的互動可靠性接近 E2E 測試框架的水準。如果你在為 AI agent 選瀏覽器自動化工具，這是合理的預設起點，除非你有明確需要截圖回饋或底層 CDP 控制的理由。

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「瀏覽器自動化與 MCP」系列

## 參考資料

- [@playwright/mcp — GitHub](https://github.com/microsoft/playwright-mcp)
- [@playwright/mcp 工具清單（README › Tools）](https://github.com/microsoft/playwright-mcp#tools)
- [Playwright CLI + Skills — GitHub](https://github.com/microsoft/playwright-cli)
- [Playwright 官方文件](https://playwright.dev/)
- [Playwright 認證與 storage state 文件](https://playwright.dev/docs/auth)
- [ARIA Accessibility Tree — MDN](https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree)
- [Model Context Protocol — 官方文件](https://modelcontextprotocol.io/)
- [Browser MCP 三選一比較](/posts/tech/2026-06-20-browser-mcp-comparison)
