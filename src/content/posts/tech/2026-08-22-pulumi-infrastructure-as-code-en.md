---
title: "Pulumi: Infrastructure as Code in TypeScript, Python, Go, and Other Languages"
date: 2026-08-22
category: tech
type: deep-dive
tags: [pulumi, infrastructure-as-code, typescript, devops, cloud-computing]
lang: en
tldr: "Pulumi lets general-purpose programs register cloud resources for a deployment engine, providers, and stack state to preview and update; greater language power demands stronger abstraction discipline."
description: "Pulumi projects, stacks, providers, Inputs and Outputs, components, preview and up, state backends, secrets, drift, and Automation API."
series:
  name: "AI 時代的技術選擇"
  order: 92
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-pulumi-infrastructure-as-code)

[Pulumi](https://www.pulumi.com/docs/iac/concepts/) defines infrastructure with TypeScript or JavaScript, Python, Go, C#, Java, or YAML. A language host executes the program and registers resources, the deployment engine builds a dependency graph, and providers call cloud and SaaS APIs.

## A general-purpose language is not an imperative script

A Pulumi program constructs a desired resource graph. Arbitrary cloud mutations hidden in functions or shell calls are invisible to preview and recovery. Loops, types, packages, and tests help, while branches driven by unstable network, time, or randomness make preview and update hard to reason about.

`Output<T>` represents values known only during deployment. Transform it with `apply` or interpolation rather than force-unwrapping; Output dependencies let the engine order resources. Creating many resources or side effects inside callbacks produces hidden topology.

## Project, Stack, and Component are separate boundaries

A Project is one program. A Stack is an independent configuration and state instance such as development or production. A ComponentResource packages low-level resources as a domain API. Components need stable child naming, registered outputs, propagated providers and options, and migration paths so refactors do not become delete-and-create.

`pulumi preview` shows proposed operations and `pulumi up` performs them. Lock provider, plugin, and package versions. After pull-request preview, re-evaluate against latest stack state on a protected branch. Update plans constrain operations, but the official model does not pre-evaluate the whole update atomically before execution.

## State, Secrets, and Drift remain

Each Stack has [state](https://www.pulumi.com/docs/reference/state/) in Pulumi Cloud or a DIY S3, Blob, GCS, PostgreSQL, or local backend. Cloud supplies transactional checkpoints, locking, history, RBAC, and auditing. DIY means operating access, locks, backups, availability, and disaster recovery.

Pulumi does not automatically refresh every remote resource before each operation. Use `pulumi refresh` or `--refresh` after out-of-band changes. Refresh only updates state; if the program remains unchanged, a later update can overwrite those changes.

[Secrets](https://www.pulumi.com/docs/iac/concepts/secrets/) propagate encrypted taint through state, but `--show-secrets`, logs, exports, or weak key handling can still leak them. Cloud credentials stay with the CLI runner rather than Pulumi Cloud; give that runner short-lived OIDC identity and least privilege.

Pulumi fits teams building cross-cloud platforms with familiar languages, types, packages, and component abstractions. Terraform offers a mature declarative module ecosystem, SST focuses on application composition, and Kubernetes handles runtime reconciliation. Test preview/update differences, provider upgrades, component renames, partial failures, locks, drift, stack export/import, secret-provider rotation, and clean-backend recovery.

## References

- [Pulumi concepts](https://www.pulumi.com/docs/iac/concepts/)
- [Pulumi resource providers](https://www.pulumi.com/docs/iac/concepts/providers/)
- [Pulumi Inputs and Outputs](https://www.pulumi.com/docs/iac/concepts/inputs-outputs/)
- [Pulumi state and backends](https://www.pulumi.com/docs/reference/state/)
- [Pulumi secrets](https://www.pulumi.com/docs/iac/concepts/secrets/)
- [Pulumi Automation API](https://www.pulumi.com/docs/iac/concepts/automation-api/)
