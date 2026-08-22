---
title: "Convex：用 Query、Mutation、Action 建立 Reactive TypeScript Backend"
date: 2026-08-22
category: tech
type: deep-dive
tags: [convex, baas, typescript, realtime, database]
lang: zh-TW
tldr: "Convex 把 typed backend functions、transactional document database 與 reactive query subscription 綁在一起；關鍵是正確分開 deterministic mutation 和外部副作用 action。"
description: "介紹 Convex schema、query、mutation、action、reactive subscription、authorization、scheduler 與 self-hosting 邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 87
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-convex-reactive-backend-en)

[Convex](https://docs.convex.dev/) 是 TypeScript-first reactive backend：schema、document database、server functions、scheduler、file storage 與 client subscriptions 由同一平台協作。Frontend 呼叫 generated API，而不是直接取得 database connection。

## Query、Mutation、Action 是三種語意

[Query](https://docs.convex.dev/functions/query-functions) 只讀、deterministic、cached 且可訂閱；依賴資料改變時，平台重新計算並推送結果。[Mutation](https://docs.convex.dev/functions/mutation-functions) 在 transaction 內讀寫，所有 writes 一起 commit，並因 retry 要保持 deterministic。兩者不能任意呼叫外部 API。

[Action](https://docs.convex.dev/functions/actions) 可 `fetch` Stripe、OpenAI 等外部服務，也可選 Node runtime，但自身不具 database transaction。較安全的流程是 client 先呼叫 mutation 記錄 intent 並 schedule internal action；action 完成後再用 mutation 寫結果。每個外部 side effect 都要 idempotency key 與狀態機。

## Realtime 是 query invalidation，不是廣播所有 row

Client subscribe 到 query 結果。平台追蹤 dependency，相關資料改變後更新 subscription；UI 因此不用自行拼 WebSocket event 與 local cache。代價是 query 必須有合適 index、bounded result 與穩定 access pattern，不能用無界 scan 支撐熱門畫面。

Mutation 的 transaction 保護 Convex database invariant，但 action 中多次 `runQuery`/`runMutation` 是不同 transactions，不保證共同 snapshot。需要一致性的讀寫應合併到單一 internal function。

## Authorization 寫在每個公開 function

Convex 用 OIDC/JWT 整合身份；deployment endpoint 對網路公開。[Authorization](https://docs.convex.dev/auth/overview) 不是資料庫 RLS，而是在 query/mutation/action 開頭讀 `ctx.auth` 並檢查 tenant、ownership 與 role。Public function 漏檢查就是公開 API 漏洞；共用 helper、internal functions 與 negative tests 能降低遺漏。

Convex Cloud 管理 runtime/database，也已有開源 backend 可 [self-host](https://docs.convex.dev/self-hosting)，但自架會接手 storage、availability、upgrade、backup、observability 與 capacity。不能只因程式碼開源就假設遷移成本為零；先實測 export/import 與 recovery time。

Convex 適合 collaborative UI、dashboard、chat、game state 與需要 type-safe realtime 的 TypeScript 團隊。SQL analytics/joins 可看 Supabase/Nhost；mobile ecosystem 看 Firebase；多語言通用 API 可用傳統 backend。驗收應測 authorization deny、concurrent mutation、action 重送、subscription fan-out、index limits、export/restore 與 provider outage。

## 參考資料

- [Convex documentation](https://docs.convex.dev/)
- [Convex functions](https://docs.convex.dev/functions/overview)
- [Convex mutations and transactions](https://docs.convex.dev/functions/mutation-functions)
- [Convex actions](https://docs.convex.dev/functions/actions)
- [Convex authentication and authorization](https://docs.convex.dev/auth/overview)
- [Convex self-hosting](https://docs.convex.dev/self-hosting)
