---
title: "Netlify：Atomic Deploy、Functions 與 Edge Functions 的 Web Platform"
date: 2026-08-22
category: tech
type: deep-dive
tags: [netlify, jamstack, paas, serverless, edge-computing]
lang: zh-TW
tldr: "Netlify 以 atomic deploy 和 preview 為核心，Functions、Edge Functions、Blobs/Database 再加入動態能力；每種 runtime 與 state 都有不同一致性和限制。"
description: "介紹 Netlify atomic deploys、Deploy Previews、Functions、Edge Functions、Background Functions、Blobs、cache 與 Vercel/Render 選型。"
series:
  name: "AI 時代的技術選擇"
  order: 73
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-netlify-web-platform-en)

[Netlify](https://docs.netlify.com/) 從 static/Jamstack hosting 發展成 Web platform：Git build、global delivery、Functions、Deno-based Edge Functions、Background/Scheduled Functions、Blobs、Database、Forms 與 Image CDN 都和同一個 site/deploy workflow 整合。

## Atomic deploy 是核心語意

[Deploy overview](https://docs.netlify.com/deploy/deploy-overview/) 說明每次 deployment 先完整上傳，才一次切換 public URL，避免 HTML 與 asset 半新半舊。每版有 immutable permalink，PR 有 Deploy Preview，rollback 只需切回舊 deploy。

但 application data 不會跟著回滾。database migration 要 expand/contract，client/server skew 要測；preview 使用不同 env/credential，並加 password/team protection，避免未公開內容與 production side effect 外洩。

## Functions 與 Edge Functions 不同

Netlify Functions 適合 SSR/API 與 Node-style server code，region 應靠近 data source；Background Functions 處理較長 async work，Scheduled Functions 負責時間觸發。[Edge Functions](https://docs.netlify.com/build/edge-functions/overview/) 在 Deno-based edge runtime 執行，適合 redirect、personalization、auth gate 與 request/response transform，不適合依賴重 Node native module 或遠端單區 database 的重查詢。

platform adapter 會把 framework route 自動編譯成 function/edge asset。升級 framework/plugin 時，以 deploy summary 檢查實際產物，不要只看 local dev 成功。

## Deploy state 與 durable state 分開

static file 和 deploy-scoped cache 跟 deployment 版本走；[Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/) 與 Database 是持久資料。要明確選 deploy-specific 或 cross-deploy store、tenant key、consistency、backup 與 deletion。Preview 若可讀 production blobs，也必須重新做 authorization。

Netlify 適合 content/frontend-heavy site、atomic deploy、preview collaboration 與少量 serverless/edge logic。Next.js 深度整合可比較 Vercel；需要 container、private network、worker 與 disk 的完整 backend 拓撲則比較 Render。驗收要切回舊 deploy、保留新 schema、重送 background job、測 edge/function region 與 cache invalidation。

## 參考資料

- [Netlify documentation](https://docs.netlify.com/)
- [Netlify deploy overview](https://docs.netlify.com/deploy/deploy-overview/)
- [Netlify platform primitives](https://docs.netlify.com/start/core-concepts/primitives/)
- [Netlify Edge Functions](https://docs.netlify.com/build/edge-functions/overview/)
- [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/)
