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

> 🌏 [中文版](/posts/tech/2026-08-22-speakeasy-sdk-workflow)

[Speakeasy](https://www.speakeasy.com/docs/sdks/create-client-sdks) generates TypeScript, Python, Go, Java, C#, and other SDKs from OpenAPI, as well as MCP servers, docs, CLIs, and Terraform providers. Its core unit is a repeatable repository workflow, not a one-time Generate button.

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

## Comparing Stainless and thin clients

Speakeasy and Stainless both fit teams treating SDKs as products. Speakeasy makes repository workflows, Overlays, and multi-source and multi-target generation particularly explicit. Stainless emphasizes resource configuration, preview repositories, and a wider API developer platform. openapi-typescript is smaller and less coupled when only a TypeScript Fetch client is required.

Evaluate both vendors with the same intentionally imperfect spec containing pagination, union errors, uploads, and a deprecated operation. Compare diagnostics, generated diffs, customization, publishing, and exit paths rather than polished petstore demos.

An AI agent can consume generated MCP tools, but the tool surface should be narrower than the public API. A hundred public operations should not become a hundred executable tools. Use an Overlay or separate source to expose only approved read and write actions, each with authorization and confirmation policy.

## References

- [Speakeasy SDK generation quickstart](https://www.speakeasy.com/docs/sdks/create-client-sdks)
- [Speakeasy core concepts](https://www.speakeasy.com/docs/sdks/core-concepts)
- [Speakeasy CLI run](https://www.speakeasy.com/docs/speakeasy-reference/cli/run)
- [OpenAPI Overlay specification](https://spec.openapis.org/overlay/latest.html)
