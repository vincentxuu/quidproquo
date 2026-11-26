---
title: "ts-rest：保留 REST 語意的 TypeScript contract-first API，以及停止維護後的去留"
date: 2026-08-22
category: tech
type: deep-dive
tags: [ts-rest, typescript, api-contract, rest, openapi, standard-schema]
lang: zh-TW
tldr: "ts-rest 用共享 contract 描述 method、path、status code 與 schema，在不產生程式碼的前提下讓 server 與 client 保有端到端型別。2026-10 起官方宣布停止維護、不再有 bug 或安全修補，新專案改看 oRPC contract-first 或 OpenAPI-first；它的 contract 設計觀念仍然適用。"
description: "介紹 ts-rest contract、runtime validation、strict status codes、server adapters、client 與 OpenAPI，以及停止維護後既有專案怎麼處理、新專案改選什麼。"
series:
  name: "AI 時代的技術選擇"
  order: 38
draft: false
---

> :globe: [English version](/posts/tech/2026-08-22-ts-rest-contract-en)

[ts-rest](https://ts-rest.com/) 的定位是「RPC-like client，普通 REST wire」。你先用共享 TypeScript contract 寫出 method、path、query、body、headers、response status 與 schema，再讓 server adapter 實作、client 依同一份 contract 呼叫。沒有獨立 code-generation step，也不要求把 endpoint 改成自訂 RPC protocol。

## 2026-10 起已停止維護

2026-10-26 維護者在 repository README 宣布 ts-rest 不再維護：不會有新版本（包括規劃中的 V4），也沒有 bug 修正、安全更新或支援；GitHub repository 隨後 archive。最後的正式版是 `@ts-rest/core` 3.52.1（2025-03），未完成的 V4 只留給 fork 參考。現有版本、原始碼與文件照 MIT 授權保留，官方歡迎獨立 fork。

所以本文以下的 contract、status union 與 adapter 設計仍是好觀念，但「要不要選 ts-rest」的答案已經改變，見最後兩節。

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

## 跟 tRPC、oRPC、Zodios 怎麼比

tRPC 以 procedure inference 換最短 monorepo DX；ts-rest 顯式保留 method、path 與 status，對現有 REST 和外部 consumer 友善。oRPC 提供更完整的 RPC、OpenAPI、streaming 與 native type framework，也支援先定義 contract 再實作的 contract-first 寫法，是 ts-rest 使用情境最接近的替代。Zodios 同樣採中央 endpoint definition，但 client 以 Axios 與 Zod 為核心，2023-08 之後就沒有新版本。

AI coding agent 很會補 shared contract，卻也會「讓型別過」而漏掉 authorization。可執行的守門方式是每條 mutation 至少測未登入、跨 tenant、schema invalid 與成功四種 request，並從 OpenAPI artifact 產生一個不共享 source 的 smoke-test client。

## 現在還能不能選 ts-rest

新專案不要選。沒有安全修補，表示 server adapter 依賴的 Express、Fastify、NestJS、Next.js 出 breaking change 或漏洞時，沒有人會替 adapter 跟上；TypeScript 與 validator 升級也一樣。想保留「共享 contract、普通 REST wire、不用 generator」這個形狀，可以改看 oRPC 的 contract-first；如果外部 SDK 與多語言是核心，直接以 OpenAPI 當 source of truth（例如 openapi-typescript 或 SDK generator）。

已經在用的專案不必立刻重寫，但要排遷移：

1. 鎖定 `@ts-rest/*` 版本，把 adapter 依賴的 framework 版本也一起鎖，升級前先跑 contract test。
2. 現在就從 contract 匯出 OpenAPI 放進版控。這份 artifact 不依賴 ts-rest，之後換 oRPC、OpenAPI-first 或 fork 時都能當比對基準。
3. 依風險排順序：對外 API 與用到較少見 adapter 的 route 先搬，內部 route 可以等。若團隊願意接手 fork，也要把 fork 當成自己維護的依賴，安全通報由自己追。

不論選什麼，跨語言與外部 SDK 成為核心產品時，都應把輸出的 OpenAPI 當正式 artifact；如果 contract package 只能在同一 repo 編譯，所謂端到端型別還沒有跨過真正的組織邊界。

## 更新紀錄

- 2026-11-23：ts-rest 在 2026-10-26 宣布停止維護（不再有新版本、bug 與安全修補），repository 已 archive。新增「已停止維護」一節，「什麼時候選」改寫成新專案改看 oRPC contract-first 或 OpenAPI-first、既有專案的遷移步驟；Zodios 的描述補上 2023-08 後沒有新版本。

## 參考資料

- [ts-rest contract overview](https://ts-rest.com/contract/overview)
- [ts-rest repository（README 的 Maintenance status）](https://github.com/ts-rest/ts-rest)
- [ts-rest OpenAPI](https://ts-rest.com/openapi)
- [oRPC procedure contract（contract-first）](https://orpc.dev/docs/contract/procedure)
