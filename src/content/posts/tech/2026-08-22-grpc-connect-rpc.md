---
title: "gRPC 與 Connect：同一份 Protobuf 合約如何跨服務與瀏覽器"
date: 2026-08-22
category: tech
type: deep-dive
tags: [grpc, connectrpc, protobuf, rpc, api-contract, distributed-systems]
lang: zh-TW
tldr: "gRPC 以 Protobuf service 產生跨語言 stub；Connect server 可同時支援 gRPC、gRPC-Web 與 Connect protocol，讓瀏覽器不必額外翻譯 proxy。"
description: "比較 gRPC 與 Connect 的 IDL、transport、streaming、browser、HTTP infrastructure、errors 與適用邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 44
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-grpc-connect-rpc-en)

[gRPC](https://grpc.io/docs/what-is-grpc/introduction/) 從 `.proto` 定義 service、method 與 message，再產生各語言 client stub 和 server interface。它把跨語言合約放在獨立 IDL，不依賴 TypeScript inference；[Connect](https://connectrpc.com/docs/introduction/) 沿用同一份 Protobuf，提供更貼近標準 HTTP library 的實作，並同時支援 gRPC、gRPC-Web 與 Connect protocol。

## Service 定義先於實作

```proto
syntax = "proto3";
package user.v1;

service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
}

message GetUserRequest { string user_id = 1; }
message GetUserResponse { User user = 1; }
```

Go、Java、Python、TypeScript 等 consumer 從同一 schema 產生 code。這比共享 server source 更適合多 repo、多語言與長 release cadence，也帶來 generator、plugin、schema registry 與 compatibility policy 的固定成本。

RPC 看起來像 local method，實際仍跨網路。deadline、cancellation、retry、load balancing、authentication 與 partial failure 都要明確設計；不要因為 stub 有型別，就把一次遠端呼叫藏在迴圈裡當普通 function。

## gRPC 的 transport 很強，也有基礎設施前提

傳統 gRPC 以 HTTP/2、binary Protobuf、headers/trailers 與 streaming 為核心。內部 service-to-service 能得到 unary、server streaming、client streaming 與 bidirectional streaming，但 load balancer、ingress、service mesh 和 observability 必須真的理解 gRPC，而不是只支援普通 HTTP/1 proxy。

browser 不能直接完整使用標準 gRPC transport，通常需要 gRPC-Web 與 proxy。這是 Connect 想降低的部署摩擦。

## Connect 同時服務三種 protocol

Connect implementation 從同一 proto 產生 handler 與 client。server 預設可接 gRPC、gRPC-Web 和 Connect protocol；Connect protocol 可跑 HTTP/1.1、HTTP/2、HTTP/3，也支援 JSON 與 binary Protobuf。一般 unary endpoint 甚至能用 curl 呼叫，瀏覽器不需額外 Envoy 做 protocol translation。

這不代表所有環境的 streaming 能力相同。proxy buffering、browser Fetch 限制、CORS、timeout 與 hosting platform 都可能縮小 transport feature。PoC 應從 production ingress 穿到 server 測完整串流，不要只在 localhost 通過。

Connect 的 Go 與 ECMAScript implementation 已標示 stable；其他語言成熟度不同，選型時要按實際 client matrix 查，不要用「Connect 跨語言」概括所有 SDK。

## 跟 REST／OpenAPI 怎麼分

公開 resource API、cache-friendly GET、第三方 webhook 與手動 curl 使用，OpenAPI REST 往往最容易。內部多語言 service、強 schema、低 payload overhead 與 streaming，gRPC／Connect 更自然。Connect 能提供 JSON/curl 入口，卻仍以 RPC service 和 Protobuf message 為設計中心，不會自動變成 resource-oriented REST。

AI inference service 常需要 streaming token、deadline 與 cancellation。請在 proto 明確版本化 request、model、budget 與 usage，server 從 credential 推導 tenant。不要讓 agent 自填 actor ID；interceptor 做 authentication，handler 做 resource authorization。

## 上線前的最小驗收

用兩種語言產生 client，經 production-like ingress 測 unary、large message、deadline、取消與 server streaming；再 kill server 確認 retry 不會重複 side effect。合約 CI 另跑 Buf lint 與 breaking check。完成這些，才知道選的是可操作的 RPC system，不只是一份漂亮 proto。

## 參考資料

- [gRPC introduction](https://grpc.io/docs/what-is-grpc/introduction/)
- [gRPC core concepts](https://grpc.io/docs/what-is-grpc/core-concepts/)
- [Connect introduction and protocol compatibility](https://connectrpc.com/docs/introduction/)
- [Connect for Web getting started](https://connectrpc.com/docs/web/getting-started/)
