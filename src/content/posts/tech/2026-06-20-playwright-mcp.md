---
title: "@playwright/mcp：微軟官方的瀏覽器自動化 MCP Server"
date: 2026-06-20
category: tech
type: deep-dive
tags: [playwright, mcp, browser-automation, ai-agent, e2e-testing, developer-tools]
lang: zh-TW
tldr: "@playwright/mcp 預設用 accessibility tree（browser_snapshot）取代截圖，省下 90%+ 的 token 消耗，加上 Playwright 原生 auto-wait，是目前 AI agent 做網頁自動化的最佳起點。"
description: "深入介紹 @playwright/mcp：安裝設定、核心工具列表、accessibility tree 模式的 token 優勢、多 tab 管理，以及什麼時候應該改用截圖模式。"
draft: false
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

預設啟動 Chromium headless。如果需要 headed 模式（可以看到瀏覽器視窗）：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--headed"]
    }
  }
}
```

Attach 到現有 Chrome instance：

```json
{
  "args": ["@playwright/mcp@latest", "--cdp-endpoint", "ws://localhost:9222"]
}
```

## 工具列表

@playwright/mcp 提供的工具分幾類：

**導覽**
- `browser_navigate` — 前往 URL
- `browser_go_back` / `browser_go_forward` — 歷史導覽
- `browser_reload` — 重新整理

**頁面狀態**
- `browser_snapshot` — 取得 ARIA accessibility tree（預設模式，不含圖片）
- `browser_screenshot` — 截圖（base64 PNG，需要 vision 模型）

**互動**
- `browser_click` — 點擊元素（by ARIA label / role / text）
- `browser_type` — 在輸入框輸入文字
- `browser_press_key` — 按鍵（Enter、Tab、Escape 等）
- `browser_hover` — 滑鼠懸停
- `browser_drag` — 拖曳

**表單**
- `browser_select_option` — 下拉選單選值
- `browser_file_upload` — 上傳檔案
- `browser_handle_dialog` — 處理 alert / confirm / prompt

**網路與開發**
- `browser_network_requests` — 列出頁面的網路請求
- `browser_console_messages` — 取得 console 輸出
- `browser_evaluate` — 在頁面 context 執行 JS

**分頁管理**
- `browser_tab_list` — 列出所有 tab
- `browser_tab_new` — 開新 tab
- `browser_tab_select` — 切換 tab
- `browser_tab_close` — 關閉 tab

**儲存**
- `browser_pdf_save` — 頁面輸出成 PDF

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

一張 1920×1080 截圖 base64 編碼後約 100–300KB，對應數萬個 token；同一個頁面的 accessibility tree 通常在 2–10KB，而且不需要 vision 能力的模型就能解析。

什麼時候要切換到截圖模式（`browser_screenshot`）：
- 頁面以圖片為主（圖庫、地圖、Canvas 渲染）
- 需要確認視覺樣式（顏色、排版是否符合預期）
- Accessibility tree 資訊不足以判斷頁面狀態

## Auto-wait 的實際意義

Playwright 所有互動操作都內建 auto-wait：點擊前會等元素 visible + enabled + stable（不在動畫中）；`browser_type` 前等輸入框 focused。

這對 AI agent 的意義是：不需要在 prompt 裡加「先等頁面載入」「等按鈕出現再點」，也不需要在 tool call 之間插 sleep。Playwright 在背後處理這些時序問題，agent 可以直接發出「點擊 Submit」而不管頁面當前狀態。

## 多 tab 管理

@playwright/mcp 支援完整的多 tab 工作流：

```
browser_tab_new → (在新 tab 做事) → browser_tab_select(原 tab) → browser_tab_close
```

每個 tab 有獨立的 page context，`browser_snapshot` 和 `browser_screenshot` 都針對當前 active tab。跨 tab 的資料傳遞需要透過 `browser_evaluate` 或 agent 自己記下來。

## 限制

**無法存取底層 CDP Domain**：HeapProfiler、Profiler、Security 等 Playwright 未封裝的功能在 @playwright/mcp 拿不到。

**Firefox / WebKit 需要額外設定**：預設啟動 Chromium。切換瀏覽器需要在啟動參數裡指定，且部分功能（如 `browser_cdp_send`）只在 Chromium 有效。

**Accessibility tree 覆蓋率**：頁面如果 ARIA 屬性設得很差，`browser_snapshot` 拿到的資訊可能不完整。這種時候切截圖模式，或是直接 `browser_evaluate` 自己抓 DOM。

**Session 不持久**：MCP server 重啟後 session 清除，cookie / localStorage 不保留。需要持久 session 要自己在 `--user-data-dir` 裡管理 profile。

## 整體來說

@playwright/mcp 是目前對 AI agent 最友善的 browser MCP 選擇。Accessibility tree 模式省 token、不依賴 vision 模型；auto-wait 讓 agent 的互動可靠性接近 E2E 測試框架的水準。如果你在為 AI agent 選瀏覽器自動化工具，這是合理的預設起點，除非你有明確需要截圖回饋或底層 CDP 控制的理由。

## 參考資料

- [@playwright/mcp — GitHub](https://github.com/microsoft/playwright-mcp)
- [Playwright 官方文件](https://playwright.dev/)
- [ARIA Accessibility Tree — MDN](https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree)
- [Model Context Protocol — 官方文件](https://modelcontextprotocol.io/)
- [Browser MCP 三選一比較](/posts/tech/2026-06-20-browser-mcp-comparison)
