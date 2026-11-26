---
title: "Cloudflare Browser Run 怎麼用：在 Workers 上跑 headless Chrome"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, browser-run, workers, scraping, screenshots, automation, agents]
lang: zh-TW
tldr: "Browser Run 讓 Workers 使用 Cloudflare 管理的 headless Chrome。Quick Actions 適合 screenshot、PDF、HTML、JSON、crawl 這類單次任務；Browser Sessions 則適合 Puppeteer、Playwright、CDP、Stagehand 這類需要完整控制的 automation。"
description: "從 Cloudflare Browser Run 的 Quick Actions、Browser Sessions、Workers binding、Puppeteer/Playwright/CDP、limits、pricing 與 agent browsing 場景，拆解它在 Edge Platform 和 AI Stack 裡的位置。"
draft: false
series:
  name: "Cloudflare Edge Platform"
  order: 17
additionalSeries:
  - name: "Cloudflare AI Stack"
    order: 9
---

> :globe: [English version](/posts/tech/2026-08-30-cloudflare-browser-run-headless-browser-en)

大部分 Workers 程式只需要 `fetch()`。打 API、讀 JSON、抓 HTML、處理 webhook，這些都不需要真的開瀏覽器。但有些任務只靠 HTTP 會變得很麻煩：截圖、PDF、client-side render 後的頁面、需要 JavaScript 執行的網站、互動式流程測試、或讓 agent 真的操作網頁。

