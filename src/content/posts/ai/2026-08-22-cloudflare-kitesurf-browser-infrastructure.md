---
title: "Cloudflare Kitesurf：不是 Chromium 的 Agent 瀏覽器，該拿什麼換規模"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cloudflare, kitesurf, browser-automation, ai-agent, webassembly, workers]
lang: zh-TW
tldr: "Kitesurf 是 Browser Run 內仍在 beta 的非 Chromium 瀏覽器後端：用 Workers isolates、Rust/Wasm 與無狀態元件換低 CPU／記憶體，但犧牲像素相容性、長登入工作階段、WebGL 與完整反機器人能力。"
description: "拆解 Cloudflare Kitesurf 的 Engine、PageScript、PageRenderer 與 SandboxOutbound 架構，釐清它和 Browser Run、舊 Browser Rendering 的關係，並比較 Browserbase、Steel、Hyperbrowser 的選型邊界。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cloudflare-kitesurf-browser-infrastructure-en)

[Kitesurf](https://developers.cloudflare.com/browser-run/kitesurf/) 是 Cloudflare 在 2026-08-06 公布的 agent 專用瀏覽器引擎。它不是 Chromium 包裝，也不是讓人日常上網的桌面瀏覽器。它用 Rust、WebAssembly 與 Cloudflare Workers isolates 實作 agent 常用的 DOM、JavaScript、擷取與繪圖能力。

產品層級要先切清楚：**Browser Run 是 Cloudflare 的託管瀏覽器 API，Kitesurf 是其中一個仍在 beta 的可選後端。** Browser Run 的預設後端仍是 Chromium；請求加上 `browser=kitesurf` 才會切換引擎。2026-04 的「Browser Rendering 改名 Browser Run」是既有產品擴充 CDP、Live View 與 Human in the Loop，不是 Kitesurf 的發布。

截至 2026-08-22，Kitesurf 在 beta 期間免費但受每帳號限制，不能當成 GA 能力承諾。選型問題很直接。大量讀頁面、抽 HTML、截圖的 agent 可能適合 Kitesurf。要長期登入、通過 bot challenge、完整重現 Chrome，則應留在 Chromium。

## 設計哲學：把「人的瀏覽器」拆掉

Chromium 必須服務分頁、擴充套件、影片、WebGL、精準排版與流暢互動。Agent 多半只需要可讀 DOM、能執行網站程式、點擊表單，以及回傳 HTML、PDF 或截圖。Kitesurf 的取捨不是把 Chromium 瘦身，而是重新做一個不同的瀏覽器引擎。

[Cloudflare 的技術公告](https://blog.cloudflare.com/kitesurf/)說明三項原則。失敗時退化成空 frame 或缺少元素，不讓整個 session 死掉；每次載入都視為不可信輸入；能無狀態就無狀態。這讓單次任務可以重試與大量平行化，代價則是無法假設與 Chrome 完全相容。

## 架構：一個有狀態入口，三個隔離元件

```text
CDP / REST client
       │
       ▼
Engine Worker ─── session state
   │        │
   │ RPC    └── SandboxOutbound ── origin assets
   ▼
PageScript isolate ── DOM + JavaScript + CSS
   │ scene
   ▼
PageRenderer Worker ── PNG / JPEG / PDF
```

**Engine** 是唯一對外元件，接 CDP WebSocket 與 REST，並保存 session 狀態。這個相容層讓既有 Puppeteer、Playwright、chrome-remote-interface 或 Chrome DevTools client 不必學一套全新協定。

**PageScript** 為每個頁面或跨程序 iframe 建立 Dynamic Worker isolate。HTML 與 CSS 由 Rust 元件 Blitz、Stylo 解析，網站的 JavaScript 與 Wasm 在該 isolate 執行。Workers 原生不允許 `eval`，目前改由 Rust 的 Boa JavaScript engine 處理。這是可用的相容補洞，不等於完整 V8 行為。

**PageRenderer** 透過 Workers RPC 接收 scene，載入字型與圖片後輸出畫面。它不保存頁面狀態，卡死時可以直接丟棄重開。**SandboxOutbound** 則是唯一能對 origin 發 request 的元件，負責 CORS、headers、response filtering 與每頁獨立 cookie jar；其他元件不能直接連外。

## 最小用法：同一個 API，只換 browser 參數

最短路徑是 Browser Run Quick Action。建立最小權限 API token，不要把 Global API Key 放進 agent：

```bash
curl -X POST \
  'https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/browser-run/screenshot?browser=kitesurf' \
  -H 'Authorization: Bearer <API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.com"}' \
  --output screenshot.png
```

需要互動就連 [CDP endpoint](https://developers.cloudflare.com/browser-run/kitesurf/)：

```text
wss://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/browser-run/devtools/browser?browser=kitesurf
```

真正實作時不要全域切換。先建立 routing policy：公開內容擷取、PDF、相容網站截圖走 Kitesurf；登入、付款、影片、WebGL 或相容性未知的流程走 Chromium。Kitesurf 失敗後是否 fallback 也要有限次數，否則 agent 會把同一頁無限重播。

## 效能數字：省資源，但不是比較快

Cloudflare 自家 benchmark 使用 14 個 URL、每項五次 Browser Run Quick Action，並拿 Kitesurf 冷執行和 Chromium warm pool 比。[公告結果](https://blog.cloudflare.com/kitesurf/)顯示 HTML 擷取的記憶體少七倍，CPU 少 3.8 倍；但 wall time 慢 1.7 倍。這組數字適合說明架構取捨，不能外推成所有網站都更省或更快。

相容性也只能當進度指標。Cloudflare 自報 Kitesurf 已通過約 215,000 個 Web Platform Tests；WPT 測的是標準行為，不等於真實網站、反機器人系統或視覺回歸都會通過。今晚能做的測試是拿自己流量最高的 20 個網站，逐一比對 DOM 欄位、互動結果與 screenshot diff，而不是只看 WPT 總數。

## 安全邊界：網站隔離了，agent 還沒安全

元件隔離與單一 outbound worker 降低惡意頁面跨 session 或直接碰控制面的機會；每次 session 乾淨開始，也縮小 cookie 汙染。但瀏覽器 sandbox 防的是網站程式碼，**不會防 prompt injection 說服 agent 主動呼叫工具**。

控制面仍要做四件事：URL allowlist 與私有 IP／metadata endpoint 阻擋、token 最小權限、敏感動作前重新授權、頁面內容和工具指令分離。不要把從 DOM 讀到的文字當成 system instruction；也不要讓 browser tool 同時握有雲端管理 token、付款權限與內網存取。

## 明確限制

[官方文件](https://developers.cloudflare.com/browser-run/kitesurf/)列出三個目前不適用的情況：影片或 WebGL、需要真實 TLS fingerprint 的 bot challenge，以及要求持久狀態的長時間登入 session。Kitesurf 也不承諾像素級 Chromium rendering；CSS 或 JavaScript 邊角差異是設計取捨，不只是待修 bug。

這些限制決定它不是 Browserbase、Steel 或 Hyperbrowser 的一比一替代品。Kitesurf 的優勢是每個讀取任務便宜地生滅；其他三家主要交付完整 Chrome session，並把 proxy、登入狀態與人工介入包進平台。

## 與 Browserbase、Steel、Hyperbrowser 怎麼選

| 最重要的需求 | 先看 | 理由 |
|---|---|---|
| 大量無狀態讀頁、HTML／PDF／截圖，已用 Workers | Kitesurf | 非 Chromium、isolate 原生、Browser Run Quick Actions；接受 beta 與相容性取捨 |
| 完整 Chrome、持久登入、live inspector 與代管代理網路 | Browserbase | [Session 是核心物件](https://docs.browserbase.com/reference/api/overview)，Contexts 可跨 session 重用環境；託管 proxy 與觀測功能較完整 |
| 想自架完整瀏覽器 API | Steel | [Apache-2.0 專案](https://github.com/steel-dev/steel-browser)可用 Docker 自架，保留 CDP、session、proxy、extension 與 quick actions |
| 完整 Chrome 加 stealth、CAPTCHA、profile 與 agent API | Hyperbrowser | [Session parameters](https://www.hyperbrowser.ai/docs/sessions/parameters)把 proxy、stealth、CAPTCHA、recording 與 profile 做成設定；部分能力需付費或 Enterprise |

比較時不要只問「能不能開網頁」。用同一批目標網站測五件事：登入能否保存、動態頁能否完成、被擋率、人工接管流程、每個成功任務成本。Kitesurf 最可能贏的是可重播的讀取型任務；完整 Chromium 平台最可能贏的是有身分、長時間且網站相容性優先的任務。

## 整體來說

Kitesurf 不是 Cloudflare 做了一個更便宜的 Chrome，而是把「agent 真的需要多少瀏覽器」變成架構問題。Engine 留最少 session state，頁面程式與 rendering 分拆到 isolates，網路集中經過 SandboxOutbound；這套設計很適合大量、短命、可重試的網頁工作。

目前它仍是免費 beta，也有清楚的功能缺口。最穩健的導入方式，是把它當 Browser Run 的第二個 execution backend。先用任務分類與相容性測試吃下擷取流量，再讓 Chromium 保留登入、反機器人與視覺精準流程。等實際成功率和成本證明值得，再擴大路由比例。

## 參考資料

- [Kitesurf — Cloudflare Browser Run docs](https://developers.cloudflare.com/browser-run/kitesurf/)（beta 狀態、使用方式、適用與不適用情境）
- [Introducing Kitesurf](https://blog.cloudflare.com/kitesurf/)（架構、隔離模型、WPT 與 vendor benchmark 方法）
- [Kitesurf playground](https://kitesurf.cloudflare.app/)（公開 CDP、支援輸出與執行限制）
- [Browser Run: give your agents a browser](https://blog.cloudflare.com/browser-run-for-ai-agents/)（Browser Rendering 改名與 Browser Run 功能範圍）
- [Browserbase API Overview](https://docs.browserbase.com/reference/api/overview) 與 [Proxies](https://docs.browserbase.com/platform/identity/proxies)（session、context 與 proxy 模型）
- [Steel Browser GitHub repository](https://github.com/steel-dev/steel-browser)（自架、CDP、session、proxy 與 quick actions）
- [Hyperbrowser Introduction](https://www.hyperbrowser.ai/docs/introduction) 與 [Session Parameters](https://www.hyperbrowser.ai/docs/sessions/parameters)（Chrome session、stealth、proxy、CAPTCHA 與 recording）
