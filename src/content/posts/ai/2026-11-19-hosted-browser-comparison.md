---
title: "託管瀏覽器怎麼選：Browserbase、Browser Run、Steel、Hyperbrowser、Browser Use Cloud、Kernel 對照，什麼時候自己架"
date: 2026-11-19
category: ai
type: deep-dive
tags: [browserbase, cloudflare-browser-run, steel, hyperbrowser, kernel, browser-automation]
lang: zh-TW
tldr: "託管瀏覽器賣的不只是一台雲端 Chrome，而是併發、proxy 與 CAPTCHA、可保留的登入狀態、錄影與即時畫面，以及簽章身分。按時數計費的幾家每小時都在 $0.06 到 $0.12 之間，差異在計費方式（月費含量、純預付、依記憶體秒數且閒置不收費、併發另計）、session 能活多久、跟哪個 SDK 綁在一起。各家的延遲 benchmark 多半是廠商自己跑的，名次互相矛盾。自己架看似省錢，但排程、認證、sandbox、版本都要自己補；量小、只跑自家或允許爬的網站時才划算。"
description: "託管瀏覽器服務對照：Browserbase、Cloudflare Browser Run、Steel、Hyperbrowser、Browser Use Cloud、Kernel、Lightpanda Cloud 的計費模型、免費額度、併發與 session 時長、proxy 與 CAPTCHA、Web Bot Auth 簽章身分、SDK 綁定；延遲 benchmark 為什麼互相矛盾；以及自架 Chromium 要補哪些東西、什麼時候值得。"
draft: false
series:
  name: "AI 瀏覽器自動化"
  order: 19
---

> :globe: [English version](/posts/ai/2026-11-19-hosted-browser-comparison-en)

[引擎篇](/posts/ai/2026-11-19-browser-engines-beyond-chromium)講的是用什麼瀏覽器，這篇講瀏覽器放在哪裡跑。本機開一個 Chrome 很容易，同時開兩百個、讓它們帶著登入狀態、遇到 CAPTCHA 有人處理、出事能回放畫面，就是託管服務在賣的東西。

這篇回答：**Browserbase、Cloudflare Browser Run、Steel、Hyperbrowser、Browser Use Cloud、Kernel 各適合什麼；什麼時候該自己架。** 各家的細節見系列裡的單篇：[Browserbase](/posts/ai/2026-08-22-browserbase-browser-infrastructure)、[Steel](/posts/ai/2026-08-22-steel-browser-infrastructure)、[Hyperbrowser](/posts/ai/2026-08-22-hyperbrowser-browser-infrastructure)，Browser Run 另有[專篇](/posts/ai/2026-11-19-cloudflare-browser-run)。

## 託管瀏覽器在賣什麼

每一家都會給你一個 CDP 連線網址，Playwright 用 `connectOverCDP`、Puppeteer 用 `connect` 就能接上。所以差別不在「能不能開瀏覽器」，而在這五件事：

- **併發**：同時能開幾個，以及每秒能新開幾個。
- **進得去網站**：住宅 proxy、CAPTCHA 處理、防偵測的瀏覽器修改，或反過來，用簽章表明自己是誰。
- **狀態**：登入過的 cookie 和 profile 能不能留到下一次，session 最長能開多久。
- **看得到發生什麼**：即時畫面（live view）、錄影回放、讓人中途接手。
- **跟哪個 SDK 綁在一起**：有些功能只在自家 SDK 加自家雲上才有。

## 計費：每小時差不多，計法很不一樣

以下是 2026 年 11 月 19 日各家官方價格頁上的自助方案：

