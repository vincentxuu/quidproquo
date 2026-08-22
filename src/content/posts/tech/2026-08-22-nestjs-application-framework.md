---
title: "NestJS：Modules、Dependency Injection 與 Request Lifecycle 的 Node.js 架構框架"
date: 2026-08-22
category: tech
type: deep-dive
tags: [nestjs, nodejs, typescript, backend, dependency-injection]
lang: zh-TW
tldr: "NestJS 的價值不是 decorator 本身，而是以 Module、Provider、DI 與可預期 request lifecycle 統一 HTTP、GraphQL、WebSocket 和 microservice application architecture。"
description: "介紹 NestJS controllers、providers、modules、DI scopes、pipes、guards、interceptors、filters、adapters、testing 與選型邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 94
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-nestjs-application-framework-en)

[NestJS](https://docs.nestjs.com/) 是 TypeScript-first Node.js application framework。它預設以 Express 執行 HTTP，也能換 Fastify adapter；上層用 Controller、Provider、Module、dependency injection 和 decorators 組織 application，並把相同概念延伸到 GraphQL、WebSocket 與多種 message transports。

## Module 是 visibility boundary

`@Module` 宣告 controllers、providers、imports 與 exports。Provider 預設只在 module graph 的可見範圍內注入；要跨 module 使用必須 export/import。這能形成 domain boundary，也可能被「所有東西都 Global」或 circular dependency 破壞。

按 business capability 切 modules，而不是按 controllers/services/repositories 技術資料夾切成巨大水平層。Dynamic module 適合可設定 library integration；token 明確代表 port/contract，外部 SDK、database 與 clock 由 adapter provider 注入，測試才可替換。

Provider 預設 singleton scope。Request-scoped provider 會把 scope 向依賴鏈傳播，增加 allocation 與 latency；只有 request-specific context 真需要時才用，trace/tenant context 可先評估 AsyncLocalStorage。Transient 也不是修正 mutable singleton 的通用解法。

## Request lifecycle 是 policy pipeline

[Request lifecycle](https://docs.nestjs.com/faq/request-lifecycle) 大致為 middleware → guards → interceptors → pipes → controller/service → outbound interceptors；未處理 exception 進 filters。每一層責任要單一：

- Middleware 做 framework-level request preprocessing。
- Guard 做 authentication/authorization decision。
- Pipe 做 input transformation/validation。
- Interceptor 做 timeout、metrics、mapping 或 cross-cutting wrapper。
- Filter 把 exception 轉成穩定 error contract。

把 authorization 分散在 middleware、guard、controller 和 service 會產生 policy gap。Global/controller/route bindings 的順序也要用 integration tests 固定，特別是 interceptor response path 採反向順序。

DTO decorator metadata 可支援 validation/OpenAPI，但 TypeScript type 在 runtime 不存在。要啟用 ValidationPipe、明確 whitelist/forbid unknown fields，並測 nested/coercion；OpenAPI schema 與實際 response serialization 也要契約測試。Entity 不應直接當 public DTO，避免敏感欄位外洩與 persistence schema 綁死 API。

## Adapter abstraction 不是完全 portability

Nest platform layer 可換 Express/Fastify，但直接使用 `req.raw`、adapter plugin、streaming、file upload 或 middleware semantics 就會形成實際耦合。換 adapter 前跑完整 HTTP tests，不要只看 application compile。

Lifecycle hooks 管 initialize/shutdown，但 shutdown hooks 必須啟用；container termination 時要停止接流量、drain connections、關 database/consumer。Background event/microservice handler 仍需 idempotency、retry、dead letter 與 observability，Nest 不會自動提供 exactly-once。

NestJS 適合中大型 TypeScript backend、多團隊共享 conventions、需要 DI/testing、HTTP+GraphQL+messaging 一致架構的產品。小 API 用 Fastify/Hono/Elysia 更直接；需要完全自由的 minimal middleware 可用 Express。驗收應涵蓋 module boundary、DI scope、guard deny、DTO overposting、exception contract、adapter parity、graceful shutdown 與 message redelivery。

## 參考資料

- [NestJS documentation](https://docs.nestjs.com/)
- [NestJS modules](https://docs.nestjs.com/modules)
- [NestJS providers](https://docs.nestjs.com/providers)
- [NestJS injection scopes](https://docs.nestjs.com/fundamentals/injection-scopes)
- [NestJS request lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
- [NestJS lifecycle events](https://docs.nestjs.com/fundamentals/lifecycle-events)
