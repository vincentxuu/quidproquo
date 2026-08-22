---
title: "SST v3: Composing Full-Stack Cloud Apps with Components, Link, and Dev Mode"
date: 2026-08-22
category: tech
type: deep-dive
tags: [sst, infrastructure-as-code, serverless, aws, typescript]
lang: en
tldr: "SST v3 composes cloud resources through TypeScript, high-level app components, Pulumi and Terraform providers, and resource linking; it is application-first IaC, not a hosted PaaS."
description: "SST v3 components, providers, resource linking, stages, dev mode, state home, secrets, removal, and v2 migration boundaries."
series:
  name: "AI 時代的技術選擇"
  order: 93
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-sst-full-stack-infrastructure)

[SST](https://sst.dev/docs) is an application-first infrastructure framework. One `sst.config.ts` defines frontends, APIs, Functions, container Services, databases, buckets, queues, domains, and third-party provider resources in the team's AWS, Cloudflare, or other accounts.

Version matters. SST v3's Ion engine moved away from CDK and CloudFormation to Pulumi's engine and the Pulumi or Terraform provider ecosystem. Old Stack, Construct, CloudFormation quota, and v2 plugin assumptions do not transfer directly.

## Components package low-level resources as app features

[Built-in Components](https://sst.dev/docs/components/) such as `sst.aws.Nextjs`, `Function`, `Service`, and `Bucket` create groups of IAM, compute, routing, build, and deployment resources. `nodes` and transforms expose underlying Pulumi resources, but each override couples the app more tightly to component internals.

A component name is identity within the app, so renaming can create replacement resources. Changing the app `name` can deploy a new set and orphan the old one. Preview renames, use migration or alias facilities, and inventory DNS, databases, and buckets that cannot safely be replaced.

## Link is typed wiring and authorization

[Resource linking](https://sst.dev/docs/linking/) supplies bucket names, API URLs, secrets, and other properties to Functions, Services, or frontends, accessed as `Resource.MyBucket` rather than copied environment variables. For AWS components, links often configure IAM too. Inspect actual actions and resources instead of treating links as account-wide access.

Public frontends may receive only public properties. Secrets stay in server runtimes. `sst.Secret` values are encrypted and stage-specific, but deployment packages them for consumers; rotation requires deployment, while logs, bundles, and debug output can still leak values.

## Stages, Dev Mode, and State own environment lifecycle

`sst deploy --stage production` creates an independent stage. Personal and pull-request stages need naming, quotas, budgets, secret fallbacks, and cleanup. [Dev mode](https://sst.dev/docs/live/) creates real cloud resources while watching local code, running live functions, tunneling to VPCs, and starting apps. It is not a fully offline emulator and can incur costs or access shared data.

The app `home` stores [state](https://sst.dev/docs/state/) in AWS, Cloudflare, or locally. State tracks resources and secrets, and deployments lock it against concurrency. Use `sst unlock` only after proving no deployment remains. Govern bootstrap and state resources, access, backup, and recovery.

Production should explicitly choose `remove`, `retain`, or `retain-all`. `sst remove` may delete databases or buckets according to policy; retention may leave costs and sensitive data. Inventory, back up, satisfy retention rules, and obtain ownership approval before deleting stages.

SST fits TypeScript full-stack teams, especially AWS or Cloudflare serverless applications where code and infrastructure evolve together. Use Pulumi or Terraform for general platform IaC, managed frontend platforms to avoid cloud detail, and Kubernetes for cluster runtime orchestration. Test v2-to-v3 migration, component and provider upgrades, rename behavior, linked IAM, stage collisions, state recovery, secret rotation, failed deployment, and protected removal.

## References

- [What is SST](https://sst.dev/docs)
- [SST components](https://sst.dev/docs/components/)
- [SST providers](https://sst.dev/docs/providers/)
- [SST resource linking](https://sst.dev/docs/linking/)
- [SST state](https://sst.dev/docs/state/)
- [SST configuration reference](https://sst.dev/docs/reference/config)
- [SST v3 announcement](https://sst.dev/blog/sst-v3)
