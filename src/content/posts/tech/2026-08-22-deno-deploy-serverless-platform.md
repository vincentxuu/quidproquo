---
title: "Deno Deploy：Deno 2、Revision、Timeline 與全球 TypeScript Serverless"
date: 2026-08-22
category: tech
type: deep-dive
tags: [deno, deno-deploy, serverless, typescript, edge-computing]
lang: zh-TW
tldr: "新版 Deno Deploy 是以 Deno 2 執行 application revision 的 serverless 平台；應以 timeline、context、database 與 observability 理解，而不是沿用 Deploy Classic 印象。"
description: "介紹新版 Deno Deploy 的 Application、Revision、Timeline、Context、Cron、database、region 與 Classic 遷移邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 78
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-deno-deploy-serverless-platform-en)

[Deno Deploy](https://docs.deno.com/deploy/) 是執行 JavaScript、TypeScript 與 WebAssembly 的 serverless 平台。現在談它必須先標明「新版」：Deno Deploy 已以 Deno 2 execution environment、`console.deno.com` 與新 control plane 重做；Deploy Classic 與 subhosting v1 已在 2026 年 7 月 20 日停止服務。

## Application、Revision、Timeline 是 release model

[Application](https://docs.deno.com/deploy/reference/apps/) 是 web service 與 domain 的管理邊界；每次由 GitHub 或 `deno deploy` 發佈會產生 immutable Revision。Timeline 決定哪個 revision 接 production、branch 或 preview traffic，因此 rollback 是切換 active revision，不是覆寫原始 artifact。

這個模型適合 preview 與漸進驗證，但 migration 必須同時容忍新舊 revision。pre-deploy command 要可重跑，schema 採 expand/contract，不能讓 preview timeline 誤連 production database。

## Context 把 build、development、production 隔開

[Environment Contexts](https://docs.deno.com/deploy/reference/env_vars_and_contexts/) 將 Build、Development 與 Production 的 variables/secrets 分開。Build secret 不會自然出現在 runtime，反之亦然；branch 與 preview 預設落在 Development context。機密應透過 context 或 cloud connection 注入，不可打進 bundle 或 log。

新版平台支援 databases、telemetry、logs、metrics 與 tracing，也可選 hosted region 或 self-hosted region。所謂 global application 仍要核對實際 region 數、資料所在地與外部 API latency，不能從 edge 標籤推論資料已全球複寫。

## Cron 是 code-defined，Queues 不能沿用 Classic 假設

`Deno.cron()` 會在 deploy 時被平台發現，並由每條已註冊 timeline 的 active revision 執行。[Cron](https://docs.deno.com/deploy/reference/cron/) 以 UTC 排程且帶 retry；handler 仍需 idempotent、加 distributed lock 或以唯一 execution key 去重。

新版與 Classic 的 feature parity 並不完全相同：官方比較表目前列新版支援 Cron 和 databases，但不支援 Classic 的 Queues。遷移不能只換 dashboard；要逐項盤點 runtime API、regions、KV/queue、environment、domain、logs 與 subhosting。

Deno Deploy 適合 Deno/TypeScript web API、Fresh/Astro 應用、code-defined cron，以及想共用本機與雲端 Deno runtime 的團隊。需要長駐 worker、任意 container 或成熟 queue topology 時比較 Cloudflare Workers、Koyeb、Railway/Render。驗收應包含 revision rollback、preview secret isolation、cron 重送、database migration 與 region failure。

## 參考資料

- [About Deno Deploy](https://docs.deno.com/deploy/)
- [Deno Deploy applications](https://docs.deno.com/deploy/reference/apps/)
- [Environment variables and contexts](https://docs.deno.com/deploy/reference/env_vars_and_contexts/)
- [Deno Deploy timelines](https://docs.deno.com/deploy/reference/timelines/)
- [Deno Deploy cron](https://docs.deno.com/deploy/reference/cron/)
- [Deno Deploy CLI](https://docs.deno.com/runtime/reference/cli/deploy/)
