---
title: "Cloudflare Browser Run：一個 REST 呼叫還是開一個瀏覽器 session，Workers 整合換到什麼、限制在哪"
date: 2026-11-19
category: ai
type: deep-dive
tags: [cloudflare-browser-run, cloudflare-workers, puppeteer, playwright, browser-automation]
lang: zh-TW
tldr: "Browser Run（2026 年 4 月前叫 Browser Rendering）有兩種用法。Quick Actions 是一個 HTTP 請求換一種輸出：HTML、截圖、PDF、Markdown、用模型抽 JSON，或非同步爬整個網站，只收瀏覽器時數。Browser Sessions 用 Puppeteer、Playwright 或直接用 CDP 控制瀏覽器，能多步互動、保留登入、開即時畫面讓人接手，另收併發費。在 Workers 裡用免 API token、能用 Durable Objects 重用 session。限制是：閒置 60 秒就關（最多延到 20 分鐘）、永遠被標成 bot、不能換 IP 或設 proxy，Worker 內的 Stagehand 只支援 v2.5。"
description: "Cloudflare Browser Run 深入介紹：Quick Actions 各端點（/markdown、/json、/crawl 等）與計費，Browser Sessions 的 Workers binding、Puppeteer／Playwright fork 與外部 CDP 連線，session 重用、Live View 與人工接手，Guardrails 與 outboundByHost，為什麼 Worker 內只支援 Stagehand v2.5，永遠被標成 bot 的影響，以及價格與限制。"
draft: false
series:
  name: "AI 瀏覽器自動化"
  order: 23
---

> :globe: [English version](/posts/ai/2026-11-19-cloudflare-browser-run-en)

