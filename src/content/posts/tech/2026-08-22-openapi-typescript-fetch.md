---
title: "openapi-typescript：把 OpenAPI 變成零 runtime 的型別與 Fetch client"
date: 2026-08-22
category: tech
type: deep-dive
tags: [openapi-typescript, openapi, typescript, api-client, fetch, codegen]
lang: zh-TW
tldr: "openapi-typescript 將 OpenAPI 3.0／3.1 產成純 TypeScript 型別；搭配 openapi-fetch，method、literal path、parameters 與 response union 都能由 schema 推導。"
description: "介紹 openapi-typescript、openapi-fetch、runtime validation 邊界、CI schema diff 與適用情境。"
series:
  name: "AI 時代的技術選擇"
  order: 41
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-openapi-typescript-fetch-en)

[openapi-typescript](https://openapi-ts.dev/introduction) 把 OpenAPI 3.0／3.1 的 paths、components、request 與 response 轉成 `.d.ts`。產物只有型別，沒有 runtime class、HTTP client 或額外 dependency。需要真正發 request 時，再搭配同專案的 [openapi-fetch](https://openapi-ts.dev/openapi-fetch/)。

這種切法適合已經有可信 OpenAPI、只想讓 TypeScript consumer 不再手抄 interface 的團隊。

## 先產型別，再用 literal path 呼叫

```bash
npx openapi-typescript ./openapi.yaml -o ./src/api/schema.d.ts
```

```ts
import createClient from 'openapi-fetch';
import type { paths } from './api/schema';

const client = createClient<paths>({ baseUrl: 'https://api.example.com' });
const { data, error, response } = await client.GET('/users/{id}', {
  params: { path: { id: 'u_123' } },
});
```

`data` 取自成功 response，`error` 取自 4xx、5xx 或 default response，原始 Fetch `Response` 仍保留。literal path 是 inference 的索引；把路徑動態拼成普通 `string`，TypeScript 就無法知道對應 operation。

## 型別產生不等於 runtime validation

產出的型別在編譯後消失。server 若實際回傳和 spec 不同，openapi-fetch 不會自動用 Zod 逐欄解析。OpenAPI source 必須由 server contract test、response validator 或獨立 conformance test 保證；否則 generator 只會忠實放大錯誤 spec。

同理，`format: date-time` 最終如何表示、nullable 與 optional 是否符合 server serializer、multipart 與 discriminator 是否正確，都要用真實 fixture 測。不要在 generated file 手改；修 source spec 再重新產生。

## CI 的 source of truth 要單向

建議把 `openapi.yaml` 與產出的 type file 都放進版控，CI 重新生成後要求 clean diff，再跑 `tsc --noEmit`。API 改動另用 OpenAPI diff tool 判斷 breaking change。這能抓到忘記 regenerate，也能讓 consumer PR 直接看到型別變化。

若 schema 來自遠端 URL，build 可重現性較差。正式 pipeline 應先 pin 或下載經核准的 artifact，再生成；不要讓每次 frontend install 默默抓「現在最新」的 spec。

## 跟完整 SDK generator 的差別

openapi-typescript 保留 HTTP path 與 Fetch 心智模型，產物小、透明、可在 browser 與 Node 使用。Stainless、Speakeasy 會進一步產生 resource-oriented methods、pagination、retry、publishing、README 與多語言 package，適合把 SDK 當產品。

前者不替你設計 developer experience，後者則增加 generator config、vendor workflow 與 generated repository 的治理成本。只有自家 TypeScript app 時，薄 client 往往夠；要公開 Python、Go、Java SDK 時，不能拿 `.d.ts` 假裝已解跨語言。

AI agent 能直接沿 `paths` 找正確 input/output，但仍應限制它只修改 spec source 與 application code，不直接 patch generated output。最小守門動作是故意刪掉一個 required field，確認 typecheck 與 generated diff 都會紅。

## 參考資料

- [openapi-typescript introduction](https://openapi-ts.dev/introduction)
- [openapi-fetch getting started](https://openapi-ts.dev/openapi-fetch/)
- [openapi-fetch middleware and authentication](https://openapi-ts.dev/openapi-fetch/middleware-auth)
