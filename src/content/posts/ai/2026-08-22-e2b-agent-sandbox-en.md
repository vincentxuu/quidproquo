---
title: "E2B Agent Sandbox: Put Model-Generated Code in a Resumable microVM"
date: 2026-08-22
category: ai
type: deep-dive
tags: [e2b, sandbox, ai-agent, code-execution, security]
lang: en
tldr: "E2B combines Templates, Firecracker microVMs, and process, file, and network APIs into an agent execution layer. Its real selection advantage is preserving memory and processes across pause and resume, not merely providing another code interpreter."
description: "A product-architecture guide to E2B: how Templates prepare environments, how Sandboxes execute untrusted code, how pause/resume and network policy shape long-running tasks, and the tradeoffs against Modal, Daytona, Runloop, Vercel Sandbox, and Cloudflare Sandboxes."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-e2b-agent-sandbox)

[E2B](https://github.com/e2b-dev/e2b) is a cloud Linux execution environment for AI agents. The model decides what to do next; E2B executes shell commands, file operations, Git actions, and code inside an isolated sandbox, keeping the model away from the application host.

It is not another model framework, and it does not manage prompts or tool loops. Its role is closer to “a computer for the agent”: the SDK creates a microVM prepared from a Template, and the application controls it through commands, files, PTY, and network APIs. The agent loop stays in your existing service while dangerous side effects move behind a separate execution boundary.

As of 2026-08, E2B is more than a fast disposable machine. A Sandbox can pause while preserving its filesystem, memory, and running processes, then resume from the same state. That makes it suitable for coding agents spanning several conversational turns rather than environments rebuilt on every turn.

## Architecture: a Template is the image; a Sandbox is one execution

E2B's product model has two central objects. A `Template` defines the base image, packages, environment variables, files, and startup process; expensive setup happens at build time, and each `Sandbox` starts from that prepared state. The official docs describe a Sandbox as an on-demand Linux VM, while the underlying runtime uses [Firecracker microVMs](https://github.com/e2b-dev/infra).

```text
agent loop
    │  E2B SDK
    ▼
Sandbox control plane
    ├── Template / snapshot
    ├── commands / PTY / Git
    ├── files / public URL
    └── egress policy
             │
             ▼
      Firecracker microVM
```

The important design choice is separating environment preparation from environment use. Do not make every task run `apt install` and `npm install`; bake stable dependencies into a Template, then inject only the repository and task-scoped credentials at runtime. The Template is a repeatable starting point. The Sandbox owns per-user or per-task state.

## Minimal usage: create, execute, clean up

The shortest Python path needs only an API key and the SDK. `commands.run` returns stdout, stderr, and an exit code, enough to implement an agent's first shell tool.

```python
from e2b import Sandbox

with Sandbox.create(
    timeout=300,
    allow_internet_access=False,
) as sandbox:
    sandbox.files.write("/home/user/task.py", "print(sum(range(10)))")
    result = sandbox.commands.run("python /home/user/task.py")
    if result.exit_code != 0:
        raise RuntimeError(result.stderr)
    print(result.stdout)
```

The default user is `user` and the working directory is `/home/user`, rather than Docker's common root default. That is a sensible baseline, not a complete security policy: an agent can still read anything you place in the sandbox, exhaust quotas, or exfiltrate data when outbound networking is open.

## Lifecycle: long tasks are where E2B earns its place

The [lifecycle documentation](https://docs.e2b.dev/sandbox/persistence) defines Running, Paused, Snapshotting, and Killed states. By default, `pause()` saves both the filesystem and memory, including running processes and loaded variables; `connect()` restores the same sandbox. Paused sandboxes stop accruing compute charges and, according to the current documentation, are retained indefinitely until explicitly deleted.

This is practical for coding agents: pause while waiting for user input, then continue without cloning the repository again, rebuilding caches, or restarting a language server. The cost is that lifecycle ownership moves into your application. Persist the sandbox ID with its tenant and session, and explicitly call `kill()` at completion. E2B reports roughly four seconds to pause each GiB of memory and about one second to resume, so memory-heavy workloads cannot treat pause as free.

Plans also impose a hard boundary. [Billing & limits](https://docs.e2b.dev/billing) lists a one-hour continuous runtime on Hobby and 24 hours on Pro; pausing and resuming resets that window. This fits agents with natural waiting or checkpoint points, not a single process that must run continuously for days.

## Network and credentials: an isolated VM is not a finished security model

An E2B sandbox has [outbound internet access by default](https://docs.e2b.dev/network/internet-access). Production policy should start in the opposite direction: disable networking, then allowlist only package registries, Git hosts, and required APIs. The platform also supports outbound allow/deny rules and a host-side SOCKS5 proxy. Host-side enforcement is stronger than a firewall inside the guest because sandbox code cannot inspect or bypass the proxy configuration.

Credentials need the same least-privilege treatment. Give each sandbox only short-lived, revocable tokens required by that task; never copy an entire `.env` file into it. Bound input and output sizes, command timeouts, CPU, memory, disk, concurrency, and spend. A Sandbox provides execution isolation. It does not decide whether an agent action is authorized by your business rules.

## Choosing among products in the same layer

All of these products can run untrusted code. The useful distinction is which layer each one intends to own:

| Primary requirement | Start with | Selection rationale |
|---|---|---|
| Agent-native SDK, full-memory pause/resume, self-hosting option | E2B | A small object model with long-task state as a first-class feature; the [main project is Apache-2.0](https://github.com/e2b-dev/e2b) and documents AWS and GCP self-hosting paths |
| GPU inference or training on the same platform | Modal | Its [Sandbox API accepts GPU reservations](https://modal.com/docs/sdk/js/latest/Sandbox), while E2B centers CPU agent computers |
| Durable development workspaces and several VM/container classes | Daytona | [Filesystems persist by default](https://www.daytona.io/docs/en/persistence/), and VM classes add hot snapshots and forks |
| Coding-agent evaluation, Blueprints, and Devbox workflows | Runloop | [Devbox](https://docs.runloop.ai/docs/devboxes/overview) centers repository and development-machine semantics; snapshots currently preserve disk only |
| An application already on Vercel with TypeScript integration | Vercel Sandbox | The [official SDK](https://vercel.com/docs/sandbox) shortens integration with Vercel OIDC and preview workflows |
| A control plane already on Workers with Durable Objects or R2 | Cloudflare Sandboxes | The [Sandbox SDK](https://developers.cloudflare.com/sandbox/) is built around Workers + Containers; the stable version loses local state after idle restart, so durable data belongs in object storage |

This is not a feature scorecard. If you only execute Python once and return a result, all six may work. Prototype one real task and measure creation time, dependency setup, pause/resume, failure cleanup, and cost per task. Pick the lifecycle that matches your product.

## Interpreting adoption numbers

In its 2025-07 [Series A announcement](https://changelog.e2b.dev/blog/series-a), E2B reported a $21 million round and $32 million in total funding.

The same announcement said 88% of the Fortune 100 had signed up and that hundreds of millions of sandboxes had been started across more than half of the Fortune 500. These are company-reported numbers, and “signed up” does not mean paid or deployed in production. They demonstrate market attention, not reliability for your workload.

The open-source signal is easier to inspect. At verification time, the [E2B GitHub repository](https://github.com/e2b-dev/e2b) had roughly 13,500 stars, and both SDK and infrastructure code were available for review. That lowers review and self-hosting barriers; it does not eliminate managed-service lock-in. Deep use of Templates, lifecycle, and network policy still makes a migration a control-layer rewrite.

## Fit, non-fit, and the final decision

E2B fits products where agents clone repositories, run tests, produce artifacts, and work across multiple interactive turns. It also fits teams that want a credible self-hosting path without first building a microVM control plane.

Three cases are poor fits: workloads dominated by GPUs, tasks that cannot be interrupted beyond the plan's continuous-runtime limit, and sub-second pure-function jobs. The first two call for GPU/batch infrastructure or persistent VMs. The last is simpler on an ordinary serverless function.

The real question is not whether an agent needs a sandbox. It is **whether the agent's state is worth preserving**. If every action is replayable, choose the least expensive disposable runtime. If repositories, processes, caches, and interactive context must survive across turns, E2B's pause/resume becomes an architectural advantage rather than a convenience.

## References

- [E2B GitHub repository](https://github.com/e2b-dev/e2b) (SDK, license, self-hosting support, and minimal usage)
- [E2B Documentation](https://docs.e2b.dev/) (Sandbox and Template product model)
- [Sandbox persistence](https://docs.e2b.dev/sandbox/persistence) (state transitions, memory preservation, performance, and retention limits)
- [Internet access](https://docs.e2b.dev/network/internet-access) (default outbound access and allow/deny rules)
- [Billing & limits](https://docs.e2b.dev/billing) (plans, continuous runtime, resources, and concurrency limits)
- [We Raised $21M to Give Fortune 100 Cloud for AI Agents](https://changelog.e2b.dev/blog/series-a) (company-reported funding and adoption figures)
- [Modal Sandbox JavaScript SDK](https://modal.com/docs/sdk/js/latest/Sandbox) (GPU, resource, timeout, and volume interfaces)
- [Daytona Persistence](https://www.daytona.io/docs/en/persistence/) (persistence behavior, snapshots, and forks across container, VM, and GPU classes)
- [Runloop Devbox Overview](https://docs.runloop.ai/docs/devboxes/overview) and [Devbox Snapshots](https://docs.runloop.ai/docs/devboxes/snapshots) (Devbox positioning and disk snapshots)
- [Vercel Sandbox](https://vercel.com/docs/sandbox) (runtime, SDK, OIDC, and snapshots)
- [Cloudflare Sandbox SDK](https://developers.cloudflare.com/sandbox/) and [Sandbox lifecycle](https://developers.cloudflare.com/sandbox/concepts/sandboxes/) (Workers/Containers architecture and stable-version state behavior)
