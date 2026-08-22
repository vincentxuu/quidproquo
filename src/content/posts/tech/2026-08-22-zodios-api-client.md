---
title: "Zodios：用 Zod endpoint definition 建立 Axios 型別安全 client"
date: 2026-08-22
category: tech
type: deep-dive
tags: [zodios, zod, axios, typescript, api-contract, openapi]
lang: zh-TW
tldr: "Zodios 以中央 Zod endpoint definition 驅動 Axios client 的型別、runtime validation 與 alias，也能接 Express 和產生 OpenAPI。"
description: "介紹 Zodios API definition、client validation、plugins、server 與 OpenAPI，並說明它和 ts-rest、oRPC 的維護取捨。"
series:
  name: "AI 時代的技術選擇"
  order: 39
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-zodios-api-client-en)

[Zodios](https://www.zodios.org/docs/intro) 是一套以 Zod 與 Axios 為核心的 REST toolbox。中央 API definition 描述 method、path、parameters、response、errors 與 alias；同一份定義可驅動 typed client，也可搭配 Express adapter 與 OpenAPI generator。

它最有辨識度的地方不是「又一個 fetch wrapper」，而是 response 預設也做 runtime validation。後端回傳錯誤 shape 時，問題會在 network boundary 被抓到，不會一路流進 UI 才爆。

## Endpoint definition 同時餵給型別與 runtime

```ts
const api = new Zodios('/api', [
  {
    method: 'get',
    path: '/users/:id',
    alias: 'getUser',
    response: UserSchema,
    errors: makeErrors([
      { status: 404, schema: z.object({ message: z.string() }) },
    ]),
  },
]);

const user = await api.getUser({ params: { id: 'u_123' } });
```

path parameter 可從 `:id` 推導，body、query 與 header 則在 parameters 內宣告。client 預設驗證並 transform request/response；也可調整成只驗 request、只驗 response 或關閉。關閉 response validation 能省成本，卻也拿掉 Zodios 最重要的 runtime contract，應先量測再決定。

plugin 可插入 auth、retry、mock 或 transport 行為，底層仍保留 Axios configuration。對已大量使用 Axios interceptor 的前端，這條遷移路徑很自然；對原生 Fetch、edge runtime 或想減少相依套件的專案，則要實測 adapter 與 bundle，而不是只看型別。

## Client 與 server 可以分開用

Zodios 不要求兩端都採用它。前端可只使用 `@zodios/core` 消費既有 API；server 可用 `@zodios/express` 實作相同 definition；`@zodios/openapi` 可產生規格與 Swagger UI。既有 OpenAPI 也能透過 ecosystem 的 `openapi-zod-client` 產生 Zodios client。

這種 modularity 適合漸進導入，但要先指定 source of truth。若工程師能同時手改 Zodios definition、Express route 與 OpenAPI JSON，三份一定會漂移。CI 要只允許其中一份被手改，其餘由 generator 產生並做 diff。

## 維護狀態是架構判準

官方文件與 package 目前仍以 Zod 3、Axios 和 Express 為主，repository 的 v11 roadmap 則列出 validator abstraction、獨立 Fetch client 與 package 重整等方向。roadmap 不是已交付能力；新專案不能把未完成項目算進選型。

這不代表既有 Zodios 專案要重寫。穩定 API、鎖定版本、contract tests 與 Renovate upgrade PR 往往更便宜。新案若重視 Standard Schema、原生 Fetch、多 runtime 與積極演進，可比較 ts-rest 或 oRPC；若 Axios client 與 response validation 正是需求，Zodios 仍很直接。

## AI agent 下的實際使用

Agent 很容易從 endpoint definition 產生呼叫、fixture 與 mock，但 alias 不等於 authorization scope。請讓每個 mutation 的 schema 包含最小輸入，credential 由 client plugin 注入，不讓模型生成或記錄 token；server 再從 credential 推導 actor，不能相信 body 裡的 user ID。

今晚可做的檢查是替一條 endpoint 故意回錯 response type，確認 client 真的拒絕；再用 OpenAPI artifact 產生獨立 smoke client。兩個都通過，才算 static type 與 wire contract 對齊。

## 參考資料

- [Zodios introduction](https://www.zodios.org/docs/intro)
- [Zodios client API](https://www.zodios.org/docs/client)
- [Zodios API definitions](https://www.zodios.org/docs/category/zodios-api-definition)
- [Zodios repository](https://github.com/ecyrbe/zodios)
