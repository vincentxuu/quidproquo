---
title: "Nhost：PostgreSQL、Hasura GraphQL、Auth 與 Storage 的 BaaS"
date: 2026-08-22
category: tech
type: deep-dive
tags: [nhost, baas, postgresql, graphql, hasura]
lang: zh-TW
tldr: "Nhost 以 PostgreSQL 為真實資料層，由 Hasura 產生 GraphQL，再把 Auth claims、role permissions、Storage 與 Functions 接進同一平台。"
description: "介紹 Nhost PostgreSQL、Hasura GraphQL、Auth、permissions、Storage、Functions、migration metadata 與本機開發。"
series:
  name: "AI 時代的技術選擇"
  order: 89
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-nhost-postgres-graphql-backend-en)

[Nhost](https://docs.nhost.io/) 是 PostgreSQL-centered BaaS：Hasura 由 database schema 產生 GraphQL API，Nhost Auth 簽發帶 Hasura claims 的 token，Storage、Serverless Functions 與 local CLI 補齊應用後端。它和 Supabase 都以 Postgres 為核心，但 API 與 authorization 心智模型不同。

## PostgreSQL schema 會直接塑造 GraphQL

Table、relationship、view、function 與 Hasura metadata 決定 query/mutation/subscription surface。便利之處是 schema change 很快變 API；風險是錯誤 relationship、暴露 column、昂貴 nested query 也會很快變公開能力。建立 index、query depth/allowlist、timeout、rate limit 與 operation observability。

[Permissions](https://docs.nhost.io/products/graphql/permissions) 依 role、table 與 select/insert/update/delete 分別定義，預設除 admin 外不給存取。Rule 可用 `X-Hasura-User-Id` 等 JWT session variables 做 ownership/tenant filter，並限制 columns、row check 與 aggregate。Admin secret 繞過規則，不能放 browser 或一般 server path。

## Auth claim 是 identity 與 data policy 的接縫

每位 user 有 default role 和 allowed roles，request 選一個 role 解析 GraphQL/Storage permissions。不要讓 client 任意宣告未被 token 允許的 role；custom claims 與 permission variables 要由可信流程產生。高風險變更可用 WebAuthn elevation claim，但 elevation 有 token lifetime，仍需 audit 與 replay 防護。

Storage authorization 也連到 user role/metadata；database row、object 和外部 side effect 並不共用一個 ACID transaction。Upload 流程用 pending/complete state、checksum、cleanup job 和 idempotency。

## Migration 與 Metadata 必須一起進 Git

[Local Development](https://docs.nhost.io/platform/cli/local-development) 以 Docker 啟動 PostgreSQL、Hasura、Auth、MinIO、Functions 和 Mailhog。Dashboard 對 database 的修改產生 SQL migrations，GraphQL permissions/event triggers 等則寫 Hasura metadata；兩者都要 review、commit 並依序部署。

只在 cloud console 手改會造成 drift，甚至被下一次同步覆蓋。Migration 要能與新舊 client 共存，production 前測 rollback/forward-fix、metadata inconsistency、seed isolation 和 restore。Functions/event triggers 仍需冪等，不能把 Hasura event delivery 當 exactly-once。

Nhost 適合重視 PostgreSQL、GraphQL subscription、role permissions 與 local cloud parity 的團隊。偏 REST/mobile ecosystem 看 Firebase/Appwrite；typed reactive functions 看 Convex；只需單機最小 backend 看 PocketBase。驗收要涵蓋 role escalation、nested query cost、migration+metadata deployment、event redelivery、storage orphan cleanup 與 Postgres point-in-time recovery。

## 參考資料

- [Nhost documentation](https://docs.nhost.io/)
- [Nhost local development](https://docs.nhost.io/platform/cli/local-development)
- [Nhost GraphQL permissions](https://docs.nhost.io/products/graphql/permissions)
- [Nhost Auth users and roles](https://docs.nhost.io/products/auth/users)
- [Nhost Storage](https://docs.nhost.io/products/storage)
- [Nhost Functions](https://docs.nhost.io/products/functions)
