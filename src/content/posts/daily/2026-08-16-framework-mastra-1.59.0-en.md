---
title: "Framework Update｜Mastra @mastra/core 1.59.0"
date: 2026-08-16
category: daily
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra 1.59.0 upgrades CostGuard into TokenCostControl with tiered budgets, and flips Factory's auto-run default to off — a breaking-change release focused on production operations"
tldr: "Mastra 1.59.0 highlights: (1) CostGuardProcessor renamed and upgraded to TokenCostControl, now supporting user/organization/session tiered budgets with warnAtPercent alerts; (2) Breaking: Factory's autoRunEnabled now defaults to false — rule-suggested executions enter a proposed state pending approval; (3) New listActiveThreadRuns() for low-cost querying of in-progress runs, enabling status-polling UIs."
series:
  name: "AI Framework Changelog"
  order: 1
---

> 🌏 [中文版](/posts/daily/2026-08-16-framework-mastra-1.59.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Mastra |
| Version | @mastra/core@1.59.0 |
| Previous | @mastra/core@1.58.0 |
| Release Date | 2026-08-16 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.59.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 27.2k |

## Why This Release Matters

The theme of this release is "pushing Mastra from a single-machine dev tool further toward a multi-tenant operations tool." With CostGuard upgraded to TokenCostControl, cost management is no longer a single global toggle — budgets can now be set per user, organization, or session. This is a practical capability for teams deploying Mastra as a multi-tenant SaaS backend. On the other side, Factory's auto-run behavior now defaults to off, meaning the official stance on "rules automatically triggering Agent execution" has shifted from aggressive to conservative — rules now only propose (`proposed`), requiring human approval before actually running. This signals a trend: as Agent systems move into production scenarios, "safe by default, explicit authorization" is valued more than "works out of the box, runs automatically."

## Key Changes

- **TokenCostControl (formerly CostGuardProcessor) with tiered budgets**: Adds `warnAtPercent` alert threshold, per-request `maxCost` function, and `user`/`organization`/`session` cost scopes, with optional per-model/provider cost breakdowns → multi-tenant deployments can enforce spending limits at the framework level without wrapping a separate billing layer
- **Low-cost active run queries**: `Agent.listActiveThreadRuns()` / `AgentController.listActiveThreadRuns()` with corresponding Server + JS client APIs, reading execution state directly from memory → enables "which runs are currently active" polling UIs without needing to create a session just to query
- **Observability: external parent traces correctly shown as trace roots**: OTel and Datadog tracing bridges now mark whether a span's parent is an external system or Mastra itself → fixes the issue where runs initiated from external systems had no visible trace root in Mastra Studio
- **SensitiveDataFilter adds indexed redaction mode**: `redactionStyle: 'indexed'` turns each redacted value into a stable, distinguishable token (e.g. `[APIKEY_1]`) instead of collapsing everything into `[REDACTED]` → during debugging you can tell whether two redacted values are the same, without leaking the original content
- **Observational Memory recall supports continuation**: New `nextCharOffset` field lets oversized message fragments be fetched across multiple calls → solves the problem of large messages being truncated or repeatedly returning the same initial fragment

## Breaking Changes

- `autoRunEnabled` defaults to off:
  - Before upgrade: Factory rules automatically trigger Agent execution
  - After upgrade: Rule-suggested executions enter a `proposed` decision state, requiring manual approval before actually running; to restore the old behavior, explicitly set `autoRunEnabled` to `true`
  - Impact: All projects using Factory to let rules auto-run Agents will see these flows pause at "pending approval" instead of executing automatically
- `CostGuardProcessor` → `TokenCostControl`:
  - `import { CostGuardProcessor } from '@mastra/core'` → `import { TokenCostControl } from '@mastra/core'`
  - Impact: Projects using the cost management processor; the deprecated alias is preserved but will be removed in a future major version — rename early

## Migration Guide

### Upgrading from 1.58.x to 1.59.0

```bash
# Step 1: Update dependencies
npm install @mastra/core@1.59.0
```

```typescript
// Old pattern (1.58.x)
import { CostGuardProcessor } from '@mastra/core'
const guard = new CostGuardProcessor({ maxCost: 5 })

// New pattern (1.59.0)
import { TokenCostControl } from '@mastra/core'
const control = new TokenCostControl({
  maxCost: 5,
  warnAtPercent: 80,
  scope: 'organization',
})
```

```typescript
// If you rely on Factory rules "automatically" running Agents,
// you need to explicitly enable it after upgrading —
// otherwise rules will only produce proposed decisions pending approval
const factory = new Factory({
  autoRunEnabled: true, // Defaults to false starting in 1.59.0
})
```

## Cross-Framework Observations

TokenCostControl's tiered budgets (user/organization/session) close the gap between Mastra and LangGraph on multi-tenant cost governance — LangGraph still mostly relies on external billing middleware for this. Meanwhile, Factory's auto-execution defaulting to conservative echoes the "important decisions require human-in-the-loop" philosophy in CrewAI's role-based workflows, showing that Agent frameworks converging on production use cases are broadly moving toward "approval required by default."

## Takeaway

I used to think "rename + deprecated alias" entries in framework changelogs were just naming housekeeping. This time I noticed that when Mastra renamed CostGuardProcessor to TokenCostControl, it simultaneously expanded the cost scope from a single global toggle to three tiers (user/organization/session). The rename was backed by an actual data model expansion — you can't just look at the import path diff, you need to check the new parameters to know whether it's "genuinely new capability" or just a rename.

## References

- [Mastra @mastra/core@1.59.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.59.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
