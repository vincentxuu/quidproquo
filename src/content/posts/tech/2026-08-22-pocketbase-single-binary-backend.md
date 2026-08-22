---
title: "PocketBase：SQLite、Auth、Realtime 與單一執行檔的 Backend"
date: 2026-08-22
category: tech
type: deep-dive
tags: [pocketbase, baas, sqlite, realtime, self-hosting]
lang: zh-TW
tldr: "PocketBase 把 SQLite、collections、Auth、file storage、SSE realtime 與 admin UI 包進小型執行檔；部署簡單，但單機邊界與 v1 前相容性風險必須明講。"
description: "介紹 PocketBase collections、API rules、Auth、Realtime、Go/JavaScript hooks、backup、production 與 scaling 邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 88
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-pocketbase-single-binary-backend-en)

[PocketBase](https://pocketbase.io/docs/) 是一個小型 Go executable，內含 SQLite、REST-ish API、Auth、file storage、SSE realtime 與 admin dashboard，也能當 Go framework 或用 JavaScript hooks 擴充。它把「一個產品後端」壓到一個 process 和 `pb_data`，非常適合原型與單機服務。

## Collection 是 SQLite 上的 API contract

Base collection 對應 SQLite table；Auth collection 加入 identity fields 與 login flows；View collection 由 read-only SQL `SELECT` 組成且不產生 realtime create/update/delete events。Schema migration、index、relation 與 query rule 應進版控，不要只在 dashboard 點完後失去變更歷史。

每個 collection 的 API rules 控制 list/view/create/update/delete，並可依 authenticated record 過濾。Superuser 會繞過 rules；client token 也是 bearer credential，登出只是移除本機 token。要測未登入、跨 user/tenant、filter expansion、file access 與 superuser token 洩漏。

## Realtime 與 hooks 仍在同一個 process

Realtime 透過 SSE 訂閱 record changes，並受 collection access 控制。大量長連線會消耗 file descriptors 和 memory；調高 `ulimit` 只是容量調校，不是水平擴展。JavaScript/Go hooks 可攔截 request、record、mail、realtime 與 backup lifecycle，但昂貴或阻塞工作會影響同一服務。

SQLite 對單機讀多寫少很強，卻不是自動 multi-primary database。把同一 `pb_data` volume 同時掛多 replicas 會破壞假設；需要跨區 HA、獨立 worker 或大量 concurrent writes 時應換架構，而非在前面多放 load balancer。

## 官方仍提醒 production-critical 風險

PocketBase 尚未到 v1，官方明示不保證完整 backward compatibility，也不建議 production-critical application，除非能追 changelog 並處理手動 migration。[Production guide](https://pocketbase.io/docs/going-to-production/) 提供 TLS、systemd、backup、settings encryption 等做法，但不改變此承諾。

Built-in backup 會把 `pb_data` 做成 snapshot，生成期間暫時 read-only；大型資料需另用 SQLite-safe backup 策略。備份放獨立 S3 bucket、加密並實際 restore；本機 backup 與主機一起壞掉等於沒有備份。

PocketBase 適合 prototype、internal tool、個人或小流量單機產品，以及需要極低部署摩擦的 edge/on-prem app。需要 managed HA 看 Firebase/Convex；完整 self-host stack 看 Appwrite；SQL GraphQL/RLS 看 Nhost/Supabase。驗收要涵蓋 binary upgrade、migration rollback、rules deny、SSE reconnect、disk full 與 clean-host restore。

## 參考資料

- [PocketBase documentation](https://pocketbase.io/docs/)
- [PocketBase collections](https://pocketbase.io/docs/collections/)
- [PocketBase authentication](https://pocketbase.io/docs/authentication/)
- [PocketBase API rules and filters](https://pocketbase.io/docs/api-rules-and-filters/)
- [PocketBase JavaScript hooks](https://pocketbase.io/docs/js-event-hooks/)
- [PocketBase production guide](https://pocketbase.io/docs/going-to-production/)
