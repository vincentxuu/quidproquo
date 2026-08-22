---
title: "Protobuf 與 Buf：把跨語言 schema 的 lint、codegen 與相容性放進 CI"
date: 2026-08-22
category: tech
type: deep-dive
tags: [protobuf, buf, schema-registry, api-contract, codegen, distributed-systems]
lang: zh-TW
tldr: "Protobuf 用穩定 field number 定義 binary message；Buf 補上 module、lint、remote plugin、generation 與 breaking-change check，讓 schema 能被治理。"
description: "介紹 Protobuf wire compatibility、field presence、enum、Buf lint、generate、breaking rules 與 schema registry 邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 45
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-protobuf-buf-schema-en)

[Protocol Buffers](https://protobuf.dev/programming-guides/proto3/) 是 schema 與 binary serialization format；[Buf](https://buf.build/docs/) 則把 `.proto` workspace、lint、dependency、code generation、registry 與 breaking-change detection 組成可重跑的工程流程。兩者不是替代品：Protobuf 定義 wire contract，Buf 管理 contract 的生命週期。

## Field number 才是 wire identity

```proto
message Job {
  string job_id = 1;
  JobStatus status = 2;
  optional string result_uri = 3;
}
```

binary payload 主要靠 field number 辨識欄位。刪除欄位後不能把同一 number 拿給新意義，應標為 `reserved`；改 field type 可能直接破壞 wire。單純 rename 常維持 binary 相容，卻會破壞 generated source 或 JSON mapping，所以「wire compatible」不等於「consumer 不會壞」。

新增欄位通常向前／向後相容，但 default、presence、unknown field、oneof 與 enum 要理解清楚。尤其 enum 的第一個值應代表 unspecified；舊 client 收到新 enum value 時，各語言 runtime 的處理差異要用 fixture 驗證。

## Buf 把工具鏈固定下來

`buf.yaml` 定義 module、lint 與 breaking policy，`buf.gen.yaml` 定義 generator plugin 與 output。remote plugin 可避免每台機器各自安裝不同 `protoc-gen-*` binary，也應 pin version，否則同一 schema 可能產出不同 source。

```yaml
version: v2
lint:
  use: [STANDARD]
breaking:
  use: [FILE]
```

```bash
buf lint
buf breaking --against '.git#branch=main'
buf generate
```

lint 管命名、package、import 等結構；generate 跑 plugins；breaking 比 current schema 和 baseline。它們各自抓不同問題，不能只跑其中一個。

## 相容性 policy 要對應 consumer

Buf breaking 有 FILE、PACKAGE、WIRE_JSON、WIRE 等層級。若公開 generated SDK，rename 或搬檔也會破壞 source，FILE／PACKAGE 較合適；只保存 binary event、consumer 不共享 generated source 時，WIRE 可能足夠，但 JSON gateway 又需要 WIRE_JSON。

不要為了讓 CI 綠就降規則。先列出 consumer、語言、保存中的 payload 與 JSON exposure，再選 policy；例外要有期限與 owner。schema registry 能集中 module 與 policy，卻不能替你知道某個離線 mobile client 還活著。

## Protobuf 不是完整 API 語意

message 能描述資料 shape，無法單獨表達 authentication、authorization、idempotency、transaction、retry safety 與 business invariant。validation annotation 能補格式和範圍，resource ownership 仍要在 handler 判斷。

AI agent 特別適合從 proto 生成 client 和 migration skeleton，也容易誤改 field number。把 `.proto` 設成需要 owner review 的 path，禁止 agent 重新編號；CI 以 published baseline 跑 `buf breaking`，而不是只對工作分支內可被一起改掉的 snapshot。

## 什麼時候值得用

跨語言 RPC、長期保存事件、mobile/offline client 和大量內部 service，Protobuf + Buf 的固定成本通常值得。單一 TypeScript web app、公開 REST resource 或人類會頻繁直接讀 payload 時，OpenAPI/JSON 可能更簡單。決策重點不是 binary 一定較快，而是團隊是否真的需要獨立、長壽、可治理的 schema。

## 參考資料

- [Protocol Buffers proto3 language guide](https://protobuf.dev/programming-guides/proto3/)
- [Buf CLI quickstart](https://buf.build/docs/cli/quickstart/)
- [Buf lint](https://buf.build/docs/lint/)
- [Buf breaking change detection](https://buf.build/docs/breaking/)
- [Buf code generation](https://buf.build/docs/generate/usage/)
