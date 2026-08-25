---
title: "Stainless: Continuously Generate Publishable Multi-Language SDKs from OpenAPI"
date: 2026-08-22
category: tech
type: deep-dive
tags: [stainless, openapi, sdk-generation, api-design, codegen, developer-experience]
lang: en
tldr: "Stainless uses OpenAPI plus its configuration to generate multi-language SDKs, docs, CLIs, and MCP servers. Its value is a continuous preview, publishing, and upgrade pipeline rather than one-off codegen."
description: "Stainless specifications, configuration, resource models, preview builds, generated repositories, and vendor boundaries."
series:
  name: "Technology Choices in the AI Era"
  order: 42
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-stainless-sdk-generation)

[Stainless](https://www.stainless.com/docs/) generates TypeScript, Python, Go, Java, and other SDKs from OpenAPI, with extensions for reference docs, CLIs, Terraform providers, and MCP servers. It addresses how every API change becomes tested, previewed, published, and upgraded packages—not merely how a schema becomes interfaces.

## Configuration shapes what OpenAPI cannot

OpenAPI describes endpoints and schemas but may not express SDK resource grouping, pagination, method names, and convenience helpers. Stainless configuration fills that layer. The platform can draft configuration during onboarding, but the team must review it; an LLM suggestion is not an API design decision.

The following only illustrates the conceptual split; use the current project schema for exact fields:

```yaml
resources:
  users:
    models: [User]
    methods:
      list: get /users
      retrieve: get /users/{id}
```

The actual source of truth is specification plus configuration. Both belong in a repository under review and change policy; leaving configuration only in a UI makes builds irreproducible.

## A generated repository remains a product

Stainless can output each language to staging and production repositories, create preview builds, and help publish packages. Its TypeScript generator uses native Fetch and is dependency-free by default. Other languages still need their idiomatic error, pagination, retry, and async behavior.

Do not repair generated code directly because regeneration overwrites it. Fix OpenAPI, configuration, or generator customization. Hand-written extensions belong only in preserved extension points and need a regeneration test.

## Preview matters more than generation

An SDK can break without an OpenAPI wire break. Renaming an operation ID, moving resource groups, changing nullable mapping, or upgrading the generator can stop consumer compilation. Every spec pull request should produce preview SDKs, compare them with the prior API, compile them, and receive language-owner review.

Publishing needs separate approval. Versions, changelogs, registry credentials, and generated commits must remain auditable. Automation cannot choose semantic versioning policy for the team.

## Comparing adjacent tools

openapi-typescript is more transparent for one TypeScript consumer and a thin Fetch client, with no hosted control plane. Stainless fits public APIs where SDK adoption, multi-language consistency, and documentation are product requirements. Speakeasy serves a similar multi-language need with a stronger repository workflow, Overlay, and multi-target model.

Run an exit drill before selecting a vendor: export specifications, configuration, generated repositories, and release records, then prove old SDKs can still build, receive a security patch, and republish without the service. Review which schemas, payload examples, and telemetry leave your environment.

Coding agents can improve descriptions, examples, and migration notes but should never receive production credentials for generated clients. An acceptance test should exercise pagination, a typed error, and file upload through preview SDKs in at least two languages.

## References

- [Stainless documentation](https://www.stainless.com/docs/)
- [Stainless SDK quickstart](https://app.stainless.com/docs)
- [Stainless TypeScript SDK generator](https://www.stainless.com/docs/sdks/typescript/)
- [Stainless automated builds](https://www.stainless.com/docs/sdks/publish/automate-builds/)
