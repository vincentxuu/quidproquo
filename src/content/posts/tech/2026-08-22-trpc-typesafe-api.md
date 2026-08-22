---
title: "tRPC：用 TypeScript inference 連起 client 與 server 的 API 合約"
date: 2026-08-22
category: tech
type: deep-dive
tags: [trpc, typescript, api-contract, rpc, openapi, full-stack]
lang: zh-TW
tldr: "tRPC 讓 client 直接引用 server router 的型別，不需先寫 schema 或產生程式碼；v11 另有 alpha 階段的官方 OpenAPI 3.1 產生器。"
description: "介紹 tRPC procedure、router、validator、client links、HTTP wire format，以及 TypeScript monorepo 與跨語言 API 的選用邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 36
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-trpc-typesafe-api-en)

[tRPC](https://trpc.io/docs/) 的核心很直接：server 匯出 `AppRouter` 型別，client 用同一個型別取得 procedure 路徑、input、output 與 error 的自動完成。合約不是另一份 IDL，也不需要 code generation；TypeScript inference 本身就是連接兩端的橋。

這讓同一個 TypeScript codebase 的修改迴圈極短，也表示它首先是「共享編譯邊界」的解法，不是天然的跨語言公共 API 標準。

## Procedure 是合約與實作的交界

tRPC router 由 query、mutation、subscription 三種 procedure 組成。input validator 在 runtime 解析不可信資料，resolver 的 return type 則向 client 推導。

```ts
const t = initTRPC.create();

export const appRouter = t.router({
  userById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => db.user.findUnique({ where: { id: input.id } })),
});

export type AppRouter = typeof appRouter;
```

client 只需 `import type { AppRouter }`，不會把 server business logic 打進 bundle。middleware 與 base procedure 可集中 authentication、tenant membership 與 context narrowing；不過 authorization 必須在 server 執行，型別安全不會阻止越權查詢。

output 若只靠 inference，client 的 TypeScript 型別很順，但 runtime 不會因此自動驗證資料。資料庫 migration、serializer 或第三方資料可能讓回傳值偏離預期；對外邊界需要時，仍應加 `.output()` validator。

## Client link 決定怎麼上線傳輸

tRPC client 的 link chain 可組合 logging、retry、header 與終端 transport。官方目前建議 `httpBatchLink` 作為一般 HTTP 終端 link，也有 streaming、subscription 與 WebSocket 選項。

wire format 不是「每個 procedure 都是一條普通 REST resource」。依 [HTTP RPC specification](https://trpc.io/docs/rpc)，procedure path、JSON input、batch 與 response envelope 都有 tRPC 自己的約定。browser、server 和同語言 app 用官方 client 最省事；curl、第三方 webhook、API gateway policy 與其他語言 consumer 則要額外處理這份協定。

## 官方 OpenAPI 已存在，但仍是 alpha

2026 年的 tRPC v11 已提供 [`@trpc/openapi`](https://trpc.io/docs/openapi)。它靜態分析 router 的 TypeScript 型別，產生 OpenAPI 3.1，不執行 application code；query 轉成 GET、mutation 轉成 POST，也可交給 Hey API 等工具產生跨語言 client。

限制同樣重要：套件仍標示 alpha；subscription 尚不進 spec；GET input 採單一 JSON query parameter，而非把每個欄位拆成傳統 query parameter。若 server 使用 SuperJSON 等 transformer，外部 client 也要用相同 serializer，否則 Date、Map 或 BigInt 會失真。

因此 OpenAPI 能改善文件、agent tool discovery 與外部 client，但不會把既有 tRPC wire contract 自動變成最傳統的 REST surface。公共 API 若從第一天就要求穩定 path、status code、language-neutral schema 與 gateway interoperability，oRPC、ts-rest 或 OpenAPI-first 工具通常更直白。

## AI coding 讓優勢變大，也放大隱性耦合

Agent 能沿著 router type 快速完成 client 呼叫與 refactor，tRPC 的大生態也提供大量可檢索範例。代價是 agent 很容易把「型別能編譯」誤認成 API 沒破壞：runtime validator、error shape、authorization、cache key 與 transformer 都要有 integration test。

今晚就能做的檢查是：在 CI 匯出 OpenAPI，對上一版跑 breaking-change diff；再以一個不引用 server source 的 consumer package 編譯 client。前者看公開 wire contract，後者看 TypeScript 合約是否真的能獨立消費。

## 什麼時候選 tRPC

同一團隊、同一 monorepo、client 與 server 都是 TypeScript，且主要 consumer 是自家 web app，tRPC 仍是摩擦很低的預設。需要多語言 SDK、外部開發者入口或長期獨立 release cadence 時，先把 OpenAPI／Protobuf 當 source of truth，通常比事後從 inference 補公共合約穩。

## 參考資料

- [tRPC procedures](https://trpc.io/docs/server/procedures)
- [tRPC client links](https://trpc.io/docs/client/links)
- [tRPC HTTP RPC specification](https://trpc.io/docs/rpc)
- [tRPC OpenAPI alpha](https://trpc.io/docs/openapi)
