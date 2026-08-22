---
title: "Terraform: The IaC Workflow of Providers, Plans, Applies, and State"
date: 2026-08-22
category: tech
type: deep-dive
tags: [terraform, infrastructure-as-code, devops, cloud-computing, automation]
lang: en
tldr: "Terraform compares provider schemas, configuration, state, and real APIs to create a plan and apply it; controlled state and change workflow matter more than HCL itself."
description: "Terraform providers, resources, modules, plan and apply, state backends, locking, drift, import, secrets, and team workflows."
series:
  name: "AI 時代的技術選擇"
  order: 91
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-terraform-infrastructure-as-code)

[Terraform](https://developer.hashicorp.com/terraform/intro) is declarative infrastructure as code. HCL configuration describes resources and dependencies, providers translate them into APIs such as AWS, Google Cloud, Cloudflare, or GitHub, and state maps Terraform addresses to real objects.

## Write, Plan, and Apply form a change protocol

`terraform init` installs providers and modules and initializes the backend. `validate` checks structure. `plan` compares configuration, state, and remote objects to propose creates, updates, replacements, and destroys. `apply` performs them. A plan is a side-effecting change review artifact, not merely syntax validation.

CI should produce a speculative pull-request plan, then generate a final plan against latest state on a protected branch before authorized apply. Merge order, drift, provider data, and time can change the result. Saved plans are sensitive and must not cross commits, environments, or expired credentials.

## State is binding data and a sensitive asset

[State](https://developer.hashicorp.com/terraform/language/state) records resource identities, attributes, dependencies, and outputs. It is not a disposable cache. Losing it loses ownership mappings; using the wrong one can plan recreation or deletion.

Teams need a remote backend with access control, versioning, encryption, and locking. [Locking](https://developer.hashicorp.com/terraform/language/state/locking) prevents concurrent writers. Do not bypass waits with `-lock=false` or `force-unlock` before proving the lock owner is gone. Back up state, test restoration, and minimize access.

Marking values `sensitive` hides display but may still store them in plans and state. Ephemeral or write-only provider features can avoid persistence; otherwise inject through a secret manager and treat state like a secrets database. Never commit it.

## A Module is an API, not copied code

Modules should expose small typed inputs, clear outputs, provider and version constraints, and upgrade contracts. Pin and review registry or Git sources. Boolean-heavy mega-modules are hard to test; compose smaller responsibility-focused modules.

Use `moved` blocks when refactoring addresses, import for adopting objects, and removed or state workflows to stop management without deletion. Direct state editing and `-target` belong to controlled recovery, not normal operation. `prevent_destroy` is a guardrail, not a backup.

Terraform fits cross-provider provisioning and long-lived network, IAM, database, and cluster resources. Kubernetes reconciles runtime workloads, Pulumi uses general-purpose languages, and SST focuses on application-cloud composition. Test replacement review, expired credentials, lock contention, drift, provider upgrades, module migration, state restoration, and audited break-glass access.

## References

- [Terraform overview](https://developer.hashicorp.com/terraform/intro)
- [Terraform core workflow](https://developer.hashicorp.com/terraform/intro/core-workflow)
- [Terraform resources](https://developer.hashicorp.com/terraform/language/resources)
- [Terraform state](https://developer.hashicorp.com/terraform/language/state)
- [State backends and locking](https://developer.hashicorp.com/terraform/language/state/backends)
- [Managing sensitive data](https://developer.hashicorp.com/terraform/language/manage-sensitive-data)
