---
title: "Speakeasy: Manage Multi-Language SDKs with OpenAPI Overlays and Workflows"
date: 2026-08-22
category: tech
type: deep-dive
tags: [speakeasy, openapi, sdk-generation, api-design, codegen, ci-cd]
lang: en
tldr: "Speakeasy records OpenAPI, Overlays, targets, and generator versions in `.speakeasy/workflow.yaml`, enabling local or CI generation, compilation, and publishing of multi-language SDKs."
description: "Speakeasy sources, Overlays, workflows, targets, customization, MCP generation, and governance boundaries."
series:
  name: "Technology Choices in the AI Era"
  order: 43
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-22-speakeasy-sdk-workflow)

[Speakeasy](https://www.speakeasy.com/docs/sdks/create-client-sdks) generates TypeScript, Python, Go, Java, C#, and other SDKs from OpenAPI, as well as MCP servers, docs, CLIs, and Terraform providers. Its core unit is a repeatable repository workflow, not a one-time Generate button.

Since September 2026, Speakeasy and Google have open-sourced the generator under AGPL-3.0 ([openapi-generation](https://github.com/speakeasy-api/openapi-generation)), covering SDK generators for seven languages plus CLI and MCP server generators. Day-to-day generation still goes through the Speakeasy CLI; the difference is that the generator itself can now be run, inspected, and modified in your own CI.

## Separate sources, Overlays, and targets

A source may merge one or more OpenAPI documents and OpenAPI Overlays. An Overlay adds SDK naming, examples, or grouping without polluting a base spec emitted by a server. A target is a language SDK, MCP server, or another artifact.

```yaml
workflowVersion: 1.0.0
speakeasyVersion: pinned-version
sources:
  public-api:
    inputs:
      - location: ./openapi.yaml
      - location: ./sdk.overlay.yaml
targets:
  typescript:
    target: typescript
    source: public-api
```

Use the current CLI schema for exact fields. The durable principle is to review source, customization, and generator version together. `latest` is convenient during evaluation but unsuitable for bit-for-bit reproducible releases.

## `speakeasy run` is a repeatable build

The workflow runs locally or in GitHub Actions, downloads and merges sources, applies Overlays, generates targets, and compiles SDKs. Validation checks whether a spec is usable for codegen. Successful generation does not prove good API design; operation IDs, errors, pagination, authentication, and examples still need review.

Studio can adjust SDK design visually while persisting replayable configuration. Avoid direct edits to generated output. Hooks and custom code must survive regeneration on another machine and in CI.

## Multi-language consistency is not identical syntax

An idiomatic Python SDK is not TypeScript syntax translated mechanically. Speakeasy's language generators follow different sync, async, model, and pagination conventions. Acceptance should use sample applications in each language, not only an OpenAPI diff.

Runtime policy is part of an SDK: retried statuses, default timeouts, user-agent, telemetry, auth refresh, and streaming. These affect security and cost, belong in release notes, and need reasonable consumer overrides.

## Licensing decides how you publish SDKs

Read an open-source generator's license down to its output. According to the repository's LICENSING policy, SDKs generated under an active commercial plan or trial carry no AGPL obligations for the Speakeasy-authored code and may be released under terms the customer chooses, and those rights survive the plan's expiry. Without a commercial plan, the generator runs only after you explicitly elect AGPL-3.0-only, and the Speakeasy-authored code in the output is AGPL-3.0 too. Publishing a public SDK under MIT or Apache-2.0 still requires a commercial plan. The generator also sends usage telemetry by default; set `SPEAKEASY_DISABLE_TELEMETRY=true` to turn it off.

## Comparing other generators and thin clients

Stainless joined Anthropic in May 2026 and wound down its hosted SDK generator, so it is no longer an available comparison; some of its customers moved to Speakeasy, including Google's Interactions API SDKs (see this series' [Stainless post](/posts/tech/2026-08-22-stainless-sdk-generation-en)). For teams treating SDKs as products today, Speakeasy makes repository workflows, Overlays, and multi-source and multi-target generation particularly explicit; Fern (acquired by Postman in January 2026, open source under Apache-2.0) is another multi-language option; OpenAPI Generator covers the most languages but quality varies by language. openapi-typescript is smaller and less coupled when only a TypeScript Fetch client is required.

Evaluate the candidates with the same intentionally imperfect spec containing pagination, union errors, uploads, and a deprecated operation. Compare diagnostics, generated diffs, customization, publishing, and exit paths rather than polished petstore demos.

An AI agent can consume generated MCP tools, but the tool surface should be narrower than the public API. A hundred public operations should not become a hundred executable tools. Use an Overlay or separate source to expose only approved read and write actions, each with authorization and confirmation policy.

## Update Log

- 2026-11-23: Added that the generator was open-sourced under AGPL-3.0 in September 2026, with a new "Licensing decides how you publish SDKs" section (free use puts AGPL code in the output, custom licensing requires a commercial plan, telemetry switch). Stainless has shut down its SDK generator, so the comparison now covers Fern, OpenAPI Generator, and openapi-typescript.

## References

- [Speakeasy SDK generation quickstart](https://www.speakeasy.com/docs/sdks/create-client-sdks)
- [Speakeasy core concepts](https://www.speakeasy.com/docs/sdks/core-concepts)
- [Speakeasy CLI run](https://www.speakeasy.com/docs/speakeasy-reference/cli/run)
- [OpenAPI Overlay specification](https://spec.openapis.org/overlay/latest.html)
- [Speakeasy openapi-generation repository and LICENSING](https://github.com/speakeasy-api/openapi-generation)
- [Speakeasy: Partnering with Google to open source the foundations of DX & AX](https://www.speakeasy.com/blog/partnering-with-google)