[託管對照](/posts/ai/2026-11-19-hosted-browser-comparison)把 Browser Run 歸在「已經在 Workers 上，或只需要一次性輸出」那一格。這篇把它拆開來看。它在 2026 年 4 月從 Browser Rendering [改名](https://blog.cloudflare.com/browser-run-for-ai-agents/)，同時加上 CDP 端點、即時畫面（Live View）、人工接手、錄影，併發上限也從 30 提高到 120（現在 Paid 方案是 200）。

這篇回答：**什麼時候一個 REST 呼叫就夠，什麼時候要開瀏覽器 session；放在 Workers 裡換到什麼，限制在哪。**

## 兩種用法

```diagram
title: Browser Run 的兩種用法
desc: 上排 Quick Actions：你的程式送一個 HTTP 請求給 Browser Run，拿回一種輸出，瀏覽器用完就關。下排 Browser Sessions：Worker 或任何環境透過 binding 或 CDP 連到一個保持開啟的瀏覽器，可以多步操作，並開即時畫面讓人接手。
caption: Quick Actions 只收瀏覽器時數；Browser Sessions 另外按併發瀏覽器數收費。Guardrails、outboundByHost、Live View、錄影都只在 session 上有。
---
<svg viewBox="0 0 640 244">
  <text class="dg-tag" x="24" y="32" dominant-baseline="central">QUICK ACTIONS</text>
  <rect class="dg-box" x="24" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="76" text-anchor="middle" dominant-baseline="central">你的程式</text>
  <rect class="dg-box" x="244" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="320" y="68" text-anchor="middle" dominant-baseline="central">Browser Run</text>
  <text class="dg-sub" x="320" y="88" text-anchor="middle" dominant-baseline="central">開瀏覽器、用完就關</text>
  <rect class="dg-box" x="464" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="68" text-anchor="middle" dominant-baseline="central">一種輸出</text>
  <text class="dg-sub" x="540" y="88" text-anchor="middle" dominant-baseline="central">HTML、截圖、JSON</text>
  <path class="dg-line" d="M176 76H240" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M396 76H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="210" y="62" text-anchor="middle" dominant-baseline="central">HTTP</text>

  <text class="dg-tag" x="24" y="148" dominant-baseline="central">BROWSER SESSIONS</text>
  <rect class="dg-box dg-box--accent" x="24" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="184" text-anchor="middle" dominant-baseline="central">Worker 或任何環境</text>
  <text class="dg-sub" x="100" y="204" text-anchor="middle" dominant-baseline="central">Puppeteer、Playwright</text>
  <rect class="dg-box" x="244" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="320" y="184" text-anchor="middle" dominant-baseline="central">保持開啟的瀏覽器</text>
  <text class="dg-sub" x="320" y="204" text-anchor="middle" dominant-baseline="central">多步操作、留狀態</text>
  <rect class="dg-box" x="464" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="184" text-anchor="middle" dominant-baseline="central">Live View</text>
  <text class="dg-sub" x="540" y="204" text-anchor="middle" dominant-baseline="central">人可以接手</text>
  <path class="dg-line dg-line--accent" d="M176 192H240" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M396 192H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="210" y="178" text-anchor="middle" dominant-baseline="central">CDP</text>
</svg>
```

## Quick Actions：一個請求換一種輸出

[Quick Actions](https://developers.cloudflare.com/browser-run/quick-actions/) 是一組 REST 端點，Browser Run 開一個瀏覽器載入頁面、執行 JavaScript，回給你一種結果：

| 端點 | 回什麼 |
|---|---|
| `/content` | 執行完 JavaScript 之後的完整 HTML |
| `/screenshot`、`/pdf` | 截圖、PDF |
| `/markdown` | 頁面轉成 Markdown |
| `/snapshot` | 一次拿多種格式（至少兩種） |
| `/accessibilityTree` | accessibility tree |
| `/scrape`、`/links` | 指定元素的內容、頁面上所有連結 |
| `/json` | 用模型依 prompt 或 JSON schema 抽成結構化資料 |
| `/crawl` | 從一個網址出發爬整個網站，非同步 |

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/browser-run/markdown" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

在 Worker 裡不用 API token，直接呼叫 binding：`await env.BROWSER.quickAction("content", { url })`（Worker 的 compatibility date，也就是 Workers 執行環境版本，要設在 2026-03-24 以後；`/crawl` 只有 REST）。

幾個要知道的細節：

- **`/json` 預設用 [Workers AI](https://developers.cloudflare.com/browser-run/quick-actions/json-endpoint/) 的 Llama 3.3 70B**，另外計 Workers AI 的費用；可以在 `custom_ai` 填自己的模型和 key，並列多個模型做備援。
- **`/crawl` 是非同步工作。** 送出後拿到 job id，再查結果或訂閱事件；[最多爬 10 萬頁](https://developers.cloudflare.com/browser-run/quick-actions/crawl-endpoint/)、跑 7 天，結果保留 14 天。它遵守 robots.txt 與 `crawl-delay`，User-Agent 固定是 `CloudflareBrowserRenderingCrawler/1.0`、不能改；網站的 Content Signals（網站宣告允許哪些用途，例如搜尋、AI 訓練）若拒絕你宣告的用途，請求直接回 400。`render: false`（不執行 JavaScript）在 beta 期間不收費。
- **可以帶登入資訊。** cookie、HTTP Basic、自訂 header 都能傳，但只能載入頁面，不能點擊或多步操作。
- **計費只算瀏覽器時數**，因 `waitForTimeout` 失敗的請求不收費；預設會快取結果 5 秒。

只要「這一頁的某種表示」，或要整站爬一個允許爬的網站，Quick Actions 就夠了。

## Browser Sessions：要互動、要保留狀態

要點擊、填表、跨請求保留登入，就要開 session。三種接法：

- **在 Worker 裡用 Cloudflare 的 fork。** [`@cloudflare/puppeteer`](https://developers.cloudflare.com/browser-run/puppeteer/)（2.0，基於 Puppeteer 25.10）和 [`@cloudflare/playwright`](https://developers.cloudflare.com/browser-run/playwright/)（1.4，基於 Playwright 1.62）改成接 Browser Run。Puppeteer fork 的文件寫明 Worker 裡不能用 XPath selector、`page.evaluate()` 只能回傳基本型別；Playwright fork 不支援 Firefox、Playwright Test（assertions 以外）和錄影片，文件也說這不是完整清單。
- **在 Worker 裡直接用 binding。** 2026 年 9 月起 [binding](https://developers.cloudflare.com/browser-run/reference/browser-binding-api/) 有 `acquire()`、`connectSession()`、`getLiveView()` 等方法，可以不靠 fork 直接送 CDP。
- **從任何地方用 CDP 連。** 2026 年 4 月起有[外部 CDP 端點](https://developers.cloudflare.com/browser-run/cdp/)，本機、自己的伺服器、CI 都能連，Playwright 用一般的 `playwright-core` 加 `connectOverCDP` 帶 Authorization header 就行，不需要 fork。已經在自架 Chrome 上跑的 CDP 腳本，改一個連線網址就能搬過來。

### session 會被關掉

預設閒置 60 秒就關，可以用 `keep_alive` 延到最多 20 分鐘。這是「閒置」時間，只要一直有動作就沒有總時長上限，但 Browser Run 發布新版時也會關掉 session。新開的瀏覽器沒有上一次的 cookie。

常見的做法是[重用 session](https://developers.cloudflare.com/browser-run/features/reuse-sessions/)：多個請求連到同一個瀏覽器，各自開 browser context；或用 [Durable Object](https://developers.cloudflare.com/browser-run/how-to/browser-run-with-do/)（Workers 裡能保存狀態、長時間存在的物件）持有 session，用 alarm 定時續命，登入狀態存進 Workers 的鍵值儲存 KV。重用可以省掉冷啟動：第三方用 example.com 實測，新開瀏覽器的中位數是 997 ms，重用是 242 ms（[Gologin](https://gologin.com/blog/cloudflare-browser-rendering/) 的測試，它賣的是競爭產品）。

### 只在 session 上才有的功能

- **[Live View](https://developers.cloudflare.com/browser-run/features/live-view/) 與[人工接手](https://developers.cloudflare.com/browser-run/features/human-in-the-loop/)。** 開一個網址看到瀏覽器畫面，必要時進去操作；腳本可以送 `Cloudflare.handoff` 請人處理，等 `Cloudflare.handoffComplete` 再繼續。Live View 網址帶著簽章，拿到完整網址的人就能連進去（可以另外產生唯讀連結），不要外流。
- **錄影。** `recording: true` 記錄 DOM 變化和操作事件，用 rrweb 回放。
- **[Guardrails](https://developers.cloudflare.com/browser-run/features/guardrails/)。** 把 session 的 HTTP、HTTPS 請求限制在允許的主機名（直接列最多 50 個，另可掛上預先定義的網域集合），設定後整個 session 不能改；Quick Actions 和 Kitesurf 都不支援。
- **[outboundByHost](https://developers.cloudflare.com/browser-run/features/outbound-workers/)。** 讓瀏覽器對特定主機名的請求改由你的 Worker 回應，可以接到內網服務或加上驗證。只對 `http://` 有效，HTTPS 請求不會經過它。

## 為什麼 Worker 裡只支援 Stagehand v2.5

這是系列在 [Stagehand v4 篇](/posts/ai/2026-11-18-stagehand-v4)埋的伏筆。[官方文件](https://developers.cloudflare.com/browser-run/stagehand/)的原話：

> Browser Run currently supports `@browserbasehq/stagehand` `v2.5.x` only. Stagehand `v3` and later are not supported because they are not Playwright-based.

在 Worker 裡用 Stagehand，靠的是把 `playwright` 換成 `@cloudflare/playwright` 這個 fork，由 fork 處理 Workers 的連線方式。Stagehand v2 建在 Playwright 上，這招有效；v3 起 Stagehand 自己寫 CDP 層（原因見 [driver 篇](/posts/ai/2026-11-18-cdp-vs-playwright-driver)），換掉 Playwright 也沒用。Stagehand 的 issue 裡有更具體的卡點：v3 用 Node 的 `ws` 套件連 CDP，Workers 不支援（[#1381](https://github.com/browserbase/stagehand/issues/1381)）；3.2 之後又用到 Workers 刻意不實作的 `AsyncLocalStorage.enterWith()`（[#2055](https://github.com/browserbase/stagehand/issues/2055)）。Stagehand 維護者的回覆是希望 Workers 支援 `ws`，而不是改函式庫；截至 2026 年 11 月，修 #2055 的 PR 還沒合併，Cloudflare 的文件也沒有支援 v3 的消息。

文件限制的是 Worker 裡的整合。在 Worker 以外用 Node 跑 v3 以後的版本、經 CDP 端點連 Browser Run，官方沒有寫支不支援。

要給 coding agent 用，Cloudflare 有一個 [Playwright MCP 的 fork](https://developers.cloudflare.com/browser-run/playwright/playwright-mcp/)，目前對應的是上游 0.0.30，落後上游很多版；也可以讓 Google 的 chrome-devtools-mcp 用 `--wsEndpoint`（[設定方式](https://developers.cloudflare.com/browser-run/cdp/mcp-clients/)） 連 CDP 端點。

## 永遠是 bot

Browser Run 不躲。每個請求都帶著不能移除的識別標頭，包括 Web Bot Auth 的簽章（`Signature-agent`、`Signature`），[FAQ](https://developers.cloudflare.com/browser-run/faq/) 寫明「Browser Run requests are always identified as bot traffic by Cloudflare」，[`/crawl` 的文件](https://developers.cloudflare.com/browser-run/quick-actions/crawl-endpoint/)也寫明不會繞過 CAPTCHA 或 Turnstile（Cloudflare 自家的人機驗證）。請求從 Cloudflare 的 IP 範圍發出，不能換 IP；第三方實測在 browser context 設 proxy 會被[拒絕](https://gologin.com/blog/cloudflare-browser-rendering/)。

這直接決定它能用在哪裡：自家網站、合作夥伴的網站、本來就允許機器人的網站。[Hacker News 上](https://news.ycombinator.com/item?id=47329557)常見的批評是它實務上只爬得到本來就讓爬的站，這個說法沒錯，只是這本來就是它的設計。連要在自己的網站上放行 Browser Run，[FAQ](https://developers.cloudflare.com/browser-run/faq/) 也說要 Enterprise 方案才能用到 Bot Management 的欄位寫規則。

## 價格與限制

2026 年 11 月的[限制頁](https://developers.cloudflare.com/browser-run/limits/)與[價格頁](https://developers.cloudflare.com/browser-run/pricing/)：

| | Workers Free | Workers Paid |
|---|---|---|
| 瀏覽器時數 | 每天 10 分鐘 | 每月 10 小時，之後每小時 $0.09 |
| 併發瀏覽器（只算 session） | 3 | 200；平均超過 10 個後每個 $2 |
| 新開瀏覽器 | 每 20 秒 1 個 | 每秒 3 個 |
| Quick Actions 請求 | 每 10 秒 1 次 | 每秒 30 次 |
| `/crawl` | 每天 5 個、每個最多 100 頁 | — |

併發費以「每天尖峰併發的月平均」計算。Kitesurf 引擎目前在 beta、免費，有帳號層級的限制，細節見 [Kitesurf 篇](/posts/ai/2026-08-22-cloudflare-kitesurf-browser-infrastructure)。

本機開發也有落差：`wrangler dev` 下 [`/json`](https://developers.cloudflare.com/browser-run/quick-actions/json-endpoint/) 回傳的是依 schema 產生的假資料，因為本機沒有 Workers AI；上線前要在遠端環境實測。

## 什麼時候用哪個

- **要一頁的 HTML、截圖、PDF、Markdown 或抽成 JSON**：Quick Actions，一個請求解決。
- **要爬一整個允許爬的網站**：`/crawl`。它只沿著連結走，沒有點擊或捲動的參數，要按「顯示更多」才載入內容的網站要用 session。
- **要登入、多步操作，或讓人中途接手**：Browser Sessions，用 Durable Object 重用 session、把登入狀態存進 KV。
- **已經有 Puppeteer、Playwright 腳本跑在別處**：用外部 CDP 端點，改一個連線網址。
- **要用 Stagehand v3、v4，或要 Firefox**：Worker 裡不行。
- **要進有防護的網站、要 proxy 或換 IP**：不適合 Browser Run，見[託管對照](/posts/ai/2026-11-19-hosted-browser-comparison)。

## 想深入

Browser Run 除了預設的 Chromium，還有一個 Cloudflare 自己寫的引擎 Kitesurf：不是 Chromium、資源用量少很多，但能做的事也少。它的架構和取捨，是系列最後一篇 [Kitesurf](/posts/ai/2026-08-22-cloudflare-kitesurf-browser-infrastructure) 的主題。

## 參考資料

- [Cloudflare blog：Browser Run for AI agents](https://blog.cloudflare.com/browser-run-for-ai-agents/)
- [Cloudflare Browser Run 文件](https://developers.cloudflare.com/browser-run/)
- [Browser Run：Quick Actions](https://developers.cloudflare.com/browser-run/quick-actions/)
- [Browser Run：/json endpoint](https://developers.cloudflare.com/browser-run/quick-actions/json-endpoint/)
- [Browser Run：/crawl endpoint](https://developers.cloudflare.com/browser-run/quick-actions/crawl-endpoint/)
- [Browser Run：Puppeteer](https://developers.cloudflare.com/browser-run/puppeteer/)
- [Browser Run：Playwright](https://developers.cloudflare.com/browser-run/playwright/)
- [Browser Run：CDP](https://developers.cloudflare.com/browser-run/cdp/)
- [Browser Run：Reuse sessions](https://developers.cloudflare.com/browser-run/features/reuse-sessions/)
- [Browser Run：Browser Run with Durable Objects](https://developers.cloudflare.com/browser-run/how-to/browser-run-with-do/)
- [Browser Run：Live View](https://developers.cloudflare.com/browser-run/features/live-view/)
- [Browser Run：Human in the Loop](https://developers.cloudflare.com/browser-run/features/human-in-the-loop/)
- [Browser Run：Guardrails](https://developers.cloudflare.com/browser-run/features/guardrails/)
- [Browser Run：Outbound Workers](https://developers.cloudflare.com/browser-run/features/outbound-workers/)
- [Browser Run：Stagehand](https://developers.cloudflare.com/browser-run/stagehand/)
- [Browser Run：Playwright MCP](https://developers.cloudflare.com/browser-run/playwright/playwright-mcp/)
- [Browser Run：FAQ](https://developers.cloudflare.com/browser-run/faq/)
- [Browser Run：Limits](https://developers.cloudflare.com/browser-run/limits/)
- [Browser Run：Pricing](https://developers.cloudflare.com/browser-run/pricing/)
- [browserbase/stagehand issue #1381](https://github.com/browserbase/stagehand/issues/1381)
- [browserbase/stagehand issue #2055](https://github.com/browserbase/stagehand/issues/2055)
- [Gologin：Cloudflare Browser Rendering review](https://gologin.com/blog/cloudflare-browser-rendering/)
- [Browser Run：Browser binding API](https://developers.cloudflare.com/browser-run/reference/browser-binding-api/)
- [Browser Run：MCP clients](https://developers.cloudflare.com/browser-run/cdp/mcp-clients/)
- [Hacker News：Cloudflare crawl endpoint 討論](https://news.ycombinator.com/item?id=47329557)
