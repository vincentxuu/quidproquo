---
title: "Cloudflare Edge Platform 上線前檢查：自訂網域、維護頁與 Workers limits"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, workers, deployment, custom-domains, limits, checklist]
lang: zh-TW
tldr: "Cloudflare app 上線前不要只看 deploy 成功。Custom Domains、Routes、www/root redirect、維護頁、CPU/memory/subrequest limits、log sampling、fallback path 都要先檢查。這篇把 Edge Platform 系列裡的 production pitfall 收斂成一份 checklist。"
description: "整理 Cloudflare Edge Platform 上線前的 production checklist：Workers Custom Domains、Routes、Custom Errors、maintenance page、CPU/memory limits、subrequests、observability 與既有踩坑文連結。"
draft: false
series:
  name: "Cloudflare Edge Platform"
  order: 19
---

> 🌏 [English version](/en/posts/tech/2026-08-30-cloudflare-edge-platform-production-checklist-en)

Cloudflare app 最常見的上線問題，不一定是 code 寫錯。很多時候是 routing、DNS、方案限制、維護頁、同 zone Worker 呼叫、native module、log retention 這些「部署邊界」沒有先想清楚。`wrangler deploy` 成功，只代表 Worker 被上傳，不代表 production path 已經完整；deployment checklist 要另外看。

這篇是 Cloudflare Edge Platform 的 appendix，把系列裡分散的 production pitfall 收斂成一份 checklist。它不重講 Workers、D1、R2、Durable Objects、Queues、Workflows、Cache Rules、Smart Shield、Images、Email Service、Turnstile、Observability、Browser Run、Containers；它回答的是：上線前哪些地方最容易漏。

## 1. Custom Domain 和 Route 不要混著想

[Cloudflare Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) 會把一個 domain 或 subdomain 的所有 path 指到 Worker，Cloudflare 也會代你建立 DNS record 和 certificate。它適合 Worker 本身就是 origin 的情境。

Routes 則是另一種模型：你可以讓 Worker 攔某個 hostname/path pattern 前的 request。兩者都能讓 request 進 Worker，但行為不同。

上線前檢查：

- 這個 hostname 是 Custom Domain，還是 Route？
- Custom Domain hostname 有沒有既有 CNAME？官方文件說不能在已有 CNAME 的 hostname 上建立 Custom Domain。
- `example.com` 和 `www.example.com` 是否都要支援？Custom Domains 是 exact hostname match。
- 同 zone Worker 呼叫另一個 Worker 時，是走 service binding，還是被 Custom Domain 行為允許？
- 刪除 Custom Domain 後，相關 Advanced Certificate 是否也需要清掉？

站上踩坑文：[Cloudflare Workers 綁定自訂網域的正確寫法](/posts/tech/debug/2026-03-12-cloudflare-workers-custom-domain)。

## 2. 維護頁不要等事故時才做

