---
title: "Zodios：用 Zod endpoint definition 建立 Axios 型別安全 client"
date: 2026-08-22
category: tech
type: deep-dive
tags: [zodios, zod, axios, typescript, api-contract, openapi]
lang: zh-TW
tldr: "Zodios 以中央 Zod endpoint definition 驅動 Axios client 的型別、runtime validation 與 alias，也能接 Express 和產生 OpenAPI。"
description: "介紹 Zodios API definition、client validation、plugins、server 與 OpenAPI，並說明它近三年沒有新版本的維護狀態，以及和 oRPC、OpenAPI-first 工具的取捨。"
series:
  name: "AI 時代的技術選擇"
  order: 39
draft: false
---

> :globe: [English version](/posts/tech/2026-08-22-zodios-api-client-en)

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

最後一個正式版是 2023-08 的 `@zodios/core` 10.9.6，之後 main branch 只剩 dependency bot 的更新；repository 的 v11 roadmap 列出 validator abstraction、獨立 Fetch client 與 package 重整，但 `feature/v11` branch 同樣停在 2023-08。`@zodios/core` 的 peer dependency 仍是 `zod: ^3.x`，Zod 作者在 2025-04 開的 Zod 4 支援 issue 沒有維護者回應，後來被 stale bot 自動關閉。repository 沒有 archive，也沒有正式宣布停止維護，但實際上已經是凍結狀態；roadmap 不是已交付能力，新專案不能把未完成項目算進選型。

這不代表既有 Zodios 專案要重寫。穩定 API、鎖定 Zod 3 與 Axios 版本、contract tests 與受控的 upgrade PR 往往更便宜；但要知道 Axios 或 Express 出了不相容的新 major、Zodios 本身出現漏洞，或團隊想升 Zod 4 時，都不會有上游配合，遷移要提早排。新案若重視 Standard Schema、原生 Fetch、多 runtime 與持續維護，可比較 oRPC，或直接以 OpenAPI 為 source of truth 搭配 openapi-typescript；同樣採中央 contract 的 ts-rest 也已在 2026-10 停止維護，不再是替代選項。

## AI agent 下的實際使用

Agent 很容易從 endpoint definition 產生呼叫、fixture 與 mock，但 alias 不等於 authorization scope。請讓每個 mutation 的 schema 包含最小輸入，credential 由 client plugin 注入，不讓模型生成或記錄 token；server 再從 credential 推導 actor，不能相信 body 裡的 user ID。

今晚可做的檢查是替一條 endpoint 故意回錯 response type，確認 client 真的拒絕；再用 OpenAPI artifact 產生獨立 smoke client。兩個都通過，才算 static type 與 wire contract 對齊。

## 更新紀錄

- 2026-11-23：維護狀態一節補上具體事實：最後正式版是 2023-08 的 10.9.6、v11 branch 同樣停在 2023-08、peer dependency 仍只到 Zod 3；替代選項移除 2026-10 停止維護的 ts-rest，改為 oRPC 或 OpenAPI-first。

## 參考資料

- [Zodios introduction](https://www.zodios.org/docs/intro)
- [Zodios client API](https://www.zodios.org/docs/client)
- [Zodios API definitions](https://www.zodios.org/docs/category/zodios-api-definition)
- [Zodios repository](https://github.com/ecyrbe/zodios)
- [Zodios issue #661：Support for Zod 4](https://github.com/ecyrbe/zodios/issues/661)
- [@zodios/core on npm](https://www.npmjs.com/package/@zodios/core)
