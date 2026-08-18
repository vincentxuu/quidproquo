---
title: "Browser MCP 三選一：CDP、Playwright MCP、Puppeteer MCP 比較"
date: 2026-06-20
category: tech
type: deep-dive
tags: [mcp, browser-automation, playwright, puppeteer, cdp, ai-agent, developer-tools]
lang: zh-TW
tldr: "這題現在其實是二選一：@playwright/mcp（跨瀏覽器、accessibility tree 省 token）對上 chrome-devtools-mcp（Chrome 官方、效能與記憶體診斷）；@modelcontextprotocol/server-puppeteer 已被封存，不再是選項。分野也不再是抽象層級高低，而是「操作網頁」還是「診斷 Chrome」。"
description: "比較三種 Browser MCP 方案：Chrome 官方的 chrome-devtools-mcp、微軟的 @playwright/mcp、已封存的 @modelcontextprotocol/server-puppeteer，從維護狀態、頁面狀態回傳、瀏覽器支援與適用場景逐一對比。"
draft: false
series:
  name: "瀏覽器自動化與 MCP"
  order: 4
---

> 🌏 [English version](/posts/tech/2026-06-20-browser-mcp-comparison-en)

AI agent 要控制瀏覽器，過去常被拿出來比的是三條路線：[Chrome DevTools MCP](/posts/tech/2026-06-20-chrome-devtools-mcp)、微軟官方的 [@playwright/mcp](https://github.com/microsoft/playwright-mcp)、以及 MCP 官方倉庫的 [@modelcontextprotocol/server-puppeteer](/posts/tech/2026-06-20-puppeteer-mcp)。

**這三者的相對位置已經和當初不一樣了**，先把兩件事講清楚：

1. **server-puppeteer 已被官方封存**，搬到 [servers-archived](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer)，npm 最後一版停在 `2025.5.12`。它現在的角色是「歷史對照組」，不是候選方案。
2. **Chrome DevTools MCP 有官方套件了**，就是 Chrome 團隊維護的 [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)。它底層是 Puppeteer，互動會自動等結果，**不再是「raw protocol、要自己實作 auto-wait」的那條路**。

所以真正還要比的是兩個，而且比較的軸線變了。

## 舊的比較軸為什麼失效了

原本大家用「抽象層級」排序：CDP 最低、Puppeteer 中間、Playwright 最高。這條軸現在量不出東西——chrome-devtools-mcp 和 @playwright/mcp 都是高階封裝，都有 auto-wait，都能回傳結構化的頁面快照，安裝方式也一樣是一行 `npx`。

現在真正分開它們的是**目的**：

- **@playwright/mcp 是為了「讓 agent 操作網頁」**。它的取捨全部繞著這件事：accessibility tree 取代截圖以省 token、跨三個瀏覽器引擎、斷言與 locator 產生器（給測試用）。
- **chrome-devtools-mcp 是為了「讓 agent 診斷 Chrome」**。效能 trace 與 insight、Lighthouse、heap snapshot、擴充功能管理——這些 Playwright MCP 沒有對應工具，而它們也不是拿來點網頁的。

## 比較表

| | chrome-devtools-mcp | @playwright/mcp | server-puppeteer |
|---|---|---|---|
| 維護狀態 | Chrome 團隊，持續更新 | 微軟，持續更新 | **已封存（2025.5.12 後無更新）** |
| 主要用途 | 診斷、除錯、效能分析 | 一般網頁自動化、E2E 測試 | —— |
| 底層 | Puppeteer | Playwright | Puppeteer |
| Auto-wait | ✅ | ✅ | ❌ |
| 頁面狀態回傳 | 快照（`take_snapshot`）或截圖 | accessibility tree（預設）或截圖 | 截圖（base64）|
| 瀏覽器支援 | Chrome / Chrome for Testing | Chromium / Firefox / WebKit | Chromium only |
| Attach 現有瀏覽器 | ✅ `--browser-url` / `--ws-endpoint` / `--auto-connect` | ✅ `--cdp-endpoint` / `--extension` | 有限 |
| 效能 trace / Lighthouse | ✅ | ❌ | ❌ |
| 記憶體 heap snapshot | ✅（`--memoryDebugging`） | ❌ | ❌ |
| 擴充功能 / PWA 管理 | ✅ | ❌ | ❌ |
| 網路攔截改寫 | ✅ | ✅（`--caps=network`） | 需自己用 evaluate 兜 |
| 斷言 / locator 產生 | ❌ | ✅（`--caps=testing`） | ❌ |
| 控制 context 大小 | `--slim` | `--caps` 逐項開 | 工具集本來就只有 7 個 |
| 預設回報使用統計 | ✅（`--no-usage-statistics` 關閉） | ❌ | ❌ |

## 先釐清「CDP」這個詞

比較文裡「CDP MCP」和「Chrome DevTools MCP」常被混用，值得拆開：

- **Chrome DevTools**：瀏覽器內建的開發者工具面板，按 F12 打開的那個 UI。
- **Chrome DevTools Protocol（CDP）**：DevTools 面板「背後」跟瀏覽器引擎溝通的 WebSocket 協議。
- **chrome-devtools-mcp**：Chrome 團隊把 DevTools 的能力包成 MCP server。它操控的是瀏覽器引擎，不是 DevTools 面板的 UI。

要補充的是：**CDP 不是只有 chrome-devtools-mcp 在用**。Puppeteer、Playwright 的 Chromium backend、Lighthouse 都建在 CDP 上。所以「用 CDP」不是某一條路線的特徵——三者都在用，差別只在它們把哪些 Domain 暴露給了 agent。

## @playwright/mcp：操作網頁的預設選擇

Playwright MCP 最重要的設計決策是 `browser_snapshot`：以 ARIA accessibility tree 取代截圖回傳頁面狀態。同一頁面，accessibility tree 的體積比截圖小一到兩個數量級，而且不需要 vision 能力的模型就能處理。

Playwright 本身的 auto-wait 邏輯（等元素 interactable 才操作）讓 agent 的重試邏輯大幅簡化，不需要在 prompt 裡寫「先等 DOM 更新」這類指令。跨瀏覽器支援（Chromium / Firefox / WebKit）讓它也適合需要驗證多瀏覽器行為的 QA agent。

兩個容易踩的預設值：**現在預設是 headed 不是 headless**（要無頭加 `--headless`），而且**預設使用持久 profile**（登入狀態會留著；要並行跑多個 client 得加 `--isolated`）。細節見[單篇介紹](/posts/tech/2026-06-20-playwright-mcp)。

順帶一提，上游 README 現在會先勸你考慮 [Playwright CLI + Skills](https://github.com/microsoft/playwright-cli)：對 coding agent 來說，CLI 不必把 tool schema 和整棵 accessibility tree 灌進 context，更省。MCP 的定位收斂成「需要持續瀏覽器狀態的長時間 agentic loop」。

## chrome-devtools-mcp：診斷 Chrome 裡發生了什麼

它的差異化不在點網頁，在於它把 DevTools 的診斷能力搬進 tool 介面：錄效能 trace 再用同一套 DevTools 分析引擎取出洞察、跑 Lighthouse、拍 heap snapshot 並比對兩份快照找 retainer、管理擴充功能與 PWA、拿到帶 source map 的 console stack trace。

代價也清楚：只支援 Google Chrome 與 Chrome for Testing；官方明講這個 server 會把瀏覽器裡的任何資料攤開給 MCP client；使用統計預設開啟。細節見[單篇介紹](/posts/tech/2026-06-20-chrome-devtools-mcp)。

## server-puppeteer：留作對照

工具集精簡（navigate、screenshot、click、fill、select、hover、evaluate），以截圖回傳頁面狀態，`puppeteer_evaluate` 當萬用逃生門。它示範的那條光譜仍然有參考價值——工具集愈小，agent 要自己寫 JS 的比例愈高；頁面狀態愈依賴截圖，token 成本愈難壓——但它已經不再更新，新專案不該選。

## 怎麼選

**一般網頁自動化 / 讓 agent 操作網頁** → @playwright/mcp。

**跨瀏覽器測試（Firefox / WebKit）** → @playwright/mcp（另一個不支援）。

**效能分析、記憶體洩漏排查、Lighthouse、Chrome extension / PWA 開發** → chrome-devtools-mcp。

**想讓 agent 用你已經登入的瀏覽器** → 兩者都能接現有 instance：Chrome 用 chrome-devtools-mcp 的 `--browser-url`／`--auto-connect` 最直接；要留在 Playwright 生態就用 `--extension`。

**兩件事都要** → 兩個一起掛沒有衝突，但要留意 context：把 chrome-devtools-mcp 開 `--slim`、Playwright 只開需要的 `--caps`，不然兩套 tool schema 加起來會很可觀。

## 整體來說

這題從「三種抽象層級選一個」變成「兩種目的選一個」。@playwright/mcp 負責讓 agent 把網頁操作對；chrome-devtools-mcp 負責讓 agent 說得出網頁為什麼慢、為什麼漏。server-puppeteer 則示範了另一件事：**MCP server 的生命週期比你以為的短**——選型時把「還有沒有人維護」放進評估表，比比較工具數量有用得多。

## 參考資料

- [@playwright/mcp — GitHub](https://github.com/microsoft/playwright-mcp)
- [chrome-devtools-mcp — GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [@modelcontextprotocol/server-puppeteer — GitHub（已封存）](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer)
- [Playwright CLI + Skills — GitHub](https://github.com/microsoft/playwright-cli)
- [Chrome DevTools Protocol — 官方文件](https://chromedevtools.github.io/devtools-protocol/)
- [Playwright 官方文件](https://playwright.dev/)
- [Model Context Protocol — 官方文件](https://modelcontextprotocol.io/)
- [Chrome DevTools MCP 介紹](/posts/tech/2026-06-20-chrome-devtools-mcp)
- [@playwright/mcp 介紹](/posts/tech/2026-06-20-playwright-mcp)
- [@modelcontextprotocol/server-puppeteer 介紹](/posts/tech/2026-06-20-puppeteer-mcp)
