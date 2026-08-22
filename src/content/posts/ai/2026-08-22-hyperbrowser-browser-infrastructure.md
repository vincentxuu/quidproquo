---
title: "Hyperbrowser 深入介紹：Agent 的 Browser-as-a-Service 執行層"
date: 2026-08-22
category: ai
tags: [hyperbrowser, browser-agent, browser-automation, playwright, web-scraping, ai-agent]
lang: zh-TW
type: deep-dive
tldr: "Hyperbrowser 把 Playwright／Puppeteer 的 Chrome session、proxy、stealth、profile 與錄影包成託管 API；它適合要快速擴充真實瀏覽器工作的 Agent，但 profile 憑證、反爬蟲合規與 proxy 流量成本仍由應用端負責。"
description: "沿著 browser session 生命週期拆解 Hyperbrowser：SDK、profiles、proxies、stealth、observability、安全邊界、定價，以及與 Browserbase、Steel、Cloudflare Kitesurf 的選型差異。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-hyperbrowser-browser-infrastructure-en)

[Hyperbrowser](https://www.hyperbrowser.ai/docs) 是給 AI Agent 與自動化程式使用的 Browser-as-a-Service。應用程式不必自己啟動、監控與清除 Chrome fleet，而是透過 API 建立隔離 session，再用 Playwright、Puppeteer 或 Selenium 連上遠端瀏覽器。它同時提供 proxy、stealth、CAPTCHA 處理、profile、live view 與錄影，把原本散落在 Kubernetes、browser driver 和 proxy 供應商之間的工作收進同一個控制面。

Hyperbrowser 是 Y Combinator S21 公司；[YC 的公司頁](https://www.ycombinator.com/companies/hyperbrowser/jobs)也列出 Accel 與 SV Angel 為支持者，但沒有公開可可靠核對的新一輪金額，因此本文不把第三方資料庫的估算當成融資事實。真正值得判斷的是：你的 Agent 需要一個「可程式控制的真 Chrome」，還是只需要拿到網頁內容。

## Browser-as-a-Service 解決哪一層

本機 Playwright 腳本很簡單；上線後，問題會從 selector 變成基礎設施：瀏覽器吃記憶體、process 當掉留下殭屍行程、session 要隔離、IP 會被封鎖，而且失敗時沒有畫面可重播。Hyperbrowser 把瀏覽器本身變成有生命週期的遠端資源：

```text
Agent / automation service
   │ create session (API key)
   ▼
Hyperbrowser control plane
   ├─ isolated Chrome session ── target website
   ├─ proxy / geo routing
   ├─ stealth / CAPTCHA options
   └─ live view / logs / recording
        ▲
        └── Playwright / Puppeteer over CDP
```

這個分層保留既有自動化框架。Agent framework 可以使用 Hyperbrowser 內建的 Browser Use、OpenAI CUA 或 HyperAgent 整合；已經有穩定 selector 的團隊則只換掉 `chromium.launch()`，以 Chrome DevTools Protocol（CDP）連到 `wsEndpoint`。前者買的是較高階的 agent loop，後者只買 browser infrastructure，兩者不要混成同一個採購判斷。

## Session 是最小執行單位

一個 session 有 `active`、`closed`、`error` 三種狀態，建立後會回傳 WebSocket endpoint、live URL 與識別碼。最小 Playwright 用法如下：

```ts
import { Hyperbrowser } from '@hyperbrowser/sdk';
import { chromium } from 'playwright-core';

const client = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

const session = await client.sessions.create({
  timeoutMinutes: 10,
  useProxy: false,
  useStealth: false,
  enableLogCapture: true,
});

try {
  const browser = await chromium.connectOverCDP(session.wsEndpoint);
  const context = browser.contexts()[0];
  const page = context.pages()[0];
  await page.goto('https://example.com');
  console.log(await page.title());
  await browser.close();
} finally {
  await client.sessions.stop(session.id);
}
```

明確呼叫 `stop()` 很重要：session 按使用時間計費，不能只依賴 timeout。Hyperbrowser 文件也說明，automation client 中斷時 session 通常會停止；若 CDP URL 加上 `keepAlive=true`，它可跨 client 斷線存活到 timeout，但所有頁面關閉仍會終止。

## Profile 把登入狀態帶到下一次

預設每個 session 都使用全新的 user data directory。這對隔離有利，卻會讓需要登入的 Agent 每次重走 MFA 或風險驗證。[Profiles](https://www.hyperbrowser.ai/docs/sessions/profiles) 會保存 cookies、local storage、session storage 與快取，再掛到後續 session。第一次寫入要設 `persistChanges: true`，正常停止後再等待資料完成儲存；後續若只想共用基準狀態，保持預設的唯讀模式，才能安全平行執行。

Profile 也是最敏感的資產。Cookie 很可能等同登入憑證，因此 profile ID 不能交給瀏覽器內的任意程式碼，刪除帳號或撤銷權限時也要同步刪除 profile。若多個 Agent 共用可寫 profile，最後結束的 session 可能覆蓋別人的狀態；一個帳號一個 profile、平行工作唯讀，是比較容易推理的預設。

## Proxy 與 stealth 是存取能力，不是成功保證

Session 可啟用託管住宅 proxy、指定國家或使用自訂 proxy；proxy 與 CAPTCHA solving 需要付費方案。`useStealth` 會套用基礎反偵測處理，Enterprise 另有 `useUltraStealth`。這些能力適合合法的地區驗證、公開資料蒐集與自家網站測試，但不會改變網站條款、robots 政策、著作權或個資義務。

更重要的是，stealth 不是可靠性 API。網站可以改版、提高挑戰強度或封鎖帳號；CAPTCHA 被解開也不代表後續流程合法或可重現。把「成功繞過」當 SLO 會導致沒有上限的重試與 proxy 花費。較好的做法是為每個網域設成功率、重試次數與流量預算，連續被擋就停止並交由人工判斷。

## 看得到失敗，才有辦法營運

遠端瀏覽器最難除錯的地方，是 stack trace 只告訴你 selector timeout，沒告訴你畫面其實是登入頁、cookie banner 或 bot challenge。Hyperbrowser 回傳 live URL 供即時觀看，並可開啟 event/log capture、rrweb 或 MP4 session recording。官方文件提醒，錄影只捕捉頁面視覺狀態，不包含伺服器端變更，而且 WebGL／canvas 動畫未必能完整重現。

錄影也帶來新的資料治理問題：登入畫面、表單、個資與內部頁面都可能進入檔案。公開方案目前依層級提供 7 或 30 天保留，Enterprise 可更長。啟用前要先決定誰能看、保留多久、哪些工作禁止錄影；「全部錄下來方便 debug」不是安全的 production 預設。

## 定價：browser hour 很便宜，proxy 才可能放大

[2026 年 8 月公開定價](https://www.hyperbrowser.ai/pricing)以 credit 計算，一 credit 為 0.001 美元。瀏覽器為每小時 0.10 美元且按秒計費，proxy 流量為每 GB 10 美元；Free、Startup、Scale 的同時執行上限分別是 1、25、100 個瀏覽器，Enterprise 才提供 1,000 個以上的額度。

這個結構意味著純 UI 操作的 browser compute 容易估算，大量圖片、影片或下載則可能由 proxy bandwidth 主導。正式選型前，拿一批真實任務記錄每次 session 秒數、proxy bytes、重試率與成功完成數；不要只用「每 browser hour」比較供應商。

## 與 Browserbase、Steel、Kitesurf 怎麼選

| 選項 | 優先考慮的情境 | 核心取捨 |
|---|---|---|
| [Hyperbrowser](https://www.hyperbrowser.ai/docs) | 想保留 Playwright／Puppeteer，同時取得 proxy、stealth、profile 與多種 agent SDK | 功能整合快；需接受託管服務、credit 與資料保留模型 |
| [Browserbase](https://docs.browserbase.com/welcome/introduction) | 團隊已使用 Stagehand，或希望 browser、search、fetch 與模型入口在同一平台 | Agent 工具鏈完整；與 Hyperbrowser 的差距要用目標網站實測，不靠功能表判勝負 |
| [Steel](https://docs.steel.dev/overview/sessions-api/overview) | 需要託管 session，但也重視可用 Docker 自架的退路 | 自架掌控度高；proxy、並行容量與維運責任會回到自己身上 |
| [Cloudflare Kitesurf](https://developers.cloudflare.com/browser-run/kitesurf/) | Agent 主要取 HTML、DOM 或 screenshot，能接受不是完整 Chromium | Workers 上的輕量、stateless browser；截至 2026-08 仍是 beta，且不適合 pixel-perfect 或完整擴充功能情境 |

Hyperbrowser 適合需要真實 Chrome interaction、登入狀態與快速 burst concurrency，又不想維護 browser fleet 的團隊。不適合的情況也很清楚：只抓靜態 HTML 時完整 browser 太重；法規要求 on-premises 時託管 session 不合適；大量影音經住宅 proxy 傳輸時，網路費可能壓過運算費。

## 結論

Hyperbrowser 的價值不是「讓 Agent 會點按鈕」，而是把遠端 Chrome 的 session、身分狀態、網路出口與可觀測性變成可管理資源。真正的選型單位不是 API 功能數，而是每一個成功任務的成本、失敗可診斷程度，以及你願意交給供應商的瀏覽資料範圍。

今晚可做的測試是：把一條既有 Playwright workflow 改成 `connectOverCDP()`，關閉 proxy 與 stealth 跑基準，再逐項啟用，記錄成功率、session 秒數、流量與錄影內容。只有當新增能力改善真實失敗模式，它才值得留在 production 設定裡。

## 參考資料

- [Hyperbrowser SDK introduction](https://www.hyperbrowser.ai/docs/sdks/introduction)
- [Hyperbrowser session lifecycle](https://www.hyperbrowser.ai/docs/sessions/lifecycle)
- [Hyperbrowser session parameters](https://www.hyperbrowser.ai/docs/sessions/parameters)
- [Hyperbrowser profiles](https://www.hyperbrowser.ai/docs/sessions/profiles)
- [Hyperbrowser recordings](https://www.hyperbrowser.ai/docs/sessions/recordings)
- [Hyperbrowser pricing](https://www.hyperbrowser.ai/pricing)
- [Y Combinator：Hyperbrowser company page](https://www.ycombinator.com/companies/hyperbrowser/jobs)
- [Browserbase introduction](https://docs.browserbase.com/welcome/introduction)
- [Steel Sessions API overview](https://docs.steel.dev/overview/sessions-api/overview)
- [Steel self-hosting with Docker](https://docs.steel.dev/overview/self-hosting/docker)
- [Cloudflare Kitesurf](https://developers.cloudflare.com/browser-run/kitesurf/)
