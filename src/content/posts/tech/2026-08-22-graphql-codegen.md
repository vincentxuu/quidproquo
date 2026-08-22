---
title: "GraphQL 與 Code Generator：型別安全來自 schema 加 operation，不只 schema"
date: 2026-08-22
category: tech
type: deep-dive
tags: [graphql, graphql-code-generator, api-contract, typescript, codegen, frontend]
lang: zh-TW
tldr: "GraphQL schema 定義可查詢能力；GraphQL Code Generator 再結合實際 query、mutation、fragment，產生精確 result、variables 與 typed document。"
description: "介紹 GraphQL schema、operation-level codegen、client preset、resolver types、schema evolution、auth 與 AI agent 邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 46
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-graphql-codegen-en)

[GraphQL](https://graphql.org/learn/) 讓 client 以 query 選取需要的 field，server 由單一 schema 暴露 types、fields 與 operations。只把整份 schema 轉成 TypeScript types 還不夠；真正的 response shape 取決於每一條 query。這正是 [GraphQL Code Generator](https://the-guild.dev/graphql/codegen/docs/getting-started) 的工作：把 schema 和 documents 一起編譯成 variables、result、typed document 與 resolver types。

## Operation 才是 client 的實際合約

```graphql
query UserCard($id: ID!) {
  user(id: $id) {
    id
    displayName
    avatarUrl
  }
}
```

即使 schema 的 `User` 有五十個 field，這條 operation 的 result 只有三個。client preset 可產生 TypedDocumentNode，讓 Apollo、urql 或其他 client 從 document 直接取得 variables/result 型別；fragment masking 則限制 component 只讀自己宣告的 fragment。

不要手寫 `interface User` 再假設它等於 query response。alias、nullable、union、interface 與 conditional directive 都會讓實際 shape 不同。generated type 應由 operation source 產生，不接受手改。

## Server 也能從 schema 產 resolver contract

Codegen plugin 可產生 resolver signatures、context type 與 model mapping，降低 schema 和 implementation 漂移。這仍不是 runtime authorization：schema 說 `user(id:)` 可被查，不代表任何登入者都能查任意 id。resolver 或 directive middleware 必須依 actor、tenant 與 resource 執行授權。

N+1、query cost、depth limit、timeout 與 persisted operation 也不在 TypeScript 型別內。公開 endpoint 尤其要限制任意 query；AI agent 能探索 introspection schema，更需要 operation allowlist、field-level authorization 與 cost budget。

## Codegen 應該是 CI compiler

典型設定指定 schema、documents、output 與 plugins：

```ts
export default {
  schema: './schema.graphql',
  documents: ['src/**/*.{ts,tsx,graphql}'],
  generates: {
    './src/gql/': { preset: 'client' },
  },
};
```

CI 重新生成後要求 clean diff，並在 schema registry 或比較工具檢查 breaking／dangerous change。只跑 codegen 會抓「這個 operation 已經不能編譯」，卻抓不到沒進 repository 的 mobile client 或 persisted query；production usage data 仍需加入 schema removal 流程。

GraphQL Code Generator 是 plugin-based，能服務 TypeScript frontend、Node resolver、Java 與不同 client。plugin 版本彼此相依，monorepo hoisting 也可能影響載入；鎖定 CLI、preset、plugins 和 `graphql` 版本，升級由單獨 PR 處理。

## 跟 REST／RPC 怎麼選

多個 UI 對同一 graph 需要不同 projection、產品迭代頻繁，GraphQL 很有力。固定 service method、強 streaming 與跨語言 binary contract，gRPC／Connect 更清楚；公開 resource、HTTP cache 與簡單 webhook，OpenAPI REST 維運較小。

GraphQL 的成本是 server 把 query language 暴露給 client，必須治理 resolver performance、schema evolution 與 access control。今晚可做的驗收是刪除一個被 operation 使用的 field，確認 codegen 失敗；再送一條深層昂貴 query，確認 gateway 的 cost policy 真的拒絕。

## 參考資料

- [GraphQL learn](https://graphql.org/learn/)
- [GraphQL specification](https://spec.graphql.org/)
- [GraphQL Code Generator introduction](https://the-guild.dev/graphql/codegen/docs/getting-started)
- [GraphQL Code Generator client preset](https://the-guild.dev/graphql/codegen/plugins/presets/preset-client)
- [GraphQL Code Generator installation](https://the-guild.dev/graphql/codegen/docs/getting-started/installation)
