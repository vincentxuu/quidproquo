---
title: "ts-rest：保留 REST 語意的 TypeScript contract-first API"
date: 2026-08-22
category: tech
type: deep-dive
tags: [ts-rest, typescript, api-contract, rest, openapi, standard-schema]
lang: zh-TW
tldr: "ts-rest 用共享 contract 描述 method、path、status code 與 schema，在不產生程式碼的前提下讓 server 與 client 保有端到端型別。"
description: "介紹 ts-rest contract、runtime validation、strict status codes、server adapters、client 與 OpenAPI 的適用邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 38
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-ts-rest-contract-en)

[ts-rest](https://ts-rest.com/) 的定位是「RPC-like client，普通 REST wire」。你先用共享 TypeScript contract 寫出 method、path、query、body、headers、response status 與 schema，再讓 server adapter 實作、client 依同一份 contract 呼叫。沒有獨立 code-generation step，也不要求把 endpoint 改成自訂 RPC protocol。

## Contract 是唯一共享物

```ts
const c = initContract();

export const contract = c.router({
  getUser: {
    method: 'GET',
    path: '/users/:id',
    pathParams: z.object({ id: z.string() }),
    responses: {
      200: UserSchema,
      404: z.object({ message: z.string() }),
    },
  },
});
```

contract 可放 monorepo 的 shared package，也可獨立發套件。它不含 DB connection、secret 或 handler；官方特別提醒 metadata 也會進 client bundle，不能把敏感資訊放進去。Zod 以外，也能採用符合 Standard Schema 的 Valibot、ArkType、Effect Schema，或只寫 TypeScript type。

純 TypeScript type 只存在編譯期。若 input 真正來自網路，應使用 runtime schema；否則「client 編譯通過」無法證明惡意或舊版 consumer 的 payload 安全。

## HTTP status 是型別的一部分

ts-rest response 不是只回一個成功型別，而是 `{ status, body }` 的 discriminated union。client 可先判斷 `status === 200` 再取得 User，404 則取得另一個 error shape。開啟 `strictStatusCodes` 後，server 只能回 contract 宣告的 status；fetch client 還要搭配 `throwOnUnknownStatus`，runtime 行為才和 TypeScript 假設一致。

這點比「所有錯誤都塞進成功 response」更適合 API gateway、cache、監控與非 TypeScript consumer。它也迫使團隊分清楚 validation、authentication、authorization、not found 與 conflict，而不是只宣告 happy path。

## Adapter 讓它能逐步導入

ts-rest 可接 NestJS、Express、Fastify、Next.js 等 server，client 端有 fetch 與 TanStack Query 整合。既有 REST API 可以先挑一組 route 建 contract，不必整個 backend 重寫。OpenAPI 也能從同一份 contract 產生，供文件、SDK 與 breaking-change check 使用。

代價是 contract、implementation 與實際 middleware 仍可能漂移。authentication middleware 若多回一種 status、reverse proxy 改 path、serializer 把 Date 變成字串，都不會只靠 shared type 自動消失。CI 應啟動真實 server，以 contract client 跑成功與錯誤案例，再對產出的 OpenAPI 做 diff。

## 跟 tRPC、oRPC、Zodios 怎麼選

tRPC 以 procedure inference 換最短 monorepo DX；ts-rest 顯式保留 method、path 與 status，對現有 REST 和外部 consumer 友善。oRPC 提供更完整的 RPC、OpenAPI、streaming 與 native type framework。Zodios 同樣採中央 endpoint definition，但 client 以 Axios 與 Zod 為核心，生態與版本演進較保守。

AI coding agent 很會補 shared contract，卻也會「讓型別過」而漏掉 authorization。可執行的守門方式是每條 mutation 至少測未登入、跨 tenant、schema invalid 與成功四種 request，並從 OpenAPI artifact 產生一個不共享 source 的 smoke-test client。

## 什麼時候選 ts-rest

想保留可預測的 REST、團隊全用 TypeScript、又不想維護 generator pipeline，ts-rest 很合適。跨語言與外部 SDK 成為核心產品時，應把輸出的 OpenAPI 當正式 artifact；如果 contract package 只能在同一 repo 編譯，所謂端到端型別還沒有跨過真正的組織邊界。

## 參考資料

- [ts-rest contract overview](https://ts-rest.com/contract/overview)
- [ts-rest repository and integrations](https://github.com/ts-rest/ts-rest)
- [ts-rest OpenAPI](https://ts-rest.com/openapi)
