---
title: "Hono RPC：從 route implementation 推導 Fetch client 型別"
date: 2026-08-22
category: tech
type: deep-dive
tags: [hono, hono-rpc, typescript, api-contract, edge-computing, fetch]
lang: zh-TW
tldr: "Hono RPC 匯出 route 的 `typeof AppType`，讓 `hc` client 推導 input、response body 與 status code；它共享的是 TypeScript type，不是獨立 wire schema。"
description: "介紹 Hono RPC 的 route inference、validator、status union、大型 router 效能與 OpenAPI／跨語言邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 40
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-hono-rpc-client-en)

[Hono RPC](https://hono.dev/docs/guides/rpc) 不是另一個 server protocol。Hono route 照常接收 HTTP request、回傳 Fetch `Response`；server 只要匯出 route 的 `typeof AppType`，client 的 `hc<AppType>()` 就能推導 path、validator input、response JSON 與 status code。

因此它是 Hono 專案內建的 TypeScript contract bridge，特別適合 Cloudflare Workers、Bun、Deno、Node.js 等已採 Hono 的全端應用。

## 型別從 route chain 長出來

```ts
const routes = new Hono().post(
  '/posts',
  zValidator('json', z.object({ title: z.string() })),
  async (c) => c.json({ id: await create(c.req.valid('json')) }, 201),
);

export type AppType = typeof routes;

const client = hc<AppType>('https://api.example.com');
const res = await client.posts.$post({ json: { title: 'Hello' } });
```

input type 來自 validator，output type 來自 `c.json()`。若 200 與 404 都明確傳 status，client 得到可依 `res.status` narrowing 的 union。直接用 `c.notFound()` 會失去 body inference，官方建議改用 `c.json(body, 404)`。

這套機制要求 client 與 server 的 `tsconfig` 開啟 strict，也要求匯出的型別指向已 chain 完的 routes。先建立 `app`、後來分散呼叫 route 而沒有保存 chain 回傳值，可能讓 AppType 少掉 endpoint。

## 它保留 Fetch，而不是包掉 Fetch

`hc` 回傳的仍是相容 Fetch `Response` 的物件。client 明確處理 `res.ok`、status、headers 與 `res.json()`，不像某些 RPC client 直接 unwrap data。這保留 HTTP cache、stream、cookie 與 middleware 的直覺，也意味著 retry、error mapping 與 body consumption 要由 application policy 處理。

global `app.onError()` 或 global middleware 的 response 不會自動進每條 route inference；官方提供 `ApplyGlobalResponse` 手動合併 401、500 等 shape。若漏掉，client type 只看得到 happy path，production 卻仍可能收到全域錯誤。

## 大型 AppType 會壓到 TypeScript

route 多到一定程度，單一巨大 inferred type 會拖慢 editor 與 build。官方做法是把 authors、books 等 sub-app 分開，chain 到 top-level route，必要時也分拆 client；也可對 route 提供明確 type argument，減少 type instantiation。

這是 inference-based contract 的共同成本。AI agent 產生數百條 route 很快，language server 卻要展開整棵 type tree。應在 CI 量 TypeScript compile time，不能只量 HTTP latency。

## OpenAPI 與跨語言是另一條需求

AppType 只存在 TypeScript compiler，Python、Swift、API gateway 與外部開發者不能直接消費。需要 OpenAPI 時，可採 Hono 的 validator／OpenAPI ecosystem 明確產生 schema，但不要把「Hono RPC 型別正確」當成「已經有公共 API contract」。

Hono RPC 比 tRPC 更貼近原生 HTTP/Fetch，也沒有 procedure protocol。它不像 ts-rest 先寫獨立 contract，而是從 route implementation 推導；功能面又比 oRPC 薄，適合已經選 Hono、不想再加一層 framework 的團隊。

今晚可做的守門動作是建立獨立 client package，只允許 `import type AppType`，分別測成功、validation、authentication、not found 與 server error。若有非 TypeScript consumer，再從同一批 route 產生 OpenAPI 並做 breaking diff。

## 參考資料

- [Hono RPC guide](https://hono.dev/docs/guides/rpc)
- [Hono validation guide](https://hono.dev/docs/guides/validation)
- [Hono large application guidance](https://hono.dev/docs/guides/best-practices)
