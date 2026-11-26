---
title: "Deno Deploy 將在 2027-04 關閉：現有服務怎麼搬、新專案改用什麼"
date: 2026-08-22
category: tech
type: deep-dive
tags: [deno, deno-deploy, serverless, typescript, edge-computing]
lang: zh-TW
tldr: "Deno 團隊 2026-10 加入 Cloudflare，Deno Deploy 預計 2027-04 關閉，Deno runtime 只再維護到 2027-10。新專案不要選它；現有服務要排程搬到 Cloudflare Workers 或任何能跑 Node.js 的平台，搬之前先盤點 revision、context、cron 與 KV。"
description: "Deno Deploy 宣布關閉後的處境：Application、Revision、Timeline、Context、Cron 這些設定搬家時要帶走什麼，以及新專案改選 Cloudflare Workers、Koyeb、Railway／Render 的判準。"
series:
  name: "AI 時代的技術選擇"
  order: 78
draft: false
---

> :globe: [English version](/posts/tech/2026-08-22-deno-deploy-serverless-platform-en)

[Deno Deploy](https://docs.deno.com/deploy/) 是執行 JavaScript、TypeScript 與 WebAssembly 的 serverless 平台。現在談它必須先標明「新版」：Deno Deploy 已以 Deno 2 execution environment、`console.deno.com` 與新 control plane 重做；Deploy Classic 與 subhosting v1 已在 2026 年 7 月 20 日停止服務。

## 先講結論：新專案不要選 Deno Deploy

2026-10-09 Deno 宣布[整個團隊加入 Cloudflare](https://deno.com/blog/cloudflare)，之後的開發集中在 Cloudflare Workers 與 Durable Objects 的共同平台，不再另外發展 runtime 和代管服務：

- **Deno Deploy**：再營運約六個月就關閉，[官方文件](https://docs.deno.com/deploy/)寫的是 2027 年 4 月。付費客戶搬到 Cloudflare Workers 會有遷移協助。
- **Deno runtime**：[每月出一版 2.9.x LTS](https://github.com/denoland/deno/issues/37030)，只修 bug 與安全問題，維護到 2027 年 10 月，之後 Deno 公司不再開發；程式碼維持 MIT 開源，社群可以接手。
- **JSR** 繼續營運，基礎設施搬到 Cloudflare。

所以這篇的讀法分兩種：還沒用過的讀者直接看最後一節的替代選項；已經有服務在上面的，下面幾節是搬家時要逐項帶走的設定清單。

## Application、Revision、Timeline 是 release model

[Application](https://docs.deno.com/deploy/reference/apps/) 是 web service 與 domain 的管理邊界；每次由 GitHub 或 `deno deploy` 發佈會產生 immutable Revision。Timeline 決定哪個 revision 接 production、branch 或 preview traffic，因此 rollback 是切換 active revision，不是覆寫原始 artifact。

這個模型適合 preview 與漸進驗證，但 migration 必須同時容忍新舊 revision。pre-deploy command 要可重跑，schema 採 expand/contract，不能讓 preview timeline 誤連 production database。

## Context 把 build、development、production 隔開

[Environment Contexts](https://docs.deno.com/deploy/reference/env_vars_and_contexts/) 將 Build、Development 與 Production 的 variables/secrets 分開。Build secret 不會自然出現在 runtime，反之亦然；branch 與 preview 預設落在 Development context。機密應透過 context 或 cloud connection 注入，不可打進 bundle 或 log。

新版平台支援 databases、telemetry、logs、metrics 與 tracing，也可選 hosted region 或 self-hosted region。所謂 global application 仍要核對實際 region 數、資料所在地與外部 API latency，不能從 edge 標籤推論資料已全球複寫。

## Cron 是 code-defined，Queues 不能沿用 Classic 假設

`Deno.cron()` 會在 deploy 時被平台發現，並由每條已註冊 timeline 的 active revision 執行。[Cron](https://docs.deno.com/deploy/reference/cron/) 以 UTC 排程且帶 retry；handler 仍需 idempotent、加 distributed lock 或以唯一 execution key 去重。

新版與 Classic 的 feature parity 並不完全相同：官方比較表目前列新版支援 Cron 和 databases，但不支援 Classic 的 Queues。遷移不能只換 dashboard；要逐項盤點 runtime API、regions、KV/queue、environment、domain、logs 與 subhosting。

## 搬去哪裡

官方指定的去處是 Cloudflare Workers：`Deno.cron()` 對應 Cron Triggers，KV 類資料要改放 Workers KV、D1 或 Durable Objects，這幾項都要改程式，不是換 endpoint 就好。只想保留 TypeScript 與 Web 標準 API、不想綁在單一平台的，可以先讓程式在 Node.js 上跑起來，再搬到 Railway、Render 這類 PaaS；需要長駐 worker 或任意 container 時比較 Koyeb、Railway／Render。Koyeb 本身也在 2026-02 被 Mistral AI 收購，評估時一併看它的產品方向。

搬遷驗收照原本的清單做：revision rollback、preview 與 production secret 隔離、cron 重送、database migration 與 region failure，在新平台上逐項重測一次。

## 更新紀錄

- 2026-11-23：Deno 團隊加入 Cloudflare、Deno Deploy 預計 2027-04 關閉，改寫標題、摘要與開頭結論，並把最後一節改成搬遷去處；中間各節保留為搬家時的設定清單。

## 參考資料

- [Deno is joining Cloudflare](https://deno.com/blog/cloudflare)
- [The state of Deno after the Cloudflare announcement](https://github.com/denoland/deno/issues/37030)

- [About Deno Deploy](https://docs.deno.com/deploy/)
- [Deno Deploy applications](https://docs.deno.com/deploy/reference/apps/)
- [Environment variables and contexts](https://docs.deno.com/deploy/reference/env_vars_and_contexts/)
- [Deno Deploy timelines](https://docs.deno.com/deploy/reference/timelines/)
- [Deno Deploy cron](https://docs.deno.com/deploy/reference/cron/)
- [Deno Deploy CLI](https://docs.deno.com/runtime/reference/cli/deploy/)