| | 免費額度 | 每瀏覽器小時 | Proxy 每 GB | 自助最高併發 | 最長 session |
|---|---|---|---|---|---|
| [Browserbase](https://www.browserbase.com/pricing) | 1 小時、3 併發 | $0.12（Startup $0.10） | $12（$10） | 100 | 6 小時（免費 15 分鐘） |
| [Browser Run](https://developers.cloudflare.com/browser-run/pricing/) | 每天 10 分鐘、3 併發 | $0.09 | 文件沒有託管 proxy | 200 | 不限，但閒置 60 秒就關 |
| [Steel](https://steel.dev/pricing) | 一次性 $30 額度 | $0.10（Scale $0.08） | $10（$6） | 100 | 15 分鐘到 1 小時（企業 24 小時） |
| [Hyperbrowser](https://www.hyperbrowser.ai/pricing) | 5,000 credits、1 併發 | $0.10 | $10 | 100 | 文件沒寫上限 |
| [Browser Use Cloud](https://browser-use.com/pricing) | 一次性 $1 額度 | $0.06 | 住宅 $5 | 依累計付款解鎖，最高 1,000 | 240 分鐘 |
| [Kernel](https://www.kernel.sh/pricing) | 每月 $5 額度、5 併發 | 依記憶體秒數，閒置不收 | 含在費率裡 | 150 | 文件沒寫總長上限；閒置後最多保留 72 小時 |
| [Lightpanda Cloud](https://lightpanda.io/pricing) | 每月 10 小時、5 併發 | 超額 $0.08 | 自備 | 30 | — |

表格放不下的計費差異：

- **月費含量再超額**：Browserbase（$20、$99）、Steel（$250）、Hyperbrowser（$30、$100）、Lightpanda（$19）都是這種。Hyperbrowser 的 credits 由瀏覽器、sandbox、資料擷取和 agent 共用。
- **純預付**：Browser Use Cloud 寫「No subscription. No concurrency fees. Credits never expire.」，併發上限隨累計付款提高，例如累計付 $100 可以開 50 個。
- **依記憶體秒數、閒置不收費**：Kernel 的瀏覽器閒置 10 秒後進入 standby，standby「incurs zero usage costs」，但仍佔併發名額。它的 headless 換算約每小時 $0.06，有畫面的 headful 約 $0.48。
- **時數加併發費**：Browser Run 的 Quick Actions 只收時數；開 session 另收併發費，以「每天尖峰併發的月平均」計，超過 10 個每個 $2。

時數價格差距不大，跑大量頁面時 proxy 流量更容易成為帳單主體：[引擎篇](/posts/ai/2026-11-19-browser-engines-beyond-chromium)引用的第三方實測，一千個頁面大約用掉 1.6 到 2 GB，用 $10/GB 的 proxy 就是 $16 到 $20。

## 身分：躲起來，還是報上名字

讓 agent 進得去網站有兩條相反的路。這個系列不教繞過偵測，只列各家提供什麼。

**防偵測與代理。** Browser Use Cloud 預設就是改過的 Chromium 加住宅 proxy，並包含 CAPTCHA 處理，但也寫明「Access to every site is not guaranteed」。Browserbase 的 Verified 瀏覽器、Steel 的 Stealth Browser、Hyperbrowser 的 Ultra stealth 都只在最高方案。

**簽章身分（Web Bot Auth）。** agent 在每個請求加上密碼學簽章，讓網站知道「這是哪一家的 agent」，網站再決定放不放行。Cloudflare Browser Run 自動加上這些標頭、[不能移除](https://developers.cloudflare.com/browser-run/reference/automatic-request-headers/)；Browserbase 在 beta、[Hyperbrowser](https://hyperbrowser.ai/docs/sessions/web-bot-auth) 要申請，[Kernel](https://www.kernel.sh/docs/browsers/bot-detection/web-bot-auth) 限 Start-Up 與 Enterprise 方案並要申請。Browserbase 的[文件](https://docs.browserbase.com/platform/identity/overview)提醒：「A valid signature doesn't grant access or sign your agent into a user account.」簽章只是表明身分，網站仍然可以拒絕。

兩條路的取捨很直接：要進「沒有打算讓機器人進來」的網站，只有第一條路，也有網站使用條款的問題；只跑自家網站、合作夥伴網站，或本來就允許爬的網站，簽章身分比較乾淨。Browser Run 就是後者的極端：永遠被標成 bot，不能換 IP、不能設 proxy。

## 跟 SDK 綁在一起的地方

所有家都能用一般的 CDP 連線，但有些功能只在特定組合下才有：

- **Stagehand ↔ Browserbase。** Stagehand v4 的伺服器端快取只在 Browserbase 上，見 [Stagehand v4 篇](/posts/ai/2026-11-18-stagehand-v4)。Hyperbrowser 也提供把 Browserbase＋Stagehand 專案搬過來的整合。
- **Browser Use ↔ Browser Use Cloud。** Browser Use 1.0 的 `Browser()` 預設就是它的雲端瀏覽器，見 [Browser Use 篇](/posts/ai/2026-08-21-browser-use-complete-guide)。
- **HyperAgent ↔ Hyperbrowser。** HyperAgent 可選 Hyperbrowser 當瀏覽器來源，但 [HyperAgent](https://github.com/hyperbrowserai/HyperAgent) 本身 2026 年 5 月後就沒有更新。
- **Browser Run** 要用 Cloudflare 自己 fork 的 Puppeteer、Playwright，Stagehand 只支援到 v2.5，原因見 [Browser Run 篇](/posts/ai/2026-11-19-cloudflare-browser-run)。
- **Steel、Kernel、Lightpanda Cloud** 主打通用的 CDP 介面，不綁特定 SDK。

## 延遲 benchmark 互相矛盾

各家都有「我們最快」的 benchmark，但大多是自己跑的，名次也互相打架。量的都是「建立瀏覽器、連線、開一個頁面」這段時間：

| 誰跑的 | 方法 | Browserbase 的結果 | 誰最快 |
|---|---|---|---|
| [Steel](https://github.com/steel-dev/browserbench)（受測者之一） | us-east-1，5,000 次 | 中位數 2,888 ms | Kernel 776 ms，Steel 第二 |
| [Ritza](https://techstackups.com/comparisons/hosted-browser-benchmarks/) | 赫爾辛基，每家 10 次 | 平均約 11.9 秒 | Steel 1,441 ms |
| [Notte](https://www.notte.cc/compare/benchmarks)（受測者的競爭者） | 多數 us-east-1，100 次 | 中位數 714 ms（跨區：us-east-1 連到 us-west-2） | Tilion 206 ms，Kernel 第二 |
| [ComputeSDK](https://www.computesdk.com/benchmarks/browsers/lifecycle) | 定期跑，100 次 | 約 0.88 秒 | Tilion 約 0.11 秒（預先發布版），Kernel 第二 |

同一家在不同 benchmark 裡差了十幾倍，主因是跑的人在哪個區域、瀏覽器開在哪個區域、有沒有暖機、SDK 會不會自動重試。這些數字只說明「開一個頁面」的建立時間，不代表長流程的可靠度，也沒有一份不受利益影響、同時量可靠度與防偵測的第三方評測。Browser Use 自己辦的防偵測 benchmark 把自己排第一，同樣要打折。

實際做法：從你的伺服器所在區域，用你的目標網站，各家跑幾十次再比。

## 什麼時候自己架

自己架 Chromium 看起來只是 `docker run`，但託管服務幫你做的事，自架都要自己補：

- **安全。** Playwright 官方的 [Docker 文件](https://playwright.dev/docs/docker)寫明映像檔「intended to be used for testing and development purposes only」，預設以 root 執行會關掉 Chromium 的 sandbox，開不受信任的網站要換使用者並套 seccomp。
- **穩定。** 要加 `--ipc=host`，否則 Chromium 可能記憶體不足當掉；要處理殭屍行程；Playwright 版本要跟容器裡的瀏覽器一致。
- **排程與認證。** 開源的 [Steel Browser](https://steel.dev/docs/llms-full/self-hosting.txt)「runs one browser, so it has one session at a time」，而且「does not check an API key」，多併發和認證都要自己在前面加。Kitesurf 的 README 也說不要在沒有認證的情況下部署。
- **授權。** 常見的自架選項授權各不相同：[Steel Browser](https://github.com/steel-dev/steel-browser)、Kernel 的 [kernel-images](https://github.com/kernel/kernel-images)、[Kitesurf](https://github.com/cloudflare/kitesurf) 是 Apache-2.0；[browserless](https://github.com/browserless/browserless) 是 SSPL 或商業授權；Lightpanda 是 AGPL，[另外賣商業授權](https://lightpanda.io/pricing)。
- **proxy、錄影、即時畫面**全部要自己接。

也有反方向的例子：[混合式 SDK 比較](/posts/ai/2026-11-19-ai-browser-sdk-comparison)提過的醫療系統團隊，原本在 GCP Cloud Run 上自架，出錯時存截圖和結構化日誌；改用 Kernel、Browserbase 之後，他們的[觀察](https://dev.to/michael_kronovet_261e3cc1/what-we-learned-building-healthcare-integrations-for-the-past-year-4n94)是「Has seemed to make scripts a lot more flaky though」。這是單一團隊、沒有說明原因的回報，但提醒你換到託管不一定更穩。

自架比較划算的情況：量小、只跑自家或內網網站、不需要 proxy 和 CAPTCHA，或資料不能離開你的環境。量會突然暴增、要進有防護的網站、需要錄影給人查，就用託管。

## 怎麼選

- **用 Stagehand，想要快取、錄影、企業功能**：Browserbase。
- **用 Browser Use，想要開箱就有住宅 proxy 和 CAPTCHA**：Browser Use Cloud，沒有月費。
- **session 很長、大部分時間在等**：Kernel，閒置不收費，閒置的瀏覽器最多保留 72 小時。
- **已經在 Cloudflare Workers 上，或只需要截圖、PDF、Markdown 這種一次性輸出**：Browser Run，見 [Browser Run 篇](/posts/ai/2026-11-19-cloudflare-browser-run)。
- **想要能自架的同一套東西，或預算要可預測的月費**：Steel，自架版只有單一 session，正式環境多半還是用 Cloud。
- **大量擷取純文字頁面**：Lightpanda Cloud，見[引擎篇](/posts/ai/2026-11-19-browser-engines-beyond-chromium)。

價格、併發與功能每幾個月就會變，上線前回各家價格頁和文件確認。

## 想深入

- [Cloudflare Browser Run](/posts/ai/2026-11-19-cloudflare-browser-run)：Quick Actions 與 Browser Sessions 怎麼選，以及它為什麼只支援 Stagehand v2.5。
- 單篇：[Browserbase](/posts/ai/2026-08-22-browserbase-browser-infrastructure)、[Steel](/posts/ai/2026-08-22-steel-browser-infrastructure)、[Hyperbrowser](/posts/ai/2026-08-22-hyperbrowser-browser-infrastructure)、[Cloudflare Kitesurf](/posts/ai/2026-08-22-cloudflare-kitesurf-browser-infrastructure)。

## 參考資料

- [Browserbase Pricing](https://www.browserbase.com/pricing)
- [Browserbase：Plans and billing](https://docs.browserbase.com/account/billing/plans)
- [Browserbase：Web Bot Auth](https://docs.browserbase.com/platform/identity/web-bot-auth)
- [Browserbase：Identity overview](https://docs.browserbase.com/platform/identity/overview)
- [Kernel：Web Bot Auth](https://www.kernel.sh/docs/browsers/bot-detection/web-bot-auth)
- [browserless/browserless](https://github.com/browserless/browserless)
- [kernel/kernel-images](https://github.com/kernel/kernel-images)
- [Cloudflare Browser Run：Pricing](https://developers.cloudflare.com/browser-run/pricing/)
- [Cloudflare Browser Run：Limits](https://developers.cloudflare.com/browser-run/limits/)
- [Cloudflare Browser Run：Automatic request headers](https://developers.cloudflare.com/browser-run/reference/automatic-request-headers/)
- [Steel Pricing](https://steel.dev/pricing)
- [Steel：Self-hosting](https://steel.dev/docs/llms-full/self-hosting.txt)
- [Hyperbrowser Pricing](https://www.hyperbrowser.ai/pricing)
- [Hyperbrowser：Web Bot Auth](https://hyperbrowser.ai/docs/sessions/web-bot-auth)
- [Browser Use Pricing](https://browser-use.com/pricing)
- [Browser Use Cloud：Stealth](https://docs.browser-use.com/cloud/browser/stealth)
- [Kernel Pricing](https://www.kernel.sh/pricing)
- [Kernel：Standby](https://www.kernel.sh/docs/browsers/standby)
- [Lightpanda Pricing](https://lightpanda.io/pricing)
- [Playwright：Docker](https://playwright.dev/docs/docker)
- [steel-dev/browserbench](https://github.com/steel-dev/browserbench)
- [Tech Stackups：Hosted browser benchmarks](https://techstackups.com/comparisons/hosted-browser-benchmarks/)
- [Notte：BrowserArena](https://www.notte.cc/compare/benchmarks)
- [ComputeSDK：Browser lifecycle benchmark](https://www.computesdk.com/benchmarks/browsers/lifecycle)
- [Browser Use：Stealth benchmark](https://browser-use.com/posts/stealth-benchmark)
- [Michael Kronovet：What we learned building healthcare integrations for the past year](https://dev.to/michael_kronovet_261e3cc1/what-we-learned-building-healthcare-integrations-for-the-past-year-4n94)
