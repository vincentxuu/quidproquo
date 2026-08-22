---
title: "Browserbase：把 Agent 的瀏覽器拆成可營運的基礎設施"
date: 2026-08-22
category: ai
type: deep-dive
tags: [browserbase, browser-agent, browser-automation, playwright, stagehand, infrastructure]
lang: zh-TW
tldr: "Browserbase 把遠端 Chromium、持久化 Context、代理伺服器與 Session Inspector 包成同一個控制平面；它解決的是瀏覽器艦隊的生命週期與除錯，不替 agent 決定下一步。官方截至 2026-08 自報每月超過 3,500 萬次 browser session、逾 10,000 家客戶。"
description: "從 sessions、contexts、proxies、observability 與 browser identity 拆解 Browserbase，說清楚它和 Stagehand 的分工、安全界線，以及相對 Steel、Hyperbrowser、Cloudflare Kitesurf 的選型位置。"
draft: false
---

🌏 [English version](/posts/ai/2026-08-22-browserbase-browser-infrastructure-en)

[Browserbase](https://docs.browserbase.com/platform/browser/getting-started/create-browser-session) 是託管瀏覽器基礎設施。程式透過 API 開一個隔離的雲端 Chromium，再用 Playwright、Puppeteer、Selenium 或 Chrome DevTools Protocol（CDP）連上去。它不是另一個會看畫面、規劃步驟的 agent。它接走真正麻煩、又很容易被低估的那一層：啟動與回收瀏覽器、保存登入狀態、管理網路身分，以及留下可重播的執行紀錄。

截至 2026-08，Browserbase 在[官方 evaluations 頁面](https://www.browserbase.com/evaluations)自報每月超過 3,500 萬次 browser session、逾 10,000 家客戶。

公司在 2025-06 宣布由 Notable Capital 領投的 [4,000 萬美元 B 輪](https://www.browserbase.com/blog/series-b-and-beyond)。這些是規模訊號，不代表某個網站一定跑得過。真正的選型問題是下面四個元件能不能替你省掉一套瀏覽器平台。

## 一、Session：把瀏覽器變成短命的運算單位

Browserbase 的基本單位是 **session**，也就是一個遠端 browser instance。建立後會拿到 WebSocket `connectUrl`，現有的自動化程式不用改寫成專有 DSL。[Create Session API](https://docs.browserbase.com/reference/api/create-a-session)同時接受 region、timeout、viewport、proxy 與 context 等設定，逾時範圍為 60 秒到 6 小時。

最小可執行的 TypeScript 用法如下：

```bash
pnpm add @browserbasehq/sdk playwright-core
```

```ts
import { Browserbase } from "@browserbasehq/sdk";
import { chromium } from "playwright-core";

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
const session = await bb.sessions.create({ region: "ap-southeast-1" });
const browser = await chromium.connectOverCDP(session.connectUrl);
const page = browser.contexts()[0].pages()[0];

await page.goto("https://example.com");
console.log(await page.title());
await browser.close();
```

這段程式的價值不在少寫幾行，而是把「一個工作配一個乾淨瀏覽器」做成可計量、可設上限的資源。官方[企業安全文件](https://docs.browserbase.com/account/enterprise/security)說每個 browser 跑在獨立 VM 與 subnet，session 結束後 VM 會銷毀，而不是清 cookies 後放回共用 pool。代價是本機 Chrome 的磁碟、處理程序與網路細節不再由你直接控制；CDP 相容也不等於所有底層行為都與本機相同。

## 二、Context：Session 可以短命，登入狀態不能每次重來

Session 隔離若做到底，每次執行都要重新登入。Browserbase 的 **context** 把 Chromium user data directory 另存成長期物件。它包含 cookies、localStorage、IndexedDB、session storage、service workers 與瀏覽器偏好。[官方文件](https://docs.browserbase.com/platform/browser/core-features/contexts)明確說 HTTP cache 不在其中，而且 context 會個別加密保存。

典型流程是先建 context，第一次 session 設 `persist: true` 完成登入，結束並等待同步後，後續 session 讀同一個 context。不要讓兩個 session 同時寫同一份 context：官方也警告這可能造成網站登出或狀態互蓋。實務上最好用「每個網站、每個登入身分一份 context」，預設唯讀，需要更新狀態時才開 persist。

Context 是方便功能，也是整套系統最敏感的資產。它可能含 session cookie 與 OAuth token；「browser 跑在獨立 VM」不代表拿到 context ID 或專案 API key 的程式就沒有權限。把 context ID 當作憑證索引，限制 agent 能選用的 ID，停用帳號後刪除對應 context，且不要把真正密碼直接塞進 prompt。

## 三、Proxy 與 browser identity：網路出口不是隱形斗篷

Browserbase 的[代理伺服器文件](https://docs.browserbase.com/platform/identity/proxies)提供三種路徑：使用託管 residential proxy、自帶 HTTP/HTTPS proxy，或依 domain pattern 組合路由規則。指定國家、州或城市只是 best effort；要求某個地點時若沒有可用節點，系統可能選最近位置。這適合做區域內容驗證，也適合讓同一個持久化登入維持一致出口。

「換 IP」和「不被辨識」不是同一件事。Browserbase 的標準功能會處理 fingerprint 與 CAPTCHA，Scale 方案另有 [Verified session](https://docs.browserbase.com/platform/identity/overview)。官方說它使用特製 Chromium，以及可被合作的 bot-protection 系統辨識的真實 browser fingerprint。這不是繞過網站授權的通行證。網站條款、robots 規則、帳號權限與資料使用目的仍由呼叫端負責。遇到阻擋時，正確動作是降速、改用正式 API 或取得允許，不是無限輪替身分。

## 四、Observability：影片不是裝飾，是失敗的證物

遠端瀏覽器最痛的 bug 常是「在我這裡重跑不出來」。Browserbase 的 [Session Inspector](https://docs.browserbase.com/platform/browser/observability/observability)把 live view、session 錄影、console 與 CDP network events 放在同一個 session 底下；錄影預設開啟，最多支援十個分頁。用 `userMetadata` 綁上自己的 run ID，才有辦法從 agent trace 反查當時的頁面、請求與終止原因。

這裡也有資料外洩面：影片、console 與 network log 可能錄到姓名、表單內容或 token。官方安全文件允許在建立 session 時關閉 logging 與 recording，形成 zero-data-retention 模式。應按工作分類，而不是認定全部留著才好除錯。測試環境保留完整紀錄；正式環境若會碰醫療、財務或個資，先遮罩輸入、縮短保留期，必要時直接不錄。

## 五、Browserbase 與 Stagehand：機房和駕駛不是同一層

[Stagehand](https://github.com/browserbase/stagehand) 是 Browserbase 維護的 MIT 開源 AI browser automation framework。它提供 `act()`、`extract()`、`observe()` 與 agent 介面，能跑本機 Chromium，也能把執行環境設成 Browserbase。反過來，Browserbase session 可以只接原生 Playwright，完全不用 Stagehand。

可以這樣記：Browserbase 管 browser lifecycle、identity 與 telemetry；Stagehand 把自然語言意圖轉成瀏覽器動作。頁面穩定、selector 已知時，直接用 Playwright 比每一步呼叫模型便宜，也更可預期。頁面結構常變或需要語意擷取時，再把不穩定的那一步交給 Stagehand。把兩者綁死會讓基礎設施問題與模型問題混在同一條 trace 裡。

```text
Agent / workflow
  ├─ deterministic step ── Playwright ─┐
  └─ semantic step ─────── Stagehand ──┤
                                      ▼
Browserbase session ─ context ─ proxy/identity
                                      │
                              logs / live view / replay
```

## 六、同層替代方案怎麼選

**Steel** 的分界最清楚。[Steel Browser](https://github.com/steel-dev/steel-browser)以 Apache 2.0 開源，能用 Docker 自架，也有託管服務；如果資料不得離開自己的網路、願意維護 browser pool，Steel 提供了 Browserbase 沒有的退路。Browserbase 的優勢則是把 VM 隔離、託管 identity 與企業控制整合成服務，不用自己營運。

**Hyperbrowser** 與 Browserbase 最接近，同樣有 session、recording、proxy、profile 與 stealth。[Hyperbrowser 文件](https://www.hyperbrowser.ai/docs/sessions/profiles)顯示 profile 還能選擇保存 HTTP cache；其 [Ultra Stealth](https://www.hyperbrowser.ai/docs/sessions/parameters)則是 Enterprise 功能。若你主要使用它內建的 scrape、crawl 或 agent API，應做實際網站的成功率與 trace 品質試跑，不能只比功能勾選表。

**Cloudflare Kitesurf** 是不同方向。它不是託管完整 Chromium，而是跑在 Workers V8 isolate 的無狀態 agent-first browser；[2026-08 官方文件](https://developers.cloudflare.com/browser-run/kitesurf/)明列目前不能播放影片、跑 WebGL、完成真實 TLS fingerprint 的 bot challenge，也不適合長時間的登入 session。只做一次性 HTML、PDF 或 screenshot，且頁面相容時，Kitesurf 的輕量設計更合理；要真實 Chromium、擴充套件、長登入與持久狀態，才回到 Browserbase 這一型。

## 七、適合、不適合，以及上線前的邊界

Browserbase 適合 browser session 會突發擴張、登入流程昂貴、需要人工接手或逐次稽核，而且團隊不想養 Chrome fleet 的產品。尤其同一套 agent 要跨許多第三方網站時，context、proxy 與 replay 不是附加功能，而是能否營運的主體。

它不適合只抓靜態公開頁面——先用 HTTP fetch；不適合必須完全自架的環境——看 Steel；也不適合把「stealth」當成未經授權大量擷取的商業模型。上線前至少做四件事：替 session 設 timeout 與 concurrency budget；把 context 做成 allowlist；按資料敏感度決定是否錄影；對登入過期、CAPTCHA 與網站拒絕建立可停止、可轉人工的路徑。

整體取捨很直接：Browserbase 用供應商鎖定與託管成本，換掉 browser fleet 最難營運的四件事。真正值得買的不是「agent 可以開網頁」，而是它失敗時，你知道是哪一個 session、哪一份身分、哪一條網路路徑出了問題，並且能安全地停下來。

## 參考資料

- [Browserbase：Create a browser session](https://docs.browserbase.com/platform/browser/getting-started/create-browser-session)（session 定位、framework 與進階功能）
- [Browserbase Create Session API](https://docs.browserbase.com/reference/api/create-a-session)（連線端點、region、timeout 與設定欄位）
- [Browserbase Contexts](https://docs.browserbase.com/platform/browser/core-features/contexts)（保存範圍、同步、加密與登入建議）
- [Browserbase Proxies](https://docs.browserbase.com/platform/identity/proxies)（託管、自帶與規則式 proxy）
- [Browserbase Agent Auth & Identity](https://docs.browserbase.com/platform/identity/overview)（Verified、CAPTCHA 與 signed agents）
- [Browserbase Observability](https://docs.browserbase.com/platform/browser/observability/observability)（live view、錄影、console 與 network logs）
- [Browserbase Enterprise security](https://docs.browserbase.com/account/enterprise/security)（VM 隔離、subnet、錄影控制與合規）
- [Browserbase Evaluations](https://www.browserbase.com/evaluations)（公司自報 monthly sessions 與 customers）
- [Building the future of web automation](https://www.browserbase.com/blog/series-b-and-beyond)（官方 B 輪公告）
- [browserbase/stagehand](https://github.com/browserbase/stagehand)（Stagehand 開源原始碼與執行環境）
- [steel-dev/steel-browser](https://github.com/steel-dev/steel-browser)（Steel 自架方式、CDP 與功能範圍）
- [Hyperbrowser Profiles](https://www.hyperbrowser.ai/docs/sessions/profiles)（持久狀態與 network cache）
- [Hyperbrowser Session Parameters](https://www.hyperbrowser.ai/docs/sessions/parameters)（proxy 與 stealth 設定）
- [Cloudflare Kitesurf 文件](https://developers.cloudflare.com/browser-run/kitesurf/)（無狀態架構、適用範圍與限制）
