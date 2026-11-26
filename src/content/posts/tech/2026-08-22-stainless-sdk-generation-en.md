---
title: "Stainless: Choosing a Multi-Language SDK Pipeline After Its Generator Shut Down"
date: 2026-08-22
category: tech
type: deep-dive
tags: [stainless, openapi, sdk-generation, api-design, codegen, developer-experience]
lang: en
tldr: "Stainless joined Anthropic in May 2026 and is winding down its hosted products, including the SDK generator; new signups stopped, so new projects can no longer choose it. The spec-plus-config, preview, and publishing pipeline it modeled is still good practice and carries over to Speakeasy, Fern, or OpenAPI Generator."
description: "Where Stainless stands after its shutdown, how to take over SDKs it already generated, and how its specification, configuration, preview build, generated repository, and vendor-exit practices apply to replacement tools."
series:
  name: "Technology Choices in the AI Era"
  order: 42
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-22-stainless-sdk-generation)

Stainless was a leading platform for generating TypeScript, Python, Go, Java, and other SDKs from OpenAPI, with extensions for reference docs, CLIs, Terraform providers, and MCP servers; every official Anthropic SDK was generated with it. It addressed how every API change becomes tested, previewed, published, and upgraded packages, not merely how a schema becomes interfaces.

## New projects can no longer choose Stainless

On 2026-05-18 Anthropic announced it was acquiring Stainless. Stainless announced at the same time that it is winding down all hosted products, including the SDK generator: new signups, projects, and SDKs stopped that day, and existing customers are directed to a transition page for other options. The documentation site now shows only a "Stainless has joined Anthropic" notice.

Customers own the SDKs generated so far and may modify and extend them freely. In practice, your generated repositories become code you maintain yourself, or code you regenerate with another tool. Google's Interactions API SDKs had been generated with Stainless; Google delayed the API's GA and moved them to Speakeasy.

## Three steps for existing users

1. **Freeze current output**: put each language's generated repository, the Stainless configuration, the OpenAPI used for the last build, and release records under your own version control, and confirm you can build, test, and ship a security patch without the Stainless service.
2. **List the SDK's public surface**: resource grouping, method names, error classes, pagination helpers, and retry and timeout defaults are APIs consumer code already depends on. When switching generators, compile and behavior-compare against this list, not just the OpenAPI.
3. **Decide how to take over**: maintain the code by hand for now, or move to another generator. When moving, start with one language and a set of endpoints that cover pagination, a union error, and upload, compare the generated diff, then schedule the remaining languages.

## Configuration shapes what OpenAPI cannot

This lesson outlives Stainless. OpenAPI describes endpoints and schemas but may not express SDK resource grouping, pagination, method names, and convenience helpers. Stainless filled that layer with its own configuration; Speakeasy uses OpenAPI Overlay and `gen.yaml`, and Fern has its own definition and generator settings. Platforms can draft this layer, but the team must review it; an LLM suggestion is not an API design decision.

Stainless configuration illustrates the conceptual split:

```yaml
resources:
  users:
    models: [User]
    methods:
      list: get /users
      retrieve: get /users/{id}
```

The actual source of truth is specification plus configuration. Leaving configuration only in a vendor UI makes builds irreproducible; when Stainless shut down, teams in that position had to reverse-engineer even their original resource grouping from the output. Both belong in a repository under review and change policy.

## A generated repository remains a product

Writing each language to staging and production repositories, creating preview builds, and helping publish packages are common to tools in this category. Each language still needs its own idiomatic error, pagination, retry, and async behavior rather than a transliteration of TypeScript.

Do not repair generated code directly because regeneration overwrites it. Fix OpenAPI, generator configuration, or customization. Hand-written extensions belong only in extension points the generator preserves and need a regeneration test. These extensions are the easiest thing to lose when switching generators, so inventory them first.

## Preview matters more than generation

An SDK can break without an OpenAPI wire break. Renaming an operation ID, moving resource groups, changing nullable mapping, upgrading the generator, or, as here, replacing the generator entirely can stop consumer compilation. Every spec pull request should produce preview SDKs, compare them with the prior API, compile them, and receive language-owner review.

Publishing needs separate approval. Versions, changelogs, registry credentials, and generated commits must remain auditable. Automation cannot choose semantic versioning policy for the team; public-surface changes caused by switching generators should ship as a major version.

## Choosing now

- **Speakeasy**: closest to Stainless's positioning, with multi-language SDKs, CLIs, MCP servers, and Terraform providers. Since September 2026 its generator is open source under AGPL-3.0; when used for free, the Speakeasy-authored code in the output is also AGPL-3.0, and publishing an SDK under your own license terms requires a commercial plan. See this series' [Speakeasy post](/posts/tech/2026-08-22-speakeasy-sdk-workflow-en).
- **Fern**: acquired by Postman in January 2026, with product and brand kept independent; its SDK generator and Docs are open source and cover nine languages.
- **OpenAPI Generator**: community-maintained under Apache-2.0 with the widest language coverage, but quality varies by language, so idiomatic output and customization are on you.
- **openapi-typescript**: the most transparent option for one TypeScript consumer and a thin Fetch client, with no hosted control plane. See this series' [openapi-typescript post](/posts/tech/2026-08-22-openapi-typescript-fetch-en).

The Stainless outcome turns the exit drill from good advice into a selection requirement: export specifications, configuration, generated repositories, and release records, then prove old SDKs can still build, receive a security patch, and republish without the service. An open-source generator you can run in your own CI reduces this risk, but read its license terms just as carefully. Also review which schemas, payload examples, and telemetry leave your environment.

Coding agents can improve descriptions, examples, and migration notes but should never receive production credentials for generated clients. An acceptance test should exercise pagination, a typed error, and file upload through preview SDKs in at least two languages; when switching generators, the same tests must pass on both old and new SDKs.

## Update Log

- 2026-11-23: Stainless joined Anthropic on 2026-05-18 and is winding down its hosted products, including the SDK generator, with new signups closed. Rewrote the title, tldr, and conclusion: added "New projects can no longer choose Stainless" and takeover steps for existing users, and the selection section now covers Speakeasy (open-sourced September 2026, AGPL-3.0), Fern (acquired by Postman January 2026), OpenAPI Generator, and openapi-typescript. References to Stainless documentation no longer resolve and were replaced with the acquisition announcements.

## References

- [Anthropic acquires Stainless](https://www.anthropic.com/news/anthropic-acquires-stainless)
- [Stainless is joining Anthropic](https://www.stainless.com/blog/stainless-is-joining-anthropic/)
- [Google Developers Blog: Why client SDK generation belongs in the open](https://developers.googleblog.com/en/why-client-sdk-generation-belongs-in-the-open/)
- [Speakeasy open-source generator (openapi-generation)](https://github.com/speakeasy-api/openapi-generation)
- [Postman acquires Fern](https://blog.postman.com/postman-acquires-fern/)
- [OpenAPI Generator](https://openapi-generator.tech/)