Cloudflare 的 [Custom Errors](https://developers.cloudflare.com/rules/custom-errors/) 可以替換 default Cloudflare error pages，也可以用 Custom Error Rules 對 HTTP 400 以上錯誤回自訂內容。但 availability 依方案而定，官方表格顯示 Free plan 不支援 Custom Errors，Pro/Business/Enterprise 才支援。

如果你在 Free plan，需要維護頁或停機公告，實務上常會用 Worker 自己回一個 maintenance response，而不是等 Cloudflare Custom Error Pages。

上線前檢查：

- 你的方案能不能用 Custom Errors？
- API path 和 HTML path 的錯誤回應是否要分開？
- maintenance mode 是全站、特定 path，還是特定 tenant？
- 維護頁本身是否不依賴正在維護的 origin？
- status page、health check、monitoring 是否會誤判 maintenance response？

站上踩坑文：[Cloudflare Free Plan 設維護頁：Custom Error Pages 不能用，改用 Worker](/posts/tech/2026-03-13-cloudflare-worker-maintenance-page-free-plan)。

## 3. Workers limits 會決定程式該怎麼切

[Workers limits](https://developers.cloudflare.com/workers/platform/limits/) 不是文件附錄，它們會直接影響架構。Free plan 每天 100,000 requests；CPU time Free 是 10 ms，Paid HTTP request 預設 30 秒、可提高到 5 分鐘；memory per isolate 是 128 MB；subrequests Free 每 request 50，Paid 每 request 10,000；同時 outgoing connections 每 request 6。

這些限制會告訴你工作該放哪裡：

- CPU 重：拆小、搬到 Queues / Workflows / Containers。
- 大檔：不要 buffer，在 Worker 裡用 stream 或放 R2。
- 長流程：不要只靠 `ctx.waitUntil()`，需要 durable step 時用 Workflows。
- 爆量背景工作：用 Queues 消化。
- per-session 協調：用 Durable Objects。
- browser automation：用 Browser Run，不要自己在 Worker 裡硬塞 browser。

上線前檢查：

- request path 是否有 CPU-heavy JSON/PDF/image processing？
- 是否有一次打太多 subrequests？
- 是否把整個 response/request body 讀進 memory？
- `waitUntil()` 是否被拿來承擔超過 30 秒後處理？
- Queue consumer、Cron、DO alarm 的 15 分鐘 duration limit 是否足夠？

## 4. Build 成功不等於 runtime 能跑

Astro、Next.js、OpenNext、Hono 這類框架跑到 Workers 時，常見問題是 build-time 和 runtime 的邊界沒有切乾淨。Node native module、filesystem assumption、dynamic import、SSR route、prerender route 都可能讓部署前後的行為不同。

上線前檢查：

- dependency 是否真的支援 Workers runtime？
- 有沒有 Node native module？
- build 階段 import 的模組是否會在 prerender route 被執行？
- local dev 是否使用和 production 相近的 runtime？
- OpenNext / adapter 的版本與 Cloudflare compatibility date 是否固定？

站上踩坑文：[Astro + Cloudflare Workers：Native Module 在 Prerender Route 也會讓 Build 炸掉](/posts/tech/debug/2026-03-13-astro-cloudflare-native-module)。

## 5. Observability 要在事故前打開

Workers Logs、traces、metrics、Analytics Engine 不是出事後再補的東西。至少要讓 production request 有 request id、route、tenant、status、duration、重要 binding call 的結果。

上線前檢查：

- Wrangler 是否有 `observability.enabled`？
- production `head_sampling_rate` 是否合理？
- error log 是否不含 PII、secret、完整 prompt、完整 email body？
- Analytics Engine 是否只放 usage/latency/error 這種 metrics，不放敏感資料？
- Browser Run / Containers / Email Service 是否有獨立 usage event？

系列文章：[Cloudflare Observability 怎麼用：Workers Logs、Traces 與 Analytics Engine 的分工](/posts/tech/2026-08-30-cloudflare-observability-analytics-engine)。

## 6. 成本要按服務拆開

Cloudflare 的單項價格常看起來便宜，真正的成本會出現在組合。一次 AI request 可能同時用到 Worker、AI Gateway、Workers AI 或外部 provider、Vectorize / AI Search、R2、D1、Analytics Engine。一次 screenshot job 可能用 Worker、Queue、Browser Run、R2、Logs。

上線前檢查：

- 每個 user action 會觸發哪些 Cloudflare 服務？
- 哪些服務按 request，哪些按 storage，哪些按 duration，哪些按 browser time？
- Free/Paid/Enterprise limit 是否影響 production？
- 高風險功能是否有 per-tenant rate limit？
- dashboard 裡是否看得到 usage，還是需要自己寫 Analytics Engine？

## 最小上線 checklist

我會把第一版 Cloudflare app 的 production checklist 寫成：

1. Custom Domain / Route / redirect path 全部列出。
2. maintenance mode 和 error response 可切換。
3. Workers limits 對照 request path 做過一次。
4. 大檔放 R2，長流程放 Queues / Workflows，協調放 Durable Objects。
5. observability、structured logs、basic metrics 已開。
6. secrets 不在 code、log、R2 artifact 裡。
7. 每個付費服務都有 usage estimate。
8. deploy rollback 或 version strategy 已確認。

這份 checklist 不會讓系統變完美，但可以避免最常見的 Cloudflare 上線誤判：把「能 deploy」誤認成「能穩定接 production traffic」。

## 參考資料

- [Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Cloudflare Custom Errors](https://developers.cloudflare.com/rules/custom-errors/)
- [Cloudflare Workers Observability](https://developers.cloudflare.com/workers/observability/)
- [Cloudflare Queues](https://developers.cloudflare.com/queues/)
- [Cloudflare Workflows](https://developers.cloudflare.com/workflows/)
- [Cloudflare Containers](https://developers.cloudflare.com/containers/)