[Cloudflare Browser Run](https://developers.cloudflare.com/browser-run/) 就是這個缺口。它讓你在 Cloudflare global network 上控制 headless Chrome，做 browser automation、web scraping、testing 和 content generation。它以前叫 Browser Rendering，現在改名 Browser Run；這個命名也比較準，因為它不只 render，也可以用 Playwright、Puppeteer、CDP 或 Stagehand 做完整瀏覽器操作。

在 Edge Platform 裡，Browser Run 是「HTTP 不夠時的 managed browser」。在 AI Stack 裡，它是 agent 的其中一種工具：當 `fetch()` 拿不到你要的狀態，或 task 需要點擊、登入、等待 UI、抽 structured data，就需要真的開 browser。

如果用英文 tag 來描述，它最常落在 `screenshots`、`automation`、`scraping` 和 `agents` 這幾類工作。

## 先選：Quick Actions 還是 Browser Sessions

Browser Run 有兩種整合方式。

| 方式 | 做什麼 | 適合 |
|---|---|---|
| Quick Actions | 用 REST API 或 Worker binding 跑單次 stateless browser task | screenshot、PDF、HTML、Markdown、links、JSON extraction、crawl |
| Browser Sessions | 用 Puppeteer、Playwright、CDP、Stagehand 控制 browser | 複雜 automation、登入流程、測試、agent browsing、需要重用 session |

這個選擇會影響成本、程式碼和風險。Quick Actions 比較像「把 URL 丟進去，拿結果出來」；Browser Sessions 比較像「拿到一個真正的 browser，自己負責關閉、重用、隔離、錯誤處理」。

如果只是產生一張 screenshot 或 PDF，我會先用 Quick Actions。需要多步驟操作、保留 cookies、點擊 UI、或讓 LLM/agent 接管瀏覽器時，才升到 Browser Sessions。

## Quick Actions：單次 browser 任務

Quick Actions 可以直接用 REST API。截圖例子長這樣：

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/<accountId>/browser-run/screenshot" \
  -H "Authorization: Bearer <apiToken>" \
  -H "Content-Type: application/json" \
  -d '{ "url": "https://example.com" }' \
  --output screenshot.png
```

也可以在 Worker 裡用 browser binding：

```jsonc
{
  "browser": {
    "binding": "BROWSER"
  }
}
```

Worker 端呼叫 `quickAction()`：

```ts
interface Env {
  BROWSER: BrowserRun;
}

export default {
  async fetch(request, env): Promise<Response> {
    return await env.BROWSER.quickAction("screenshot", {
      url: "https://example.com",
    });
  },
} satisfies ExportedHandler<Env>;
```

官方文件提醒，`.quickAction()` 需要 `compatibility_date` 在 `2026-03-24` 或之後。2026-11 起，`wrangler dev` 下的 `.quickAction()` 會改用本機的 Chrome 執行，不必再接 remote binding；但 `json` action 只回符合 schema 的 placeholder（本機沒有 Workers AI），Kitesurf 也不能用，需要真實結果時在 browser binding 設 `"remote": true`。

Quick Actions 的用途很直接：

- 定期產生網站 screenshot。
- 把 invoice、report、dashboard 轉成 PDF。
- 把 JavaScript render 後的頁面轉 Markdown 或 HTML。
- 抓頁面 links、元素、structured JSON。
- 對一個網站做 crawl，產生後續處理資料。

我會把 Quick Actions 接在 [Queues](/posts/tech/2026-08-22-cloudflare-queues) 後面，而不是讓使用者 request 直接等 browser。Browser 啟動和 render 本來就比一般 API 慢，排到背景工作比較穩。

## Browser Sessions：完整控制瀏覽器

Browser Sessions 適合更複雜的 automation。Cloudflare 支援 Puppeteer、Playwright、CDP 和 Stagehand。典型 Worker 會用 browser binding，加上 Cloudflare 的 Puppeteer package：

```ts
import puppeteer from "@cloudflare/puppeteer";

interface Env {
  MYBROWSER: Fetcher;
}

export default {
  async fetch(request, env): Promise<Response> {
    const browser = await puppeteer.launch(env.MYBROWSER);

    try {
      const page = await browser.newPage();
      await page.goto("https://example.com");
      const title = await page.title();
      return Response.json({ title });
    } finally {
      await browser.close();
    }
  },
} satisfies ExportedHandler<Env>;
```

`finally` 很重要。Browser Run 的 limits 文件特別指出，沒有明確 `browser.close()` 的 session 會繼續消耗 browser time，直到 idle timeout。預設 idle timeout 是 60 秒，使用 `keep_alive` 最多可以延長到 20 分鐘。

如果需要跨 request 重用 browser session，可以搭配 [Durable Objects](/posts/tech/2026-08-22-cloudflare-durable-objects)。DO 適合保存 session 狀態、排隊操作、控制同一個 browser 不被多個 request 打爆。這也是 Browser Run 和 Containers 的差別之一：你拿到的是 managed headless Chrome，不是任意 Linux runtime。

## 新選項：/script 與 Kitesurf

2026 下半年 Browser Run 多了兩個值得先知道的選項：

- **`/script`**：把一段 Playwright、Puppeteer 或 raw CDP 的 JavaScript function 用一次 API request 送進去，Browser Run 在隔離的 Worker 裡連上 browser session 執行並回傳結果，不必自己部署 Worker。Worker 內可用 `env.BROWSER.script()`。它屬於 Browser Sessions，按 browser hours 加 concurrent browsers 計費；執行完不會自動關 session，要自己關或等 idle timeout。
- **Kitesurf**：Cloudflare 為 agent 做的 browser engine，整個跑在 Workers 上、不開 Chromium，screenshot、HTML 抽取這類工作吃的 CPU 與記憶體少很多。目前是 beta、免費但有 per-account limits；不能播影片、跑 WebGL、通過需要真實 TLS fingerprint 的 bot challenge，也不適合需要登入狀態的長 session。Quick Actions 加 `browser=kitesurf` 就能試；2026-11 已以 Apache 2.0 開源。

預設的 Chromium 也在 2026-10 升到 Chrome 152，Quick Actions 的預設 User-Agent 從 Chrome 119 改報 Chrome 152。若你的站用 User-Agent 白名單放行 Browser Run，規則要跟著改。

## Limits：先算 browser time 和 concurrency

Browser Run 的限制跟 Workers plan 相關。

Workers Free：

- browser hours：每天 10 分鐘。
- Browser Sessions concurrent browsers：每 account 3 個。
- Browser Sessions 新 browser instance：每 20 秒 1 個。
- browser timeout：60 秒。
- Quick Actions total requests：每 10 秒 1 次。
- `/crawl` endpoint：每天 5 個 crawl jobs，每個 crawl 最多 100 pages。

Workers Paid：

- browser hours：沒有固定上限，依 pricing 計費。
- Browser Sessions concurrent browsers：預設每 account 200 個，可申請提高。
- Browser Sessions 新 browser instances：每秒 3 個。
- browser timeout：60 秒。
- Quick Actions total requests：每秒 30 次。

這些限制會影響架構。如果你的產品要大量產 screenshot，不能讓每個 user request 都開一個新 browser。比較穩的做法是：Queue 收工作、Durable Object 控 concurrency、R2 存輸出、KV 或 Cache Rules 避免重複 render。

## Pricing：Quick Actions 和 Sessions 的成本不同

Browser Run 在 Free 和 Paid 都可用。pricing 頁面把成本拆成兩個維度：

- Quick Actions：只看 browser hours。
- Browser Sessions：看 browser hours，也看 concurrent browsers。

Workers Free 每天有 10 分鐘 browser hours。Workers Paid 每月包含 10 小時，超過後每小時 $0.09。Browser Sessions 的 concurrent browsers 在 Paid 方案包含 10 個，超過後每個 browser $2.00，依 daily peak 的月平均計算。

Quick Actions response 會回 `X-Browser-Ms-Used` header，可以拿來估算每次任務用了多少 browser time。這個欄位很適合寫進 Analytics Engine，讓你知道哪種 URL、哪個 customer、哪個任務類型最花錢。

## 安全與濫用邊界

Browser Run 很容易被做成 open proxy。只要 endpoint 接 `?url=`，就會有 SSRF、內網探測、濫抓網站、帳號濫用、cookie 洩漏、成本暴衝的風險。

我會至少加這些限制：

- URL allowlist 或 domain allowlist。
- 禁止 private IP、localhost、metadata endpoint。
- 每個 tenant / user 的 rate limit。
- Queue job timeout 和 retry 上限。
- screenshot / PDF 輸出寫 R2，不直接把大檔塞進 log。
- 不把登入 session 共用給不同 tenant。
- Browser Sessions 一律 `try/finally` 關閉。

如果是 agent browsing，還要把 tool 權限拆細：只能讀哪些站、能不能點擊、能不能送出表單、能不能下載檔案、產物要不要人工確認。Browser Run 讓 agent 有眼睛和手，但產品仍然要替它畫邊界。

## 和 Containers 的差別

Browser Run 解決的是「我需要一個 managed browser」。[Containers](https://developers.cloudflare.com/containers/) 解決的是「Workers runtime 不夠，我需要自己的 Linux userspace」。兩者都像 escape hatch，但方向不同。

如果任務是 render 網頁、截圖、PDF、Playwright automation，用 Browser Run。  
如果任務是跑 ffmpeg、特殊 binary、long-running service、自訂 runtime，用 Containers。

這條界線可以避免把 Browser Run 當成萬用 compute。Browser 很貴、很重，也有清楚的 concurrency 和時間限制。能用 `fetch()` 解決的任務，不需要開 Chrome；能用 Quick Actions 解決的任務，不需要自己管 session。

## 更新紀錄

- 2026-11-23：REST 範例路徑改為官方文件現用的 `/browser-run/`；`keep_alive` 上限由 10 分鐘改為 20 分鐘；Quick Actions 已可在 `wrangler dev` 本機執行；新增 `/script`、Kitesurf 與 Chrome 152 預設 User-Agent 變更。

## 參考資料

- [Cloudflare Browser Run](https://developers.cloudflare.com/browser-run/)
- [Browser Run get started](https://developers.cloudflare.com/browser-run/get-started/)
- [Browser Run limits](https://developers.cloudflare.com/browser-run/limits/)
- [Browser Run pricing](https://developers.cloudflare.com/browser-run/pricing/)
- [Browser Run Quick Actions](https://developers.cloudflare.com/browser-run/quick-actions/)
- [Browser Run Playwright](https://developers.cloudflare.com/browser-run/playwright/)
- [Browser Run custom scripts](https://developers.cloudflare.com/browser-run/script/)
- [Browser Run Kitesurf](https://developers.cloudflare.com/browser-run/kitesurf/)
- [Changelog：Browser Run now runs Chrome 152](https://developers.cloudflare.com/changelog/post/2026-10-30-chrome-152/)
- [Browser Run with Durable Objects](https://developers.cloudflare.com/browser-run/how-to/browser-run-with-do/)
