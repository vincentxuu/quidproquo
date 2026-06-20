---
title: "Chrome DevTools Protocol（CDP）：瀏覽器自動化的底層協議"
date: 2026-06-20
category: tech
type: deep-dive
tags: [chrome, cdp, browser-automation, debugging, devtools]
lang: zh-TW
tldr: "CDP 是 Chrome 原生暴露的 JSON-RPC over WebSocket 協議，覆蓋 Network、Page、DOM、Runtime、Debugger 等 40+ 個 Domain，Puppeteer 與 Playwright 都以它為底層。直連 CDP 能做到高層工具無法觸及的細粒度控制。"
description: "深入介紹 Chrome DevTools Protocol（CDP）的架構、通訊方式、主要 Domain 以及與 Puppeteer、Playwright 的關係，協助你理解瀏覽器自動化的底層機制。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-06-20-chrome-cdp-en)

CDP 是 Google Chrome 暴露給外部程式控制瀏覽器的原生協議。你用過 Puppeteer 或 Playwright，其實底層都在打 CDP。這篇從協議層說起，幫你理解它的架構、能做什麼，以及什麼時候值得直接操作它而不是透過高層工具。

## 什麼是 CDP

[Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) 是 Chromium 在 2017 年隨 Chrome 59 正式開放的遠端除錯協議。Chrome DevTools 自己就是用 CDP 跟瀏覽器溝通的——打開 DevTools 的「Network」或「Sources」面板，背後都在透過 CDP 訂閱事件、查詢 DOM。

協議採 **JSON-RPC 2.0 over WebSocket**。啟動 Chrome 時帶上 `--remote-debugging-port=9222`，瀏覽器就會在 `localhost:9222` 監聽 WebSocket 連線：

```bash
# headless 啟動範例
google-chrome \
  --headless \
  --remote-debugging-port=9222 \
  --no-sandbox \
  --disable-gpu
```

連線後先打 `http://localhost:9222/json/version` 取得 WebSocket URL，再建立 WS 連線。每個 Chrome tab 都有獨立的 WebSocket endpoint，統一透過 `http://localhost:9222/json` 列出。

## 協議架構：Domain 與 Method

CDP 把功能切成 40+ 個 **Domain**，每個 Domain 各自有 Methods（主動呼叫）、Events（訂閱推送）和 Types（資料結構）。常用的 Domain 包括：

