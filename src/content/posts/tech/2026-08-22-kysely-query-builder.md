---
title: "Kysely：把 SQL 保留下來的 TypeScript 型別安全 Query Builder"
date: 2026-08-22
category: tech
type: deep-dive
tags: [kysely, typescript, sql, database, query-builder]
lang: zh-TW
tldr: "Kysely 從資料庫型別推導查詢結果，保留 SQL 的可見性與逃生口；但 migration、實際 schema 與 generated types 仍要由團隊維持同步。"
description: "介紹 Kysely 的型別模型、查詢組合、transaction、migration、raw SQL 邊界，以及它與 ORM 的取捨。"
series:
  name: "AI 時代的技術選擇"
  order: 47
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-kysely-query-builder-en)

[Kysely](https://kysely.dev/docs/intro) 是 TypeScript 的 type-safe SQL query builder。它不要求把資料庫包裝成帶生命週期的 entity，也不假裝 SQL 不存在。你提供資料庫 schema 型別，builder 就在 `select`、`join`、alias 與 expression 間推導參數和結果。

## 型別來自 schema，不是資料庫連線

```ts
interface DB {
  person: {
    id: Generated<number>;
    email: string;
    tenant_id: string;
  };
}

const person = await db
  .selectFrom('person')
  .select(['id', 'email'])
  .where('tenant_id', '=', tenantId)
  .where('id', '=', personId)
  .executeTakeFirst();
```

結果只含 `id` 與 `email`，欄名、運算值和 join 關係也會被檢查。這比回傳整個 model 再手動宣告 DTO 更接近實際 query shape。

但 TypeScript 不會在 runtime 讀取 production schema。型別檔若說欄位存在、migration 卻沒部署，程式仍會在執行時失敗。應由 migration 或 introspection/codegen 產生型別，CI 檢查 drift，並把 nullable、generated column 與資料庫特有型別納入映射。

## 組合 SQL，而不是藏起 SQL

Kysely 的 fluent API 對常見 CRUD、CTE、subquery、aggregate 與 dialect expression 很清楚；需要資料庫特有能力時，可用 `sql` template 寫 raw fragment。參數仍應由 template 綁定，不能把使用者文字插入 identifier 或 SQL 字串。

動態 filter 是常見陷阱。若 AI agent 能任意選欄位、排序或 expression，不要把它直接轉成 raw SQL。先把輸入映射到固定 column allowlist、operator allowlist、tenant predicate 與 row limit。型別安全不能取代 query authorization、timeout 或 cost guardrail。

## Transaction 與 migration 的邊界

[Kysely API](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html) 提供 transaction、schema module 與 migration primitives。交易 callback 內只使用 transaction handle，讓失敗能 rollback。外部 API 呼叫不會跟資料庫一起原子化，需要 outbox、idempotency key 或 durable workflow。

Migration 可以跟 Kysely 放在一起，但它不是「修改 interface 就自動改 production」。deploy 必須明確處理 expand／migrate／contract，特別是 rolling deployment：先新增相容欄位，再回填與切讀，最後才刪舊欄位。

## 跟 ORM 怎麼選

若產品以 aggregate、relation loading、unit of work、identity map 或完整 schema lifecycle 為中心，ORM 可能省事。若團隊會讀 SQL、query shape 多、需要精準控制 join 與 projection，Kysely 的抽象比較薄，也容易檢查產生的 SQL。

代價是 relation、validation、authorization、cache 與 domain invariant 都不會自動出現。今晚可從測試資料庫產生 schema types，故意移除一個 migration，再確認 drift check 失敗。接著對最複雜 query 跑 `EXPLAIN`，確定型別正確之外，索引與成本也正確。

## 參考資料

- [Kysely introduction](https://kysely.dev/docs/intro)
- [Kysely API documentation](https://kysely-org.github.io/kysely-apidoc/classes/Kysely.html)
- [Kysely type safety](https://kysely-org-kysely.mintlify.app/core-concepts/type-safety)
