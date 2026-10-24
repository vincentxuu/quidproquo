---
title: "Containers, gVisor, and microVMs: Who Shares the Kernel, the System Calls, and the Hardware"
date: 2026-10-24
type: deep-dive
category: ai
tags: [ai-agent, sandbox, ai-security, microvm, isolation]
lang: en
description: "Compares containers, gVisor, and microVMs (Kata, Firecracker) by which kernel each puts between an agent's code and the host, and what hardware and storage state all three still share."
tldr: "Containers share the host kernel, gVisor inserts a user-space kernel, and a microVM adds a guest kernel plus a hypervisor; all three still share the same host's CPU caches and storage."
difficulty: 進階
draft: true
series:
  name: "Agent Isolation Boundaries"
  order: 1
---

> 🌏 [中文版](/posts/ai/2026-10-24-agent-isolation-container-gvisor-microvm)

Agent sandboxes usually take one of three forms: a plain container, [gVisor](https://gvisor.dev/), or a microVM (Kata Containers, Firecracker, and the like). All of them are called "isolation," but they separate things at different points. This post answers two questions: how many kernel boundaries does an agent's code have to cross to reach the host, and what do all three still share after it does?

It reads better after [Where an Agent's Code Runs](/posts/ai/2026-10-24-agent-isolation-overview-en); this post covers its L1 container and L2 kernel boundary. Afterwards you should be able to tell, for a vulnerability advisory or an attack, which boundary it broke and how many are left before the host.

## Containers: process isolation, shared kernel

Containers rely on Linux namespaces and cgroups. Docker's [security documentation](https://docs.docker.com/engine/security/) says namespaces keep processes in a container from seeing, and even less affecting, processes in other containers or on the host, and cgroups cap resources, mainly to stop resource-exhaustion attacks.

One Linux kernel enforces all of this, and the program in the container can issue system calls to that kernel directly. gVisor's [security introduction](https://gvisor.dev/docs/architecture_guide/intro/) is blunt about it: seccomp, namespaces, AppArmor and similar mechanisms shrink the attack surface, but the workload is "only one system call away from host compromise." Seccomp filters also have to be tuned per workload, and a program that needs a broad call such as `ioctl` or `io_uring` can make a safe filter very hard or impossible to write.

So a container's boundary sits at the system-call interface: if the host kernel has an exploitable bug there, the program gets to the host in one step.

## gVisor: a user-space kernel in the middle

gVisor acts as the kernel itself. Per its documentation, the Sentry is a from-scratch Go reimplementation of Linux system calls, memory management, filesystems, the network stack, and more, and it "never passes through any system call to the host." A kernel feature gVisor has not reimplemented simply is not available to the sandboxed program. The Sentry itself makes only limited system calls to the host and is wrapped in seccomp, namespaces, and similar mechanisms; file operations that need more privilege go to the Gofer, a slightly more trusted companion process.

gVisor's [security model](https://gvisor.dev/docs/architecture_guide/security/) places this next to virtual machines: in both, the application faces a stand-in interface, and the stand-in calls the host. The documentation's claim is that breaking out of gVisor requires exploiting the Sentry and the host kernel together, which share no code.

## microVMs: another kernel, then a hypervisor

A microVM boots a lightweight virtual machine. In Kata Containers' [architecture document](https://github.com/kata-containers/kata-containers/blob/main/docs/design/architecture/README.md), the runtime launches a hypervisor, which boots a VM from a dedicated guest kernel and image, and the container runs inside the VM. There is still a container inside the VM, to separate the workload from the VM environment itself.

Firecracker's [design document](https://github.com/firecracker-microvm/firecracker/blob/main/docs/design.md) starts from the threat model: each Firecracker process wraps exactly one microVM, every vCPU thread is treated as running malicious code from the moment it starts, and trust zones nest from the least trusted (vCPU threads) to the most trusted (the host), with seccomp and a jailer around the outside. By gVisor's description of virtual machines, the only way out of a VM is a VM exit, handled by the hypervisor.

## Side by side: how many to cross, what is shared

```diagram
title: Stacks of the three isolation approaches and the shared hardware
desc: A container's program faces the host kernel directly; gVisor adds a user-space kernel in between; a microVM adds a guest kernel and a hypervisor. All three sit on the same host hardware and caches.
caption: Simplified. gVisor also has a Gofer process and several platforms, and a microVM's VMM runs as a host process; both are omitted.
---
<svg viewBox="0 0 640 332">
  <text class="dg-label" x="112" y="26" text-anchor="middle" dominant-baseline="central">Container</text>
  <text class="dg-label" x="320" y="26" text-anchor="middle" dominant-baseline="central">gVisor</text>
  <text class="dg-label" x="528" y="26" text-anchor="middle" dominant-baseline="central">microVM</text>

  <rect class="dg-box" x="20" y="48" width="184" height="52" rx="6"/>
  <text class="dg-label" x="112" y="68" text-anchor="middle" dominant-baseline="central">Program in container</text>
  <text class="dg-sub" x="112" y="88" text-anchor="middle" dominant-baseline="central">the agent's code</text>
  <rect class="dg-box" x="228" y="48" width="184" height="52" rx="6"/>
  <text class="dg-label" x="320" y="68" text-anchor="middle" dominant-baseline="central">Program in container</text>
  <text class="dg-sub" x="320" y="88" text-anchor="middle" dominant-baseline="central">the agent's code</text>
  <rect class="dg-box" x="436" y="48" width="184" height="52" rx="6"/>
  <text class="dg-label" x="528" y="68" text-anchor="middle" dominant-baseline="central">Program in container</text>
  <text class="dg-sub" x="528" y="88" text-anchor="middle" dominant-baseline="central">the agent's code</text>

  <rect class="dg-box dg-box--store" x="20" y="112" width="184" height="52" rx="6"/>
  <text class="dg-label" x="112" y="132" text-anchor="middle" dominant-baseline="central">Host Linux kernel</text>
  <text class="dg-sub" x="112" y="152" text-anchor="middle" dominant-baseline="central">shared with other containers</text>
  <rect class="dg-box" x="228" y="112" width="184" height="52" rx="6"/>
  <text class="dg-label" x="320" y="132" text-anchor="middle" dominant-baseline="central">gVisor Sentry</text>
  <text class="dg-sub" x="320" y="152" text-anchor="middle" dominant-baseline="central">user-space kernel</text>
  <rect class="dg-box" x="436" y="112" width="184" height="52" rx="6"/>
  <text class="dg-label" x="528" y="132" text-anchor="middle" dominant-baseline="central">Guest Linux kernel</text>
  <text class="dg-sub" x="528" y="152" text-anchor="middle" dominant-baseline="central">one per VM</text>

  <rect class="dg-box dg-box--ghost" x="20" y="176" width="184" height="52" rx="6"/>
  <text class="dg-sub" x="112" y="202" text-anchor="middle" dominant-baseline="central">no second boundary</text>
  <rect class="dg-box dg-box--store" x="228" y="176" width="184" height="52" rx="6"/>
  <text class="dg-label" x="320" y="196" text-anchor="middle" dominant-baseline="central">Host Linux kernel</text>
  <text class="dg-sub" x="320" y="216" text-anchor="middle" dominant-baseline="central">limited calls only</text>
  <rect class="dg-box dg-box--store" x="436" y="176" width="184" height="52" rx="6"/>
  <text class="dg-label" x="528" y="196" text-anchor="middle" dominant-baseline="central">Hypervisor + host kernel</text>
  <text class="dg-sub" x="528" y="216" text-anchor="middle" dominant-baseline="central">reachable via VM exit</text>

  <rect class="dg-box dg-box--accent" x="20" y="248" width="600" height="60" rx="6"/>
  <text class="dg-label" x="320" y="270" text-anchor="middle" dominant-baseline="central">One host's CPU caches, memory, and storage</text>
  <text class="dg-sub" x="320" y="292" text-anchor="middle" dominant-baseline="central">shared by all three</text>
</svg>
```

| | Container | gVisor | microVM |
|---|---|---|---|
| Kernel the program faces directly | Host kernel | Sentry | Guest kernel |
| Still to cross before the host kernel | Nothing | The Sentry's limited calls | Hypervisor and device emulation |
| CPU cache shared with same-host sandboxes | Yes | Yes | Yes |

One example shows what "which boundary was broken" means. Kata's security advisory [GHSA-wwj6-vghv-5p64 (CVE-2026-24834)](https://github.com/kata-containers/kata-containers/security/advisories/GHSA-wwj6-vghv-5p64) describes a case with Cloud Hypervisor where a user in the container with `CAP_MKNOD` can rewrite the guest VM's root filesystem and end up root inside the VM. The advisory summary says "in my current understanding" the host and other containers or VMs on it are not affected, and its Impact line reads container to guest microVM escape, no escape to the host, no persistence of the overwritten image; the reporter adds that for arm64 with QEMU they did not verify whether a guest write could reach the image file. In this post's terms (our classification, not the advisory's wording): L1 broke, and in this case L2 held. OpenAI's October 23 article lists this CVE among the fixes it contributed back to Kata.

## What all three still share

"Did not reach the host" does not mean "has nothing to do with the sandbox next door." Sandboxes on one host share CPU caches, memory bandwidth, and the host operating system's page cache.

A July 2026 preprint, [Isolation Failure From Shared Storage](https://arxiv.org/abs/2607.17518), measured this on Docker, gVisor, Kata (with QEMU, Cloud Hypervisor, and Firecracker), and QEMU/KVM. It reports two things: whenever the I/O path exposes shared, host-cacheable file objects (OverlayFS layers, virtio-fs, loop devices backed by files), page-cache timing differences are measurable between sandboxes; with direct I/O or a dedicated block device, the signal weakens substantially or disappears. The authors say their WordPress case study is not an end-to-end attack demonstration, and that virtualization mostly adds latency and noise without removing the dependence.

Firecracker's [production host setup guide](https://github.com/firecracker-microvm/firecracker/blob/main/docs/prod-host-setup.md) carries a related warning: heavy storage writes can fill the host page cache quickly and create a backlog that slows other guests' I/O, which you manage with the jailer's resource limits and rate limiting.

The next post starts here: how two programs with no connection between them can send data using nothing but this "it got slower" signal.

## How to choose

Answer three questions first; the answers decide whether to move toward microVMs and stricter tenant separation:

| Question | A container may be enough | Move toward microVM, one process per tenant |
|---|---|---|
| Who wrote the code? | You or your team | A model, or outside users |
| Who else is on the machine? | Only you | Other users' sandboxes |
| How is storage attached? | Doesn't matter | Whether cacheable host files are shared |

Firecracker's documentation strongly recommends that each Firecracker process correspond to a single tenant's workload; its unit is the process, not the whole host. Reserving the host for one tenant as well is more conservative than the documentation asks, and whether to go that far depends on your answers to the three questions above.

Something you can do tonight: run the following on a Linux host or VM and read what the kernel reports for each hardware vulnerability.

```bash
grep . /sys/devices/system/cpu/vulnerabilities/*
cat /sys/devices/system/cpu/smt/active
```

Each file reads `Not affected`, some `Mitigation`, or `Vulnerable`. Inside a virtual machine, some entries may say `SMT Host state unknown`; if you need to know the host's SMT (hyper-threading) state, ask the provider. Firecracker's documentation recommends disabling SMT in production deployments that need tenant separation.

## Limits

- This post compares the number and position of boundaries, not how many bugs each has, and it cannot rank which is "most secure": what you are defending against decides what to choose.
- gVisor has several execution platforms with different details; this post follows the documentation's general description.
- The preprint is a lab timing measurement; it does not mean a usable attack already exists on real agent platforms.

## References

- [Docker Engine security — Docker Docs](https://docs.docker.com/engine/security/)
- [Introduction to gVisor security — gVisor](https://gvisor.dev/docs/architecture_guide/intro/)
- [Security Model — gVisor](https://gvisor.dev/docs/architecture_guide/security/)
- [Kata Containers Architecture](https://github.com/kata-containers/kata-containers/blob/main/docs/design/architecture/README.md)
- [Firecracker Design](https://github.com/firecracker-microvm/firecracker/blob/main/docs/design.md)
- [Production Host Setup Recommendations — Firecracker](https://github.com/firecracker-microvm/firecracker/blob/main/docs/prod-host-setup.md)
- [Kata Container to Guest micro VM privilege escalation (GHSA-wwj6-vghv-5p64)](https://github.com/kata-containers/kata-containers/security/advisories/GHSA-wwj6-vghv-5p64)
- [Isolation Failure From Shared Storage (arXiv:2607.17518)](https://arxiv.org/abs/2607.17518)
- [Securing our frontier model training environment — OpenAI](https://openai.com/index/securing-our-frontier-model-training-environment/)
- [Where an Agent's Code Runs — this site](/posts/ai/2026-10-24-agent-isolation-overview-en)