| Domain | 功能 |
|---|---|
| [`Page`](https://chromedevtools.github.io/devtools-protocol/tot/Page/) | 頁面導覽、截圖、lifecycle events（DOMContentLoaded、load、frameNavigated）|
| [`Network`](https://chromedevtools.github.io/devtools-protocol/tot/Network/) | 攔截請求、修改 headers、回應 body、模擬離線與限速 |
| [`DOM`](https://chromedevtools.github.io/devtools-protocol/tot/DOM/) | 查詢 / 修改 DOM 節點、監聽 DOM mutation |
| [`Runtime`](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/) | 在頁面 context 執行 JS、取得 RemoteObject |
| [`Debugger`](https://chromedevtools.github.io/devtools-protocol/tot/Debugger/) | 設定 breakpoint、單步執行、取得呼叫堆疊 |
| [`Target`](https://chromedevtools.github.io/devtools-protocol/tot/Target/) | 管理多個 tab / iframe / worker |
| [`Emulation`](https://chromedevtools.github.io/devtools-protocol/tot/Emulation/) | 模擬裝置尺寸、geolocation、timezone、media |
| [`Performance`](https://chromedevtools.github.io/devtools-protocol/tot/Performance/) | 取得 runtime metrics（JS heap、layout count 等）|

一個典型的 JSON-RPC 請求長這樣：

```json
{
  "id": 1,
  "method": "Network.enable",
  "params": {}
}
```

瀏覽器回應：

```json
{
  "id": 1,
  "result": {}
}
```

事件是單向推送，沒有 `id`：

```json
{
  "method": "Network.requestWillBeSent",
  "params": {
    "requestId": "...",
    "request": {
      "url": "https://example.com/api/data",
      "method": "GET",
      "headers": { ... }
    }
  }
}
```

## 直接使用 CDP

最低門檻是用 [`chrome-remote-interface`](https://github.com/cyrus-and/chrome-remote-interface)（Node.js，~4k GitHub stars），它封裝了 WS 連線與 Domain / Method 的自動補全：

```typescript
import CDP from "chrome-remote-interface";

const client = await CDP({ port: 9222 });
const { Network, Page } = client;

await Network.enable();
await Page.enable();

Network.requestWillBeSent(({ request }) => {
  console.log("→", request.url);
});

await Page.navigate({ url: "https://example.com" });
await Page.loadEventFired();

const { data } = await Page.captureScreenshot({ format: "png" });
// data 是 base64 encoded PNG

await client.close();
```

Python 端可用 [`pychrome`](https://github.com/fate0/pychrome) 或 [`pycdp`](https://github.com/HMaker/python-chrome-devtools-protocol)。

## CDP 與高層工具的關係

[Puppeteer](https://pptr.dev/) 由 Google 官方維護，是 CDP 的直接高層封裝，幾乎所有 API 都對應到一個或多個 CDP 呼叫。它管理 Chrome 程序生命週期、維護 Target 多工、重試機制，讓你不用自己處理 WebSocket 連線斷線與重連。

[Playwright](https://playwright.dev/) 更廣，同時支援 Chromium（透過 CDP）、Firefox（CDP subset + Firefox Remote Protocol）與 WebKit（WebKit Remote Debugging Protocol）。它在 CDP 之上加了更高一層的抽象，例如 auto-wait（自動等元素可互動再操作）和 network interception 的 route API。

依 Playwright 官方說明，它的 Chromium channel 與 CDP 的對應是 1:1，但 Firefox 與 WebKit 通道有部分功能落差，不能完整對等。

直連 CDP 的場景：
- 需要存取 Puppeteer / Playwright 未暴露的 Domain（如 `Profiler`、`HeapProfiler`、`Security`）
- 需要在既有的 Chrome instance 上附加（attach），而非啟動新的 browser process
- 效能分析工具，需要原始的 CDP event stream 而非封裝後的結果

## 適合與不適合的情境

**適合直連 CDP：**
- 寫自定義的 DevTools panel 或 Chrome Extension 後端
- E2E test 框架開發（你在做的是工具，不是測試案例）
- 側錄真實流量做回放測試（Record & Replay）
- 需要精細控制 Network interception 或取得 raw request/response body

**不適合直連 CDP：**
- 一般 E2E 測試——Playwright 或 Puppeteer 幾乎都能覆蓋，而且有更好的 auto-wait 與重試邏輯
- 跨瀏覽器場景——CDP 是 Chromium 專屬（Firefox 的支援有限）
- 快速爬蟲——Playwright `page.goto` + `locator` 比手動訂閱 CDP event 快得多

## 整體來說

CDP 是一個低層但完整的協議，覆蓋了 Chrome DevTools 能做的幾乎所有事。Puppeteer 和 Playwright 讓大部分使用者不需要直接碰 CDP，但當你需要細粒度控制、側接現有 Chrome instance，或者存取高層工具尚未封裝的功能時，理解 CDP 的架構會讓你知道瓶頸在哪、繞不過去的限制是什麼。

Chromium 專屬是 CDP 最大的邊界。跨瀏覽器的場景選 Playwright；單純自動化 Chromium 且需要精細控制，直連 CDP 或 Puppeteer 都是合理選擇。

## 參考資料

- [Chrome DevTools Protocol — 官方文件](https://chromedevtools.github.io/devtools-protocol/)
- [chrome-remote-interface — GitHub](https://github.com/cyrus-and/chrome-remote-interface)
- [Puppeteer 官方文件](https://pptr.dev/)
- [Playwright 官方文件](https://playwright.dev/)
- [Chrome DevTools Protocol Viewer（可互動瀏覽 Domain）](https://chromedevtools.github.io/devtools-protocol/tot/)
- [Getting Started with Headless Chrome — Google Developers](https://developer.chrome.com/docs/chromium/headless)
