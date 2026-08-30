---
title: "Tool Pick | Vercel Run SDK — Run Agent-Generated Code in a Sandbox That Survives Approval Pauses"
date: 2026-08-28
category: daily
tags: [ai-agent, tool, daily, sdk]
lang: en
description: "Vercel's open-source QuickJS sandbox lets agent-generated JS/TS call only the host functions you explicitly expose, and resumes from an approval pause without replaying calls that already succeeded"
tldr: "Run SDK is Vercel's open-source QuickJS sandbox that lets agent-generated JS/TS call only the host functions you expose. Install: pnpm add run. It solves the dilemma agents face when running dynamic code — either use raw eval, or spin up a full virtual machine."
series:
  name: "AI Tool of the Day"
  order: 13
---

> 🌏 [中文版](/posts/daily/2026-08-28-tool-vercel-run-sdk)

## Tool Info

| Field | Value |
|---|---|
| Name | Run SDK |
| Type | SDK (JavaScript/TypeScript sandbox execution environment) |
| GitHub | [vercel-labs/run](https://github.com/vercel-labs/run) |
| Stars | 61 |
| Language | TypeScript |
| License | Apache-2.0 |
| Install | `pnpm add run` |

## What Problem It Solves

You want an agent to write and run a piece of code to handle logic — AI SDK's code mode, a code interpreter, or having the model assemble a chunk of JS that calls your tool functions directly instead of going back and forth with individual tool calls. The problem is that executing "model-generated code" usually leaves you with two options: use raw `eval` or Node's `vm` module, which in theory gives that code access to your entire process; or spin up a full virtual machine or container for isolation, which starts slowly and burns resources for what should be a lightweight task. Node.js's own documentation is blunt about this: "the node:vm module is not a security mechanism. Do not use it to run untrusted code."

Run SDK drops guest code into an isolated QuickJS context inside a worker thread. By default it has no Node.js, no filesystem, no environment variables, and no network modules — it can only call the functions you explicitly list under `hostFunctions`, with arguments and return values copied across the boundary through a serialization format; guest and host never share JS objects. What sets it apart is its support for "interrupt, approve, resume": a host function can call `context.interrupt()` mid-execution to pause the entire run and serialize its state into a continuation token. Once a human approves it or an external check passes, resuming with the same token skips re-running host functions that already succeeded — only the logic after the interrupt point continues.

Good fit: AI SDK's code-mode pattern, letting an agent assemble its own logic to call your APIs while gating permissions, or anywhere you need fine-grained authorization over "can this code touch the database." If your agent needs to install packages, run shell commands, or touch anything at the OS level, this tool won't help — that's what Vercel Sandbox is for.

## Quick Start

### Installation

```bash
pnpm add run
# Requires Node.js 22.13+ or Bun
```

### Basic Usage

```ts
import { run } from 'run';

const result = await run({
  source: `
    const total = await tools.sum(1, 2, 3, 4);
    return { total };
  `,
  hostFunctions: {
    tools: {
      sum: (...values: number[]) =>
        values.reduce((total, value) => total + value, 0),
    },
  },
});

if (result.status === 'completed') {
  console.log(result.value); // { total: 10 }
}
```

Each group under `hostFunctions` becomes a global object inside the guest code. `source` supports top-level `await` and `return`, and every call gets a fresh QuickJS context — nothing carries over from the previous run.

### Advanced Usage: Pause for Approval, Resume Without Replaying

```ts
// Inside a host function
const context = getHostFunctionContext();

if (context.resume === undefined) {
  context.interrupt({ kind: 'approval', message: 'Send this message?' });
}

if (context.resume.resolution !== true) {
  return { sent: false };
}
return { sent: true };
```

```ts
// After the host receives the interruption, store the continuation for later approval
if (result.status === 'interrupted') {
  await continuationStore.set(approvalId, {
    continuation: result.continuation,
    interruptions: result.interruptions,
  });
}
```

Once the external decision comes back, the host reads the same continuation token into the next `run()` call. Host function calls that were already settled — including their return values or errors — are replayed from a ledger instead of re-executed, so their side effects never fire twice.

## Comparison With Existing Tools

| | Run SDK | vm2 / Node `vm` | isolated-vm | Vercel Sandbox |
|---|---|---|---|---|
| Isolation boundary | QuickJS worker thread | Contextified wrapper over `node:vm` | V8 isolate | Full virtual machine / container |
| Officially positioned as a security sandbox | ✅ | ❌ (Node's own docs say `vm` is not a security mechanism) | Partial (isolate boundary still needs your own hardening) | ✅ (OS-level isolation) |
| Pause for approval, resume without replaying completed calls | ✅ | ❌ | ❌ | ❌ |
| Startup overhead | Low (worker thread) | Low | Low | High (spins up a whole machine/container) |
| Can install packages / run OS commands | ❌ | ❌ | ❌ | ✅ |

## Caveats

- **Solves "run a piece of JS/TS logic," not a general-purpose sandbox**: work that needs a filesystem, package installation, or OS commands should use Vercel Sandbox instead — the README says so itself.
- **Node.js 22.13+ is a real barrier**: projects still on an older LTS (like Node 20) need to upgrade before installing.
- **Continuation tokens are signed, not encrypted**: the official docs specifically warn that the default signed codec only guarantees integrity, not confidentiality — token contents are base64, so don't put sensitive data into the continuation context, host function arguments, or interruption payloads.

## Takeaway

Discussions about "letting agents run dynamic code" usually focus entirely on how strong the isolation is. Run SDK points at a dimension that gets overlooked: agent workflows often need to pause on "waiting for human approval," and if the sandbox itself doesn't support pause-and-resume, you're left bolting a deduplication layer onto your application yourself — one that can easily re-fire a call that already had side effects. Baking "interrupt, approve, resume without replaying side effects" into the sandbox's execution semantics is a better fit for where agents actually get stuck than adding an idempotency check after the fact.

## References

- [vercel-labs/run GitHub repo](https://github.com/vercel-labs/run): README, license (Apache-2.0), and star count all sourced from the official repo.
- [content/docs/foundations/interruptions.mdx](https://github.com/vercel-labs/run/blob/main/content/docs/foundations/interruptions.mdx): explains interruption, continuation, resolution, and replay semantics with code examples.
- [Introducing Run SDK: secure eval for your agents — Vercel Blog](https://vercel.com/blog/introducing-run): announcement published 2026-08-25.
- [run — npm](https://www.npmjs.com/package/run): installation and version history.
- [Node.js VM (executing JavaScript) official docs](https://nodejs.org/api/vm.html): source of the "node:vm is not a security mechanism, do not use it to run untrusted code" quote.
