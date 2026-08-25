---
title: "Protobuf and Buf: Put Cross-Language Schema Linting, Codegen, and Compatibility in CI"
date: 2026-08-22
category: tech
type: deep-dive
tags: [protobuf, buf, schema-registry, api-contract, codegen, distributed-systems]
lang: en
tldr: "Protobuf defines binary messages with stable field numbers; Buf adds modules, linting, remote plugins, generation, and breaking-change checks to govern those schemas."
description: "Protobuf wire compatibility, presence, enums, Buf linting, generation, breaking rules, and registry boundaries."
series:
  name: "Technology Choices in the AI Era"
  order: 45
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-protobuf-buf-schema)

[Protocol Buffers](https://protobuf.dev/programming-guides/proto3/) is a schema and binary serialization format. [Buf](https://buf.build/docs/) turns `.proto` workspaces, linting, dependencies, generation, registries, and breaking checks into a repeatable workflow. They are complementary: Protobuf defines the wire contract; Buf governs its lifecycle.

## Field numbers are wire identities

```proto
message Job {
  string job_id = 1;
  JobStatus status = 2;
  optional string result_uri = 3;
}
```

Binary payloads identify fields primarily by number. A deleted field number must not receive new meaning and should be reserved. Changing a type can break the wire. Renaming often preserves binary compatibility but breaks generated source or JSON mapping, so wire compatibility is not complete consumer compatibility.

Adding fields is usually compatible, but defaults, presence, unknown fields, oneof, and enums require care. An enum's first value should represent unspecified. Test how each language runtime handles a new enum value with fixtures.

## Buf makes the toolchain repeatable

`buf.yaml` defines modules, lint, and breaking policy; `buf.gen.yaml` defines plugins and output. Remote plugins avoid a different local `protoc-gen-*` binary on every machine, but versions should be pinned so one schema produces stable source.

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

Lint catches naming, package, and import structure. Generate runs plugins. Breaking compares current and baseline schemas. Each catches a different class of failure.

## Match compatibility policy to consumers

Buf offers FILE, PACKAGE, WIRE_JSON, and WIRE categories. Public generated SDKs may break on renames and file moves, favoring FILE or PACKAGE. Stored binary events may only need WIRE, while a JSON gateway requires WIRE_JSON.

Do not weaken rules merely to make CI pass. Inventory consumers, languages, stored payloads, and JSON exposure first. Exceptions need owners and expiry. A registry centralizes modules and policy but cannot know that an offline mobile client remains active.

## Protobuf is not complete API semantics

Messages describe shapes, not authentication, authorization, idempotency, transactions, retry safety, or business invariants. Validation annotations can add ranges and formats; handlers still enforce resource ownership.

Coding agents can generate clients and migration skeletons and can also accidentally renumber fields. Require owner review for `.proto`, prohibit renumbering, and compare against a published baseline rather than a snapshot that the same branch can modify.

## When it is worthwhile

Cross-language RPC, stored events, offline clients, and many internal services often justify Protobuf and Buf. One TypeScript web app, public REST resources, or human-readable payload workflows may be simpler with OpenAPI and JSON. The decision is not that binary is always faster; it is whether the organization needs an independent, long-lived, governable schema.

## References

- [Protocol Buffers proto3 language guide](https://protobuf.dev/programming-guides/proto3/)
- [Buf CLI quickstart](https://buf.build/docs/cli/quickstart/)
- [Buf lint](https://buf.build/docs/lint/)
- [Buf breaking change detection](https://buf.build/docs/breaking/)
- [Buf code generation](https://buf.build/docs/generate/usage/)
