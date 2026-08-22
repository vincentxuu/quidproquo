---
title: "oRPC：把 end-to-end type safety 與 OpenAPI 放在同一條路徑"
date: 2026-08-22
category: tech
type: deep-dive
tags: [orpc, typescript, api-contract, rpc, openapi, standard-schema]
lang: zh-TW
tldr: "oRPC 同時支援 implementation-first 與 contract-first，能用 RPC client，也能由同一個 router 服務 OpenAPI 3.1.1 HTTP endpoint。"
description: "介紹 oRPC procedure、Standard Schema、RPCHandler、OpenAPIHandler、contract-first 與跨 runtime 的設計取捨。"
series:
  name: "AI 時代的技術選擇"
  order: 37
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-orpc-openapi-rpc-en)

[oRPC](https://orpc.dev/) 想解掉 TypeScript API 常見的二選一：內部開發想要像 function call 的 end-to-end type safety，對外又想保留標準 HTTP path、OpenAPI 文件與跨語言 client。它讓同一組 procedure 可走 RPCHandler，也可走 OpenAPIHandler。

這不是把任意 RPC 名稱硬翻成 Swagger。route metadata、input/output schema、error 與 serializer 都進入合約，才能產生真正可用的 OpenAPI surface。

## Procedure 可從實作或合約開始

implementation-first 直接用 builder 定義 route、schema 與 handler：

```ts
const findPlanet = os
  .route({ method: 'GET', path: '/planets/{id}' })
  .input(z.object({ id: z.number().int() }))
  .output(PlanetSchema)
  .handler(async ({ input }) => db.planet.find(input.id));
```

contract-first 則先在獨立 package 定義輸入、輸出、route 與 error，再由 server 實作。前者適合單一團隊快速演進；後者適合 client、server 分 repo，或要先 review API 再寫 business logic。oRPC 支援 Standard Schema，因此不只綁 Zod，也能使用 Valibot、ArkType 等 validator。

middleware、context 與 typed error 仍是 server responsibility。schema 能拒絕錯誤 payload，不能代替 resource-level authorization；每個 procedure 都要把 actor、tenant 與 resource 一起檢查。

## RPC 與 OpenAPI 是兩個 handler，不是兩份 business logic

`RPCHandler` 搭配 RPCLink，保留 oRPC 的 native type 與傳輸體驗。`OpenAPIHandler` 則依 route metadata 接受一般 GET、POST 等 HTTP request；同一個 router 也能產生 [OpenAPI 3.1.1 specification](https://orpc.dev/docs/openapi/openapi-specification)。Node.js、Bun、Deno 與 Cloudflare Workers 都在官方支援範圍。

```ts
const handler = new OpenAPIHandler(router, {
  plugins: [new CORSPlugin()],
});

export default async function fetch(request: Request) {
  const { matched, response } = await handler.handle(request, {
    prefix: '/api',
    context: {},
  });
  return matched ? response : new Response('Not Found', { status: 404 });
}
```

OpenAPI transport 仍受 HTTP encoding 約束。File、Blob、Date、BigInt、stream 與 nested multipart 必須確認 server、generated client 與 schema converter 的實際表示，不要只看 TypeScript hover 正確。

## Lazy router 也有 contract 成本

oRPC router 是可巢狀的普通物件，也支援 lazy loading 以改善大型 server cold start。若 client 要匯入由 implementation router 衍生的 contract，直接 import 可能把內部 logic 帶進 bundle；官方提供 unlazy 與 minify 流程，只輸出 routing metadata。

更乾淨的做法是在多 repo 或公開 API 專案採 contract-first，讓 shared package 從一開始就不含實作。若已有 OpenAPI，官方也說明可透過 Hey API plugin 產生 oRPC contract，但該路徑目前標示 beta，升級前要固定版本並檢查 diff。

## 跟 tRPC、ts-rest 怎麼分

tRPC 的核心優勢是 server router type 直接流向 client，成熟度與生態最大；其官方 OpenAPI 目前仍是 alpha。ts-rest 以普通 REST contract 為中心，概念小、能逐步接到既有 framework。oRPC 則把 RPC、OpenAPI、native types、streaming 與多 runtime 放進同一套較完整的 framework。

這個完整度也意味著要治理更多 surface：RPC client 與 OpenAPI client 是否都支援、哪一個是 canonical、serializer 如何版本化、procedure rename 是否同時改 path。今晚可做的動作是挑一條含 error 與 Date 的 route，同時用 RPCLink、curl 與 generated OpenAPI client 跑 contract test。

## 什麼時候選 oRPC

同一個 TypeScript backend 同時服務自家前端、外部整合與 AI tool，而且希望只維護一份 procedure，oRPC 的定位很準。若只在單一 monorepo 追求最短 DX，tRPC 較成熟；若只要薄薄的 REST contract layer，ts-rest 較容易理解。選 oRPC 時，應把 OpenAPI artifact 納入 CI，而不是只信 inference。

## 參考資料

- [oRPC documentation](https://orpc.dev/)
- [oRPC OpenAPI getting started](https://orpc.dev/docs/openapi/getting-started)
- [oRPC OpenAPI specification generation](https://orpc.dev/docs/openapi/openapi-specification)
- [oRPC router-to-contract guidance](https://orpc.dev/docs/contract-first/router-to-contract)
