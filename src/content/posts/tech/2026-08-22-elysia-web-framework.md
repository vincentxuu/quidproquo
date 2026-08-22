---
title: "Elysia：Bun-first、Runtime Schema 與端到端型別安全的 API Framework"
date: 2026-08-22
category: tech
type: deep-dive
tags: [elysia, bun, typescript, backend, api]
lang: zh-TW
tldr: "Elysia 把 runtime schema、TypeScript inference、OpenAPI 與 Eden client 串成同一條 contract，但 Bun-first 的效能優勢、plugin scope 與跨 runtime 相容性仍要分開驗證。"
description: "介紹 Elysia 的 schema、lifecycle、plugin scope、macro、Eden Treaty、OpenAPI、Bun 與 Node adapter，以及 production 選型邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 96
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-elysia-web-framework-en)

[Elysia](https://elysiajs.com/) 是以 Bun 為主要體驗、同時提供 Node.js 等 runtime adapter 的 TypeScript web framework。它最值得看的不是單一 benchmark，而是把路由、runtime validation、型別推論、OpenAPI 與 typed client 放在同一條 contract pipeline。

## Schema 是 runtime contract，不只是 TypeScript 提示

`Elysia.t` 以 TypeBox 為基礎，一份 schema 可同時處理 body、query、params、headers、cookie、response 的 runtime validation、資料 coercion、TypeScript type 與 OpenAPI schema。也能透過 Standard Schema 使用 Zod、Valibot、ArkType 等 validator；混用前要確認 coercion、file type 與 OpenAPI 產出的行為一致。

```ts
import { Elysia, t } from 'elysia'

export const app = new Elysia()
  .post('/notes', ({ body, status }) => {
    if (body.title.trim() === '') return status(422, { error: 'empty title' })
    return { id: crypto.randomUUID(), title: body.title }
  }, {
    body: t.Object({ title: t.String({ minLength: 1 }) }),
    response: {
      200: t.Object({ id: t.String(), title: t.String() }),
      422: t.Object({ error: t.String() })
    }
  })
```

Eden Treaty 能直接從 server instance 推導 object-like client，不需 code generation，並依 HTTP status narrow error type。這適合共享 TypeScript graph 的 monorepo；若 client 是其他語言、跨 repository 或必須保存版本化契約，仍應輸出並在 CI diff OpenAPI，而不是把 TypeScript inference 當成跨組織協定。

## Lifecycle 與 scope 決定 policy 會套在哪裡

Request 會依序經過 parse、transform、validation、before handle、handler、after handle、map response、error 與 after response。`derive` 適合建立 per-request context；authorization 放在 validation 後的 `beforeHandle`，提早回傳會跳過 handler；清理與遙測則要涵蓋 error、streaming 和 client abort。

Elysia instance 本身也是 plugin，但 lifecycle 預設隔離。Scope 分成 `local`、`scoped`、`global`：local 套用目前 instance 與 descendants，scoped 再向上一層 parent，global 傳到所有使用該 plugin 的 ancestors。Auth hook 放錯 scope，可能只保護 plugin 內 route，卻漏掉 parent 後續註冊的 route。可重用 plugin 應設定 `name`（必要時加 `seed`）避免重複套用；global 適合 tracing、CORS 等全域能力，database、auth 與 business feature 則優先 explicit dependency。

Macro 能把 schema 與 lifecycle 組成宣告式 route policy，例如 `auth: true`，減少每條 route 手接 hook 的漂移；但 macro 仍受 scope 與註冊順序控制，必須測試「有標記／沒標記」「plugin 內／parent route」四種組合。

## Bun-first 不等於只能跑 Bun

Elysia 可用 `@elysia/node` adapter 在 Node.js 執行，也有 Cloudflare Worker integration。這降低 runtime lock-in，卻不保證 Bun-specific API、WebSocket、filesystem、native package、部署訊號與效能特徵能原封不動搬移。若跨 runtime 是需求，從第一天就在每個目標 runtime 跑 contract、shutdown、streaming、WebSocket 與 load test。

Elysia 適合 TypeScript 全端團隊、需要快速 inference、runtime schema 與 Eden client 的服務。Fastify 的 Node plugin 生態與 JSON Schema pipeline 更成熟；Hono 對 Web Standards 與 edge portability 更保守；NestJS 提供完整 modules/DI 架構。選 Elysia 時，驗收重點應是 schema 是否覆蓋每個 status、scope 是否洩漏、typed client 是否能獨立版本化、adapter 行為是否一致，以及 Bun 升級和 production observability 是否可控，而不只是每秒 request 數。

## 參考資料

- [Elysia documentation](https://elysiajs.com/)
- [Validation](https://elysiajs.com/essential/validation)
- [Lifecycle](https://elysiajs.com/essential/life-cycle)
- [Plugins and scope](https://elysiajs.com/essential/plugin)
- [Eden end-to-end type safety](https://elysiajs.com/eden/overview)
- [OpenAPI](https://elysiajs.com/patterns/openapi)
- [Node.js integration](https://elysiajs.com/integrations/node)
