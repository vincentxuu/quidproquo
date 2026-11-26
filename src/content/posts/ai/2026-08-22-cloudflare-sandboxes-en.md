---
title: "Cloudflare Sandboxes Deep Dive: How Workers, Durable Objects, and Containers Form an Agent Runtime"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cloudflare-sandboxes, ai-agent, cloudflare-workers, durable-objects, containers, sandbox]
lang: en
tldr: "Cloudflare Sandboxes uses a Worker as the entry point, a named Durable Object as the control plane, and a Container inside an isolated VM as the execution plane. It fits Cloudflare-native fleets of ephemeral Linux workspaces, but persistence, security boundaries, and three layers of billing remain your responsibility."
description: "A practical breakdown of Cloudflare Sandbox SDK architecture, lifecycle, minimal usage, pricing, security model, limitations, and its selection boundary versus managed sandbox services."
series:
  name: "Cloudflare AI Stack"
  order: 10
additionalSeries:
  - name: "Sandbox Series"
    order: 15
draft: false
---

> :globe: [中文版](/posts/ai/2026-08-22-cloudflare-sandboxes)

[Cloudflare Sandboxes](https://developers.cloudflare.com/sandbox/) is an SDK for controlling isolated Linux environments from a Worker. It does not put a shell inside a Worker isolate, nor is it a separate VM API detached from Cloudflare. A Worker receives the request, a Durable Object maintains a stable identity and routes it, and a Container inside an isolated VM executes the untrusted code.

That distinction matters. An agent that must clone a repository, install packages, run tests, or start a development server often outgrows an isolate, while permanently running VMs waste idle capacity. Sandboxes takes the middle path: a full Linux toolchain, reconnection by name, and automatic sleep. As of August 2026, Sandboxes and the underlying Containers reached [general availability in April](https://blog.cloudflare.com/sandbox-ga/). Cloudflare publicly names Figma Make as an adoption example rather than claiming an unverifiable customer count.

## Since September 2026: Sandbox SDK 1.0 hands control back to your Durable Object

The code and lifecycle description below follow the Sandbox SDK 0.x model: `@cloudflare/sandbox` ships a ready-made `Sandbox` class, and `getSandbox()` returns a handle to it. [Sandbox SDK 1.0](https://developers.cloudflare.com/changelog/post/2026-09-30-sandbox-sdk-1-0/), released on 2026-09-30, changes that layer: a Durable Object class you write controls the sandbox directly through `this.ctx.container`, on top of the Containers `durable_object` scheduling policy (public beta).

```ts
import { Files } from "@cloudflare/sandbox";
import { DurableObject } from "cloudflare:workers";

export class MySandbox extends DurableObject<Env> {
  async run(script: string) {
    const container = this.ctx.container!;
    if (!container.running) {
      // Your code chooses the image, size, and network access.
      container.start({
        image: container.images.sandbox,
        instance: "lite",
        enableInternet: false,
      });
    }
    await new Files(container).writeFile("/tmp/task.sh", script);
    const proc = await container.exec(["sh", "/tmp/task.sh"]);
    return proc.output();
  }
}
```

In practice: every `start()` can pick its own image and instance size; a deploy does not restart running sandboxes; files can be saved as a snapshot (public beta) and started from later; and when to stop, which methods to expose, and how outbound requests get credentials all live in your own class. In an independent benchmark cited by the migration docs, starting 100 sandboxes at once cut the median time from creation to running a command from 4.0 seconds to 648 milliseconds.

1.0 also splits sandboxes into two environments: Containers when the job needs full Linux, and [Dynamic Workers](https://developers.cloudflare.com/sandbox/get-started/dynamic-workers/) when it only needs to run JavaScript, Python, or WebAssembly in an isolated Worker created at runtime, without a VM.

For existing 0.x applications: 0.x receives only bug and security fixes until 2026-12-31, with no new features, and deployed applications keep running afterward. The official [Migrate from Sandbox SDK 0.x](https://developers.cloudflare.com/sandbox/sdk/migrate/) guide describes a one-way switch to your own Durable Object class. The three-layer architecture below still holds in 1.0; the middle layer just becomes your class instead of a class built into the SDK.

## The three layers are the product's core tradeoff

The official 0.x [architecture documentation](https://developers.cloudflare.com/sandbox/sdk/concepts/architecture/) describes a three-layer request path:

```text
User / agent
    │ HTTPS
    ▼
Cloudflare Worker          Authentication, authorization, application logic
    │ Durable Object stub
    ▼
Sandbox Durable Object     Sandbox ID, routing, lifecycle
    │ HTTP or RPC
    ▼
Container in isolated VM   Shell, files, processes, network services
```

The Worker is where authentication, rate limits, and tenant policy belong. `getSandbox(namespace, id)` does not return a newly allocated machine; it returns an interface to a named Durable Object. The same ID routes to the same location. That Durable Object owns the Container lifecycle, while the Container performs `exec()`, file operations, and background processes.

This design connects naturally to Cloudflare HTTP handling, WebSockets, Workers bindings, logs, and network services. The cost is equally direct: you are not buying only “sandbox seconds.” You operate three components—Worker, Durable Object, and Container—with separate limits and charges.

The default transport turns every SDK operation into an HTTP subrequest. For a 0.x workflow with many reads and writes, the [platform limits documentation](https://developers.cloudflare.com/sandbox/sdk/platform/limits/) recommends `SANDBOX_TRANSPORT=rpc`, which multiplexes operations over one persistent connection. A Paid-plan Worker request is limited to 1,000 subrequests, so transport choice is an architectural concern rather than a late optimization.

## A minimal sandbox (0.x)

The official 0.x starter generates a Worker, Container configuration, and Dockerfile. The essential application code is short:

```ts
import { getSandbox, type Sandbox } from "@cloudflare/sandbox";

export { Sandbox } from "@cloudflare/sandbox";

interface Env {
  Sandbox: DurableObjectNamespace<Sandbox>;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const userId = await authenticate(request);
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const sandbox = getSandbox(env.Sandbox, `user-${userId}`, {
      sleepAfter: "10m",
    });
    const result = await sandbox.exec('python3 -c "print(2 + 2)"');

    return Response.json({
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
    });
  },
};
```

`wrangler.jsonc` must also declare the Container image, instance type, maximum instance count, Durable Object binding, and SQLite migration. The first deployment builds the Docker image, pushes it to Cloudflare's registry, and deploys the Worker. The official 0.x [getting-started guide](https://developers.cloudflare.com/sandbox/sdk/get-started/) warns that an available Worker does not necessarily mean that the Container image has finished provisioning.

The example deliberately derives its sandbox ID from an authenticated `userId`. An ID is a routing key, not a password. Accepting an arbitrary user-supplied ID turns tenant isolation into a string-guessing exercise.

## Lifecycle: the name persists; container contents do not

“Stateful” is the easiest word to misread here. According to the 0.x [lifecycle documentation](https://developers.cloudflare.com/sandbox/sdk/concepts/sandboxes/), the first operation against an ID creates its environment. While active, files, background processes, shell sessions, and interpreter contexts remain available. After 10 minutes of inactivity by default, the Container stops. A later request starts a clean Container; the previous files and processes are gone.

The Durable Object identity and routing are persistent, not the Container filesystem. A reliable agent workflow stores source repositories, artifacts, and checkpoints in Git, R2, or another durable store, then checks and reconstructs its workspace at startup. Short tasks should call `destroy()` in `finally`. Reserve `keepAlive` for genuinely long-running work, and disable it when that work ends. Never equate “the same sandbox ID” with “the same disk forever.”

The 1.0 [lifetime rules](https://developers.cloudflare.com/sandbox/concepts/lifetime/) are more explicit. The Durable Object counts as active while it handles a request, runs an alarm, streams a response, or holds an accepted WebSocket. Once it goes idle, the instance keeps running for the time set with `setInactivityTimeout()` (up to 6 hours), or stops shortly after if no timeout is set. A build or test running inside the container does not count as activity, so long jobs need an alarm that fires more often than the timeout. An idle instance that has not stopped is still billed for memory and disk. To keep files across instances, save a snapshot before it stops (kept for 30 days from creation or the most recent restore, without memory or processes), or put the data in a mounted R2 bucket.

The first request also determines geographic placement, and later requests continue to route there. A single ID gives consistency at the cost of possible cross-continent latency. If a product truly needs multiple regions, make region part of the naming strategy instead of expecting a stateful execution environment to migrate automatically.

## The security boundary is narrower than “runs untrusted code”

The official 0.x [security model](https://developers.cloudflare.com/sandbox/sdk/concepts/security/) says each sandbox runs in its own VM, isolating filesystems, processes, network stacks, and resource quotas. Every session inside one sandbox, however, shares files and processes. Sessions are therefore not a multi-tenant isolation boundary; use a separate sandbox for each user or trust domain.

VM isolation also does not provide application authorization, input validation, or rate limiting. Interpolating user input into a shell command still creates command injection. Anyone with a preview or quick-tunnel URL can reach it, so sensitive services still need application authentication. In practice: authenticate in the Worker, derive IDs from trusted claims, constrain commands and resources, and destroy temporary environments when work completes.

Credentials deserve special treatment. If the Container does not need to read a secret, use an outbound handler: route the request through the Worker, inject the real credential at the network layer, then forward it to GitHub or a model API. This resists an agent deliberately reading a long-lived token better than an environment variable. Inject an environment variable only when the process genuinely needs the secret, preferably with a short lifetime.

## Pricing and capacity require three ledgers

Sandbox SDK has no separate package price. Its [pricing page](https://developers.cloudflare.com/sandbox/sdk/platform/pricing/) explicitly lists the underlying Containers plus Workers, Durable Objects, and optional Workers Logs charges. Containers are metered in 10 ms increments. CPU is charged for active usage, while memory and disk are charged from provisioned capacity.

Under the [Containers prices](https://developers.cloudflare.com/containers/platform/pricing/), the $5-per-month Workers Paid plan includes 25 GiB-hours of memory, 375 vCPU-minutes, and 200 GB-hours of disk. Additional CPU costs $0.000020 per vCPU-second. The smallest `lite` instance provides 1/16 vCPU, 256 MiB of memory, and 2 GB of disk; the largest public `standard-4` provides 4 vCPU, 12 GiB, and 20 GB. Egress varies by region, with Taiwan in the $0.05-per-GB tier.

The GA announcement says the standard plan supports 15,000 concurrent `lite` instances, 6,000 `basic` instances, and more than 1,000 larger instances. Those are published platform capacity limits, not a promise that every new account receives arbitrary throughput. Estimate with your own startup frequency, active CPU, provisioned memory, idle duration, and egress, then add Worker and Durable Object requests in a load test.

## Compared with other sandboxes, the control plane is the difference

E2B, Modal, Daytona, Runloop, and Vercel Sandbox also offer isolated execution, but emphasize different abstractions around templates, workspaces, GPUs, development environments, or platform integration. There is no consistent public workload benchmark that justifies a speed ranking. Choose Cloudflare because the architecture fits, not because of the word “edge.”

If requests already enter through Workers and the product needs named Durable Object coordination, Cloudflare networking, bindings, and a large fleet of sleeping-and-waking Linux workspaces, Sandboxes avoids introducing another external control plane. If the requirement is GPU compute, explicit cloud portability, permanently running hosts, persistent block storage, or a vendor-managed catalog and team workspace, compare specialist platforms or use an existing Container/Kubernetes stack first.

The real selection question is whether the team wants to operate Workers, Durable Objects, and Containers as one distributed system. If it does—and the product already lives on Cloudflare—the composition is coherent. If the only requirement is one API that accepts code and returns output, the three-layer lifecycle and billing model may be unnecessary complexity.

## Overall

Cloudflare Sandboxes does not invent a new isolation primitive. Its advantage is connecting a complete Linux environment to Cloudflare's existing application control plane. The Worker enforces policy, the Durable Object owns identity and lifecycle, and the Container in an isolated VM handles risky execution. Once those boundaries are explicit, it becomes clear which state disappears, which secrets must stay outside the Container, and which three bills grow together.

Before adopting it, run one real task end to end: derive a sandbox from a tenant ID, clone a repository, install dependencies, run tests, upload artifacts, let it sleep, rebuild it, then measure cold-start latency and total cost. If that flow holds up, Sandboxes is an agent runtime. Otherwise, it is only an attractive `exec()` demo.

## Update Log

- 2026-11-23: Added Sandbox SDK 1.0, released on 2026-09-30 (your own Durable Object controls the sandbox through `ctx.container`, snapshots, the Dynamic Workers environment, and 0.x support until 2026-12-31), and marked the original example as 0.x; added the 1.0 inactivity timeout (up to 6 hours) and snapshot rules; moved 0.x documentation links to the new `/sandbox/sdk/` paths.
- 2026-08-30: Added the post to Cloudflare AI Stack as the Sandbox SDK / agent code execution entry.

## References

- [Cloudflare Sandboxes](https://developers.cloudflare.com/sandbox/)
- [Cloudflare Changelog: Sandbox SDK 1.0](https://developers.cloudflare.com/changelog/post/2026-09-30-sandbox-sdk-1-0/)
- [Cloudflare Sandboxes: Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/)
- [Cloudflare Sandboxes: Migrate from Sandbox SDK 0.x](https://developers.cloudflare.com/sandbox/sdk/migrate/)
- [Cloudflare Sandbox SDK 0.x: Architecture](https://developers.cloudflare.com/sandbox/sdk/concepts/architecture/)
- [Cloudflare Sandboxes: Run a Linux command](https://developers.cloudflare.com/sandbox/get-started/)
- [Cloudflare Sandbox SDK 0.x: Sandbox lifecycle](https://developers.cloudflare.com/sandbox/sdk/concepts/sandboxes/)
- [Cloudflare Sandboxes: Security](https://developers.cloudflare.com/sandbox/concepts/security/)
- [Cloudflare Sandbox SDK 0.x: Pricing](https://developers.cloudflare.com/sandbox/sdk/platform/pricing/)
- [Cloudflare Sandbox SDK 0.x: Limits](https://developers.cloudflare.com/sandbox/sdk/platform/limits/)
- [Cloudflare Containers: Pricing](https://developers.cloudflare.com/containers/platform/pricing/)
- [Cloudflare Blog: Agents have their own computers with Sandboxes GA](https://blog.cloudflare.com/sandbox-ga/)
