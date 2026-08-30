---
title: "How to Choose an Execution Environment and Sandbox: From Namespace and gVisor to Firecracker, E2B, and Lambda MicroVMs"
date: 2026-08-30
category: tech
type: deep-dive
tags: [sandbox, firecracker, gvisor, docker, e2b, cloudflare, ai-agent]
lang: en
tldr: "A sandbox is not a single package but a spectrum—Namespace, cgroups, seccomp, gVisor, and Firecracker stacked by trust boundary; local OS sandboxes bound blast radius, cloud microVMs bound multi-tenancy, and the choice hinges on trust and ops cost."
description: "Using Anthropic sandbox-runtime, gVisor, Firecracker, nsjail, Hades, E2B, Daytona, Modal, Cloudflare, and AWS Lambda MicroVMs as examples, this guide breaks down the four pillars, isolation tiers, and trade-offs behind execution environments and sandbox design."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-execution-environment-sandbox-comparison)

Before letting a model run code for you, answer a more important question than model quality: where does the code run, what can it see, and whom can it touch. This post turns a long Q&A on sandboxes into a comparable spectrum, enriched with how major execution environments actually work today.

You will get three things: the four pillars and three build patterns of sandbox design, where each of [Anthropic sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime), [Firecracker](https://github.com/firecracker-microvm/firecracker), [gVisor](https://gvisor.dev/), [E2B](https://e2b.dev/), and [AWS Lambda MicroVMs](https://aws.amazon.com/lambda/lambda-microvms/) sits and what it trades off, and a decision tree you can use tonight.

## What a sandbox is: aligning on the term

A sandbox is not a package name. It is a set of techniques that confine untrusted code to a bounded place. The metaphor is literal: sand stays in the pit even when you make a mess; it does not dirty the living room.

Three core actions define a sandbox:

- **Isolation**: the program cannot see what it should not see
- **Restriction**: only the minimal permissions and resources are granted
- **Reset**: throw it away after use and return to a clean state

And four pillars define its design:

1. **Isolation tier**: determines hardness vs. cost (see the spectrum below)
2. **Access control and resource limits**: read-only mounts or Copy-on-Write for files, no-egress by default for network, CPU/memory/PID caps
3. **Deception and mimicry**: security sandboxes fake mouse trails, decoy documents, and time dilation to fool sandbox-aware malware
4. **Lifecycle**: boot from a base image → execute and trace → destroy on timeout or completion; ephemeral is the default

Use the four pillars to audit any vendor: whichever is missing must be compensated elsewhere.

## Tier 1: container defaults — Namespace, cgroups, seccomp

This is where most teams start, and where the most common misconception lives. Running `docker run python:3.12` already has isolation, but it is not a sandbox designed for untrusted code.

Four primitives, each owning one question:

- **Namespace → what can you see**: PID, Network, Mount, User, IPC, and UTS are isolated so the process thinks it is the only tenant. It cannot see host processes or interfaces.
- **cgroups → how much can you use**: caps CPU, memory, disk I/O, and process count. An infinite `while True: x.append("hello")` hits the limit and gets OOM-killed instead of taking down the host.
- **seccomp → what can you ask the kernel to do**: filters system calls, blocking dangerous ones like `reboot` or `mount`.
- **capabilities / AppArmor / SELinux → how much privilege you can escalate**: splits root into fine-grained capabilities and drops `SYS_ADMIN` by default.

```bash
# This has isolation
docker run python:3.12 python -c "print(1)"

# This is a sandbox for untrusted code
docker run --network none --memory 512m --cpus 1 \
  --cap-drop ALL --read-only --pids-limit 64 \
  --security-opt seccomp=default.json \
  python:3.12 python /work/task.py
```

**Philosophy**: soft isolation inside one kernel, best performance and fastest start. **vs. alternatives**: cheaper than [gVisor](https://gvisor.dev/) and [Firecracker](https://github.com/firecracker-microvm/firecracker), but a shared kernel means a kernel vulnerability can lead to container escape. **Good for**: internal trusted workloads, CI. **Not for**: running arbitrary user-uploaded code directly, or hardware-grade multi-tenant isolation. **Limitation**: the default `docker run` has almost no limits; you must tighten them explicitly for it to count as a sandbox.

## Tier 2: user-space kernel — gVisor

[gVisor](https://gvisor.dev/) is Google's open-source sandbox runtime. Written in Go, it interposes a user-space kernel (Sentry) plus a filesystem proxy (Gofer) between the application and the host kernel.

```
Normal container:  App → Linux Kernel
With gVisor:       App → gVisor (Sentry/Gofer) → Linux Kernel
```

- **Philosophy**: keep the container ecosystem, add interception on the syscall path. Every `open`, `exec`, and `socket` goes through Sentry first, never touching the host directly.
- **vs. alternatives**: much safer than plain containers, lighter than microVMs; but compatibility is not 100%—rare syscalls, ioctls, and `/proc` behaviors may differ. In practice 1–2% of long-tail tests hit differences. Workloads with many small file I/Os or frequent network calls see 10–30% extra latency.
- **Good for**: teams that want stronger multi-tenant isolation on existing [Docker](https://www.docker.com/) / Kubernetes without changing images, running common languages (Python, Node, Go).
- **Not for**: workloads deeply dependent on kernel internals, full GPU passthrough, or extreme I/O sensitivity.
- **How to use it**: attach `runsc` via a Kubernetes [RuntimeClass](https://kubernetes.io/docs/concepts/containers/runtime-class/):

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: gvisor
handler: runsc
---
apiVersion: v1
kind: Pod
metadata:
  name: untrusted-job
spec:
  runtimeClassName: gvisor
  containers:
  - name: worker
    image: python:3.12-slim
    resources:
      limits: { memory: "512Mi", cpu: "1" }
```

[GKE Sandbox](https://cloud.google.com/kubernetes-engine/docs/concepts/sandbox-pods) is the managed version of this path, and [Cloud Run](https://cloud.google.com/run) also runs on gVisor. On [EKS](https://aws.amazon.com/eks/) you can install `containerd-shim-runsc-v1` on nodes and use the same [RuntimeClass](https://kubernetes.io/docs/concepts/containers/runtime-class/), but you own versioning and [Karpenter](https://karpenter.sh/) image management.

## Tier 3: lightweight virtualization — Firecracker, Kata Containers, Cloud Hypervisor

When the trust boundary says "even if they break the kernel, they should not get out," you need hardware virtualization. Each workload gets its own minimal kernel, no kernel shared.

- **[Firecracker](https://github.com/firecracker-microvm/firecracker)**: AWS's microVM virtual machine monitor (VMM) for [Lambda](https://aws.amazon.com/lambda/) and [Fargate](https://aws.amazon.com/fargate/), backed by [KVM](https://www.linux-kvm.org/), millisecond boot, memory overhead as low as a few MB, powering over 15 trillion Lambda invocations per month. Minimal device model and snapshot-based fast resume.
- **[Kata Containers](https://katacontainers.io/)**: OCI-compliant lightweight VM containers—each Pod is a microVM. Docker UX with VM security guarantees, ideal for Kubernetes clusters that require hardware isolation.
- **[Cloud Hypervisor](https://github.com/cloud-hypervisor/cloud-hypervisor)**: a Rust-based modern VMM in the same space as Firecracker, focused on modularity and security.

**Philosophy**: trade hardware boundaries for the strongest isolation and near-100% Linux compatibility. **vs. alternatives**: slightly slower and more complex to operate than gVisor, but no longer limited by user-space kernel compatibility gaps. **Good for**: highly untrusted code, multi-tenant high-value data, compliance that explicitly requires VM isolation. **Limitation**: networking (tap/bridge), images (kernel + rootfs), lifecycle, and snapshots are yours to manage—unless you use a managed service.

[Lambda MicroVMs](https://aws.amazon.com/about-aws/whats-new/2026/06/aws-lambda-microvms/), launched on 2026-06-22, makes this tier managed: build an image from a Dockerfile, upload to S3, and get a Firecracker snapshot. Each user or job gets an isolated microVM with its own HTTPS endpoint (HTTP/2, gRPC, WebSocket), pausable and resumable within 8 hours with state and memory preserved. Teams get Hades-like properties without building a Firecracker scheduler.

## Container-free sandboxes: Anthropic sandbox-runtime, nsjail, bubblewrap

Not every sandbox needs a container. A recurring theme in the notes is "add a boundary directly around any process."

### Anthropic sandbox-runtime (ASRT)

[Anthropic sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime) (`@anthropic-ai/sandbox-runtime`, Apache-2.0, open-sourced 2025-10-20) is fully documented in [Claude Code](https://code.claude.com/docs/en/sandbox-environments) as "OS-level limits without requiring a container."

Its design is dual-track:

- **Filesystem uses deny-then-allow**: readable by default, then broad `denyRead: ["~/.ssh"]` rules, with `allowRead` taking precedence to re-open. Writes are allow-only, denied by default.
- **Network is forced through a proxy**: on Linux, the network namespace is removed from the bubblewrap container so there is physically no network; all traffic must go via Unix domain sockets (`socat` bridge) to external HTTP/SOCKS5 proxies; on macOS, a [Seatbelt](https://reverse.put.as/wp-content/uploads/2011/09/Apple-Sandbox-Guide-v1.0.pdf) profile only allows connections to the local proxy port; on Windows, a [Windows Filtering Platform](https://learn.microsoft.com/en-us/windows/win32/fwp/windows-filtering-platform-start-page) `ALE_AUTH_CONNECT` filter does the same.

The key insight: `HTTP_PROXY` environment variables are just guidance; the real boundary is OS-level filtering. Even if a tool clears the variable or ignores the proxy, Seatbelt / WFP / network namespace still blocks it. Inside [Claude Code](https://code.claude.com/docs/en/sandbox-environments), this cut permission prompts by about 84% in auto-allow mode.

### nsjail, bubblewrap, Isolate

- **[nsjail](https://github.com/google/nsjail)** (Google): bundles Namespace, cgroups, seccomp-bpf, capabilities, and chroot into a single CLI. Best for understanding how a sandbox is assembled; common in CTFs and code hosting.
- **[bubblewrap](https://github.com/containers/bubblewrap) (bwrap)**: the underlying tool for Linux desktop and CLI sandboxes; bind-mounts directories as read-only or writable, with seccomp filtering.
- **[Isolate](https://github.com/ioi/isolate)** (IOI): a high-performance code-execution sandbox in C++, also built on namespaces and seccomp.

This path is lightweight, fast, and composable—well suited as the local execution layer for coding agents that need to wrap bash calls in an auditable boundary without an image build pipeline.

## Cloud sandboxes for agents: E2B, Daytona, Modal, Vercel, Cloudflare

The notes split "local sandbox" from "cloud sandbox" precisely: the former asks "how big is the blast radius on your machine," the latter asks "how do you safely move execution to someone else's machine, without persisting credentials, with lifecycle managed, and results returned safely."

| Priority | Look at first | Why |
|---|---|---|
| Agent-native SDK, full memory pause/resume, self-hostable | [E2B](https://e2b.dev/) | Only two objects (Template + Sandbox), pause/resume preserves files, memory, and processes; Firecracker microVMs, self-hostable on [AWS](https://aws.amazon.com/) / [GCP](https://cloud.google.com/) |
| GPU inference or training on the same platform | [Modal](https://modal.com/) | [Sandbox API can request GPUs](https://modal.com/docs/guide/sandbox) (T4 to H100), sandboxes run on gVisor |
| Long-lived dev workspaces, multiple VM/container flavors, snapshots | [Daytona](https://www.daytona.io/) | Filesystem persistence by default, hot snapshots, forks, multiple runtime classes |
| Evaluation, Blueprint, and Devbox workflows | [Runloop](https://docs.runloop.ai/) | [Devbox](https://docs.runloop.ai/docs/devboxes/overview) centers on repositories, snapshots, and dev-machine semantics |
| Already on Vercel, TypeScript-heavy | [Vercel Sandbox](https://vercel.com/docs/sandbox) | Shortest path with Vercel [OIDC](https://vercel.com/docs/sandbox) and preview workflows, GA 2026-01-30 |
| Control plane already on Workers, want Durable Objects / R2 | [Cloudflare Sandboxes](https://developers.cloudflare.com/sandbox/) | Built directly on [Workers](https://workers.cloudflare.com/) + [Containers](https://developers.cloudflare.com/containers/), credentials injected via proxy so the sandbox never holds live keys |
| No ops and VM-grade isolation with 8-hour state retention | [AWS Lambda MicroVMs](https://aws.amazon.com/lambda/lambda-microvms/) | Managed Firecracker, no shared kernel, snapshot resume, launched 2026-06-22 |

Two engineering details to avoid pitfalls:

- **Pause and billing**: [E2B's pause](https://e2b.dev/docs/sandbox/persistence) preserves memory and processes and does not bill for execution time while paused, but pausing 1 GiB takes about 4 seconds; do not treat it as zero-cost for large-memory workloads. Continuous execution caps are 1 hour (Hobby) and 24 hours (Pro); resume resets the clock.
- **Credential boundary**: baking a full `.env` into an image is the most common mistake. Give each sandbox only a short-lived, revocable token, or use a proxy-injection pattern like [Cloudflare's credential proxy](https://developers.cloudflare.com/sandbox/concepts/security/) where the [Worker](https://workers.cloudflare.com/) injects secrets at request time.

## Case study: how xAI Hades stacks the layers

The field probe of [Hades](https://x.ai/) in the notes is a strong reference because it is not theory but "what a platform for running arbitrary agent code looks like."

Layers:

```
Kubernetes cluster (hades-openbar)
  └── Hades Runtime (custom)
        ├── Isolation backends (pluggable: gVisor / custom hypervisor / runc)
        ├── catatonit (PID 1, reaps zombies)
        ├── xai-hades-styx (statically linked Rust, exec/timeout/OOM/session)
        ├── grok-computer-server.mjs (Node.js control plane on 127.0.0.1:4242)
        └── Ubuntu 24.04 userland + grok-files FUSE (remote workdir, JWT auth, virtually infinite capacity)
              └── erofs + OverlayFS (/.hades-container-tools read-only compressed, root is OverlayFS)
```

The online instance currently uses a [KVM](https://www.linux-kvm.org/) lightweight VM managed by `xai-hades-charon`, evidenced by `Hypervisor detected: KVM`, `hvc0`, `vsock`, `/dev/vda` Virtio devices, and multi-backend error codes like `HADES_CLHV_BOOT_TIMEOUT` / `HADES_RUNSC_START_TIMED_OUT`. The workdir `/home/workdir/artifacts` is not a local disk but a `grok-files` remote filesystem mounted via [FUSE](https://github.com/libfuse/libfuse) with `TERMINAL_JWT_VAL` and gRPC.

Three takeaways: make isolation backends pluggable; separate control plane from execution plane (Node.js for tool calls, Rust for resources); remote the filesystem so destroying a sandbox does not lose artifacts. This is exactly the "prepare environment vs. use environment" split the previous section emphasized.

## How to choose: decision tree and cost

Use trust boundary and workload traits for the first cut. Comparing feature lists first is less effective.

**Three initial questions**:

1. How untrusted is the code? (your own tooling vs. user-uploaded or model-generated)
2. Multi-tenant on shared hardware?
3. Need long-lived state or GPU?

```
Highly untrusted multi-tenant arbitrary code ──→ Firecracker / Kata / Lambda MicroVMs / E2B
        │
        ├── Already on Kubernetes, want to keep the ecosystem ──→ Kata + Firecracker or gVisor RuntimeClass
        │
        └── Speed and self-host flexibility first ──→ start with gVisor (runsc), upgrade to microVM when needed

Local dev machine agent ──→ sandbox-runtime / nsjail / bubblewrap / Docker SBX
Managed cloud, less ops ──→ E2B / Daytona / Modal / Cloudflare / Lambda MicroVMs (pick by GPU/state/ecosystem)
```

**Costs are two ledgers**:

| Cost | Docker + gVisor | Firecracker / microVM |
|---|---|---|
| Machine resources | ~50–100 MB extra per container, medium density | ~5 MB per microVM baseline, potentially higher density |
| Ops and engineering | Swap runtime, ecosystem ready | Own networking, images, snapshots, scheduling; harder to debug |
| Managed cloud | [GKE Sandbox](https://cloud.google.com/kubernetes-engine/docs/concepts/sandbox-pods) integrates easily | [Lambda MicroVMs](https://aws.amazon.com/lambda/pricing/) pay-per-use; short tasks can be cheaper |

In short: machine bills may not differ much; the difference is the human cost of running the system stably. That is why the notes conclude "start with Docker + gVisor at small scale, invest in microVM when you hit compatibility or isolation ceilings."

### Residual risks even when separated from the main service

Separation is necessary but not sufficient. Still required:

- **Sandbox escape**: any software can have vulnerabilities; gVisor raises the bar but is not theoretically impossible to escape
- **Resource exhaustion**: CPU/memory/disk/network exhaustion that slows other workloads on the same node
- **Lateral movement and credential leakage**: if the sandbox can read [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/), [ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/), or cloud [IAM](https://aws.amazon.com/iam/) roles, leakage is still possible
- **Egress abuse**: a sandbox with free egress can be used for mining, external attacks, or data exfiltration; capabilities like [webfetch](https://modelcontextprotocol.io/) amplify this—require proxy, allowlists, rate limits, and full logging

Mitigations: default-deny [NetworkPolicy](https://kubernetes.io/docs/concepts/services-networking/network-policies/), per-sandbox [ServiceAccount](https://kubernetes.io/docs/concepts/security/service-accounts/) with least-privilege IAM, enforced resource limits, deny privileged and hostPath, mandatory egress proxy, runtime protection (e.g., [Falco](https://falco.org/)), and destroy-when-done.

## Overall architecture

```
                Trust boundary and cost increase left → right
  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────┐
  │  Regular │→ │  gVisor  │→ │   microVM    │→ │   Managed    │
  │ container│  │  runsc   │  │ Firecracker  │  │ E2B/Daytona  │
  │ Namespace│  │ Sentry   │  │ Kata/CLH     │  │ Modal/Vercel │
  │ cgroups  │  │ Gofer    │  │ (KVM)        │  │ Cloudflare/  │
  │ seccomp  │  │          │  │              │  │ Lambda µVMs  │
  └──────────┘  └──────────┘  └──────────────┘  └──────────────┘
         ↑             ↑              ↑                ↑
    Local dev    Hardened      Self-built        Low-ops
                 cluster      strong isolation   productized
         └─────────────┴──────────────┴────────────────┘
                    Upper layer: sandbox-runtime / nsjail / bubblewrap
                    (boundary around any process, no image needed)
```

Local OS sandboxes answer "how big is the blast radius," cloud microVMs and managed sandboxes answer "how to move untrusted execution off your host." They are not either/or but [defence in depth](https://csrc.nist.gov/glossary/term/defense_in_depth): even inside a [Cloudflare Sandbox](https://developers.cloudflare.com/sandbox/) or Lambda MicroVM, the in-container process still benefits from a second wall of seccomp / Landlock.

## Overall

A sandbox is not a "whether to do it" question but "at which layer, how tight, and who operates it." Container Namespace / cgroups / seccomp gets you started quickly, [gVisor](https://gvisor.dev/) trades minimal changes for a much stronger boundary, [Firecracker](https://github.com/firecracker-microvm/firecracker) and [Kata Containers](https://katacontainers.io/) trade hardware virtualization for the closest-to-VM guarantees, [Anthropic sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime) and [nsjail](https://github.com/google/nsjail) add "boundary around any process without a container," while [E2B](https://e2b.dev/), [Daytona](https://www.daytona.io/), [Modal](https://modal.com/), [Vercel Sandbox](https://vercel.com/docs/sandbox), [Cloudflare Sandboxes](https://developers.cloudflare.com/sandbox/), and [AWS Lambda MicroVMs](https://aws.amazon.com/lambda/lambda-microvms/) productize those primitives so teams do not need to become virtualization experts first.

If you want to act tonight, do three things: funnel all untrusted execution through a single entry point with no network by default, replace per-task credentials with short-lived revocable tokens injected via proxy, and enforce explicit resource limits and a destroy policy per sandbox. Isolation tiers can be upgraded gradually, but without these three, no layer can make up for it.

## References

- [Anthropic sandbox-runtime (GitHub)](https://github.com/anthropic-experimental/sandbox-runtime)
- [Anthropic sandbox-runtime (npm)](https://www.npmjs.com/package/@anthropic-ai/sandbox-runtime)
- [Claude Code — Sandbox environments](https://code.claude.com/docs/en/sandbox-environments)
- [Anthropic — Code execution tool (sandboxed containers)](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/code-execution-tool)
- [Claude Platform — Self-hosted sandboxes (AWS Lambda MicroVMs / E2B / Modal / Cloudflare)](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes)
- [gVisor Documentation](https://gvisor.dev/docs/)
- [Firecracker](https://github.com/firecracker-microvm/firecracker)
- [Kata Containers](https://katacontainers.io/)
- [Cloud Hypervisor](https://github.com/cloud-hypervisor/cloud-hypervisor)
- [nsjail](https://github.com/google/nsjail)
- [bubblewrap](https://github.com/containers/bubblewrap)
- [Docker — seccomp security profiles](https://docs.docker.com/engine/security/seccomp/)
- [Isolate — IOI sandbox](https://github.com/ioi/isolate)
- [Kubernetes — RuntimeClass](https://kubernetes.io/docs/concepts/containers/runtime-class/)
- [GKE Sandbox (gVisor)](https://cloud.google.com/kubernetes-engine/docs/concepts/sandbox-pods)
- [E2B Documentation](https://e2b.dev/docs)
- [E2B — Sandbox persistence](https://e2b.dev/docs/sandbox/persistence)
- [E2B — Internet access](https://e2b.dev/docs/network/internet-access)
- [Daytona Documentation](https://www.daytona.io/docs)
- [Modal — Sandbox guide](https://modal.com/docs/guide/sandbox)
- [Vercel Sandbox](https://vercel.com/docs/sandbox)
- [Cloudflare Sandbox SDK](https://developers.cloudflare.com/sandbox/)
- [Cloudflare Sandbox — Security](https://developers.cloudflare.com/sandbox/concepts/security/)
- [AWS — Introducing Lambda MicroVMs](https://aws.amazon.com/about-aws/whats-new/2026/06/aws-lambda-microvms/)
- [AWS — Run isolated sandboxes with full lifecycle control: Lambda introduces MicroVMs](https://aws.amazon.com/blogs/aws/run-isolated-sandboxes-with-full-lifecycle-control-aws-lambda-introduces-microvms)
- [AWS Lambda MicroVMs — Product page](https://aws.amazon.com/lambda/lambda-microvms/)
- [Firecracker — firecracker-microvm.io](https://firecracker-microvm.github.io/)
- [Falco — Runtime security](https://falco.org/)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)
- [E2B Agent Sandbox: Confining Model-Generated Code in Restorable microVMs](/en/posts/ai/2026-08-22-e2b-agent-sandbox-en)
- [AI Agent Sandbox Escape and Permission Boundaries: Containers Are Not the Whole Security Boundary](/en/posts/tech/2026-08-22-agent-sandbox-permission-boundaries-en)
- [Learning from Mature Coding Agents (11): Sandboxes and Remote Execution — Cloudflare Sandbox in Practice](/en/posts/ai/2026-08-25-coding-agent-sandbox-remote-execution-en)
