---
title: "Framework Update | Mastra @mastra/core@1.64.0"
date: 2026-09-05
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra 1.64 turns sandbox startup from 'cold boot every time' into 'reusable template plus warm checkout,' unifies working-directory behavior across providers, and ships two breaking changes"
tldr: "Mastra @mastra/core@1.64.0 highlights: (1) a new reusable sandbox template (`@mastra/platform-workspace` plus `@mastra/e2b`) lets sandboxes start from a pre-cloned, pre-built repo image, cutting cold-start time for code sessions and workspace-backed agents; (2) `MastraSandboxOptions.workingDirectory` unifies default working-directory behavior across every sandbox provider (Docker, E2B, Vercel, Railway, etc.); (3) breaking: `@mastra/factory`'s `sandbox` config changes from an options object to a callback, and `@mastra/playground-ui` removes `Chip`/`ChipsGroup`/`StatusBadge` in favor of `Badge`."
series:
  name: "AI Framework Changelog"
  order: 14
---

> 🌏 [中文版](/posts/daily/2026-09-05-framework-mastra-1.64.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Mastra |
| Version | `@mastra/core@1.64.0` |
| Previous | `@mastra/core@1.63.0` |
| Release Date | 2026-09-04 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.64.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 27.7k |

## Why This Release Matters

[The previous entry (1.63.0)](/en/posts/daily/2026-08-29-framework-mastra-1.63.0-en) fixed the mismatch between traces and native logs. This release tackles a different production pain point: **how expensive sandbox cold starts are**. Until now, every code session or workspace-backed agent had to re-clone and rebuild a repo from scratch each time a sandbox spun up, and that wait landed directly in user-perceived latency. 1.64 introduces reusable sandbox templates that let a sandbox start from an image that's already cloned and built — with background rebuilds and configurable resource sizing — effectively swapping "build the house every time" for "have a model home ready to move into." The same release also collapses `workingDirectory`, previously defined inconsistently per sandbox provider (Docker, E2B, Vercel, Railway...), into one unified option, cutting the mental overhead of re-checking "where does this provider actually default to" every time you switch.

## Key Changes

- **Reusable Sandbox Templates + Warm Repo Checkouts (E2B & Platform)**: `@mastra/platform-workspace` gains reusable template APIs and `@mastra/e2b` adds repo templates, letting sandboxes start from a pre-cloned, pre-built repository image (with background rebuilds and resource sizing) → dramatically reduces cold-start time for code sessions and workspace-backed agents
- **Unified `workingDirectory`**: a new `workingDirectory` option on `MastraSandboxOptions` is honored by every sandbox provider (plus a `sandbox.workingDirectory` getter), with per-command `cwd` still able to override it → default CWD behavior across Docker/E2B/Vercel/Railway is finally consistent, and legacy `workingDir` (docker/apple-container) and `workdir` (modal) remain as aliases feeding the same field
- **Client-side tools can use server-defined `toModelOutput`**: client-executed tools without an `execute` function can now have the server's `toModelOutput` transform their returned payload (e.g. `{ fileId, dataUrl }`) into model-ready content such as an image part → no more hand-rolled input processor for this conversion, matching AI SDK behavior
- **Observability Feedback Review Workflow**: feedback records gain a `reviewStatus` (`needs-review`/`reviewed`) filterable via `listFeedback`, plus a new `updateFeedbackReviewStatus` storage method and a `PATCH /api/observability/feedback/:feedbackId/review-status` endpoint (with a matching method on `@mastra/client-js`) → user feedback can now go through a real review workflow instead of sitting scattered in logs
- **New `@mastra/evals/vitest` test runner integration**: `runEvals` can run directly as Vitest tests with `expectEvals`/`expectEval` and custom matchers, plus a reporter that prints per-test scores → evals can gate CI directly instead of needing a separate scoring script

## Breaking Changes

- `@mastra/factory`'s `sandbox` config changes from an options object to a callback:
  - `{ sandbox: { provider: 'e2b', ... } }` → `{ sandbox: ctx => new E2BSandbox({ id: ctx.sessionId }) }`
  - `workdir`/`maxSandboxes` and the old sandbox fleet/reattach model are removed
  - Impact: any project configuring sandboxes through `@mastra/factory` must rewrite the options object as a callback
- `@mastra/playground-ui` removes `Chip`, `ChipsGroup`, and `StatusBadge` in favor of a single `Badge` component (now a `<span>` with updated prop typing):
  - Impact: custom playground UIs that embed these components directly

## Migration Guide

### Upgrading from 1.63.x to 1.64.0

```bash
pnpm add @mastra/core@1.64.0
```

```ts
// @mastra/factory sandbox config
// Old (1.63.x and earlier)
const factory = createFactory({
  sandbox: { provider: 'e2b', workdir: '/home/user', maxSandboxes: 10 },
});

// New (1.64.0)
const factory = createFactory({
  sandbox: ctx => new E2BSandbox({ id: ctx.sessionId, workingDirectory: '/home/user' }),
});
```

```tsx
// @mastra/playground-ui Chip-family components
// Old (1.63.x and earlier)
<Chip>{label}</Chip>

// New (1.64.0)
<Badge>{label}</Badge>
```

Projects that only call `@mastra/core` APIs and don't configure `@mastra/factory` sandboxes or embed `@mastra/playground-ui` components directly have no breaking changes — upgrade freely.

## How It Compares to Other Frameworks

Mastra's recent cadence is clear: 1.63 fixed observability (traces not lining up with logs), 1.64 fixes execution infra (sandbox cold starts, cross-provider consistency). Neither adds new agent capabilities — both smooth out existing friction on the path to running agents in production. That's a different focus from CrewAI's or Agno's current priorities (role-based APIs, Knowledge/RAG data integrity). As the closest thing to a default choice in the TypeScript ecosystem, Mastra has more aggressively baked "the sandbox is a first-class agent execution primitive" into the framework core, competing directly with standalone sandbox services like E2B and Daytona rather than leaving sandboxing entirely to the user.

## Today's Takeaway

I used to think sandbox templating was just an infrastructure detail — pre-baking a Docker image and leaving it at that — with little bearing on framework design itself. Seeing Mastra turn "warm repo checkout" and "background template rebuilds" into first-class APIs on `@mastra/platform-workspace` made it click: for long-running, high-frequency sandbox-spinning agent workflows, cold-start time is itself a major source of perceived latency. Templating isn't a nice-to-have polish — it's what makes "every agent session runs in a clean sandbox" viable as a production-grade security posture instead of a costly ideal.

## References

- [Mastra @mastra/core@1.64.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.64.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.63.0 — previous framework update](/en/posts/daily/2026-08-29-framework-mastra-1.63.0-en)
