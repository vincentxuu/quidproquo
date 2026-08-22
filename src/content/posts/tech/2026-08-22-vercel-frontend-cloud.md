---
title: "Vercel：Frontend Cloud 的優勢來自 Framework-aware Deployment"
date: 2026-08-22
category: tech
type: deep-dive
tags: [vercel, frontend, paas, serverless, nextjs]
lang: zh-TW
tldr: "Vercel 把 framework build output、preview、CDN/cache 與 Functions 綁成 deployment；速度來自深度整合，代價是 runtime、data locality、成本與可攜性邊界。"
description: "介紹 Vercel deployments、previews、Functions、Fluid compute、regions、cache、state 與一般 PaaS 的取捨。"
series:
  name: "AI 時代的技術選擇"
  order: 72
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-vercel-frontend-cloud-en)

[Vercel](https://vercel.com/docs/deployments/overview) 是 framework-aware frontend cloud。它讀懂 Next.js 等 framework 的 static asset、route、middleware、SSR 與 function build output。每個 commit 會建立 immutable deployment，再由 production alias 或 preview URL 指向其中一版。

## Deployment 才是原子單位

每次 deploy 同時版本化 frontend asset 與 server code，preview 讓 PR 在獨立 URL 驗證，promote/rollback 則切換流量。不要讓 preview 無保護地接 production database 或第三方 side effect；使用獨立 credential、database branch/sandbox、rate limit 與 access protection。

framework adapter 是效率來源，也是 lock-in 面。升級 Next.js/adapter 時檢查 route rendering、cache、middleware、image optimization 與 runtime 是否改變。exit test 應能從同 commit 產 OCI/static artifact，或至少列出 Vercel-specific primitive 的替代方案。

## Edge 靠近使用者，Function 要靠近資料

static content 由全球 network/cache 提供；[Vercel Functions](https://vercel.com/docs/functions) 則在設定 region 執行。[官方 region 指南](https://vercel.com/docs/functions/configuring-functions/region) 強調 function 靠近 database。把 SSR 放全球、database 留單一 region，反而會增加 round trip 與 connection pressure。

[Fluid compute](https://vercel.com/docs/fluid-compute) 可讓同 instance 併行處理 I/O-bound invocation、重用連線並降低冷啟動，但不是長駐 VM。filesystem、duration、memory、concurrency、streaming 與 background work 仍受 runtime/plan 契約約束。長 job、queue consumer 或 stateful service 應放專門 worker/PaaS。

## Cache 與資料要明確版本化

CDN、framework data cache、revalidation 與 application database 是不同 state。每層定義 key、TTL、tag/invalidation、tenant scope 與 stale policy；authorization-sensitive response 不可只因 route 相同就共享 cache。deployment rollback 也不會 rollback database migration。

Vercel 適合 Next.js/frontend-heavy 產品、preview-driven collaboration 與高比例 static/cacheable traffic。需要任意 container、private service、persistent worker/disk 或多語言 backend topology時，Render/Fly.io/Railway 更自然。驗收要部署 breaking schema、測舊 client、新舊 cache、function region、spend alert 與 rollback。

## 參考資料

- [Vercel deployments](https://vercel.com/docs/deployments/overview)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Vercel Fluid compute](https://vercel.com/docs/fluid-compute)
- [Vercel Function regions](https://vercel.com/docs/functions/configuring-functions/region)
- [Vercel caching](https://vercel.com/docs/edge-network/caching)
