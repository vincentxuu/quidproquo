---
title: "gRPC and Connect: One Protobuf Contract across Services and Browsers"
date: 2026-08-22
category: tech
type: deep-dive
tags: [grpc, connectrpc, protobuf, rpc, api-contract, distributed-systems]
lang: en
tldr: "gRPC generates cross-language stubs from Protobuf services. A Connect server can support gRPC, gRPC-Web, and the Connect protocol together, avoiding a translating proxy for browsers."
description: "gRPC and Connect IDLs, transports, streaming, browsers, HTTP infrastructure, errors, and selection boundaries."
series:
  name: "AI 時代的技術選擇"
  order: 44
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-grpc-connect-rpc)

[gRPC](https://grpc.io/docs/what-is-grpc/introduction/) defines services, methods, and messages in `.proto`, then generates client stubs and server interfaces for multiple languages. The contract is an independent IDL rather than TypeScript inference. [Connect](https://connectrpc.com/docs/introduction/) uses the same Protobuf schema with implementations built on standard HTTP libraries and supports gRPC, gRPC-Web, and the Connect protocol together.

## Define the service before implementation

```proto
syntax = "proto3";
package user.v1;

service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
}

message GetUserRequest { string user_id = 1; }
message GetUserResponse { User user = 1; }
```

Go, Java, Python, and TypeScript consumers generate code from one schema. This fits multiple repositories, languages, and long release cadences better than shared server source, while adding fixed generator, plugin, registry, and compatibility-policy costs.

An RPC resembles a local method but still crosses a network. Deadlines, cancellation, retries, load balancing, authentication, and partial failure need explicit design. A typed stub does not justify hiding remote calls inside an ordinary loop.

## gRPC transport requires compatible infrastructure

Traditional gRPC centers on HTTP/2, binary Protobuf, headers and trailers, and streaming. Internal services get unary, server, client, and bidirectional streaming. Load balancers, ingress, service meshes, and observability must genuinely understand gRPC rather than merely proxy HTTP/1.

Browsers cannot use the complete standard gRPC transport directly and commonly require gRPC-Web plus a proxy. Connect reduces that deployment friction.

## Connect serves three protocols

Connect generates handlers and clients from the same proto. A server can accept gRPC, gRPC-Web, and Connect; the Connect protocol works over HTTP/1.1, HTTP/2, and HTTP/3 with JSON or binary Protobuf. Unary endpoints are curl-friendly, and browsers need no translating Envoy proxy.

Streaming capabilities still vary by environment. Proxy buffering, Fetch restrictions, CORS, timeouts, and hosting platforms can narrow features. Test streams through production ingress instead of relying on localhost.

Go and ECMAScript implementations are stable, while other language implementations have different maturity. Evaluate the real client matrix rather than assuming every Connect language is equivalent.

## Comparing REST and OpenAPI

Public resource APIs, cacheable GETs, webhooks, and manual curl often favor REST and OpenAPI. Multi-language internal services, strong schemas, compact payloads, and streaming favor gRPC or Connect. JSON and curl support do not turn a Protobuf RPC model into resource-oriented REST.

AI inference services benefit from token streaming, deadlines, and cancellation. Version model, budget, and usage fields explicitly; derive tenants from credentials. Interceptors authenticate, while handlers authorize resources.

## Minimum production test

Generate clients in two languages and test unary calls, large messages, deadlines, cancellation, and server streaming through realistic ingress. Kill a server and prove retry does not duplicate a side effect. Run Buf lint and breaking checks on contracts. Only then is the result an operable RPC system rather than an attractive proto.

## References

- [gRPC introduction](https://grpc.io/docs/what-is-grpc/introduction/)
- [gRPC core concepts](https://grpc.io/docs/what-is-grpc/core-concepts/)
- [Connect introduction and protocol compatibility](https://connectrpc.com/docs/introduction/)
- [Connect for Web getting started](https://connectrpc.com/docs/web/getting-started/)
