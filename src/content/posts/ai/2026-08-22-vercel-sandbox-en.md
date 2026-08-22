---
title: "Vercel Sandbox Deep Dive: Putting the Agent Execution Layer Inside the Vercel Ecosystem"
date: 2026-08-22
category: ai
tags: [vercel, sandbox, ai-agent, fluid-compute, firecracker, security]
lang: en
type: deep-dive
tldr: "Vercel Sandbox isolates untrusted code in Firecracker microVMs and integrates with Fluid compute, Active CPU pricing, and Vercel OIDC. It fits agents already running on Vercel, but network defaults, memory billing, and persistence still require deliberate design."
description: "A lifecycle-based examination of Vercel Sandbox: architecture, minimal usage, isolation, networking, persistence, pricing, security boundaries, and infrastructure trade-offs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-vercel-sandbox)

[Vercel Sandbox](https://vercel.com/docs/sandbox) is an on-demand Linux execution environment controlled through an SDK or CLI. It runs AI-agent-generated code, uploaded scripts, and test workloads. This is not a permission prompt layered onto a Vercel Function. Untrusted work moves into a separate Firecracker microVM: the agent loop can remain in a Function while shell commands, package installation, and preview servers run in Sandbox.

The product reached GA in January 2026. Vercel named v0, Blackbox AI, and RooCode as production users at launch. This article does not review the entire Vercel Agent Stack; it follows one sandbox through its lifecycle to identify when the integrated product is more useful than operating containers yourself.

## Where a sandbox starts

A typical architecture has two compute boundaries:

```text
Browser
   │ request / streamed result
   ▼
Vercel Function ── LLM / AI Gateway
   │ trusted control plane
   │ create, runCommand, stop
   ▼
Vercel Sandbox (Firecracker microVM)
   ├─ generated code
   ├─ isolated filesystem
   └─ controlled outbound network
```

The Function owns identity, database connections, and model credentials. The Sandbox receives only the files and network capabilities required for the job. Vercel's security architecture makes an important distinction: placing the harness and generated code in one VM still gives both the same security context. Malicious generated code could read harness credentials. Enforcing the boundary requires separate compute environments.

This also explains [Fluid compute's](https://vercel.com/blog/fluid-how-we-built-serverless-servers) place in the stack. Fluid suits the I/O-heavy control loop that waits for an LLM, database, or Sandbox. Sandbox handles short-lived, unpredictable, potentially hostile execution. Fluid pauses CPU billing during I/O, but Sandbox is not simply a process inside a Function: its microVM, filesystem, and lifecycle remain a separate product boundary.

## Create, execute, stop: the minimum workflow

The TypeScript SDK has a compact lifecycle. A Vercel deployment can use project OIDC automatically. Local development first runs `vercel link` and `vercel env pull`; external CI uses an access token when OIDC is unavailable.

```ts
import { Sandbox } from '@vercel/sandbox';

const sandbox = await Sandbox.create({
  runtime: 'node24',
  timeout: 5 * 60 * 1000,
  networkPolicy: 'deny-all',
});

try {
  const result = await sandbox.runCommand({
    cmd: 'node',
    args: ['-e', 'console.log(6 * 7)'],
  });

  console.log(result.stdout);
} finally {
  await sandbox.stop();
}
```

The default system is Amazon Linux 2023, with built-in Node.js and Python runtimes and support for importing OCI images. Code inside the microVM may use `sudo`, Docker, or FUSE. Those capabilities sound broad, but they exist inside the microVM; they do not grant access to the Vercel project or host. That distinction is the product's core value.

A session defaults to five minutes. As of August 2026, Hobby permits up to 45 minutes, while Pro and Enterprise permit up to 24 hours. Work that lasts longer should not merely maximize the timeout. Divide retryable work into stages and preserve state in snapshots, persistent sandboxes, or independent storage.

## Isolation does not finish the security configuration

Each sandbox has its own filesystem and network and does not automatically inherit Function environment variables, database connections, or cloud resources. That limits blast radius, but it does not decide which outbound connections are legitimate.

Network policies currently support `allow-all`, `deny-all`, and custom rules. The documented default is `allow-all`, so “inside a microVM” does not mean the exfiltration path is closed. A practical pattern is to allow package installation, then use `update()` to tighten egress to an API allowlist. When code must call an authenticated API, use egress credential brokering to inject headers outside the sandbox instead of placing secrets in environment variables.

Three other boundaries remain necessary: cap timeouts and vCPUs to control runaway consumption, avoid copying production datasets wholesale into the workspace, and validate outputs as untrusted data. A sandbox limits damage from arbitrary code execution. It does not solve prompt injection or decide whether generated SQL respects business rules.

## What survives after stop?

There are two lifecycle clocks. A session determines how long one VM boot runs; persistence determines whether files survive across sessions. A snapshot records the filesystem and installed packages, then stops the source sandbox. Snapshots expire after 30 days by default, with configurable retention. A useful pattern is snapshotting a prepared `node_modules` tree so every job does not repeat installation.

Persistent sandboxes, introduced in March 2026, remain beta. A named sandbox becomes a durable identity: stopping automatically snapshots its filesystem, and retrieving its name restores state into a new session. This removes manual snapshot orchestration, but beta persistence is not a database. Data that must be shared across sandboxes, backed up independently, or retained long-term belongs in external storage.

## Pricing has separate CPU and memory clocks

[Vercel's public pricing](https://vercel.com/pricing) meters Sandbox through Active CPU, provisioned memory, creations, network, and snapshot storage. As of August 2026, starting rates are $0.128 per vCPU-hour and $0.0212 per GB-hour of memory; included allowances and regional rates vary by plan.

Active CPU means waiting for an LLM or API does not incur CPU charges. It does not mean the entire sandbox is free while waiting: provisioned memory continues to accrue over session wall-clock time. This strongly favors I/O-heavy agents. A compiler or data job that holds substantial memory and saturates CPU needs an estimate based on its measured active ratio—not an unqualified application of Vercel's “up to 95%” savings claim.

## Choosing: ecosystem integration is the dividing line

| Option | Consider it first when | Main trade-off |
|---|---|---|
| [Vercel Sandbox](https://vercel.com/sandbox) | Next.js or Vercel Functions already form the control plane, and OIDC, Observability, preview URLs, and Agent Stack integration matter | Active CPU favors I/O waits; platform and persistence abstractions are more tightly coupled |
| [E2B](https://e2b.dev/docs) | The sandbox API should be the center of a cloud- and framework-neutral agent runtime | More ecosystem-neutral; application deployment, identity, and observability need separate integration |
| [Modal Sandboxes](https://modal.com/docs/guide/sandboxes) | Sandboxes are part of a broader Python, GPU, or batch compute platform | Broad compute options; a short-script Vercel web app has a longer integration path |
| [Cloudflare Sandbox SDK](https://developers.cloudflare.com/sandbox/) | The control plane already runs in Workers and Durable Objects, alongside Cloudflare Containers | Close to Cloudflare's network; as of August 2026, new projects still face the 1.0-preview API choice |

The useful question is not “which microVM is safest?” but “who owns the control plane?” For an application already deployed to Vercel, `@vercel/sandbox` removes a separate identity, project mapping, and observability integration. If the agent must span clouds, schedule GPUs directly, or run on-premises, that convenience no longer determines the choice.

## Conclusion

Vercel Sandbox has a precise role: a trusted application on Vercel sends untrusted execution into an independent microVM. Its advantage is not inventing sandboxing. It connects OIDC, Fluid compute, Active CPU pricing, an SDK, network policy, snapshots, and Observability into one product path.

A concrete test for tonight: create a `deny-all` sandbox in a test project, run the minimal Node.js command, then attempt to read a test environment variable from the parent Function and reach an external domain. Confirm that neither is available before allowing the exact files, domains, and brokered credentials the workload needs. A security boundary should begin with denial, not convenience defaults.

## References

- [Vercel Sandbox documentation](https://vercel.com/docs/sandbox)
- [Vercel Sandboxes general availability announcement](https://vercel.com/changelog/vercel-sandboxes-ga)
- [Vercel Sandbox product page and specifications](https://vercel.com/sandbox)
- [Vercel public pricing](https://vercel.com/pricing)
- [Vercel: Security boundaries in agentic architectures](https://vercel.com/blog/security-boundaries-in-agentic-architectures)
- [Vercel Sandbox snapshots](https://vercel.com/docs/vercel-sandbox/concepts/snapshots)
- [Vercel Sandbox automatic persistence beta](https://vercel.com/changelog/vercel-sandbox-persistent-sandboxes-beta)
- [Vercel: How Fluid compute was built](https://vercel.com/blog/fluid-how-we-built-serverless-servers)
- [E2B documentation](https://e2b.dev/docs)
- [Modal Sandboxes documentation](https://modal.com/docs/guide/sandboxes)
- [Cloudflare Sandbox SDK documentation](https://developers.cloudflare.com/sandbox/)
