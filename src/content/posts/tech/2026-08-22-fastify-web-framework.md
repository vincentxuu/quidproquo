---
title: "Fastify：Plugin Encapsulation、JSON Schema 與高效 Node.js API"
date: 2026-08-22
category: tech
type: deep-dive
tags: [fastify, nodejs, typescript, backend, json-schema]
lang: zh-TW
tldr: "Fastify 的核心不只是 benchmark，而是以 plugin scope、hooks、decorators 與 compiled JSON Schema 建立可組合且有明確 request/response contract 的 Node.js API。"
description: "介紹 Fastify plugins、encapsulation、route schema、validation、serialization、hooks、decorators、TypeScript、testing 與 production 邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 95
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-fastify-web-framework-en)

[Fastify](https://fastify.dev/docs/latest/) 是低 overhead、schema-based 的 Node.js web framework。效能來自 routing、Ajv compiled validation 與 fast-json-stringify response serialization，但真正影響大型程式可維護性的，是 `register` 建立的 plugin encapsulation graph。

## 每次 register 都建立 scope

Fastify 除 root 外幾乎所有功能都是 plugin。`register(plugin)` 預設建立 child context：child 可繼承 ancestor decorators、hooks、schemas 和 plugins，ancestor/sibling 不會看到 child 新增的內容。這種單向 visibility 能讓 feature plugin 自帶 routes、auth hook、database decorator 與 schema。

`fastify-plugin` 可打破 encapsulation，把能力暴露給 parent scope；只在真正是 application-wide infrastructure 時使用。Plugin registration order 也是 dependency order，缺少 decorator dependency 應在 startup fail，而不是第一個 request 才報錯。

Decorator 應先宣告 shape，避免 request 時改 object layout。不要把 mutable per-request state 放在 shared server decorator；使用 request/reply decorator 或 request-local object。Connection pool 等 singleton resource 則在 plugin 建立，並用 `onClose` 對稱釋放。

## Route Schema 同時控制 input 與 output

[Validation and Serialization](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/) 建議對 body、query、params、headers 和 response 寫完整 JSON Schema。Ajv 驗證 input，fast-json-stringify 只序列化 response schema 允許的欄位，能降低意外洩漏。

Fastify v5 要求 querystring、params、body 和 response 使用 full JSON Schema，並要求 Node.js 20+。Schema 是會以 `new Function()` compile 的 application code，不能接受使用者提供的任意 schema。Database/外部 API 查詢不要放 async validation，避免 DoS；先完成結構驗證，再於 `preHandler` 做 authorization 或 I/O。

TypeScript type 不會自動產生 runtime schema。可選 TypeBox、JSON Schema-to-TS 或其他 type provider，但要定義單一 source of truth，避免 TS、validator、serializer 與 OpenAPI 四份 contract 漂移。Response schema 也要涵蓋不同 status codes。

## Hook 順序就是 request policy

Lifecycle 由 `onRequest`、`preParsing`、`preValidation`、`preHandler`、handler、`preSerialization`、`onSend`、`onResponse` 等 hooks 組成；hooks 同樣受 plugin encapsulation 限制。Auth 通常在 payload parse 後或 handler 前完成，metrics/error tracing 要涵蓋 timeout、client abort 與 streaming。

不要混用 callback `done` 與 async/Promise 寫法，避免 hook 執行兩次。Arrow function 不會把 `this` 綁為 Fastify context；需要 instance decorators 時使用一般 function，或明確 closure reference。

Fastify 不包含完整 DI、ORM 或 application architecture。它適合高吞吐 API、精準 schema contract、可組合 plugins 與想保留小 core 的團隊。需要 opinionated modules/DI 可用 NestJS（也能採 Fastify adapter）；edge/multi-runtime 可看 Hono/Elysia。驗收應涵蓋 plugin isolation、schema deny/response stripping、hook ordering、client abort、backpressure、graceful close、plugin version compatibility 與 v4→v5 migration。

## 參考資料

- [Fastify documentation](https://fastify.dev/docs/latest/)
- [Fastify plugins](https://fastify.dev/docs/latest/Reference/Plugins/)
- [Fastify encapsulation](https://fastify.dev/docs/latest/Reference/Encapsulation/)
- [Validation and serialization](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/)
- [Fastify hooks](https://fastify.dev/docs/latest/Reference/Hooks/)
- [Fastify v5 migration guide](https://fastify.dev/docs/latest/Guides/Migration-Guide-V5/)
