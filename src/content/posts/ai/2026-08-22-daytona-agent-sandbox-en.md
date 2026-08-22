---
title: "Daytona Agent Sandbox: A Forkable Computer for Every Agent"
date: 2026-08-22
category: ai
tags: [daytona, sandbox, ai-agent, agent-infrastructure, code-execution, security]
lang: en
type: deep-dive
tldr: "Daytona treats a sandbox as a long-lived computer that can start, pause, snapshot, and fork. It raised a $24 million Series A in 2026, while a Laude Institute case study reports 37,000 sandboxes in one week. It fits parallel evaluations and coding agents, but its core open-source repository is no longer maintained."
description: "An architecture and selection-focused guide to Daytona agent sandboxes: control and compute planes, snapshots, forks, secret injection, network boundaries, minimal SDK usage, pricing, and the shift away from an open-source core."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-daytona-agent-sandbox)

[Daytona](https://www.daytona.io/) does not wrap a Python snippet in a disposable function. It gives an agent a computer where it can install packages, retain files, run services, pause, clone a branch, and continue. That distinction defines its best workloads: coding agents, long-running research, reinforcement-learning rollouts, and evaluations that need thousands of identical starting points.

The market is moving in that direction. In February 2026, Daytona announced a [$24 million Series A led by FirstMark Capital](https://www.daytona.io/dotfiles/daytona-raises-24m-series-a-to-give-every-agent-a-computer). Its Laude Institute case study says [Terminal-Bench created 37,000 sandboxes in one week](https://www.daytona.io/customers/laude), with 100 times the experiment throughput of its previous local Docker workflow. This is a vendor customer story, not an independent benchmark, but it demonstrates a real workload with high concurrency, long runtimes, and heterogeneous environments.

## Design philosophy: a sandbox is a stateful computer

Traditional serverless assumes stateless, brief, largely repeatable work. Agents behave differently: they install packages, modify repositories, start background services, and may split into two approaches halfway through a task. Daytona therefore defines its primitive as a “composable computer,” not a request handler.

Three operations make that abstraction useful:

- **Snapshots** establish a reproducible starting point. Container snapshots retain the filesystem; VM snapshots can retain memory as well. Any number of environments can fan out from one snapshot. The [snapshot documentation](https://www.daytona.io/docs/en/snapshots/) also offers warm pools that keep pre-created environments ready to claim.
- **Forks** copy current state. An agent can split at a decision point, modify and test each path, then keep a successful branch instead of cloning and installing dependencies again.
- **Persistence** keeps background processes and connections alive across API calls. This is not a one-call code interpreter.

Daytona's speed claims need context. The public repository says code reaches execution in under 90 ms, but product latency depends on image size, dependencies, region, and warm-pool hits. Benchmark p50 and p95 creation latency with your own snapshot before putting a marketing number into an SLA.

## Architecture: separate control from execution

The [public architecture](https://github.com/daytonaio/daytona/blob/main/README.md) has three planes:

```text
Agent / SDK / CLI
       │
       ▼
Interface plane ── API, SDKs, toolbox
       │
       ▼
Control plane   ── create, stop, fork, snapshot, quotas
       │
       ▼
Compute plane   ── containers / Linux VMs / Windows / GPUs
```

The interface plane gives agents typed process, filesystem, Git, LSP, PTY, and preview operations rather than forcing everything through SSH strings. The control plane owns lifecycle and scheduling; the compute plane executes untrusted code. The separation also supports BYOC: the platform remains the control interface while compute runs in a customer's environment.

Snapshots sit at the intersection of performance and reproducibility. Bake the operating system, runtimes, and common packages once, then create many sandboxes from that snapshot. Do not make every agent begin with `apt install`. Add a warm pool only when tail latency warrants paying for continuously ready capacity.

## Minimal usage

The smallest Python SDK flow creates, executes, and cleans up:

```python
from daytona import Daytona, CreateSandboxFromSnapshotParams

daytona = Daytona()  # reads DAYTONA_API_KEY
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(
        snapshot="my-agent-image",
        auto_stop_interval=15,
        auto_delete_interval=120,
    )
)

result = sandbox.process.code_run("print(sum(range(10)))")
print(result.result)
sandbox.delete()
```

Production code also needs a task TTL and cleanup in `finally`, outbound network restrictions, and export of results and traces into your observability stack. Creation capacity is finite: [the limits documentation](https://www.daytona.io/docs/en/limits/) caps Tier 1 at 300 sandbox creations per minute, increases limits through verification and account funding, and reserves custom limits for enterprise agreements.

## Security boundary: isolation is not policy

A sandbox separates an agent from the host. It does not automatically stop exfiltration. If the environment has unrestricted egress and receives a plaintext API key in an environment variable, malicious code can still send it away.

Daytona's more valuable security mechanism is [Secrets](https://www.daytona.io/docs/en/secrets/). The sandbox receives an opaque placeholder. An egress proxy replaces it with plaintext only when an HTTPS request targets an allowed host, and scrubs the secret from responses. The boundary is explicit: substitution works only in HTTPS headers, not request bodies, query strings, or plaintext HTTP; omitting the host allowlist also makes a secret unrestricted. Pair secrets with a domain or CIDR allowlist, or block network access entirely.

Containers and VMs also carry different risk. Containers suit inexpensive, dense execution of more trusted work. For arbitrary user or model-generated code, evaluate a VM with its own kernel first. Preview URLs, SSH/VNC, and Docker-in-Docker all widen the attack surface; leave them disabled unless required.

## Choosing among sandbox providers

Daytona is not unique because it can run a shell—E2B, Modal, Runloop, and Vercel Sandbox can do that. Its distinction is centering state operations for long-lived computers: snapshot, fork, pause, archive, VM, Windows, GPU, and BYOC share one model. That abstraction fits coding agents that explore in parallel and retain workspaces.

If the job only executes a short Python snippet, a narrower code interpreter reduces integration work. A team already running inference and GPUs on Modal may value one compute platform. A Vercel application that needs brief sandboxes beside an existing deployment may prefer Vercel's billing and identity integration. Compare providers with your Docker image and measure creation latency, long-task failure rate, snapshot restore time, and cost per successful task—not homepage milliseconds.

Pricing is decomposable. The [pricing page checked on 2026-08-22](https://www.daytona.io/pricing) lists $0.0504 per vCPU-hour and $0.0162 per GiB-hour of memory, billed per second; storage is separately charged after the first 5 GiB. A 2-vCPU, 4-GiB environment therefore costs about $0.1656 per hour before storage. Warm pools, retained disks, and retries change the real bill, so cost per completed task is the useful metric.

## Fit, non-fit, and the largest limitation

**Daytona fits** when tasks run for tens of minutes or days; agents modify files, launch services, or branch; evaluations fan out from identical snapshots; a team wants containers, VMs, GPUs, and Windows under one API; or an enterprise needs SSO, audit logs, and BYOC.

**Daytona does not fit** when work is a fixed, brief function; a team already operates mature Kubernetes sandboxing; policy forbids a third-party control plane; or a continuously maintained, fully open-source self-hosted control plane is mandatory.

That last condition reflects an easy-to-miss 2026 change. Daytona's [public core repository](https://github.com/daytonaio/daytona) states that it stopped receiving maintenance in June 2026 and core development moved to a private codebase. Existing code remains under its license, but without updates, fixes, or support. This does not make the managed service unusable. It means “choose Daytona Cloud” and “self-host the Daytona open-source project” are now materially different risk decisions. If portability is mandatory, test image export, data retrieval, API dependencies, and BYOC failure ownership before signing.

Daytona's strongest idea is matching infrastructure to the real shape of agent work: long-running, stateful, error-prone, and branching. Its cost follows from the same choice: state, scheduling, and security policy move onto a fast-changing platform. It is not a replacement for general cloud infrastructure. It is a layer worth buying when “a disposable computer for every agent” becomes the bottleneck.

## References

- [Daytona Raises $24M Series A to Give Every Agent a Computer](https://www.daytona.io/dotfiles/daytona-raises-24m-series-a-to-give-every-agent-a-computer)
- [Daytona GitHub repository and architecture](https://github.com/daytonaio/daytona)
- [Daytona Snapshots documentation](https://www.daytona.io/docs/en/snapshots/)
- [Daytona Secrets documentation](https://www.daytona.io/docs/en/secrets/)
- [Daytona Limits documentation](https://www.daytona.io/docs/en/limits/)
- [Daytona pricing](https://www.daytona.io/pricing)
- [Laude Institute customer story](https://www.daytona.io/customers/laude)
