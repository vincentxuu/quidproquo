---
title: "Firebase：Auth、Firestore、Functions 與 Security Rules 的 BaaS 邊界"
date: 2026-08-22
category: tech
type: deep-dive
tags: [firebase, baas, firestore, authentication, serverless]
lang: zh-TW
tldr: "Firebase 的速度來自 client SDK 直連 Auth、Firestore、Storage 等 managed services；真正的後端合約落在資料模型、Security Rules、Functions 與成本限制。"
description: "介紹 Firebase Authentication、Firestore、Realtime Database、Cloud Functions、Security Rules、Emulator Suite 與選型取捨。"
series:
  name: "AI 時代的技術選擇"
  order: 85
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-firebase-backend-platform-en)

[Firebase](https://firebase.google.com/docs) 不是單一 database，而是 Google 的 app backend 組合：Authentication、Cloud Firestore、Realtime Database、Cloud Storage、Cloud Functions、Hosting、Cloud Messaging、App Check、Analytics 與 Remote Config。它讓 mobile/web client 很快取得 realtime data 與 identity，但同時把架構綁在多個產品合約上。

## Firestore 與 Realtime Database 不是同一種資料庫

Cloud Firestore 以 collection/document、query/index 和 snapshot listener 為核心；Realtime Database 是單棵 JSON tree，適合 presence、簡單同步與低延遲狀態。不要只因為兩者都 realtime 就混用：先從 query pattern、transaction boundary、offline behavior、region 與計費單位決定。

Firestore 要為查詢建 index，資料常依讀取路徑 denormalize。每次 listener 更新、fan-out read 和 retry 都可能增加操作數；成本測試要使用真實 document size、subscription 數與流量，而不是只算 stored GB。跨 document invariant 需 transaction/batched write 或可信後端。

## Security Rules 就是公開 API 的授權層

Web/mobile SDK 直接存取 Firestore/Storage 時，每個 request 都由 [Security Rules](https://firebase.google.com/docs/firestore/security/get-started) 判斷。Rules 必須驗證身份、ownership、role、允許欄位、舊值到新值的轉換與 query shape；「前端不顯示按鈕」完全不是授權。

Server client/Admin SDK 會繞過 Firestore Security Rules，改由 Google Cloud IAM 保護。因此 Cloud Functions、CI 與 backend service account 要最小權限、分環境並避免長效 JSON key。App Check 可降低非官方 client 濫用，但不能替代 user authorization。

## Functions 補 business logic，事件仍需冪等

Cloud Functions 可處理 HTTP/callable、Auth、Firestore、Storage、Pub/Sub 等事件。Trigger 可能 retry 或重送，function 應用 event ID/idempotency key 去重，外部付款與通知要記錄狀態；不要假設事件與資料寫入形成跨服務 transaction。

[Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) 能測 Auth、Firestore、Rules、Functions 等互動。Rules test 應同時涵蓋 allow 與 deny、不同 tenant/role，以及攻擊者自行組 query/write 的情境；但 emulator 與 production 在 limits、latency、IAM 和部分產品行為仍可能不同。

Firebase 適合 mobile-first、realtime/offline client、push notification 與快速 prototype，且團隊接受 Google managed ecosystem。需要 SQL/join/RLS 可比較 Supabase/Nhost；需要 function-first reactive backend 可看 Convex；要求 self-host/control 可看 Appwrite/PocketBase。上線前驗收 rules coverage、billing alerts、index migration、export/restore、regional outage 與 project separation。

## 參考資料

- [Firebase documentation](https://firebase.google.com/docs)
- [Cloud Firestore data model](https://firebase.google.com/docs/firestore/data-model)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Test Firestore Security Rules](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Cloud Functions for Firebase](https://firebase.google.com/docs/functions)
- [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite)
