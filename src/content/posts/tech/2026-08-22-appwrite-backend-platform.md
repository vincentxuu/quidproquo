---
title: "Appwrite：可自架的 Auth、Database、Storage、Functions 與 Realtime BaaS"
date: 2026-08-22
category: tech
type: deep-dive
tags: [appwrite, baas, authentication, serverless, self-hosting]
lang: zh-TW
tldr: "Appwrite 把 Auth、TablesDB、Storage、Functions、Realtime 與 Messaging 放進一致 API；Cloud 與 self-hosted 功能相近，維運責任卻完全不同。"
description: "介紹 Appwrite Auth、permissions、TablesDB、Storage、Functions、Realtime、Cloud 與 self-hosting 邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 86
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-appwrite-backend-platform-en)

[Appwrite](https://appwrite.io/docs) 是開源 BaaS，提供 Auth、Databases/TablesDB、Storage、Functions、Realtime、Messaging 與 Sites，並以 client/server SDK、REST、GraphQL 和 WebSocket 暴露能力。可使用 Appwrite Cloud，也能部署同一產品線到自有基礎設施。

## Client API 與 Server API 的權限不同

Client SDK 使用 user session，讀寫 row/file 時受 resource [permissions](https://appwrite.io/docs/advanced/security/permissions) 約束；權限可給 user、team、team role、label、authenticated users 或 guests。由 Client SDK 建立資源時會有 creator defaults，但由 Console/Server SDK 建立且未明確設權限時，預設沒有 client 可存取。

Server SDK 使用 API key 與 scopes，可跨越 resource permissions。這對管理操作很方便，也意味著 key 洩漏能放大影響。一般 backend 代表使用者行動時，優先使用短效 JWT 保留該使用者的 permission context；真正的 admin job 才使用最小 scope API key。

## Realtime 會繼承當下 session

Realtime subscription 只收到使用者有 read permission 的事件。必須先登入再 subscribe；session 改變後要重建 subscription，否則連線不會自動取得新身份。`Role.any()` 會讓任何 client 收到更新，不能因為資料「只在 WebSocket」就放寬。

TablesDB 的 table/row、relationship、query、index 與 transaction 應由 access pattern 設計；Storage bucket/file 另有權限。跨 database、file、message 與外部 API 的流程不是單一 transaction，需 status/outbox、idempotency key 與補償。

## Functions 是可信邊界，不是無限背景程序

[Functions](https://appwrite.io/docs/products/functions) 可由 SDK/HTTP、platform event、webhook 或 schedule 觸發，每次 code update 產生 deployment，再切 active version。Execute access、dynamic API key scopes 與 environment variables 都要最小化。Event/async execution 可能重試，付款、郵件和檔案轉換要去重。

Cloud 由 Appwrite 維護；[self-hosting](https://appwrite.io/docs/advanced/self-hosting) 則自行負責 database、storage backend、worker、function runtime、SMTP/SMS、proxy/TLS、升級 migration、監控、容量與備份。能啟動 Docker Compose 不等於 production-ready；資料與 Appwrite control state 都要 restore drill。

Appwrite 適合希望取得完整 BaaS API、又保留 cloud/self-host 選擇的 web/mobile 團隊。SQL/RLS 生態可比較 Supabase/Nhost；Google mobile ecosystem 看 Firebase；較小型單機產品看 PocketBase。驗收應包含 permission deny tests、session change、function redelivery、Cloud/self-host migration、database/file backup 與版本升級 rollback。

## 參考資料

- [Appwrite documentation](https://appwrite.io/docs)
- [Appwrite authentication](https://appwrite.io/docs/products/auth)
- [Appwrite permissions](https://appwrite.io/docs/advanced/security/permissions)
- [Appwrite databases](https://appwrite.io/docs/products/databases)
- [Appwrite Functions](https://appwrite.io/docs/products/functions)
- [Appwrite self-hosting](https://appwrite.io/docs/advanced/self-hosting)
